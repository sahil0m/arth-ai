import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ARTH.AI brand — deep midnight banking + electric causal-violet accent
        ink: {
          950: "#070b14",
          900: "#0a0f1c",
          800: "#0f1626",
          700: "#161f33",
          600: "#1f2a44",
          500: "#2b3a5c",
        },
        arth: {
          // primary: causal violet
          violet: "#7c5cff",
          indigo: "#5b6bff",
          // signal: teal/emerald for "real / verified"
          teal: "#2dd4bf",
          emerald: "#34d399",
          // alert / empathy
          amber: "#fbbf24",
          rose: "#fb7185",
        },
        sbi: {
          // SBI brand blue lineage (used sparingly for trust cues)
          blue: "#22409a",
          sky: "#00a3e0",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(124,92,255,0.25), 0 8px 40px -8px rgba(124,92,255,0.45)",
        "glow-teal": "0 0 0 1px rgba(45,212,191,0.25), 0 8px 40px -8px rgba(45,212,191,0.4)",
        card: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 12px 40px -16px rgba(0,0,0,0.8)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)",
        "radial-violet":
          "radial-gradient(60% 60% at 50% 0%, rgba(124,92,255,0.18) 0%, transparent 70%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both",
        shimmer: "shimmer 2s infinite",
        "pulse-ring": "pulse-ring 1.8s cubic-bezier(0.4,0,0.2,1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
