import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BrandText from './BrandText';
import SpotlightHeading from './SpotlightHeading';

const navLinks = ['About', 'Projects', 'Contact'];

export default function CadillacDetail({ onBack, onGoHome, onNavigateContact }: { onBack: () => void; onGoHome: () => void; onNavigateContact: () => void }) {
  const [hovered, setHovered] = useState<string | null>(null);

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

  return (
    <div className="relative min-h-screen px-5 pt-6 pb-20 sm:px-8 sm:pt-8 sm:pb-24 md:px-10 md:pt-10 md:pb-32">
      {/* Navbar */}
      <nav className="mb-16 flex items-center justify-between rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-xl px-6 py-3 sm:mb-20 md:mb-24 md:px-10 md:py-4">
        <BrandText onClick={onGoHome} />
        <div className="flex items-center gap-1 sm:gap-2" onMouseLeave={() => setHovered(null)}>
          {navLinks.map((link) => (
            <a
              key={link}
              onClick={(e) => { e.preventDefault(); if (link === 'Projects') { onBack(); return; } if (link === 'Contact') { onNavigateContact(); return; } if (link === 'About') { onGoHome(); return; } scrollTo(link.toLowerCase()); }}
              onMouseEnter={() => setHovered(link)}
              className="relative cursor-pointer px-4 py-2 text-sm font-medium uppercase tracking-wider text-[#D7E2EA] transition-colors duration-200 sm:px-5 md:px-6 md:text-base lg:text-lg"
            >
              <AnimatePresence>
                {(hovered === link || (link === 'Projects' && hovered !== 'About' && hovered !== 'Contact')) && (
                  <motion.span
                    layoutId="nav-glass-cadillac"
                    className="absolute inset-0 rounded-full border border-white/20"
                    style={{
                      background: link === 'Projects' && hovered !== 'About' && hovered !== 'Contact'
                        ? 'linear-gradient(135deg, rgba(182,0,168,0.15), rgba(182,0,168,0.04))'
                        : 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
                      backdropFilter: 'blur(12px)',
                      boxShadow: link === 'Projects' && hovered !== 'About' && hovered !== 'Contact'
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
          textStyle={{ fontSize: 'clamp(3rem, 12vw, 140px)' }}
        >
          Cadillac<br />Web
        </SpotlightHeading>
        <p
          className="mt-3 font-light uppercase tracking-widest text-[#D7E2EA]/40"
          style={{ fontSize: 'clamp(0.75rem, 1.2vw, 1rem)' }}
        >
          Web Development · Responsive · Brand Heritage
        </p>
      </motion.div>

      {/* ── Staggered rows ───────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl space-y-32 sm:space-y-40 md:space-y-52">
        {/* Row 1: QQ image left + description */}
        <motion.div
          className="flex flex-col items-start gap-10 md:flex-row md:gap-14"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="w-full overflow-hidden rounded-3xl border border-[#D8D4CE] p-6 sm:p-8 md:w-[75%]"
            style={{ background: '#F0EDE8', boxShadow: '0 0 40px rgba(182,0,168,0.08)' }}>
            <img src="/QQ.png" alt="Cadillac hero section" className="w-full rounded-2xl object-cover" />
          </div>
          <div className="flex flex-col justify-center gap-4 md:w-[22%]">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#D7E2EA]/30">Overview</span>
            <p className="font-light leading-relaxed text-[#D7E2EA]/60" style={{ fontSize: 'clamp(0.9rem, 1.3vw, 1.15rem)' }}>
              A responsive brand website inspired by Cadillac's design language — bold typography, cinematic full-bleed imagery, and a premium dark-themed interface that honors the marque's heritage while pushing digital boundaries.
            </p>
          </div>
        </motion.div>

        {/* Row 2: text left + WW image right */}
        <motion.div
          className="flex flex-col items-start gap-10 md:flex-row-reverse md:gap-14"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="w-full overflow-hidden rounded-3xl border border-[#D8D4CE] p-6 sm:p-8 md:w-[68%]"
            style={{ background: '#F0EDE8', boxShadow: '0 0 40px rgba(182,0,168,0.08)' }}>
            <img src="/WW.png" alt="Cadillac model showcase" className="w-full rounded-2xl object-cover" />
          </div>
          <div className="flex flex-col justify-center gap-4 md:w-[28%] md:pl-8">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#D7E2EA]/30">Hero & Navigation</span>
            <p className="font-light leading-relaxed text-[#D7E2EA]/60" style={{ fontSize: 'clamp(0.9rem, 1.3vw, 1.15rem)' }}>
              A full-bleed hero section with parallax imagery and a refined navigation system. The modular grid adapts seamlessly across desktop, tablet, and mobile — maintaining brand presence at every breakpoint.
            </p>
          </div>
        </motion.div>

        {/* Row 3: EE image large left */}
        <motion.div
          className="flex flex-col items-start gap-10 md:flex-row md:gap-14"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="w-full overflow-hidden rounded-3xl border border-[#D8D4CE] p-6 sm:p-8 md:w-[80%]"
            style={{ background: '#F0EDE8', boxShadow: '0 0 40px rgba(182,0,168,0.08)' }}>
            <img src="/EE.png" alt="Cadillac vehicle configurator" className="w-full rounded-2xl object-cover" />
          </div>
          <div className="flex flex-col justify-center gap-4 md:w-[17%]">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#D7E2EA]/30">Model Showcase</span>
            <p className="font-light leading-relaxed text-[#D7E2EA]/60" style={{ fontSize: 'clamp(0.9rem, 1.3vw, 1.15rem)' }}>
              Interactive vehicle cards with smooth hover states, detailed specifications, and cinematic transitions between model variants — designed to mirror the showroom experience online.
            </p>
          </div>
        </motion.div>

        {/* Row 4: text left + RR image right */}
        <motion.div
          className="flex flex-col items-start gap-10 md:flex-row-reverse md:gap-14"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="w-full overflow-hidden rounded-3xl border border-[#D8D4CE] p-6 sm:p-8 md:w-[65%]"
            style={{ background: '#F0EDE8', boxShadow: '0 0 40px rgba(182,0,168,0.08)' }}>
            <img src="/RR.png" alt="Cadillac responsive mobile view" className="w-full rounded-2xl object-cover" />
          </div>
          <div className="flex flex-col justify-center gap-4 md:w-[30%] md:pl-8">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#D7E2EA]/30">Responsive Design</span>
            <p className="font-light leading-relaxed text-[#D7E2EA]/60" style={{ fontSize: 'clamp(0.9rem, 1.3vw, 1.15rem)' }}>
              Fully responsive across all device sizes — from 4K desktop monitors to mobile screens. Touch-optimized interactions, fluid typography scaling, and adaptive image loading ensure a consistent premium feel everywhere.
            </p>
          </div>
        </motion.div>

        {/* Row 5: TT image large left */}
        <motion.div
          className="flex flex-col items-start gap-10 md:flex-row md:gap-14"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="w-full overflow-hidden rounded-3xl border border-[#D8D4CE] p-6 sm:p-8 md:w-[75%]"
            style={{ background: '#F0EDE8', boxShadow: '0 0 40px rgba(182,0,168,0.08)' }}>
            <img src="/TT.png" alt="Cadillac design system" className="w-full rounded-2xl object-cover" />
          </div>
          <div className="flex flex-col justify-center gap-4 md:w-[22%]">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#D7E2EA]/30">Design System</span>
            <p className="font-light leading-relaxed text-[#D7E2EA]/60" style={{ fontSize: 'clamp(0.9rem, 1.3vw, 1.15rem)' }}>
              A cohesive design system built on luxury automotive principles — refined color palettes, sharp typography hierarchy, and consistent component spacing that echoes Cadillac's design DNA across every page.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Back button */}
      <motion.div
        className="mt-24 flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <button
          onClick={onBack}
          className="rounded-full border border-white/10 bg-white/[0.03] px-8 py-3 backdrop-blur-md text-sm font-light uppercase tracking-widest text-[#D7E2EA]/50 transition-all duration-300 hover:border-white/20 hover:text-[#D7E2EA]/80"
          style={{ boxShadow: '0 0 30px rgba(182,0,168,0.06)', inset: '0 1px 0 rgba(255,255,255,0.04)' }}
        >
          ← Back
        </button>
      </motion.div>
    </div>
  );
}
