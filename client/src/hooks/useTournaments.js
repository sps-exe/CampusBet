// useTournaments.js — thin hook over tournamentStore
// Mirrors the same pattern as useLobbies for consistency.
import { useEffect } from 'react';
import useTournamentStore from '../store/tournamentStore';

const useTournaments = (autoFetch = true) => {
  const tournaments         = useTournamentStore(s => s.tournaments);
  const currentTournament   = useTournamentStore(s => s.currentTournament);
  const filters             = useTournamentStore(s => s.filters);
  const isLoading           = useTournamentStore(s => s.isLoading);
  const error               = useTournamentStore(s => s.error);
  const fetchTournaments    = useTournamentStore(s => s.fetchTournaments);
  const fetchTournamentById = useTournamentStore(s => s.fetchTournamentById);
  const setFilters          = useTournamentStore(s => s.setFilters);
  const createTournament    = useTournamentStore(s => s.createTournament);
  const registerForTournament = useTournamentStore(s => s.registerForTournament);

  useEffect(() => {
    if (autoFetch) fetchTournaments();
  }, [autoFetch, fetchTournaments]);

  return {
    tournaments,
    currentTournament,
    filters,
    isLoading,
    error,
    fetchTournaments,
    fetchTournamentById,
    setFilters,
    createTournament,
    registerForTournament,
  };
};

export default useTournaments;
