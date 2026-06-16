interface LiveProjectButtonProps {
  className?: string;
}

export default function LiveProjectButton({ className = '' }: LiveProjectButtonProps) {
  return (
    <button
      className={`group relative overflow-hidden rounded-full border border-white/10
        bg-white/[0.03] backdrop-blur-md px-8 py-3 sm:px-10 sm:py-3.5
        text-sm sm:text-base
        font-medium uppercase tracking-widest text-[#D7E2EA]
        transition-all duration-300
        hover:border-white/30 hover:bg-white/[0.08] hover:shadow-[0_0_25px_rgba(215,226,234,0.1)]
        ${className}`}
    >
      {/* Shine sweep on hover */}
      <span className="absolute inset-0 -translate-x-full skew-x-[30deg] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />

      <span className="relative">Live Project</span>
    </button>
  );
}
