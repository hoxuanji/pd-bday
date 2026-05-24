"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { MOOD_OPTIONS, type MoodId, type MoodOption } from "@/lib/data";
import { useMoodLog } from "@/hooks/useMoodLog";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ACCENT_COLORS, type AccentColor, cn } from "@/lib/utils";
import GlitchText from "@/components/ui/GlitchText";

// ─── Pulsing orb visual ───────────────────────────────────────────────────────

function Orb({
  color,
  size = 180,
  pulse = true,
  onClick,
  label,
}: {
  color: AccentColor | null;
  size?: number;
  pulse?: boolean;
  onClick?: () => void;
  label?: string;
}) {
  const hex: Record<AccentColor, string> = {
    lime: "#c8f135", pink: "#ff3c78", blue: "#4d9fff",
    orange: "#ff8c42", yellow: "#ffd60a",
  };
  const activeHex = color ? hex[color] : "#3a3a34";
  const glowColor = color ? hex[color] : "#262622";

  return (
    <motion.button
      onClick={onClick}
      className="relative flex items-center justify-center cursor-pointer rounded-full focus:outline-none"
      style={{ width: size, height: size }}
      whileTap={{ scale: 0.95 }}
      aria-label={label ?? "Mood orb"}
    >
      {/* Outer glow ring */}
      {pulse && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: `radial-gradient(circle, ${glowColor}22 0%, transparent 70%)` }}
          animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0.2, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      {/* Main orb */}
      <motion.div
        className="rounded-full"
        style={{
          width: size * 0.72,
          height: size * 0.72,
          background: `radial-gradient(circle at 35% 35%, ${activeHex}44, ${activeHex}18, transparent 70%)`,
          border: `1.5px solid ${activeHex}55`,
          boxShadow: `0 0 ${size * 0.2}px ${activeHex}22, inset 0 0 ${size * 0.1}px ${activeHex}11`,
        }}
        animate={pulse ? { scale: [1, 1.03, 1] } : {}}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Center dot */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 0.12,
          height: size * 0.12,
          background: activeHex,
          opacity: 0.7,
        }}
        animate={pulse ? { opacity: [0.5, 1, 0.5] } : {}}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.button>
  );
}

// ─── Single mood choice button ────────────────────────────────────────────────

function MoodChoice({
  option,
  selected,
  onSelect,
}: {
  option: MoodOption;
  selected: boolean;
  onSelect: () => void;
}) {
  const accent = ACCENT_COLORS[option.color];
  return (
    <motion.button
      onClick={onSelect}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col items-center gap-2 px-4 py-4 border rounded-sm cursor-pointer",
        "transition-colors duration-200 min-w-[100px]",
        selected
          ? `border-current bg-current/5 ${accent.text} ${accent.border}`
          : "border-border hover:border-border-strong text-ink-secondary hover:text-ink-primary"
      )}
      whileTap={{ scale: 0.97 }}
      aria-pressed={selected}
    >
      <span className={cn("font-mono text-2xl select-none", selected && accent.text)}>
        {option.symbol}
      </span>
      <span className="font-sans text-[10px] font-semibold tracking-widest uppercase whitespace-nowrap">
        {option.label}
      </span>
      <span className="font-mono text-[9px] text-ink-muted text-center leading-relaxed max-w-[90px]">
        {option.sub}
      </span>
    </motion.button>
  );
}

// ─── 7-day history dot ────────────────────────────────────────────────────────

function DayDot({ date, mood, label }: { date: string; mood: MoodId | null; label: string }) {
  const option = MOOD_OPTIONS.find((m) => m.id === mood);
  const hex: Record<AccentColor, string> = {
    lime: "#c8f135", pink: "#ff3c78", blue: "#4d9fff",
    orange: "#ff8c42", yellow: "#ffd60a",
  };
  const isToday = date === new Date().toISOString().slice(0, 10);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300",
          mood ? "border-transparent" : "border-border-dim",
          isToday && !mood && "border-border-strong animate-pulse-slow"
        )}
        style={
          option
            ? {
                background: `${hex[option.color]}22`,
                border: `1.5px solid ${hex[option.color]}66`,
                boxShadow: `0 0 8px ${hex[option.color]}22`,
              }
            : {}
        }
        title={option?.label}
      >
        {option && (
          <span className="font-mono text-xs" style={{ color: hex[option.color] }}>
            {option.symbol}
          </span>
        )}
      </div>
      <span
        className={cn(
          "font-mono text-[9px] tracking-widest",
          isToday ? "text-ink-secondary" : "text-ink-muted"
        )}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function MoodOrb() {
  const { ref, isInView } = useScrollReveal();
  const { todayMood, logMood, last7, loaded } = useMoodLog();
  const [expanded, setExpanded] = useState(false);

  const currentOption = MOOD_OPTIONS.find((m) => m.id === todayMood) ?? null;

  if (!loaded) return null;

  return (
    <section
      id="mood"
      className="px-6 md:px-12 py-section relative bg-bg-base"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="font-mono text-[10px] text-ink-muted tracking-widest uppercase mb-2">
            SEC_09 // DAILY CHECK-IN
          </p>
          <GlitchText
            text="HOW IS SHE TODAY"
            className="text-display-xl font-sans font-bold text-ink-primary leading-none"
            as="h2"
          />
          <div className="h-px bg-border mt-6" />
        </motion.div>

        <div className="flex flex-col items-center">
          {/* Orb */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <Orb
              color={currentOption?.color ?? null}
              size={180}
              onClick={() => setExpanded((v) => !v)}
              label="Log today's mood"
            />
          </motion.div>

          {/* Status label */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="mt-4 text-center"
          >
            {currentOption ? (
              <>
                <p
                  className={`font-mono text-sm font-bold tracking-widest ${
                    ACCENT_COLORS[currentOption.color].text
                  }`}
                >
                  {currentOption.label}
                </p>
                <p className="font-mono text-[10px] text-ink-muted mt-1">
                  {currentOption.sub}
                </p>
              </>
            ) : (
              <p className="font-mono text-sm text-ink-secondary tracking-widest animate-pulse-slow">
                TAP TO LOG TODAY&apos;S MOOD
              </p>
            )}
            <button
              onClick={() => setExpanded((v) => !v)}
              className="font-mono text-[9px] text-ink-muted tracking-widest mt-3 hover:text-ink-secondary transition-colors duration-200 cursor-pointer"
            >
              {expanded ? "[ COLLAPSE ]" : "[ CHANGE ]"}
            </button>
          </motion.div>

          {/* Mood choices */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden w-full"
              >
                <div className="flex flex-wrap justify-center gap-3 mt-8 pb-2">
                  {MOOD_OPTIONS.map((option, i) => (
                    <motion.div
                      key={option.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <MoodChoice
                        option={option}
                        selected={todayMood === option.id}
                        onSelect={() => {
                          logMood(option.id);
                          setExpanded(false);
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 7-day history */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.7 }}
            className="mt-12 w-full"
          >
            <div className="h-px bg-border mb-6" />
            <p className="font-mono text-[10px] text-ink-muted tracking-widest uppercase text-center mb-5">
              LAST 7 DAYS
            </p>
            <div className="flex justify-center gap-4 md:gap-6">
              {last7.map((day) => (
                <DayDot key={day.date} date={day.date} mood={day.mood} label={day.label} />
              ))}
            </div>
            <p className="font-mono text-[9px] text-ink-muted tracking-widest text-center mt-6">
              STORED LOCALLY · RESETS IF BROWSER CACHE IS CLEARED
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
