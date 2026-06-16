import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Ripple config ───────────────────────────────────────────────────
const RIPPLE_DURATION = 0.9; // seconds
const RIPPLE_MAX_SCALE = 3.5;

interface Ripple {
  id: number;
  x: number;
  y: number;
}

// ── Gaze config ─────────────────────────────────────────────────────
const PERSPECTIVE = 800;
const ROTATE_X_MAX = 5; // degrees, up/down
const ROTATE_Y_MAX = 7; // degrees, left/right

export default function PortraitInteraction({ src = '/1.PNG' }: { src?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowBoost, setGlowBoost] = useState(1);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [bounce, setBounce] = useState(1);
  const nextId = useRef(0);

  // ── Gaze: global mouse → rotateX/Y, works from any distance ──
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      // Normalised relative to portrait size, clamps for far distances
      const rawNx = (e.clientX - cx) / (rect.width / 2);
      const rawNy = (e.clientY - cy) / (rect.height / 2);
      const nx = Math.max(-1.8, Math.min(1.8, rawNx));
      const ny = Math.max(-1.8, Math.min(1.8, rawNy));

      setRotateX(-ny * ROTATE_X_MAX);
      setRotateY(nx * ROTATE_Y_MAX);

      // Glow: brighter when closer, dim at distance
      const dist = Math.sqrt(nx * nx + ny * ny);
      setGlowBoost(1 + Math.max(0, (1 - Math.min(dist, 1))) * 0.25);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // ── Click → ripple + bounce + glow pulse ───────────────────────
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const id = nextId.current++;
      setRipples((prev) => [...prev, { id, x, y }]);

      // Auto-remove ripple after animation
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, RIPPLE_DURATION * 1000);

      // Scale bounce
      setBounce(0.94);
      setTimeout(() => setBounce(1.04), 120);
      setTimeout(() => setBounce(1), 280);
    },
    [],
  );

  // ── Cleanup ────────────────────────────────────────────────────
  useEffect(() => {
    return () => setRipples([]);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px] cursor-pointer select-none"
      style={{ perspective: PERSPECTIVE }}
      onClick={handleClick}
    >
      {/* ── Glow ball behind portrait — pulses with proximity & click ── */}
      <motion.div
        className="absolute inset-0 -z-10 rounded-full bg-[#B600A8]/20"
        style={{ filter: 'blur(80px)' }}
        animate={{
          scale: glowBoost,
          opacity: glowBoost * 0.35,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 24 }}
      />

      {/* ── Ripple layer ─────────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
        <AnimatePresence>
          {ripples.map((r) => (
            <motion.div
              key={r.id}
              className="absolute rounded-full border border-white/30"
              style={{
                left: r.x,
                top: r.y,
                width: 40,
                height: 40,
                marginLeft: -20,
                marginTop: -20,
                background:
                  'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 60%)',
                backdropFilter: 'blur(2px)',
              }}
              initial={{ scale: 0, opacity: 0.7 }}
              animate={{ scale: RIPPLE_MAX_SCALE, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: RIPPLE_DURATION, ease: 'easeOut' }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* ── Portrait image — gaze tilt ───────────────────────────── */}
      <motion.div
        animate={{
          rotateX,
          rotateY,
          scale: bounce,
        }}
        transition={{
          rotateX: { type: 'spring', stiffness: 200, damping: 24 },
          rotateY: { type: 'spring', stiffness: 200, damping: 24 },
          scale: { type: 'spring', stiffness: 400, damping: 20 },
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <img
          src={src}
          alt="DAC Portrait"
          className="relative w-full drop-shadow-[0_0_60px_rgba(182,0,168,0.3)]"
          draggable={false}
        />
      </motion.div>

      {/* ── Glass highlight sheen — moves opposite to gaze ────────── */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(255,255,255,0.06) 0%, transparent 60%)',
        }}
        animate={{
          x: rotateY * -1.5,
          y: rotateX * -1.5,
        }}
        transition={{ type: 'spring', stiffness: 160, damping: 26 }}
      />
    </div>
  );
}
