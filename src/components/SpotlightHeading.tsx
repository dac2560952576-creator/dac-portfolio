import { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SpotlightHeadingProps {
  children: React.ReactNode;
  className?: string;
  textStyle?: React.CSSProperties;
  size?: number;
  accentColor?: string;
  as?: 'h1' | 'h2';
  delay?: number;
  fullWidth?: boolean;
}

export default function SpotlightHeading({
  children,
  className = '',
  textStyle,
  size = 140,
  accentColor = '#FFD700',
  as: Tag = 'h2',
  delay = 0,
  fullWidth = true,
}: SpotlightHeadingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [cw, setCw] = useState(0); // container width for alignment
  const half = size / 2;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setCw(rect.width);
      setPos({
        x: e.clientX - rect.left - half,
        y: e.clientY - rect.top - half,
      });
    },
    [half],
  );

  return (
    <motion.div
      ref={containerRef}
      className={fullWidth ? 'relative w-full cursor-default' : 'relative inline-block cursor-default'}
      initial={{ opacity: 0, y: delay > 0 ? 40 : 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ scale: [1, 1.25, 0], opacity: [1, 0.6, 0], borderRadius: ["50% 50% 50% 50% / 50% 50% 50% 50%", "30% 70% 30% 70% / 70% 30% 70% 30%"], filter: "blur(0px)", transition: { duration: 0.35, ease: "easeOut" } }} transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Base layer: gradient text */}
      <Tag className={`hero-heading select-none ${className}`} style={textStyle}>
        {children}
      </Tag>

      {/* Spotlight blob with splash exit */}
      <AnimatePresence>
        {hovered && (
          <motion.div
          className="pointer-events-none absolute top-0 z-10 overflow-hidden"
          style={{
            left: pos.x,
            top: pos.y,
            width: size,
            height: size,
            boxShadow: `0 0 40px ${accentColor}30, 0 0 80px ${accentColor}15, inset 0 0 30px ${accentColor}10`,
          }}
          animate={{
            borderRadius: [
              '70% 30% 50% 50% / 60% 40% 60% 40%',
              '35% 65% 45% 55% / 40% 60% 45% 55%',
              '55% 45% 70% 30% / 55% 45% 35% 65%',
              '40% 60% 30% 70% / 50% 55% 50% 45%',
              '60% 40% 55% 40% / 40% 70% 40% 60%',
              '30% 70% 60% 45% / 55% 30% 65% 45%',
              '50% 50% 40% 60% / 35% 60% 45% 65%',
              '70% 30% 50% 50% / 60% 40% 60% 40%',
            ],
            scale: [1, 1.06, 0.96, 1.05, 0.97, 1.03, 0.98, 1],
            rotate: [0, 2, -3, 1, -2, 3, -1, 0],
          }}
          exit={{ scale: [1, 1.25, 0], opacity: [1, 0.6, 0], borderRadius: ["50% 50% 50% 50% / 50% 50% 50% 50%", "30% 70% 30% 70% / 70% 30% 70% 30%"], filter: "blur(0px)", transition: { duration: 0.35, ease: "easeOut" } }} transition={{
            borderRadius: {
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            },
            scale: {
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            },
            rotate: {
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
        >
          {/* Soft inner glow ring */}
          <div
            className="absolute inset-0"
            style={{
              boxShadow: `inset 0 0 20px ${accentColor}20, inset 0 0 2px ${accentColor}40`,
              borderRadius: 'inherit',
            }}
          />
          {/* Yellow text — full width, offset to align with base */}
          <div
            style={{
              position: 'absolute',
              left: -pos.x,
              top: -pos.y,
              width: cw || '100%',
            }}
          >
            <Tag
              className={`select-none ${className}`}
              style={{
                ...textStyle,
                color: accentColor,
                WebkitTextFillColor: accentColor,
                background: 'none',
              }}
            >
              {children}
            </Tag>
          </div>
        </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
