/**
 * CampusArena — Signup Page
 * Features: email-domain college detection, password strength meter,
 * role selection (player / host), form validation.
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Mail, Lock, User, Eye, EyeOff, Shield, Zap, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { validateSignupForm, getPasswordStrength, getStrengthPercent, getStrengthLabel } from '../utils/validators';
import { getCollegeFromEmail, isValidCollegeEmail } from '../utils/colleges';
import { PASSWORD_REQUIREMENTS } from '../utils/constants';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Navbar from '../components/layout/Navbar';

const STRENGTH_COLORS = { weak: 'var(--color-error)', medium: 'var(--color-warning)', strong: 'var(--color-success)' };

const Signup = () => {
  const navigate          = useNavigate();
  const { signup, isLoading } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    college: '',
    password: '',
    confirmPassword: '',
    role: 'player',
    agreedToTerms: false,
  });
  const [errors, setErrors]             = useState({});
  const [showPassword, setShowPassword]         = useState(false);
  const [showConfirm, setShowConfirm]           = useState(false);
  const [collegeDetection, setCollegeDetection] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState('');

  // Live email-domain detection
  useEffect(() => {
    const trimmed = form.email.trim();
    if (!trimmed || !trimmed.includes('@')) {
      setCollegeDetection(null);
      return;
    }

    if (!isValidCollegeEmail(trimmed)) {
      setCollegeDetection({ invalid: true });
      return;
    }

    const detection = getCollegeFromEmail(trimmed);
    setCollegeDetection(detection);

    // Auto-fill college if known
    if (detection?.verified) {
      setForm((prev) => ({ ...prev, college: detection.college }));
    }
  }, [form.email]);

  // Live password strength
  useEffect(() => {
    if (form.password) setPasswordStrength(getPasswordStrength(form.password));
    else setPasswordStrength('');
  }, [form.password]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleRoleChange = (role) => {
    setForm((prev) => ({ ...prev, role }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateSignupForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Scroll to first error
      const firstErrorKey = Object.keys(validationErrors)[0];
      document.querySelector(`[name="${firstErrorKey}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const result = await signup({
      name:     form.name.trim(),
      email:    form.email.trim().toLowerCase(),
      college:  form.college.trim(),
      password: form.password,
      role:     form.role,
    });

    if (result.success) {
      toast.success('Account created! Welcome to CampusArena 🏆');
      navigate('/dashboard');
    } else {
      toast.error(result.error || 'Signup failed. Please try again.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-background)', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div
        className="bg-gaming-dots"
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '40px 20px 60px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glows */}
        <div className="glow-purple" style={{ top: '-100px', right: '-100px', opacity: 0.5 }} />
        <div className="glow-cyan"   style={{ bottom: '-100px', left: '-50px', opacity: 0.3 }} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: '100%',
            maxWidth: 520,
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 20,
            padding: '40px 36px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: 32, textAlign: 'center' }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 0 24px rgba(139,92,246,0.4)',
              }}
            >
              <Shield size={26} color="#fff" />
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 800, marginBottom: 8 }}>
              Create your account
            </h1>
            <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
              Join the campus gaming revolution
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* ── Role Toggle ── */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 10 }}>
                I want to...
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 10,
                }}
              >
                {[
                  { role: 'player', label: '🎮 Play & Compete', desc: 'Join tournaments' },
                  { role: 'host',   label: '🏆 Host Events',    desc: 'Organize tournaments' },
                ].map(({ role, label, desc }) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleChange(role)}
                    style={{
                      padding: '14px 12px',
                      borderRadius: 10,
                      border: `1px solid ${form.role === role ? 'rgba(139,92,246,0.6)' : 'var(--color-border)'}`,
                      background: form.role === role ? 'rgba(139,92,246,0.12)' : 'var(--color-surface-2)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                      boxShadow: form.role === role ? '0 0 12px rgba(139,92,246,0.2)' : 'none',
                    }}
                  >
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 2 }}>{label}</p>
                    <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* ── Full Name ── */}
            <Input
              label="Full Name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Aryan Singh"
              icon={User}
              error={errors.name}
              required
            />

            {/* ── Email (first — triggers college detection) ── */}
            <div>
              <Input
                label="College Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@college.ac.in"
                icon={Mail}
                error={errors.email}
                required
              />

              {/* College detection feedback */}
              {form.email && collegeDetection && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    marginTop: 8,
                    padding: '10px 14px',
                    borderRadius: 8,
                    background: collegeDetection.invalid
                      ? 'rgba(239,68,68,0.08)'
                      : collegeDetection.verified
                      ? 'rgba(16,185,129,0.08)'
                      : 'rgba(245,158,11,0.08)',
                    border: `1px solid ${
                      collegeDetection.invalid
                        ? 'rgba(239,68,68,0.25)'
                        : collegeDetection.verified
                        ? 'rgba(16,185,129,0.25)'
                        : 'rgba(245,158,11,0.25)'
                    }`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  {collegeDetection.invalid ? (
                    <>
                      <AlertTriangle size={14} color="var(--color-error)" />
                      <span style={{ fontSize: 12, color: 'var(--color-error)' }}>
                        Please use your institutional email (.edu / .ac.in / .edu.in)
                      </span>
                    </>
                  ) : collegeDetection.verified ? (
                    <span style={{ fontSize: 12, color: 'var(--color-success)' }}>
                      ✓ Detected: <strong>{collegeDetection.college}</strong>
                    </span>
                  ) : (
                    <span style={{ fontSize: 12, color: 'var(--color-warning)' }}>
                      ⚠ Couldn't auto-detect your college. Please confirm below.
                    </span>
                  )}
                </motion.div>
              )}
            </div>

            {/* ── College Name (shown only when not auto-detected) ── */}
            {(!collegeDetection?.verified || collegeDetection?.needsConfirmation) && !collegeDetection?.invalid && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Input
                  label="College Name"
                  name="college"
                  type="text"
                  value={form.college}
                  onChange={handleChange}
                  placeholder="e.g. Manipal University"
                  error={errors.college}
                  hint={collegeDetection?.needsConfirmation ? 'Auto-filled from your domain — please verify' : undefined}
                  required
                />
              </motion.div>
            )}

            {/* ── Password ── */}
            <div>
              <Input
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                placeholder="Min 8 chars, uppercase, number, symbol"
                icon={Lock}
                error={errors.password}
                required
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex' }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />

              {/* Password strength bar */}
              {form.password && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Password strength</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: STRENGTH_COLORS[passwordStrength] }}>
                      {getStrengthLabel(passwordStrength)}
                    </span>
                  </div>
                  <div className="strength-bar">
                    <motion.div
                      className={`strength-bar-fill strength-${passwordStrength}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${getStrengthPercent(passwordStrength)}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                  {/* Requirements checklist */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px', marginTop: 10 }}>
                    {PASSWORD_REQUIREMENTS.map((req) => {
                      const met = req.test(form.password);
                      return (
                        <span
                          key={req.label}
                          style={{
                            fontSize: 11,
                            color: met ? 'var(--color-success)' : 'var(--color-text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          {met ? '✓' : '·'} {req.label}
                        </span>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>

            {/* ── Confirm Password ── */}
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              icon={Lock}
              error={errors.confirmPassword}
              success={form.confirmPassword && form.password === form.confirmPassword ? 'Passwords match' : undefined}
              required
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex' }}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            {/* ── Terms ── */}
            <div>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  cursor: 'pointer',
                  fontSize: 13,
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.5,
                  userSelect: 'none',
                }}
              >
                <input
                  type="checkbox"
                  name="agreedToTerms"
                  checked={form.agreedToTerms}
                  onChange={handleChange}
                  style={{ accentColor: 'var(--color-primary)', width: 15, height: 15, marginTop: 2, flexShrink: 0 }}
                />
                <span>
                  I agree to CampusArena's{' '}
                  <span style={{ color: 'var(--color-primary)' }}>Terms of Service</span>
                  {' '}and{' '}
                  <span style={{ color: 'var(--color-primary)' }}>Privacy Policy</span>.
                  Virtual credits only — no real money involved.
                </span>
              </label>
              {errors.agreedToTerms && (
                <p style={{ fontSize: 12, color: 'var(--color-error)', marginTop: 6 }}>
                  {errors.agreedToTerms}
                </p>
              )}
            </div>

            {/* ── Submit ── */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isLoading}
              fullWidth
              icon={!isLoading ? <Zap size={16} /> : null}
              style={{ marginTop: 4 }}
            >
              {isLoading ? 'Creating account...' : 'Create Free Account'}
            </Button>
          </form>

          {/* Login link */}
          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--color-text-secondary)', marginTop: 24 }}>
            Already have an account?{' '}
            <Link
              to="/login"
              style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}
              onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline'; }}
              onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none'; }}
            >
              Log in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
