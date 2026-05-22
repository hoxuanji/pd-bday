"use client";

import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface ModuleCardProps {
  children: ReactNode;
  className?: string;
  accent?: boolean;
  id?: string;
}

export default function ModuleCard({ children, className, accent, id }: ModuleCardProps) {
  return (
    <div
      id={id}
      className={cn(
        "relative bg-bg-surface border border-border rounded-sm overflow-hidden",
        accent && "border-accent-lime/20",
        className
      )}
    >
      {children}
    </div>
  );
}

interface ModuleHeaderProps {
  index?: string;
  label: string;
  sub?: string;
  className?: string;
}

export function ModuleHeader({ index, label, sub, className }: ModuleHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4 pb-4 border-b border-border mb-6", className)}>
      <div>
        {index && (
          <p className="font-mono text-[10px] text-ink-muted tracking-widest mb-1 uppercase">
            {index}
          </p>
        )}
        <h2 className="font-sans font-semibold text-sm tracking-widest uppercase text-ink-primary">
          {label}
        </h2>
        {sub && (
          <p className="font-mono text-xs text-ink-secondary mt-1">{sub}</p>
        )}
      </div>
    </div>
  );
}

export function StatusPill({
  label,
  status,
}: {
  label: string;
  status: "ok" | "warn" | "crit" | "active";
}) {
  const styles = {
    ok: "text-accent-lime border-accent-lime/30",
    warn: "text-accent-orange border-accent-orange/30",
    crit: "text-accent-pink border-accent-pink/30",
    active: "text-accent-blue border-accent-blue/30",
  };
  return (
    <span
      className={cn(
        "font-mono text-[10px] tracking-widest border px-2 py-0.5 rounded-sm uppercase",
        styles[status]
      )}
    >
      {label}
    </span>
  );
}
