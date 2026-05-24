"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { PERSONALITY_METRICS, SUBJECT } from "@/lib/data";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { staggerContainer, slideUp } from "@/lib/motion";
import StatBar from "@/components/ui/StatBar";
import MagneticButton from "@/components/ui/MagneticButton";
import GlitchText from "@/components/ui/GlitchText";
import { ACCENT_COLORS, type AccentColor } from "@/lib/utils";
import type { PersonalityMetric } from "@/lib/data";

export default function PersonalityEngine() {
  const { ref, isInView } = useScrollReveal();
  const [metrics, setMetrics] = useState(PERSONALITY_METRICS);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [running, setRunning] = useState(false);

  function runDiagnostics() {
    if (running) return;
    setRunning(true);
    // Animate values then snap back to real values
    const scrambled = metrics.map((m) => ({
      ...m,
      value: Math.floor(Math.random() * 40) + 30,
    }));
    setMetrics(scrambled);
    setTimeout(() => {
      setMetrics(PERSONALITY_METRICS);
      setRunning(false);
    }, 1800);
  }

  return (
    <section
      id="personality"
      className="min-h-screen px-6 md:px-12 py-section relative bg-bg-surface/30"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 flex items-end justify-between flex-wrap gap-6"
        >
          <div>
            <p className="font-mono text-[10px] text-ink-muted tracking-widest uppercase mb-2">
              SEC_03 // PERSONALITY ENGINE
            </p>
            <GlitchText
              text="CORE METRICS"
              className="text-display-xl font-sans font-bold text-ink-primary leading-none"
              as="h2"
            />
          </div>
          <MagneticButton
            onClick={runDiagnostics}
            disabled={running}
            className="border border-border px-5 py-2.5 text-xs font-mono tracking-widest uppercase text-ink-secondary hover:border-accent-lime hover:text-accent-lime transition-colors duration-300"
          >
            {running ? "RUNNING..." : "[ RUN DIAGNOSTICS ]"}
          </MagneticButton>
        </motion.div>

        <div className="h-px bg-border mb-10" />

        {/* Metric grid */}
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {metrics.map((metric, i) => (
            <MetricCard
              key={metric.id}
              metric={metric}
              index={i}
              active={activeId === metric.id}
              onToggle={() =>
                setActiveId((prev) => (prev === metric.id ? null : metric.id))
              }
              shouldAnimate={isInView}
            />
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="mt-10 flex items-center gap-4"
        >
          <div className="h-px flex-1 bg-border" />
          <p className="font-mono text-[10px] text-ink-muted tracking-widest whitespace-nowrap">
            DIAGNOSTICS V{SUBJECT.age}.0 · RESULTS MAY VARY
          </p>
          <div className="h-px flex-1 bg-border" />
        </motion.div>
      </div>
    </section>
  );
}

function MetricCard({
  metric,
  index,
  active,
  onToggle,
  shouldAnimate,
}: {
  metric: PersonalityMetric;
  index: number;
  active: boolean;
  onToggle: () => void;
  shouldAnimate: boolean;
}) {
  const accent = ACCENT_COLORS[metric.color];

  return (
    <motion.div
      variants={slideUp}
      onClick={onToggle}
      className="group relative bg-bg-surface border border-border rounded-sm p-6 cursor-pointer hover:border-border-strong transition-colors duration-300 select-none"
    >
      {/* accent bar at bottom */}
      <motion.div
        className={`absolute bottom-0 left-0 h-0.5 ${accent.bg}`}
        initial={{ scaleX: 0, originX: 0 }}
        animate={shouldAnimate ? { scaleX: metric.value / 100 } : { scaleX: 0 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }}
      />

      <div className="flex items-start justify-between mb-4">
        <p className="font-sans text-xs font-semibold tracking-widest uppercase text-ink-secondary">
          {metric.label}
        </p>
        <span className={`font-mono text-2xl font-bold tabular-nums ${accent.text}`}>
          {metric.value}
        </span>
      </div>

      <StatBar
        value={metric.value}
        color={metric.color}
        animate={shouldAnimate}
        height="sm"
        delay={index * 0.08}
      />

      <p className={`font-mono text-[10px] tracking-widest mt-3 ${accent.text} uppercase`}>
        {metric.descriptor}
      </p>

      <AnimatePresence>
        {active && (
          <motion.p
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono text-[11px] text-ink-secondary leading-relaxed overflow-hidden"
          >
            {metric.detail}
          </motion.p>
        )}
      </AnimatePresence>

      <p className="font-mono text-[9px] text-ink-muted mt-2 tracking-wide">
        {active ? "CLICK TO COLLAPSE" : "CLICK FOR DETAIL"}
      </p>
    </motion.div>
  );
}
