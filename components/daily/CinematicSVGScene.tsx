"use client";

import { motion, AnimatePresence, useReducedMotion, type TargetAndTransition } from "framer-motion";
import { useEffect, useState } from "react";
import type { RightNowBlock } from "@/lib/data";
import { SUBJECT } from "@/lib/data";
import { getSubjectTimeString } from "@/lib/utils";

const MONO = "'Space Mono', monospace";
const SANS = "'Space Grotesk', sans-serif";

// ─── Shared SVG defs ──────────────────────────────────────────────────────────
function Defs() {
  return (
    <defs>
      <filter id="blur-lg" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur stdDeviation="32" />
      </filter>
      <filter id="blur-md" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="18" />
      </filter>
      <filter id="blur-sm" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="8" />
      </filter>
      <linearGradient id="vig-b" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#000" stopOpacity="0"    />
        <stop offset="48%"  stopColor="#000" stopOpacity="0"    />
        <stop offset="100%" stopColor="#000" stopOpacity="0.88" />
      </linearGradient>
      <linearGradient id="vig-t" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stopColor="#000" stopOpacity="0.6" />
        <stop offset="25%" stopColor="#000" stopOpacity="0"   />
      </linearGradient>
      <radialGradient id="vig-r" cx="50%" cy="50%" r="65%">
        <stop offset="0%"   stopColor="#000" stopOpacity="0"    />
        <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
      </radialGradient>
    </defs>
  );
}

// ─── Dark backdrop photo ───────────────────────────────────────────────────────
// Photo is intentionally subdued — animations are the story
function Backdrop({ href, x=0, y=0, w=1200, h=900, dim=0.55 }: {
  href: string; x?: number; y?: number; w?: number; h?: number; dim?: number;
}) {
  return (
    <>
      <image href={href} x={x} y={y} width={w} height={h}
        preserveAspectRatio="xMidYMid slice" />
      {/* Dark suppress layer — makes photo a texture, not subject */}
      <rect width={1200} height={900} fill={`rgba(0,0,0,${dim})`} />
      <rect width={1200} height={900} fill="url(#vig-t)" />
      <rect width={1200} height={900} fill="url(#vig-b)" />
      <rect width={1200} height={900} fill="url(#vig-r)" />
    </>
  );
}

// ─── 01  MIDNIGHT ────────────────────────────────────────────────────────────
// HERO: soft phone glow + live timestamp + drifting particles
function MidnightSVG() {
  const [time, setTime] = useState("--:--:--");
  const pre = useReducedMotion();

  useEffect(() => {
    const up = () => setTime(getSubjectTimeString(SUBJECT.timezone));
    up();
    const id = setInterval(up, 1000);
    return () => clearInterval(id);
  }, []);

  const BLUE = "#3B82F6";
  const CYAN = "#60A5FA";

  return (
    <svg width="100%" height="100%" viewBox="0 0 1200 900"
      preserveAspectRatio="xMidYMid slice" fill="none">
      <Defs />
      <Backdrop href="/papiya_6.jpg" dim={0.6} />

      {/* ── Soft phone glow bloom — the only large element ── */}
      <motion.circle cx={400} cy={480} r={220} fill={BLUE} filter="url(#blur-lg)"
        animate={pre ? {} : { opacity: [0.14, 0.26, 0.14], scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "400px 480px" }}
      />

      {/* ── Single expanding ring — subtle ── */}
      <motion.circle cx={400} cy={480} r={60} stroke={BLUE} strokeWidth={1}
        fill="none" opacity={0}
        animate={{ r: [60, 260], opacity: [0.5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeOut" }}
      />

      {/* ── Simple phone silhouette — clean outline only ── */}
      <rect x={346} y={360} width={108} height={188} rx={18}
        stroke={BLUE} strokeWidth={1.5} fill="none" opacity={0.35} />
      {/* Screen glow — single pulse */}
      <motion.rect x={354} y={376} width={92} height={154} rx={12}
        fill={BLUE} opacity={0}
        animate={{ opacity: [0.06, 0.16, 0.06] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* ── Live timestamp — the real hero text ── */}
      <motion.text x={560} y={200} fill={CYAN} fontSize={72} fontFamily={MONO} fontWeight="700"
        animate={{ opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >{time}</motion.text>

      <text x={560} y={244} fill={BLUE} fontSize={13} fontFamily={MONO}
        letterSpacing={2} opacity={0.5}>
        43.1107° N  12.3908° E · PERUGIA
      </text>

      {/* ── Horizontal scan line — barely visible ── */}
      <motion.line x1={0} y1={0} x2={1200} y2={0}
        stroke={BLUE} strokeWidth={0.8} opacity={0.08}
        animate={{ y1: [150, 820, 150], y2: [150, 820, 150] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />

      {/* ── Subtle particles — right side only, not overwhelming ── */}
      {[760, 880, 980, 1080, 1150].map((cx, i) => (
        <motion.circle key={i} cx={cx} cy={880} r={1.5} fill={CYAN}
          animate={{ cy: [880, 80], opacity: [0.6, 0] }}
          transition={{ duration: 5 + i * 0.6, delay: i * 1.2, repeat: Infinity, ease: "easeOut" }}
        />
      ))}
    </svg>
  );
}

// ─── 02  SLEEPING ─────────────────────────────────────────────────────────────
// HERO: large crescent moon + prominent ZZZs + drifting stars
function SleepingSVG() {
  const pre = useReducedMotion();
  const PUR = "#8B5CF6";
  const LAV = "#C4B5FD";

  return (
    <svg width="100%" height="100%" viewBox="0 0 1200 900"
      preserveAspectRatio="xMidYMid slice" fill="none">
      <Defs />
      <Backdrop href="/papiya_3.jpg" dim={0.65} />

      {/* ── Hero: crescent moon ── */}
      {/* Outer glow */}
      <motion.circle cx={980} cy={180} r={130} fill={PUR} filter="url(#blur-lg)"
        animate={pre ? {} : { opacity: [0.2, 0.38, 0.2], scale: [1, 1.15, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "980px 180px" }}
      />
      {/* Moon body */}
      <motion.circle cx={980} cy={180} r={90} fill="#1E1040"
        animate={pre ? {} : { scale: [1, 1.02, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "980px 180px" }}
      />
      {/* Crescent — offset circle cuts the moon */}
      <motion.circle cx={1020} cy={158} r={74} fill="#0a0616"
        animate={pre ? {} : { scale: [1, 1.02, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "1020px 158px" }}
      />
      {/* Moon surface glow */}
      <motion.circle cx={968} cy={195} r={58} fill={PUR} opacity={0}
        filter="url(#blur-md)"
        animate={{ opacity: [0.12, 0.25, 0.12] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* ── Large ZZZs — the real hero ── */}
      {[
        { text: "Z",   x: 120,  startY: 620, size: 140, col: PUR,  delay: 0   },
        { text: "Z",   x: 460,  startY: 680, size: 100, col: LAV,  delay: 0.8 },
        { text: "z",   x: 760,  startY: 650, size: 72,  col: PUR,  delay: 1.6 },
        { text: "ZZZ", x: 280,  startY: 720, size: 44,  col: LAV,  delay: 2.2 },
        { text: "z",   x: 900,  startY: 700, size: 36,  col: "#7C3AED", delay: 0.4 },
      ].map((z, i) => (
        <motion.text key={i} x={z.x} fill={z.col} fontSize={z.size}
          fontFamily={SANS} fontWeight="700" opacity={0}
          animate={{ y: [z.startY, z.startY - 500], opacity: [0, 0.9, 0] }}
          transition={{ duration: 3.5 + i * 0.5, delay: z.delay, repeat: Infinity, ease: "easeOut" }}
        >{z.text}</motion.text>
      ))}

      {/* ── Twinkling stars ── */}
      {[
        [180, 120], [340, 80], [540, 140], [720, 95], [860, 130],
        [1080, 90], [1140, 200], [80, 250], [660, 60], [1000, 320],
      ].map(([sx, sy], i) => (
        <motion.circle key={i} cx={sx} cy={sy} r={2 + (i % 3)}
          fill={LAV}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
          transition={{ duration: 2 + (i % 4) * 0.7, delay: i * 0.3, repeat: Infinity }}
          style={{ transformOrigin: `${sx}px ${sy}px` }}
        />
      ))}

      {/* ── Soft ambient bloom ── */}
      <motion.ellipse cx={600} cy={500} rx={300} ry={180} fill={PUR}
        filter="url(#blur-lg)" opacity={0}
        animate={{ opacity: [0.05, 0.12, 0.05] }}
        transition={{ duration: 5.5, repeat: Infinity }}
      />

      {/* ── Breathing pulse at bottom — subtle ── */}
      <motion.ellipse cx={600} cy={820} rx={400} ry={60} fill={PUR}
        filter="url(#blur-md)" opacity={0}
        animate={{ opacity: [0.06, 0.16, 0.06], ry: [60, 80, 60] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

// ─── 03  HUNGER / CHAOS ───────────────────────────────────────────────────────
// HERO: dramatic hunger meter + food icons + green neon chaos
function HungerSVG() {
  const pre = useReducedMotion();
  const GRN = "#84CC16";
  const LIM = "#A3E635";

  return (
    <svg width="100%" height="100%" viewBox="0 0 1200 900"
      preserveAspectRatio="xMidYMid slice" fill="none">
      <Defs />
      <Backdrop href="/papiya_2.jpg" dim={0.5} />

      {/* ── Green ambient neon from bar lights ── */}
      <motion.ellipse cx={600} cy={240} rx={400} ry={200} fill="#22C55E"
        filter="url(#blur-lg)" opacity={0}
        animate={pre ? {} : { opacity: [0.1, 0.22, 0.1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* ── Hero: large vertical hunger meter ── */}
      <text x={52} y={180} fill={GRN} fontSize={11} fontFamily={MONO} letterSpacing={3}>
        HUNGER LEVEL
      </text>
      {/* Container */}
      <rect x={60} y={200} width={72} height={580} rx={36}
        stroke={GRN} strokeWidth={2} fill="#00000080" />
      {/* Fill — animates from empty to 87% */}
      <motion.rect x={68} width={56} rx={28} fill={GRN}
        initial={{ height: 0, y: 772 }}
        animate={{ height: 505, y: 267 }}
        transition={{ duration: 2.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      />
      {/* Glow on meter */}
      <motion.rect x={68} width={56} rx={28} fill={GRN} filter="url(#blur-sm)"
        initial={{ height: 0, y: 772 }}
        animate={{ height: 505, y: 267 }}
        transition={{ duration: 2.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        opacity={0.5}
      />
      {/* Percentage */}
      <motion.text x={50} y={822} fill={LIM} fontSize={26} fontFamily={MONO} fontWeight="700"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >87%</motion.text>

      {/* ── CRITICAL label flicker ── */}
      <motion.text x={160} y={240} fill={LIM} fontSize={36} fontFamily={MONO} fontWeight="700"
        animate={pre ? {} : { opacity: [1, 0.15, 1, 0.6, 1] }}
        transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 3 }}
      >CRITICAL</motion.text>

      {/* ── Food icons — large, prominent, bouncing from all angles ── */}
      {[
        { f: "🍕", x: 240, baseY: 860, size: 54, delay: 0   },
        { f: "🍫", x: 440, baseY: 900, size: 48, delay: 0.6 },
        { f: "🧃", x: 620, baseY: 880, size: 52, delay: 1.2 },
        { f: "🥥", x: 800, baseY: 920, size: 46, delay: 0.3 },
        { f: "🍷", x: 980, baseY: 870, size: 50, delay: 1.8 },
        { f: "🍾", x: 340, baseY: 940, size: 42, delay: 2.4 },
      ].map((e, i) => (
        <motion.text key={i} x={e.x} fontSize={e.size} fontFamily="serif"
          animate={{ y: [e.baseY, e.baseY - 650], opacity: [0.95, 0], rotate: [0, i % 2 === 0 ? 20 : -20, 0] }}
          transition={{ duration: 3.5 + i * 0.3, delay: e.delay, repeat: Infinity, ease: "easeOut" }}
        >{e.f}</motion.text>
      ))}

      {/* ── Neon flicker overlay ── */}
      <motion.rect width={1200} height={900} fill="#84CC1609"
        animate={pre ? {} : { opacity: [1, 0.05, 1, 0.4, 1] }}
        transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 5 }}
      />
    </svg>
  );
}

// ─── 04  SOFT MEMORY ─────────────────────────────────────────────────────────
// HERO: continuous hearts + warm bokeh storm + emotional drifting text
function SoftMemorySVG() {
  const pre = useReducedMotion();
  const PNK = "#F9A8D4";
  const ROSE = "#FB7185";
  const GLD = "#FCD34D";

  return (
    <svg width="100%" height="100%" viewBox="0 0 1200 900"
      preserveAspectRatio="xMidYMid slice" fill="none">
      <Defs />
      <Backdrop href="/papiya_5.jpg" dim={0.52} />

      {/* ── Warm ambient glow — restaurant light ── */}
      <motion.ellipse cx={560} cy={380} rx={320} ry={250} fill="#F59E0B"
        filter="url(#blur-lg)" opacity={0}
        animate={{ opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      {/* ── Hero: continuous heart rain ── */}
      {[
        { x: 100,  size: 64, delay: 0,   col: PNK,  dur: 6   },
        { x: 260,  size: 44, delay: 1.2, col: ROSE, dur: 5   },
        { x: 420,  size: 72, delay: 0.4, col: PNK,  dur: 7   },
        { x: 580,  size: 36, delay: 2.1, col: GLD,  dur: 5.5 },
        { x: 720,  size: 58, delay: 0.8, col: ROSE, dur: 6.5 },
        { x: 860,  size: 48, delay: 1.6, col: PNK,  dur: 5.8 },
        { x: 1000, size: 40, delay: 3.0, col: GLD,  dur: 6.2 },
        { x: 1120, size: 56, delay: 0.2, col: ROSE, dur: 7.2 },
      ].map((h, i) => (
        <motion.text key={i} x={h.x} fill={h.col} fontSize={h.size} fontFamily="serif"
          animate={{ y: [920, -40], opacity: [0, 0.85, 0.85, 0] }}
          transition={{ duration: h.dur, delay: h.delay, repeat: Infinity, ease: "easeOut" }}
        >♡</motion.text>
      ))}

      {/* ── Warm bokeh orbs ── */}
      {[
        [180, 320, 40], [520, 240, 28], [860, 350, 36],
        [320, 580, 22], [760, 480, 32], [1060, 220, 26],
      ].map(([cx, cy, r], i) => (
        <motion.circle key={i} cx={cx} cy={cy} r={r}
          fill={i % 2 === 0 ? GLD : PNK} filter="url(#blur-md)"
          animate={{ opacity: [0, 0.22, 0], scale: [0.6, 1.8, 0.6] }}
          transition={{ duration: 6 + i * 1.2, delay: i * 1.4, repeat: Infinity }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
      ))}

      {/* ── Floating handwritten fragments ── */}
      {[
        { text: "saved.",           x: 680, startY: 680, fontSize: 26, delay: 0   },
        { text: "somewhere warm.",  x: 640, startY: 720, fontSize: 20, delay: 2.5 },
        { text: "still here.",      x: 700, startY: 700, fontSize: 18, delay: 5   },
        { text: "♡",               x: 920, startY: 600, fontSize: 32, delay: 1   },
      ].map((t, i) => (
        <motion.text key={i} x={t.x} fill={PNK} fontSize={t.fontSize}
          fontFamily="Georgia, serif" fontStyle="italic"
          animate={{ y: [t.startY, t.startY - 160], opacity: [0, 0.55, 0] }}
          transition={{ duration: 6, delay: t.delay, repeat: Infinity, ease: "easeOut" }}
        >{t.text}</motion.text>
      ))}

      {/* ── Rotating stars ── */}
      {[[860, 160], [1060, 340]].map(([sx, sy], i) => (
        <motion.text key={i} x={sx} y={sy} fill={i === 0 ? GLD : PNK}
          fontSize={i === 0 ? 52 : 36} fontFamily="serif"
          animate={{ rotate: [0, 360], opacity: [0.25, 0.65, 0.25] }}
          transition={{ duration: 12 + i * 4, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: `${sx + 20}px ${sy - 18}px` }}
        >✦</motion.text>
      ))}
    </svg>
  );
}

// ─── 05  MAIN CHARACTER ───────────────────────────────────────────────────────
// HERO: animated city grid + chapter reveal + confident ambient glow
function MainCharSVG() {
  const pre = useReducedMotion();
  const BLU = "#60A5FA";
  const IND = "#818CF8";

  return (
    <svg width="100%" height="100%" viewBox="0 0 1200 900"
      preserveAspectRatio="xMidYMid slice" fill="none">
      <Defs />
      <Backdrop href="/papiya_4.jpg" dim={0.48} />

      {/* ── Cool blue rim backlight ── */}
      <motion.ellipse cx={600} cy={420} rx={280} ry={340} fill={BLU}
        filter="url(#blur-lg)" opacity={0}
        animate={pre ? {} : { opacity: [0.07, 0.16, 0.07] }}
        transition={{ duration: 7, repeat: Infinity }}
      />

      {/* ── Hero: animated grid lines drawing in ── */}
      {/* Horizontal lines */}
      {[180, 300, 420, 540, 660].map((y, i) => (
        <motion.line key={`h${i}`} x1={0} y1={y} x2={0} y2={y}
          stroke={BLU} strokeWidth={0.6} opacity={0.15}
          animate={{ x2: [0, 1200] }}
          transition={{ duration: 2.5, delay: i * 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
      {/* Vertical lines */}
      {[200, 400, 600, 800, 1000].map((x, i) => (
        <motion.line key={`v${i}`} x1={x} y1={0} x2={x} y2={0}
          stroke={BLU} strokeWidth={0.6} opacity={0.12}
          animate={{ y2: [0, 900] }}
          transition={{ duration: 2, delay: 1 + i * 0.25, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}

      {/* ── Hero text: chapter reveal ── */}
      <motion.text x={80} y={680} fill={BLU} fontSize={72} fontFamily={SANS} fontWeight="700"
        letterSpacing={-2}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: [0, 1], x: [-20, 0] }}
        transition={{ duration: 1, delay: 0.5 }}
      >chapter</motion.text>
      <motion.text x={80} y={762} fill={IND} fontSize={72} fontFamily={SANS} fontWeight="700"
        letterSpacing={-2}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1] }}
        transition={{ duration: 1, delay: 0.9 }}
      >27.</motion.text>

      {/* Animated underline */}
      <motion.line x1={80} y1={774} x2={80} y2={774}
        stroke={BLU} strokeWidth={3}
        animate={{ x2: [80, 460] }}
        transition={{ duration: 1.2, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Loading bar */}
      <rect x={80} y={800} width={360} height={2} rx={1} fill="#1E3A5F" />
      <motion.rect x={80} y={800} width={0} height={2} rx={1} fill={BLU}
        animate={{ width: 310 }}
        transition={{ duration: 3, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.text x={80} y={824} fill={BLU} fontSize={13} fontFamily={MONO}
        animate={{ opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, delay: 2 }}
      >loading next chapter...</motion.text>

      {/* ── Corner stars / points ── */}
      {[[1060, 160], [140, 200], [1100, 580]].map(([sx, sy], i) => (
        <motion.text key={i} x={sx} y={sy} fill={i === 1 ? IND : BLU}
          fontSize={i === 0 ? 28 : 20} fontFamily="serif"
          animate={{ opacity: [0.2, 0.7, 0.2], rotate: [0, 180, 360] }}
          transition={{ duration: 8 + i * 3, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: `${sx + 10}px ${sy - 10}px` }}
        >✦</motion.text>
      ))}

      {/* ── Rising particles ── */}
      {[240, 560, 880, 1080].map((cx, i) => (
        <motion.circle key={i} cx={cx} cy={900} r={2} fill={BLU}
          animate={{ cy: [900, 60], opacity: [0.6, 0] }}
          transition={{ duration: 8 + i * 1.2, delay: i * 2, repeat: Infinity, ease: "easeOut" }}
        />
      ))}

      {/* ── Coordinate text — top corner ── */}
      <text x={840} y={100} fill={BLU} fontSize={13} fontFamily={MONO} opacity={0.4}
        letterSpacing={1}>43.1107° N · PERUGIA</text>
    </svg>
  );
}

// ─── Scene map ────────────────────────────────────────────────────────────────
const SCENE_MAP: Record<RightNowBlock["icon"], React.FC> = {
  night:   MidnightSVG,
  moon:    MidnightSVG,
  zzz:     SleepingSVG,
  wave:    SleepingSVG,
  nap:     SleepingSVG,
  fork:    HungerSVG,
  chicken: HungerSVG,
  alarm:   HungerSVG,
  sparkle: SoftMemorySVG,
  wake:    MainCharSVG,
};

export default function CinematicSVGScene({ icon }: { icon: RightNowBlock["icon"] }) {
  const SceneComp = SCENE_MAP[icon];
  return (
    <AnimatePresence mode="wait">
      <motion.div key={icon} className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      >
        <SceneComp />
      </motion.div>
    </AnimatePresence>
  );
}
