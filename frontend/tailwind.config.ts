import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "genesis-black": "#000000",
        "genesis-deep": "#030308",
        "genesis-surface": "#0a0a14",
        "genesis-elevated": "#0f0f1e",
        "neon-blue": "#00A8FF",
        "neon-purple": "#7B2FFF",
        "neon-cyan": "#00F5FF",
        "neon-violet": "#A855F7",
        "neon-indigo": "#4F46E5",
        "glass-bg": "rgba(255,255,255,0.04)",
        "glass-border": "rgba(255,255,255,0.08)",
        "glass-hover": "rgba(255,255,255,0.07)",
      },
      fontFamily: {
        sans: ["Space Grotesk", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "neon-glow-blue": "radial-gradient(circle, #00A8FF22 0%, transparent 70%)",
        "neon-glow-purple": "radial-gradient(circle, #7B2FFF22 0%, transparent 70%)",
        "cosmos": "radial-gradient(ellipse at center, #0f0a20 0%, #030308 100%)",
      },
      boxShadow: {
        "neon-blue": "0 0 20px rgba(0, 168, 255, 0.35), 0 0 60px rgba(0, 168, 255, 0.15)",
        "neon-purple": "0 0 20px rgba(123, 47, 255, 0.35), 0 0 60px rgba(123, 47, 255, 0.15)",
        "neon-cyan": "0 0 20px rgba(0, 245, 255, 0.35), 0 0 60px rgba(0, 245, 255, 0.15)",
        "glass": "0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
        "glass-lg": "0 24px 64px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
      },
      keyframes: {
        "pulse-neon": {
          "0%, 100%": { opacity: "1", filter: "brightness(1)" },
          "50%": { opacity: "0.7", filter: "brightness(1.3)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "scan": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0,168,255,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(0,168,255,0.6), 0 0 80px rgba(0,168,255,0.2)" },
        },
        "stage-in": {
          "0%": { opacity: "0", transform: "translateX(-8px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "build-progress": {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        "particle-drift": {
          "0%": { transform: "translate(0,0) scale(1)", opacity: "0.8" },
          "100%": { transform: "translate(var(--tx), var(--ty)) scale(0)", opacity: "0" },
        },
      },
      animation: {
        "pulse-neon": "pulse-neon 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "spin-slow": "spin-slow 8s linear infinite",
        "scan": "scan 4s linear infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "stage-in": "stage-in 0.3s ease-out forwards",
        "build-progress": "build-progress 1s ease-in-out forwards",
        "particle-drift": "particle-drift 1s ease-out forwards",
      },
      transitionTimingFunction: {
        "spring": "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
