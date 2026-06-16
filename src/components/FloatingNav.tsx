import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const links = [
  { label: 'Home', action: 'home' },
  { label: 'Project', action: 'projects' },
  { label: 'About', action: 'about' },
  { label: 'Contact', action: 'contact' },
];

interface FloatingNavProps {
  onNavigate: (page: string) => void;
}

export default function FloatingNav({ onNavigate }: FloatingNavProps) {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const filled = open || hovered;

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* Floating round button — hamburger or X */}
      <AnimatePresence>
        {visible && (
          <motion.button
            onClick={() => setOpen(!open)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="fixed right-6 top-12 z-[110] flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-xl text-[#D7E2EA]"
            style={{ boxShadow: '0 0 30px rgba(182,0,168,0.1), inset 0 1px 0 rgba(255,255,255,0.05)' }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: filled ? 1.1 : 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          >
            {/* Liquid fill from bottom */}
            <span
              className="absolute inset-x-0 bottom-0 rounded-full transition-all duration-500 ease-out"
              style={{
                height: filled ? '100%' : '0%',
                background: 'linear-gradient(to top, #E8C850, #E8C850dd, #E8C85060)',
              }}
            />
            {/* Icon — stays above fill */}
            <span className="relative z-10" style={{ color: filled ? '#0C0C0C' : undefined }}>
              {open ? (
                <motion.svg
                  width="22" height="22" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"
                  initial={{ rotate: 0 }} animate={{ rotate: 90 }} transition={{ duration: 0.3 }}
                >
                  <line x1="1" y1="1" x2="17" y2="17" />
                  <line x1="1" y1="17" x2="17" y2="1" />
                </motion.svg>
              ) : (
                <motion.svg
                  width="28" height="20" viewBox="0 0 20 14" fill="none" stroke="currentColor" strokeWidth="1.5"
                  initial={{ rotate: 90 }} animate={{ rotate: 0 }} transition={{ duration: 0.3 }}
                >
                  <line x1="1" y1="1" x2="19" y2="1" />
                  <line x1="1" y1="7" x2="19" y2="7" />
                  <line x1="1" y1="13" x2="19" y2="13" />
                </motion.svg>
              )}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Slide-out panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-y-0 right-0 z-[105] flex w-[85vw] flex-col gap-8 border-l border-white/10 bg-[#0C0C0C] px-10 pt-24 pb-20 sm:w-[40vw] sm:px-14 sm:pt-28 md:w-[35vw] md:px-16 md:pt-32"
            style={{ boxShadow: '-20px 0 60px rgba(0,0,0,0.5)' }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 180, damping: 28 }}
          >
            <span className="text-xs font-light uppercase tracking-[0.3em] text-[#D7E2EA]/25">
              Navigation
            </span>

            {/* Line */}
            <div className="-mt-4 h-px w-full bg-white/10" />

            <div className="mt-6 flex flex-col gap-7">
              {links.map((link, i) => (
                <motion.button
                  key={`${link.label}-${open}`}
                  onMouseEnter={() => setHoveredLink(link.label)}
                  onMouseLeave={() => setHoveredLink(null)}
                  onClick={() => {
                    setOpen(false);
                    if (link.action === 'home') {
                      onNavigate('home');
                    } else {
                      onNavigate(link.action);
                    }
                  }}
                  className="flex items-center gap-4 text-left text-2xl font-light tracking-wide transition-colors sm:text-3xl"
                  style={{ color: hoveredLink === link.label ? '#D7E2EA' : 'rgba(215,226,234,0.6)' }}
                  initial={{ x: 40, opacity: 0 }}
                  animate={open ? { x: 0, opacity: 1 } : { x: 40, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 180, damping: 24, delay: 0.15 + i * 0.08 }}
                >
                  <motion.span
                    className="inline-block rounded-full border border-white/40"
                    animate={{ width: hoveredLink === link.label ? 10 : 0, height: hoveredLink === link.label ? 10 : 0, opacity: hoveredLink === link.label ? 1 : 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  />
                  {link.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[99] bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
