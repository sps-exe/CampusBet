import { Trophy } from 'lucide-react';

/**
 * BracketView — visual single-elimination bracket
 * Renders rounds as columns with match cards connected by lines.
 */
const MatchCard = ({ match }) => {
  const isComplete = match?.status === 'completed';
  return (
    <div className="bg-bg-elevated border border-white/10 rounded-lg overflow-hidden w-44 flex-shrink-0">
      {[match?.player1, match?.player2].map((player, i) => (
        <div
          key={i}
          className={`flex items-center gap-2 px-3 py-2 ${
            i === 0 ? 'border-b border-white/5' : ''
          } ${
            isComplete && match.winnerId === player?._id
              ? 'bg-success/10'
              : ''
          }`}
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-white">
              {player?.name?.[0] || '?'}
            </span>
          </div>
          <span className={`text-xs flex-1 truncate ${
            isComplete && match.winnerId === player?._id
              ? 'text-success font-semibold'
              : 'text-text-secondary'
          }`}>
            {player?.name || 'TBD'}
          </span>
          {isComplete && match.winnerId === player?._id && (
            <Trophy className="w-3 h-3 text-success flex-shrink-0" />
          )}
        </div>
      ))}
    </div>
  );
};

const BracketView = ({ bracket, totalParticipants = 8 }) => {
  // If no real bracket data, show a placeholder visual
  if (!bracket || !bracket.length) {
    const rounds = Math.ceil(Math.log2(totalParticipants));
    const placeholderRounds = Array.from({ length: rounds }, (_, ri) => {
      const matchCount = totalParticipants / Math.pow(2, ri + 1);
      return {
        round: ri + 1,
        label: ri === rounds - 1 ? 'Final' : ri === rounds - 2 ? 'Semifinal' : `Round ${ri + 1}`,
        matches: Array.from({ length: matchCount }, (_, mi) => ({
          _id: `ph-${ri}-${mi}`,
          player1: null,
          player2: null,
          status: 'pending',
          winnerId: null,
        })),
      };
    });

    return (
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex gap-8 pb-4" style={{ minWidth: `${placeholderRounds.length * 220}px` }}>
          {placeholderRounds.map((round) => (
            <div key={round.round} className="flex flex-col gap-4">
              <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider text-center">{round.label}</h4>
              <div
                className="flex flex-col justify-around gap-6"
                style={{ minHeight: `${round.matches.length * 80}px` }}
              >
                {round.matches.map((match) => (
                  <MatchCard key={match._id} match={match} />
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-text-muted text-center mt-4">
          Bracket will populate once the tournament starts
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto no-scrollbar">
      <div className="flex gap-8 pb-4">
        {bracket.map((round) => (
          <div key={round.round} className="flex flex-col gap-4">
            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider text-center">
              {round.label || `Round ${round.round}`}
            </h4>
            <div className="flex flex-col justify-around gap-6">
              {round.matches?.map((match) => (
                <MatchCard key={match._id} match={match} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BracketView;
