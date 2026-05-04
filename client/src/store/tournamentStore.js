import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const mapTournament = (dbTourney) => {
  if (!dbTourney) return null;
  return {
    _id: dbTourney.id,
    title: dbTourney.title,
    game: dbTourney.game,
    format: dbTourney.format,
    entryFee: dbTourney.entry_fee,
    prizePool: dbTourney.prize_pool,
    maxParticipants: dbTourney.max_participants,
    status: dbTourney.status,
    startDate: dbTourney.start_date,
    hostId: dbTourney.host_id,
    hostName: dbTourney.host?.name || 'Unknown Host',
    college: dbTourney.host?.college || 'Unknown College',
    participants: dbTourney.tournament_participants ? dbTourney.tournament_participants.map(p => p.user_id) : [],
    resolvedParticipants: dbTourney.tournament_participants ? dbTourney.tournament_participants.map(p => ({
      _id: p.user_id,
      name: p.profiles?.name || `Player ${p.user_id.substring(0, 4)}`,
      avatarUrl: p.profiles?.avatar_url,
      college: dbTourney.host?.college // fallback
    })) : []
  };
};

const useTournamentStore = create((set, get) => ({
  tournaments: [],
  currentTournament: null,
  filters: { game: '', status: '', search: '' },
  isLoading: false,
  error: null,

  setFilters: (filters) => set((s) => ({ filters: { ...s.filters, ...filters } })),

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
        .order('start_date', { ascending: true });

      if (filters.game) query = query.eq('game', filters.game);
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

  fetchTournamentById: async (id) => {
    set({ isLoading: true, currentTournament: null });
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select(`
          *,
          host:profiles!tournaments_host_id_fkey(id, name, avatar_url, college),
          tournament_participants(user_id, profiles(name, avatar_url))
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

  createTournament: async (formData) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('You must be logged in to host a tournament');

      const newTournamentData = {
        title: formData.title,
        game: formData.game,
        format: formData.format || 'Single Elimination',
        entry_fee: parseInt(formData.entryFee) || 0,
        prize_pool: parseInt(formData.prizePool) || 0,
        max_participants: parseInt(formData.maxParticipants) || 16,
        start_date: new Date(formData.startDate).toISOString(),
        host_id: session.user.id,
        status: 'upcoming'
      };

      const { data, error } = await supabase
        .from('tournaments')
        .insert(newTournamentData)
        .select(`
          *,
          host:profiles!tournaments_host_id_fkey(id, name, avatar_url, college),
          tournament_participants(user_id)
        `)
        .single();

      if (error) throw error;

      toast.success('Tournament created! 🏆');
      get().fetchTournaments(); // refresh list
      return { success: true, data: mapTournament(data) };
    } catch (err) {
      toast.error(err.message);
      return { success: false, message: err.message };
    }
  },

  registerForTournament: async (tournamentId) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('You must be logged in to register');

      const { error } = await supabase
        .from('tournament_participants')
        .insert({
          tournament_id: tournamentId,
          user_id: session.user.id
        });

      if (error) {
        if (error.code === '23505') throw new Error('You are already registered!');
        throw error;
      }

      toast.success('Registered for tournament! 🏆');
      get().fetchTournamentById(tournamentId); // refresh details
      return { success: true };
    } catch (err) {
      toast.error(err.message);
      return { success: false, message: err.message };
    }
  }
}));

export default useTournamentStore;
