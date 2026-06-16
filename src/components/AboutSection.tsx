import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import SpotlightHeading from './SpotlightHeading';
import MagnifyText from './MagnifyText';
import CornerIcon from './CornerIcon';
import BackgroundOrbs from './BackgroundOrbs';

const paragraph1 =
  'Gym is my therapy. Something about counting reps when my brain is fried from debugging CSS all day — it just resets me. Deadlifts over desk jobs, any day.';

const paragraph2 =
  "Travel keeps me curious. I chase sunrise hikes, weird street food, and getting lost in cities where I don't speak the language. The best ideas always hit when I'm nowhere near a computer.";

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Heading: scale down from 1.25 → 1, fade in
  const headingScale = useTransform(scrollYProgress, [0, 0.25], [1.25, 1]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.15], [0.3, 1]);

  // Central glow: intensifies as you enter
  const glowScale = useTransform(scrollYProgress, [0, 0.3, 0.6], [0.6, 1.3, 0.9]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.2, 0.5], [0.1, 0.4, 0.15]);

  // Content: slight upward lift
  const contentY = useTransform(scrollYProgress, [0, 0.3], [60, 0]);

  // Corner entrance: simple opacity fade-in
  const rawCornerOpacity = useTransform(scrollYProgress, [0.05, 0.3], [0, 1]);
  const smoothCornerOpacity = useSpring(rawCornerOpacity, { stiffness: 100, damping: 24 });

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative flex min-h-screen flex-col items-center justify-center px-5 py-20 sm:px-8 md:px-10"
    >
      {/* Background orbs */}
      <BackgroundOrbs variant="default" />

      {/* ── Central entrance glow ──────────────────────────────────── */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#B600A8]/15"
        style={{
          width: 'min(600px, 80vw)',
          height: 'min(600px, 80vw)',
          filter: 'blur(120px)',
          scale: glowScale,
          opacity: glowOpacity,
        }}
      />

      {/* ── Decorative corner icons — fade-in + float + tilt ── */}
      <motion.div style={{ opacity: smoothCornerOpacity }}>
        <CornerIcon
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png"
          alt="Moon"
          className="left-[1%] top-[4%] w-[100px] sm:left-[2%] sm:w-[140px] md:left-[4%] md:w-[180px]"
          floatAmplitude={12} floatDuration={4} floatDelay={0}
          rotateDuration={20} rotateDir={1}
        />
      </motion.div>

      <motion.div style={{ opacity: smoothCornerOpacity }}>
        <CornerIcon
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png"
          alt="3D Object"
          className="bottom-[8%] left-[3%] w-[80px] sm:left-[6%] sm:w-[110px] md:left-[10%] md:w-[150px]"
          floatAmplitude={14} floatDuration={5} floatDelay={2}
          rotateDuration={26} rotateDir={-1}
        />
      </motion.div>

      <motion.div style={{ opacity: smoothCornerOpacity }}>
        <CornerIcon
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png"
          alt="Lego"
          className="right-[1%] top-[4%] w-[100px] sm:right-[2%] sm:w-[140px] md:right-[4%] md:w-[180px]"
          floatAmplitude={10} floatDuration={4.5} floatDelay={1}
          rotateDuration={22} rotateDir={-1}
        />
      </motion.div>

      <motion.div style={{ opacity: smoothCornerOpacity }}>
        <CornerIcon
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png"
          alt="3D Group"
          className="bottom-[8%] right-[3%] w-[110px] sm:right-[6%] sm:w-[140px] md:right-[10%] md:w-[190px]"
          floatAmplitude={11} floatDuration={3.8} floatDelay={3}
          rotateDuration={24} rotateDir={1}
        />
      </motion.div>

      {/* ── Content block with lift ────────────────────────────────── */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        style={{ y: contentY }}
      >
        {/* About me heading — scale reveal + spotlight */}
        <motion.div style={{ scale: headingScale, opacity: headingOpacity }}>
          <SpotlightHeading
            className="text-center font-black uppercase leading-none tracking-tight"
            textStyle={{
              fontSize: 'clamp(3rem, 12vw, 160px)',
              textShadow: '0 0 80px rgba(182, 0, 168, 0.1)',
            }}
          >
            About me
          </SpotlightHeading>
        </motion.div>

        {/* Animated text — two paragraphs */}
        <div className="relative mt-10 flex flex-col gap-6 sm:mt-14 sm:gap-8 md:mt-16 md:gap-10">
          <div className="absolute inset-0 -z-10 scale-110 rounded-3xl bg-white/[0.02] backdrop-blur-sm" />
          <MagnifyText
            text={paragraph1}
            className="mx-auto max-w-[560px] text-center font-light leading-relaxed tracking-wide text-[#D7E2EA]/80"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
          />
          <MagnifyText
            text={paragraph2}
            className="mx-auto max-w-[560px] text-center font-light leading-relaxed tracking-wide text-[#D7E2EA]/80"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
          />
        </div>
      </motion.div>
    </section>
  );
}
