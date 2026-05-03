import { useEffect } from 'react';
import useLobbyStore from '../store/lobbyStore';

const useLobbies = (autoFetch = true) => {
  const lobbies = useLobbyStore((s) => s.lobbies);
  const currentLobby = useLobbyStore((s) => s.currentLobby);
  const filters = useLobbyStore((s) => s.filters);
  const isLoading = useLobbyStore((s) => s.isLoading);
  const error = useLobbyStore((s) => s.error);
  const fetchLobbies = useLobbyStore((s) => s.fetchLobbies);
  const fetchLobbyById = useLobbyStore((s) => s.fetchLobbyById);
  const setFilters = useLobbyStore((s) => s.setFilters);
  const createLobby = useLobbyStore((s) => s.createLobby);
  const joinLobby = useLobbyStore((s) => s.joinLobby);
  const submitResult = useLobbyStore((s) => s.submitResult);

  useEffect(() => {
    if (autoFetch) fetchLobbies();
  }, [filters]); // re-fetch when filters change

  return {
    lobbies,
    currentLobby,
    filters,
    isLoading,
    error,
    fetchLobbies,
    fetchLobbyById,
    setFilters,
    createLobby,
    joinLobby,
    submitResult,
  };
};

export default useLobbies;
