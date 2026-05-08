// Tournament store — handles all tournament data fetching and mutations via Supabase.
import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

// Converts a raw Supabase tournament row into the shape the UI expects
const mapTournament = (dbTourney) => {
  if (!dbTourney) return null;
  return {
    _id: dbTourney.id,
    title: dbTourney.title,
    game: dbTourney.game,
    format: dbTourney.format,
    entryCredits: dbTourney.entry_fee,   // used by TournamentDetail & TournamentCard
    entryFee: dbTourney.entry_fee,       // alias kept for backwards compat
    prizePool: dbTourney.prize_pool,
    maxParticipants: dbTourney.max_participants,
    status: dbTourney.status,
    startDate: dbTourney.start_date,
    endDate: dbTourney.end_date || dbTourney.start_date,
    rules: dbTourney.rules,
    hostId: dbTourney.host_id,
    host: dbTourney.host || null,
    hostName: dbTourney.host?.name || 'Unknown Host',
    college: dbTourney.host?.college || 'Unknown College',
    // Simple array of user IDs for quick membership checks
    participants: dbTourney.tournament_participants
      ? dbTourney.tournament_participants.map((p) => p.user_id)
      : [],
    // Full participant objects with names, used by ParticipantList
    resolvedParticipants: dbTourney.tournament_participants
      ? dbTourney.tournament_participants.map((p) => ({
          _id: p.user_id,
          name: p.profiles?.name || `Player ${p.user_id.substring(0, 4)}`,
          avatarUrl: p.profiles?.avatar_url,
          college: p.profiles?.college || dbTourney.host?.college,
        }))
      : [],
  };
};

const useTournamentStore = create((set, get) => ({
  tournaments: [],
  currentTournament: null,
  filters: { game: '', status: '', search: '' },
  isLoading: false,
  error: null,

  setFilters: (filters) => set((s) => ({ filters: { ...s.filters, ...filters } })),

  // Fetch all tournaments, applying any active filters
  fetchTournaments: async () => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = get();
      let query = supabase
        .from('tournaments')
        .select(`
          *,
          host:profiles!tournaments_host_id_fkey(id, name, avatar_url, college),
          tournament_participants(user_id)
        `)
        // Exclude garbage/test entries: real tournaments always have capacity > 0
        .gt('max_participants', 0)
        .order('start_date', { ascending: true });

      if (filters.game)   query = query.eq('game', filters.game);
      if (filters.status) query = query.eq('status', filters.status);
      if (filters.search) query = query.ilike('title', `%${filters.search}%`);

      const { data, error } = await query;
      if (error) throw error;
      set({ tournaments: data.map(mapTournament) });
    } catch (err) {
      console.error(err);
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch a single tournament with full participant profile data
  fetchTournamentById: async (id) => {
    set({ isLoading: true, currentTournament: null });
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select(`
          *,
          host:profiles!tournaments_host_id_fkey(id, name, avatar_url, college),
          tournament_participants(user_id, profiles(name, avatar_url, college))
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      set({ currentTournament: mapTournament(data) });
    } catch (err) {
      console.error(err);
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Create a new tournament and refresh the list
  createTournament: async (formData) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('You must be logged in to host a tournament');

      const prizePoolAmt = parseInt(formData.prizePool) || 0;

      // Check if user has enough credits to fund the prize pool
      if (prizePoolAmt > 0) {
        const { data: profile } = await supabase.from('profiles').select('credits').eq('id', session.user.id).single();
        if (!profile || profile.credits < prizePoolAmt) {
          throw new Error('Insufficient credits to fund the prize pool');
        }
      }

      const { data, error } = await supabase
        .from('tournaments')
        .insert({
          title: formData.title,
          game: formData.game,
          format: formData.format || 'Single Elimination',
          entry_fee: parseInt(formData.entryFee) || 0,
          prize_pool: prizePoolAmt,
          max_participants: parseInt(formData.maxParticipants) || 16,
          start_date: new Date(formData.startDate).toISOString(),
          host_id: session.user.id,
          status: 'upcoming',
        })
        .select(`
          *,
          host:profiles!tournaments_host_id_fkey(id, name, avatar_url, college),
          tournament_participants(user_id)
        `)
        .single();

      if (error) throw error;

      // Deduct prize pool from the host's profile credits if prizePool > 0
      if (prizePoolAmt > 0) {
        const { data: profile } = await supabase.from('profiles').select('credits').eq('id', session.user.id).single();
        if (profile) {
          await supabase.from('profiles').update({ credits: profile.credits - prizePoolAmt }).eq('id', session.user.id);
        }
      }

      toast.success('Tournament created! 🏆');
      get().fetchTournaments();
      return { success: true, data: mapTournament(data) };
    } catch (err) {
      toast.error(err.message);
      return { success: false, message: err.message };
    }
  },

  // Register the current user for a tournament — 23505 means already registered
  registerForTournament: async (tournamentId) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('You must be logged in to register');

      const { data: tournament, error: tournamentError } = await supabase
        .from('tournaments')
        .select('id, status, max_participants, tournament_participants(user_id)')
        .eq('id', tournamentId)
        .single();

      if (tournamentError) throw tournamentError;
      if (tournament.status !== 'upcoming') {
        throw new Error('Registration is closed for this tournament');
      }

      const participants = tournament.tournament_participants?.map((player) => player.user_id) || [];
      if (participants.includes(session.user.id)) {
        throw new Error('You are already registered!');
      }
      if (participants.length >= tournament.max_participants) {
        throw new Error('This tournament is already full');
      }

      const { error } = await supabase.from('tournament_participants').insert({
        tournament_id: tournamentId,
        user_id: session.user.id,
      });

      if (error) {
        if (error.code === '23505') throw new Error('You are already registered!');
        throw error;
      }

      toast.success('Registered for tournament! 🏆');
      get().fetchTournamentById(tournamentId);
      return { success: true };
    } catch (err) {
      toast.error(err.message);
      return { success: false, message: err.message };
    }
  },
}));

export default useTournamentStore;
