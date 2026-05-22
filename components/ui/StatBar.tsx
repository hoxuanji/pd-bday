"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ACCENT_COLORS, type AccentColor } from "@/lib/utils";

interface StatBarProps {
  value: number; // 0–100
  color?: AccentColor;
  animate?: boolean;
  height?: "sm" | "md" | "lg";
  showValue?: boolean;
  delay?: number;
}

const heightMap = { sm: "h-0.5", md: "h-1", lg: "h-1.5" };

export default function StatBar({
  value,
  color = "lime",
  animate = true,
  height = "md",
  showValue = false,
  delay = 0,
}: StatBarProps) {
  const prefersReduced = useReducedMotion();
  const accent = ACCENT_COLORS[color];
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div className="flex items-center gap-3 w-full">
      <div className={cn("flex-1 bg-border-dim rounded-full overflow-hidden", heightMap[height])}>
        <motion.div
          className={cn("h-full rounded-full", accent.bg)}
          initial={{ scaleX: 0, originX: 0 }}
          animate={animate ? { scaleX: clampedValue / 100 } : { scaleX: 0 }}
          transition={{
            duration: prefersReduced ? 0 : 1.2,
            ease: [0.16, 1, 0.3, 1],
            delay: prefersReduced ? 0 : delay,
          }}
        />
      </div>
      {showValue && (
        <span className={cn("font-mono text-xs tabular-nums w-8 text-right", accent.text)}>
          {clampedValue}
        </span>
      )}
    </div>
  );
}
