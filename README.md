# PD-OS v27.0 — Birthday Experience

An interactive, cinematic birthday website built as a fake operating system dashboard. Designed for Papiya, turning 27 on May 22, 2026.

Live demo: _add your Vercel URL here_

---

## What it is

Eight sections that work together as an immersive personality dossier:

| Section | Description |
|---|---|
| **Boot Screen** | BIOS-style OS startup sequence with trait loading |
| **Physical Stats** | Biometric data with absurd comparisons |
| **Personality Engine** | Six interactive metric gauges, clickable for detail |
| **Be Her For A Day** | Branching day simulator with live stat tracking |
| **Memory Vault** | Clickable archive of classified memories and incidents |
| **Chaos Dashboard** | SVG analytics charts — hunger/anger correlation, sleep data |
| **Age Engine** | Live multi-unit age counter (Earth years, Afghan Hound loyalty units, tiramisu servings) |
| **Final Sequence** | Kinetic birthday wish → typewriter message → confetti |

---

## Tech stack

- **Next.js 15** (App Router, static export)
- **TypeScript**
- **Tailwind CSS v3**
- **Framer Motion** — scroll reveals, spring animations, kinetic typography
- **Custom SVG charts** — no chart library dependency

---

## Project structure

```
pd-bday/
├── app/
│   ├── layout.tsx          # Root layout, Google Fonts CDN
│   ├── page.tsx            # Orchestrates boot → hero → all sections
│   └── globals.css         # Design tokens, scanline, grid overlays
│
├── components/
│   ├── boot/
│   │   └── BootScreen.tsx          # BIOS boot sequence state machine
│   ├── stats/
│   │   └── PhysicalStats.tsx       # Animated stat cards
│   ├── personality/
│   │   └── PersonalityEngine.tsx   # Interactive metric gauges
│   ├── simulator/
│   │   └── DaySimulator.tsx        # Branching scenario simulator
│   ├── vault/
│   │   └── MemoryVault.tsx         # Click-to-open memory archive
│   ├── analytics/
│   │   └── ChaosAnalytics.tsx      # SVG chart dashboard
│   ├── time/
│   │   └── TimeVisualization.tsx   # Live multi-unit age counter
│   ├── ending/
│   │   └── BirthdayEnding.tsx      # Kinetic wish + message reveal + confetti
│   └── ui/
│       ├── GlitchText.tsx          # Character scramble on hover/trigger
│       ├── MagneticButton.tsx      # Spring-based cursor magnetism
│       ├── StatBar.tsx             # Animated progress bars
│       └── ModuleCard.tsx          # Shared card + header primitives
│
├── lib/
│   ├── data.ts     # ← All content lives here. Edit this to personalise.
│   ├── motion.ts   # Shared Framer Motion variants
│   └── utils.ts    # cn(), colour maps, math helpers
│
└── hooks/
    ├── useMousePosition.ts   # Magnetic button cursor tracking
    └── useScrollReveal.ts    # Scroll-triggered animation helper
```

---

## Personalisation

Everything that's specific to Papiya lives in **`lib/data.ts`**. To adapt this for someone else, only that file needs to change:

```ts
// Subject profile
export const SUBJECT = {
  name: "PAPIYA",
  dob: new Date("1999-05-22T00:00:00"),
  age: 27,
  nickname: "Tumpa",
}

// Boot screen messages    → BOOT_SYSTEM_CHECKS, BOOT_TRAIT_LOADS
// Physical stats          → PHYSICAL_STATS
// Personality metrics     → PERSONALITY_METRICS
// Day simulator scenarios → SIMULATOR_STEPS
// Memory vault cards      → MEMORY_VAULT
// Analytics copy          → ANALYTICS_STATS
// Birthday message        → BIRTHDAY_MESSAGE
```

---

## Running locally

> **Note:** `npm install` requires internet access to the npm registry.
> If you're behind a corporate firewall, symlink `node_modules` from another
> Next.js project in the same workspace that already has the dependencies installed.

```bash
npm run dev
# → http://localhost:3000
```

The dev server uses webpack (not Turbopack) to correctly resolve symlinked `node_modules`.

---

## Deploying to Vercel

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "PD-OS v27.0 — birthday experience"
git remote add origin https://github.com/YOUR_USERNAME/pd-bday.git
git push -u origin main

# 2. Import on Vercel
# vercel.com → New Project → select repo → Deploy
# No configuration required — Next.js is auto-detected.
```

Vercel installs dependencies fresh in their environment (unrestricted npm access), so the local symlink workaround is irrelevant in production.

---

## Design system

| Token | Value | Use |
|---|---|---|
| `bg-base` | `#070706` | Page background |
| `bg-surface` | `#0e0e0c` | Cards, panels |
| `accent-lime` | `#c8f135` | Primary accent, highlights |
| `accent-pink` | `#ff3c78` | Drama, emotional |
| `accent-blue` | `#4d9fff` | Data, analytics |
| `accent-orange` | `#ff8c42` | Chaos, warnings |
| `--font-sans` | Space Grotesk | Display, UI |
| `--font-mono` | Space Mono | Data, terminal, labels |

Motion principles: slow deliberate reveals (0.6–1.2s), expo easing `[0.16,1,0.3,1]`, staggered children at 80ms intervals.

---

## Known constraints

- **No real photos or audio** — memory vault uses text descriptions styled as film negatives / classified documents
- **No backend** — fully static, all data in `lib/data.ts`
- **Fonts via CDN** — `next/font/google` skipped in favour of a `<link>` tag (avoids build-time network dependency)
