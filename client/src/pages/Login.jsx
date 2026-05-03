/**
 * CampusArena — Login Page
 */

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, Trophy, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { validateLoginForm } from '../utils/validators';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Navbar from '../components/layout/Navbar';

const Login = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login, isLoading } = useAuth();

  const [form, setForm]           = useState({ email: '', password: '' });
  const [errors, setErrors]       = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe]     = useState(false);

  // Where to redirect after login
  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateLoginForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const result = await login(form.email, form.password);
    if (result.success) {
      toast.success('Welcome back! 🎮');
      navigate(from, { replace: true });
    } else {
      toast.error(result.error || 'Login failed. Please try again.');
      setErrors({ password: 'Invalid email or password' });
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-background)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Navbar />

      <div
        className="bg-gaming-grid"
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glows */}
        <div className="glow-purple" style={{ top: '-200px', left: '-200px', opacity: 0.6 }} />
        <div className="glow-cyan"   style={{ bottom: '-100px', right: '-100px', opacity: 0.4 }} />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 0,
            maxWidth: 900,
            width: '100%',
            borderRadius: 20,
            overflow: 'hidden',
            border: '1px solid var(--color-border)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
            position: 'relative',
            zIndex: 1,
          }}
          className="login-grid"
        >
          {/* ── Left: Form ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: 'var(--color-surface)',
              padding: '48px 40px',
            }}
          >
            {/* Header */}
            <div style={{ marginBottom: 36 }}>
              <h1
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 28,
                  fontWeight: 800,
                  marginBottom: 8,
                }}
              >
                Welcome back
              </h1>
              <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
                Log in to your CampusArena account
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <Input
                label="College Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@college.ac.in"
                icon={Mail}
                error={errors.email}
                hint="Use your institutional email address"
                required
              />

              <Input
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                icon={Lock}
                error={errors.password}
                required
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--color-text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      padding: 0,
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />

              {/* Remember me + Forgot password row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 8,
                }}
              >
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    fontSize: 13,
                    color: 'var(--color-text-secondary)',
                    userSelect: 'none',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ accentColor: 'var(--color-primary)', width: 15, height: 15 }}
                  />
                  Remember me
                </label>
                <span
                  style={{
                    fontSize: 13,
                    color: 'var(--color-primary)',
                    cursor: 'pointer',
                    transition: 'opacity 0.2s',
                  }}
                  onClick={() => toast('Password reset coming soon! 📧')}
                >
                  Forgot password?
                </span>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isLoading}
                fullWidth
                icon={!isLoading ? <Zap size={16} /> : null}
              >
                {isLoading ? 'Logging in...' : 'Log In'}
              </Button>
            </form>

            {/* Divider */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                margin: '28px 0',
              }}
            >
              <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>or</span>
              <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
            </div>

            {/* Signup link */}
            <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--color-text-secondary)' }}>
              Don't have an account?{' '}
              <Link
                to="/signup"
                style={{
                  color: 'var(--color-primary)',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline'; }}
                onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none'; }}
              >
                Sign up free
              </Link>
            </p>
          </motion.div>

          {/* ── Right: Decorative Panel ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="login-deco"
            style={{
              background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(6,182,212,0.15))',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 48,
              gap: 24,
              borderLeft: '1px solid var(--color-border)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Grid background pattern */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage:
                  'linear-gradient(rgba(139,92,246,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.08) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            <div style={{ position: 'relative', textAlign: 'center' }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 20,
                  background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  boxShadow: '0 0 40px rgba(139,92,246,0.4)',
                }}
              >
                <Trophy size={36} color="#fff" />
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 24,
                  fontWeight: 800,
                  marginBottom: 12,
                }}
              >
                Campus<span className="text-gradient">Arena</span>
              </h2>
              <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.7, maxWidth: 260 }}>
                The premier skill-based tournament platform. Built for campus warriors.
              </p>

              {/* Feature list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 32, textAlign: 'left' }}>
                {[
                  '🎮 9+ supported games',
                  '🏆 Single-elim brackets',
                  '🎓 College-exclusive access',
                  '💳 Virtual credits — no real money',
                ].map((item) => (
                  <p
                    key={item}
                    style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}
                  >
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 680px) {
          .login-grid { grid-template-columns: 1fr !important; }
          .login-deco { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Login;
