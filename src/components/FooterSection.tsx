import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import SpotlightHeading from './SpotlightHeading';

function MagnetText({ children }: { children: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setPos({ x: (e.clientX - cx) / 4, y: (e.clientY - cy) / 4 });
  };

  const handleLeave = () => setPos({ x: 0, y: 0 });

  return (
    <span
      ref={ref}
      className="relative inline-block cursor-pointer pb-1 transition-all duration-200 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-white/60 after:transition-all after:duration-300 hover:after:w-full"
      style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </span>
  );
}

function LocalTime() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span>{time}</span>;
}

export default function FooterSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'start 0.3'],
  });

  // Line 1 slides from left, line 2 from right
  const line1X = useTransform(scrollYProgress, [0, 1], [-300, 0]);
  const line2X = useTransform(scrollYProgress, [0, 1], [300, 0]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);

  return (
    <footer id="contact" ref={sectionRef} className="relative px-5 py-20 pb-10 sm:px-8 sm:py-28 sm:pb-12 md:px-10 md:py-36 md:pb-16">
      {/* Heading + Portrait — scroll-driven entrance */}
      <div className="relative mb-12 pl-16 sm:mb-16 sm:pl-32 md:pl-48">
        <motion.div style={{ opacity: titleOpacity }}>
          {/* Line 1 — slides from left */}
          <motion.div style={{ x: line1X }}>
            <SpotlightHeading
              className="text-left font-black uppercase leading-none tracking-tight"
              textStyle={{ fontSize: 'clamp(3.5rem, 12vw, 140px)', textShadow: '0 0 60px rgba(182, 0, 168, 0.12)' }}
            >
              Let&apos;s build
            </SpotlightHeading>
          </motion.div>

          {/* Line 2 — slides from right */}
          <motion.div style={{ x: line2X }}>
            <SpotlightHeading
              className="text-left font-black uppercase leading-none tracking-tight"
              textStyle={{ fontSize: 'clamp(3.5rem, 12vw, 140px)', textShadow: '0 0 60px rgba(182, 0, 168, 0.12)' }}
            >
              <span style={{ paddingLeft: 'clamp(100px, 14vw, 180px)' }}>something</span>
            </SpotlightHeading>
          </motion.div>
        </motion.div>

      </div>

      {/* Contact pills */}
      <motion.div
        className="mb-16 flex flex-wrap items-center justify-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Phone pill */}
        <span className="group relative cursor-pointer overflow-hidden rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 backdrop-blur-md text-sm font-light tracking-wider text-[#D7E2EA]/60 sm:px-8 sm:text-base"
          style={{ boxShadow: '0 0 30px rgba(182,0,168,0.06), inset 0 1px 0 rgba(255,255,255,0.04)' }}>
          {/* Liquid fill — rises from bottom */}
          <span className="absolute inset-x-0 bottom-0 h-full origin-bottom scale-y-0 rounded-full bg-gradient-to-t from-[#FFD700] via-[#FFD700]/80 to-[#FFD700]/40 transition-transform duration-500 ease-out group-hover:scale-y-100" />
          <span className="relative z-10">+86 138 0000 0000</span>
        </span>

        {/* Email pill */}
        <span className="group relative cursor-pointer overflow-hidden rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 backdrop-blur-md text-sm font-light tracking-wider text-[#D7E2EA]/60 sm:px-8 sm:text-base"
          style={{ boxShadow: '0 0 30px rgba(182,0,168,0.06), inset 0 1px 0 rgba(255,255,255,0.04)' }}>
          <span className="absolute inset-x-0 bottom-0 h-full origin-bottom scale-y-0 rounded-full bg-gradient-to-t from-[#FFD700] via-[#FFD700]/80 to-[#FFD700]/40 transition-transform duration-500 ease-out group-hover:scale-y-100" />
          <span className="relative z-10">hello@dac.design</span>
        </span>
      </motion.div>

      {/* Bottom bar */}
      <motion.div
        className="mt-20 flex items-start justify-between sm:mt-28 md:mt-36"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        <div className="flex gap-16 sm:gap-24 md:gap-32">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-light uppercase tracking-[0.2em] text-[#D7E2EA]/40">Version</span>
            <span className="text-base font-light tracking-wider text-[#D7E2EA]/90">2026.06</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-light uppercase tracking-[0.2em] text-[#D7E2EA]/40">Local Time</span>
            <span className="text-base font-light tracking-wider text-[#D7E2EA]/90"><LocalTime /></span>
          </div>
        </div>
        <div className="flex flex-col gap-4 mr-6 sm:mr-10 md:mr-14">
          <span className="text-xs font-light uppercase tracking-[0.2em] text-[#D7E2EA]/40">Socials</span>
          <div className="flex gap-12 text-base font-light tracking-wider text-[#D7E2EA]/90">
            <MagnetText>WeChat</MagnetText>
            <MagnetText>QQ</MagnetText>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
