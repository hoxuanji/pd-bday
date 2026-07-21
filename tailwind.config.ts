import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: "#070706",
          surface: "#0e0e0c",
          elevated: "#161614",
          glass: "rgba(14,14,12,0.8)",
        },
        border: {
          dim: "#1c1c1a",
          DEFAULT: "#262622",
          strong: "#3a3a34",
          accent: "#4e4e46",
        },
        ink: {
          primary: "#f2f2ef",
          secondary: "#7a7a6e",
          muted: "#6a6a60",
        },
        accent: {
          lime: "#c8f135",
          pink: "#ff3c78",
          blue: "#4d9fff",
          orange: "#ff8c42",
          yellow: "#ffd60a",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        "display-2xl": ["clamp(4rem,12vw,10rem)", { lineHeight: "0.9", letterSpacing: "-0.03em" }],
        "display-xl": ["clamp(3rem,8vw,7rem)", { lineHeight: "0.95", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(2rem,5vw,4.5rem)", { lineHeight: "1", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(1.5rem,3vw,2.5rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
      },
      spacing: {
        section: "clamp(5rem,10vw,10rem)",
      },
      animation: {
        "blink": "blink 1.2s step-end infinite",
        "scanline": "scanline 8s linear infinite",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      backgroundImage: {
        "grid-dim": "linear-gradient(rgba(242,242,239,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(242,242,239,0.03) 1px, transparent 1px)",
        "grid-accent": "linear-gradient(rgba(200,241,53,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(200,241,53,0.06) 1px, transparent 1px)",
        "noise": "url('/noise.svg')",
      },
      backgroundSize: {
        "grid-sm": "24px 24px",
        "grid-md": "48px 48px",
        "grid-lg": "80px 80px",
      },
      transitionTimingFunction: {
        "cinematic": "cubic-bezier(0.76, 0, 0.24, 1)",
        "expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "bounce-sm": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
