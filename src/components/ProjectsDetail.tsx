import { useState, useCallback } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import BrandText from './BrandText';
import SpotlightHeading from './SpotlightHeading';
import BackgroundOrbs from './BackgroundOrbs';
import { assetUrl } from '../utils/assetUrl';

const Q_PNG = assetUrl('Q.png');
const QQ_PNG = assetUrl('QQ.png');
const A_PNG = assetUrl('A.png');

const navLinks = ['About', 'Projects', 'Contact'];

const projects = [
  {
    number: '01',
    name: 'Hotpot App',
    category: 'UI/UX Design / Mobile',
    description: 'A mobile ordering app UI design for a hotpot restaurant chain. Designed an intuitive menu browsing flow, real-time table ordering experience, and a visually warm interface that reflects the cozy dining atmosphere of hotpot culture.',
  },
  {
    number: '02',
    name: 'Cadillac Web',
    category: 'Web Development / Responsive',
    description: 'A responsive brand website inspired by Cadillac\'s design language. Features cinematic full-bleed imagery, bold typography, and a premium dark-themed interface that honors the marque\'s heritage across all device sizes.',
  },
  {
    number: '03',
    name: 'Game UI',
    category: 'UI Design / Game Interface',
    description: 'A futuristic game UI interface design for an immersive sci-fi title. Features holographic HUD elements, inventory screens, and a dark neon aesthetic with cross-platform adaptive layouts.',
  },
];

export default function ProjectsDetail({ onBack, onGoHome, onNavigateHotpot, onNavigateCadillac, onNavigateGameUI, onNavigateContact }: { onBack: () => void; onGoHome: () => void; onNavigateHotpot: () => void; onNavigateCadillac: () => void; onNavigateGameUI: () => void; onNavigateContact: () => void }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [previewShow, setPreviewShow] = useState(false);
  const [previewSrc, setPreviewSrc] = useState('');
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  // Box: slower spring
  const boxX = useSpring(mouseX, { stiffness: 200, damping: 28 });
  const boxY = useSpring(mouseY, { stiffness: 200, damping: 28 });
  // Circle: faster spring
  const circleX = useSpring(mouseX, { stiffness: 400, damping: 22 });
  const circleY = useSpring(mouseY, { stiffness: 400, damping: 22 });

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
    <section className="relative min-h-screen px-5 pt-6 pb-20 sm:px-8 sm:pt-8 sm:pb-24 md:px-10 md:pt-10 md:pb-32">
      {/* Navbar */}
      <nav className="mb-12 flex items-center justify-between rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-xl px-6 py-3 sm:mb-16 md:mb-20 md:px-10 md:py-4">
        <BrandText onClick={onGoHome} />
        <div className="flex items-center gap-1 sm:gap-2" onMouseLeave={() => setHovered(null)}>
          {navLinks.map((link) => (
            <a
              key={link}
              onClick={(e) => {
                e.preventDefault();
                if (link === 'Projects') return;
                if (link === 'Contact') { onNavigateContact(); return; }
                scrollTo(link.toLowerCase());
              }}
              onMouseEnter={() => setHovered(link)}
              className="relative cursor-pointer px-4 py-2 text-sm font-medium uppercase tracking-wider text-[#D7E2EA] transition-colors duration-200 sm:px-5 md:px-6 md:text-base lg:text-lg"
            >
              {/* Active indicator for current page */}
              {(hovered === link || (link === 'Projects' && hovered !== 'About' && hovered !== 'Contact')) && (
                <motion.span
                  layoutId="nav-glass-detail"
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
              <span className="relative z-10">{link}</span>
            </a>
          ))}
        </div>
      </nav>

      <BackgroundOrbs variant="subtle" />

      {/* Heading */}
      <motion.div
        className="mb-16 sm:mb-20 md:mb-28"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <SpotlightHeading
          fullWidth={false}
          className="text-left font-black uppercase leading-none tracking-tight"
          textStyle={{
            fontSize: 'clamp(3rem, 12vw, 160px)',
            textShadow: '0 0 60px rgba(182, 0, 168, 0.12)',
          }}
        >
          Project
        </SpotlightHeading>
      </motion.div>

      {/* Project list — Services-style layout */}
      <div className="mx-auto max-w-5xl">
        {projects.map((project, i) => (
          <motion.div
            key={project.number}
            onClick={project.number === '01' ? onNavigateHotpot : project.number === '02' ? onNavigateCadillac : project.number === '03' ? onNavigateGameUI : undefined}
            className={`flex flex-col gap-4 border-t py-8 sm:flex-row sm:gap-10 sm:py-10 md:gap-12 md:py-12 ${project.number !== '' ? 'cursor-pointer transition-colors hover:bg-white/[0.02]' : ''}`}
            style={{ borderColor: 'rgba(215,226,234,0.25)' }}
            onMouseMove={(project.number === '01' || project.number === '02' || project.number === '03') ? (e) => { mouseX.set(e.clientX); mouseY.set(e.clientY); } : undefined}
            onMouseEnter={(project.number === '01' || project.number === '02' || project.number === '03') ? () => { setPreviewSrc(project.number === '01' ? Q_PNG : project.number === '02' ? QQ_PNG : A_PNG); setPreviewShow(true); } : undefined}
            onMouseLeave={(project.number === '01' || project.number === '02' || project.number === '03') ? () => setPreviewShow(false) : undefined}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.12, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Number */}
            <span
              className="font-black leading-none text-[#D7E2EA]"
              style={{ fontSize: 'clamp(3rem, 10vw, 140px)', lineHeight: 0.85 }}
            >
              {project.number}
            </span>

            {/* Content */}
            <div className="flex flex-col justify-center gap-2 pt-2">
              <span
                className="font-light uppercase tracking-wider text-[#D7E2EA]/40"
                style={{ fontSize: 'clamp(0.7rem, 1.2vw, 0.9rem)' }}
              >
                {project.category}
              </span>
              <h3
                className="font-medium uppercase text-[#D7E2EA]"
                style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
              >
                {project.name}
              </h3>
              <p
                className="mt-2 max-w-2xl font-light leading-relaxed text-[#D7E2EA]/50"
                style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}
              >
                {project.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Hover preview — box: slower spring */}
      <motion.div
        className="pointer-events-none fixed z-50"
        style={{ left: boxX, top: boxY, x: '-50%', y: '-50%' }}
      >
        <motion.div
          className="w-[300px] sm:w-[380px] overflow-hidden border border-white/30 bg-[#D5D2CD] p-0"
          style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}
          animate={{
            scale: previewShow ? 1 : 0.6,
            opacity: previewShow ? 1 : 0,
          }}
          initial={{ scale: 0.6, opacity: 0 }}
          transition={{
            scale: { type: 'spring', stiffness: 260, damping: 24 },
            opacity: { duration: 0.25 },
          }}
        >
          <div className="overflow-hidden" style={{ height: '450px' }}>
            <div
              className="transition-transform duration-500 ease-out"
              style={{ transform: previewSrc === QQ_PNG ? 'translateY(-450px)' : previewSrc === A_PNG ? 'translateY(-900px)' : 'translateY(0)' }}
            >
              <div style={{ height: '450px' }}>
                <img src={Q_PNG} alt="Hotpot App preview" className="h-full w-full object-cover" />
              </div>
              <div style={{ height: '450px' }}>
                <img src={QQ_PNG} alt="Cadillac Web preview" className="h-full w-full object-cover" />
              </div>
              <div style={{ height: '450px' }}>
                <img src={A_PNG} alt="Game UI preview" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* VIEW circle — faster spring */}
      <motion.div
        className="pointer-events-none fixed z-50"
        style={{ left: circleX, top: circleY, x: '-50%', y: '-50%' }}
      >
        <motion.div
          className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FFD700] text-sm font-bold uppercase tracking-wider text-[#0C0C0C]"
          style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
          animate={{ scale: previewShow ? 1 : 0, opacity: previewShow ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        >
          VIEW
        </motion.div>
      </motion.div>

      {/* Back button — glass pill at bottom */}
      <motion.div
        className="mt-20 flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <button
          onClick={onBack}
          className="rounded-full border border-white/10 bg-white/[0.03] px-8 py-3 backdrop-blur-md text-sm font-light uppercase tracking-widest text-[#D7E2EA]/50 transition-all duration-300 hover:border-white/20 hover:text-[#D7E2EA]/80"
          style={{ boxShadow: '0 0 30px rgba(182,0,168,0.06), inset 0 1px 0 rgba(255,255,255,0.04)' }}
        >
          ← Back
        </button>
      </motion.div>
    </section>
  );
}
