import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { User, Trophy, Swords, Edit2, Check, Calendar, Mail, Shield } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import useMyMatches from '../hooks/useMyMatches';
import { Avatar } from '../components/tournament/ParticipantList';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import StatCard from '../components/dashboard/StatCard';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import { calcWinRate, formatCredits, formatDateTime } from '../utils/formatters';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { matches, isLoading } = useMyMatches();
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { name: user?.name || '', college: user?.college || '' },
  });

  const onSave = async (data) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ name: data.name, college: data.college })
        .eq('id', user._id);
      if (error) throw error;
      updateUser(data);
      toast.success('Profile updated!');
      setEditOpen(false);
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
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
              <span className="text-xs text-text-muted">Member profile</span>
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
          {/* Account summary */}
          <div className="bg-bg-card border border-white/5 rounded-2xl p-6">
            <h2 className="font-display font-semibold text-lg flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-cyan-400" /> Account Summary
            </h2>
            <div className="space-y-3">
              {[
                { icon: Mail, label: 'Email', value: user?.email || 'Not available' },
                { icon: User, label: 'Display Name', value: user?.name || 'Not available' },
                { icon: Shield, label: 'Role', value: user?.role || 'player' },
                { icon: Calendar, label: 'Joined', value: formatDateTime(user?.createdAt) },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3 p-3 rounded-xl bg-bg-elevated">
                  <Icon className="w-4 h-4 text-text-muted mt-0.5" />
                  <div>
                    <p className="text-xs text-text-muted">{label}</p>
                    <p className="text-sm text-text-primary">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Match history */}
          <div className="bg-bg-card border border-white/5 rounded-2xl p-6">
            <h2 className="font-display font-semibold text-lg flex items-center gap-2 mb-4">
              <Swords className="w-5 h-5 text-purple-400" /> Match History
            </h2>
            {isLoading ? (
              <div className="flex justify-center py-6"><div className="w-6 h-6 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" /></div>
            ) : (
              <ActivityFeed matches={matches} />
            )}
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
