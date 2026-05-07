import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Trophy, Calendar, Users, FileText, Zap,
} from 'lucide-react';
import useTournamentStore from '../store/tournamentStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { GAMES, TOURNAMENT_FORMATS } from '../utils/constants';

const CreateTournament = () => {
  const navigate = useNavigate();
  const { createTournament } = useTournamentStore();
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      game: '',
      format: 'single-elim',
      entryFee: 50,
      prizePool: 500,
      maxParticipants: 8,
      startDate: '',
      endDate: '',
      rules: '',
    },
  });

  const watchEntryFee = useWatch({ control, name: 'entryFee' });
  const watchMaxParticipants = useWatch({ control, name: 'maxParticipants' });
  const watchPrizePool = useWatch({ control, name: 'prizePool' });

  const suggestedPrizePool = (Number(watchEntryFee) || 0) * (Number(watchMaxParticipants) || 0);

  const onSubmit = async (formData) => {
    setSubmitting(true);
    const result = await createTournament(formData);
    setSubmitting(false);

    if (result.success && result.data?._id) {
      navigate(`/tournaments/${result.data._id}`);
    }
  };

  return (
    <div className="min-h-screen bg-grid pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <button
          onClick={() => navigate('/tournaments')}
          className="flex items-center gap-2 text-text-muted hover:text-text-primary text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tournaments
        </button>

        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">
            Host a <span className="gradient-text">Tournament</span>
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Simple setup form for a classroom-friendly frontend flow.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-bg-card border border-white/10 rounded-2xl p-6 sm:p-8 space-y-5"
          >
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-warning" />
              <h2 className="font-display font-semibold text-lg">Tournament Details</h2>
            </div>

            <Input
              label="Tournament Title"
              placeholder="e.g. Campus Valorant Knockout"
              error={errors.title?.message}
              {...register('title', {
                required: 'Title is required',
                minLength: { value: 5, message: 'At least 5 characters' },
              })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-secondary">Game *</label>
                <select
                  className={`bg-bg-elevated border rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-purple-500/40 ${errors.game ? 'border-error' : 'border-white/10'}`}
                  {...register('game', { required: 'Select a game' })}
                >
                  <option value="">Select a game</option>
                  {GAMES.map((game) => (
                    <option key={game} value={game}>{game}</option>
                  ))}
                </select>
                {errors.game && <p className="text-xs text-error">{errors.game.message}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-secondary">Format *</label>
                <select
                  className="bg-bg-elevated border border-white/10 rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                  {...register('format')}
                >
                  {TOURNAMENT_FORMATS.map((format) => (
                    <option key={format.value} value={format.value}>{format.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Entry Fee"
                type="number"
                icon={Zap}
                error={errors.entryFee?.message}
                {...register('entryFee', {
                  required: 'Entry fee is required',
                  min: { value: 0, message: 'Minimum 0 credits' },
                })}
              />

              <Input
                label="Prize Pool"
                type="number"
                icon={Trophy}
                error={errors.prizePool?.message}
                {...register('prizePool', {
                  required: 'Prize pool is required',
                  min: { value: 0, message: 'Minimum 0 credits' },
                })}
              />

              <Input
                label="Max Participants"
                type="number"
                icon={Users}
                error={errors.maxParticipants?.message}
                {...register('maxParticipants', {
                  required: 'Participant limit is required',
                  min: { value: 2, message: 'Minimum 2 participants' },
                  max: { value: 64, message: 'Maximum 64 participants' },
                })}
              />
            </div>

            <div className="bg-bg-elevated rounded-xl p-4 text-sm text-text-muted">
              Suggested full pot: <span className="text-cyan-400 font-semibold">{suggestedPrizePool} ⚡</span>
              {' '}based on current entry fee and participant count.
              {' '}Current prize pool: <span className="text-success font-semibold">{watchPrizePool || 0} ⚡</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Start Date & Time"
                type="datetime-local"
                icon={Calendar}
                error={errors.startDate?.message}
                {...register('startDate', { required: 'Start date is required' })}
              />

              <Input
                label="End Date & Time"
                type="datetime-local"
                icon={Calendar}
                error={errors.endDate?.message}
                {...register('endDate')}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-secondary">Rules</label>
              <div className="relative">
                <FileText className="w-4 h-4 text-text-muted absolute left-3 top-3.5" />
                <textarea
                  rows={5}
                  placeholder="Explain the rules in plain language. Example: single elimination, screenshot proof required, 10 minute grace period."
                  className="w-full bg-bg-elevated border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-purple-500/40 resize-none"
                  {...register('rules')}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="ghost" type="button" onClick={() => navigate('/tournaments')} className="flex-1">
                Cancel
              </Button>
              <Button variant="primary" type="submit" loading={submitting} icon={Trophy} className="flex-1">
                Create Tournament
              </Button>
            </div>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default CreateTournament;
