import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm, useWatch } from 'react-hook-form';
import { ArrowLeft, Trophy, Zap, Check } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import useTournaments from '../hooks/useTournaments';
import useAuth from '../hooks/useAuth';
import { GAMES, TOURNAMENT_FORMATS } from '../utils/constants';

const inputClass = (err) =>
  `w-full bg-wine-elevated border ${err ? 'border-error/50' : 'border-wine-card focus:border-crimson/50'} rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors`;

function SectionDivider({ title }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <p className="text-white/40 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">{title}</p>
      <div className="flex-1 h-px bg-wine-elevated" />
    </div>
  );
}

export default function CreateTournament() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createTournament } = useTournaments(false);
  const [submitting, setSubmitting] = useState(false);

  const { control, register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title: '', game: '', format: 'single-elim', description: '',
      entryFee: 0, prizePool: 0, maxParticipants: 16,
      startDate: '', startTime: '', endDate: '', endTime: '',
    },
  });

  const entryFee        = Number(useWatch({ control, name: 'entryFee' }) || 0);
  const maxParticipants = Number(useWatch({ control, name: 'maxParticipants' }) || 16);
  const prizePool       = Number(useWatch({ control, name: 'prizePool' }) || 0);
  const isFree          = entryFee === 0;
  const prizePerWinner  = prizePool > 0 ? Math.floor(prizePool / Math.ceil(Math.log2(maxParticipants))) : 0;

  const onSubmit = async (data) => {
    setSubmitting(true);
    const result = await createTournament({
      title: data.title,
      game: data.game,
      format: data.format,
      description: data.description,
      entryFee: Number(data.entryFee),
      prizePool: Number(data.prizePool),
      maxParticipants: Number(data.maxParticipants),
      startDate: `${data.startDate}T${data.startTime}`,
      endDate: `${data.endDate}T${data.endTime}`,
      college: user?.college,
    });
    setSubmitting(false);
    if (result?.success) navigate('/tournaments');
  };

  return (
    <AppShell>
      {/* Top bar */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-wine-elevated flex-shrink-0">
        <button
          onClick={() => navigate('/tournaments')}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-wine-card border border-wine-elevated text-white/50 hover:text-white hover:border-crimson/50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-white font-bold text-lg">Create Tournament</h1>
          <p className="text-white/40 text-xs">Set up a campus championship</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="max-w-lg mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* ── BASICS ── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-wine-card border border-purple-500/20 rounded-2xl p-6 space-y-4"
            >
              <SectionDivider title="Basics" />

              <div>
                <label className="text-white/50 text-xs font-medium mb-1.5 block">Tournament Title</label>
                <input
                  {...register('title', { required: 'Title is required' })}
                  placeholder="BITS Invitational — Season 1"
                  className={inputClass(errors.title)}
                />
                {errors.title && <p className="text-error text-xs mt-1">{errors.title.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white/50 text-xs font-medium mb-1.5 block">Game</label>
                  <select
                    {...register('game', { required: 'Select a game' })}
                    className={`${inputClass(errors.game)} appearance-none`}
                  >
                    <option value="" className="bg-wine-card">Select game...</option>
                    {GAMES.map(g => <option key={g} value={g} className="bg-wine-card">{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-white/50 text-xs font-medium mb-1.5 block">Format</label>
                  <select {...register('format')} className={`${inputClass(false)} appearance-none`}>
                    {TOURNAMENT_FORMATS.map(f => (
                      <option key={f.value} value={f.value} className="bg-wine-card">{f.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-white/50 text-xs font-medium mb-1.5 block">Description</label>
                <textarea
                  {...register('description')}
                  rows={3}
                  placeholder="Describe the tournament, rules, platform requirements..."
                  className="w-full bg-wine-elevated border border-wine-card focus:border-crimson/50 rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors resize-none"
                />
              </div>
            </motion.div>

            {/* ── CREDITS ── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-wine-card border border-credits/15 rounded-2xl p-6 space-y-4"
            >
              <SectionDivider title="Credits & Participants" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white/50 text-xs font-medium mb-1.5 block">Entry Fee (⚡)</label>
                  <div className="flex items-center gap-2 px-4 py-3 bg-wine-elevated border border-wine-card focus-within:border-credits/40 rounded-xl transition-colors">
                    <Zap className="w-4 h-4 text-credits flex-shrink-0" />
                    <input
                      type="number"
                      min="0"
                      {...register('entryFee')}
                      className="flex-1 bg-transparent text-white text-sm outline-none"
                    />
                  </div>
                  {isFree && (
                    <p className="text-success text-[10px] mt-1 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Free Entry
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-white/50 text-xs font-medium mb-1.5 block">Prize Pool (⚡)</label>
                  <div className="flex items-center gap-2 px-4 py-3 bg-wine-elevated border border-wine-card focus-within:border-credits/40 rounded-xl transition-colors">
                    <Trophy className="w-4 h-4 text-credits flex-shrink-0" />
                    <input
                      type="number"
                      min="0"
                      {...register('prizePool')}
                      className="flex-1 bg-transparent text-credits text-sm outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-white/50 text-xs font-medium mb-1.5 block">Max Participants</label>
                <select {...register('maxParticipants')} className={`${inputClass(false)} appearance-none`}>
                  {[8, 16, 32, 64].map(n => (
                    <option key={n} value={n} className="bg-wine-card">{n} players</option>
                  ))}
                </select>
              </div>

              {/* Live calculation */}
              {prizePool > 0 && (
                <div className="flex items-center gap-3 px-4 py-3 bg-credits/10 border border-credits/20 rounded-xl">
                  <Zap className="w-4 h-4 text-credits flex-shrink-0" />
                  <p className="text-credits text-xs">
                    Expected prize per match winner: <span className="font-bold">{prizePerWinner} ⚡</span>
                  </p>
                </div>
              )}
            </motion.div>

            {/* ── SCHEDULE ── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-wine-card border border-wine-elevated rounded-2xl p-6 space-y-4"
            >
              <SectionDivider title="Schedule" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white/50 text-xs font-medium mb-1.5 block">Start Date</label>
                  <input
                    type="date"
                    {...register('startDate', { required: true })}
                    className={inputClass(errors.startDate)}
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
                <div>
                  <label className="text-white/50 text-xs font-medium mb-1.5 block">Start Time</label>
                  <input
                    type="time"
                    {...register('startTime', { required: true })}
                    className={inputClass(errors.startTime)}
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
                <div>
                  <label className="text-white/50 text-xs font-medium mb-1.5 block">End Date</label>
                  <input
                    type="date"
                    {...register('endDate', { required: true })}
                    className={inputClass(errors.endDate)}
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
                <div>
                  <label className="text-white/50 text-xs font-medium mb-1.5 block">End Time</label>
                  <input
                    type="time"
                    {...register('endTime', { required: true })}
                    className={inputClass(errors.endTime)}
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-crimson to-purple-600 hover:from-crimson-light hover:to-purple-500 rounded-xl text-white font-semibold text-sm transition-all shadow-glow-crimson-sm disabled:opacity-60"
            >
              <Trophy className="w-5 h-5" />
              {submitting ? 'Creating Tournament...' : 'Create Tournament 🏆'}
            </button>

            <p className="text-center text-white/20 text-xs pb-4">
              No real money involved · Campus credits only
            </p>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
