import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm, useWatch } from 'react-hook-form';
import { ArrowLeft, Gamepad2, Zap, FileText, Check, ChevronRight } from 'lucide-react';
import AppShell from '../components/layout/AppShell';
import useLobbies from '../hooks/useLobbies';
import useAuth from '../hooks/useAuth';
import { GAMES, LOBBY_FORMATS } from '../utils/constants';

const STEPS = [
  { label: 'Game & Format', icon: Gamepad2 },
  { label: 'Bid & Schedule', icon: Zap },
  { label: 'Rules & Review', icon: FileText },
];

const combineDateAndTime = (date, time) => {
  if (!date || !time) return '';
  return `${date}T${time}`;
};

/* ─── Step indicator ─── */
function StepIndicator({ current }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {STEPS.map((s, i) => {
        const done   = i < current;
        const active = i === current;
        return (
          <div key={i} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                ${done   ? 'bg-success text-white' :
                  active ? 'bg-crimson text-white shadow-glow-crimson-sm' :
                           'bg-wine-elevated border border-wine-card text-white/30'}`}>
                {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${active ? 'text-white' : done ? 'text-success' : 'text-white/30'}`}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-px w-8 sm:w-16 flex-shrink-0 ${i < current ? 'bg-success' : 'bg-wine-elevated'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Format card selector ─── */
function FormatCard({ format, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-4 rounded-xl border text-sm font-semibold text-left transition-all
        ${selected
          ? 'bg-crimson/15 border-crimson text-crimson'
          : 'bg-wine-elevated border-wine-card text-white/50 hover:border-white/20 hover:text-white/70'
        }`}
    >
      <p className="font-bold">{format.value.toUpperCase()}</p>
      <p className="text-[11px] mt-0.5 opacity-70">{format.label}</p>
    </button>
  );
}

export default function CreateLobby() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createLobby } = useLobbies(false);
  const [step, setStep]         = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const { control, register, handleSubmit, formState: { errors }, trigger, setValue } = useForm({
    defaultValues: {
      game: '', format: '1v1', maxPlayers: 2,
      bidAmount: 100, scheduledDate: '', scheduledTime: '',
      title: '', description: '',
    },
  });

  const watchGame          = useWatch({ control, name: 'game' });
  const watchFormat        = useWatch({ control, name: 'format' });
  const watchBid           = useWatch({ control, name: 'bidAmount' });
  const watchScheduledDate = useWatch({ control, name: 'scheduledDate' });
  const watchScheduledTime = useWatch({ control, name: 'scheduledTime' });

  const stepFields = [
    ['game', 'format', 'title'],
    ['bidAmount', 'scheduledDate', 'scheduledTime'],
    ['description'],
  ];

  const nextStep = async () => {
    const valid = await trigger(stepFields[step]);
    if (valid) setStep(s => Math.min(s + 1, STEPS.length - 1));
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    const maxPlayers = data.format === '1v1' ? 2 : 4;
    const result = await createLobby({
      title: data.title,
      game: data.game,
      bidAmount: data.bidAmount,
      scheduledAt: combineDateAndTime(data.scheduledDate, data.scheduledTime),
      description: data.description,
      maxPlayers,
      format: data.format,
      college: user?.college,
    });
    setSubmitting(false);
    if (result?.success) navigate('/lobbies');
  };

  const prizePool = Number(watchBid || 0) * (watchFormat === '1v1' ? 1 : 3);

  const inputClass = (hasError) =>
    `w-full bg-wine-elevated border ${hasError ? 'border-error/50' : 'border-wine-card focus:border-crimson/50'} rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors`;

  return (
    <AppShell>
      {/* Top bar */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-wine-elevated flex-shrink-0">
        <button
          onClick={() => navigate('/lobbies')}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-wine-card border border-wine-elevated text-white/50 hover:text-white hover:border-crimson/50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-white font-bold text-lg">Create a Lobby</h1>
          <p className="text-white/40 text-xs">Set the stakes and challenge your campus</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="max-w-lg mx-auto">
          <StepIndicator current={step} />

          <form onSubmit={handleSubmit(onSubmit)}>
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-wine-card border border-wine-elevated rounded-2xl p-6 space-y-5"
            >

              {/* ── STEP 1: Game & Format ── */}
              {step === 0 && (
                <>
                  <div>
                    <label className="text-white/50 text-xs font-medium mb-1.5 block">Lobby Title</label>
                    <input
                      {...register('title', { required: 'Title is required' })}
                      placeholder="Give your lobby a name..."
                      className={inputClass(errors.title)}
                    />
                    {errors.title && <p className="text-error text-xs mt-1">{errors.title.message}</p>}
                  </div>

                  <div>
                    <label className="text-white/50 text-xs font-medium mb-1.5 block">Game</label>
                    <select
                      {...register('game', { required: 'Select a game' })}
                      className={`${inputClass(errors.game)} appearance-none`}
                    >
                      <option value="" className="bg-wine-card">Select a game...</option>
                      {GAMES.map(g => <option key={g} value={g} className="bg-wine-card">{g}</option>)}
                    </select>
                    {errors.game && <p className="text-error text-xs mt-1">{errors.game.message}</p>}
                  </div>

                  <div>
                    <label className="text-white/50 text-xs font-medium mb-2 block">Format</label>
                    <div className="grid grid-cols-2 gap-3">
                      {LOBBY_FORMATS.map(f => (
                        <FormatCard
                          key={f.value}
                          format={f}
                          selected={watchFormat === f.value}
                          onClick={() => setValue('format', f.value)}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* ── STEP 2: Bid & Schedule ── */}
              {step === 1 && (
                <>
                  <div>
                    <label className="text-white/50 text-xs font-medium mb-1.5 block">Bid Amount (⚡ credits)</label>
                    <div className="flex items-center gap-3 px-4 py-3 bg-wine-elevated border border-wine-card focus-within:border-crimson/50 rounded-xl transition-colors">
                      <Zap className="w-4 h-4 text-credits flex-shrink-0" />
                      <input
                        type="number"
                        min="10"
                        max={user?.credits || 500}
                        {...register('bidAmount', { required: true, min: 10 })}
                        className="flex-1 bg-transparent text-white text-sm outline-none"
                      />
                    </div>
                    <div className="flex justify-between mt-1.5">
                      <p className="text-white/30 text-[10px]">Your balance: {user?.credits || 0} ⚡</p>
                      <p className="text-credits text-[10px] font-semibold">Prize pool: {prizePool} ⚡</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/50 text-xs font-medium mb-1.5 block">Date</label>
                      <input
                        type="date"
                        {...register('scheduledDate', { required: 'Date required' })}
                        className={inputClass(errors.scheduledDate)}
                        style={{ colorScheme: 'dark' }}
                      />
                    </div>
                    <div>
                      <label className="text-white/50 text-xs font-medium mb-1.5 block">Time</label>
                      <input
                        type="time"
                        {...register('scheduledTime', { required: 'Time required' })}
                        className={inputClass(errors.scheduledTime)}
                        style={{ colorScheme: 'dark' }}
                      />
                    </div>
                  </div>

                  {/* Info tip */}
                  <div className="flex gap-3 p-3 bg-wine-elevated border border-credits/15 rounded-xl">
                    <Zap className="w-4 h-4 text-credits flex-shrink-0 mt-0.5" />
                    <p className="text-white/40 text-[11px] leading-relaxed">
                      Credits are held until the match result is submitted. Winner receives the full prize pool.
                    </p>
                  </div>
                </>
              )}

              {/* ── STEP 3: Rules & Review ── */}
              {step === 2 && (
                <>
                  <div>
                    <label className="text-white/50 text-xs font-medium mb-1.5 block">Match Rules / Description</label>
                    <textarea
                      {...register('description')}
                      rows={4}
                      placeholder="Describe match rules, format, platforms used..."
                      className="w-full bg-wine-elevated border border-wine-card focus:border-crimson/50 rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors resize-none"
                    />
                  </div>

                  {/* Review summary */}
                  <div className="bg-wine-elevated border border-wine-card rounded-xl p-4 space-y-3">
                    <p className="text-white font-semibold text-xs uppercase tracking-wider">Review</p>
                    {[
                      { label: 'Game',      value: watchGame || '—'           },
                      { label: 'Format',    value: watchFormat?.toUpperCase() },
                      { label: 'Bid',       value: `${watchBid} ⚡`          },
                      { label: 'Schedule',  value: watchScheduledDate && watchScheduledTime
                          ? `${watchScheduledDate} at ${watchScheduledTime}` : '—' },
                      { label: 'College',   value: user?.college || '—'       },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between text-sm">
                        <span className="text-white/40">{label}</span>
                        <span className="text-white font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>

            {/* Navigation buttons */}
            <div className="flex justify-between mt-5">
              <button
                type="button"
                onClick={() => step > 0 ? setStep(s => s - 1) : navigate('/lobbies')}
                className="flex items-center gap-2 px-5 py-2.5 bg-wine-card border border-wine-elevated hover:border-white/20 rounded-xl text-white/60 hover:text-white text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {step === 0 ? 'Cancel' : 'Back'}
              </button>

              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2 px-5 py-2.5 bg-crimson hover:bg-crimson-light rounded-xl text-white text-sm font-semibold transition-colors shadow-glow-crimson-sm"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-2.5 bg-crimson hover:bg-crimson-light rounded-xl text-white text-sm font-semibold transition-colors shadow-glow-crimson-sm disabled:opacity-60"
                >
                  <Gamepad2 className="w-4 h-4" />
                  {submitting ? 'Creating...' : 'Create Lobby'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
