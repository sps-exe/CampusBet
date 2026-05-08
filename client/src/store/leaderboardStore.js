// leaderboardStore.js — Zustand store for leaderboard data.
// Fetches from the `profiles` table ordered by matches won.
import { create } from 'zustand';
import { supabase } from '../lib/supabase';

const useLeaderboardStore = create((set) => ({
  players: [],
  isLoading: false,
  error: null,

  /** Fetch all players sorted by matches won (desc) */
  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, college, credits, matches_played, matches_won')
        .order('matches_won', { ascending: false })
        .limit(50);

      if (error) throw error;

      const players = (data || []).map((p) => ({
        _id:            p.id,
        name:           p.name     || 'Unknown Player',
        college:        p.college  || '—',
        credits:        p.credits  || 0,
        matchesPlayed:  p.matches_played || 0,
        matchesWon:     p.matches_won    || 0,
      }));

      set({ players, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },
}));

export default useLeaderboardStore;
