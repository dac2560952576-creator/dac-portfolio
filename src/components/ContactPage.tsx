import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BrandText from './BrandText';
import SpotlightHeading from './SpotlightHeading';
import BackgroundOrbs from './BackgroundOrbs';

const navLinks = ['About', 'Projects', 'Contact'];

export default function ContactPage({ onBack, onGoHome, onNavigateProjects }: { onBack: () => void; onGoHome: () => void; onNavigateProjects: () => void }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [shake, setShake] = useState(false);
  const [incomplete, setIncomplete] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const scrollTo = useCallback((id: string) => {
    onBack();
    setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;
      const start = window.scrollY;
      const end = el.getBoundingClientRect().top + start;
      const duration = 900;
      const startTime = performance.now();
      function easeOutExpo(t: number) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }
      function tick(now: number) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        window.scrollTo(0, start + (end - start) * easeOutExpo(progress));
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }, 100);
  }, [onBack]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;
    const inputs = form.querySelectorAll('input, textarea');
    const allFilled = Array.from(inputs).every((el) => (el as HTMLInputElement).value.trim() !== '');
    if (!allFilled) {
      setIncomplete(true);
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setTimeout(() => setIncomplete(false), 800);
      return;
    }
    setIncomplete(false);
    setSent(true);
    inputs.forEach((el) => ((el as HTMLInputElement).value = ''));
    setTimeout(() => setSent(false), 2000);
  };

  return (
    <div className="relative min-h-screen px-5 pt-6 pb-20 sm:px-8 sm:pt-8 sm:pb-24 md:px-10 md:pt-10 md:pb-32">
      {/* Navbar */}
      <nav className="mb-16 flex items-center justify-between rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-xl px-6 py-3 sm:mb-20 md:mb-24 md:px-10 md:py-4">
        <BrandText onClick={onGoHome} />
        <div className="flex items-center gap-1 sm:gap-2" onMouseLeave={() => setHovered(null)}>
          {navLinks.map((link) => (
            <a
              key={link}
              onClick={(e) => {
                e.preventDefault();
                if (link === 'Contact') return;
                if (link === 'Projects') { onNavigateProjects(); return; }
                scrollTo(link.toLowerCase());
              }}
              onMouseEnter={() => setHovered(link)}
              className="relative cursor-pointer px-4 py-2 text-sm font-medium uppercase tracking-wider text-[#D7E2EA] transition-colors duration-200 sm:px-5 md:px-6 md:text-base lg:text-lg"
            >
              <AnimatePresence>
                {(hovered === link || (link === 'Contact' && hovered !== 'About' && hovered !== 'Projects')) && (
                  <motion.span
                    layoutId="nav-glass-contact"
                    className="absolute inset-0 rounded-full border border-white/20"
                    style={{
                      background: link === 'Contact' && hovered !== 'About' && hovered !== 'Projects'
                        ? 'linear-gradient(135deg, rgba(182,0,168,0.15), rgba(182,0,168,0.04))'
                        : 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
                      backdropFilter: 'blur(12px)',
                      boxShadow: link === 'Contact' && hovered !== 'About' && hovered !== 'Projects'
                        ? '0 0 20px rgba(182,0,168,0.25), inset 0 1px 0 rgba(255,255,255,0.08)'
                        : '0 0 20px rgba(182,0,168,0.15), inset 0 1px 0 rgba(255,255,255,0.08)',
                    }}
                    initial={{ opacity: 0, scale: 0.85, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
                    transition={{ opacity: { duration: 0.22, ease: 'easeOut' }, scale: { type: 'spring', stiffness: 260, damping: 28 }, filter: { duration: 0.18, ease: 'easeOut' }, layout: { type: 'spring', stiffness: 340, damping: 32 } }}
                  />
                )}
              </AnimatePresence>
              <span className="relative z-10">{link}</span>
            </a>
          ))}
        </div>
      </nav>

      <BackgroundOrbs variant="subtle" />

      {/* Title */}
      <motion.div
        className="mb-16 sm:mb-20 md:mb-24"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <SpotlightHeading
          fullWidth={false}
          className="text-left font-black uppercase leading-none tracking-tight"
          textStyle={{ fontSize: 'clamp(2.5rem, 10vw, 120px)' }}
        >
          Let&apos;s start a<br />project together
        </SpotlightHeading>
      </motion.div>

      {/* Form */}
        <motion.form
          ref={formRef}
          onSubmit={handleSubmit}
          className="mx-auto max-w-2xl space-y-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: sent ? 0.5 : 1 }}
          transition={{ delay: 0.25, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="space-y-2">
            <label className="text-base font-light uppercase tracking-[0.15em] text-[#D7E2EA]">What's your name?</label>
            <input type="text" className="w-full border-b border-white/20 bg-transparent py-4 text-xl font-light text-[#D7E2EA] outline-none transition-colors placeholder:text-[#D7E2EA]/30 focus:border-white/50" placeholder="Your name" />
          </div>
          <div className="space-y-2">
            <label className="text-base font-light uppercase tracking-[0.15em] text-[#D7E2EA]">What's your email?</label>
            <input type="email" className="w-full border-b border-white/20 bg-transparent py-4 text-xl font-light text-[#D7E2EA] outline-none transition-colors placeholder:text-[#D7E2EA]/30 focus:border-white/50" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <label className="text-base font-light uppercase tracking-[0.15em] text-[#D7E2EA]">What's the name of your organization?</label>
            <input type="text" className="w-full border-b border-white/20 bg-transparent py-4 text-xl font-light text-[#D7E2EA] outline-none transition-colors placeholder:text-[#D7E2EA]/30 focus:border-white/50" placeholder="Your organization" />
          </div>
          <div className="space-y-2">
            <label className="text-base font-light uppercase tracking-[0.15em] text-[#D7E2EA]">What services are you looking for?</label>
            <input type="text" className="w-full border-b border-white/20 bg-transparent py-4 text-xl font-light text-[#D7E2EA] outline-none transition-colors placeholder:text-[#D7E2EA]/30 focus:border-white/50" placeholder="3D Modeling, Branding, Web Design..." />
          </div>
          <div className="space-y-2">
            <label className="text-base font-light uppercase tracking-[0.15em] text-[#D7E2EA]">Your message</label>
            <textarea rows={1} className="w-full resize-none border-b border-white/20 bg-transparent py-4 text-xl font-light text-[#D7E2EA] outline-none transition-colors placeholder:text-[#D7E2EA]/30 focus:border-white/50" placeholder="Tell me about your project..." />
          </div>
          <div className="flex flex-col items-center gap-4 pt-4">
            <motion.button
              type="submit"
              className={`flex h-24 w-24 items-center justify-center rounded-full border backdrop-blur-md text-sm font-medium uppercase tracking-widest transition-all duration-500 ${
                sent
                  ? 'border-transparent bg-[#E8C850] text-[#0C0C0C]'
                  : 'border-white/20 bg-white/[0.03] text-[#D7E2EA]'
              }`}
              animate={shake ? { x: [0, -12, 12, -10, 10, -6, 6, -3, 3, 0] } : sent ? { scale: [1, 1.12, 1] } : {}}
              whileHover={sent ? {} : { scale: 1.08, boxShadow: '0 0 50px rgba(182,0,168,0.25), inset 0 1px 0 rgba(255,255,255,0.08)' }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              style={sent
                ? { boxShadow: '0 0 30px rgba(232,200,80,0.3)' }
                : { boxShadow: '0 0 30px rgba(182,0,168,0.08), inset 0 1px 0 rgba(255,255,255,0.04)' }}
            >
              {sent ? (
                <motion.span className="text-2xl" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}>✓</motion.span>
              ) : 'Send it'}
            </motion.button>
            <AnimatePresence>
              {incomplete && (
                <motion.p
                  className="text-xs font-light tracking-wider text-[#FFD700]/80"
                  initial={{ opacity: 0, scale: 0.7, x: -4 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.3 }}
                >
                  Please complete all fields before sending
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.form>
    </div>
  );
}
