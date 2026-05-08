// useLeaderboard.js — thin hook over leaderboardStore
import useLeaderboardStore from '../store/leaderboardStore';

const useLeaderboard = () => {
  const players   = useLeaderboardStore(s => s.players);
  const isLoading = useLeaderboardStore(s => s.isLoading);
  const error     = useLeaderboardStore(s => s.error);
  const fetchAll  = useLeaderboardStore(s => s.fetchAll);

  return { players, isLoading, error, fetchAll };
};

export default useLeaderboard;
