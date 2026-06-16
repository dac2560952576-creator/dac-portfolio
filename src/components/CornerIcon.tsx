import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface CornerIconProps {
  src: string;
  alt: string;
  className?: string;
  floatAmplitude?: number;
  floatDuration?: number;
  floatDelay?: number;
  rotateDuration?: number;
  rotateDir?: 1 | -1;
}

export default function CornerIcon({
  src,
  alt,
  className = '',
  floatAmplitude = 12,
  floatDuration = 4,
  floatDelay = 0,
  rotateDuration = 18,
  rotateDir = 1,
}: CornerIconProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const nx = (e.clientX - cx) / (rect.width / 2);
    const ny = (e.clientY - cy) / (rect.height / 2);
    setTiltX(-ny * 10);
    setTiltY(nx * 10);
  };

  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => {
    setHovered(false);
    setTiltX(0);
    setTiltY(0);
  };

  return (
    <div
      ref={containerRef}
      className={`absolute cursor-pointer ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Idle float */}
      <motion.div
        animate={{
          y: [-floatAmplitude, floatAmplitude, -floatAmplitude],
        }}
        transition={{
          y: {
            duration: floatDuration,
            delay: floatDelay,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }}
      >
        {/* Image: tilt + scale + rotation */}
        <motion.div
          animate={{
            rotateX: tiltX,
            rotateY: tiltY,
            scale: hovered ? 1.15 : 1,
            rotate: 360 * rotateDir,
          }}
          transition={{
            rotateX: { type: 'spring', stiffness: 250, damping: 22 },
            rotateY: { type: 'spring', stiffness: 250, damping: 22 },
            scale: { type: 'spring', stiffness: 300, damping: 20 },
            rotate: {
              duration: rotateDuration,
              repeat: Infinity,
              ease: 'linear',
            },
          }}
          style={{ transformStyle: 'preserve-3d', perspective: 300 }}
        >
          <img
            src={src}
            alt={alt}
            className="w-full drop-shadow-[0_0_20px_rgba(182,0,168,0.25)]"
            draggable={false}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
