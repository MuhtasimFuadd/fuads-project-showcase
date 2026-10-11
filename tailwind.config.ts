import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0A0C10",
        panel: "#10131A",
        raised: "#171B25",
        paper: "#EDEFF4",
        line: "#242A37",
        accent: {
          DEFAULT: "#FF8A4C",
          light: "#FFB68A",
          dark: "#C4571F"
        },
        aqua: "#4FD1C5"
      },
      fontFamily: {
        display: ["'Space Grotesk Variable'", "system-ui", "sans-serif"],
        body: ["'Inter Variable'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono Variable'", "ui-monospace", "monospace"]
      },
      maxWidth: { content: "72rem" },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        drift: {
          "0%,100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(30px,-20px,0) scale(1.08)" }
        }
      },
      animation: {
        rise: "rise 0.8s cubic-bezier(.2,.7,.2,1) both",
        drift: "drift 14s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
