import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap, Trophy, Gamepad2, ArrowRight,
  Shield, Users, ChevronRight, TrendingUp,
} from 'lucide-react';

const features = [
  {
    icon: Gamepad2,
    title: 'Create Lobbies',
    desc: 'Host 1v1 or squad matches with a credit bid. You control who joins and when it starts.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
  },
  {
    icon: Zap,
    title: 'Bid with Credits',
    desc: 'Use virtual campus credits to enter matches. No real money — ever.',
    color: 'text-credits',
    bg: 'bg-credits/10',
    border: 'border-credits/20',
  },
  {
    icon: Trophy,
    title: 'Win & Climb',
    desc: 'Beat opponents, grow your balance, and rise to the top of the campus leaderboard.',
    color: 'text-crimson',
    bg: 'bg-crimson/10',
    border: 'border-crimson/20',
  },
];

const steps = [
  { num: '01', title: 'Sign up with college email', desc: 'Only students from your institution can join. You get 500 ⚡ credits instantly.' },
  { num: '02', title: 'Find or create a lobby',     desc: 'Browse open matches or host your own. Set the bid amount and the game.' },
  { num: '03', title: 'Play & report results',      desc: 'Finish the match, submit the result, and watch your leaderboard rank climb.' },
];

const games = ['Valorant', 'Chess', 'FIFA / EA FC', 'BGMI', 'Smash Bros', 'Mario Kart', 'Carrom', 'Table Tennis'];

export default function Landing() {
  return (
    <div className="min-h-screen bg-wine-main text-white relative overflow-x-hidden">

      {/* ── Background glow blobs ── */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-crimson/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/3 right-1/4 w-80 h-80 bg-purple-500/4 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-1/2 w-[400px] h-64 bg-credits/4 rounded-full blur-3xl pointer-events-none" />

      {/* ── NAVBAR ── */}
      <header className="fixed top-0 inset-x-0 z-40 border-b border-crimson/15 bg-wine-main/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-crimson to-credits flex items-center justify-center shadow-glow-crimson-sm">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg bg-gradient-to-r from-crimson to-credits bg-clip-text text-transparent">
              CampusArena
            </span>
          </div>
          {/* Nav links */}
          <div className="hidden md:flex items-center gap-6 text-sm text-white/50">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how" className="hover:text-white transition-colors">How it Works</a>
          </div>
          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-white/50 hover:text-white transition-colors">Log in</Link>
            <Link
              to="/signup"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-crimson hover:bg-crimson-light text-white text-sm font-semibold transition-all shadow-glow-crimson-sm"
            >
              Get Started <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative pt-40 pb-28 px-6">
        <div className="max-w-4xl mx-auto text-center">

          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-crimson/30 bg-crimson/10 text-crimson text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-crimson animate-pulse" />
              College-exclusive · Campus credits only
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.05] mb-6"
          >
            Put Your{' '}
            <span className="bg-gradient-to-r from-crimson via-crimson-light to-credits bg-clip-text text-transparent">
              Skills
            </span>
            <br />On The Line
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/50 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            CampusArena is a college-exclusive skill-based gaming platform.
            Challenge your peers, place credit bids, and prove you're the best on campus.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-crimson to-crimson-light hover:from-crimson-light hover:to-crimson text-white text-base font-bold transition-all shadow-glow-crimson active:scale-95"
            >
              Start Competing <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-white/10 hover:border-white/25 text-white/70 hover:text-white text-base font-semibold transition-all hover:bg-white/5 active:scale-95"
            >
              Log in →
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
              <span key={g} className="px-3 py-1.5 rounded-full border border-white/10 bg-wine-card text-white/40 text-xs font-medium hover:border-crimson/30 hover:text-white/60 transition-colors cursor-default">
                {g}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="py-10 px-6 border-y border-wine-card">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[
            { value: 'Campus', label: 'Exclusive Access', icon: Users },
            { value: 'Skill', label: 'Based Matches', icon: Gamepad2 },
            { value: '₹0',   label: 'Real Money Used', icon: Shield },
          ].map(({ value, label, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <Icon className="w-5 h-5 text-crimson mb-1 opacity-60" />
              <p className="font-display font-bold text-2xl text-white">{value}</p>
              <p className="text-white/40 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">Why CampusArena?</h2>
            <p className="text-white/40 max-w-xl mx-auto">Built for campus gaming culture. No real money — just pure skill and campus pride.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`bg-wine-card border ${f.border} rounded-2xl p-6 flex flex-col gap-4 hover:border-crimson/30 transition-colors group`}
              >
                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold mb-2">{f.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="py-24 px-6 bg-wine-panel/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-14">How It Works</h2>
          <div className="space-y-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex gap-6 items-start"
              >
                <span className="font-display text-4xl font-black bg-gradient-to-b from-crimson to-credits/50 bg-clip-text text-transparent leading-none flex-shrink-0 w-14 text-right">{step.num}</span>
                <div className="flex-1 pb-8 border-b border-wine-elevated last:border-0">
                  <h3 className="font-display font-semibold text-lg mb-1">{step.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST BADGES ── */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { icon: Shield,    label: 'Zero Real Money', desc: 'Campus credits only. Fully legal & ethical.' },
            { icon: Users,     label: 'College-Gated',   desc: 'Only your campus peers. Safe & verified.'   },
            { icon: TrendingUp,label: 'Skill-Based',     desc: 'You play. You win. No luck involved.'       },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex flex-col items-center gap-3 p-6 bg-wine-card border border-wine-elevated rounded-2xl hover:border-crimson/20 transition-colors">
              <div className="w-11 h-11 rounded-xl bg-crimson/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-crimson" />
              </div>
              <p className="font-semibold text-white text-sm">{label}</p>
              <p className="text-white/40 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-wine-card border border-crimson/25 rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-crimson-glow pointer-events-none" />
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4 relative">Ready to dominate?</h2>
            <p className="text-white/40 mb-8 relative">Sign up with your college email and get 500 ⚡ credits instantly. No payment required.</p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-crimson to-crimson-light hover:opacity-90 text-white font-bold transition-all active:scale-95 shadow-glow-crimson relative"
            >
              <Zap className="w-5 h-5 text-credits" />
              Create Free Account
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-wine-card py-8 px-6 text-center text-white/25 text-sm">
        <p>© 2025 CampusArena · College-exclusive · No real money involved · Built as a capstone project</p>
      </footer>
    </div>
  );
}
