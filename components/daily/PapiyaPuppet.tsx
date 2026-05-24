"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { RightNowBlock } from "@/lib/data";

// ─── Palette ──────────────────────────────────────────────────────────────────
const SKIN  = "#f5d0b5";
const SKIN2 = "#dfa882";   // shadow / cheek
const HAIR  = "#180c0c";
const CLOTH = "#1e1e1c";
const EYE   = "#2c1510";
const LIP   = "#c47878";
const LIME  = "#c8f135";
const BLUE  = "#4d9fff";
const PINK  = "#ff3c78";

// ─── Hair ─────────────────────────────────────────────────────────────────────
// Long black hair — the signature feature
function Hair({ flying = false }: { flying?: boolean }) {
  return (
    <>
      {/* Back mass — behind everything */}
      <div style={{
        position: "absolute", zIndex: 0,
        left: 74, top: 0, width: 60, height: 290,
        background: HAIR,
        borderRadius: "4px 22px 30px 4px",
      }} />
      {/* Hair top — over forehead */}
      <div style={{
        position: "absolute", zIndex: 4,
        left: 52, top: 2, width: 80, height: 52,
        background: HAIR,
        borderRadius: "40px 40px 0 0",
      }} />
      {/* Left side strand */}
      <div style={{
        position: "absolute", zIndex: 4,
        left: 48, top: 10, width: 22, height: 80,
        background: HAIR,
        borderRadius: "12px 0 0 18px",
      }} />
      {/* Right dominant long strand — animated */}
      <motion.div style={{
        position: "absolute", zIndex: 4,
        left: 96, top: 8, width: 42, height: 280,
        background: HAIR,
        borderRadius: "0 16px 30px 6px",
        transformOrigin: "top center",
      }}
        animate={flying
          ? { rotate: [-6, 6, -6], x: [-4, 4, -4] }
          : { rotate: [-1.5, 1.5, -1.5] }
        }
        transition={{ duration: flying ? 0.7 : 4.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}

// ─── Face ─────────────────────────────────────────────────────────────────────
type Expr = "normal" | "happy" | "sleepy" | "shocked" | "focused";

function Face({ expr = "normal", tilt = 0 }: { expr?: Expr; tilt?: number }) {
  const eyeH = expr === "sleepy" ? 5 : expr === "shocked" ? 14 : 11;
  return (
    <motion.div
      style={{
        position: "absolute", zIndex: 3,
        left: 53, top: 8, width: 70, height: 80,
        background: SKIN,
        borderRadius: "50%",
        transformOrigin: "center center",
      }}
      animate={{ rotate: tilt }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Cheeks */}
      <div style={{ position:"absolute", left:4, top:44, width:16, height:9, background:SKIN2, borderRadius:"50%", opacity:0.45 }} />
      <div style={{ position:"absolute", right:4, top:44, width:16, height:9, background:SKIN2, borderRadius:"50%", opacity:0.45 }} />

      {/* Left eye */}
      <div style={{ position:"absolute", left:13, top:28, width:12, height:eyeH, background:EYE, borderRadius:"50%/30%" }} />
      {/* Right eye */}
      <div style={{ position:"absolute", right:13, top:28, width:12, height:eyeH, background:EYE, borderRadius:"50%/30%" }} />
      {/* Eye shine */}
      {expr !== "sleepy" && <>
        <div style={{ position:"absolute", left:15, top:28, width:4, height:4, background:"white", borderRadius:"50%", opacity:0.7 }} />
        <div style={{ position:"absolute", right:15, top:28, width:4, height:4, background:"white", borderRadius:"50%", opacity:0.7 }} />
      </>}

      {/* Eyebrows */}
      {expr !== "sleepy" && <>
        <div style={{ position:"absolute", left:11, top:20, width:16, height:3, background:HAIR, borderRadius:"3px", transform:"rotate(-6deg)" }} />
        <div style={{ position:"absolute", right:11, top:20, width:16, height:3, background:HAIR, borderRadius:"3px", transform:"rotate(6deg)" }} />
      </>}
      {expr === "shocked" && <>
        <div style={{ position:"absolute", left:11, top:17, width:16, height:3, background:HAIR, borderRadius:"3px", transform:"rotate(-8deg)" }} />
        <div style={{ position:"absolute", right:11, top:17, width:16, height:3, background:HAIR, borderRadius:"3px", transform:"rotate(8deg)" }} />
      </>}

      {/* Nose */}
      <div style={{ position:"absolute", left:"50%", top:44, width:6, height:6, background:SKIN2, borderRadius:"50%", transform:"translateX(-50%)", opacity:0.5 }} />

      {/* Mouth */}
      {expr === "normal" && <div style={{ position:"absolute", left:22, top:56, width:26, height:8, background:LIP, borderRadius:"0 0 13px 13px", opacity:0.7 }} />}
      {expr === "happy"  && <div style={{ position:"absolute", left:18, top:54, width:34, height:10, background:LIP, borderRadius:"0 0 17px 17px", opacity:0.8 }} />}
      {expr === "sleepy" && <div style={{ position:"absolute", left:24, top:58, width:22, height:6, background:LIP, borderRadius:"3px", opacity:0.5 }} />}
      {expr === "shocked" && <div style={{ position:"absolute", left:26, top:54, width:18, height:14, background:LIP, borderRadius:"50%", opacity:0.7 }} />}
      {expr === "focused" && <div style={{ position:"absolute", left:22, top:57, width:26, height:5, background:LIP, borderRadius:"3px", opacity:0.6 }} />}
    </motion.div>
  );
}

// ─── Arm — nested joint system ────────────────────────────────────────────────
// Pivot is at top-center of the upper arm div
// Child forearm pivots at ITS top-center (which is near the elbow)

function Arm({
  side, originX, originY,
  shoulder, elbow,
  shoulderAnim, elbowAnim,
  speed = 2, skinHand = true,
}: {
  side: "L" | "R";
  originX: number; originY: number;     // shoulder joint position
  shoulder: number | number[];          // upper arm angle (static or keyframes)
  elbow: number | number[];             // forearm bend
  shoulderAnim?: { duration: number };
  elbowAnim?: { duration: number };
  speed?: number;
  skinHand?: boolean;
}) {
  const mirror = side === "R" ? -1 : 1;
  const dur = shoulderAnim?.duration ?? 3;
  const eDur = elbowAnim?.duration ?? dur;

  return (
    <motion.div  // upper arm container — pivots at shoulder
      style={{
        position: "absolute",
        left: originX - 11,
        top: originY,
        width: 22, height: 72,
        transformOrigin: "top center",
        zIndex: 1,
      }}
      animate={{ rotate: Array.isArray(shoulder) ? shoulder.map(v => v * mirror) : shoulder * mirror }}
      transition={{ duration: dur, repeat: Array.isArray(shoulder) ? Infinity : 0, ease: "easeInOut", repeatType: "mirror" }}
    >
      <div style={{ position:"absolute", inset:0, background:CLOTH, borderRadius:11 }} />

      <motion.div  // forearm — pivots at elbow (top of this div = elbow joint)
        style={{
          position: "absolute",
          left: 1, top: 58,
          width: 20, height: 68,
          transformOrigin: "top center",
        }}
        animate={{ rotate: Array.isArray(elbow) ? elbow.map(v => v * mirror) : elbow * mirror }}
        transition={{ duration: eDur, repeat: Array.isArray(elbow) ? Infinity : 0, ease: "easeInOut", repeatType: "mirror" }}
      >
        <div style={{ position:"absolute", inset:0, background:CLOTH, borderRadius:10 }} />
        {/* Hand */}
        <div style={{
          position:"absolute", bottom:-8, left:1,
          width:18, height:22,
          background: skinHand ? SKIN : CLOTH,
          borderRadius:9,
        }} />
      </motion.div>
    </motion.div>
  );
}

// ─── Leg — nested joint system ────────────────────────────────────────────────
function Leg({
  side, originX, originY,
  hip, knee,
  hipAnim, kneeAnim,
}: {
  side: "L" | "R";
  originX: number; originY: number;
  hip: number | number[];
  knee: number | number[];
  hipAnim?: { duration: number };
  kneeAnim?: { duration: number };
}) {
  const mirror = side === "R" ? -1 : 1;
  const dur = hipAnim?.duration ?? 3;
  const kDur = kneeAnim?.duration ?? dur;

  return (
    <motion.div  // upper leg — pivots at hip
      style={{
        position: "absolute",
        left: originX - 13,
        top: originY,
        width: 26, height: 88,
        transformOrigin: "top center",
        zIndex: 1,
      }}
      animate={{ rotate: Array.isArray(hip) ? hip.map(v => v * mirror) : hip * mirror }}
      transition={{ duration: dur, repeat: Array.isArray(hip) ? Infinity : 0, ease: "easeInOut", repeatType: "mirror" }}
    >
      <div style={{ position:"absolute", inset:0, background:CLOTH, borderRadius:13 }} />

      <motion.div  // lower leg — pivots at knee
        style={{
          position: "absolute",
          left: 3, top: 72,
          width: 22, height: 86,
          transformOrigin: "top center",
        }}
        animate={{ rotate: Array.isArray(knee) ? knee.map(v => v * mirror) : knee * mirror }}
        transition={{ duration: kDur, repeat: Array.isArray(knee) ? Infinity : 0, ease: "easeInOut", repeatType: "mirror" }}
      >
        <div style={{ position:"absolute", inset:0, background:CLOTH, borderRadius:11 }} />
        {/* Foot */}
        <div style={{
          position:"absolute", bottom:-6, left:-4,
          width:30, height:15,
          background:CLOTH,
          borderRadius:"8px 8px 12px 12px",
        }} />
      </motion.div>
    </motion.div>
  );
}

// ─── Neck ─────────────────────────────────────────────────────────────────────
function Neck() {
  return <div style={{ position:"absolute", zIndex:2, left:84, top:84, width:14, height:18, background:SKIN, borderRadius:7 }} />;
}

// ─── Torso ────────────────────────────────────────────────────────────────────
function Torso({ breathe = false }: { breathe?: boolean }) {
  return (
    <motion.div style={{
      position:"absolute", zIndex:1,
      left:52, top:96, width:74, height:118,
      background:CLOTH,
      borderRadius:"18px 18px 12px 12px",
      transformOrigin:"top center",
    }}
      animate={breathe ? { scaleY:[1, 1.025, 1] } : {}}
      transition={{ duration:3.5, repeat:Infinity, ease:"easeInOut" }}
    />
  );
}

// ─── Hips ─────────────────────────────────────────────────────────────────────
function Hips() {
  return <div style={{ position:"absolute", zIndex:1, left:55, top:208, width:68, height:24, background:CLOTH, borderRadius:12 }} />;
}

// ─── ZZZ ──────────────────────────────────────────────────────────────────────
function Zzz({ x, y, accent }: { x: number; y: number; accent: string }) {
  return <>
    {(["Z","Zz","ZzZ"] as const).map((z, i) => (
      <motion.div key={i} style={{
        position:"absolute", left:x + i*10, top:y - i*16,
        fontFamily:"monospace", fontWeight:"bold",
        fontSize: 14 - i*3, color:accent, zIndex:10,
      }}
        animate={{ y:[0,-50], opacity:[0.9,0] }}
        transition={{ duration:2, repeat:Infinity, delay:i*0.6, ease:"easeOut" }}
      >{z}</motion.div>
    ))}
  </>;
}

// ─── 10 POSE RENDERERS ────────────────────────────────────────────────────────

function Night({ accent }: { accent: string }) {
  return (
    <>
      <Arm side="L" originX={64} originY={106} shoulder={[58,64,58]} elbow={[55,60,55]} shoulderAnim={{duration:0.6}} skinHand />
      <Arm side="R" originX={114} originY={106} shoulder={[58,64,58]} elbow={[55,60,55]} shoulderAnim={{duration:0.6}} skinHand />
      <Leg side="L" originX={75} originY={220} hip={-88} knee={88} />
      <Leg side="R" originX={103} originY={220} hip={-88} knee={88} />
      <Torso />
      <Hips />
      <Neck />
      <Hair />
      <Face expr="normal" tilt={-6} />
      {/* Phone glow */}
      <motion.div style={{
        position:"absolute", zIndex:6,
        left:62, top:264, width:48, height:30,
        background:accent, borderRadius:6, opacity:0.2,
        boxShadow:`0 0 24px 8px ${accent}44`,
      }} animate={{opacity:[0.15,0.3,0.15]}} transition={{duration:1.8,repeat:Infinity}} />
      <div style={{ position:"absolute", zIndex:7, left:70, top:270, width:30, height:3, background:accent, borderRadius:2, opacity:0.6 }} />
      <div style={{ position:"absolute", zIndex:7, left:70, top:277, width:22, height:3, background:accent, borderRadius:2, opacity:0.5 }} />
      <div style={{ position:"absolute", zIndex:7, left:70, top:284, width:26, height:3, background:accent, borderRadius:2, opacity:0.4 }} />
    </>
  );
}

function Sleeping({ accent }: { accent: string }) {
  // Lying on side — whole character rotated, separate layout
  return (
    <div style={{ position:"absolute", left:0, top:0, width:380, height:180,
      transform:"rotate(-90deg) translateX(-200px)", transformOrigin:"0 0" }}>
      {/* Pillow */}
      <div style={{
        position:"absolute", left:8, top:50, width:80, height:52,
        background:"#2a1020", borderRadius:16,
        border:`1px solid ${PINK}44`,
      }} />
      {/* Body */}
      <motion.div style={{
        position:"absolute", left:82, top:68, width:180, height:44,
        background:CLOTH, borderRadius:22, transformOrigin:"center",
      }} animate={{scaleY:[1,1.06,1]}} transition={{duration:4,repeat:Infinity,ease:"easeInOut"}} />
      {/* Top arm */}
      <div style={{ position:"absolute", left:92, top:56, width:22, height:70, background:CLOTH, borderRadius:11, transform:"rotate(-20deg)", transformOrigin:"top center" }} />
      {/* Legs */}
      <div style={{ position:"absolute", left:240, top:74, width:80, height:30, background:CLOTH, borderRadius:15, transform:"rotate(12deg)", transformOrigin:"left center" }} />
      <div style={{ position:"absolute", left:236, top:88, width:76, height:26, background:CLOTH, borderRadius:13, opacity:0.7, transform:"rotate(18deg)", transformOrigin:"left center" }} />
      {/* Hair lying */}
      <div style={{ position:"absolute", left:8, top:28, width:72, height:20, background:HAIR, borderRadius:"10px 10px 0 0" }} />
      {/* Face */}
      <div style={{
        position:"absolute", left:24, top:36, width:60, height:70,
        background:SKIN, borderRadius:"50%",
      }}>
        {/* Closed eyes */}
        <div style={{ position:"absolute", left:12, top:24, width:12, height:5, background:EYE, borderRadius:3 }} />
        <div style={{ position:"absolute", right:12, top:24, width:12, height:5, background:EYE, borderRadius:3 }} />
        <div style={{ position:"absolute", left:10, top:18, width:14, height:2.5, background:HAIR, borderRadius:2, transform:"rotate(-4deg)" }} />
        <div style={{ position:"absolute", right:10, top:18, width:14, height:2.5, background:HAIR, borderRadius:2, transform:"rotate(4deg)" }} />
        <div style={{ position:"absolute", left:18, top:34, width:6, height:5, background:SKIN2, borderRadius:"50%", opacity:0.4 }} />
        <div style={{ position:"absolute", left:16, top:46, width:28, height:7, background:LIP, borderRadius:"0 0 14px 14px", opacity:0.5 }} />
      </div>
      {/* ZZZs float up (which is to the right when rotated) */}
      <Zzz x={78} y={30} accent={accent} />
      {/* Unicorn plushie */}
      <motion.div style={{ position:"absolute", left:148, top:48, zIndex:5 }}
        animate={{rotate:[-2,2,-2],y:[0,-2,0]}} transition={{duration:4,repeat:Infinity,ease:"easeInOut"}}>
        <div style={{ position:"absolute", left:12, top:0, width:8, height:18, background:"#ffd700", borderRadius:"4px 4px 2px 2px", transform:"rotate(-6deg)", transformOrigin:"bottom center" }} />
        <div style={{ position:"absolute", left:0, top:12, width:44, height:26, background:"#f8f4ff", borderRadius:14 }} />
        <div style={{ position:"absolute", left:-4, top:4, width:26, height:26, background:"#f8f4ff", borderRadius:"50%" }} />
        <div style={{ position:"absolute", left:10, top:8, width:4, height:4, background:EYE, borderRadius:"50%" }} />
        <div style={{ position:"absolute", left:11, top:9, width:1.5, height:1.5, background:"white", borderRadius:"50%", opacity:0.8 }} />
        <div style={{ position:"absolute", left:14, top:16, width:26, height:3, background:"#e879b0", borderRadius:3 }} />
        <div style={{ position:"absolute", left:16, top:20, width:20, height:2.5, background:"#a78bfa", borderRadius:3, opacity:0.8 }} />
        {[[8,36],[14,37],[26,36],[32,36]].map(([lx,ly],i)=>(
          <div key={i} style={{ position:"absolute", left:lx, top:ly, width:5, height:14, background:"#ede8ff", borderRadius:3 }} />
        ))}
      </motion.div>
    </div>
  );
}

function Alarm({ accent }: { accent: string }) {
  return (
    <motion.div style={{ position:"absolute", inset:0 }}
      animate={{ x:[-3,3,-2,2,0], rotate:[-2,2,-1,1,0] }}
      transition={{ duration:0.42, repeat:Infinity, repeatDelay:2 }}
    >
      <Arm side="L" originX={64} originY={106} shoulder={[-148,-158,-148]} elbow={[20,28,20]} shoulderAnim={{duration:0.42}} skinHand />
      <Arm side="R" originX={114} originY={106} shoulder={[-148,-158,-148]} elbow={[20,28,20]} shoulderAnim={{duration:0.42}} skinHand />
      <Leg side="L" originX={75} originY={220} hip={[8,-8,8]} knee={0} hipAnim={{duration:0.42}} />
      <Leg side="R" originX={103} originY={220} hip={[8,-8,8]} knee={0} hipAnim={{duration:0.42}} />
      <Torso />
      <Hips />
      <Neck />
      <Hair />
      <Face expr="shocked" />
      <motion.div style={{ position:"absolute", zIndex:8, left:8, top:40, fontFamily:"monospace", fontWeight:"bold", fontSize:22, color:accent }}
        animate={{ opacity:[0,1,0], scale:[0.5,1.5,0.5] }} transition={{ duration:0.42, repeat:Infinity }}
        >!</motion.div>
      <motion.div style={{ position:"absolute", zIndex:8, right:8, top:40, fontFamily:"monospace", fontWeight:"bold", fontSize:22, color:accent }}
        animate={{ opacity:[0,1,0], scale:[0.5,1.5,0.5] }} transition={{ duration:0.42, repeat:Infinity, delay:0.21 }}
        >!</motion.div>
    </motion.div>
  );
}

function Wave({ accent }: { accent: string }) {
  return (
    <div style={{ position:"absolute", left:0, top:0, width:380, height:180,
      transform:"rotate(-90deg) translateX(-200px)", transformOrigin:"0 0" }}>
      <div style={{ position:"absolute", left:82, top:68, width:180, height:44, background:CLOTH, borderRadius:22 }} />
      <motion.div style={{ position:"absolute", left:92, top:32, width:22, height:80, background:CLOTH, borderRadius:11, transformOrigin:"bottom center" }}
        animate={{rotate:[-12,12,-12]}} transition={{duration:2.5,repeat:Infinity,ease:"easeInOut"}} />
      <motion.div style={{
        position:"absolute", left:100, top:12, width:34, height:22,
        background:accent, borderRadius:4, opacity:0.25,
        border:`1.5px solid ${accent}`,
      }} animate={{opacity:[0.2,0.4,0.2]}} transition={{duration:2,repeat:Infinity}} />
      <div style={{ position:"absolute", left:226, top:78, width:80, height:24, background:CLOTH, borderRadius:12, transform:"rotate(10deg)", transformOrigin:"left center" }} />
      <div style={{ position:"absolute", left:8, top:30, width:68, height:18, background:HAIR, borderRadius:"8px 8px 0 0" }} />
      <div style={{
        position:"absolute", left:22, top:38, width:58, height:68, background:SKIN, borderRadius:"50%",
      }}>
        <div style={{ position:"absolute", left:12, top:24, width:11, height:10, background:EYE, borderRadius:"50%" }} />
        <div style={{ position:"absolute", right:12, top:24, width:11, height:10, background:EYE, borderRadius:"50%" }} />
        <div style={{ position:"absolute", left:16, top:48, width:26, height:8, background:LIP, borderRadius:"0 0 13px 13px", opacity:0.7 }} />
      </div>
      <Zzz x={0} y={0} accent={accent} />
    </div>
  );
}

function Hungry({ accent }: { accent: string }) {
  return (
    <motion.div style={{ position:"absolute", inset:0 }}
      animate={{ y:[0,4,0], rotate:[0,2,0] }} transition={{ duration:4, repeat:Infinity }} >
      <Arm side="L" originX={64} originY={106} shoulder={[22,28,22]} elbow={[-8,0,-8]} shoulderAnim={{duration:4}} skinHand />
      <Arm side="R" originX={114} originY={106} shoulder={[22,28,22]} elbow={[-8,0,-8]} shoulderAnim={{duration:4}} skinHand />
      <Leg side="L" originX={75} originY={220} hip={0} knee={0} />
      <Leg side="R" originX={103} originY={220} hip={0} knee={0} />
      <Torso breathe />
      <Hips />
      <Neck />
      <Hair />
      <Face expr="sleepy" tilt={4} />
    </motion.div>
  );
}

function Chicken({ accent }: { accent: string }) {
  return (
    <>
      <Arm side="L" originX={64} originY={106} shoulder={50} elbow={30} skinHand />
      <Arm side="R" originX={114} originY={106} shoulder={[-120,-130,-120]} elbow={[-28,-38,-28]} shoulderAnim={{duration:1.4}} skinHand />
      <Leg side="L" originX={75} originY={220} hip={0} knee={0} />
      <Leg side="R" originX={103} originY={220} hip={0} knee={0} />
      <Torso />
      <Hips />
      <Neck />
      <Hair />
      <Face expr="focused" tilt={-6} />
      {/* Fork */}
      <motion.div style={{ position:"absolute", zIndex:8, left:118, top:20 }}
        animate={{y:[0,-4,0]}} transition={{duration:1.4,repeat:Infinity,ease:"easeInOut"}}>
        <div style={{width:3,height:28,background:LIME,borderRadius:2,marginLeft:6}} />
        <div style={{display:"flex",gap:5,marginTop:-2}}>
          {[0,1,2].map(i=>(
            <div key={i} style={{width:3,height:16,background:LIME,borderRadius:2}} />
          ))}
        </div>
        <div style={{width:18,height:3,background:LIME,borderRadius:2,marginTop:2}} />
      </motion.div>
    </>
  );
}

function Nap({ accent }: { accent: string }) {
  return (
    <>
      <div style={{ position:"absolute", zIndex:0, left:30, top:230, width:120, height:8, background:"#181816", borderRadius:4 }} />
      <div style={{ position:"absolute", zIndex:0, left:28, top:140, width:6, height:92, background:"#141412", borderRadius:3 }} />
      <motion.div style={{ position:"absolute", inset:0, transformOrigin:"50% 230px" }}
        animate={{ rotate:[0,10,0] }} transition={{ duration:4.5, repeat:Infinity }}>
        <Arm side="L" originX={64} originY={106} shoulder={30} elbow={-10} skinHand />
        <Arm side="R" originX={114} originY={106} shoulder={30} elbow={-10} skinHand />
        <Torso />
        <Hips />
        <Neck />
        <Hair />
        <Face expr="sleepy" tilt={25} />
      </motion.div>
      <Leg side="L" originX={75} originY={228} hip={-88} knee={80} />
      <Leg side="R" originX={103} originY={228} hip={-88} knee={80} />
      <Zzz x={110} y={30} accent={accent} />
    </>
  );
}

function Wake({ accent }: { accent: string }) {
  return (
    <motion.div style={{ position:"absolute", inset:0 }}
      animate={{ rotate:[0,-5,0,-3,0] }} transition={{ duration:5, repeat:Infinity }}>
      <div style={{ position:"absolute", left:0, top:0, width:380, height:180,
        transform:"rotate(-90deg) translateX(-200px)", transformOrigin:"0 0" }}>
        <div style={{ position:"absolute", left:68, top:68, width:180, height:44, background:CLOTH, borderRadius:22 }} />
        <div style={{ position:"absolute", left:78, top:36, width:22, height:72, background:CLOTH, borderRadius:11, transform:"rotate(-25deg)", transformOrigin:"bottom center" }} />
        <div style={{ position:"absolute", left:98, top:30, width:22, height:72, background:CLOTH, borderRadius:11, transform:"rotate(-40deg)", transformOrigin:"bottom center" }} />
        <div style={{ position:"absolute", left:200, top:72, width:80, height:28, background:CLOTH, borderRadius:14, transform:"rotate(14deg)", transformOrigin:"left center" }} />
        <div style={{ position:"absolute", left:8, top:28, width:60, height:16, background:HAIR, borderRadius:"8px 8px 0 0" }} />
        <div style={{ position:"absolute", left:20, top:36, width:56, height:64, background:SKIN, borderRadius:"50%" }}>
          <div style={{ position:"absolute", left:12, top:22, width:10, height:7, background:EYE, borderRadius:3 }} />
          <div style={{ position:"absolute", right:12, top:22, width:10, height:7, background:EYE, borderRadius:3 }} />
          <div style={{ position:"absolute", left:15, top:40, width:26, height:8, background:LIP, borderRadius:"0 0 13px 13px", opacity:0.6 }} />
        </div>
      </div>
    </motion.div>
  );
}

function Ready({ accent }: { accent: string }) {
  return (
    <motion.div style={{ position:"absolute", inset:0 }}
      animate={{ y:[0,-5,0], rotate:[-2,2,-2] }} transition={{ duration:2.8, repeat:Infinity }}>
      <Arm side="L" originX={64} originY={106} shoulder={18} elbow={-55} skinHand />
      <Arm side="R" originX={114} originY={106} shoulder={[-125,-132,-125]} elbow={[30,36,30]} shoulderAnim={{duration:2}} skinHand />
      <Leg side="L" originX={75} originY={220} hip={0} knee={0} />
      <Leg side="R" originX={103} originY={220} hip={0} knee={0} />
      <Torso breathe />
      <Hips />
      <Neck />
      <Hair />
      <Face expr="happy" tilt={8} />
      {(["✦","✧","·"] as const).map((s, i) => (
        <motion.div key={i} style={{
          position:"absolute", zIndex:8,
          left: 122 + i*14, top: 45 + i*18,
          fontSize: 12 + i*4, color:accent, fontFamily:"monospace", fontWeight:"bold",
        }} animate={{opacity:[0,1,0],scale:[0.4,1.8,0.4]}}
          transition={{duration:1.2,repeat:Infinity,delay:i*0.45}}
        >{s}</motion.div>
      ))}
    </motion.div>
  );
}

function Dance({ accent }: { accent: string }) {
  return (
    <motion.div style={{ position:"absolute", inset:0, transformOrigin:"50% 200px" }}
      animate={{ rotate:[-9,9,-9], x:[-7,7,-7] }} transition={{ duration:0.7, repeat:Infinity }}>
      <motion.div style={{ position:"absolute", zIndex:0, left:48, top:0, width:84, height:300, background:accent, borderRadius:"50%", opacity:0.06 }}
        animate={{ scale:[1,1.15,1] }} transition={{ duration:0.7, repeat:Infinity }} />
      <Arm side="L" originX={64} originY={106} shoulder={[-130,-145,-130]} elbow={[22,30,22]} shoulderAnim={{duration:0.7}} skinHand />
      <Arm side="R" originX={114} originY={106} shoulder={[-130,-145,-130]} elbow={[22,30,22]} shoulderAnim={{duration:0.7}} skinHand />
      <motion.div style={{ position:"absolute", left:52, top:216, zIndex:1, transformOrigin:"top center" }}
        animate={{ rotate:[-12,12,-12] }} transition={{ duration:0.7, repeat:Infinity }}>
        <div style={{ width:26, height:88, background:CLOTH, borderRadius:13 }} />
        <div style={{ position:"absolute", left:3, top:72, width:22, height:86, background:CLOTH, borderRadius:11, transformOrigin:"top center", transform:"rotate(0deg)" }}>
          <div style={{ position:"absolute", bottom:-6, left:-4, width:30, height:15, background:CLOTH, borderRadius:"8px 8px 12px 12px" }} />
        </div>
      </motion.div>
      <motion.div style={{ position:"absolute", left:100, top:216, zIndex:1, transformOrigin:"top center" }}
        animate={{ rotate:[12,-12,12] }} transition={{ duration:0.7, repeat:Infinity, delay:0.35 }}>
        <div style={{ width:26, height:88, background:CLOTH, borderRadius:13 }} />
        <div style={{ position:"absolute", left:3, top:72, width:22, height:86, background:CLOTH, borderRadius:11 }}>
          <div style={{ position:"absolute", bottom:-6, left:-4, width:30, height:15, background:CLOTH, borderRadius:"8px 8px 12px 12px" }} />
        </div>
      </motion.div>
      <Torso />
      <Hips />
      <Neck />
      <Hair flying />
      <Face expr="happy" />
      {(["♪","♫","♬"] as const).map((n, i) => (
        <motion.div key={i} style={{
          position:"absolute", zIndex:8,
          left: 125 + i*16, top: 60 + i*22,
          fontSize: 12 + i*3, color:accent, fontFamily:"monospace",
        }} animate={{y:[0,-44],opacity:[1,0]}}
          transition={{duration:1.4,repeat:Infinity,delay:i*0.5,ease:"easeOut"}}
        >{n}</motion.div>
      ))}
    </motion.div>
  );
}

// ─── Pose map ─────────────────────────────────────────────────────────────────
const ACCENT_MAP: Record<RightNowBlock["icon"], string> = {
  night:"#4d9fff", zzz:"#9b7fe8", alarm:"#ff3c78", wave:"#4d9fff",
  fork:"#ff8c42", chicken:"#c8f135", nap:"#9b7fe8", wake:"#ffd60a",
  sparkle:"#c8f135", moon:"#ff3c78",
};

const POSE: Record<RightNowBlock["icon"], React.FC<{accent:string}>> = {
  night:NightPose, zzz:Sleeping, alarm:AlarmPose, wave:Wave,
  fork:Hungry, chicken:Chicken, nap:Nap, wake:Wake,
  sparkle:Ready, moon:Dance,
};

// Fix component names to match exports
function NightPose(p:{accent:string}){return Night(p);}
function AlarmPose(p:{accent:string}){return Alarm(p);}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function PapiyaPuppet({ icon }: { icon: RightNowBlock["icon"] }) {
  const PoseComp = POSE[icon];
  const accent = ACCENT_MAP[icon];

  return (
    <div style={{ position:"relative", width:180, height:380 }}>
      <AnimatePresence mode="wait">
        <motion.div key={icon} style={{ position:"absolute", inset:0 }}
          initial={{ opacity:0, y:16, scale:0.95 }}
          animate={{ opacity:1, y:0, scale:1 }}
          exit={{ opacity:0, y:-10, scale:0.95 }}
          transition={{ duration:0.5, ease:[0.16,1,0.3,1] }}
        >
          <PoseComp accent={accent} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
