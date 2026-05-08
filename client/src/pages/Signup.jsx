import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Zap, User, GraduationCap, AlertCircle } from 'lucide-react';
import useAuth from '../hooks/useAuth';

/* ─── Password strength bar ─── */
function StrengthBar({ password }) {
  const getStrength = (pw) => {
    if (!pw) return 0;
    let s = 0;
    if (pw.length >= 6)                     s++;
    if (pw.length >= 10)                    s++;
    if (/[A-Z]/.test(pw))                   s++;
    if (/[0-9!@#$%^&*]/.test(pw))          s++;
    return s;
  };
  const strength = getStrength(password);
  const labels   = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors   = ['', 'bg-error', 'bg-warning', 'bg-cyan-500', 'bg-success'];

  if (!password) return null;
  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? colors[strength] : 'bg-wine-elevated'}`}
          />
        ))}
      </div>
      <p className={`text-[10px] mt-1 ${strength === 1 ? 'text-error' : strength === 2 ? 'text-warning' : strength === 3 ? 'text-cyan-400' : 'text-success'}`}>
        {labels[strength]}
      </p>
    </div>
  );
}

/* ─── Input field ─── */
function InputField({ label, icon: Icon, type = 'text', value, onChange, placeholder, required, rightSlot, hint }) {
  return (
    <div>
      <label className="text-white/50 text-xs font-medium mb-1.5 block">{label}</label>
      <div className="flex items-center gap-3 px-4 py-3 bg-wine-elevated border border-wine-card focus-within:border-crimson/50 rounded-xl transition-colors">
        <Icon className="w-4 h-4 text-white/30 flex-shrink-0" />
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="flex-1 bg-transparent text-white text-sm placeholder-white/25 outline-none"
        />
        {rightSlot}
      </div>
      {hint && <p className="text-white/25 text-[10px] mt-1">{hint}</p>}
    </div>
  );
}

export default function Signup() {
  const navigate             = useNavigate();
  const { signup, isLoading } = useAuth();
  const [form, setForm]      = useState({ name: '', email: '', college: '', password: '' });
  const [showPw, setShowPw]  = useState(false);
  const [error,  setError]   = useState('');

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await signup(form);
    if (res?.success) navigate('/dashboard');
    else setError(res?.message || 'Could not create account');
  };

  return (
    <div className="min-h-screen bg-wine-main bg-wine-grid flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow blobs */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-crimson/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-credits/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="bg-wine-card border border-crimson/20 rounded-2xl p-8 shadow-card-lg">
          {/* Logo + free credits badge */}
          <div className="flex flex-col items-center mb-6 relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-crimson to-credits flex items-center justify-center mb-3 shadow-glow-crimson-sm">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-white font-bold text-xl font-display">CampusArena</h1>
            <p className="text-white/40 text-sm mt-1">Join your campus gaming scene</p>
            {/* Free credits badge */}
            <span className="absolute top-0 right-0 flex items-center gap-1 px-2.5 py-1 bg-credits/15 border border-credits/30 rounded-full text-credits text-[10px] font-bold">
              <Zap className="w-2.5 h-2.5" /> 500 free credits
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 px-4 py-3 bg-error/10 border border-error/30 rounded-xl text-error text-sm"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            <InputField
              label="Full Name"
              icon={User}
              value={form.name}
              onChange={set('name')}
              placeholder="Alex Smith"
              required
            />
            <InputField
              label="College Email"
              icon={Mail}
              type="email"
              value={form.email}
              onChange={set('email')}
              placeholder="you@college.edu"
              required
              hint="Must be your institutional email (.edu or .ac.in)"
            />
            <InputField
              label="College / University"
              icon={GraduationCap}
              value={form.college}
              onChange={set('college')}
              placeholder="IIT Bombay, MIT, Stanford..."
              required
            />
            <div>
              <label className="text-white/50 text-xs font-medium mb-1.5 block">Password</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-wine-elevated border border-wine-card focus-within:border-crimson/50 rounded-xl transition-colors">
                <Lock className="w-4 h-4 text-white/30 flex-shrink-0" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  placeholder="Min 6 characters"
                  required
                  className="flex-1 bg-transparent text-white text-sm placeholder-white/25 outline-none"
                />
                <button type="button" onClick={() => setShowPw(v => !v)} className="text-white/30 hover:text-white/60 transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <StrengthBar password={form.password} />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-crimson hover:bg-crimson-light rounded-xl text-white font-semibold text-sm transition-all shadow-glow-crimson-sm hover:shadow-glow-crimson disabled:opacity-60 mt-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><Zap className="w-4 h-4 text-credits" /> Create Account — Free ✓</>
              )}
            </button>
          </form>

          <p className="text-center text-white/30 text-xs mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-crimson hover:text-crimson-light transition-colors font-semibold">
              Log in
            </Link>
          </p>
          <p className="text-center text-white/20 text-[10px] mt-3">
            No real money is ever involved on CampusArena.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
