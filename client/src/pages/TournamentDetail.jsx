import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Users, Zap, Calendar, CheckCircle } from 'lucide-react';
import useTournamentStore from '../store/tournamentStore';
import useAuth from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import BracketView from '../components/tournament/BracketView';
import ParticipantList from '../components/tournament/ParticipantList';
import { PageLoader } from '../components/ui/Skeleton';
import { formatCredits, getTournamentStatus, formatDateTime } from '../utils/formatters';
import { GAME_ICONS } from '../utils/constants';

const TABS = ['Overview', 'Bracket', 'Participants'];

const TournamentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentTournament: tournament, isLoading, fetchTournamentById, registerForTournament } = useTournamentStore();
  const [tab, setTab] = useState('Overview');
  const [registering, setRegistering] = useState(false);

  useEffect(() => { fetchTournamentById(id); }, [fetchTournamentById, id]);

  if (isLoading) return <PageLoader />;
  if (!tournament) return (
    <div className="min-h-screen bg-grid pt-24 flex items-center justify-center">
      <div className="text-center">
        <p className="text-text-muted mb-4">Tournament not found</p>
        <Button variant="outline" onClick={() => navigate('/tournaments')}>← Back</Button>
      </div>
    </div>
  );

  const status = getTournamentStatus(tournament.status);
  const gameIcon = GAME_ICONS[tournament.game] || '🎮';
  const isRegistered = tournament.participants?.includes(user?._id);
  const isFull = tournament.participants?.length >= tournament.maxParticipants;
  const canRegister = tournament.status === 'upcoming' && !isRegistered && !isFull;
  const statusVariant = { upcoming: 'purple', live: 'success', completed: 'muted', cancelled: 'error' }[tournament.status] || 'muted';

  const handleRegister = async () => {
    setRegistering(true);
    await registerForTournament(id);
    setRegistering(false);
  };

  const resolvedParticipants = tournament.resolvedParticipants || [];

  return (
    <div className="min-h-screen bg-grid pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <button onClick={() => navigate('/tournaments')} className="flex items-center gap-2 text-text-muted hover:text-text-primary text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Tournaments
        </button>

        {/* Hero card */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="bg-bg-card border border-white/10 rounded-2xl overflow-hidden"
        >
          <div className="h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500" />
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant={statusVariant}>{status.label}</Badge>
                  <Badge variant="muted">{tournament.format?.replace('-', ' ')}</Badge>
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold">
                  {gameIcon} {tournament.title}
                </h1>
                <p className="text-text-muted text-sm mt-1">{tournament.college} · Hosted by {tournament.host?.name}</p>
              </div>
              <div className="flex flex-col items-start sm:items-end gap-2">
                {canRegister && (
                  <Button variant="primary" icon={CheckCircle} loading={registering} onClick={handleRegister}>
                    Register — {formatCredits(tournament.entryCredits)}
                  </Button>
                )}
                {isRegistered && <Badge variant="cyan" size="md">Registered ✓</Badge>}
                {isFull && !isRegistered && <Badge variant="muted" size="md">Full</Badge>}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Trophy, label: 'Prize Pool', value: formatCredits(tournament.prizePool), color: 'text-warning' },
                { icon: Zap, label: 'Entry Credits', value: formatCredits(tournament.entryCredits), color: 'text-cyan-400' },
                { icon: Users, label: 'Participants', value: `${tournament.participants?.length || 0} / ${tournament.maxParticipants}`, color: 'text-purple-400' },
                { icon: Calendar, label: 'Starts', value: formatDateTime(tournament.startDate).split(' at ')[0], color: 'text-text-secondary' },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="bg-bg-elevated rounded-xl p-4">
                  <Icon className={`w-4 h-4 ${color} mb-2`} />
                  <p className="text-xs text-text-muted mb-0.5">{label}</p>
                  <p className={`font-display font-bold text-sm ${color}`}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 bg-bg-card border border-white/5 rounded-xl p-1 w-fit">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t ? 'bg-purple-500 text-white shadow-glow-purple-sm' : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          className="bg-bg-card border border-white/5 rounded-2xl p-6"
        >
          {tab === 'Overview' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-display font-semibold mb-2">About</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {tournament.game} tournament hosted by {tournament.host?.name} at {tournament.college}.
                  Format: {tournament.format?.replace('-', ' ')}. Entry fee: {formatCredits(tournament.entryCredits)} campus credits.
                </p>
              </div>
              <div>
                <h3 className="font-display font-semibold mb-2">Rules</h3>
                <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap">
                  {tournament.rules || 'Standard rules apply. Fair play expected. Results must be submitted with screenshot proof.'}
                </p>
              </div>
              <div className="flex items-center gap-3 p-4 bg-bg-elevated rounded-xl">
                <Calendar className="w-5 h-5 text-purple-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-text-muted">Schedule</p>
                  <p className="text-sm text-text-primary">{formatDateTime(tournament.startDate)} → {formatDateTime(tournament.endDate)}</p>
                </div>
              </div>
            </div>
          )}
          {tab === 'Bracket' && (
            <BracketView bracket={tournament.bracket} totalParticipants={tournament.maxParticipants} />
          )}
          {tab === 'Participants' && (
            <ParticipantList
              participants={tournament.participants || []}
              maxParticipants={tournament.maxParticipants}
              resolvedUsers={resolvedParticipants}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default TournamentDetail;
