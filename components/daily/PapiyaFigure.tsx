"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { RightNowBlock } from "@/lib/data";

// ─── Design palette ───────────────────────────────────────────────────────────
const SKIN   = "#f5d0b5";    // fair complexion
const SKIN2  = "#e8b896";    // cheek / shadow
const HAIR   = "#180c0c";    // very dark hair
const HAIR2  = "#261212";    // hair highlight strand
const CLOTH  = "#1c1c1a";    // dark outfit
const EYE    = "#2c1510";    // dark eyes
const LIME   = "#c8f135";
const BLUE   = "#4d9fff";
const PINK   = "#ff3c78";

// ─── Reusable: Long black hair (standing, head at cx=100 cy=78 r=40) ──────────
function Hair({ dancing = false, side = false }: { dancing?: boolean; side?: boolean }) {
  if (side) {
    // Hair for lying-down poses — falls to the left
    return (
      <path
        d="M 50 72 Q 18 80 12 100 Q 8 118 18 124 Q 28 128 34 116 Q 38 106 30 96 Q 22 88 42 76"
        fill={HAIR} opacity={0.95}
      />
    );
  }
  return (
    <>
      {/* Back mass */}
      <path
        d="M 66 42 C 54 24 62 8 80 4 C 92 0 108 0 120 4 C 138 10 146 26 134 44
           C 150 72 156 130 152 190 C 148 240 138 268 126 274 C 116 280 106 276 107 260
           C 108 242 118 210 128 172 C 138 136 142 90 132 50
           C 116 30 84 30 68 50 Z"
        fill={HAIR}
      />
      {/* Left side short strand */}
      <path
        d="M 68 40 C 50 50 42 72 44 92 C 46 108 56 114 64 106 C 72 98 72 78 76 56 Z"
        fill={HAIR2} opacity={0.9}
      />
      {/* Right dominant long strand — animated */}
      <motion.path
        d={dancing
          ? "M 128 40 C 158 60 172 110 170 164 C 168 210 160 250 150 270 C 142 284 130 282 128 266 C 126 248 134 210 142 170 C 150 128 158 82 144 48 Z"
          : "M 128 40 C 154 58 162 106 160 160 C 158 208 150 246 140 266 C 132 280 120 278 120 262 C 120 244 128 208 136 168 C 144 130 150 84 136 48 Z"
        }
        fill={HAIR2}
        animate={dancing
          ? { rotate: [-7, 7, -7], x: [-5, 5, -5] }
          : { rotate: [-2, 2, -2] }
        }
        transition={{ duration: dancing ? 0.7 : 5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "128px 40px" }}
      />
    </>
  );
}

// ─── Reusable: Female face ────────────────────────────────────────────────────
type Expression = "normal" | "happy" | "sleepy" | "shocked" | "focused";

function Face({
  cx, cy, r = 40,
  expr = "normal",
  rotate = 0,
}: {
  cx: number; cy: number; r?: number;
  expr?: Expression;
  rotate?: number;
}) {
  const ex = r * 0.22; const ey = r * 0.22;  // eye offsets from center
  const lx = cx - ex;  const rx2 = cx + ex;
  const eyY = cy - r * 0.08;

  // Eye shapes per expression
  const eyeH = expr === "sleepy" ? r * 0.14 : expr === "shocked" ? r * 0.24 : r * 0.19;
  const eyeW = r * 0.15;

  return (
    <g transform={rotate ? `rotate(${rotate} ${cx} ${cy})` : undefined}>
      {/* Face base */}
      <ellipse cx={cx} cy={cy} rx={r} ry={r * 1.06} fill={SKIN} />
      {/* Cheek blush */}
      <ellipse cx={cx - r * 0.52} cy={cy + r * 0.22} rx={r * 0.18} ry={r * 0.1} fill={SKIN2} opacity={0.45} />
      <ellipse cx={cx + r * 0.52} cy={cy + r * 0.22} rx={r * 0.18} ry={r * 0.1} fill={SKIN2} opacity={0.45} />

      {/* Eyebrows */}
      {expr !== "sleepy" && (
        <>
          <path d={`M ${lx - r*0.18} ${eyY - r*0.22} Q ${lx} ${eyY - r*0.3} ${lx + r*0.18} ${eyY - r*0.18}`}
            stroke={HAIR} strokeWidth={r * 0.06} fill="none" strokeLinecap="round" />
          <path d={`M ${rx2 - r*0.18} ${eyY - r*0.18} Q ${rx2} ${eyY - r*0.3} ${rx2 + r*0.18} ${eyY - r*0.22}`}
            stroke={HAIR} strokeWidth={r * 0.06} fill="none" strokeLinecap="round" />
        </>
      )}

      {/* Eyes */}
      <ellipse cx={lx} cy={eyY} rx={eyeW} ry={eyeH} fill={EYE} />
      <ellipse cx={rx2} cy={eyY} rx={eyeW} ry={eyeH} fill={EYE} />
      {/* Eye shine */}
      {expr !== "sleepy" && (
        <>
          <circle cx={lx - r*0.06} cy={eyY - eyeH*0.4} r={r*0.04} fill="white" opacity={0.8} />
          <circle cx={rx2 - r*0.06} cy={eyY - eyeH*0.4} r={r*0.04} fill="white" opacity={0.8} />
        </>
      )}

      {/* Nose */}
      <path d={`M ${cx - r*0.08} ${cy + r*0.18} Q ${cx} ${cy + r*0.28} ${cx + r*0.08} ${cy + r*0.18}`}
        stroke={SKIN2} strokeWidth={r * 0.045} fill="none" strokeLinecap="round" opacity={0.7} />

      {/* Mouth per expression */}
      {expr === "normal" &&
        <path d={`M ${cx - r*0.22} ${cy + r*0.38} Q ${cx} ${cy + r*0.48} ${cx + r*0.22} ${cy + r*0.38}`}
          stroke="#c47878" strokeWidth={r * 0.055} fill="none" strokeLinecap="round" />
      }
      {expr === "happy" &&
        <path d={`M ${cx - r*0.26} ${cy + r*0.32} Q ${cx} ${cy + r*0.52} ${cx + r*0.26} ${cy + r*0.32}`}
          stroke="#c47878" strokeWidth={r * 0.06} fill="none" strokeLinecap="round" />
      }
      {expr === "sleepy" &&
        <path d={`M ${cx - r*0.16} ${cy + r*0.42} Q ${cx} ${cy + r*0.48} ${cx + r*0.16} ${cy + r*0.42}`}
          stroke="#c47878" strokeWidth={r * 0.045} fill="none" strokeLinecap="round" opacity={0.7} />
      }
      {expr === "shocked" &&
        <ellipse cx={cx} cy={cy + r*0.42} rx={r*0.1} ry={r*0.12} fill="#c47878" opacity={0.8} />
      }
      {expr === "focused" &&
        <path d={`M ${cx - r*0.2} ${cy + r*0.38} Q ${cx} ${cy + r*0.42} ${cx + r*0.2} ${cy + r*0.38}`}
          stroke="#c47878" strokeWidth={r * 0.045} fill="none" strokeLinecap="round" />
      }
    </g>
  );
}

// ─── Unicorn plushie (for sleeping pose) ─────────────────────────────────────
function Unicorn({ x, y }: { x: number; y: number }) {
  return (
    <motion.g
      animate={{ rotate: [-3, 3, -3], y: [0, -2, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: `${x + 18}px ${y + 20}px` }}
    >
      {/* Body */}
      <ellipse cx={x + 22} cy={y + 28} rx={20} ry={13} fill="#f8f4ff" />
      {/* Head */}
      <circle cx={x + 8} cy={y + 18} r={13} fill="#f8f4ff" />
      {/* Horn */}
      <path d={`M ${x+5} ${y+6} L ${x+8} ${y-4} L ${x+11} ${y+6} Z`} fill="#ffd700" />
      {/* Mane */}
      <path d={`M ${x+12} ${y+10} Q ${x+22} ${y+16} ${x+32} ${y+20}`}
        stroke="#e879b0" strokeWidth={3.5} fill="none" strokeLinecap="round" />
      <path d={`M ${x+13} ${y+14} Q ${x+22} ${y+20} ${x+32} ${y+24}`}
        stroke="#a78bfa" strokeWidth={2.5} fill="none" strokeLinecap="round" opacity={0.8} />
      {/* Tail */}
      <path d={`M ${x+40} ${y+24} Q ${x+46} ${y+18} ${x+44} ${y+32} Q ${x+42} ${y+40} ${x+38} ${y+36}`}
        stroke="#e879b0" strokeWidth={3} fill="none" strokeLinecap="round" />
      {/* Eye */}
      <circle cx={x+5} cy={y+18} r={2.5} fill={EYE} />
      <circle cx={x+4} cy={y+17} r={0.8} fill="white" opacity={0.8} />
      {/* Tiny smile */}
      <path d={`M ${x+3} ${y+22} Q ${x+6} ${y+25} ${x+9} ${y+22}`}
        stroke="#c47878" strokeWidth={1} fill="none" strokeLinecap="round" opacity={0.6} />
      {/* Legs */}
      {[[14,38],[20,39],[28,38],[34,38]].map(([lx, ly], i) => (
        <line key={i} x1={x+lx} y1={y+ly} x2={x+lx} y2={y+ly+10}
          stroke="#ede8ff" strokeWidth={3.5} strokeLinecap="round" />
      ))}
    </motion.g>
  );
}

// ─── ZZZs ─────────────────────────────────────────────────────────────────────
function Zzz({ x, y, accent }: { x: number; y: number; accent: string }) {
  return (
    <>
      {(["Z", "Zz", "ZzZ"] as const).map((z, i) => (
        <motion.text key={i} x={x + i*9} y={y - i*15}
          fontFamily="monospace" fontWeight="bold" fontSize={14 - i*3} fill={accent}
          animate={{ y: [y - i*15, y - i*15 - 55], opacity: [0.9, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.65, ease: "easeOut" }}
        >{z}</motion.text>
      ))}
    </>
  );
}

// ─── 10 POSES ─────────────────────────────────────────────────────────────────

// 1. MIDNIGHT — seated, phone glow ────────────────────────────────────────────
function NightPose({ accent }: { accent: string }) {
  return (
    <>
      {/* Seated body */}
      <path d="M 62 150 C 54 156 50 172 50 196 C 50 208 58 214 70 215 L 130 215 C 142 214 150 208 150 196 C 150 172 146 156 138 150 C 126 142 112 138 100 138 C 88 138 74 142 62 150 Z" fill={CLOTH} />
      {/* Neck */}
      <rect x="93" y="126" width="14" height="14" rx="5" fill={SKIN} />
      {/* Arms forward */}
      <motion.path d="M 56 158 C 44 175 38 200 40 222 C 42 232 52 232 56 224 C 60 216 62 194 66 172 C 68 160 66 152 60 150 Z" fill={CLOTH}
        animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 0.6, repeat: Infinity }} style={{ transformOrigin: "56px 158px" }} />
      <motion.path d="M 144 158 C 156 175 162 200 160 222 C 158 232 148 232 144 224 C 140 216 138 194 134 172 C 132 160 134 152 140 150 Z" fill={CLOTH}
        animate={{ rotate: [5, -5, 5] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }} style={{ transformOrigin: "144px 158px" }} />
      {/* Phone with screen glow */}
      <motion.rect x="74" y="230" width="52" height="32" rx="4"
        fill={accent} fillOpacity="0.15" stroke={accent} strokeWidth="1.5"
        animate={{ fillOpacity: [0.1, 0.28, 0.1] }} transition={{ duration: 2, repeat: Infinity }} />
      <rect x="80" y="237" width="30" height="2.5" rx="1" fill={accent} opacity="0.5" />
      <rect x="80" y="244" width="22" height="2.5" rx="1" fill={accent} opacity="0.4" />
      <rect x="80" y="251" width="26" height="2.5" rx="1" fill={accent} opacity="0.3" />
      {/* Legs */}
      <path d="M 68 215 C 60 228 56 256 58 282 C 60 294 72 294 76 282 C 80 270 80 244 82 222 Z" fill={CLOTH} />
      <path d="M 132 215 C 140 228 144 256 142 282 C 140 294 128 294 124 282 C 120 270 120 244 118 222 Z" fill={CLOTH} />
      <Hair />
      <Face cx={100} cy={80} expr="normal" />
    </>
  );
}

// 2. SLEEPING — lying with unicorn 🦄 ─────────────────────────────────────────
function SleepingPose({ accent }: { accent: string }) {
  return (
    <>
      {/* Pillow — soft pink */}
      <rect x="8" y="168" width="76" height="44" rx="14"
        fill="#3a1828" stroke={PINK} strokeWidth="1" strokeOpacity="0.5" />

      {/* Body — curled lying down */}
      <motion.path
        d="M 85 196 C 112 190 148 192 172 198 C 185 202 188 212 180 220 C 172 228 148 230 124 228 C 100 226 80 218 78 208 C 76 200 80 198 85 196 Z"
        fill={CLOTH}
        animate={{ scaleY: [1, 1.04, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "133px 213px" }}
      />

      {/* Top arm hugging the pillow/unicorn */}
      <path d="M 94 193 C 90 180 86 168 88 160 C 90 154 96 154 100 160 C 104 166 104 178 102 192 Z" fill={CLOTH} />

      {/* Legs curled */}
      <path d="M 168 225 C 180 228 192 224 196 232 C 200 244 188 256 172 256 C 156 256 144 244 148 234 Z" fill={CLOTH} />
      <path d="M 176 225 C 188 230 198 228 200 238 C 202 252 188 262 172 260 Z" fill={CLOTH} fillOpacity={0.6} />

      {/* Unicorn plushie — snuggled against chest */}
      <Unicorn x={96} y={145} />

      {/* Hair lying down */}
      <Hair side />

      {/* Face — sleeping sideways */}
      <Face cx={48} cy={190} r={34} expr="sleepy" />

      {/* ZZZs above head */}
      <Zzz x={72} y={155} accent={accent} />
    </>
  );
}

// 3. ALARM — startled ─────────────────────────────────────────────────────────
function AlarmPose({ accent }: { accent: string }) {
  return (
    <motion.g
      animate={{ x: [-3, 3, -2, 2, 0], rotate: [-2, 2, -1, 1, 0] }}
      transition={{ duration: 0.42, repeat: Infinity, repeatDelay: 2 }}
      style={{ transformOrigin: "100px 200px" }}
    >
      <rect x="93" y="128" width="14" height="14" rx="5" fill={SKIN} />
      <path d="M 62 148 C 52 158 48 178 48 204 C 48 216 56 222 68 223 L 132 223 C 144 222 152 216 152 204 C 152 178 148 158 138 148 C 126 138 114 134 100 134 C 86 134 74 138 62 148 Z" fill={CLOTH} />
      {/* Arms flung up wide */}
      <motion.path d="M 56 155 C 38 135 22 110 14 88 C 8 74 16 66 26 70 C 36 74 44 92 52 114 C 60 134 62 154 64 160 Z" fill={CLOTH}
        animate={{ rotate: [-14, 14, -14] }} transition={{ duration: 0.42, repeat: Infinity }} style={{ transformOrigin: "56px 155px" }} />
      <motion.path d="M 144 155 C 162 135 178 110 186 88 C 192 74 184 66 174 70 C 164 74 156 92 148 114 C 140 134 138 154 136 160 Z" fill={CLOTH}
        animate={{ rotate: [14, -14, 14] }} transition={{ duration: 0.42, repeat: Infinity, delay: 0.21 }} style={{ transformOrigin: "144px 155px" }} />
      <path d="M 68 223 C 60 238 54 268 56 298 C 58 310 72 310 76 298 C 80 286 80 258 82 232 Z" fill={CLOTH} />
      <path d="M 132 223 C 140 238 146 268 144 298 C 142 310 128 310 124 298 C 120 286 120 258 118 232 Z" fill={CLOTH} />
      <motion.text x="18" y="72" fontSize="22" fill={accent} fontFamily="monospace" fontWeight="bold"
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }} transition={{ duration: 0.42, repeat: Infinity }}
        style={{ transformOrigin: "18px 72px" }}>!</motion.text>
      <motion.text x="166" y="72" fontSize="22" fill={accent} fontFamily="monospace" fontWeight="bold"
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }} transition={{ duration: 0.42, repeat: Infinity, delay: 0.21 }}
        style={{ transformOrigin: "166px 72px" }}>!</motion.text>
      <Hair />
      <Face cx={100} cy={80} expr="shocked" />
    </motion.g>
  );
}

// 4. LYING PHONE ───────────────────────────────────────────────────────────────
function WavePose({ accent }: { accent: string }) {
  return (
    <>
      <path d="M 82 198 C 108 192 148 194 175 200 C 190 204 192 216 182 224 C 172 232 142 234 118 230 C 92 226 76 214 78 204 Z" fill={CLOTH} />
      <motion.path d="M 105 192 C 102 173 100 154 102 140 C 104 130 112 130 116 138 C 120 146 120 162 118 180 C 116 196 112 200 108 196 Z" fill={CLOTH}
        animate={{ rotate: [-6, 6, -6] }} transition={{ duration: 2.5, repeat: Infinity }} style={{ transformOrigin: "105px 192px" }} />
      <motion.rect x="92" y="116" width="28" height="18" rx="3"
        fill={accent} fillOpacity="0.2" stroke={accent} strokeWidth="1.5"
        animate={{ fillOpacity: [0.15, 0.35, 0.15] }} transition={{ duration: 2, repeat: Infinity }} />
      <path d="M 78 200 C 68 210 64 222 66 232 C 68 240 76 240 80 232 C 84 224 84 212 84 202 Z" fill={CLOTH} />
      <motion.path d="M 160 228 C 178 226 196 218 198 228 C 200 240 182 252 160 252 C 144 252 130 242 132 230 Z" fill={CLOTH}
        animate={{ rotate: [0, 8, 0, -8, 0] }} transition={{ duration: 5, repeat: Infinity }} style={{ transformOrigin: "162px 240px" }} />
      <path d="M 148 230 C 168 234 188 228 192 238 C 188 252 164 258 144 252 Z" fill={CLOTH} fillOpacity={0.6} />
      <Hair side />
      <Face cx={45} cy={196} r={32} expr="normal" />
    </>
  );
}

// 5. HUNGRY SLUMP ──────────────────────────────────────────────────────────────
function HungryPose({ accent }: { accent: string }) {
  return (
    <motion.g animate={{ y: [0, 5, 0], rotate: [0, 2, 0] }} transition={{ duration: 4, repeat: Infinity }} style={{ transformOrigin: "100px 170px" }}>
      <rect x="93" y="128" width="14" height="16" rx="5" fill={SKIN} />
      <path d="M 60 150 C 50 160 46 182 46 210 C 46 222 54 228 66 229 L 134 229 C 146 228 154 222 154 210 C 154 182 150 160 140 150 C 128 140 116 136 100 136 C 84 136 72 140 60 150 Z" fill={CLOTH} />
      <motion.path d="M 52 158 C 36 186 28 220 30 252 C 32 264 44 264 48 254 C 52 244 54 216 58 190 C 62 170 60 156 54 152 Z" fill={CLOTH}
        animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 4, repeat: Infinity }} style={{ transformOrigin: "52px 158px" }} />
      <motion.path d="M 148 158 C 164 186 172 220 170 252 C 168 264 156 264 152 254 C 148 244 146 216 142 190 C 138 170 140 156 146 152 Z" fill={CLOTH}
        animate={{ rotate: [5, -5, 5] }} transition={{ duration: 4, repeat: Infinity }} style={{ transformOrigin: "148px 158px" }} />
      <path d="M 66 229 C 58 244 52 274 54 306 C 56 320 70 320 74 306 C 78 292 78 262 80 238 Z" fill={CLOTH} />
      <path d="M 134 229 C 142 244 148 274 146 306 C 144 320 130 320 126 306 C 122 292 122 262 120 238 Z" fill={CLOTH} />
      <Hair />
      <Face cx={100} cy={80} expr="sleepy" />
    </motion.g>
  );
}

// 6. CHICKEN SURGERY ───────────────────────────────────────────────────────────
function ChickenPose({ accent }: { accent: string }) {
  return (
    <>
      <rect x="93" y="128" width="14" height="14" rx="5" fill={SKIN} />
      <path d="M 60 148 C 50 158 48 178 48 204 C 48 216 56 222 68 223 L 132 223 C 144 222 152 216 152 204 C 152 178 150 158 140 148 C 128 138 116 134 100 134 C 84 134 72 138 60 148 Z" fill={CLOTH} />
      <motion.path d="M 144 156 C 158 136 166 110 162 88 C 160 76 152 74 144 80 C 136 86 134 102 136 122 C 138 140 142 158 146 162 Z" fill={CLOTH}
        animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 1.4, repeat: Infinity }} style={{ transformOrigin: "144px 156px" }} />
      <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>
        <line x1="154" y1="60" x2="154" y2="80" stroke={accent} strokeWidth="3" strokeLinecap="round" />
        <line x1="148" y1="60" x2="148" y2="72" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="160" y1="60" x2="160" y2="72" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 148 72 Q 151 78 154 78 Q 157 78 160 72" stroke={accent} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </motion.g>
      <path d="M 56 156 C 44 172 40 196 42 220 C 44 230 54 230 58 222 C 62 212 62 190 62 168 Z" fill={CLOTH} />
      <ellipse cx="74" cy="232" rx="24" ry="7" fill="#1a1a18" stroke={accent} strokeWidth="0.8" strokeOpacity="0.5" />
      {[[-4,-6],[8,-10],[18,-4]].map(([dx, dy], i) => (
        <motion.circle key={i} cx={74 + dx} cy={218 + dy} r="3" fill={accent} fillOpacity="0.7"
          animate={{ opacity: [0.7, 0.2, 0.7], y: [0, -4, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }} />
      ))}
      <path d="M 68 223 C 60 238 54 268 56 298 C 58 310 72 310 76 298 C 80 284 80 258 82 232 Z" fill={CLOTH} />
      <path d="M 132 223 C 140 238 146 268 144 298 C 142 310 128 310 124 298 C 120 284 120 258 118 232 Z" fill={CLOTH} />
      <Hair />
      <Face cx={100} cy={80} expr="focused" />
    </>
  );
}

// 7. NAP in chair ──────────────────────────────────────────────────────────────
function NapPose({ accent }: { accent: string }) {
  return (
    <>
      <rect x="40" y="222" width="120" height="8" rx="4" fill="#1a1a18" />
      <rect x="36" y="140" width="6" height="84" rx="3" fill="#161614" />
      <rect x="50" y="228" width="6" height="72" rx="3" fill="#161614" />
      <rect x="144" y="228" width="6" height="72" rx="3" fill="#161614" />
      <motion.g animate={{ rotate: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity }} style={{ transformOrigin: "100px 222px" }}>
        <rect x="93" y="128" width="14" height="16" rx="5" fill={SKIN} />
        <path d="M 58 148 C 48 160 44 182 44 210 C 44 220 52 224 64 225 L 136 225 C 148 224 156 220 156 210 C 156 182 152 160 142 148 C 130 138 118 134 100 134 C 82 134 70 138 58 148 Z" fill={CLOTH} />
        <path d="M 48 156 C 32 184 26 218 28 250 C 30 262 42 262 46 252 C 50 240 52 212 56 184 C 60 164 58 152 52 150 Z" fill={CLOTH} />
        <path d="M 152 156 C 168 184 174 218 172 250 C 170 262 158 262 154 252 C 150 240 148 212 144 184 C 140 164 142 152 148 150 Z" fill={CLOTH} />
        <Hair />
        <Face cx={100} cy={80} expr="sleepy" />
      </motion.g>
      <path d="M 64 225 C 56 240 50 272 52 304 C 54 316 68 316 72 304 C 76 290 76 262 78 234 Z" fill={CLOTH} />
      <path d="M 136 225 C 144 240 150 272 148 304 C 146 316 132 316 128 304 C 124 290 124 262 122 234 Z" fill={CLOTH} />
      <Zzz x={118} y={50} accent={accent} />
    </>
  );
}

// 8. RECOVERY / WAKE ───────────────────────────────────────────────────────────
function WakePose({ accent }: { accent: string }) {
  return (
    <motion.g animate={{ rotate: [0, -7, 0, -4, 0] }} transition={{ duration: 5.5, repeat: Infinity }} style={{ transformOrigin: "100px 200px" }}>
      <path d="M 50 194 C 72 188 130 190 168 198 C 184 202 186 214 176 222 C 164 230 128 232 100 228 C 72 224 46 208 50 194 Z" fill={CLOTH} />
      <path d="M 56 196 C 38 215 28 240 30 264 C 32 276 44 276 48 266 C 54 254 56 232 60 210 Z" fill={CLOTH} />
      <path d="M 100 190 C 100 208 98 228 98 244 C 98 254 106 256 110 248 C 116 238 116 216 114 196 Z" fill={CLOTH} />
      <path d="M 144 226 C 164 224 184 214 186 224 C 188 238 168 252 146 252 C 126 252 110 240 114 228 Z" fill={CLOTH} />
      <Hair side />
      <Face cx={40} cy={180} r={32} expr="sleepy" />
    </motion.g>
  );
}

// 9. GETTING READY ─────────────────────────────────────────────────────────────
function ReadyPose({ accent }: { accent: string }) {
  return (
    <motion.g animate={{ y: [0, -5, 0], rotate: [-2, 2, -2] }} transition={{ duration: 3, repeat: Infinity }} style={{ transformOrigin: "100px 170px" }}>
      <rect x="93" y="128" width="14" height="14" rx="5" fill={SKIN} />
      <path d="M 64 148 C 54 158 50 178 50 204 C 50 216 58 222 70 223 L 134 223 C 146 222 152 216 152 204 C 152 178 148 158 138 148 C 128 140 114 136 100 136 C 86 136 72 140 64 148 Z" fill={CLOTH} />
      <motion.path d="M 144 154 C 156 134 162 110 158 90 C 156 78 146 76 138 82 C 130 88 130 106 132 126 C 134 144 140 158 144 162 Z" fill={CLOTH}
        animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 2, repeat: Infinity }} style={{ transformOrigin: "144px 154px" }} />
      <path d="M 54 156 C 42 172 38 198 40 222 C 42 232 52 232 56 224 C 60 214 60 188 62 166 Z" fill={CLOTH} />
      <path d="M 70 223 C 62 238 56 268 58 298 C 60 310 74 310 78 298 C 82 284 82 256 84 232 Z" fill={CLOTH} />
      <path d="M 130 223 C 138 238 144 268 142 298 C 140 310 126 310 122 298 C 118 284 118 256 116 232 Z" fill={CLOTH} />
      {([["✦", 148, 88], ["✧", 162, 114], ["·", 144, 128]] as [string, number, number][]).map(([s, x, y], i) => (
        <motion.text key={i} x={x} y={y} fontSize={11 + i * 3} fill={accent} fontFamily="monospace" fontWeight="bold"
          animate={{ opacity: [0, 1, 0], scale: [0.4, 1.6, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.45 }}
          style={{ transformOrigin: `${x}px ${y}px` }}
        >{s}</motion.text>
      ))}
      <Hair />
      <Face cx={100} cy={80} expr="happy" />
    </motion.g>
  );
}

// 10. DANCING ──────────────────────────────────────────────────────────────────
function DancePose({ accent }: { accent: string }) {
  return (
    <motion.g animate={{ rotate: [-9, 9, -9], x: [-7, 7, -7] }} transition={{ duration: 0.7, repeat: Infinity }} style={{ transformOrigin: "100px 200px" }}>
      <motion.circle cx={100} cy={80} r={60} fill={accent} fillOpacity="0.06"
        animate={{ r: [60, 75, 60] }} transition={{ duration: 0.7, repeat: Infinity }} />
      <rect x="93" y="128" width="14" height="14" rx="5" fill={SKIN} />
      <path d="M 64 148 C 54 158 50 176 50 202 C 50 214 58 220 70 221 L 130 221 C 142 220 150 214 150 202 C 150 176 146 158 136 148 C 126 140 114 136 100 136 C 86 136 74 140 64 148 Z" fill={CLOTH} />
      <motion.path d="M 58 154 C 40 132 24 106 16 82 C 10 66 18 58 28 62 C 38 66 46 84 54 108 C 62 130 62 152 64 158 Z" fill={CLOTH}
        animate={{ rotate: [-14, 14, -14] }} transition={{ duration: 0.7, repeat: Infinity }} style={{ transformOrigin: "58px 154px" }} />
      <motion.path d="M 142 154 C 160 132 176 106 184 82 C 190 66 182 58 172 62 C 162 66 154 84 146 108 C 138 130 138 152 136 158 Z" fill={CLOTH}
        animate={{ rotate: [14, -14, 14] }} transition={{ duration: 0.7, repeat: Infinity, delay: 0.35 }} style={{ transformOrigin: "142px 154px" }} />
      <motion.path d="M 68 221 C 56 238 48 270 52 302 C 54 316 68 316 72 302 C 76 288 74 258 76 232 Z" fill={CLOTH}
        animate={{ rotate: [-12, 12, -12] }} transition={{ duration: 0.7, repeat: Infinity }} style={{ transformOrigin: "68px 221px" }} />
      <motion.path d="M 132 221 C 144 238 152 270 148 302 C 146 316 132 316 128 302 C 124 288 126 258 124 232 Z" fill={CLOTH}
        animate={{ rotate: [12, -12, 12] }} transition={{ duration: 0.7, repeat: Infinity, delay: 0.35 }} style={{ transformOrigin: "132px 221px" }} />
      {(["♪", "♫", "♬"] as const).map((n, i) => (
        <motion.text key={i} x={150 + i * 14} y={70 + i * 22} fontSize={12 + i * 3} fill={accent} fontFamily="monospace"
          animate={{ y: [70 + i*22, 30 + i*14], opacity: [1, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.5, ease: "easeOut" }}
        >{n}</motion.text>
      ))}
      <Hair dancing />
      <Face cx={100} cy={80} expr="happy" />
    </motion.g>
  );
}

// ─── Pose map ─────────────────────────────────────────────────────────────────
type PoseFC = React.FC<{ accent: string }>;

const POSE_MAP: Record<RightNowBlock["icon"], PoseFC> = {
  night:   NightPose,
  zzz:     SleepingPose,
  alarm:   AlarmPose,
  wave:    WavePose,
  fork:    HungryPose,
  chicken: ChickenPose,
  nap:     NapPose,
  wake:    WakePose,
  sparkle: ReadyPose,
  moon:    DancePose,
};

export default function PapiyaFigure({ icon }: { icon: RightNowBlock["icon"] }) {
  const PoseComp = POSE_MAP[icon];
  const accent =
    icon === "night" ? BLUE :
    icon === "zzz"   ? "#9b7fe8" :
    icon === "alarm" ? PINK :
    icon === "wave"  ? BLUE :
    icon === "fork"  ? "#ff8c42" :
    icon === "chicken" ? LIME :
    icon === "nap"   ? "#9b7fe8" :
    icon === "wake"  ? "#ffd60a" :
    icon === "sparkle" ? LIME :
    PINK;

  return (
    <svg viewBox="0 0 200 360" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: "visible" }} aria-label={`Papiya ${icon}`}>
      <AnimatePresence mode="wait">
        <motion.g key={icon}
          initial={{ opacity: 0, scale: 0.93, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: -8 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: "100px 180px" }}
        >
          <PoseComp accent={accent} />
        </motion.g>
      </AnimatePresence>
    </svg>
  );
}
