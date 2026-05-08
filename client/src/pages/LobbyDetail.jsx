import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Zap, Users, Clock, Trophy,
  CheckCircle, AlertTriangle, Gamepad2,
} from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import RightStatsPanel from '../components/dashboard/RightStatsPanel';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { PageLoader } from '../components/ui/Skeleton';
import useLobbies from '../hooks/useLobbies';
import useAuth from '../hooks/useAuth';
import {
  formatCredits, getLobbyStatus, formatDateTime,
  canJoinLobby, countdown,
} from '../utils/formatters';
import { GAME_ICONS } from '../utils/constants';

/* ─── Stat info box ─── */
function StatBox({ icon: Icon, label, value, colorClass = 'text-white' }) {
  return (
    <div className="bg-wine-elevated rounded-xl p-4 border border-wine-card">
      <Icon className={`w-4 h-4 ${colorClass} mb-2 opacity-70`} />
      <p className="text-white/40 text-xs mb-0.5">{label}</p>
      <p className={`font-bold text-sm ${colorClass}`}>{value}</p>
    </div>
  );
}

export default function LobbyDetail() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { user }   = useAuth();
  const { currentLobby: lobby, isLoading, fetchLobbyById, joinLobby, submitResult } = useLobbies(false);

  const [joinModal,    setJoinModal]    = useState(false);
  const [resultModal,  setResultModal]  = useState(false);
  const [resultLoading,setResultLoading]= useState(false);
  const [joinLoading,  setJoinLoading]  = useState(false);

  useEffect(() => { fetchLobbyById(id); }, [fetchLobbyById, id]);

  if (isLoading) return <PageLoader />;
  if (!lobby)    return (
    <AppShell>
      <div className="flex-1 flex items-center justify-center text-white/40">
        Lobby not found. <button onClick={() => navigate('/lobbies')} className="ml-2 text-crimson underline">Go back</button>
      </div>
    </AppShell>
  );

  const status       = getLobbyStatus(lobby.status);
  const gameIcon     = GAME_ICONS[lobby.game] || '🎮';
  const isJoined     = lobby.currentPlayers?.includes(user?._id);
  const joinable     = canJoinLobby(lobby, user?._id);
  const handleJoin = async () => {
    setJoinLoading(true);
    await joinLobby(lobby._id, user._id);
    setJoinLoading(false);
    setJoinModal(false);
  };

  const handleSubmitResult = async (winnerId) => {
    setResultLoading(true);
    await submitResult(lobby._id, { winnerId });
    setResultLoading(false);
    setResultModal(false);
  };

  return (
    <AppShell rightPanel={<RightStatsPanel />}>
      {/* Top bar */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-wine-elevated flex-shrink-0">
        <button
          onClick={() => navigate('/lobbies')}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-wine-card border border-wine-elevated text-white/50 hover:text-white hover:border-crimson/50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <p className="text-white/40 text-xs">Lobbies</p>
          <p className="text-white font-bold text-sm line-clamp-1">{lobby.title}</p>
        </div>
        {/* Action buttons in top bar */}
        {joinable && (
          <button
            onClick={() => setJoinModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-crimson hover:bg-crimson-light rounded-xl text-white text-sm font-semibold transition-colors shadow-glow-crimson-sm"
          >
            <Zap className="w-4 h-4 text-credits" /> Join — {formatCredits(lobby.bidAmount)}
          </button>
        )}
        {isJoined && lobby.status === 'in-progress' && (
          <button
            onClick={() => setResultModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-credits/15 border border-credits/30 hover:bg-credits/25 rounded-xl text-credits text-sm font-semibold transition-colors"
          >
            <Trophy className="w-4 h-4" /> Submit Result
          </button>
        )}
        {isJoined && lobby.status === 'open' && (
          <span className="px-3 py-1.5 bg-cyan-500/15 border border-cyan-500/30 rounded-xl text-cyan-400 text-sm font-semibold">
            You're In ✓
          </span>
        )}
      </div>

      {/* Main scrollable content */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

        {/* ── HERO DETAIL CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-wine-card rounded-2xl overflow-hidden border border-wine-elevated relative"
        >
          {/* Crimson left accent */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-crimson to-credits" />
          {/* Faint game emoji bg */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[100px] opacity-10 select-none pointer-events-none">
            {gameIcon}
          </div>

          <div className="p-6 pl-7">
            {/* Badges */}
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border
                ${lobby.status === 'open' ? 'bg-success/15 border-success/30 text-success' :
                  lobby.status === 'in-progress' ? 'bg-ingame/15 border-ingame/30 text-ingame' :
                  'bg-white/10 border-white/10 text-white/40'}`}>
                {status.label}
              </span>
              <span className="px-2 py-1 bg-wine-elevated border border-white/5 rounded-full text-white/50 text-xs">{lobby.game}</span>
              <span className="px-2 py-1 bg-wine-elevated border border-white/5 rounded-full text-white/50 text-xs">{lobby.college}</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-white font-display mb-4">{lobby.title}</h1>

            {/* Stat boxes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatBox icon={Zap}    label="Bid Amount" value={formatCredits(lobby.bidAmount)}                          colorClass="text-credits" />
              <StatBox icon={Users}  label="Players"    value={`${lobby.currentPlayers?.length || 0} / ${lobby.maxPlayers}`} colorClass="text-purple-400" />
              <StatBox icon={Clock}  label="Starts"     value={lobby.status === 'open' ? countdown(lobby.scheduledAt) : status.label} colorClass="text-white/60" />
              <StatBox icon={Trophy} label="Host"       value={lobby.hostName || '—'}                                  colorClass="text-white/60" />
            </div>
          </div>
        </motion.div>

        {/* ── PLAYERS + RULES ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Players card */}
          <div className="bg-wine-card border border-wine-elevated rounded-2xl p-5">
            <h2 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" /> Players
            </h2>
            <div className="space-y-2">
              {Array.from({ length: lobby.maxPlayers }, (_, i) => {
                const pd   = lobby.lobby_players?.[i];
                const pid  = pd?.user_id;
                const name = pd?.profiles?.name || pd?.name;
                const isMe = pid === user?._id;
                const isHost = pid === lobby.hostId;
                const displayName = isMe ? (user?.name || `Player ${i+1}`) : (name || `Player ${i+1}`);
                return (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${pid ? 'bg-wine-elevated' : 'border border-dashed border-white/10'}`}>
                    {pid ? (
                      <>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-crimson to-credits flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {displayName.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{displayName}</p>
                          {isHost && <p className="text-purple-400 text-[10px]">Host</p>}
                        </div>
                        {isMe && <span className="px-2 py-0.5 bg-cyan-500/15 border border-cyan-500/30 rounded-full text-cyan-400 text-[10px] font-semibold">You</span>}
                      </>
                    ) : (
                      <div className="flex items-center gap-2 opacity-30">
                        <div className="w-8 h-8 rounded-full border border-dashed border-white/30" />
                        <span className="text-xs text-white/40">Waiting...</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Match info */}
          <div className="space-y-4">
            <div className="bg-wine-card border border-wine-elevated rounded-2xl p-5">
              <h2 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-crimson" /> Rules
              </h2>
              <p className="text-white/50 text-sm leading-relaxed">
                {lobby.description || 'No specific rules defined. Play fair!'}
              </p>
            </div>

            {lobby.status === 'completed' && lobby.winnerId && (
              <div className="bg-success/10 border border-success/30 rounded-2xl p-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-success text-sm font-semibold">Match Completed</p>
                  <p className="text-white/40 text-xs mt-0.5">
                    Winner gained {formatCredits(lobby.bidAmount * Math.max((lobby.currentPlayers?.length || 2) - 1, 1))}
                  </p>
                </div>
              </div>
            )}

            <div className="bg-wine-card border border-wine-elevated rounded-2xl p-5">
              <p className="text-white/40 text-xs uppercase tracking-wider font-semibold mb-1">Schedule</p>
              <p className="text-white text-sm">{formatDateTime(lobby.scheduledAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── JOIN MODAL ── */}
      <Modal isOpen={joinModal} onClose={() => setJoinModal(false)} title="Confirm Join" size="sm">
        <div className="space-y-4">
          <div className="bg-wine-elevated rounded-xl p-5 text-center border border-wine-card">
            <p className="text-white/40 text-xs mb-1">Bid Amount</p>
            <p className="text-credits font-bold text-3xl font-display">{formatCredits(lobby.bidAmount)}</p>
            <p className="text-white/30 text-xs mt-1">Winner gets {formatCredits(lobby.bidAmount * Math.max(lobby.maxPlayers - 1, 1))}</p>
          </div>
          <p className="text-white/50 text-sm text-center">Ready to compete? This will deduct credits from your wallet.</p>
          <div className="flex gap-3">
            <Button variant="ghost" fullWidth onClick={() => setJoinModal(false)}>Cancel</Button>
            <button
              onClick={handleJoin}
              disabled={joinLoading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-crimson hover:bg-crimson-light rounded-xl text-white text-sm font-semibold transition-colors disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              {joinLoading ? 'Joining...' : 'Join Lobby'}
            </button>
          </div>
        </div>
      </Modal>

      {/* ── RESULT MODAL ── */}
      <Modal isOpen={resultModal} onClose={() => setResultModal(false)} title="Submit Match Result" size="sm">
        <div className="space-y-4">
          <p className="text-white/60 text-sm">Who won the match?</p>
          <div className="space-y-2">
            {lobby.currentPlayers?.map((playerId, i) => {
              const isMe = playerId === user?._id;
              return (
                <button
                  key={playerId}
                  onClick={() => handleSubmitResult(playerId)}
                  disabled={resultLoading}
                  className="w-full flex items-center gap-3 p-4 rounded-xl bg-wine-elevated border border-wine-card hover:border-crimson/50 hover:bg-crimson/5 transition-colors text-left"
                >
                  <Trophy className="w-5 h-5 text-credits" />
                  <span className="text-sm font-medium text-white">
                    {isMe ? `${user?.name} (You)` : `Player ${i + 1}`}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-white/30 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-warning" />
            Submitting a false result may lead to dispute and credit reversal.
          </p>
        </div>
      </Modal>
    </AppShell>
  );
}
