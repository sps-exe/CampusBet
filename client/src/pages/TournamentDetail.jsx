import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Users, Zap, Calendar } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import RightStatsPanel from '../components/dashboard/RightStatsPanel';
import { PageLoader } from '../components/ui/Skeleton';
import useTournaments from '../hooks/useTournaments';
import useAuth from '../hooks/useAuth';
import { formatCredits, formatDateTime, getInitials } from '../utils/formatters';

/* ─── Stat box ─── */
function StatBox({ icon: Icon, label, value, color = 'text-white' }) {
  return (
    <div className="bg-wine-elevated border border-wine-card rounded-xl p-4">
      <Icon className={`w-4 h-4 ${color} opacity-70 mb-2`} />
      <p className="text-white/40 text-xs mb-0.5">{label}</p>
      <p className={`font-bold text-sm ${color}`}>{value}</p>
    </div>
  );
}

/* ─── Participant card ─── */
function ParticipantCard({ name, college, empty, index }) {
  const colors = ['from-crimson to-credits', 'from-purple-600 to-cyan-500', 'from-credits to-ingame', 'from-cyan-500 to-success'];
  if (empty) return (
    <div className="flex flex-col items-center gap-2 p-4 bg-wine-elevated border border-dashed border-white/10 rounded-xl">
      <div className="w-12 h-12 rounded-full border border-dashed border-white/20 flex items-center justify-center text-white/20 text-xs">
        ?
      </div>
      <p className="text-white/20 text-xs">Empty slot</p>
    </div>
  );
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.04 }}
      className="flex flex-col items-center gap-2 p-4 bg-wine-elevated border border-wine-card rounded-xl hover:border-crimson/30 transition-colors"
    >
      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${colors[index % colors.length]} flex items-center justify-center text-white font-bold`}>
        {getInitials(name || '?')}
      </div>
      <div className="text-center">
        <p className="text-white text-xs font-semibold">{name}</p>
        <p className="text-white/40 text-[10px]">{college}</p>
      </div>
    </motion.div>
  );
}

/* ─── Bracket match box ─── */
function BracketMatch({ p1, p2, winner }) {
  return (
    <div className="bg-wine-elevated border border-wine-card rounded-xl overflow-hidden w-40">
      {[p1, p2].map((p, i) => (
        <div
          key={i}
          className={`flex items-center gap-2 px-3 py-2 border-b last:border-0 border-wine-card
            ${p === winner ? 'bg-credits/10 border-l-2 border-l-credits' : ''}`}
        >
          <div className="w-5 h-5 rounded-full bg-wine-card flex items-center justify-center text-[9px] text-white/50 flex-shrink-0">
            {getInitials(p || '?')}
          </div>
          <p className={`text-xs truncate ${p === winner ? 'text-credits font-semibold' : 'text-white/50'}`}>
            {p || 'TBD'}
          </p>
          {p === winner && <Trophy className="w-3 h-3 text-credits ml-auto flex-shrink-0" />}
        </div>
      ))}
    </div>
  );
}

const TABS = ['Overview', 'Bracket', 'Participants'];

export default function TournamentDetail() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const { user }  = useAuth();
  const { currentTournament: t, isLoading, fetchTournamentById, registerForTournament } = useTournaments(false);

  const [tab,      setTab]      = useState('Overview');
  const [regLoad,  setRegLoad]  = useState(false);

  useEffect(() => { fetchTournamentById(id); }, [fetchTournamentById, id]);

  if (isLoading) return <PageLoader />;
  if (!t) return (
    <AppShell>
      <div className="flex-1 flex items-center justify-center text-white/40">
        Tournament not found.{' '}
        <button onClick={() => navigate('/tournaments')} className="ml-2 text-crimson underline">Go back</button>
      </div>
    </AppShell>
  );

  const isRegistered = t.registrations?.some(r => r.userId === user?._id);
  const spotsLeft    = (t.maxParticipants || 0) - (t.registrations?.length || 0);
  const isFull       = spotsLeft <= 0;
  const isFree       = !t.entryFee || t.entryFee === 0;

  const STATUS_BADGE = {
    upcoming:  'bg-purple-500/15 border-purple-500/30 text-purple-400',
    live:      'bg-success/15    border-success/30    text-success',
    completed: 'bg-white/10      border-white/10      text-white/40',
  };

  const handleRegister = async () => {
    setRegLoad(true);
    await registerForTournament(t._id);
    setRegLoad(false);
  };

  // Build bracket pairs from registrations
  const participants = t.registrations || [];
  const bracketPairs = [];
  for (let i = 0; i < participants.length; i += 2) {
    bracketPairs.push([
      participants[i]?.profiles?.name || `Player ${i+1}`,
      participants[i+1]?.profiles?.name || `Player ${i+2}`,
    ]);
  }

  return (
    <AppShell rightPanel={<RightStatsPanel />}>
      {/* Top bar */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-wine-elevated flex-shrink-0">
        <button
          onClick={() => navigate('/tournaments')}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-wine-card border border-wine-elevated text-white/50 hover:text-white hover:border-crimson/50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-white/40 text-xs">Tournaments</p>
          <p className="text-white font-bold text-sm line-clamp-1">{t.title}</p>
        </div>
        {/* Register button */}
        {!isRegistered && !isFull && t.status !== 'completed' && (
          <button
            onClick={handleRegister}
            disabled={regLoad}
            className="flex items-center gap-1.5 px-4 py-2 bg-crimson hover:bg-crimson-light rounded-xl text-white text-sm font-semibold transition-colors shadow-glow-crimson-sm disabled:opacity-60"
          >
            <Zap className="w-4 h-4 text-credits" />
            {regLoad ? 'Registering...' : `Register${!isFree ? ` — ${formatCredits(t.entryFee)}` : ' — Free'}`}
          </button>
        )}
        {isRegistered && (
          <span className="px-3 py-1.5 bg-cyan-500/15 border border-cyan-500/30 rounded-xl text-cyan-400 text-sm font-semibold">
            Registered ✓
          </span>
        )}
        {isFull && !isRegistered && (
          <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-white/30 text-sm">Full</span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

        {/* ── HERO CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-wine-card border border-wine-elevated rounded-2xl overflow-hidden relative"
        >
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-crimson" />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[100px] opacity-10 select-none pointer-events-none">🏆</div>

          <div className="p-6 pl-7">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${STATUS_BADGE[t.status] || STATUS_BADGE.upcoming}`}>
                {t.status || 'Upcoming'}
              </span>
              <span className="px-2 py-1 bg-wine-elevated border border-white/5 rounded-full text-white/40 text-[10px]">{t.format}</span>
              <span className="px-2 py-1 bg-wine-elevated border border-white/5 rounded-full text-white/40 text-[10px]">{t.game}</span>
            </div>

            <h1 className="text-2xl font-bold text-white font-display mb-4">{t.title}</h1>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <StatBox icon={Zap}      label="Entry Fee"     value={isFree ? 'Free' : formatCredits(t.entryFee)}        color="text-credits"     />
              <StatBox icon={Trophy}   label="Prize Pool"    value={formatCredits(t.prizePool)}                         color="text-credits"     />
              <StatBox icon={Users}    label="Participants"  value={`${t.registrations?.length || 0}/${t.maxParticipants}`} color="text-purple-400" />
              <StatBox icon={Calendar} label="Starts"        value={formatDateTime(t.startDate)}                        color="text-white/60"    />
              <StatBox icon={Calendar} label="Ends"          value={formatDateTime(t.endDate)}                          color="text-white/60"    />
            </div>
          </div>
        </motion.div>

        {/* ── TABS ── */}
        <div className="flex gap-1 bg-wine-card border border-wine-elevated rounded-xl p-1 w-fit">
          {TABS.map(tb => (
            <button
              key={tb}
              onClick={() => setTab(tb)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all
                ${tab === tb
                  ? 'bg-crimson text-white shadow-glow-crimson-sm'
                  : 'text-white/40 hover:text-white/70'
                }`}
            >
              {tb}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {tab === 'Overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-wine-card border border-wine-elevated rounded-2xl p-5">
              <h3 className="text-white font-semibold text-sm mb-3">About</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                {t.description || 'No description provided.'}
              </p>
            </div>
            <div className="bg-wine-card border border-wine-elevated rounded-2xl p-5">
              <h3 className="text-white font-semibold text-sm mb-3">Schedule</h3>
              <div className="space-y-3">
                {[
                  { label: 'Registration Deadline', value: formatDateTime(t.startDate) },
                  { label: 'Tournament Starts',     value: formatDateTime(t.startDate) },
                  { label: 'Tournament Ends',       value: formatDateTime(t.endDate)   },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-crimson mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-white/40 text-xs">{label}</p>
                      <p className="text-white text-sm">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── BRACKET TAB ── */}
        {tab === 'Bracket' && (
          <div className="bg-wine-card border border-wine-elevated rounded-2xl p-6">
            <h3 className="text-white font-semibold text-sm mb-5">Tournament Bracket</h3>
            {bracketPairs.length === 0 ? (
              <p className="text-white/30 text-sm text-center py-8">Bracket will appear once participants register</p>
            ) : (
              <div className="flex gap-8 overflow-x-auto pb-4">
                {/* Round 1 */}
                <div className="flex flex-col gap-4 flex-shrink-0">
                  <p className="text-white/40 text-xs font-semibold mb-1">Round 1</p>
                  {bracketPairs.map(([p1, p2], i) => (
                    <BracketMatch key={i} p1={p1} p2={p2} winner={t.bracketWinners?.[i]} />
                  ))}
                </div>
                {/* Semi-final placeholder */}
                {bracketPairs.length > 1 && (
                  <div className="flex flex-col gap-4 flex-shrink-0 justify-center">
                    <p className="text-white/40 text-xs font-semibold mb-1">Semi-Final</p>
                    <BracketMatch p1="TBD" p2="TBD" />
                  </div>
                )}
                {/* Final placeholder */}
                <div className="flex flex-col gap-4 flex-shrink-0 justify-center">
                  <p className="text-white/40 text-xs font-semibold mb-1">Final</p>
                  <BracketMatch p1="TBD" p2="TBD" winner={t.winnerId ? 'TBD' : undefined} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── PARTICIPANTS TAB ── */}
        {tab === 'Participants' && (
          <div className="bg-wine-card border border-wine-elevated rounded-2xl p-5">
            <h3 className="text-white font-semibold text-sm mb-4">
              Participants ({t.registrations?.length || 0}/{t.maxParticipants})
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {Array.from({ length: t.maxParticipants || 8 }, (_, i) => {
                const reg = t.registrations?.[i];
                return reg ? (
                  <ParticipantCard
                    key={i}
                    index={i}
                    name={reg.profiles?.name || `Player ${i+1}`}
                    college={reg.profiles?.college || '—'}
                  />
                ) : (
                  <ParticipantCard key={i} index={i} empty />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
