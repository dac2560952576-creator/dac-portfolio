import { motion } from 'framer-motion';

interface FloatingOrbProps {
  size?: string;
  color?: string;
  blur?: string;
  opacity?: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  duration?: number;
  delay?: number;
}

export default function FloatingOrb({
  size = '400px',
  color = '#B600A8',
  blur = '120px',
  opacity = 0.15,
  top,
  left,
  right,
  bottom,
  duration = 10,
  delay = 0,
}: FloatingOrbProps) {
  return (
    <motion.div
      className="pointer-events-none absolute rounded-full"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: `blur(${blur})`,
        opacity,
        top,
        left,
        right,
        bottom,
      }}
      animate={{
        x: [0, 40, -30, 20, 0],
        y: [0, -30, 20, -40, 0],
        scale: [1, 1.1, 0.95, 1.05, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}
