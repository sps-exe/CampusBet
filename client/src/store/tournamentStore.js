import { create } from 'zustand';
import * as tournamentApi from '../api/tournamentApi';
import { MOCK_TOURNAMENTS } from '../utils/mockData';
import toast from 'react-hot-toast';

const USE_MOCK = true;

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
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 600));
        const { filters } = get();
        let filtered = [...MOCK_TOURNAMENTS];
        if (filters.game) filtered = filtered.filter((t) => t.game === filters.game);
        if (filters.status) filtered = filtered.filter((t) => t.status === filters.status);
        if (filters.search)
          filtered = filtered.filter((t) =>
            t.title.toLowerCase().includes(filters.search.toLowerCase())
          );
        set({ tournaments: filtered });
      } else {
        const { data } = await tournamentApi.getTournaments(get().filters);
        set({ tournaments: data.tournaments });
      }
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTournamentById: async (id) => {
    set({ isLoading: true, currentTournament: null });
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 400));
        const t = MOCK_TOURNAMENTS.find((t) => t._id === id) || null;
        set({ currentTournament: t });
      } else {
        const { data } = await tournamentApi.getTournamentById(id);
        set({ currentTournament: data });
      }
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  createTournament: async (formData) => {
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 800));
        const t = { _id: `t_${Date.now()}`, ...formData, status: 'upcoming', participants: [] };
        set((s) => ({ tournaments: [t, ...s.tournaments] }));
        toast.success('Tournament created! 🏆');
        return { success: true, data: t };
      }
      const { data } = await tournamentApi.createTournament(formData);
      set((s) => ({ tournaments: [data, ...s.tournaments] }));
      toast.success('Tournament created! 🏆');
      return { success: true, data };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  registerForTournament: async (id, userId) => {
    try {
      if (!USE_MOCK) await tournamentApi.registerForTournament(id);
      else await new Promise((r) => setTimeout(r, 500));
      set((s) => ({
        tournaments: s.tournaments.map((t) =>
          t._id === id ? { ...t, participants: [...t.participants, userId] } : t
        ),
        currentTournament: s.currentTournament?._id === id
          ? { ...s.currentTournament, participants: [...s.currentTournament.participants, userId] }
          : s.currentTournament,
      }));
      toast.success('Registered for tournament! 🏆');
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },
}));

export default useTournamentStore;
