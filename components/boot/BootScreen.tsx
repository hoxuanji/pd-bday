"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { BOOT_SYSTEM_CHECKS, BOOT_TRAIT_LOADS, SUBJECT } from "@/lib/data";

const STATUS_COLORS = {
  OK: "text-accent-lime",
  WARN: "text-accent-orange",
  CRIT: "text-accent-pink",
} as const;

interface BootScreenProps {
  onComplete: () => void;
}

type Phase = "sys-check" | "trait-load" | "done" | "ready";

export default function BootScreen({ onComplete }: BootScreenProps) {
  const [phase, setPhase] = useState<Phase>("sys-check");
  const [visibleChecks, setVisibleChecks] = useState(0);
  const [traitProgress, setTraitProgress] = useState<number[]>([]);
  const [currentTrait, setCurrentTrait] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const prefersReduced = useReducedMotion();
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    setIsMobile("ontouchstart" in window);
  }, []);

  // Fast-path for reduced motion
  useEffect(() => {
    if (!prefersReduced) return;
    setPhase("ready");
    setVisibleChecks(BOOT_SYSTEM_CHECKS.length);
    setTraitProgress(BOOT_TRAIT_LOADS.map(() => 100));
  }, [prefersReduced]);

  // Phase 1: sys-check lines appear one by one
  useEffect(() => {
    if (prefersReduced || phase !== "sys-check") return;
    if (visibleChecks >= BOOT_SYSTEM_CHECKS.length) {
      setTimeout(() => {
        setPhase("trait-load");
        setTraitProgress(new Array(BOOT_TRAIT_LOADS.length).fill(0));
      }, 400);
      return;
    }
    const t = setTimeout(() => setVisibleChecks((n) => n + 1), 140);
    return () => clearTimeout(t);
  }, [phase, visibleChecks, prefersReduced]);

  // Phase 2: trait loading bars fill sequentially
  useEffect(() => {
    if (prefersReduced || phase !== "trait-load") return;
    if (currentTrait >= BOOT_TRAIT_LOADS.length) {
      setTimeout(() => setPhase("done"), 500);
      return;
    }

    const trait = BOOT_TRAIT_LOADS[currentTrait];
    const steps = 20;
    const stepTime = trait.duration / steps;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      setTraitProgress((prev) => {
        const next = [...prev];
        next[currentTrait] = Math.min(100, (step / steps) * 100);
        return next;
      });
      if (step >= steps) {
        clearInterval(interval);
        setTimeout(() => setCurrentTrait((n) => n + 1), 80);
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, [phase, currentTrait, prefersReduced]);

  // Phase 3: done → show "complete" briefly → ready
  useEffect(() => {
    if (phase !== "done") return;
    const t = setTimeout(() => setPhase("ready"), 900);
    return () => clearTimeout(t);
  }, [phase]);

  const handleEnter = useCallback(() => {
    if (phase !== "ready" || hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    onComplete();
  }, [phase, onComplete]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter") handleEnter();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleEnter]);

  return (
    <motion.div
      className="fixed inset-0 bg-bg-base z-50 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ y: "-100%", opacity: 0 }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* subtle crt grid */}
      <div className="absolute inset-0 grid-overlay pointer-events-none opacity-50" />

      {/* corner marks */}
      <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-accent-lime/30" />
      <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-accent-lime/30" />
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-accent-lime/30" />
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-accent-lime/30" />

      <div className="w-full max-w-2xl px-8 font-mono">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <p className="text-accent-lime text-xs tracking-widest uppercase mb-1">
            PD-OS v{SUBJECT.age}.0.0 — BIOS INITIALISED
          </p>
          <p className="text-ink-secondary text-[11px] tracking-widest">
            BUILD 19990522 · {SUBJECT.name} PERSONALITY FRAMEWORK
          </p>
          <div className="mt-3 h-px bg-border" />
        </motion.div>

        {/* System checks */}
        <div className="space-y-1 mb-6">
          {BOOT_SYSTEM_CHECKS.slice(0, visibleChecks).map((check, i) => (
            <motion.div
              key={check.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-4 text-[12px]"
            >
              <span className="text-ink-secondary w-10 shrink-0">{check.label}</span>
              <span className="text-ink-primary flex-1">{check.value}</span>
              <span className={STATUS_COLORS[check.status]}>[ {check.status} ]</span>
            </motion.div>
          ))}
        </div>

        {/* Trait loading */}
        {(phase === "trait-load" || phase === "done" || phase === "ready") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="h-px bg-border mb-4" />
            <p className="text-ink-secondary text-[11px] tracking-widest mb-4 uppercase">
              Initialising Personality Core...
            </p>
            <div className="space-y-2">
              {BOOT_TRAIT_LOADS.map((trait, i) => {
                const progress = traitProgress[i] ?? 0;
                const isFailed = !trait.success && progress >= 100;
                return (
                  <div key={trait.name} className="flex items-center gap-3 text-[11px]">
                    <span
                      className={`w-44 shrink-0 ${
                        isFailed ? "text-accent-pink" : "text-ink-primary"
                      }`}
                    >
                      {trait.name}
                    </span>
                    <div className="flex-1 h-0.5 bg-border-dim overflow-hidden rounded-full">
                      <div
                        className={`h-full rounded-full transition-none ${
                          isFailed ? "bg-accent-pink" : "bg-accent-lime"
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span
                      className={`w-24 text-right ${
                        isFailed
                          ? "text-accent-pink"
                          : progress >= 100
                          ? "text-accent-lime"
                          : "text-ink-secondary"
                      }`}
                    >
                      {isFailed
                        ? "NOT_FOUND"
                        : progress >= 100
                        ? "LOADED"
                        : `${Math.floor(progress)}%`}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Done / Ready */}
        <AnimatePresence>
          {(phase === "done" || phase === "ready") && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-6"
            >
              <div className="h-px bg-border mb-4" />
              <p className="text-accent-lime text-xs tracking-widest uppercase">
                ALL SYSTEMS NOMINAL (MOSTLY)
              </p>
              <p className="text-ink-secondary text-[11px] mt-1">
                WARNING: EMOTIONAL_STABILITY module missing. Proceeding anyway.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enter prompt */}
        <AnimatePresence>
          {phase === "ready" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 flex items-center gap-3 cursor-pointer"
              onClick={handleEnter}
            >
              <span className="animate-blink text-accent-lime text-xs">▶</span>
              <span className="text-ink-primary text-sm tracking-widest uppercase">
                {isMobile ? "TAP TO BEGIN" : "PRESS [ENTER] TO BEGIN"}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
