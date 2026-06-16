import { useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// ── Config ──────────────────────────────────────────────────────────
const RADIUS = 50;
const MAX_SCALE = 1.55;
const LENS_SIZE = RADIUS * 2;

interface MagnifyTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function MagnifyText({ text, className = '', style }: MagnifyTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [charScales, setCharScales] = useState<number[]>(() => Array(text.length).fill(1));

  // ── Scroll-reveal opacity ───────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2'],
  });

  // ── Mouse move → per-char scale ─────────────────────────────────
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      setMousePos({ x: mx, y: my });

      const newScales = charRefs.current.map((el) => {
        if (!el) return 1;
        const cr = el.getBoundingClientRect();
        const cx = cr.left + cr.width / 2 - rect.left;
        const cy = cr.top + cr.height / 2 - rect.top;
        const dx = mx - cx;
        const dy = my - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist >= RADIUS) return 1;
        const t = dist / RADIUS;
        // Cosine ease: centre peaks, edge smooth to 1
        return 1 + (MAX_SCALE - 1) * Math.max(0, Math.cos(t * (Math.PI / 2)));
      });

      setCharScales(newScales);
    },
    [],
  );

  const handleMouseLeave = useCallback(() => {
    setMousePos(null);
    setCharScales(Array(text.length).fill(1));
  }, [text.length]);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Characters ────────────────────────────────────────────── */}
      {text.split('').map((char, i) => {
        const start = i / text.length;
        const end = start + 1 / text.length;
        const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1]);
        const s = charScales[i] || 1;

        return (
          <motion.span
            key={i}
            ref={(el) => { charRefs.current[i] = el; }}
            className="relative inline-block origin-center"
            style={{
              opacity,
              transform: `scale(${s})`,
              zIndex: s > 1 ? 10 : 0,
              transition: 'transform 0.15s ease-out, z-index 0s',
            }}
          >
            {char === ' ' ? ' ' : char}
          </motion.span>
        );
      })}

      {/* ── Liquid glass magnifying lens ──────────────────────────── */}
      {mousePos && (
        <motion.div
          className="pointer-events-none absolute z-20 rounded-full"
          style={{
            left: mousePos.x - RADIUS,
            top: mousePos.y - RADIUS,
            width: LENS_SIZE,
            height: LENS_SIZE,
            // Clear glass — see the scaled chars underneath
            background:
              'radial-gradient(circle at 40% 35%, rgba(255,255,255,0.06) 0%, transparent 60%)',
            border: '2px solid rgba(255,255,255,0.22)',
            boxShadow: [
              '0 0 50px rgba(182,0,168,0.2)',
              '0 0 100px rgba(182,0,168,0.08)',
              'inset 0 0 0 5px rgba(255,255,255,0.03)',
              '0 10px 40px rgba(0,0,0,0.55)',
            ].join(', '),
          }}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.7, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        >
          {/* Inner thick ring */}
          <div
            className="absolute inset-3 rounded-full"
            style={{
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          />
          {/* Specular highlight */}
          <div
            className="absolute rounded-full"
            style={{
              width: '28%',
              height: '22%',
              top: '20%',
              left: '24%',
              background:
                'radial-gradient(ellipse, rgba(255,255,255,0.15) 0%, transparent 100%)',
            }}
          />
          {/* Bottom reflection */}
          <div
            className="absolute rounded-full"
            style={{
              width: '40%',
              height: '12%',
              bottom: '15%',
              right: '20%',
              background:
                'radial-gradient(ellipse, rgba(255,255,255,0.04) 0%, transparent 100%)',
            }}
          />
        </motion.div>
      )}
    </div>
  );
}
