"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import React from "react";
import type { RightNowBlock } from "@/lib/data";

// Maps each hour block to a filename in /public/lottie/
// Drop the matching .json from LottieFiles into public/lottie/ and it goes live
const LOTTIE_FILES: Record<RightNowBlock["icon"], string> = {
  night:   "/lottie/night.json",
  zzz:     "/lottie/sleep.json",
  alarm:   "/lottie/alarm.json",
  wave:    "/lottie/phone.json",
  fork:    "/lottie/hungry.json",
  chicken: "/lottie/eating.json",
  nap:     "/lottie/nap.json",
  wake:    "/lottie/wake.json",
  sparkle: "/lottie/ready.json",
  moon:    "/lottie/dance.json",
};

// Fallback placeholder shown when the .json hasn't been downloaded yet
function Placeholder({ label }: { label: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 opacity-30">
      <p className="font-mono text-[10px] text-ink-muted tracking-widest text-center uppercase">
        Drop Lottie file into
      </p>
      <p className="font-mono text-xs text-ink-secondary tracking-widest text-center">
        public/lottie/{LOTTIE_FILES[label as RightNowBlock["icon"]]?.split("/").pop()}
      </p>
    </div>
  );
}

interface Props {
  icon: RightNowBlock["icon"];
  speed?: number;
}

export default function LottieCharacter({ icon, speed = 1 }: Props) {
  const [exists, setExists] = useState(false);
  const [checked, setChecked] = useState(false);
  const src = LOTTIE_FILES[icon];

  // Check if the file exists in public/
  useEffect(() => {
    setChecked(false);
    fetch(src, { method: "HEAD" })
      .then(r => { setExists(r.ok); setChecked(true); })
      .catch(() => { setExists(false); setChecked(true); });
  }, [src]);

  if (!checked) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={icon}
        className="w-full h-full"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {exists ? (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (React.createElement as any)("lottie-player", {
            src,
            background: "transparent",
            speed: String(speed),
            loop: true,
            autoplay: true,
            style: { width: "100%", height: "100%" },
          })
        ) : (
          <Placeholder label={icon} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
