"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import {
  ANALYTICS_STATS,
  HOURLY_DRAMA,
  HUNGER_ANGER_DATA,
  WEEKLY_EMOTIONAL,
} from "@/lib/data";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { staggerContainer, slideUp } from "@/lib/motion";
import GlitchText from "@/components/ui/GlitchText";

export default function ChaosAnalytics() {
  const { ref, isInView } = useScrollReveal();

  return (
    <section
      id="analytics"
      className="min-h-screen px-6 md:px-12 py-section relative bg-bg-base grid-overlay"
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
            SEC_06 // BEHAVIOURAL ANALYTICS
          </p>
          <GlitchText
            text="CHAOS DASHBOARD"
            className="text-display-xl font-sans font-bold text-ink-primary leading-none"
            as="h2"
          />
          <p className="font-mono text-xs text-ink-secondary mt-3">
            REAL-TIME ANALYSIS · DATA INTEGRITY VERIFIED · CONCLUSIONS: UNFORTUNATE
          </p>
          <div className="h-px bg-border mt-6" />
        </motion.div>

        {/* Top stat cards */}
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6"
        >
          {ANALYTICS_STATS.map((s) => (
            <motion.div
              key={s.label}
              variants={slideUp}
              className="bg-bg-surface border border-border rounded-sm p-4"
            >
              <p className="font-mono text-[9px] text-ink-muted tracking-widest uppercase mb-2 leading-relaxed">
                {s.label}
              </p>
              <p className="font-mono text-xl font-bold text-accent-lime tabular-nums">
                {s.value}
              </p>
              <p className="font-mono text-[10px] text-ink-secondary mt-1 leading-relaxed">
                {s.sub}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <HungerAngerChart animate={isInView} />
          <HourlyDramaChart animate={isInView} />
          <WeeklyEmotionalChart animate={isInView} />
          <SleepProductivityChart animate={isInView} />
        </div>
      </div>
    </section>
  );
}

// ─── Chart: Hunger vs Anger Scatter ──────────────────────────────────────────

function HungerAngerChart({ animate }: { animate: boolean }) {
  const W = 260, H = 160;
  const PAD = 24;
  const scaleX = (v: number) => PAD + ((v - 0) / 10) * (W - PAD * 2);
  const scaleY = (v: number) => H - PAD - ((v - 0) / 10) * (H - PAD * 2);

  return (
    <ChartCard
      title="HUNGER → ANGER PIPELINE"
      badge="R² = 0.97"
      badgeColor="text-accent-pink"
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        {/* Axes */}
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#2c2c28" strokeWidth="1" />
        <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="#2c2c28" strokeWidth="1" />
        {/* Trend line */}
        <line
          x1={scaleX(0)} y1={scaleY(0)}
          x2={scaleX(10)} y2={scaleY(10)}
          stroke="#ff3c78" strokeWidth="1" strokeDasharray="3 2" opacity="0.4"
        />
        {/* Axis labels */}
        <text x={W / 2} y={H - 4} fill="#3d3d38" fontSize="7" textAnchor="middle" fontFamily="monospace">HUNGER</text>
        <text x={6} y={H / 2} fill="#3d3d38" fontSize="7" textAnchor="middle" fontFamily="monospace" transform={`rotate(-90,6,${H / 2})`}>ANGER</text>
        {/* Data points */}
        {HUNGER_ANGER_DATA.map((d, i) => (
          <motion.circle
            key={i}
            cx={scaleX(d.hunger)}
            cy={scaleY(d.anger)}
            r="3"
            fill="#ff3c78"
            opacity={0.75}
            initial={{ scale: 0, opacity: 0 }}
            animate={animate ? { scale: 1, opacity: 0.75 } : { scale: 0 }}
            transition={{ duration: 0.4, delay: 0.4 + i * 0.04, ease: "easeOut" }}
            style={{ transformOrigin: `${scaleX(d.hunger)}px ${scaleY(d.anger)}px` }}
          />
        ))}
      </svg>
      <p className="font-mono text-[9px] text-ink-muted mt-1">
        p &lt; 0.001 · sample n = 15 · practically causal
      </p>
    </ChartCard>
  );
}

// ─── Chart: Hourly Drama Bar ──────────────────────────────────────────────────

function HourlyDramaChart({ animate }: { animate: boolean }) {
  const W = 260, H = 140;
  const PAD = { t: 12, r: 8, b: 20, l: 20 };
  const inner = { w: W - PAD.l - PAD.r, h: H - PAD.t - PAD.b };
  const barW = inner.w / HOURLY_DRAMA.length - 1;
  const scaleY = (v: number) => inner.h - (v / 5) * inner.h;

  const peaks = [2, 12, 21, 22, 23];

  return (
    <ChartCard title="DRAMA INCIDENTS / HOUR" badge="PEAK: 02:00–03:00" badgeColor="text-accent-orange">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        {[1, 2, 3, 4, 5].map((v) => (
          <line
            key={v}
            x1={PAD.l} y1={PAD.t + scaleY(v)}
            x2={W - PAD.r} y2={PAD.t + scaleY(v)}
            stroke="#1e1e1b" strokeWidth="1"
          />
        ))}
        {/* Bars */}
        {HOURLY_DRAMA.map((d, i) => {
          const bx = PAD.l + i * (inner.w / HOURLY_DRAMA.length);
          const bh = (d.val / 5) * inner.h;
          const isPeak = peaks.includes(d.hour);
          return (
            <motion.rect
              key={d.hour}
              x={bx}
              y={PAD.t + inner.h - bh}
              width={Math.max(barW, 1)}
              height={bh}
              fill={isPeak ? "#ff8c42" : "#2c2c28"}
              initial={{ scaleY: 0 }}
              animate={animate ? { scaleY: 1 } : { scaleY: 0 }}
              style={{ transformOrigin: `${bx}px ${PAD.t + inner.h}px` }}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.015, ease: [0.16, 1, 0.3, 1] }}
            />
          );
        })}
        {/* X axis labels */}
        {[0, 6, 12, 18, 23].map((h) => {
          const bx = PAD.l + h * (inner.w / HOURLY_DRAMA.length) + barW / 2;
          return (
            <text key={h} x={bx} y={H - 4} fill="#3d3d38" fontSize="6" textAnchor="middle" fontFamily="monospace">
              {String(h).padStart(2, "0")}h
            </text>
          );
        })}
      </svg>
      <p className="font-mono text-[9px] text-ink-muted mt-1">
        orange = statistical peak · most incidents: post-22:00
      </p>
    </ChartCard>
  );
}

// ─── Chart: Weekly Emotional State ───────────────────────────────────────────

function WeeklyEmotionalChart({ animate }: { animate: boolean }) {
  const W = 260, H = 140;
  const PAD = { t: 12, r: 12, b: 24, l: 20 };
  const inner = { w: W - PAD.l - PAD.r, h: H - PAD.t - PAD.b };
  const days = WEEKLY_EMOTIONAL;

  const scaleX = (i: number) => PAD.l + (i / (days.length - 1)) * inner.w;
  const scaleY = (v: number) => PAD.t + inner.h - (v / 10) * inner.h;

  const pathD = days
    .map((d, i) => `${i === 0 ? "M" : "L"}${scaleX(i)},${scaleY(d.val)}`)
    .join(" ");

  const areaD = `${pathD} L${scaleX(days.length - 1)},${PAD.t + inner.h} L${PAD.l},${PAD.t + inner.h} Z`;

  return (
    <ChartCard title="WEEKLY EMOTIONAL STATE" badge="σ = HIGH" badgeColor="text-accent-blue">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        {[2, 5, 8].map((v) => (
          <line key={v} x1={PAD.l} y1={scaleY(v)} x2={W - PAD.r} y2={scaleY(v)} stroke="#1e1e1b" strokeWidth="1" />
        ))}
        {/* Area fill */}
        <motion.path
          d={areaD}
          fill="#4d9fff"
          fillOpacity={0.06}
          initial={{ opacity: 0 }}
          animate={animate ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        />
        {/* Line */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="#4d9fff"
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={animate ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* Points */}
        {days.map((d, i) => (
          <motion.circle
            key={d.day}
            cx={scaleX(i)}
            cy={scaleY(d.val)}
            r="3"
            fill="#4d9fff"
            initial={{ scale: 0 }}
            animate={animate ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.3, delay: 0.6 + i * 0.08 }}
            style={{ transformOrigin: `${scaleX(i)}px ${scaleY(d.val)}px` }}
          />
        ))}
        {/* X labels */}
        {days.map((d, i) => (
          <text key={d.day} x={scaleX(i)} y={H - 6} fill="#3d3d38" fontSize="6.5" textAnchor="middle" fontFamily="monospace">
            {d.day}
          </text>
        ))}
      </svg>
      <p className="font-mono text-[9px] text-ink-muted mt-1">
        monday dread ↔ saturday chaos ↔ sunday anxiety
      </p>
    </ChartCard>
  );
}

// ─── Chart: Sleep vs Productivity (fake scatter) ─────────────────────────────

const SLEEP_DATA = [
  { sleep: 3, prod: 6 }, { sleep: 4, prod: 7 }, { sleep: 5, prod: 7.5 },
  { sleep: 6, prod: 6.5 }, { sleep: 7, prod: 5 }, { sleep: 8, prod: 3 },
  { sleep: 9, prod: 2 }, { sleep: 10, prod: 1 }, { sleep: 5.5, prod: 8 },
  { sleep: 6.5, prod: 5.5 }, { sleep: 7.5, prod: 4 }, { sleep: 4.5, prod: 7.2 },
];

function SleepProductivityChart({ animate }: { animate: boolean }) {
  const W = 260, H = 160;
  const PAD = 24;
  const scaleX = (v: number) => PAD + ((v - 3) / 8) * (W - PAD * 2);
  const scaleY = (v: number) => H - PAD - ((v - 0) / 10) * (H - PAD * 2);

  return (
    <ChartCard
      title="SLEEP vs PRODUCTIVITY"
      badge="PARADOX CONFIRMED"
      badgeColor="text-accent-yellow"
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#2c2c28" strokeWidth="1" />
        <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="#2c2c28" strokeWidth="1" />
        {/* Inverse trend line */}
        <line
          x1={scaleX(3)} y1={scaleY(8)}
          x2={scaleX(10)} y2={scaleY(1)}
          stroke="#ffd60a" strokeWidth="1" strokeDasharray="3 2" opacity="0.4"
        />
        <text x={W / 2} y={H - 4} fill="#3d3d38" fontSize="7" textAnchor="middle" fontFamily="monospace">HOURS SLEPT</text>
        <text x={6} y={H / 2} fill="#3d3d38" fontSize="7" textAnchor="middle" fontFamily="monospace" transform={`rotate(-90,6,${H / 2})`}>PRODUCTIVITY</text>
        {SLEEP_DATA.map((d, i) => (
          <motion.circle
            key={i}
            cx={scaleX(d.sleep)}
            cy={scaleY(d.prod)}
            r="3"
            fill="#ffd60a"
            opacity={0.75}
            initial={{ scale: 0, opacity: 0 }}
            animate={animate ? { scale: 1, opacity: 0.75 } : { scale: 0 }}
            transition={{ duration: 0.4, delay: 0.4 + i * 0.05 }}
            style={{ transformOrigin: `${scaleX(d.sleep)}px ${scaleY(d.prod)}px` }}
          />
        ))}
      </svg>
      <p className="font-mono text-[9px] text-ink-muted mt-1">
        more sleep = more tired. scientists: still investigating.
      </p>
    </ChartCard>
  );
}

// ─── Shared chart wrapper ─────────────────────────────────────────────────────

function ChartCard({
  title,
  badge,
  badgeColor,
  children,
}: {
  title: string;
  badge: string;
  badgeColor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-bg-surface border border-border rounded-sm p-5">
      <div className="flex items-start justify-between mb-4">
        <p className="font-sans text-xs font-semibold tracking-widest uppercase text-ink-secondary">
          {title}
        </p>
        <span className={`font-mono text-[9px] tracking-widest ${badgeColor}`}>{badge}</span>
      </div>
      {children}
    </div>
  );
}
