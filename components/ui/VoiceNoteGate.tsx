"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IDENTITY_QUIZ, QUIZ_WRONG_LINES, QUIZ_DENIED } from "@/lib/data";

// Fisher–Yates. Runtime-only (browser), so Math.random is fine here.
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const fmt = (s: number) =>
  `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export default function VoiceNoteGate() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [unlocked, setUnlocked] = useState(false);

  // Quiz state
  const [quizOpen, setQuizOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [round, setRound] = useState(0);      // bump to reshuffle on replay
  const [feedback, setFeedback] = useState<string | null>(null);
  const [denied, setDenied] = useState(false);

  // Player state
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  // "Backend" control: ?unlock (or #unlock) in the URL bypasses the quiz.
  useEffect(() => {
    const u = window.location.search + window.location.hash;
    if (/unlock/i.test(u)) setUnlocked(true);
  }, []);

  const play = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) { a.play(); setPlaying(true); }
    else { a.pause(); setPlaying(false); }
  }, []);

  const onPillClick = useCallback(() => {
    if (unlocked) { play(); return; }
    setQuizOpen(true);
    setStep(0);
    setDenied(false);
    setFeedback(null);
    setRound((r) => r + 1);
  }, [unlocked, play]);

  const answer = () => {
    // Every answer is wrong by design.
    const line = QUIZ_WRONG_LINES[Math.floor(Math.random() * QUIZ_WRONG_LINES.length)];
    setFeedback(line);
  };

  const next = () => {
    setFeedback(null);
    if (step < IDENTITY_QUIZ.length - 1) setStep((s) => s + 1);
    else setDenied(true);
  };

  const retry = () => {
    setDenied(false);
    setFeedback(null);
    setStep(0);
    setRound((r) => r + 1);
  };

  const q = IDENTITY_QUIZ[step];
  // Reshuffle whenever the question OR round changes → can't be memorised.
  const options = useMemo(() => shuffle(q.options), [step, round, q.options]);

  return (
    <>
      {/* ── Floating pill ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="fixed bottom-6 left-6 z-40 flex items-center gap-3 rounded-full border border-border
          bg-bg-glass backdrop-blur-sm px-4 py-2.5 hover:border-accent-lime transition-colors duration-300 group"
      >
        <button
          onClick={unlocked ? play : onPillClick}
          aria-label={
            unlocked ? (playing ? "Pause voice note" : "Play voice note from Jeemut") : "Unlock voice note"
          }
          className="flex items-center cursor-pointer"
        >
          {unlocked && playing ? (
            <span className="flex items-end gap-[3px] h-4">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-[3px] bg-accent-lime rounded-full"
                  animate={{ height: ["4px", "16px", "8px", "14px", "6px"] }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                />
              ))}
            </span>
          ) : (
            <span className="text-accent-lime text-xs">{unlocked ? "▶" : "🔒"}</span>
          )}
        </button>

        {unlocked && playing ? (
          <div className="flex items-center gap-2.5">
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={current}
              onChange={(e) => {
                const t = Number(e.target.value);
                if (audioRef.current) audioRef.current.currentTime = t;
                setCurrent(t);
              }}
              aria-label="Seek voice note"
              className="w-28 h-1 cursor-pointer"
              style={{ accentColor: "#c8f135" }}
            />
            <span className="font-mono text-[10px] text-ink-secondary tabular-nums shrink-0">
              {fmt(current)} / {fmt(duration)}
            </span>
          </div>
        ) : (
          <button
            onClick={onPillClick}
            className="font-mono text-[10px] text-ink-secondary group-hover:text-accent-lime tracking-widest uppercase transition-colors duration-300 cursor-pointer"
          >
            {unlocked ? "▷ A MESSAGE FROM JEEMUT" : "▷ A MESSAGE FROM JEEMUT · LOCKED"}
          </button>
        )}

        <audio
          ref={audioRef}
          src="/voice-note.m4a"
          preload="none"
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
          onEnded={() => setPlaying(false)}
        />
      </motion.div>

      {/* ── Quiz modal ── */}
      <AnimatePresence>
        {quizOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-bg-base/92 backdrop-blur-md p-6"
            onClick={() => setQuizOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.96, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-lg bg-bg-surface border border-border-strong rounded-sm p-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-accent-lime" />

              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="font-mono text-[10px] text-accent-lime tracking-widest uppercase mb-2">
                    // IDENTITY VERIFICATION
                  </p>
                  <h3 className="font-sans text-lg font-bold text-ink-primary leading-tight">
                    PROVE YOU ARE PAPIYA
                  </h3>
                </div>
                <button
                  onClick={() => setQuizOpen(false)}
                  className="font-mono text-xs text-ink-muted hover:text-ink-primary transition-colors duration-200 mt-1"
                >
                  [ CLOSE ]
                </button>
              </div>

              {denied ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-4"
                >
                  <p className="font-mono text-2xl font-bold text-accent-pink tracking-widest mb-4">
                    ⚠ {QUIZ_DENIED.title}
                  </p>
                  <p className="font-sans text-sm text-ink-secondary leading-relaxed mb-8">
                    {QUIZ_DENIED.body}
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={retry}
                      className="border border-border px-5 py-2.5 text-xs font-mono tracking-widest uppercase
                        text-ink-secondary hover:border-accent-lime hover:text-accent-lime transition-colors duration-300"
                    >
                      [ TRY AGAIN ]
                    </button>
                    <button
                      onClick={() => setQuizOpen(false)}
                      className="px-5 py-2.5 text-xs font-mono tracking-widest uppercase text-ink-muted hover:text-ink-primary transition-colors duration-300"
                    >
                      [ GIVE UP ]
                    </button>
                  </div>
                </motion.div>
              ) : (
                <>
                  {/* progress */}
                  <div className="flex gap-1.5 mb-6">
                    {IDENTITY_QUIZ.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                          i < step ? "bg-accent-lime/40" : i === step ? "bg-accent-lime" : "bg-border-dim"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="font-mono text-[10px] text-ink-muted tracking-widest uppercase mb-2">
                    QUESTION {step + 1} / {IDENTITY_QUIZ.length}
                  </p>
                  <p className="font-sans text-base text-ink-primary leading-snug mb-5">{q.question}</p>

                  <AnimatePresence mode="wait">
                    {feedback ? (
                      <motion.div
                        key="fb"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="bg-accent-pink/5 border border-accent-pink/20 rounded-sm p-5 mb-5">
                          <p className="font-mono text-sm text-accent-pink tracking-wide leading-relaxed">
                            {feedback}
                          </p>
                        </div>
                        <button
                          onClick={next}
                          className="w-full border border-border px-5 py-3 text-xs font-mono tracking-widest uppercase
                            text-ink-secondary hover:border-accent-lime hover:text-accent-lime transition-colors duration-300"
                        >
                          {step < IDENTITY_QUIZ.length - 1 ? "[ NEXT QUESTION → ]" : "[ SEE RESULT → ]"}
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key={`opts-${step}-${round}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-2.5"
                      >
                        {options.map((opt) => (
                          <button
                            key={opt}
                            onClick={answer}
                            className="w-full text-left bg-bg-elevated border border-border rounded-sm px-4 py-3
                              font-sans text-sm text-ink-primary leading-snug
                              hover:border-accent-lime/50 hover:text-accent-lime transition-colors duration-200"
                          >
                            {opt}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
