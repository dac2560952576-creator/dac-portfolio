import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FadeIn from './FadeIn';
import BrandText from './BrandText';
import SpotlightHeading from './SpotlightHeading';
import PortraitInteraction from './PortraitInteraction';
import BackgroundOrbs from './BackgroundOrbs';

const navLinks = ['About', 'Projects', 'Contact'];

export default function HeroSection({ onNavigateProjects, onNavigateContact }: { onNavigateProjects: () => void; onNavigateContact: () => void }) {
  const [hovered, setHovered] = useState<string | null>(null);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const start = window.scrollY;
    const end = el.getBoundingClientRect().top + start;
    const duration = 900;
    const startTime = performance.now();

    function easeOutExpo(t: number) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);
      window.scrollTo(0, start + (end - start) * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, []);

  return (
    <section className="relative flex h-screen flex-col overflow-x-clip">
      {/* Floating glass orbs */}
      <BackgroundOrbs variant="hero" />

      {/* Navbar — glass pill: brand left, tabs right */}
      <FadeIn delay={0} y={-20} className="relative z-20 w-full">
        <nav className="mx-4 mt-4 flex items-center justify-between rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-xl px-6 py-3 sm:mx-6 sm:mt-6 md:mx-10 md:mt-8 md:px-10 md:py-4">
          {/* Left: brand */}
          <BrandText onClick={() => window.scrollTo(0, 0)} />

          {/* Right: nav links with liquid glass hover */}
          <div
            className="flex items-center gap-1 sm:gap-2"
            onMouseLeave={() => setHovered(null)}
          >
            {navLinks.map((link) => (
              <a
                key={link}
                onClick={(e) => { e.preventDefault(); if (link === 'Projects') onNavigateProjects(); else if (link === 'Contact') onNavigateContact(); else scrollTo(link.toLowerCase()); }}
                onMouseEnter={() => setHovered(link)}
                className="relative cursor-pointer px-4 py-2 text-sm font-medium uppercase tracking-wider text-[#D7E2EA] transition-colors duration-200 sm:px-5 md:px-6 md:text-base lg:text-lg"
              >
                <AnimatePresence>
                  {hovered === link && (
                    <motion.span
                      layoutId="nav-glass"
                      className="absolute inset-0 rounded-full border border-white/20"
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
                        backdropFilter: 'blur(12px)',
                        boxShadow:
                          '0 0 20px rgba(182,0,168,0.15), inset 0 1px 0 rgba(255,255,255,0.08)',
                      }}
                      initial={{ opacity: 0, scale: 0.85, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
                      transition={{
                        opacity: { duration: 0.22, ease: 'easeOut' },
                        scale: { type: 'spring', stiffness: 260, damping: 28 },
                        filter: { duration: 0.18, ease: 'easeOut' },
                        layout: { type: 'spring', stiffness: 340, damping: 32 },
                      }}
                    />
                  )}
                </AnimatePresence>
                <span className="relative z-10">{link}</span>
              </a>
            ))}
          </div>
        </nav>
      </FadeIn>

      {/* Hero Heading */}
      <SpotlightHeading
        as="h1"
        delay={0.15}
        fullWidth={false}
        className="relative z-10 mt-6 whitespace-nowrap font-black uppercase leading-none tracking-tight text-[14vw] sm:mt-4 sm:text-[15vw] md:-mt-5 md:text-[16vw] lg:text-[17.5vw]"
        textStyle={{ textShadow: '0 0 80px rgba(182, 0, 168, 0.15)' }}
      >
        Hi, i&apos;m dac
      </SpotlightHeading>

      {/* Bottom Bar */}
      <div className="relative z-10 mt-auto pb-7 sm:pb-8 md:pb-10">
        <FadeIn delay={0.35} y={20} className="ml-4 sm:ml-8 md:ml-12">
          <motion.p
            className="inline-block cursor-default max-w-[280px] rounded-2xl border border-white/10 backdrop-blur-md px-5 py-3 font-light leading-snug tracking-wide text-[#D7E2EA] sm:max-w-[380px] sm:px-6 sm:py-4 md:max-w-[460px]"
            style={{
              fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)',
              textTransform: 'none',
              background: 'rgba(255,255,255,0.03)',
            }}
            whileHover={{
              scale: 1.03,
              background: 'rgba(255,255,255,0.06)',
              borderColor: 'rgba(255,255,255,0.25)',
              boxShadow:
                '0 0 50px rgba(182,0,168,0.2), inset 0 1px 0 rgba(255,255,255,0.08)',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          >
            This is my portfolio website, featuring a collection of my work.
          </motion.p>
        </FadeIn>
      </div>

      {/* Hero Portrait — gaze tracking + ripple click */}
      <FadeIn
        delay={0.6}
        y={30}
        className="absolute left-1/2 z-10 -translate-x-1/2 top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0"
      >
        <PortraitInteraction />
      </FadeIn>
    </section>
  );
}
