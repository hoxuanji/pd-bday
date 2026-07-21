"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { MEMORY_VAULT, type MemoryCard, type MemoryCardType } from "@/lib/data";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { staggerContainer, slideUp } from "@/lib/motion";
import GlitchText from "@/components/ui/GlitchText";

const TYPE_ICONS: Record<MemoryCardType, string> = {
  memory: "◈",
  classified: "⬛",
  audio: "◉",
  photo: "▣",
};

const TYPE_LABELS: Record<MemoryCardType, string> = {
  memory: "MEMORY LOG",
  classified: "CLASSIFIED",
  audio: "AUDIO LOG",
  photo: "PHOTO",
};

const TYPE_COLORS: Record<MemoryCardType, string> = {
  memory: "text-accent-blue",
  classified: "text-accent-pink",
  audio: "text-accent-orange",
  photo: "text-accent-lime",
};

export default function MemoryVault() {
  const { ref, isInView } = useScrollReveal();
  const [activeCard, setActiveCard] = useState<MemoryCard | null>(null);

  return (
    <section
      id="vault"
      className="min-h-screen px-6 md:px-12 py-section relative bg-bg-surface/20"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="font-mono text-[10px] text-ink-muted tracking-widest uppercase mb-2">
            SEC_05 // MEMORY VAULT
          </p>
          <GlitchText
            text="ARCHIVE SYSTEM"
            className="text-display-xl font-sans font-bold text-ink-primary leading-none"
            as="h2"
          />
          <p className="font-mono text-xs text-ink-secondary mt-3">
            HOVER TO PREVIEW · CLICK TO ACCESS · SOME FILES MAY BE SENSITIVE
          </p>
          <div className="h-px bg-border mt-6" />
        </motion.div>

        {/* Card grid */}
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {MEMORY_VAULT.map((card, i) => (
            <VaultCard
              key={card.id}
              card={card}
              index={i}
              onClick={() => setActiveCard(card)}
            />
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="font-mono text-[10px] text-ink-muted mt-8 tracking-wide"
        >
          VAULT INTEGRITY: 94.2% · 2 FILES PENDING DECLASSIFICATION
        </motion.p>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {activeCard && (
          <MemoryModal card={activeCard} onClose={() => setActiveCard(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

function VaultCard({
  card,
  index,
  onClick,
}: {
  card: MemoryCard;
  index: number;
  onClick: () => void;
}) {
  const isLarge = card.size === "large";
  const typeColor = TYPE_COLORS[card.type];
  const typeIcon = TYPE_ICONS[card.type];
  const isClassified = card.type === "classified";

  return (
    <motion.div
      variants={slideUp}
      onClick={onClick}
      className={`group relative bg-bg-surface border border-border rounded-sm p-5 cursor-pointer
        hover:border-border-strong transition-all duration-300 overflow-hidden
        ${isLarge ? "sm:col-span-2" : ""}`}
    >
      {/* Type stripe */}
      <div className={`absolute top-0 left-0 right-0 h-px ${typeColor.replace("text-", "bg-")}`} />

      {/* Classified watermark */}
      {isClassified && (
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none select-none">
          <span className="font-mono text-6xl font-bold text-accent-pink rotate-[-20deg] tracking-widest">
            CLASSIFIED
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <span className={`font-mono text-xs ${typeColor}`}>{typeIcon}</span>
        <span className={`font-mono text-[9px] tracking-widest uppercase ${typeColor}`}>
          {TYPE_LABELS[card.type]}
        </span>
      </div>

      {/* Index */}
      <p className="font-mono text-[9px] text-ink-muted tracking-widest mb-2">
        {String(index + 1).padStart(3, "0")} · {card.date}
      </p>

      {/* Title */}
      <h3 className="font-sans text-sm font-semibold text-ink-primary tracking-tight mb-3 leading-snug">
        {card.title}
      </h3>

      {/* Preview */}
      <p className="font-mono text-[11px] text-ink-secondary leading-relaxed">
        {card.preview}
      </p>

      {/* Tag */}
      <p
        className={`font-mono text-[9px] tracking-widest mt-4 uppercase ${typeColor} opacity-60
          group-hover:opacity-100 transition-opacity duration-300`}
      >
        {card.tag}
      </p>

      {/* Hover access prompt */}
      <div className="absolute bottom-4 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="font-mono text-[9px] text-ink-muted tracking-widest">
          {card.image ? "[ ◉ PHOTO ]" : "[ ACCESS ]"}
        </span>
      </div>
    </motion.div>
  );
}

function MemoryModal({
  card,
  onClose,
}: {
  card: MemoryCard;
  onClose: () => void;
}) {
  const typeColor = TYPE_COLORS[card.type];
  const isClassified = card.type === "classified";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-base/90 backdrop-blur-sm p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg bg-bg-surface border border-border-strong rounded-sm p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent */}
        <div className={`absolute top-0 left-0 right-0 h-px ${typeColor.replace("text-", "bg-")}`} />

        <div className="flex items-start justify-between mb-6">
          <div>
            <p className={`font-mono text-[10px] tracking-widest uppercase mb-2 ${typeColor}`}>
              {TYPE_LABELS[card.type]} · {card.date}
            </p>
            <h3 className="font-sans text-xl font-bold text-ink-primary">{card.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="font-mono text-xs text-ink-muted hover:text-ink-primary transition-colors duration-200 mt-1"
          >
            [ CLOSE ]
          </button>
        </div>

        {isClassified && (
          <div className="bg-accent-pink/5 border border-accent-pink/20 rounded-sm px-3 py-2 mb-4">
            <p className="font-mono text-[10px] text-accent-pink tracking-widest">
              ⚠ CLASSIFIED — AUTHORISED ACCESS ONLY
            </p>
          </div>
        )}

        {card.image && (
          <img
            src={card.image}
            alt={`Papiya — ${card.title.toLowerCase()}`}
            className="w-full aspect-[4/3] object-cover rounded-sm mb-4 border border-border"
          />
        )}

        <div className="bg-bg-base rounded-sm p-5">
          <p className="font-mono text-xs text-ink-secondary leading-relaxed">{card.full}</p>
        </div>

        <p className={`font-mono text-[9px] tracking-widest mt-4 uppercase opacity-60 ${typeColor}`}>
          {card.tag}
        </p>
      </motion.div>
    </motion.div>
  );
}
