"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { RIGHT_NOW_DATA, SUBJECT } from "@/lib/data";
import { padZero, getSubjectTime } from "@/lib/utils";
import CinematicSVGScene from "@/components/daily/CinematicSVGScene";

const ACCENT: Record<string, string> = {
  night:"#4d9fff", zzz:"#9b7fe8", alarm:"#ff3c78", wave:"#4d9fff",
  fork:"#c8f135", chicken:"#c8f135", nap:"#9b7fe8", wake:"#ffd60a",
  sparkle:"#ffd60a", moon:"#ff3c78",
};

function useHourClock() {
  const [hour, setHour]              = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [mounted, setMounted]        = useState(false);

  useEffect(() => {
    const tick = () => {
      const { hour, minute, second } = getSubjectTime(SUBJECT.timezone);
      setHour(hour);
      setSecondsLeft(3600 - (minute * 60 + second));
    };
    tick(); setMounted(true);
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return { hour, secondsLeft, mounted };
}

const fmt = (s: number) => `${padZero(Math.floor(s / 60))}:${padZero(s % 60)}`;

export default function RightNow() {
  const { hour, secondsLeft, mounted } = useHourClock();
  const block = RIGHT_NOW_DATA.find(b => b.hours.includes(hour)) ?? RIGHT_NOW_DATA[0];
  const accent = ACCENT[block.icon] ?? "#c8f135";

  if (!mounted) return null;

  return (
    <section
      id="rightnow"
      className="relative overflow-hidden bg-black"
      style={{ minHeight: "100vh" }}
    >
      {/* ── THE CINEMATIC PHOTO SCENE — fills 100% ── */}
      <CinematicSVGScene icon={block.icon} />

      {/* ── Top bar — barely visible metadata ── */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 md:px-10 pt-5">
        <p className="font-mono text-[9px] tracking-widest uppercase opacity-40 text-white">
          SEC_02b // PERUGIA TIME
        </p>
        <motion.p
          className="font-mono text-[9px] tracking-widest"
          style={{ color: accent, opacity: 0.45 }}
          animate={{ opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {String(hour).padStart(2, "0")}:00 BLOCK
        </motion.p>
      </div>

      {/* ── Bottom cinematic overlay — gradient + text ── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 px-6 md:px-10 pb-8 pt-28"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.65) 40%, transparent 100%)",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={block.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Scene tag */}
            <p
              className="font-mono text-[9px] tracking-widest uppercase mb-3"
              style={{ color: accent, opacity: 0.7 }}
            >
              PAPIYA IS PROBABLY...
            </p>

            {/* Scene title */}
            <h3
              className="font-sans font-bold text-white leading-tight mb-3"
              style={{ fontSize: "clamp(1.1rem, 3vw, 1.6rem)" }}
            >
              {block.label}
            </h3>

            {/* Description */}
            <p className="font-mono text-xs text-white/55 leading-relaxed max-w-2xl mb-6 line-clamp-2">
              {block.description}
            </p>

            {/* Bottom row */}
            <div className="flex items-end justify-between gap-4 flex-wrap">
              {/* Progress bar — time until next block */}
              <div className="flex-1 max-w-xs">
                <p className="font-mono text-[8px] text-white/30 tracking-widest mb-1.5 uppercase">
                  Next shift
                </p>
                <div className="h-px bg-white/10 relative overflow-hidden rounded-full">
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 rounded-full"
                    style={{ background: accent }}
                    animate={{ width: `${((3600 - secondsLeft) / 3600) * 100}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>

              {/* Countdown */}
              <motion.p
                className="font-mono font-bold tabular-nums shrink-0"
                style={{ fontSize: "clamp(1.5rem, 3.5vw, 2rem)", color: accent }}
                animate={{ opacity: [0.85, 1, 0.85] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {fmt(secondsLeft)}
              </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Accent bottom edge ── */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px z-30"
        style={{ background: `linear-gradient(to right, transparent, ${accent}50, transparent)` }}
        animate={{ opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </section>
  );
}
