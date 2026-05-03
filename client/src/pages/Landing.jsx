/**
 * CampusArena — Landing Page
 * Public marketing page. Hero, stats, features, how-it-works, games, CTA.
 */

import { Link } from 'react-router';
import { motion } from 'motion/react';
import {
  Zap, Trophy, Shield, Users, ArrowRight, ChevronRight,
  Star, CheckCircle, Swords, Crown, TrendingUp
} from 'lucide-react';
import { PLATFORM_STATS, SUPPORTED_GAMES } from '../utils/constants';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

// ─── Fade-in animation variants ──────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

// ─── Feature cards data ───────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: <Trophy size={28} color="#8b5cf6" />,
    title: 'Host Easily',
    description:
      'Create a tournament in minutes. Set your game, format, and prize. We handle brackets and results automatically.',
    color: 'purple',
  },
  {
    icon: <Shield size={28} color="#06b6d4" />,
    title: 'Compete Fairly',
    description:
      'Transparent single-elimination brackets, verified match results, and a dispute resolution system built for integrity.',
    color: 'cyan',
  },
  {
    icon: <Star size={28} color="#f59e0b" />,
    title: 'Win Big',
    description:
      'Earn trophies, collect achievement badges, and climb your campus leaderboard. Glory stays on your profile forever.',
    color: 'warning',
  },
];

// ─── How it works steps ───────────────────────────────────────────────────────
const HOW_IT_WORKS = [
  {
    step: '01',
    icon: <Users size={22} />,
    title: 'Sign Up With College Email',
    description:
      'Register using your institutional email. CampusArena is 100% college-gated — your rivals are your classmates.',
  },
  {
    step: '02',
    icon: <Swords size={22} />,
    title: 'Join or Host a Tournament',
    description:
      'Browse open tournaments across 9+ games, register with a click, or create your own bracket as a host.',
  },
  {
    step: '03',
    icon: <Crown size={22} />,
    title: 'Compete and Claim Glory',
    description:
      'Play your match, submit the result, collect prizes, and watch your leaderboard rank rise.',
  },
];

// ─── Sponsor logos (placeholders) ────────────────────────────────────────────
const SPONSOR_NAMES = ['Razer', 'HyperX', 'Corsair', 'ASUS ROG', 'MSI', 'SteelSeries'];

// ─── Component ───────────────────────────────────────────────────────────────
const Landing = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-background)' }}>
      <Navbar />

      {/* ══════════════════════════════════════════════
          HERO SECTION
         ══════════════════════════════════════════════ */}
      <section
        className="bg-gaming-grid noise-overlay"
        style={{
          minHeight: '92vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glows */}
        <div className="glow-purple" style={{ top: '-100px', left: '-100px' }} />
        <div className="glow-cyan"   style={{ bottom: '-50px', right: '-50px' }} />

        <div className="container-xl" style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 48,
              alignItems: 'center',
              padding: '80px 0',
            }}
          >
            {/* ── Left: Text ── */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              {/* Tag pill */}
              <motion.div variants={fadeUp} custom={0}>
                <span
                  className="badge badge-purple"
                  style={{ marginBottom: 20, display: 'inline-flex' }}
                >
                  <Zap size={11} />
                  Now live at 20+ campuses
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={fadeUp}
                custom={1}
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(40px, 6vw, 72px)',
                  fontWeight: 800,
                  lineHeight: 1.08,
                  marginBottom: 24,
                  color: 'var(--color-text-primary)',
                }}
              >
                Host Tournaments.{' '}
                <span className="animated-gradient-text">Crown Champions.</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={fadeUp}
                custom={2}
                style={{
                  fontSize: 18,
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.7,
                  maxWidth: 480,
                  marginBottom: 36,
                }}
              >
                The premier skill-based gaming tournament platform built exclusively for
                college campuses. No real money. Pure skill. Infinite glory.
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                variants={fadeUp}
                custom={3}
                style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}
              >
                <Link to="/signup">
                  <Button
                    variant="primary"
                    size="lg"
                    icon={<Zap size={18} />}
                  >
                    Get Started — It's Free
                  </Button>
                </Link>
                <a href="#how-it-works">
                  <Button variant="outline" size="lg">
                    See How It Works
                  </Button>
                </a>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                variants={fadeUp}
                custom={4}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                  marginTop: 32,
                  flexWrap: 'wrap',
                }}
              >
                {['No real money', 'College-exclusive', '100% free to join'].map((text) => (
                  <span
                    key={text}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 13,
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    <CheckCircle size={13} color="var(--color-success)" />
                    {text}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            {/* ── Right: Hero Image ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}
            >
              {/* Glow behind image */}
              <div
                style={{
                  position: 'absolute',
                  width: '70%',
                  height: '70%',
                  background: 'radial-gradient(circle, rgba(139,92,246,0.4), transparent 70%)',
                  filter: 'blur(60px)',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />
              <img
                src="/images/hero.png"
                alt="CampusArena tournament platform"
                style={{
                  width: '100%',
                  maxWidth: 520,
                  borderRadius: 20,
                  position: 'relative',
                  filter: 'drop-shadow(0 0 30px rgba(139,92,246,0.3))',
                }}
                onError={(e) => {
                  // Fallback if image doesn't load
                  e.target.style.display = 'none';
                }}
              />

              {/* Floating stat cards */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  bottom: 20,
                  left: -20,
                  background: 'var(--color-surface)',
                  border: '1px solid rgba(139,92,246,0.3)',
                  borderRadius: 12,
                  padding: '12px 16px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                }}
              >
                <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 2 }}>Active Now</p>
                <p style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                  <span className="text-gradient">47</span> matches
                </p>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                style={{
                  position: 'absolute',
                  top: 20,
                  right: -10,
                  background: 'var(--color-surface)',
                  border: '1px solid rgba(6,182,212,0.3)',
                  borderRadius: 12,
                  padding: '12px 16px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                }}
              >
                <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 2 }}>Top Player</p>
                <p style={{ fontSize: 14, fontWeight: 700 }}>🏆 Aryan D.</p>
                <p style={{ fontSize: 11, color: 'var(--color-success)' }}>12W / 1L</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          STATS BAR
         ══════════════════════════════════════════════ */}
      <section
        style={{
          background: 'var(--color-surface)',
          borderTop: '1px solid var(--color-border)',
          borderBottom: '1px solid var(--color-border)',
          padding: '32px 0',
        }}
      >
        <div className="container-xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: 24,
            }}
          >
            {PLATFORM_STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                custom={i}
                style={{ textAlign: 'center' }}
              >
                <p style={{ fontSize: 32, marginBottom: 4 }}>{stat.icon}</p>
                <p
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 28,
                    fontWeight: 800,
                    marginBottom: 4,
                  }}
                  className="text-gradient"
                >
                  {stat.value}
                </p>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FEATURES
         ══════════════════════════════════════════════ */}
      <section className="section-padding">
        <div className="container-xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
          >
            {/* Section header */}
            <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: 56 }}>
              <span className="badge badge-purple" style={{ marginBottom: 16, display: 'inline-flex' }}>
                Why CampusArena
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(28px, 4vw, 44px)',
                  fontWeight: 800,
                  marginBottom: 16,
                }}
              >
                Everything your campus{' '}
                <span className="text-gradient">gaming scene needs</span>
              </h2>
              <p style={{ fontSize: 16, color: 'var(--color-text-secondary)', maxWidth: 520, margin: '0 auto' }}>
                We built the platform we always wished existed — structured, fair, and built specifically for college communities.
              </p>
            </motion.div>

            {/* Feature cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 24,
              }}
            >
              {FEATURES.map((f, i) => (
                <motion.div key={f.title} variants={fadeUp} custom={i}>
                  <Card
                    hover
                    style={{ padding: 32, height: '100%' }}
                  >
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 12,
                        background: f.color === 'purple'
                          ? 'rgba(139,92,246,0.12)'
                          : f.color === 'cyan'
                          ? 'rgba(6,182,212,0.1)'
                          : 'rgba(245,158,11,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 20,
                        border: `1px solid ${
                          f.color === 'purple'
                            ? 'rgba(139,92,246,0.2)'
                            : f.color === 'cyan'
                            ? 'rgba(6,182,212,0.2)'
                            : 'rgba(245,158,11,0.2)'
                        }`,
                      }}
                    >
                      {f.icon}
                    </div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 20,
                        fontWeight: 700,
                        marginBottom: 12,
                      }}
                    >
                      {f.title}
                    </h3>
                    <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                      {f.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          HOW IT WORKS
         ══════════════════════════════════════════════ */}
      <section
        id="how-it-works"
        className="section-padding"
        style={{ background: 'var(--color-surface)', scrollMarginTop: '80px' }}
      >
        <div className="container-xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: 56 }}>
              <span className="badge badge-cyan" style={{ marginBottom: 16, display: 'inline-flex' }}>
                How It Works
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(28px, 4vw, 44px)',
                  fontWeight: 800,
                  marginBottom: 16,
                }}
              >
                From signup to{' '}
                <span className="text-gradient">campus champion</span>
              </h2>
            </motion.div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 32,
              }}
            >
              {HOW_IT_WORKS.map((step, i) => (
                <motion.div
                  key={step.step}
                  variants={fadeUp}
                  custom={i}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}
                >
                  {/* Step number */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 48,
                        fontWeight: 800,
                        lineHeight: 1,
                        opacity: 0.15,
                        color: 'var(--color-primary)',
                        userSelect: 'none',
                      }}
                    >
                      {step.step}
                    </span>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 10,
                        background: 'rgba(139,92,246,0.12)',
                        border: '1px solid rgba(139,92,246,0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-primary)',
                      }}
                    >
                      {step.icon}
                    </div>
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 18,
                      fontWeight: 700,
                    }}
                  >
                    {step.title}
                  </h3>
                  <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SUPPORTED GAMES
         ══════════════════════════════════════════════ */}
      <section className="section-padding">
        <div className="container-xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: 48 }}>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(24px, 3.5vw, 36px)',
                  fontWeight: 800,
                  marginBottom: 12,
                }}
              >
                9 games and counting
              </h2>
              <p style={{ fontSize: 15, color: 'var(--color-text-secondary)' }}>
                More games added based on campus demand
              </p>
            </motion.div>

            <motion.div
              variants={stagger}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: 16,
              }}
            >
              {SUPPORTED_GAMES.map((game, i) => (
                <motion.div
                  key={game.id}
                  variants={fadeUp}
                  custom={i}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card
                    hover
                    style={{
                      padding: '20px 12px',
                      textAlign: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <p style={{ fontSize: 28, marginBottom: 8 }}>{game.icon}</p>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', lineHeight: 1.3 }}>
                      {game.name}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SPONSORS PLACEHOLDER
         ══════════════════════════════════════════════ */}
      <section
        style={{
          background: 'var(--color-surface)',
          borderTop: '1px solid var(--color-border)',
          padding: '48px 0',
        }}
        id="sponsors"
      >
        <div className="container-xl">
          <p
            style={{
              textAlign: 'center',
              fontSize: 12,
              color: 'var(--color-text-muted)',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              fontWeight: 600,
              marginBottom: 32,
            }}
          >
            Tournament Sponsors
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 32,
              alignItems: 'center',
            }}
          >
            {SPONSOR_NAMES.map((name) => (
              <div
                key={name}
                style={{
                  padding: '10px 24px',
                  background: 'var(--color-surface-2)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 700,
                  color: 'var(--color-text-muted)',
                  letterSpacing: '0.5px',
                }}
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CTA SECTION
         ══════════════════════════════════════════════ */}
      <section className="section-padding bg-gaming-grid" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="glow-purple" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
        <div className="container-md" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeUp}>
              <TrendingUp size={48} color="var(--color-primary)" style={{ margin: '0 auto 24px' }} />
            </motion.div>
            <motion.h2
              variants={fadeUp}
              custom={1}
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(28px, 4vw, 48px)',
                fontWeight: 800,
                marginBottom: 20,
              }}
            >
              Ready to dominate{' '}
              <span className="animated-gradient-text">your campus?</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={2}
              style={{ fontSize: 17, color: 'var(--color-text-secondary)', marginBottom: 36 }}
            >
              Join 500+ players already competing. Sign up in 60 seconds.
            </motion.p>
            <motion.div
              variants={fadeUp}
              custom={3}
              style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
            >
              <Link to="/signup">
                <Button variant="primary" size="lg" icon={<Zap size={18} />}>
                  Create Free Account
                </Button>
              </Link>
              <Link to="/tournaments">
                <Button variant="outline" size="lg" icon={<ArrowRight size={18} />}>
                  Browse Tournaments
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
