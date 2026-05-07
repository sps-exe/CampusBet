import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Zap, Users, Clock, Trophy,
  CheckCircle, AlertTriangle, Gamepad2,
} from 'lucide-react';
import useLobbies from '../hooks/useLobbies';
import useAuth from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { Avatar } from '../components/tournament/ParticipantList';
import { PageLoader } from '../components/ui/Skeleton';
import {
  formatCredits, getLobbyStatus, formatDateTime,
  canJoinLobby, countdown,
} from '../utils/formatters';
import { GAME_ICONS } from '../utils/constants';

const LobbyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentLobby: lobby, isLoading, fetchLobbyById, joinLobby, submitResult } = useLobbies(false);

  const [joinModal, setJoinModal] = useState(false);
  const [resultModal, setResultModal] = useState(false);
  const [resultLoading, setResultLoading] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);

  useEffect(() => { fetchLobbyById(id); }, [fetchLobbyById, id]);

  if (isLoading) return <PageLoader />;
  if (!lobby) return (
    <div className="min-h-screen bg-grid pt-24 flex items-center justify-center">
      <div className="text-center">
        <p className="text-text-muted mb-4">Lobby not found</p>
        <Button variant="outline" onClick={() => navigate('/lobbies')}>← Back to Lobbies</Button>
      </div>
    </div>
  );

  const status = getLobbyStatus(lobby.status);
  const gameIcon = GAME_ICONS[lobby.game] || '🎮';
  const isJoined = lobby.currentPlayers?.includes(user?._id);
  const joinable = canJoinLobby(lobby, user?._id);
  const statusVariant = { open: 'success', 'in-progress': 'warning', completed: 'muted', cancelled: 'error' }[lobby.status] || 'muted';

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
    <div className="min-h-screen bg-grid pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Back button */}
        <button onClick={() => navigate('/lobbies')} className="flex items-center gap-2 text-text-muted hover:text-text-primary text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Lobbies
        </button>

        {/* Header card */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="bg-bg-card border border-white/10 rounded-2xl overflow-hidden"
        >
          <div className="h-1 bg-gradient-to-r from-purple-500 to-cyan-500" />
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={statusVariant}>{status.label}</Badge>
                  <Badge variant="muted">{lobby.game}</Badge>
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary">
                  {gameIcon} {lobby.title}
                </h1>
                <p className="text-text-muted text-sm mt-1">{lobby.college}</p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {joinable && (
                  <Button variant="primary" icon={Zap} onClick={() => setJoinModal(true)}>
                    Join — {formatCredits(lobby.bidAmount)}
                  </Button>
                )}
                {isJoined && lobby.status === 'in-progress' && (
                  <Button variant="secondary" icon={Trophy} onClick={() => setResultModal(true)}>
                    Submit Result
                  </Button>
                )}
                {isJoined && lobby.status === 'open' && (
                  <Badge variant="cyan" size="md">You're in ✓</Badge>
                )}
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Zap, label: 'Bid Amount', value: formatCredits(lobby.bidAmount), color: 'text-cyan-400' },
                { icon: Users, label: 'Players', value: `${lobby.currentPlayers?.length || 0} / ${lobby.maxPlayers}`, color: 'text-purple-400' },
                { icon: Clock, label: 'Scheduled', value: lobby.status === 'open' ? countdown(lobby.scheduledAt) : status.label, color: 'text-text-secondary' },
                { icon: Trophy, label: 'Host', value: lobby.hostName, color: 'text-text-secondary' },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="bg-bg-elevated rounded-xl p-4">
                  <Icon className={`w-4 h-4 ${color} mb-2`} />
                  <p className="text-xs text-text-muted mb-0.5">{label}</p>
                  <p className={`font-display font-bold text-base ${color}`}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Players */}
          <div className="bg-bg-card border border-white/5 rounded-2xl p-6">
            <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" /> Players
            </h2>
          <div className="space-y-3">
              {Array.from({ length: lobby.maxPlayers }, (_, i) => {
                const playerData = lobby.lobby_players?.[i];
                const playerId = playerData?.user_id;
                const playerName = playerData?.profiles?.name || playerData?.name;
                const isMe = playerId === user?._id;
                const isLobbyHost = playerId === lobby.hostId;
                return (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${playerId ? 'bg-bg-elevated' : 'border border-dashed border-white/10'}`}>
                    {playerId ? (
                      <>
                        <Avatar user={isMe ? user : { name: playerName || `Player ${i + 1}` }} size="sm" />
                        <div>
                          <p className="text-sm font-medium text-text-primary">
                            {isMe ? user?.name : (playerName || `Player ${i + 1}`)}
                            {isLobbyHost && <span className="ml-2 text-xs text-purple-400">(host)</span>}
                          </p>
                        </div>
                        {isMe && <Badge variant="cyan" size="sm" className="ml-auto">You</Badge>}
                      </>
                    ) : (
                      <div className="flex items-center gap-2 opacity-30">
                        <div className="w-8 h-8 rounded-full border border-dashed border-white/30" />
                        <span className="text-xs text-text-muted">Waiting...</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Description + rules */}
          <div className="space-y-4">
            <div className="bg-bg-card border border-white/5 rounded-2xl p-6">
              <h2 className="font-display font-semibold text-lg mb-3 flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-cyan-400" /> Rules
              </h2>
              <p className="text-text-secondary text-sm leading-relaxed">
                {lobby.description || 'No specific rules defined. Play fair!'}
              </p>
            </div>

            {lobby.status === 'completed' && lobby.winnerId && (
              <div className="bg-success/10 border border-success/30 rounded-2xl p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-success font-semibold">Match Completed</p>
                  <p className="text-xs text-text-muted mt-0.5">
                    Winner gained {formatCredits(lobby.bidAmount * Math.max((lobby.currentPlayers?.length || 2) - 1, 1))}
                  </p>
                </div>
              </div>
            )}

            <div className="bg-bg-card border border-white/5 rounded-2xl p-6">
              <p className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-2">Schedule</p>
              <p className="text-sm text-text-secondary">{formatDateTime(lobby.scheduledAt)}</p>
            </div>
          </div>
        </div>

      </div>

      {/* Join confirmation modal */}
      <Modal isOpen={joinModal} onClose={() => setJoinModal(false)} title="Confirm Join" size="sm">
        <div className="space-y-4">
          <div className="bg-bg-elevated rounded-xl p-4 text-center">
            <p className="text-text-muted text-sm">Bid amount</p>
            <p className="font-display text-3xl font-bold text-cyan-400">{formatCredits(lobby.bidAmount)}</p>
            <p className="text-xs text-text-muted mt-1">This match will be added to the scoreboard after the result is submitted.</p>
          </div>
          <p className="text-text-secondary text-sm text-center">
            The winner gains {formatCredits(lobby.bidAmount * Math.max(lobby.maxPlayers - 1, 1))}. Are you ready?
          </p>
          <div className="flex gap-3">
            <Button variant="ghost" fullWidth onClick={() => setJoinModal(false)}>Cancel</Button>
            <Button variant="primary" fullWidth loading={joinLoading} icon={CheckCircle} onClick={handleJoin}>
              Join Lobby
            </Button>
          </div>
        </div>
      </Modal>

      {/* Submit result modal */}
      <Modal isOpen={resultModal} onClose={() => setResultModal(false)} title="Submit Match Result" size="sm">
        <div className="space-y-4">
          <p className="text-text-secondary text-sm">Who won the match?</p>
          <div className="space-y-2">
            {lobby.currentPlayers?.map((playerId, i) => {
              const isMe = playerId === user?._id;
              return (
                <button
                  key={playerId}
                  onClick={() => handleSubmitResult(playerId)}
                  disabled={resultLoading}
                  className="w-full flex items-center gap-3 p-4 rounded-xl border border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5 transition-colors text-left"
                >
                  <Trophy className="w-5 h-5 text-warning" />
                  <span className="text-sm font-medium text-text-primary">
                    {isMe ? `${user?.name} (You)` : `Player ${i + 1}`}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-text-muted flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-warning" />
            Submitting a false result may lead to dispute and credit reversal.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default LobbyDetail;
