import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm, useWatch } from 'react-hook-form';
import { Zap, Mail, Lock, User, Eye, EyeOff, CheckCircle } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { COLLEGE_EMAIL_REGEX } from '../utils/constants';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');

  const { control, register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const watchPassword = useWatch({ control, name: 'password', defaultValue: '' });

  const onSubmit = async (data) => {
    setApiError('');
    const result = await signup({ name: data.name, email: data.email, password: data.password, college: data.college });
    if (result.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setApiError(result.message || 'Something went wrong. Please try again.');
    }
  };

  const passwordStrength = (pw) => {
    if (!pw) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const levels = [
      { label: '', color: '' },
      { label: 'Weak', color: 'bg-error' },
      { label: 'Fair', color: 'bg-warning' },
      { label: 'Good', color: 'bg-cyan-400' },
      { label: 'Strong', color: 'bg-success' },
    ];
    return { score, ...levels[score] };
  };

  const strength = passwordStrength(watchPassword);

  return (
    <div className="min-h-screen bg-grid flex items-center justify-center p-4">
      <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-2xl mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-glow-purple">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="gradient-text">CampusArena</span>
          </Link>
          <p className="text-text-muted text-sm">Join your campus gaming scene</p>
        </div>

        <div className="bg-bg-card border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-display text-xl font-bold text-text-primary">Create account</h1>
            <div className="flex items-center gap-1 text-xs text-cyan-400 font-medium">
              <Zap className="w-3.5 h-3.5" /> 500 free credits
            </div>
          </div>

          {apiError && (
            <div className="mb-4 px-4 py-3 bg-error/10 border border-error/30 rounded-xl text-sm text-error">{apiError}</div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Alex Smith"
              icon={User}
              error={errors.name?.message}
              {...register('name', {
                required: 'Name is required',
                minLength: { value: 2, message: 'At least 2 characters' },
              })}
            />

            <Input
              label="College Email"
              type="email"
              placeholder="you@college.edu"
              icon={Mail}
              error={errors.email?.message}
              hint="Must be your college-issued email address"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: COLLEGE_EMAIL_REGEX, message: 'Must be a valid college email (.edu or .ac.in)' },
              })}
            />

            <Input
              label="College / University"
              placeholder="MIT · IIT Bombay · Stanford..."
              error={errors.college?.message}
              {...register('college', { required: 'College is required' })}
            />

            <div>
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 6 characters"
                  icon={Lock}
                  error={errors.password?.message}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Minimum 6 characters' },
                  })}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-8 text-text-muted hover:text-text-primary transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {watchPassword && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength.score ? strength.color : 'bg-bg-elevated'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-text-muted">{strength.label}</p>
                </div>
              )}
            </div>

            <Button type="submit" variant="primary" fullWidth loading={isSubmitting} className="mt-2" icon={CheckCircle}>
              Create Account — Free
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/5 text-center">
            <p className="text-text-muted text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium">Log in</Link>
            </p>
          </div>

          <p className="text-xs text-text-muted text-center mt-4 leading-relaxed">
            By signing up you agree to our Terms of Service. No real money is ever involved on CampusArena.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
