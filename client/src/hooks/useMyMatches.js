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
        
        const lobbyIds = lobbyPlayers?.map((p) => p.lobby_id) || [];

        // Step 2: fetch only completed lobbies from that set, with opponent name
        let completedLobbies = [];
        if (lobbyIds.length > 0) {
          const { data, error: lobbiesError } = await supabase
            .from('lobbies')
            .select('id, title, game, bid_amount, winner_id, created_at, lobby_players(user_id, profiles(name, avatar_url))')
            .in('id', lobbyIds)
            .eq('status', 'completed')
            .order('created_at', { ascending: false });
          if (lobbiesError) throw lobbiesError;
          completedLobbies = data || [];
        }

        // Step 3: Fetch Hosted Tournaments (Prize Pool Deductions)
        const { data: hostedTournaments, error: hostErr } = await supabase
          .from('tournaments')
          .select('id, title, game, prize_pool, start_date')
          .eq('host_id', user._id)
          .gt('prize_pool', 0);
        if (hostErr) throw hostErr;

        // Step 4: Fetch Participated Tournaments (Entry Fee Deductions)
        const { data: partTournaments, error: partErr } = await supabase
          .from('tournament_participants')
          .select('tournaments(id, title, game, entry_fee, start_date)')
          .eq('user_id', user._id);
        if (partErr) throw partErr;

        // Map Lobbies
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

        // Map Hosted Tournaments
        const mappedHosted = (hostedTournaments || []).map(t => ({
          _id: t.id + '_host',
          title: `Hosted: ${t.title || t.game}`,
          game: t.game,
          opponent: { name: 'Prize Pool Funding', avatarUrl: null },
          result: 'spent', 
          creditsChange: -t.prize_pool,
          date: t.start_date, 
        }));

        // Map Participated Tournaments
        const mappedPart = (partTournaments || [])
          .filter(p => p.tournaments && p.tournaments.entry_fee > 0)
          .map(p => {
             const t = p.tournaments;
             return {
               _id: t.id + '_part',
               title: `Registered: ${t.title || t.game}`,
               game: t.game,
               opponent: { name: 'Tournament Entry', avatarUrl: null },
               result: 'spent',
               creditsChange: -t.entry_fee,
               date: t.start_date,
             };
          });

        const allMatches = [...mappedMatches, ...mappedHosted, ...mappedPart];
        // Sort by date descending
        allMatches.sort((a, b) => new Date(b.date) - new Date(a.date));

        if (!isCancelled) setMatches(allMatches);
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
