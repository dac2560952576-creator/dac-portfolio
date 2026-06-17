import { useRef, useEffect, useState } from 'react';
import BackgroundOrbs from './BackgroundOrbs';
import { assetUrl } from '../utils/assetUrl';

const row1Images = [
  assetUrl('10.png'),
  assetUrl('11.png'),
  assetUrl('111.png'),
  assetUrl('112.png'),
  assetUrl('113.png'),
  assetUrl('114.png'),
  assetUrl('22.png'),
];

const row2Images = [
  assetUrl('33.png'),
  assetUrl('44.png'),
  assetUrl('55.png'),
  assetUrl('66.png'),
  assetUrl('77.png'),
  assetUrl('88.png'),
  assetUrl('99.png'),
];

// One full set width for modulo wrapping
const IMG_W = 420;
const GAP = 12; // gap-3 = 12px
const SET_WIDTH = row1Images.length * (IMG_W + GAP); // 7 × 432 = 3024

// Triple for seamless looping
const row1Tripled = [...row1Images, ...row1Images, ...row1Images];
const row2Tripled = [...row2Images, ...row2Images, ...row2Images];

function ImageTile({ src }: { src: string }) {
  return (
    <div
      className="group relative h-[270px] w-[420px] flex-shrink-0 overflow-hidden rounded-2xl border border-white/5 transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(182,0,168,0.15)]"
      style={{ willChange: 'transform' }}
    >
      {/* Glass overlay on hover */}
      <div className="pointer-events-none absolute inset-0 z-10 rounded-2xl bg-white/[0.02] opacity-0 backdrop-blur-[1px] transition-opacity duration-300 group-hover:opacity-100" />
      <img
        src={src}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover"
      />
    </div>
  );
}

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const AUTO_SPEED = 0.4; // px per frame
    let autoRaw = 0;
    let scrollRaw = 0;
    let lastScrollY = window.scrollY;
    let scrollDir = 1; // 1 = down, -1 = up
    let rafId = 0;

    function tick() {
      // ── Detect scroll direction ──────────────────────────────
      const dy = window.scrollY - lastScrollY;
      if (dy > 0.5) scrollDir = 1;       // scrolling down
      else if (dy < -0.5) scrollDir = -1; // scrolling up
      // else: keep last direction when idle

      lastScrollY = window.scrollY;

      // ── Auto drift in current direction ──────────────────────
      autoRaw += AUTO_SPEED * scrollDir;

      // ── Scroll delta contribution ────────────────────────────
      scrollRaw += dy * 0.3;

      // ── Total offset, wrapped ────────────────────────────────
      const total = autoRaw + scrollRaw;
      const wrapped = ((total % SET_WIDTH) + SET_WIDTH) % SET_WIDTH;
      setOffset(wrapped);

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden pt-24 sm:pt-32 md:pt-40 pb-10"
    >
      {/* Subtle background orbs */}
      <BackgroundOrbs variant="subtle" />

      {/* Subtle glass edge fade top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-[#0C0C0C]/30 to-transparent backdrop-blur-[1px]" />
      {/* Subtle glass edge fade bottom */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-[#0C0C0C]/30 to-transparent backdrop-blur-[1px]" />

      {/* Row 1 - moves RIGHT */}
      <div className="relative mb-3 flex gap-3" style={{ willChange: 'transform' }}>
        <div
          className="flex gap-3"
          style={{
            transform: `translateX(${offset - SET_WIDTH}px)`,
            willChange: 'transform',
          }}
        >
          {row1Tripled.map((src, i) => (
            <ImageTile key={`r1-${i}`} src={src} />
          ))}
        </div>
      </div>

      {/* Row 2 - moves LEFT */}
      <div className="relative flex gap-3" style={{ willChange: 'transform' }}>
        <div
          className="flex gap-3"
          style={{
            transform: `translateX(-${offset}px)`,
            willChange: 'transform',
          }}
        >
          {row2Tripled.map((src, i) => (
            <ImageTile key={`r2-${i}`} src={src} />
          ))}
        </div>
      </div>
    </section>
  );
}
