// useMyMatches — fetches the current user's completed match history from Supabase.
// Used by: Wallet (transaction list), Dashboard (activity feed), Profile (match history)
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import useAuth from './useAuth';

const useMyMatches = () => {
  const { user } = useAuth();
  const [matches, setMatches]     = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    const fetchMatches = async () => {
      if (!user?._id) {
        if (!isCancelled) {
          setMatches([]);
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      try {
        // Step 1: get all lobby IDs this user participated in
        const { data: lobbyPlayers, error: playerError } = await supabase
          .from('lobby_players')
          .select('lobby_id')
          .eq('user_id', user._id);

        if (playerError) throw playerError;
        if (!lobbyPlayers?.length) { setMatches([]); setIsLoading(false); return; }

        const lobbyIds = lobbyPlayers.map((p) => p.lobby_id);

        // Step 2: fetch only completed lobbies from that set, with opponent name
        const { data: completedLobbies, error: lobbiesError } = await supabase
          .from('lobbies')
          .select('id, title, game, bid_amount, winner_id, created_at, lobby_players(user_id, profiles(name, avatar_url))')
          .in('id', lobbyIds)
          .eq('status', 'completed')
          .order('created_at', { ascending: false });

        if (lobbiesError) throw lobbiesError;

        // Step 3: shape each lobby into a clean match object
        const mappedMatches = completedLobbies.map((lobby) => {
          const playerCount = lobby.lobby_players?.length || 2;
          const isWinner = lobby.winner_id === user._id;
          const opponents = lobby.lobby_players.filter((p) => p.user_id !== user._id);
          const primaryOpponent = opponents[0]?.profiles || { name: 'Unknown Opponent' };
          const opponentLabel = opponents.length > 1
            ? `${primaryOpponent.name} + ${opponents.length - 1} more`
            : primaryOpponent.name;

          return {
            _id: lobby.id,
            title: lobby.title || `${lobby.game} Match`, // MatchRow reads this
            game: lobby.game,
            opponent: { name: opponentLabel, avatarUrl: primaryOpponent.avatar_url },
            result: isWinner ? 'won' : 'lost',
            creditsChange: isWinner
              ? lobby.bid_amount * Math.max(playerCount - 1, 1)
              : -lobby.bid_amount,
            date: lobby.created_at,
          };
        });

        if (!isCancelled) setMatches(mappedMatches);
      } catch (err) {
        console.error('Failed to fetch matches:', err);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    fetchMatches();

    return () => {
      isCancelled = true;
    };
  }, [user?._id]); // stable primitive — prevents infinite re-fetch

  return { matches, isLoading };
};

export default useMyMatches;
