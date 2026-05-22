"use client";

import { useInView } from "framer-motion";
import { useRef } from "react";

export function useScrollReveal(options?: { once?: boolean; amount?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: options?.once ?? true,
    amount: options?.amount ?? 0.15,
  });
  return { ref, isInView };
}
