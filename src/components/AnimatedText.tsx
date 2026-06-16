import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface CharacterSpanProps {
  char: string;
  index: number;
  total: number;
  scrollYProgress: any;
}

function CharacterSpan({
  char,
  index,
  total,
  scrollYProgress,
}: CharacterSpanProps) {
  const start = index / total;
  const end = start + 1 / total;
  const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1]);

  return (
    <motion.span style={{ opacity }} className="inline">
      {char}
    </motion.span>
  );
}

interface AnimatedTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function AnimatedText({
  text,
  className = '',
  style,
}: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  });

  const characters = text.split('');

  return (
    <p ref={ref} className={className} style={style}>
      {characters.map((char, i) => (
        <CharacterSpan
          key={i}
          char={char}
          index={i}
          total={characters.length}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </p>
  );
}
