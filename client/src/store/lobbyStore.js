// Lobby store — handles all lobby data fetching and mutations using Zustand + Supabase.
// Components never call supabase directly for lobbies; they go through this store.
import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import useAuthStore from './authStore';

// Converts a raw Supabase lobby row into the shape the UI expects
const mapLobby = (dbLobby) => {
  if (!dbLobby) return null;
  return {
    _id: dbLobby.id,
    title: dbLobby.title,
    game: dbLobby.game,
    hostId: dbLobby.host_id,
    host: dbLobby.host || null,
    hostName: dbLobby.host?.name || 'Unknown Host',
    college: dbLobby.host?.college || 'Unknown College',
    bidAmount: dbLobby.bid_amount,
    maxPlayers: dbLobby.max_players,
    status: dbLobby.status,
    createdAt: dbLobby.created_at,
    scheduledAt: dbLobby.scheduled_at,
    description: dbLobby.description,
    // Array of user IDs currently in the lobby
    currentPlayers: dbLobby.lobby_players ? dbLobby.lobby_players.map((p) => p.user_id) : [],
    // Raw lobby_players with nested profile data — used in LobbyDetail to show real names
    lobby_players: dbLobby.lobby_players || [],
    winnerId: dbLobby.winner_id,
  };
};

const useLobbyStore = create((set, get) => ({
  lobbies: [],
  currentLobby: null,
  filters: { game: '', status: '', search: '' },
  isLoading: false,
  error: null,

  setFilters: (filters) => set((s) => ({ filters: { ...s.filters, ...filters } })),

  // Fetch all lobbies, applying any active filters (game, status, search text)
  fetchLobbies: async () => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = get();
      let query = supabase
        .from('lobbies')
        .select(`
          *,
          host:profiles!lobbies_host_id_fkey(id, name, avatar_url, college),
          lobby_players(user_id, status)
        `)
        .order('created_at', { ascending: false });

      if (filters.game)   query = query.eq('game', filters.game);
      if (filters.status) query = query.eq('status', filters.status);
      if (filters.search) query = query.ilike('title', `%${filters.search}%`);

      const { data, error } = await query;
      if (error) throw error;
      set({ lobbies: data.map(mapLobby) });
    } catch (err) {
      console.error(err);
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch a single lobby by ID — includes player profiles for the detail page
  fetchLobbyById: async (id) => {
    set({ isLoading: true, currentLobby: null, error: null });
    try {
      const { data, error } = await supabase
        .from('lobbies')
        .select(`
          *,
          host:profiles!lobbies_host_id_fkey(id, name, avatar_url, college),
          lobby_players(user_id, status, profiles(name, avatar_url))
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      set({ currentLobby: mapLobby(data) });
    } catch (err) {
      console.error(err);
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Create a new lobby and auto-add the host as the first player
  createLobby: async (formData) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('You must be logged in to create a lobby');

      const { data, error } = await supabase
        .from('lobbies')
        .insert({
          title: formData.title,
          game: formData.game,
          bid_amount: parseInt(formData.bidAmount) || 0,
          max_players: parseInt(formData.maxPlayers) || 2,
          host_id: session.user.id,
          scheduled_at: formData.scheduledAt || null,
          description: formData.description?.trim() || null,
          status: 'open',
        })
        .select(`
          *,
          host:profiles!lobbies_host_id_fkey(id, name, avatar_url, college),
          lobby_players(user_id, status)
        `)
        .single();

      if (error) throw error;

      // Add the host as the first player in the lobby
      await supabase.from('lobby_players').insert({
        lobby_id: data.id,
        user_id: session.user.id,
        status: 'ready',
      });

      toast.success('Lobby created! 🎮');
      get().fetchLobbies();
      return { success: true, data: mapLobby(data) };
    } catch (err) {
      toast.error(err.message);
      return { success: false, message: err.message };
    }
  },

  // Join an existing lobby — 23505 means the user is already in it
  joinLobby: async (lobbyId) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('You must be logged in to join');

      const { data: lobby, error: lobbyError } = await supabase
        .from('lobbies')
        .select('id, status, max_players, lobby_players(user_id)')
        .eq('id', lobbyId)
        .single();

      if (lobbyError) throw lobbyError;
      if (lobby.status !== 'open') throw new Error('This lobby is no longer open');

      const currentPlayers = lobby.lobby_players?.map((player) => player.user_id) || [];
      if (currentPlayers.includes(session.user.id)) {
        throw new Error('You are already in this lobby!');
      }
      if (currentPlayers.length >= lobby.max_players) {
        throw new Error('This lobby is already full');
      }

      const { error } = await supabase.from('lobby_players').insert({
        lobby_id: lobbyId,
        user_id: session.user.id,
        status: 'ready',
      });

      if (error) {
        if (error.code === '23505') throw new Error('You are already in this lobby!');
        throw error;
      }

      const nextPlayerCount = currentPlayers.length + 1;
      if (nextPlayerCount >= lobby.max_players) {
        const { error: statusError } = await supabase
          .from('lobbies')
          .update({ status: 'in-progress' })
          .eq('id', lobbyId);

        if (statusError) throw statusError;
      }

      toast.success('Joined lobby! Good luck ⚡');
      get().fetchLobbyById(lobbyId);
      return { success: true };
    } catch (err) {
      toast.error(err.message);
      return { success: false, message: err.message };
    }
  },

  // Mark a lobby as completed and record the winner
  submitResult: async (lobbyId, data) => {
    try {
      const { data: lobby, error: lobbyError } = await supabase
        .from('lobbies')
        .select('id, bid_amount, winner_id, lobby_players(user_id)')
        .eq('id', lobbyId)
        .single();

      if (lobbyError) throw lobbyError;

      const playerIds = lobby.lobby_players?.map((player) => player.user_id) || [];
      if (!playerIds.length) throw new Error('No players found for this lobby');

      const { error } = await supabase
        .from('lobbies')
        .update({ status: 'completed', winner_id: data.winnerId })
        .eq('id', lobbyId);

      if (error) throw error;

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, credits, matches_played, matches_won')
        .in('id', playerIds);

      if (profilesError) throw profilesError;

      const bidAmount = lobby.bid_amount || 0;
      const winnerId = data.winnerId;
      const winnerBonus = bidAmount * Math.max(playerIds.length - 1, 1);

      const updates = profiles.map((profile) => {
        const isWinner = profile.id === winnerId;
        return {
          id: profile.id,
          credits: (profile.credits || 0) + (isWinner ? winnerBonus : -bidAmount),
          matches_played: (profile.matches_played || 0) + 1,
          matches_won: (profile.matches_won || 0) + (isWinner ? 1 : 0),
        };
      });

      const { error: updateError } = await supabase.from('profiles').upsert(updates);
      if (updateError) throw updateError;

      await useAuthStore.getState().loadUser();

      toast.success('Result submitted!');
      get().fetchLobbyById(lobbyId);
      return { success: true };
    } catch (err) {
      toast.error(err.message);
      return { success: false, message: err.message };
    }
  },
  // Delete a lobby — only the host can do this.
  // We delete lobby_players first to satisfy the FK constraint, then the lobby.
  deleteLobby: async (lobbyId) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('You must be logged in');

      // Remove all players from the lobby first (FK constraint)
      await supabase.from('lobby_players').delete().eq('lobby_id', lobbyId);

      const { error } = await supabase
        .from('lobbies')
        .delete()
        .eq('id', lobbyId)
        .eq('host_id', session.user.id); // RLS: only host can delete

      if (error) throw error;

      toast.success('Lobby deleted.');
      get().fetchLobbies();
      return { success: true };
    } catch (err) {
      toast.error(err.message);
      return { success: false, message: err.message };
    }
  },
}));

export default useLobbyStore;
