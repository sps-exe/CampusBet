import { create } from 'zustand';
import * as lobbyApi from '../api/lobbyApi';
import { MOCK_LOBBIES } from '../utils/mockData';
import toast from 'react-hot-toast';

const USE_MOCK = true; // flip to false when backend is ready

const useLobbyStore = create((set, get) => ({
  lobbies: [],
  currentLobby: null,
  filters: { game: '', status: '', college: '', search: '' },
  isLoading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,

  setFilters: (filters) => set((s) => ({ filters: { ...s.filters, ...filters }, currentPage: 1 })),
  setPage: (page) => set({ currentPage: page }),

  // ─── Fetch all lobbies ──────────────────────────────────
  fetchLobbies: async () => {
    set({ isLoading: true, error: null });
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 600));
        const { filters } = get();
        let filtered = [...MOCK_LOBBIES];
        if (filters.game) filtered = filtered.filter((l) => l.game === filters.game);
        if (filters.status) filtered = filtered.filter((l) => l.status === filters.status);
        if (filters.search)
          filtered = filtered.filter((l) =>
            l.title.toLowerCase().includes(filters.search.toLowerCase())
          );
        set({ lobbies: filtered, totalPages: 1 });
      } else {
        const { filters, currentPage } = get();
        const { data } = await lobbyApi.getLobbies({ ...filters, page: currentPage });
        set({ lobbies: data.lobbies, totalPages: data.totalPages });
      }
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // ─── Fetch single lobby ─────────────────────────────────
  fetchLobbyById: async (id) => {
    set({ isLoading: true, currentLobby: null, error: null });
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 400));
        const lobby = MOCK_LOBBIES.find((l) => l._id === id) || null;
        set({ currentLobby: lobby });
        if (!lobby) set({ error: 'Lobby not found' });
      } else {
        const { data } = await lobbyApi.getLobbyById(id);
        set({ currentLobby: data });
      }
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // ─── Create lobby ───────────────────────────────────────
  createLobby: async (formData) => {
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 800));
        const newLobby = { _id: `l_${Date.now()}`, ...formData, status: 'open', currentPlayers: [] };
        set((s) => ({ lobbies: [newLobby, ...s.lobbies] }));
        toast.success('Lobby created! 🎮');
        return { success: true, data: newLobby };
      }
      const { data } = await lobbyApi.createLobby(formData);
      set((s) => ({ lobbies: [data, ...s.lobbies] }));
      toast.success('Lobby created! 🎮');
      return { success: true, data };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  // ─── Join lobby ─────────────────────────────────────────
  joinLobby: async (id, userId) => {
    try {
      if (!USE_MOCK) await lobbyApi.joinLobby(id);
      else await new Promise((r) => setTimeout(r, 400));
      set((s) => ({
        lobbies: s.lobbies.map((l) =>
          l._id === id ? { ...l, currentPlayers: [...l.currentPlayers, userId] } : l
        ),
        currentLobby: s.currentLobby?._id === id
          ? { ...s.currentLobby, currentPlayers: [...s.currentLobby.currentPlayers, userId] }
          : s.currentLobby,
      }));
      toast.success('Joined lobby! Good luck ⚡');
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  // ─── Submit result ──────────────────────────────────────
  submitResult: async (id, data) => {
    try {
      if (!USE_MOCK) await lobbyApi.submitResult(id, data);
      else await new Promise((r) => setTimeout(r, 600));
      set((s) => ({
        currentLobby: s.currentLobby?._id === id
          ? { ...s.currentLobby, status: 'completed', winnerId: data.winnerId }
          : s.currentLobby,
      }));
      toast.success('Result submitted!');
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },
}));

export default useLobbyStore;
