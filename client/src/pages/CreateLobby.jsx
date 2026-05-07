import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm, useWatch } from 'react-hook-form';
import { ArrowLeft, Gamepad2, Zap, Clock, FileText, ChevronRight } from 'lucide-react';
import useLobbies from '../hooks/useLobbies';
import useAuth from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { GAMES, LOBBY_FORMATS } from '../utils/constants';

const STEPS = ['Game & Format', 'Bid & Schedule', 'Rules & Review'];

const CreateLobby = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createLobby } = useLobbies(false);
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const { control, register, handleSubmit, formState: { errors }, trigger } = useForm({
    defaultValues: {
      game: '', format: '1v1', maxPlayers: 2,
      bidAmount: 100, scheduledAt: '',
      title: '', description: '',
    },
  });

  const watchGame = useWatch({ control, name: 'game' });
  const watchFormat = useWatch({ control, name: 'format' });
  const watchBid = useWatch({ control, name: 'bidAmount' });

  const stepFields = [
    ['game', 'format', 'title'],
    ['bidAmount', 'scheduledAt'],
    ['description'],
  ];

  const nextStep = async () => {
    const valid = await trigger(stepFields[step]);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    const maxPlayers = data.format === '1v1' ? 2 : data.format === '2v2' ? 4 : data.format === 'squad' ? 4 : 4;
    const result = await createLobby({
      title: data.title,
      game: data.game,
      bidAmount: data.bidAmount,
      scheduledAt: data.scheduledAt,
      description: data.description,
      maxPlayers,
    });
    setSubmitting(false);
    if (result.success) navigate('/lobbies');
  };

  return (
    <div className="min-h-screen bg-grid pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate('/lobbies')} className="flex items-center gap-2 text-text-muted hover:text-text-primary text-sm transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Lobbies
        </button>

        <div className="mb-8">
          <h1 className="font-display text-2xl sm:text-3xl font-bold">Create a <span className="gradient-text">Lobby</span></h1>
          <p className="text-text-muted text-sm mt-1">Set the stakes and challenge your campus</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                i < step ? 'bg-success text-white' : i === step ? 'bg-purple-500 text-white' : 'bg-bg-elevated text-text-muted'
              }`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-xs hidden sm:block ${i === step ? 'text-text-primary font-medium' : 'text-text-muted'}`}>
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 rounded ${i < step ? 'bg-success' : 'bg-bg-elevated'}`} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="bg-bg-card border border-white/10 rounded-2xl p-6 sm:p-8 space-y-5"
          >
            {/* Step 0: Game & Format */}
            {step === 0 && (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <Gamepad2 className="w-5 h-5 text-purple-400" />
                  <h2 className="font-display font-semibold text-lg">Game & Format</h2>
                </div>

                <Input
                  label="Lobby Title"
                  placeholder="e.g. Valorant 1v1 — No Mercy"
                  error={errors.title?.message}
                  {...register('title', { required: 'Title is required', minLength: { value: 5, message: 'At least 5 characters' } })}
                />

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-text-secondary">Game *</label>
                  <select
                    className={`bg-bg-elevated border rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-purple-500/40 ${errors.game ? 'border-error' : 'border-white/10'}`}
                    {...register('game', { required: 'Select a game' })}
                  >
                    <option value="">Select a game</option>
                    {GAMES.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                  {errors.game && <p className="text-xs text-error">{errors.game.message}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-text-secondary">Format *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {LOBBY_FORMATS.map((f) => (
                      <label key={f.value} className={`cursor-pointer border rounded-xl p-3 text-center transition-all ${
                        watchFormat === f.value
                          ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                          : 'border-white/10 text-text-muted hover:border-white/20'
                      }`}>
                        <input type="radio" value={f.value} className="sr-only" {...register('format')} />
                        <p className="text-xs font-semibold">{f.label}</p>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Step 1: Bid & Schedule */}
            {step === 1 && (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  <h2 className="font-display font-semibold text-lg">Bid & Schedule</h2>
                </div>

                <div>
                  <Input
                    label="Bid Amount (⚡ credits per player)"
                    type="number"
                    placeholder="100"
                    icon={Zap}
                    error={errors.bidAmount?.message}
                    {...register('bidAmount', {
                      required: 'Bid amount required',
                      min: { value: 10, message: 'Minimum 10 credits' },
                      max: { value: user?.credits || 9999, message: `Max ${user?.credits} (your balance)` },
                    })}
                  />
                  <p className="text-xs text-text-muted mt-1.5">
                    Your balance: <span className="text-cyan-400 font-semibold">{user?.credits} ⚡</span> · Prize pool: <span className="text-success font-semibold">{(watchBid || 0) * (watchFormat === '1v1' ? 2 : 4)} ⚡</span>
                  </p>
                </div>

                <Input
                  label="Scheduled Date & Time"
                  type="datetime-local"
                  icon={Clock}
                  error={errors.scheduledAt?.message}
                  {...register('scheduledAt', { required: 'Schedule is required' })}
                />

                <div className="bg-bg-elevated rounded-xl p-4 flex items-start gap-3">
                  <Zap className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-text-muted leading-relaxed">
                    Keep the bid amount realistic for your campus matches. Results are added after the lobby is completed.
                  </p>
                </div>
              </>
            )}

            {/* Step 2: Rules & Review */}
            {step === 2 && (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-success" />
                  <h2 className="font-display font-semibold text-lg">Rules & Review</h2>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-text-secondary">Match Rules (optional)</label>
                  <textarea
                    rows={4}
                    placeholder="e.g. Best of 3, no custom tactics, screenshot proof required..."
                    className="bg-bg-elevated border border-white/10 rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-purple-500/40 resize-none"
                    {...register('description')}
                  />
                </div>

                {/* Summary */}
                <div className="bg-bg-elevated rounded-xl p-5 space-y-3">
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Review</p>
                  {[
                    { label: 'Game', value: watchGame || 'Not selected' },
                    { label: 'Format', value: watchFormat || 'Not selected' },
                    { label: 'Bid', value: `${watchBid || 0} ⚡ per player` },
                    { label: 'College', value: user?.college },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-text-muted">{label}</span>
                      <span className="text-text-primary font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Navigation */}
            <div className="flex gap-3 pt-2">
              {step > 0 && (
                <Button variant="ghost" onClick={() => setStep((s) => s - 1)} type="button" className="flex-1">← Back</Button>
              )}
              {step < STEPS.length - 1 ? (
                <Button variant="primary" onClick={nextStep} type="button" className="flex-1" icon={ChevronRight}>
                  Continue
                </Button>
              ) : (
                <Button variant="primary" type="submit" loading={submitting} className="flex-1" icon={Gamepad2}>
                  Create Lobby
                </Button>
              )}
            </div>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default CreateLobby;
