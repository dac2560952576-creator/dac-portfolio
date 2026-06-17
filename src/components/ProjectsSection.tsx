import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SpotlightHeading from './SpotlightHeading';
import LiveProjectButton from './LiveProjectButton';
import BackgroundOrbs from './BackgroundOrbs';
import { assetUrl } from '../utils/assetUrl';

const projects = [
  {
    number: '01', category: 'UI/UX Design', name: 'Hotpot App',
    image1: assetUrl('Q.png'),
    image2: assetUrl('R.png'),
    image3: assetUrl('Y.png'),
  },
  {
    number: '02', category: 'Web Development', name: 'Cadillac Web',
    image1: assetUrl('QQ.png'),
    image2: assetUrl('RR.png'),
    image3: assetUrl('WW.png'),
  },
  {
    number: '03', category: 'UI Design', name: 'Game UI',
    image1: assetUrl('A.png'),
    image2: assetUrl('S.png'),
    image3: assetUrl('D.png'),
  },
];

const TOTAL = projects.length;

function Card({
  project,
  index,
  onClick,
}: {
  project: (typeof projects)[0];
  index: number;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.95);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = (vh - rect.top) / (vh + rect.height);
      const clamped = Math.max(0, Math.min(1, progress));
      const t = Math.min(clamped / 0.5, 1);
      const targetScale = 1 - (TOTAL - 1 - index) * 0.03;
      setScale(0.95 + (targetScale - 0.95) * t);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [index]);

  const stopAt = index === 2 ? 220 : 80 + index * 48;

  return (
    <div
      ref={ref}
      className={`sticky h-[85vh] ${onClick ? 'cursor-pointer' : ''}`}
      style={{ top: `${stopAt}px` }}
      onClick={onClick}
    >
      <motion.div
        className="flex h-full flex-col rounded-[40px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:rounded-[50px] sm:p-6 md:rounded-[60px] md:p-8"
        animate={{ scale }}
        transition={{ type: 'tween', duration: 0.05, ease: 'linear' }}
        style={{ boxShadow: '0 -20px 60px rgba(0,0,0,0.5)' }}
      >
        {/* Top row: number + category | name + button */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-6">
            <span
              className="font-black leading-none text-[#D7E2EA]"
              style={{ fontSize: 'clamp(2rem, 6vw, 80px)' }}
            >
              {project.number}
            </span>
            <span
              className="font-medium uppercase tracking-wider text-[#D7E2EA]/50"
              style={{ fontSize: 'clamp(0.75rem, 1.5vw, 1rem)' }}
            >
              {project.category}
            </span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <h3
              className="font-bold uppercase text-[#D7E2EA]"
              style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}
            >
              {project.name}
            </h3>
            <LiveProjectButton />
          </div>
        </div>

        {/* Images */}
        <div className="mt-4 flex flex-1 gap-3 sm:gap-4 md:gap-6" style={{ minHeight: 0 }}>
          <div className="flex w-[40%] flex-col gap-3 sm:gap-4 md:gap-6">
            <div className="flex-1 overflow-hidden rounded-2xl border border-white/[0.06] bg-[#F0EDE8] sm:rounded-3xl">
              <img src={project.image1} alt="" loading="lazy" className="h-full w-full object-cover" />
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#F0EDE8] sm:rounded-3xl" style={{ flex: 1.5 }}>
              <img src={project.image2} alt="" loading="lazy" className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="relative w-[60%] overflow-hidden rounded-2xl border border-white/[0.06] bg-[#F0EDE8] sm:rounded-3xl">
            <img src={project.image3} alt="" loading="lazy" className="h-full w-full object-cover" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0C0C0C]/30 to-transparent" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── Section ──────────────────────────────────────────────────────────
export default function ProjectsSection({ onNavigateHotpot, onNavigateCadillac, onNavigateGameUI }: { onNavigateHotpot: () => void; onNavigateCadillac: () => void; onNavigateGameUI: () => void }) {
  return (
    <section id="projects" className="relative z-10 px-5 py-20 sm:px-8 sm:py-24 md:px-10 md:py-32">
      <BackgroundOrbs variant="subtle" />
      <div className="mb-16 text-center sm:mb-20 md:mb-28">
        <SpotlightHeading
          fullWidth={false}
          className="font-black uppercase leading-none tracking-tight"
          textStyle={{ fontSize: 'clamp(3rem, 12vw, 160px)', textShadow: '0 0 60px rgba(182, 0, 168, 0.12)' }}
        >
          Project
        </SpotlightHeading>
      </div>
      <div className="space-y-8">
        {projects.map((p, i) => (
          <Card key={p.number} project={p} index={i} onClick={p.number === '01' ? onNavigateHotpot : p.number === '02' ? onNavigateCadillac : p.number === '03' ? onNavigateGameUI : undefined} />
        ))}
      </div>
    </section>
  );
}
