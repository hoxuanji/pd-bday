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
      <filter id="blur-xl" x="-120%" y="-120%" width="340%" height="340%">
        <feGaussianBlur stdDeviation="40" />
      </filter>
      <filter id="blur-lg" x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur stdDeviation="24" />
      </filter>
      <filter id="blur-md" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="14" />
      </filter>
      <filter id="blur-sm" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="6" />
      </filter>
      <linearGradient id="vig-b" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#000" stopOpacity="0"    />
        <stop offset="50%"  stopColor="#000" stopOpacity="0"    />
        <stop offset="100%" stopColor="#000" stopOpacity="0.9"  />
      </linearGradient>
      <linearGradient id="vig-t" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stopColor="#000" stopOpacity="0.65" />
        <stop offset="28%" stopColor="#000" stopOpacity="0"    />
      </linearGradient>
      <radialGradient id="vig-r" cx="50%" cy="50%" r="65%">
        <stop offset="0%"   stopColor="#000" stopOpacity="0"    />
        <stop offset="100%" stopColor="#000" stopOpacity="0.6"  />
      </radialGradient>
    </defs>
  );
}

function Backdrop({ href, dim = 0.55 }: { href: string; dim?: number }) {
  return (
    <>
      <image href={href} x={0} y={0} width={1200} height={900}
        preserveAspectRatio="xMidYMid slice" />
      <rect width={1200} height={900} fill={`rgba(0,0,0,${dim})`} />
      <rect width={1200} height={900} fill="url(#vig-t)" />
      <rect width={1200} height={900} fill="url(#vig-b)" />
      <rect width={1200} height={900} fill="url(#vig-r)" />
    </>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
// Sequenced animation: item appears, holds, fades — loops on a shared cycle
function seqAnim(appearAt: number, holdUntil: number, cycle: number) {
  const t0 = appearAt / cycle;
  const t1 = (appearAt + 0.3) / cycle;
  const t2 = holdUntil / cycle;
  const t3 = (holdUntil + 0.4) / cycle;
  return {
    animate: { opacity: [0, 1, 1, 0] as number[] },
    transition: { times: [t0, t1, t2, t3], duration: cycle, repeat: Infinity, ease: "easeOut" },
  };
}

// ─── 01  MIDNIGHT ─────────────────────────────────────────────────────────────
// No phone frame — floating iMessage-style bubbles suspended in the scene
function MidnightSVG() {
  const [time, setTime] = useState("--:--:--");
  const pre = useReducedMotion();
  const BLUE = "#3B82F6"; const CYAN = "#60A5FA"; const DARK = "#1a2d4a";

  useEffect(() => {
    const up = () => setTime(getSubjectTimeString(SUBJECT.timezone));
    up();
    const id = setInterval(up, 1000);
    return () => clearInterval(id);
  }, []);

  const CYCLE = 11;

  return (
    <svg width="100%" height="100%" viewBox="0 0 1200 900"
      preserveAspectRatio="xMidYMid slice" fill="none">
      <Defs />
      <Backdrop href="/papiya_6.jpg" dim={0.58} />

      {/* ── Ambient blue bloom ── */}
      <motion.circle cx={320} cy={460} r={300} fill={BLUE} filter="url(#blur-xl)"
        animate={pre ? {} : { opacity: [0.1, 0.2, 0.1], scale: [1, 1.12, 1] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "320px 460px" }}
      />

      {/* ── Floating chat bubbles — no phone frame, just messages in space ── */}

      {/* Outgoing 1: "still awake? 🌙" — right-aligned */}
      <motion.g {...seqAnim(0.5, 9, CYCLE)}>
        <rect x={560} y={340} width={296} height={52} rx={26} fill={BLUE} />
        <text x={582} y={373} fill="white" fontSize={22} fontFamily={SANS} fontWeight="500">
          still awake? 🌙
        </text>
      </motion.g>

      {/* Incoming: "always 😭" — left-aligned */}
      <motion.g {...seqAnim(2.5, 9, CYCLE)}>
        <rect x={144} y={416} width={200} height={52} rx={26} fill={DARK} />
        <text x={168} y={449} fill={CYAN} fontSize={22} fontFamily={SANS} fontWeight="500">
          always 😭
        </text>
      </motion.g>

      {/* Typing indicator — 3 bouncing dots, left side */}
      <motion.g {...seqAnim(3, 4.5, CYCLE)}>
        <rect x={144} y={484} width={90} height={48} rx={24} fill={DARK} />
        {[172, 189, 206].map((x, i) => (
          <motion.circle key={i} cx={x} cy={508} r={6} fill={CYAN}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.5, delay: i * 0.17, repeat: Infinity }}
          />
        ))}
      </motion.g>

      {/* Outgoing 2: "me too honestly" — right-aligned */}
      <motion.g {...seqAnim(4.8, 9, CYCLE)}>
        <rect x={506} y={484} width={350} height={52} rx={26} fill={BLUE} />
        <text x={528} y={517} fill="white" fontSize={22} fontFamily={SANS} fontWeight="500">
          me too honestly
        </text>
      </motion.g>

      {/* Seen status */}
      <motion.g {...seqAnim(6, 9, CYCLE)}>
        <text x={720} y={552} fill={CYAN} fontSize={14} fontFamily={MONO} opacity={0.6}>
          seen {time.slice(0, 5)} ✓✓
        </text>
      </motion.g>

      {/* ── Large live timestamp ── */}
      <motion.text x={144} y={240} fill={CYAN} fontSize={96} fontFamily={MONO} fontWeight="700"
        animate={{ opacity: [0.72, 1, 0.72] }}
        transition={{ duration: 3, repeat: Infinity }}
      >{time}</motion.text>
      <text x={144} y={290} fill={BLUE} fontSize={15} fontFamily={MONO}
        letterSpacing={2} opacity={0.5}>
        43.1107° N  12.3908° E · PERUGIA
      </text>

      {/* ── Neon right glow ── */}
      <motion.ellipse cx={980} cy={460} rx={200} ry={260} fill={BLUE}
        filter="url(#blur-lg)"
        animate={{ opacity: [0.05, 0.12, 0.05] }}
        transition={{ duration: 6, repeat: Infinity, delay: 1 }}
      />

      {/* ── Scan line ── */}
      <motion.line x1={0} y1={0} x2={1200} y2={0}
        stroke={BLUE} strokeWidth={0.8} opacity={0.07}
        animate={{ y1: [140, 860, 140], y2: [140, 860, 140] }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      />

      {/* ── Particles ── */}
      {[820, 920, 1020, 1110, 720].map((cx, i) => (
        <motion.circle key={i} cx={cx} cy={880} r={1.8} fill={CYAN}
          animate={{ cy: [880, 80], opacity: [0.55, 0] }}
          transition={{ duration: 6 + i * 0.7, delay: i * 1.3, repeat: Infinity, ease: "easeOut" }}
        />
      ))}
    </svg>
  );
}

// ─── 02  SLEEPING ─────────────────────────────────────────────────────────────
// Story: crescent moon + constellation stars drawing + prominent ZZZs
function SleepingSVG() {
  const pre = useReducedMotion();
  const PUR = "#8B5CF6"; const LAV = "#C4B5FD"; const MOON = "#7C3AED";

  return (
    <svg width="100%" height="100%" viewBox="0 0 1200 900"
      preserveAspectRatio="xMidYMid slice" fill="none">
      <Defs />
      <Backdrop href="/papiya_3.jpg" dim={0.62} />

      {/* ── Moon outer halo ── */}
      <motion.circle cx={1020} cy={160} r={160} fill={PUR} filter="url(#blur-xl)"
        animate={pre ? {} : { opacity: [0.18, 0.35, 0.18], scale: [1, 1.12, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "1020px 160px" }}
      />
      {/* Moon body */}
      <circle cx={1020} cy={160} r={96} fill="#1a0e38" />
      {/* Crescent cutout */}
      <circle cx={1062} cy={136} r={78} fill="#09060f" />
      {/* Moon inner glow */}
      <motion.circle cx={1005} cy={175} r={55} fill={PUR} filter="url(#blur-md)"
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* ── Constellation stars — draw in, then twinkle ── */}
      {[
        [180, 110, 3], [320, 75, 2.5], [240, 200, 2], [500, 88, 3.5],
        [640, 130, 2], [720, 65, 4], [840, 100, 2.5], [160, 280, 2],
        [440, 50, 3], [560, 200, 2], [1100, 280, 3], [940, 220, 2],
      ].map(([sx, sy, r], i) => (
        <motion.circle key={i} cx={sx} cy={sy} r={r}
          fill={LAV}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0.9, 0.4, 0.9, 0.3], scale: [0, 1.5, 1, 1.3, 1] }}
          transition={{
            duration: 2 + (i % 5) * 0.5,
            delay: i * 0.25,
            repeat: Infinity,
            repeatDelay: 3 + i * 0.3,
          }}
          style={{ transformOrigin: `${sx}px ${sy}px` }}
        />
      ))}

      {/* ── ZZZs — big, layered, drifting in different directions ── */}
      {[
        { text: "Z",   x: 80,   startY: 640, size: 160, col: PUR,  dur: 4.5, angle: -5  },
        { text: "Z",   x: 360,  startY: 700, size: 110, col: LAV,  dur: 5.5, angle:  8  },
        { text: "z",   x: 620,  startY: 660, size: 80,  col: PUR,  dur: 4.0, angle: -3  },
        { text: "ZZZ", x: 200,  startY: 740, size: 50,  col: LAV,  dur: 6.0, angle:  5  },
        { text: "z",   x: 820,  startY: 680, size: 44,  col: MOON, dur: 5.0, angle: -8  },
        { text: "Z",   x: 500,  startY: 760, size: 70,  col: LAV,  dur: 5.5, angle:  4  },
      ].map((z, i) => (
        <motion.text key={i} x={z.x}
          fill={z.col} fontSize={z.size} fontFamily={SANS} fontWeight="700"
          style={{ rotate: z.angle }}
          animate={{ y: [z.startY, z.startY - 620], opacity: [0, 0.85, 0.7, 0] }}
          transition={{ duration: z.dur, delay: i * 0.7, repeat: Infinity, ease: "easeOut" }}
        >{z.text}</motion.text>
      ))}

      {/* ── Soft breathing ellipse ── */}
      <motion.ellipse cx={600} cy={820} rx={500} ry={70} fill={PUR}
        filter="url(#blur-lg)"
        animate={{ opacity: [0.05, 0.15, 0.05], ry: [70, 95, 70] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

// ─── 03  HUNGER / CHAOS ───────────────────────────────────────────────────────
// Story: dramatic neon meter + food storm + warning system
function HungerSVG() {
  const pre = useReducedMotion();
  const GRN = "#84CC16"; const LIM = "#A3E635"; const NEN = "#BEF264";

  return (
    <svg width="100%" height="100%" viewBox="0 0 1200 900"
      preserveAspectRatio="xMidYMid slice" fill="none">
      <Defs />
      <Backdrop href="/papiya_2.jpg" dim={0.48} />

      {/* ── Green neon ambient — matches real bar lighting ── */}
      <motion.ellipse cx={600} cy={200} rx={500} ry={220} fill="#22C55E"
        filter="url(#blur-xl)"
        animate={pre ? {} : { opacity: [0.08, 0.18, 0.08] }}
        transition={{ duration: 3.5, repeat: Infinity }}
      />

      {/* ── Large vertical hunger meter ── */}
      <text x={60} y={158} fill={GRN} fontSize={13} fontFamily={MONO} letterSpacing={3}>HUNGER LEVEL</text>
      {/* Outer container */}
      <rect x={68} y={174} width={80} height={560} rx={40}
        stroke={GRN} strokeWidth={2} fill="#00000060" />
      {/* Animated fill */}
      <motion.rect x={76} rx={34} fill={GRN}
        initial={{ height: 0, y: 726 }}
        animate={{ height: 488, y: 238 }}
        transition={{ duration: 2.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      />
      {/* Glow on fill */}
      <motion.rect x={76} rx={34} fill={GRN} filter="url(#blur-sm)" opacity={0.6}
        initial={{ height: 0, y: 726 }}
        animate={{ height: 488, y: 238 }}
        transition={{ duration: 2.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      />
      {/* Tick marks */}
      {[25, 50, 75].map((pct, i) => (
        <g key={i}>
          <line x1={148} y1={726 - pct * 4.88} x2={168} y2={726 - pct * 4.88}
            stroke={GRN} strokeWidth={1} opacity={0.4} />
          <text x={172} y={730 - pct * 4.88} fill={GRN} fontSize={10} fontFamily={MONO} opacity={0.4}>
            {pct}%
          </text>
        </g>
      ))}
      <text x={68} y={760} fill={NEN} fontSize={32} fontFamily={MONO} fontWeight="700">87%</text>

      {/* ── CRITICAL warning flicker ── */}
      <motion.text x={190} y={228} fill={LIM} fontSize={44} fontFamily={MONO} fontWeight="700"
        animate={pre ? {} : { opacity: [1, 0.3, 1, 0.7, 1] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 3.5 }}
      >⚠ CRITICAL</motion.text>

      {/* ── Food icons — large, varied trajectories ── */}
      {[
        { f: "🍕", x: 230,  baseY: 880, size: 58, dur: 3.8, dx: 0,    delay: 0   },
        { f: "🍫", x: 430,  baseY: 920, size: 50, dur: 4.5, dx: -20,  delay: 0.6 },
        { f: "🧃", x: 610,  baseY: 900, size: 54, dur: 4.0, dx: 15,   delay: 1.3 },
        { f: "🥥", x: 800,  baseY: 940, size: 48, dur: 5.0, dx: -10,  delay: 0.3 },
        { f: "🍷", x: 980,  baseY: 880, size: 52, dur: 3.5, dx: 25,   delay: 2.1 },
        { f: "🍾", x: 340,  baseY: 960, size: 44, dur: 4.8, dx: -30,  delay: 1.8 },
        { f: "🍰", x: 700,  baseY: 950, size: 46, dur: 4.2, dx: 10,   delay: 2.8 },
      ].map((e, i) => (
        <motion.text key={i} x={e.x} fontSize={e.size} fontFamily="serif"
          animate={{
            y: [e.baseY, e.baseY - 750],
            x: [e.x, e.x + e.dx],
            opacity: [0, 1, 0.9, 0],
            rotate: [0, i % 2 === 0 ? 15 : -15, 0],
          }}
          transition={{ duration: e.dur, delay: e.delay, repeat: Infinity, ease: "easeOut" }}
        >{e.f}</motion.text>
      ))}

      {/* ── Neon flicker overlay ── */}
      <motion.rect width={1200} height={900} fill="#84CC160A"
        animate={pre ? {} : { opacity: [1, 0.4, 1, 0.7, 1] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 5 }}
      />

      {/* ── Horizontal energy bar ── */}
      <text x={190} y={820} fill={GRN} fontSize={13} fontFamily={MONO} opacity={0.6}>
        STATUS: CRITICALLY LOW FUEL DETECTED
      </text>
    </svg>
  );
}

// ─── 04  SOFT MEMORY ─────────────────────────────────────────────────────────
// Story: heart rain + warm bokeh storm + emotional text fragments
function SoftMemorySVG() {
  const pre = useReducedMotion();
  const PNK = "#F9A8D4"; const ROSE = "#FB7185"; const GLD = "#FCD34D"; const MAG = "#E879F9";

  return (
    <svg width="100%" height="100%" viewBox="0 0 1200 900"
      preserveAspectRatio="xMidYMid slice" fill="none">
      <Defs />
      <Backdrop href="/papiya_5.jpg" dim={0.5} />

      {/* ── Warm amber glow — restaurant ambience ── */}
      <motion.ellipse cx={520} cy={360} rx={360} ry={280} fill="#F59E0B"
        filter="url(#blur-xl)"
        animate={{ opacity: [0.08, 0.18, 0.08] }}
        transition={{ duration: 7, repeat: Infinity }}
      />

      {/* ── Continuous heart rain — many sizes ── */}
      {[
        { x: 80,   size: 72, col: PNK,  dur: 6.0, delay: 0,   angle: -8  },
        { x: 220,  size: 50, col: ROSE, dur: 5.0, delay: 1.2, angle:  5  },
        { x: 380,  size: 88, col: PNK,  dur: 7.0, delay: 0.4, angle: -3  },
        { x: 520,  size: 40, col: GLD,  dur: 5.5, delay: 2.2, angle:  9  },
        { x: 660,  size: 64, col: ROSE, dur: 6.5, delay: 0.9, angle: -6  },
        { x: 800,  size: 55, col: MAG,  dur: 5.8, delay: 1.7, angle:  4  },
        { x: 940,  size: 44, col: PNK,  dur: 6.2, delay: 3.1, angle: -11 },
        { x: 1080, size: 70, col: GLD,  dur: 7.5, delay: 0.2, angle:  7  },
        { x: 160,  size: 36, col: MAG,  dur: 5.2, delay: 2.8, angle: -4  },
        { x: 720,  size: 48, col: ROSE, dur: 6.8, delay: 1.5, angle:  8  },
      ].map((h, i) => (
        <motion.text key={i} x={h.x} fill={h.col} fontSize={h.size}
          fontFamily="serif" style={{ rotate: h.angle }}
          animate={{ y: [940, -60], opacity: [0, 0.9, 0.85, 0] }}
          transition={{ duration: h.dur, delay: h.delay, repeat: Infinity, ease: "easeOut" }}
        >♡</motion.text>
      ))}

      {/* ── Warm bokeh orbs — layered ── */}
      {[
        [200, 300, 48, GLD ], [560, 240, 36, PNK ], [880, 380, 44, ROSE],
        [340, 560, 28, MAG ], [760, 460, 38, GLD ], [1060, 220, 32, PNK],
        [100, 480, 20, ROSE], [480, 680, 24, GLD ],
      ].map(([cx, cy, r, col], i) => (
        <motion.circle key={i} cx={cx} cy={cy} r={r}
          fill={col as string} filter="url(#blur-md)"
          animate={{ opacity: [0, 0.25, 0], scale: [0.5, 2, 0.5] }}
          transition={{ duration: 7 + i * 1.2, delay: i * 1.3, repeat: Infinity }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
      ))}

      {/* ── Emotional text fragments ── */}
      {[
        { text: "saved.",          x: 700, startY: 700, fontSize: 28, delay: 0   },
        { text: "somewhere warm.", x: 660, startY: 740, fontSize: 22, delay: 2.5 },
        { text: "still here.",     x: 720, startY: 720, fontSize: 20, delay: 5   },
        { text: "don't forget.",   x: 680, startY: 760, fontSize: 18, delay: 7.5 },
      ].map((t, i) => (
        <motion.text key={i} x={t.x} fill={PNK} fontSize={t.fontSize}
          fontFamily="Georgia, serif" fontStyle="italic"
          animate={{ y: [t.startY, t.startY - 180], opacity: [0, 0.65, 0] }}
          transition={{ duration: 7, delay: t.delay, repeat: Infinity, ease: "easeOut" }}
        >{t.text}</motion.text>
      ))}

      {/* ── Rotating decorative stars ── */}
      {[[900, 140, 56, GLD], [1080, 380, 38, PNK]].map(([sx, sy, sz, col], i) => (
        <motion.text key={i} x={sx} y={sy} fill={col as string}
          fontSize={sz} fontFamily="serif"
          animate={{ rotate: [0, 360], opacity: [0.25, 0.65, 0.25] }}
          transition={{ duration: 14 + i * 5, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: `${(sx as number) + 20}px ${(sy as number) - 16}px` }}
        >✦</motion.text>
      ))}
    </svg>
  );
}

// ─── 05  MAIN CHARACTER ───────────────────────────────────────────────────────
// Story: grid draws in → chapter reveal → loading bar → ambient glow
function MainCharSVG() {
  const pre = useReducedMotion();
  const BLU = "#60A5FA"; const IND = "#818CF8"; const SLT = "#93C5FD";

  return (
    <svg width="100%" height="100%" viewBox="0 0 1200 900"
      preserveAspectRatio="xMidYMid slice" fill="none">
      <Defs />
      <Backdrop href="/papiya_4.jpg" dim={0.46} />

      {/* ── Cool backlight bloom behind subject ── */}
      <motion.ellipse cx={580} cy={400} rx={300} ry={360} fill={BLU}
        filter="url(#blur-xl)"
        animate={pre ? {} : { opacity: [0.06, 0.14, 0.06] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* ── Grid lines draw in ── */}
      {[200, 380, 560, 740, 920].map((y, i) => (
        <motion.line key={`h${i}`} x1={0} y1={y} x2={0} y2={y}
          stroke={BLU} strokeWidth={0.5} opacity={0.14}
          animate={{ x2: [0, 1200] }}
          transition={{ duration: 2, delay: i * 0.25, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
      {[180, 400, 620, 840, 1060].map((x, i) => (
        <motion.line key={`v${i}`} x1={x} y1={0} x2={x} y2={0}
          stroke={BLU} strokeWidth={0.5} opacity={0.1}
          animate={{ y2: [0, 900] }}
          transition={{ duration: 1.8, delay: 0.8 + i * 0.2, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}

      {/* ── Chapter reveal ── */}
      <motion.text x={80} y={672} fill={SLT} fontSize={78} fontFamily={SANS} fontWeight="700"
        letterSpacing={-2}
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.6 }}
      >chapter</motion.text>

      <motion.text x={80} y={766} fill={IND} fontSize={78} fontFamily={SANS} fontWeight="700"
        letterSpacing={-2}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 1.1 }}
      >27.</motion.text>

      {/* Animated underline */}
      <motion.line x1={80} y1={782} x2={80} y2={782}
        stroke={BLU} strokeWidth={3}
        animate={{ x2: [80, 470] }}
        transition={{ duration: 1.2, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Loading bar track */}
      <rect x={80} y={808} width={380} height={2} rx={1} fill="#1a2a4a" />
      <motion.rect x={80} y={808} width={0} height={2} rx={1} fill={BLU}
        animate={{ width: [0, 320] }}
        transition={{ duration: 3.5, delay: 2, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.text x={80} y={832} fill={BLU} fontSize={13} fontFamily={MONO}
        animate={{ opacity: [0, 1] }} transition={{ delay: 2.2, duration: 0.5 }}
      >loading next chapter...</motion.text>

      {/* ── Info card ── */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}>
        <rect x={900} y={200} width={228} height={112} rx={16}
          fill="#0c1525DD" stroke={BLU} strokeWidth={1} />
        <text x={926} y={248} fill={SLT} fontSize={16} fontFamily={MONO}>life lately</text>
        <text x={926} y={284} fill="white" fontSize={24} fontFamily={SANS} fontWeight="600">
          Tumpa Mix
        </text>
      </motion.g>

      {/* ── Floating stars ── */}
      {[[1040, 148, 32, IND], [160, 195, 22, BLU], [1110, 580, 26, SLT]].map(([sx, sy, sz, col], i) => (
        <motion.text key={i} x={sx} y={sy} fill={col as string}
          fontSize={sz} fontFamily="serif"
          animate={{ rotate: [0, 360], opacity: [0.2, 0.65, 0.2] }}
          transition={{ duration: 10 + i * 4, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: `${(sx as number) + 12}px ${(sy as number) - 10}px` }}
        >✦</motion.text>
      ))}

      {/* ── Rising particles ── */}
      {[220, 580, 920, 1060].map((cx, i) => (
        <motion.circle key={i} cx={cx} cy={900} r={2} fill={BLU}
          animate={{ cy: [900, 60], opacity: [0.6, 0] }}
          transition={{ duration: 9 + i, delay: i * 2.2, repeat: Infinity, ease: "easeOut" }}
        />
      ))}

      {/* ── Perugia coordinates ── */}
      <text x={900} y={844} fill={BLU} fontSize={12} fontFamily={MONO} opacity={0.35}
        letterSpacing={1}>43.1107° N · PERUGIA, ITALY</text>
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
