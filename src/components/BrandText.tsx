import { useState } from 'react';
import { motion } from 'framer-motion';

const chars = 'Code by DAC'.split('');

export default function BrandText({ onClick }: { onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <span
      className="inline-flex cursor-pointer select-none"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {chars.map((char, i) => (
        <motion.span
          key={i}
          className="inline-block font-light tracking-wider text-[#D7E2EA]/70 sm:text-base md:text-lg"
          style={{
            fontSize: 'clamp(0.8rem, 1.2vw, 1.1rem)',
            textTransform: 'none',
            textShadow: hovered
              ? '0 0 12px rgba(182,0,168,0.5)'
              : 'none',
          }}
          animate={
            hovered
              ? {
                  y: [0, -6, 0, 3, 0],
                  color: [
                    'rgba(215,226,234,0.7)',
                    'rgba(255,255,255,1)',
                    'rgba(215,226,234,0.7)',
                  ],
                  transition: {
                    y: {
                      duration: 0.5,
                      delay: i * 0.03,
                      ease: 'easeInOut',
                    },
                    color: {
                      duration: 0.5,
                      delay: i * 0.03,
                    },
                  },
                }
              : {
                  y: 0,
                  color: 'rgba(215,226,234,0.7)',
                  textShadow: 'none',
                  transition: {
                    y: { duration: 0.2, delay: (chars.length - i) * 0.01 },
                    color: { duration: 0.15 },
                  },
                }
          }
        >
          {char === ' ' ? ' ' : char}
        </motion.span>
      ))}
    </span>
  );
}
