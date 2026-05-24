"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import type { RightNowBlock } from "@/lib/data";
import { SUBJECT } from "@/lib/data";
import { getSubjectTimeString } from "@/lib/utils";

// ─── Grain data URI ────────────────────────────────────────────────────────────
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`;

// ─── Scene configs ─────────────────────────────────────────────────────────────
type SceneId = "midnight" | "sleeping" | "chaos" | "memory" | "main" | "alarm";

type SceneConfig = {
  photo: string;
  objectPosition: string;
  cssFilter: string;
  darkGrade: string;       // rgba — overall darken
  colorGrade: string;      // rgba — mood tint (multiply)
  screenGlow: string;      // radial gradient — neon light (screen)
  accent: string;
  grainOpacity: number;
  zoomDuration: number;    // Ken Burns speed
  zoomScale: [number, number];
  sceneId: SceneId;
  moodLabel: string;
};

const SCENES: Record<RightNowBlock["icon"], SceneConfig> = {
  // papiya_6.jpg — purple/blue nightclub side profile
  night: {
    photo: "/papiya_6.jpg", objectPosition: "center 22%",
    cssFilter: "saturate(1.25) brightness(0.78) contrast(1.06)",
    darkGrade: "rgba(0,0,0,0.28)", colorGrade: "rgba(20,8,70,0.32)",
    screenGlow: "radial-gradient(ellipse 60% 70% at 35% 50%, rgba(77,159,255,0.18) 0%, transparent 65%)",
    accent: "#4d9fff", grainOpacity: 0.075, zoomDuration: 12, zoomScale: [1, 1.045],
    sceneId: "midnight", moodLabel: "somewhere between midnight and 3am.",
  },
  moon: {
    photo: "/papiya_6.jpg", objectPosition: "center 18%",
    cssFilter: "saturate(1.3) brightness(0.76) contrast(1.08)",
    darkGrade: "rgba(0,0,0,0.32)", colorGrade: "rgba(35,5,80,0.38)",
    screenGlow: "radial-gradient(ellipse 55% 65% at 30% 45%, rgba(255,60,120,0.15) 0%, transparent 60%)",
    accent: "#ff3c78", grainOpacity: 0.08, zoomDuration: 10, zoomScale: [1.01, 1.055],
    sceneId: "midnight", moodLabel: "the kind of night that stays with you.",
  },

  // papiya_3.jpg — lying on pink pillow, eyes half open
  zzz: {
    photo: "/papiya_3.jpg", objectPosition: "center 40%",
    cssFilter: "brightness(0.72) saturate(0.65) sepia(0.08)",
    darkGrade: "rgba(0,0,0,0.25)", colorGrade: "rgba(45,12,75,0.28)",
    screenGlow: "radial-gradient(ellipse 80% 50% at 50% 60%, rgba(155,127,232,0.12) 0%, transparent 70%)",
    accent: "#9b7fe8", grainOpacity: 0.06, zoomDuration: 6, zoomScale: [1, 1.014],
    sceneId: "sleeping", moodLabel: "still asleep.",
  },
  wave: {
    photo: "/papiya_3.jpg", objectPosition: "center 45%",
    cssFilter: "brightness(0.78) saturate(0.72)",
    darkGrade: "rgba(0,0,0,0.22)", colorGrade: "rgba(20,30,70,0.22)",
    screenGlow: "radial-gradient(ellipse 70% 40% at 50% 55%, rgba(77,159,255,0.1) 0%, transparent 65%)",
    accent: "#4d9fff", grainOpacity: 0.06, zoomDuration: 7, zoomScale: [1, 1.016],
    sceneId: "sleeping", moodLabel: "horizontal. technically awake.",
  },
  nap: {
    photo: "/papiya_3.jpg", objectPosition: "center 38%",
    cssFilter: "brightness(0.68) saturate(0.6) sepia(0.12)",
    darkGrade: "rgba(0,0,0,0.3)", colorGrade: "rgba(50,10,80,0.32)",
    screenGlow: "radial-gradient(ellipse 75% 55% at 50% 58%, rgba(155,127,232,0.1) 0%, transparent 68%)",
    accent: "#9b7fe8", grainOpacity: 0.065, zoomDuration: 8, zoomScale: [1, 1.01],
    sceneId: "sleeping", moodLabel: "the 20-minute nap. it has been 3 hours.",
  },

  // papiya_2.jpg — green neon bar, full body standing
  fork: {
    photo: "/papiya_2.jpg", objectPosition: "center 18%",
    cssFilter: "saturate(1.55) brightness(0.82) contrast(1.18)",
    darkGrade: "rgba(0,0,0,0.2)", colorGrade: "rgba(0,20,5,0.22)",
    screenGlow: "radial-gradient(ellipse 65% 75% at 50% 35%, rgba(0,255,100,0.1) 0%, transparent 60%)",
    accent: "#c8f135", grainOpacity: 0.07, zoomDuration: 10, zoomScale: [1.01, 1.05],
    sceneId: "chaos", moodLabel: "hungry. critically low fuel.",
  },
  chicken: {
    photo: "/papiya_2.jpg", objectPosition: "center 22%",
    cssFilter: "saturate(1.45) brightness(0.84) contrast(1.14)",
    darkGrade: "rgba(0,0,0,0.18)", colorGrade: "rgba(0,18,0,0.2)",
    screenGlow: "radial-gradient(ellipse 60% 70% at 50% 30%, rgba(0,255,120,0.12) 0%, transparent 58%)",
    accent: "#c8f135", grainOpacity: 0.07, zoomDuration: 8, zoomScale: [1, 1.04],
    sceneId: "chaos", moodLabel: "culinary operations. the chicken will be removed.",
  },

  // papiya_1.jpg — close selfie, pink floral top
  alarm: {
    photo: "/papiya_1.jpg", objectPosition: "center 28%",
    cssFilter: "saturate(1.35) brightness(0.82) contrast(1.12)",
    darkGrade: "rgba(0,0,0,0.28)", colorGrade: "rgba(60,5,25,0.3)",
    screenGlow: "radial-gradient(ellipse 50% 60% at 50% 40%, rgba(255,60,120,0.14) 0%, transparent 62%)",
    accent: "#ff3c78", grainOpacity: 0.08, zoomDuration: 4, zoomScale: [1, 1.06],
    sceneId: "alarm", moodLabel: "alarm has been silenced. the body has not moved.",
  },

  // papiya_5.jpg — warm restaurant portrait
  sparkle: {
    photo: "/papiya_5.jpg", objectPosition: "center 28%",
    cssFilter: "brightness(0.88) saturate(0.82) sepia(0.1)",
    darkGrade: "rgba(0,0,0,0.2)", colorGrade: "rgba(80,45,8,0.22)",
    screenGlow: "radial-gradient(ellipse 65% 70% at 48% 42%, rgba(255,180,80,0.1) 0%, transparent 65%)",
    accent: "#ffd60a", grainOpacity: 0.09, zoomDuration: 14, zoomScale: [1.02, 1.0],
    sceneId: "memory", moodLabel: "somewhere warm. something good.",
  },

  // papiya_4.jpg — rooftop city portrait
  wake: {
    photo: "/papiya_4.jpg", objectPosition: "center 15%",
    cssFilter: "brightness(0.92) saturate(1.06) contrast(1.03)",
    darkGrade: "rgba(0,0,0,0.18)", colorGrade: "rgba(18,28,50,0.2)",
    screenGlow: "radial-gradient(ellipse 55% 60% at 50% 50%, rgba(255,214,10,0.08) 0%, transparent 65%)",
    accent: "#ffd60a", grainOpacity: 0.05, zoomDuration: 16, zoomScale: [1, 1.04],
    sceneId: "main", moodLabel: "the main character.",
  },
};

// ─── Grain overlay ─────────────────────────────────────────────────────────────
function Grain({ opacity }: { opacity: number }) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{ backgroundImage: GRAIN, backgroundSize: "240px 240px", opacity }}
      animate={prefersReduced ? {} : {
        backgroundPosition: ["0% 0%", "60% 30%", "20% 80%", "80% 10%", "0% 0%"],
      }}
      transition={{ duration: 0.55, repeat: Infinity, ease: "linear" }}
    />
  );
}

// ─── Scene-specific atmospherics ───────────────────────────────────────────────
function MidnightElements({ accent }: { accent: string }) {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => setTime(getSubjectTimeString(SUBJECT.timezone));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* Live timestamp drifting */}
      <motion.div className="absolute font-mono tracking-widest" style={{ color: accent, left: "12%", top: "32%", fontSize: "0.65rem", opacity: 0.6 }}
        animate={{ y: [0, -6, 0], opacity: [0.5, 0.75, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
        {time}
      </motion.div>
      {/* Coordinate — Perugia */}
      <motion.div className="absolute font-mono text-[9px] tracking-widest" style={{ color: accent, right: "10%", top: "28%", opacity: 0.4 }}
        animate={{ opacity: [0.3, 0.55, 0.3] }} transition={{ duration: 3, repeat: Infinity }}>
        43.1107° N  12.3908° E · PERUGIA
      </motion.div>
      {/* Floating particles */}
      {[14, 28, 72, 85, 55].map((l, i) => (
        <motion.div key={i} className="absolute rounded-full" style={{ left: `${l}%`, bottom: "15%", width: 2, height: 2, background: accent }}
          animate={{ y: [0, -(120 + i * 30)], opacity: [0.7, 0] }}
          transition={{ duration: 3 + i * 0.5, delay: i * 0.8, repeat: Infinity, ease: "easeOut" }} />
      ))}
      {/* Neon scan line */}
      <motion.div className="absolute left-0 right-0 h-px pointer-events-none" style={{ background: `linear-gradient(to right, transparent, ${accent}44, transparent)` }}
        animate={{ top: ["20%", "80%", "20%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }} />
    </>
  );
}

function SleepingElements({ accent }: { accent: string }) {
  return (
    <>
      {(["Z", "Zz", "ZzZ", "z", "zz"] as const).map((z, i) => (
        <motion.div key={i} className="absolute font-mono font-bold pointer-events-none"
          style={{ left: `${18 + i * 14}%`, bottom: `${18 + i * 6}%`, fontSize: `${0.7 + i * 0.15}rem`, color: accent, opacity: 0 }}
          animate={{ y: [0, -140], opacity: [0, 0.8, 0] }}
          transition={{ duration: 2.8, delay: i * 0.9, repeat: Infinity, ease: "easeOut" }}>
          {z}
        </motion.div>
      ))}
      {/* Soft bokeh circles */}
      {[20, 65, 80, 40].map((l, i) => (
        <motion.div key={i} className="absolute rounded-full pointer-events-none"
          style={{ left: `${l}%`, top: `${20 + i * 15}%`, width: 6 + i * 4, height: 6 + i * 4, background: accent, filter: "blur(4px)", opacity: 0 }}
          animate={{ opacity: [0, 0.18, 0], scale: [0.8, 1.4, 0.8] }}
          transition={{ duration: 4 + i, delay: i * 1.2, repeat: Infinity, ease: "easeInOut" }} />
      ))}
    </>
  );
}

function ChaosElements({ accent }: { accent: string }) {
  const foods = ["🍕", "🍫", "🧃", "🥥", "🍷", "🍾"];
  return (
    <>
      {foods.map((food, i) => (
        <motion.div key={i} className="absolute pointer-events-none select-none"
          style={{ left: `${6 + i * 15}%`, bottom: "12%", fontSize: "1.3rem", opacity: 0 }}
          animate={{ y: [0, -(60 + i * 20), 0], opacity: [0, 0.85, 0], rotate: [0, i % 2 === 0 ? 12 : -12, 0] }}
          transition={{ duration: 2.5 + i * 0.4, delay: i * 0.5, repeat: Infinity }}>
          {food}
        </motion.div>
      ))}
      {/* Flicker bar */}
      <motion.div className="absolute left-0 right-0 h-0.5 pointer-events-none" style={{ background: `${accent}33`, top: "50%" }}
        animate={{ opacity: [1, 0, 1, 0.4, 1], scaleY: [1, 0, 1, 2, 1] }}
        transition={{ duration: 0.35, repeat: Infinity, repeatDelay: 3 }} />
      {/* FUEL STATUS */}
      <motion.div className="absolute font-mono text-[9px] tracking-widest pointer-events-none" style={{ color: accent, right: "8%", top: "22%", opacity: 0.7 }}
        animate={{ opacity: [0.5, 0.9, 0.5] }} transition={{ duration: 1.2, repeat: Infinity }}>
        FUEL: CRITICAL
      </motion.div>
    </>
  );
}

function MemoryElements({ accent }: { accent: string }) {
  return (
    <>
      {/* Handwritten-style drifting text */}
      <motion.div className="absolute pointer-events-none select-none"
        style={{ left: "8%", top: "20%", color: accent, opacity: 0, fontFamily: "serif", fontStyle: "italic", fontSize: "0.75rem", letterSpacing: "0.05em" }}
        animate={{ opacity: [0, 0.4, 0], x: [0, 8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
        saved.
      </motion.div>
      <motion.div className="absolute pointer-events-none select-none"
        style={{ right: "10%", bottom: "38%", color: accent, opacity: 0, fontFamily: "serif", fontStyle: "italic", fontSize: "0.65rem" }}
        animate={{ opacity: [0, 0.3, 0], y: [0, -5, 0] }}
        transition={{ duration: 8, delay: 2, repeat: Infinity, ease: "easeInOut" }}>
        somewhere warm.
      </motion.div>
      {/* Warm bokeh dots */}
      {[15, 80, 60, 30].map((l, i) => (
        <motion.div key={i} className="absolute rounded-full pointer-events-none"
          style={{ left: `${l}%`, top: `${25 + i * 12}%`, width: 5 + i * 3, height: 5 + i * 3, background: "#ffd060", filter: "blur(5px)", opacity: 0 }}
          animate={{ opacity: [0, 0.15, 0] }}
          transition={{ duration: 5 + i * 1.5, delay: i * 1.4, repeat: Infinity, ease: "easeInOut" }} />
      ))}
    </>
  );
}

function MainCharElements({ accent }: { accent: string }) {
  return (
    <>
      {/* City grid lines — subtle */}
      <motion.div className="absolute inset-0 pointer-events-none opacity-10"
        style={{ backgroundImage: `linear-gradient(${accent}20 1px, transparent 1px), linear-gradient(90deg, ${accent}20 1px, transparent 1px)`, backgroundSize: "60px 60px" }}
        animate={{ opacity: [0.08, 0.12, 0.08] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
      {/* City coordinate — Perugia rooftop */}
      <motion.div className="absolute font-mono text-[9px] tracking-widest pointer-events-none" style={{ left: "8%", top: "15%", color: accent, opacity: 0.5 }}
        animate={{ opacity: [0.35, 0.6, 0.35] }} transition={{ duration: 3, repeat: Infinity }}>
        43.1107° N · PERUGIA, ITALY
      </motion.div>
      {/* Particles rising */}
      {[25, 50, 75, 88].map((l, i) => (
        <motion.div key={i} className="absolute rounded-full pointer-events-none"
          style={{ left: `${l}%`, bottom: "10%", width: 2, height: 2, background: accent }}
          animate={{ y: [0, -(100 + i * 25)], opacity: [0.5, 0] }}
          transition={{ duration: 4 + i * 0.6, delay: i * 1.1, repeat: Infinity, ease: "easeOut" }} />
      ))}
    </>
  );
}

function AlarmElements({ accent }: { accent: string }) {
  return (
    <>
      <motion.div className="absolute inset-0 pointer-events-none"
        style={{ background: `${accent}08` }}
        animate={{ opacity: [1, 0, 1, 0.6, 1] }}
        transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 2.5 }} />
      {["!", "!!", "wake up"] .map((t, i) => (
        <motion.div key={i} className="absolute font-mono font-bold pointer-events-none select-none"
          style={{ left: `${15 + i * 28}%`, top: `${20 + i * 10}%`, color: accent, fontSize: `${0.7 + i * 0.2}rem`, opacity: 0 }}
          animate={{ opacity: [0, 0.9, 0], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 0.5, delay: i * 0.3, repeat: Infinity, repeatDelay: 2.5 }}>
          {t}
        </motion.div>
      ))}
    </>
  );
}

// ─── Main CinematicScene ───────────────────────────────────────────────────────
export default function CinematicScene({ icon }: { icon: RightNowBlock["icon"] }) {
  const scene = SCENES[icon];
  const prefersReduced = useReducedMotion();

  const ElementsMap: Record<SceneId, React.FC<{ accent: string }>> = {
    midnight: MidnightElements,
    sleeping: SleepingElements,
    chaos: ChaosElements,
    memory: MemoryElements,
    main: MainCharElements,
    alarm: AlarmElements,
  };
  const SceneElements = ElementsMap[scene.sceneId];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={icon}
        className="absolute inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      >
        {/* ── Photo — Ken Burns slow zoom ── */}
        <motion.img
          src={scene.photo}
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          style={{ objectPosition: scene.objectPosition, filter: scene.cssFilter }}
          animate={prefersReduced ? {} : { scale: scene.zoomScale }}
          transition={{ duration: scene.zoomDuration, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
        />

        {/* ── Dark grade ── */}
        <div className="absolute inset-0" style={{ background: scene.darkGrade }} />

        {/* ── Colour grade (multiply feel via low-opacity tint) ── */}
        <div className="absolute inset-0" style={{ background: scene.colorGrade, mixBlendMode: "multiply" }} />

        {/* ── Neon screen glow ── */}
        <div className="absolute inset-0" style={{ background: scene.screenGlow, mixBlendMode: "screen", pointerEvents: "none" }} />

        {/* ── Grain ── */}
        <Grain opacity={scene.grainOpacity} />

        {/* ── Vignette ── */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.65) 100%)" }} />

        {/* ── Scene-specific atmospherics ── */}
        <SceneElements accent={scene.accent} />

        {/* ── Mood label — drifting bottom-left ── */}
        <motion.p
          className="absolute font-mono text-[10px] tracking-widest pointer-events-none select-none"
          style={{ left: "8%", bottom: "35%", color: scene.accent, opacity: 0.55 }}
          animate={{ opacity: [0.4, 0.65, 0.4], x: [0, 4, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          {scene.moodLabel}
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
}
