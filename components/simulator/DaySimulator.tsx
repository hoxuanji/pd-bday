"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  SIMULATOR_STEPS,
  getSimulatorOutcome,
  type SimulatorChoice,
} from "@/lib/data";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { slideUp, scaleIn } from "@/lib/motion";
import GlitchText from "@/components/ui/GlitchText";
import MagneticButton from "@/components/ui/MagneticButton";

type Stats = { chaos: number; drama: number; food: number; sleep: number };

const STAT_LABELS: Record<keyof Stats, string> = {
  chaos: "CHAOS",
  drama: "DRAMA",
  food: "FOOD REGRET",
  sleep: "SLEEP DEBT",
};

const STAT_COLORS: Record<keyof Stats, string> = {
  chaos: "text-accent-orange",
  drama: "text-accent-pink",
  food: "text-accent-lime",
  sleep: "text-accent-blue",
};

const PHASE_COLORS = {
  morning: "text-accent-yellow",
  afternoon: "text-accent-lime",
  evening: "text-accent-pink",
};

export default function DaySimulator() {
  const { ref, isInView } = useScrollReveal();
  const [stepIndex, setStepIndex] = useState(0);
  const [stats, setStats] = useState<Stats>({ chaos: 20, drama: 15, food: 10, sleep: 20 });
  const [reaction, setReaction] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<ReturnType<typeof getSimulatorOutcome> | null>(null);
  const [choiceMade, setChoiceMade] = useState(false);

  function applyChoice(choice: SimulatorChoice) {
    if (choiceMade) return;
    setChoiceMade(true);
    setReaction(choice.reaction);

    const newStats = { ...stats };
    for (const [k, v] of Object.entries(choice.effect) as [keyof Stats, number][]) {
      newStats[k] = Math.max(0, Math.min(100, newStats[k] + v));
    }
    setStats(newStats);

    setTimeout(() => {
      if (stepIndex < SIMULATOR_STEPS.length - 1) {
        setStepIndex((n) => n + 1);
        setReaction(null);
        setChoiceMade(false);
      } else {
        setOutcome(getSimulatorOutcome(newStats));
      }
    }, 2200);
  }

  function reset() {
    setStepIndex(0);
    setStats({ chaos: 20, drama: 15, food: 10, sleep: 20 });
    setReaction(null);
    setOutcome(null);
    setChoiceMade(false);
  }

  const currentStep = SIMULATOR_STEPS[stepIndex];
  const progress = ((stepIndex) / SIMULATOR_STEPS.length) * 100;

  return (
    <section
      id="simulator"
      className="min-h-screen px-6 md:px-12 py-section relative bg-bg-base"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="font-mono text-[10px] text-ink-muted tracking-widest uppercase mb-2">
            SEC_04 // INTERACTIVE SIMULATION
          </p>
          <GlitchText
            text="BE HER FOR A DAY"
            className="text-display-xl font-sans font-bold text-ink-primary leading-none"
            as="h2"
          />
          <p className="font-mono text-xs text-ink-secondary mt-3">
            MAKE THE DECISIONS. FACE THE CONSEQUENCES. NO REFUNDS.
          </p>
          <div className="h-px bg-border mt-6" />
        </motion.div>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main simulator area */}
          <div className="lg:col-span-2">
            {/* Progress bar */}
            {!outcome && (
              <div className="mb-6">
                <div className="flex justify-between font-mono text-[10px] text-ink-muted tracking-widest mb-2">
                  <span>PROGRESS</span>
                  <span>{stepIndex}/{SIMULATOR_STEPS.length} DECISIONS</span>
                </div>
                <div className="h-0.5 bg-border-dim overflow-hidden">
                  <motion.div
                    className="h-full bg-accent-lime"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  {SIMULATOR_STEPS.map((s, i) => (
                    <div
                      key={s.id}
                      className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
                        i < stepIndex
                          ? "bg-accent-lime"
                          : i === stepIndex
                          ? "bg-accent-lime/40"
                          : "bg-border-dim"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            <AnimatePresence mode="wait">
              {outcome ? (
                <OutcomeCard key="outcome" outcome={outcome} stats={stats} onReset={reset} />
              ) : (
                <motion.div
                  key={`step-${stepIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Phase label */}
                  <p
                    className={`font-mono text-[10px] tracking-widest uppercase mb-2 ${
                      PHASE_COLORS[currentStep.phase]
                    }`}
                  >
                    {currentStep.phase} · {currentStep.situation}
                  </p>

                  {/* Situation card */}
                  <div className="bg-bg-surface border border-border rounded-sm p-6 mb-4">
                    <p className="font-sans text-base text-ink-primary leading-relaxed">
                      {currentStep.context}
                    </p>
                  </div>

                  {/* Reaction overlay */}
                  <AnimatePresence>
                    {reaction && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-bg-elevated border border-accent-lime/20 rounded-sm p-5 mb-4"
                      >
                        <p className="font-mono text-[10px] text-accent-lime tracking-widest mb-2 uppercase">
                          // OUTCOME
                        </p>
                        <p className="font-sans text-sm text-ink-primary leading-relaxed">
                          {reaction}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Choices */}
                  {!reaction && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentStep.choices.map((choice) => (
                        <ChoiceButton
                          key={choice.id}
                          choice={choice}
                          onClick={() => applyChoice(choice)}
                          disabled={choiceMade}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Stats sidebar */}
          <div className="bg-bg-surface border border-border rounded-sm p-5 h-fit">
            <p className="font-mono text-[10px] text-ink-muted tracking-widest uppercase mb-4">
              LIVE STATS
            </p>
            <div className="space-y-4">
              {(Object.keys(STAT_LABELS) as (keyof Stats)[]).map((k) => (
                <div key={k}>
                  <div className="flex justify-between mb-1">
                    <span className="font-mono text-[10px] text-ink-secondary tracking-widest uppercase">
                      {STAT_LABELS[k]}
                    </span>
                    <span className={`font-mono text-[10px] tabular-nums ${STAT_COLORS[k]}`}>
                      {stats[k]}%
                    </span>
                  </div>
                  <div className="h-0.5 bg-border-dim overflow-hidden rounded-full">
                    <motion.div
                      className={`h-full rounded-full ${
                        k === "chaos"
                          ? "bg-accent-orange"
                          : k === "drama"
                          ? "bg-accent-pink"
                          : k === "food"
                          ? "bg-accent-lime"
                          : "bg-accent-blue"
                      }`}
                      animate={{ width: `${stats[k]}%` }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="h-px bg-border mt-6 mb-4" />
            <p className="font-mono text-[9px] text-ink-muted leading-relaxed">
              VALUES UPDATE IN REAL-TIME BASED ON YOUR CHOICES. THERE IS NO OPTIMAL STRATEGY.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChoiceButton({
  choice,
  onClick,
  disabled,
}: {
  choice: SimulatorChoice;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <MagneticButton
      onClick={onClick}
      disabled={disabled}
      className="w-full text-left bg-bg-elevated border border-border rounded-sm p-4
        hover:border-accent-lime/40 hover:bg-bg-elevated
        transition-colors duration-200 group"
    >
      <div>
        <p className="font-sans text-sm text-ink-primary leading-snug group-hover:text-accent-lime transition-colors duration-200">
          {choice.text}
        </p>
        <div className="flex gap-2 mt-2 flex-wrap">
          {(Object.entries(choice.effect) as [string, number][]).map(([k, v]) => (
            <span
              key={k}
              className={`font-mono text-[9px] tracking-widest ${
                v > 0 ? "text-accent-orange" : "text-accent-lime"
              }`}
            >
              {k.toUpperCase()} {v > 0 ? `+${v}` : v}
            </span>
          ))}
        </div>
      </div>
    </MagneticButton>
  );
}

function OutcomeCard({
  outcome,
  stats,
  onReset,
}: {
  outcome: ReturnType<typeof getSimulatorOutcome>;
  stats: Stats;
  onReset: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="bg-bg-surface border border-accent-lime/20 rounded-sm p-8"
    >
      <p className="font-mono text-[10px] text-accent-lime tracking-widest uppercase mb-2">
        // SIMULATION COMPLETE
      </p>
      <h3 className="font-sans text-2xl font-bold text-ink-primary mb-4">
        {outcome.title}
      </h3>
      <p className="font-sans text-sm text-ink-secondary leading-relaxed mb-6">
        {outcome.description}
      </p>
      <p className="font-mono text-[10px] text-ink-muted tracking-wide mb-6">
        {outcome.stats}
      </p>
      <MagneticButton
        onClick={onReset}
        className="border border-border px-5 py-2.5 text-xs font-mono tracking-widest
          uppercase text-ink-secondary hover:border-accent-lime hover:text-accent-lime
          transition-colors duration-300"
      >
        [ RUN AGAIN ]
      </MagneticButton>
    </motion.div>
  );
}
