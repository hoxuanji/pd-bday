"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { BIRTHDAY_MESSAGE, SUBJECT } from "@/lib/data";
import GlitchText from "@/components/ui/GlitchText";
import MagneticButton from "@/components/ui/MagneticButton";

// ─── Confetti ─────────────────────────────────────────────────────────────────

type Particle = {
  x: number; y: number; vx: number; vy: number;
  color: string; w: number; h: number; rotation: number; rotSpeed: number; life: number;
};

const COLORS = ["#c8f135", "#ff3c78", "#4d9fff", "#ff8c42", "#ffd60a", "#f2f2ef", "#ffffff"];

function useConfetti(active: boolean) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!active || prefersReduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);

    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;

    for (let burst = 0; burst < 2; burst++) {
      const ox = burst === 0 ? W * 0.3 : W * 0.7;
      for (let i = 0; i < 90; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.4;
        const speed = Math.random() * 14 + 6;
        particles.current.push({
          x: ox, y: H * 0.42,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          w: Math.random() * 10 + 5,
          h: Math.random() * 5 + 3,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.25,
          life: 1,
        });
      }
    }

    function tick() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      particles.current = particles.current.filter((p) => p.life > 0.02);
      for (const p of particles.current) {
        p.x += p.vx; p.y += p.vy;
        p.vy += 0.35; p.vx *= 0.99;
        p.rotation += p.rotSpeed; p.life -= 0.007;
        ctx.save();
        ctx.globalAlpha = Math.min(p.life * 2, 1);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (particles.current.length > 0) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, prefersReduced]);

  return canvasRef;
}

// ─── Kinetic letter word ──────────────────────────────────────────────────────

function KineticWord({
  word, from, baseDelay, letterClassName,
}: {
  word: string;
  from: "top" | "bottom";
  baseDelay: number;
  letterClassName?: string;
}) {
  const dir = from === "top" ? -1 : 1;
  return (
    <div className="flex items-center justify-center">
      {word.split("").map((letter, i) => (
        <motion.span
          key={i}
          initial={{ y: dir * 90, opacity: 0, rotate: (i - Math.floor(word.length / 2)) * 9 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 240, damping: 17, delay: baseDelay + i * 0.055 }}
          className={`inline-block select-none font-sans font-bold leading-none ${letterClassName ?? ""}`}
          style={{ letterSpacing: "-0.02em" }}
        >
          {letter}
        </motion.span>
      ))}
    </div>
  );
}

// ─── Birthday Wish full-screen overlay ───────────────────────────────────────

function BirthdayWish({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3600);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-40 flex flex-col items-center justify-center overflow-hidden bg-bg-base"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Growing lime glow behind PAPIYA */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 50% 52%, rgba(200,241,53,0.08) 0%, transparent 100%)",
        }}
      />

      {/* Corner sparks */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-accent-lime"
          style={{ top: i < 2 ? "12%" : "88%", left: i % 2 === 0 ? "10%" : "90%" }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 4, 0], opacity: [0, 1, 0] }}
          transition={{ delay: 1.4 + i * 0.1, duration: 0.55 }}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center gap-1 px-4 w-full">
        {/* HAPPY */}
        <KineticWord
          word="HAPPY"
          from="top"
          baseDelay={0.1}
          letterClassName="text-ink-primary"
        />

        {/* BIRTHDAY */}
        <KineticWord
          word="BIRTHDAY"
          from="bottom"
          baseDelay={0.35}
          letterClassName="text-ink-primary"
        />

        {/* PAPIYA — massive lime */}
        <motion.div
          className="mt-1"
          initial={{ scale: 0.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 140, damping: 9, delay: 1.3 }}
        >
          <span
            className="font-sans font-bold text-accent-lime select-none block text-center"
            style={{ fontSize: "clamp(4.5rem, 18vw, 13rem)", letterSpacing: "-0.04em", lineHeight: 0.88 }}
          >
            PAPIYA
          </span>
        </motion.div>

        <motion.p
          className="font-mono text-sm text-ink-muted tracking-widest mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
        >
          27 TODAY &nbsp;·&nbsp; 22 MAY 2026
        </motion.p>
      </div>

      {/* Skip — appears after 1s */}
      <motion.button
        className="absolute bottom-8 right-8 font-mono text-[10px] text-ink-muted tracking-widest
          hover:text-ink-secondary transition-colors duration-200 cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={onDone}
      >
        SKIP →
      </motion.button>

      {/* Letter sizing via inline style since we need responsive clamp */}
      <style>{`
        .kinetic-letter { font-size: clamp(2.2rem, 8.5vw, 7rem); }
      `}</style>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

type Phase = "idle" | "wish" | "lines" | "final" | "confetti";

export default function BirthdayEnding() {
  const sectionRef = useRef<HTMLElement>(null);
  const triggered = useRef(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [visibleLines, setVisibleLines] = useState(0);
  const canvasRef = useConfetti(phase === "confetti");

  // Trigger as soon as ANY pixel of the section enters the viewport.
  // Also fires if user is within 120px of the bottom of the page (handles
  // the case where there is no more scroll room and the section is the last one).
  useEffect(() => {
    function fire() {
      if (triggered.current) return;
      triggered.current = true;
      setPhase("wish");
    }

    // IntersectionObserver with threshold 0
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) fire(); },
      { threshold: 0, rootMargin: "0px 0px -1px 0px" }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);

    // Scroll-near-bottom fallback
    function onScroll() {
      const scrollBottom = window.scrollY + window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      if (scrollBottom >= docHeight - 120) fire();
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // check immediately in case already at bottom

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleWishDone = useCallback(() => setPhase("lines"), []);

  // Lines appear one by one
  useEffect(() => {
    if (phase !== "lines") return;
    if (visibleLines >= BIRTHDAY_MESSAGE.lines.length) {
      const t = setTimeout(() => setPhase("final"), 600);
      return () => clearTimeout(t);
    }
    const isBlank = BIRTHDAY_MESSAGE.lines[visibleLines] === "";
    const t = setTimeout(() => setVisibleLines((n) => n + 1), isBlank ? 220 : 380);
    return () => clearTimeout(t);
  }, [phase, visibleLines]);

  // final → confetti
  useEffect(() => {
    if (phase !== "final") return;
    const t = setTimeout(() => setPhase("confetti"), 800);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <section
      id="ending"
      ref={sectionRef}
      // Extra bottom padding ensures user can always scroll this section into view
      className="min-h-screen px-6 md:px-12 pt-section pb-32 relative overflow-hidden"
      style={{
        background:
          phase === "final" || phase === "confetti"
            ? "radial-gradient(ellipse at 50% 60%, #0f0c07 0%, #070706 65%)"
            : "#070706",
        transition: "background 2.5s ease",
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        aria-hidden
      />

      <AnimatePresence>
        {phase === "wish" && <BirthdayWish key="wish" onDone={handleWishDone} />}
      </AnimatePresence>

      <div className="max-w-3xl mx-auto relative z-20">
        {/* Section header — visible while idle */}
        <div className="mb-16">
          <p className="font-mono text-[10px] text-ink-muted tracking-widest uppercase mb-2">
            SEC_08 // FINAL SEQUENCE
          </p>
          <div className="h-px bg-border" />
        </div>

        {/* Message lines */}
        {(phase === "lines" || phase === "final" || phase === "confetti") && (
          <div className="space-y-2 mb-16">
            {BIRTHDAY_MESSAGE.lines.slice(0, visibleLines).map((line, i) =>
              line === "" ? (
                <div key={i} className="h-4" />
              ) : (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="font-sans text-base md:text-lg text-ink-primary leading-relaxed"
                >
                  {line}
                </motion.p>
              )
            )}
          </div>
        )}

        {/* Final reveal */}
        <AnimatePresence>
          {(phase === "final" || phase === "confetti") && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <div className="h-px bg-border mb-12" />

              <motion.div
                initial={{ scale: 0.94 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="font-mono text-[10px] text-ink-muted tracking-widest uppercase mb-4">
                  HAPPY BIRTHDAY
                </p>
                <GlitchText
                  text={SUBJECT.name}
                  as="h1"
                  className="font-sans font-bold text-accent-lime leading-none block"
                  style={{ fontSize: "clamp(5rem, 20vw, 14rem)", letterSpacing: "-0.04em" }}
                  trigger={phase === "confetti"}
                  delay={300}
                />
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="font-mono text-xs text-ink-secondary tracking-widest mt-6"
                >
                  22.05.1999 → {new Date().getFullYear()} &nbsp;·&nbsp; YEAR {SUBJECT.age}
                </motion.p>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="font-sans text-sm text-ink-secondary mt-10 italic"
              >
                {BIRTHDAY_MESSAGE.closing}
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
                className="mt-10"
              >
                <MagneticButton
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="border border-border px-6 py-3 text-xs font-mono tracking-widest
                    uppercase text-ink-secondary hover:border-accent-lime hover:text-accent-lime
                    transition-colors duration-300"
                >
                  [ RESTART EXPERIENCE ]
                </MagneticButton>
              </motion.div>

              <p className="font-mono text-[9px] text-ink-muted mt-8 tracking-widest">
                PD-OS v27.0 · SESSION COMPLETE · RUNTIME: {SUBJECT.age}Y · SHRINJAYEE_DAS: BLOCKED
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
