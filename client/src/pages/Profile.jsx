import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { User, Trophy, Swords, Star, Edit2, Check } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { Avatar } from '../components/tournament/ParticipantList';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import StatCard from '../components/dashboard/StatCard';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import { calcWinRate, formatCredits } from '../utils/formatters';
import { MOCK_MY_MATCHES } from '../utils/mockData';

const BADGE_COLORS = {
  'Campus Champion': 'purple',
  'Valorant Pro': 'cyan',
  'Chess Master': 'success',
  'Tournament Host': 'warning',
  'Newcomer': 'muted',
  'Veteran': 'purple',
  'Legend': 'cyan',
  'BGMI King': 'success',
  'Undefeated': 'warning',
};

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { name: user?.name || '', college: user?.college || '' },
  });

  const onSave = async (data) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800)); // mock save
    updateUser(data);
    setSaving(false);
    setEditOpen(false);
  };

  const stats = user?.stats || {};
  const winRate = calcWinRate(stats.matchesWon, stats.matchesPlayed);

  return (
    <div className="min-h-screen bg-grid pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-bg-card border border-white/10 rounded-2xl overflow-hidden"
        >
          <div className="h-24 bg-gradient-to-r from-purple-600/40 via-pink-600/20 to-cyan-600/40" />
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10 mb-4">
              <div className="flex items-end gap-4">
                <div className="ring-4 ring-bg-card rounded-full">
                  <Avatar user={user} size="xl" />
                </div>
                <div className="mb-1">
                  <h1 className="font-display text-2xl font-bold text-text-primary">{user?.name}</h1>
                  <p className="text-text-muted text-sm">{user?.email}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" icon={Edit2} onClick={() => setEditOpen(true)}>
                Edit Profile
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="muted">{user?.college}</Badge>
              <Badge variant={user?.role === 'host' ? 'cyan' : 'purple'}>{user?.role}</Badge>
              <span className="text-xs text-text-muted">Rank #{user?.rank || '—'}</span>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Matches Played" value={stats.matchesPlayed || 0} icon={Swords} accent="purple" />
          <StatCard label="Matches Won" value={stats.matchesWon || 0} icon={Trophy} accent="cyan" />
          <StatCard label="Win Rate" value={winRate} accent="success" />
          <StatCard label="Credits" value={formatCredits(user?.credits || 0, false)} accent="warning" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Badges */}
          <div className="bg-bg-card border border-white/5 rounded-2xl p-6">
            <h2 className="font-display font-semibold text-lg flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-warning" /> Badges
            </h2>
            {user?.badges?.length ? (
              <div className="flex flex-wrap gap-2">
                {user.badges.map((badge) => (
                  <Badge key={badge} variant={BADGE_COLORS[badge] || 'muted'} size="md">
                    {badge}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-text-muted text-sm">No badges yet. Win matches to earn them!</p>
            )}
          </div>

          {/* Match history */}
          <div className="bg-bg-card border border-white/5 rounded-2xl p-6">
            <h2 className="font-display font-semibold text-lg flex items-center gap-2 mb-4">
              <Swords className="w-5 h-5 text-purple-400" /> Match History
            </h2>
            <ActivityFeed matches={MOCK_MY_MATCHES} />
          </div>
        </div>
      </div>

      {/* Edit modal */}
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit Profile" size="sm">
        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <Input
            label="Display Name"
            icon={User}
            error={errors.name?.message}
            {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })}
          />
          <Input
            label="College"
            error={errors.college?.message}
            {...register('college', { required: 'College is required' })}
          />
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" fullWidth type="button" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button variant="primary" fullWidth type="submit" loading={saving} icon={Check}>Save Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Profile;
