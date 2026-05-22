"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { SUBJECT, TIME_UNITS } from "@/lib/data";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { staggerContainer, slideUp } from "@/lib/motion";
import GlitchText from "@/components/ui/GlitchText";
import { padZero } from "@/lib/utils";

function getElapsedMs(dob: Date): number {
  return Date.now() - dob.getTime();
}

function getAgeComponents(dob: Date) {
  const now = new Date();
  let years = now.getFullYear() - dob.getFullYear();
  let months = now.getMonth() - dob.getMonth();
  let days = now.getDate() - dob.getDate();
  let hours = now.getHours() - dob.getHours();
  let minutes = now.getMinutes() - dob.getMinutes();
  let seconds = now.getSeconds() - dob.getSeconds();

  if (seconds < 0) { seconds += 60; minutes--; }
  if (minutes < 0) { minutes += 60; hours--; }
  if (hours < 0) { hours += 24; days--; }
  if (days < 0) {
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
    months--;
  }
  if (months < 0) { months += 12; years--; }
  return { years, months, days, hours, minutes, seconds };
}

export default function TimeVisualization() {
  const { ref, isInView } = useScrollReveal();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const elapsedMs = getElapsedMs(SUBJECT.dob);
  const age = getAgeComponents(SUBJECT.dob);

  return (
    <section
      id="time"
      className="min-h-screen px-6 md:px-12 py-section relative bg-bg-surface/20"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="font-mono text-[10px] text-ink-muted tracking-widest uppercase mb-2">
            SEC_07 // TEMPORAL ANALYSIS
          </p>
          <GlitchText
            text="AGE ENGINE"
            className="text-display-xl font-sans font-bold text-ink-primary leading-none"
            as="h2"
          />
          <p className="font-mono text-xs text-ink-secondary mt-3">
            LIVE · UPDATING EVERY SECOND · ORIGIN: 22 MAY 1999
          </p>
          <div className="h-px bg-border mt-6" />
        </motion.div>

        {/* Big live counter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-bg-surface border border-border rounded-sm p-8 mb-6"
        >
          <p className="font-mono text-[10px] text-ink-muted tracking-widest uppercase mb-6">
            EXACT AGE — LIVE
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-4 items-end">
            {[
              { value: padZero(age.years, 2), label: "YRS" },
              { value: padZero(age.months, 2), label: "MOS" },
              { value: padZero(age.days, 2), label: "DYS" },
              { value: padZero(age.hours, 2), label: "HRS" },
              { value: padZero(age.minutes, 2), label: "MIN" },
              { value: padZero(age.seconds, 2), label: "SEC" },
            ].map(({ value, label }, i) => (
              <div key={label} className="flex items-end gap-1">
                <span
                  className="font-mono tabular-nums font-bold text-accent-lime"
                  style={{ fontSize: "clamp(2rem, 5vw, 4rem)", lineHeight: 1 }}
                >
                  {value}
                </span>
                <span className="font-mono text-xs text-ink-muted mb-2 tracking-widest">{label}</span>
                {i < 5 && (
                  <span className="font-mono text-2xl text-border-strong mb-1 ml-1">:</span>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 h-px bg-border" />
          <p className="font-mono text-[10px] text-ink-muted mt-3 tracking-wide">
            SECONDS ALIVE TODAY (BIRTHDAY): {(age.hours * 3600 + age.minutes * 60 + age.seconds).toLocaleString()}
          </p>
        </motion.div>

        {/* Multi-unit grid */}
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {TIME_UNITS.map((unit, i) => (
            <TimeUnitCard
              key={unit.id}
              unit={unit}
              elapsedMs={elapsedMs}
              index={i}
            />
          ))}
        </motion.div>

        {/* Cosmic perspective */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2 }}
          className="mt-6 bg-bg-surface border border-border rounded-sm p-6"
        >
          <p className="font-mono text-[10px] text-ink-muted tracking-widest uppercase mb-3">
            COSMIC PERSPECTIVE
          </p>
          <p className="font-sans text-sm text-ink-secondary leading-relaxed">
            The universe is approximately 13.8 billion years old.
            {" "}{SUBJECT.displayName} has existed for{" "}
            <span className="text-accent-lime font-mono">
              {((elapsedMs / (13.8e9 * 365.25 * 24 * 3600 * 1000)) * 100).toExponential(3)}%
            </span>
            {" "}of that time. In cosmic terms, she just got here.
            {" "}In human terms, she's already been through enough for three lifetimes.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function TimeUnitCard({
  unit,
  elapsedMs,
  index,
}: {
  unit: (typeof TIME_UNITS)[number];
  elapsedMs: number;
  index: number;
}) {
  const [value, setValue] = useState(() => unit.compute(elapsedMs));

  useEffect(() => {
    setValue(unit.compute(elapsedMs));
  }, [elapsedMs, unit]);

  const colors = [
    "text-accent-lime", "text-accent-blue", "text-accent-orange",
    "text-accent-pink", "text-accent-yellow", "text-accent-lime",
    "text-accent-blue", "text-accent-orange",
  ];

  return (
    <motion.div
      variants={slideUp}
      className="bg-bg-surface border border-border rounded-sm p-5 overflow-hidden"
    >
      <p className="font-mono text-[9px] text-ink-muted tracking-widest uppercase mb-3">
        {unit.label}
      </p>
      <p className={`font-mono text-lg font-bold tabular-nums leading-tight ${colors[index % colors.length]}`}>
        {value}
      </p>
      <p className="font-mono text-[9px] text-ink-muted mt-1 tracking-widest">
        {unit.unit}
      </p>
    </motion.div>
  );
}
