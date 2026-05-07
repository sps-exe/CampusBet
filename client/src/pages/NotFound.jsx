/**
 * CampusBet — 404 Not Found Page
 */

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import Navbar from '../components/layout/Navbar';

const NotFound = () => {
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
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 24px',
          position: 'relative',
          overflow: 'hidden',
          textAlign: 'center',
        }}
      >
        {/* Background glows */}
        <div className="glow-purple" style={{ top: '-150px', left: '-100px', opacity: 0.5 }} />
        <div className="glow-cyan"   style={{ bottom: '-100px', right: '-100px', opacity: 0.4 }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          {/* Glitchy 404 */}
          <div style={{ position: 'relative', marginBottom: 24 }}>
            <motion.h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(100px, 20vw, 180px)',
                fontWeight: 800,
                lineHeight: 1,
                userSelect: 'none',
              }}
              className="animated-gradient-text"
              animate={{
                textShadow: [
                  '0 0 20px rgba(139,92,246,0.4)',
                  '0 0 40px rgba(6,182,212,0.6)',
                  '0 0 20px rgba(139,92,246,0.4)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              404
            </motion.h1>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(20px, 3vw, 28px)',
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            Lost in the arena?
          </h2>

          <p
            style={{
              fontSize: 16,
              color: 'var(--color-text-secondary)',
              maxWidth: 400,
              margin: '0 auto 36px',
              lineHeight: 1.7,
            }}
          >
            This page doesn't exist — or maybe it rage-quit. Either way, let's get you back in the game.
          </p>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/">
              <Button variant="primary" size="lg" icon={Home}>
                Back to Home
              </Button>
            </Link>
            <button onClick={() => window.history.back()}>
              <Button variant="outline" size="lg" icon={ArrowLeft}>
                Go Back
              </Button>
            </button>
          </div>

          {/* Decorative floating elements */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
            {['🎮', '🏆', '⚔️', '🎯', '💀'].map((emoji, i) => (
              <motion.span
                key={i}
                style={{
                  position: 'absolute',
                  fontSize: 24,
                  left: `${15 + i * 18}%`,
                  top: `${20 + (i % 3) * 25}%`,
                  userSelect: 'none',
                  opacity: 0.3,
                }}
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 10, -10, 0],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: 'easeInOut',
                }}
              >
                {emoji}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
