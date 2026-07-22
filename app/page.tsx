"use client";

import { AnimatePresence, motion, useScroll, useSpring, MotionConfig, type TargetAndTransition } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import BootScreen from "@/components/boot/BootScreen";
import { SUBJECT, CHAOS_WEATHER } from "@/lib/data";
import { ACCENT_COLORS } from "@/lib/utils";

const PhysicalStats    = dynamic(() => import("@/components/stats/PhysicalStats"));
const PersonalityEngine = dynamic(() => import("@/components/personality/PersonalityEngine"));
const DaySimulator     = dynamic(() => import("@/components/simulator/DaySimulator"));
const MemoryVault      = dynamic(() => import("@/components/vault/MemoryVault"));
const ChaosAnalytics   = dynamic(() => import("@/components/analytics/ChaosAnalytics"));
const TimeVisualization = dynamic(() => import("@/components/time/TimeVisualization"));
const BirthdayEnding   = dynamic(() => import("@/components/ending/BirthdayEnding"));
const RightNow         = dynamic(() => import("@/components/daily/RightNow"));
const MoodOrb          = dynamic(() => import("@/components/daily/MoodOrb"));

const NAV_ITEMS = [
  { id: "rightnow",    label: "NOW"   },
  { id: "stats",       label: "STATS" },
  { id: "personality", label: "CORE"  },
  { id: "simulator",   label: "SIM"   },
  { id: "vault",       label: "VAULT" },
  { id: "analytics",   label: "DATA"  },
  { id: "time",        label: "TIME"  },
  { id: "mood",        label: "MOOD"  },
  { id: "ending",      label: "END"   },
];

export default function Home() {
  const [booted, setBooted] = useState(false);
  const handleBootComplete = useCallback(() => setBooted(true), []);

  return (
    <MotionConfig reducedMotion="user">
    <main className="relative bg-bg-base min-h-screen">
      <AnimatePresence>
        {!booted && <BootScreen key="boot" onComplete={handleBootComplete} />}
      </AnimatePresence>

      <AnimatePresence>
        {booted && (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <ScrollProgress />
            <BackToTop />
            <SideNav />
            <Hero />
            <RightNow />
            <PhysicalStats />
            <PersonalityEngine />
            <DaySimulator />
            <MemoryVault />
            <ChaosAnalytics />
            <TimeVisualization />
            <MoodOrb />
            <BirthdayEnding />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
    </MotionConfig>
  );
}

// ─── Scroll progress bar (works at all breakpoints — mobile has no SideNav) ─────

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-0.5 bg-accent-lime z-50 origin-left"
      style={{ scaleX }}
      aria-hidden
    />
  );
}

// ─── Back to top — fills the corner, appears after scrolling past the hero ──────

function BackToTop() {
  const { scrollYProgress } = useScroll();
  const [show, setShow] = useState(false);
  useEffect(
    () => scrollYProgress.on("change", (v) => setShow(v > 0.08)),
    [scrollYProgress]
  );
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-full border border-border
            bg-bg-glass backdrop-blur-sm px-3.5 py-2 hover:border-accent-lime group transition-colors duration-300"
        >
          <span className="text-accent-lime text-xs group-hover:-translate-y-0.5 transition-transform duration-200">↑</span>
          <span className="font-mono text-[10px] text-ink-secondary group-hover:text-accent-lime tracking-widest uppercase transition-colors duration-300">
            TOP
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// ─── Voice note — a message from Jeemut, she controls playback + seek ───────────

// ─── Hero ─────────────────────────────────────────────────────────────────────

function heroBadge(dob: Date, age: number): { label: string; sub: string } {
  const today = new Date();
  const isBirthday =
    today.getMonth() === dob.getMonth() && today.getDate() === dob.getDate();
  const birthdayPassed =
    today.getMonth() > dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() > dob.getDate());
  const dateStr = dob
    .toLocaleDateString("en-GB", { day: "numeric", month: "short" })
    .toUpperCase();

  if (isBirthday)
    return { label: `${age} TODAY`, sub: `HAPPY BIRTHDAY · ${dateStr} · INTERACTIVE EXPERIENCE` };
  if (birthdayPassed)
    return { label: `${age} YEARS`, sub: `BORN ${dateStr} · INTERACTIVE EXPERIENCE` };
  return { label: `TURNING ${age}`, sub: `BIRTHDAY ON ${dateStr} · INTERACTIVE EXPERIENCE` };
}

// ─── Chaos Weather animated icon ─────────────────────────────────────────────

const WEATHER_SYMBOLS: Record<string, string> = {
  storm: "⌁", cloud: "≋", crisis: "◈", clear: "◉",
  chaos: "✦", dance: "◆", dread: "○",
};

const WEATHER_ANIM: Record<string, TargetAndTransition> = {
  storm:  { x: [-2, 2, -2], transition: { duration: 0.4, repeat: Infinity } },
  cloud:  { y: [0, -3, 0],  transition: { duration: 3,   repeat: Infinity, ease: "easeInOut" } },
  crisis: { rotate: [0, 15, 0, -15, 0], transition: { duration: 0.6, repeat: Infinity } },
  clear:  { scale: [1, 1.12, 1], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } },
  chaos:  { rotate: [0, 360], transition: { duration: 3, repeat: Infinity, ease: "linear" } },
  dance:  { y: [0, -5, 0], rotate: [0, 8, 0, -8, 0], transition: { duration: 1, repeat: Infinity } },
  dread:  { scale: [1, 0.92, 1], transition: { duration: 2, repeat: Infinity, ease: "easeInOut" } },
};

const WEATHER_COLORS: Record<string, string> = {
  storm: "text-accent-orange", cloud: "text-accent-blue",  crisis: "text-accent-pink",
  clear: "text-accent-lime",   chaos: "text-accent-pink",  dance:  "text-accent-lime",
  dread: "text-accent-yellow",
};

function Hero() {
  const { label, sub } = heroBadge(SUBJECT.dob, SUBJECT.age);
  const today = CHAOS_WEATHER[new Date().getDay()];

  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col justify-between px-6 md:px-12 pt-12 pb-10 relative grid-overlay-lg overflow-hidden"
    >
      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex items-center justify-between"
      >
        <span className="font-mono text-[10px] text-ink-muted tracking-widest uppercase">
          PD-OS v{SUBJECT.age}.0.0
        </span>
        <span className="font-mono text-[10px] text-ink-muted tracking-widest uppercase">
          22.05.1999 — {new Date().getFullYear()}
        </span>
      </motion.div>

      {/* Center content */}
      <div className="flex-1 flex flex-col justify-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="font-mono text-[10px] text-ink-muted tracking-widest uppercase mb-6"
        >
          SEC_01 // SUBJECT PROFILE — BIRTHDAY EDITION
        </motion.p>

        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            className="font-sans font-bold text-ink-primary leading-none"
            style={{ fontSize: "clamp(5rem,18vw,14rem)", letterSpacing: "-0.04em" }}
          >
            PAPIYA
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-4 mt-6 flex-wrap"
        >
          <span className="font-mono text-xs text-accent-lime tracking-widest uppercase">
            {label}
          </span>
          <span className="font-mono text-[10px] text-ink-muted">·</span>
          <span className="font-mono text-xs text-ink-secondary tracking-widest">{sub}</span>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.7, ease: [0.76, 0, 0.24, 1] }}
          className="h-0.5 bg-accent-lime mt-8 w-full max-w-md"
        />
      </div>

      {/* Bottom — Chaos Weather replaces static status bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="flex items-end justify-between flex-wrap gap-6"
      >
        {/* Weather widget */}
        <div className="flex items-center gap-4">
          <motion.span
            className={`font-mono text-2xl select-none ${WEATHER_COLORS[today.icon] ?? "text-ink-secondary"}`}
            animate={WEATHER_ANIM[today.icon]}
          >
            {WEATHER_SYMBOLS[today.icon]}
          </motion.span>
          <div>
            <p className="font-mono text-[9px] text-ink-muted tracking-widest uppercase mb-0.5">
              TODAY&apos;S FORECAST
            </p>
            <p className={`font-mono text-xs font-bold tracking-widest ${WEATHER_COLORS[today.icon] ?? "text-ink-secondary"}`}>
              {today.forecast}
            </p>
            <div className="flex gap-3 mt-1 flex-wrap">
              {today.conditions.map((c) => (
                <span key={c.label} className="font-mono text-[9px] text-ink-muted tracking-wide">
                  {c.label}: <span className="text-ink-secondary">{c.value}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="font-mono text-[10px] text-accent-lime tracking-widest"
        >
          ↓ SCROLL TO EXPLORE
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Side Navigation ──────────────────────────────────────────────────────────

function SideNav() {
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <nav
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3"
      aria-label="Section navigation"
    >
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => scrollTo(item.id)}
          className="group flex items-center gap-2 cursor-pointer"
          aria-label={`Jump to ${item.label}`}
        >
          <span className="font-mono text-[8px] text-ink-muted tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-right w-10">
            {item.label}
          </span>
          <div className="w-1 h-1 rounded-full bg-border-strong group-hover:bg-accent-lime group-hover:scale-150 transition-all duration-200" />
        </button>
      ))}
    </nav>
  );
}
