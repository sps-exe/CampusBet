/**
 * CampusArena — Modal Component
 *
 * @prop {boolean} isOpen - Controls visibility
 * @prop {Function} onClose - Called when modal should close
 * @prop {string} title - Modal header title
 * @prop {'sm'|'md'|'lg'|'xl'} size
 * @prop {React.ReactNode} children
 * @prop {boolean} hideHeader - Hides the title bar
 */

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SIZES = {
  sm: '400px',
  md: '520px',
  lg: '700px',
  xl: '900px',
};

const Modal = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  children,
  hideHeader = false,
}) => {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            {/* Panel */}
            <motion.div
              key="panel"
              initial={{ opacity: 0, scale: 0.93, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border-hover)',
                borderRadius: '16px',
                width: '100%',
                maxWidth: SIZES[size],
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(139,92,246,0.1)',
                zIndex: 1001,
              }}
            >
              {/* Header */}
              {!hideHeader && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '20px 24px',
                    borderBottom: '1px solid var(--color-border)',
                  }}
                >
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '18px',
                      fontWeight: 700,
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    {title}
                  </h3>
                  <button
                    onClick={onClose}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: 'transparent',
                      color: 'var(--color-text-secondary)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--color-surface-2)';
                      e.currentTarget.style.color = 'var(--color-text-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--color-text-secondary)';
                    }}
                  >
                    <X size={18} />
                  </button>
                </div>
              )}

              {/* Body */}
              <div style={{ padding: '24px' }}>
                {children}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
