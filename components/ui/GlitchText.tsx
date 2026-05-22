"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&";

interface GlitchTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  trigger?: boolean;
  delay?: number;
}

export default function GlitchText({
  text,
  className,
  style,
  as: Tag = "span",
  trigger = true,
  delay = 0,
}: GlitchTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [glitching, setGlitching] = useState(false);
  const prefersReduced = useReducedMotion();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function scramble() {
    if (prefersReduced) return;
    let frame = 0;
    const totalFrames = 18;
    setGlitching(true);

    timerRef.current = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i < Math.floor((frame / totalFrames) * text.length)) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );
      frame++;
      if (frame >= totalFrames) {
        clearInterval(timerRef.current!);
        setDisplayText(text);
        setGlitching(false);
      }
    }, 30);
  }

  useEffect(() => {
    if (!trigger) return;
    const t = setTimeout(scramble, delay);
    return () => {
      clearTimeout(t);
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, text, delay]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <Tag
      className={cn("cursor-default select-none", className)}
      style={style}
      onMouseEnter={scramble}
      data-glitching={glitching}
    >
      {displayText}
    </Tag>
  );
}
