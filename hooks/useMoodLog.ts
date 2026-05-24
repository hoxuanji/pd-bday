"use client";

import { useEffect, useState } from "react";
import type { MoodId } from "@/lib/data";

const KEY = "papiya_mood_log";
const MAX = 30;

export type MoodEntry = { date: string; mood: MoodId };

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useMoodLog() {
  const [log, setLog] = useState<MoodEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLog(JSON.parse(raw) as MoodEntry[]);
    } catch { /* storage unavailable */ }
    setLoaded(true);
  }, []);

  function logMood(mood: MoodId) {
    const today = todayKey();
    const updated = [
      { date: today, mood },
      ...log.filter((e) => e.date !== today),
    ].slice(0, MAX);
    setLog(updated);
    try {
      localStorage.setItem(KEY, JSON.stringify(updated));
    } catch { /* storage unavailable */ }
  }

  const todayMood = log.find((e) => e.date === todayKey())?.mood ?? null;

  // Last 7 days oldest→newest
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const date = d.toISOString().slice(0, 10);
    return {
      date,
      mood: log.find((e) => e.date === date)?.mood ?? null,
      label: d.toLocaleDateString("en-GB", { weekday: "short" }).toUpperCase(),
    };
  });

  return { todayMood, logMood, last7, loaded };
}
