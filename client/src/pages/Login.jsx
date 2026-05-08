import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Zap, AlertCircle } from 'lucide-react';
import useAuth from '../hooks/useAuth';

export default function Login() {
  const navigate              = useNavigate();
  const { login, isLoading }  = useAuth();
  const [email,    setEmail]  = useState('');
  const [password, setPass]   = useState('');
  const [showPw,   setShowPw] = useState(false);
  const [error,    setError]  = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login({ email, password });
    if (res?.success) navigate('/dashboard');
    else setError(res?.message || 'Invalid email or password');
  };

  return (
    <div className="min-h-screen bg-wine-main bg-wine-grid flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-crimson/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-credits/6 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        {/* Card */}
        <div className="bg-wine-card border border-crimson/20 rounded-2xl p-8 shadow-card-lg">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-crimson to-credits flex items-center justify-center mb-3 shadow-glow-crimson-sm">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-white font-bold text-xl font-display">CampusArena</h1>
            <p className="text-white/40 text-sm mt-1">Welcome back, champion</p>
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

            {/* Email */}
            <div>
              <label className="text-white/50 text-xs font-medium mb-1.5 block">College Email</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-wine-elevated border border-wine-card focus-within:border-crimson/50 rounded-xl transition-colors">
                <Mail className="w-4 h-4 text-white/30 flex-shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@college.edu"
                  required
                  className="flex-1 bg-transparent text-white text-sm placeholder-white/25 outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-white/50 text-xs font-medium mb-1.5 block">Password</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-wine-elevated border border-wine-card focus-within:border-crimson/50 rounded-xl transition-colors">
                <Lock className="w-4 h-4 text-white/30 flex-shrink-0" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPass(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="flex-1 bg-transparent text-white text-sm placeholder-white/25 outline-none"
                />
                <button type="button" onClick={() => setShowPw(v => !v)} className="text-white/30 hover:text-white/60 transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-crimson hover:bg-crimson-light rounded-xl text-white font-semibold text-sm transition-all shadow-glow-crimson-sm hover:shadow-glow-crimson disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><Zap className="w-4 h-4 text-credits" /> Log in →</>
              )}
            </button>
          </form>

          <p className="text-center text-white/30 text-xs mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-crimson hover:text-crimson-light transition-colors font-semibold">
              Sign up free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
