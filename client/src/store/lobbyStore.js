import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const mapLobby = (dbLobby) => {
  if (!dbLobby) return null;
  return {
    _id: dbLobby.id,
    title: dbLobby.title,
    game: dbLobby.game,
    hostId: dbLobby.host_id,
    hostName: dbLobby.host?.name || 'Unknown Host',
    college: dbLobby.host?.college || 'Unknown College',
    bidAmount: dbLobby.bid_amount,
    maxPlayers: dbLobby.max_players,
    status: dbLobby.status,
    createdAt: dbLobby.created_at,
    currentPlayers: dbLobby.lobby_players ? dbLobby.lobby_players.map(p => p.user_id) : [],
    winnerId: dbLobby.winner_id
  };
};

const useLobbyStore = create((set, get) => ({
  lobbies: [],
  currentLobby: null,
  filters: { game: '', status: '', search: '' },
  isLoading: false,
  error: null,

  setFilters: (filters) => set((s) => ({ filters: { ...s.filters, ...filters } })),

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

      if (filters.game) query = query.eq('game', filters.game);
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

  createLobby: async (formData) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('You must be logged in to create a lobby');

      const newLobbyData = {
        title: formData.title,
        game: formData.game,
        bid_amount: parseInt(formData.bidAmount) || 0,
        max_players: parseInt(formData.maxPlayers) || 2,
        host_id: session.user.id,
        status: 'open'
      };

      const { data, error } = await supabase
        .from('lobbies')
        .insert(newLobbyData)
        .select(`
          *,
          host:profiles!lobbies_host_id_fkey(id, name, avatar_url, college),
          lobby_players(user_id, status)
        `)
        .single();

      if (error) throw error;

      await supabase.from('lobby_players').insert({
        lobby_id: data.id,
        user_id: session.user.id,
        status: 'ready'
      });

      toast.success('Lobby created! 🎮');
      get().fetchLobbies();
      return { success: true, data: mapLobby(data) };
    } catch (err) {
      toast.error(err.message);
      return { success: false, message: err.message };
    }
  },

  joinLobby: async (lobbyId) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('You must be logged in to join');

      const { error } = await supabase
        .from('lobby_players')
        .insert({
          lobby_id: lobbyId,
          user_id: session.user.id,
          status: 'ready'
        });

      if (error) {
        if (error.code === '23505') throw new Error('You are already in this lobby!');
        throw error;
      }

      toast.success('Joined lobby! Good luck ⚡');
      get().fetchLobbyById(lobbyId);
      return { success: true };
    } catch (err) {
      toast.error(err.message);
      return { success: false, message: err.message };
    }
  },

  submitResult: async (lobbyId, data) => {
    try {
       const { error } = await supabase
         .from('lobbies')
         .update({ status: 'completed', winner_id: data.winnerId })
         .eq('id', lobbyId);

       if (error) throw error;
       toast.success('Result submitted!');
       get().fetchLobbyById(lobbyId);
       return { success: true };
    } catch (err) {
      toast.error(err.message);
      return { success: false, message: err.message };
    }
  }
}));

export default useLobbyStore;
