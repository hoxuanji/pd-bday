"use client";

import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { PHYSICAL_STATS } from "@/lib/data";
import { staggerContainer, slideUp } from "@/lib/motion";
import { ACCENT_COLORS, type AccentColor } from "@/lib/utils";
import GlitchText from "@/components/ui/GlitchText";
import ModuleCard, { ModuleHeader } from "@/components/ui/ModuleCard";

const COLOR_DOT: Record<AccentColor, string> = {
  lime: "bg-accent-lime",
  pink: "bg-accent-pink",
  blue: "bg-accent-blue",
  orange: "bg-accent-orange",
  yellow: "bg-accent-yellow",
};

export default function PhysicalStats() {
  const { ref, isInView } = useScrollReveal();

  return (
    <section
      id="stats"
      className="min-h-screen px-6 md:px-12 py-section grid-overlay-lg relative"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="font-mono text-[10px] text-ink-muted tracking-widest uppercase mb-2">
            SEC_02 // BIOMETRIC COMPILATION
          </p>
          <div className="flex items-end gap-6">
            <GlitchText
              text="PHYSICAL STATS"
              className="text-display-xl font-sans font-bold text-ink-primary leading-none"
              as="h2"
            />
            <span className="font-mono text-xs text-ink-secondary mb-3 hidden md:block">
              [SUBJECT: PAPIYA — DATA CLASSIFIED]
            </span>
          </div>
          <div className="h-px bg-border mt-6" />
        </motion.div>

        {/* Stats grid */}
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {PHYSICAL_STATS.map((stat, i) => (
            <StatCard key={stat.id} stat={stat} index={i} />
          ))}
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="font-mono text-[10px] text-ink-muted mt-8 tracking-wide"
        >
          * ALL DATA IS EMPIRICALLY OBSERVED AND CANNOT BE DISPUTED.
          METHODOLOGY: EXISTING NEAR HER FOR SEVERAL YEARS.
        </motion.p>
      </div>
    </section>
  );
}

function StatCard({
  stat,
  index,
}: {
  stat: (typeof PHYSICAL_STATS)[number];
  index: number;
}) {
  const accent = ACCENT_COLORS[stat.color as AccentColor];
  const colorDot = COLOR_DOT[stat.color as AccentColor];

  return (
    <motion.div
      variants={slideUp}
      whileHover={{ y: -4, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
      className="group relative bg-bg-surface border border-border rounded-sm p-6 overflow-hidden cursor-default"
    >
      {/* top-left accent line */}
      <div className={`absolute top-0 left-0 w-12 h-0.5 ${colorDot}`} />

      {/* index */}
      <p className="font-mono text-[10px] text-ink-muted tracking-widest mb-4">
        {String(index + 1).padStart(2, "0")}
      </p>

      {/* big value */}
      <div className="mb-3">
        <span className={`font-mono text-4xl font-bold tracking-tight ${accent.text}`}>
          {stat.rawValue}
        </span>
        <span className="font-mono text-xs text-ink-secondary ml-2 align-bottom">
          {stat.unit}
        </span>
      </div>

      {/* label */}
      <p className="font-sans text-xs font-semibold tracking-widest uppercase text-ink-secondary mb-3">
        {stat.label}
      </p>

      {/* comparison — revealed on hover */}
      <div className="overflow-hidden">
        <p className="font-mono text-xs text-ink-secondary leading-relaxed">
          {stat.comparison}
        </p>
        <p
          className={`font-mono text-[10px] leading-relaxed mt-2 transition-all duration-300
            opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 ${accent.text}`}
        >
          {stat.subtext}
        </p>
      </div>
    </motion.div>
  );
}
