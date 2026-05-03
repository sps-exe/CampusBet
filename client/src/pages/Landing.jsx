import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap, Trophy, Gamepad2, BarChart2, ArrowRight,
  Shield, Users, Star, ChevronRight,
} from 'lucide-react';
import useAuth from '../hooks/useAuth';

const features = [
  {
    icon: Gamepad2,
    title: 'Create Lobbies',
    desc: 'Set up 1v1 or squad matches with a bid amount. Control who joins.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
  },
  {
    icon: Zap,
    title: 'Place Bids',
    desc: 'Put your campus credits on the line. Spectators can back their favourite player too.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
  },
  {
    icon: Trophy,
    title: 'Win & Climb',
    desc: 'Winners collect all credits. Rise through the campus leaderboard.',
    color: 'text-warning',
    bg: 'bg-warning/10',
    border: 'border-warning/20',
  },
];

const steps = [
  { num: '01', title: 'Sign up with college email', desc: 'Only students at your institution can join. You get 500 ⚡ credits to start.' },
  { num: '02', title: 'Find or create a lobby', desc: 'Browse open matches or host your own. Set the bid and the game.' },
  { num: '03', title: 'Play & collect', desc: 'Win the match, claim the credits. Build your reputation on campus.' },
];

const games = ['Valorant', 'Chess', 'FIFA / EA FC', 'BGMI', 'Smash Bros', 'Mario Kart', 'Carrom', 'Table Tennis'];

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated]);

  return (
    <div className="bg-grid min-h-screen text-text-primary">
      {/* ── Navbar ── */}
      <header className="fixed top-0 inset-x-0 z-40 border-b border-white/5 bg-bg-primary/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display font-bold text-xl">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="gradient-text">CampusBet</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Log in</Link>
            <Link to="/signup" className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold transition-all shadow-glow-purple-sm hover:shadow-glow-purple">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative pt-36 pb-24 px-6 overflow-hidden">
        {/* Glow blobs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-32 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-sm font-medium mb-6">
              <span className="status-live" /> College-exclusive · Campus credits only
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-6"
          >
            Put Your{' '}
            <span className="gradient-text text-glow-purple">Skills</span>
            <br />
            On The Line
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-text-secondary text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            CampusBet is a college-exclusive skill-based gaming platform.
            Challenge peers, place campus credit bids, and prove you're the best on campus.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-purple-500 hover:bg-purple-600 text-white text-base font-bold transition-all shadow-glow-purple hover:shadow-glow-purple active:scale-95"
            >
              Start Competing <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/10 hover:border-white/20 text-text-primary text-base font-semibold transition-all hover:bg-white/5"
            >
              Log in
            </Link>
          </motion.div>

          {/* Games ticker */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-14 flex flex-wrap justify-center gap-2"
          >
            {games.map((g) => (
              <span key={g} className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-text-muted text-xs">{g}</span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-center mb-3">Why CampusBet?</h2>
          <p className="text-text-muted text-center mb-12 max-w-xl mx-auto">Built for campus gaming culture. No real money — just pure skill on the line.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`bg-bg-card border ${f.border} rounded-2xl p-6 flex flex-col gap-4`}
              >
                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="font-display text-lg font-semibold">{f.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 px-6 bg-bg-secondary/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="space-y-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex gap-5 items-start"
              >
                <span className="font-display text-4xl font-black gradient-text leading-none flex-shrink-0">{step.num}</span>
                <div>
                  <h3 className="font-display font-semibold text-lg mb-1">{step.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust badges ── */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { icon: Shield, label: 'Zero real money', desc: 'Campus credits only. Fully legal.' },
            { icon: Users, label: 'College-gated', desc: 'Only your campus peers. Safe & trusted.' },
            { icon: Star, label: 'Skill-based', desc: 'You play. You win. No luck involved.' },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-purple-400" />
              </div>
              <p className="font-semibold text-text-primary text-sm">{label}</p>
              <p className="text-text-muted text-xs">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-bg-card border border-purple-500/20 rounded-2xl p-10">
            <h2 className="font-display text-3xl font-bold mb-4">Ready to dominate?</h2>
            <p className="text-text-muted mb-8">Sign up with your college email and get 500 ⚡ credits instantly.</p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-bold transition-all hover:opacity-90 active:scale-95 shadow-glow-purple"
            >
              Create Free Account <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-8 px-6 text-center text-text-muted text-sm">
        <p>© 2025 CampusBet · College-exclusive · No real money involved · Built for capstone</p>
      </footer>
    </div>
  );
};

export default Landing;
