import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-prompt)", "ui-sans-serif", "system-ui"],
        display: ["var(--font-playfair)", "serif"],
      },
      colors: {
        ink: {
          950: "#070a18",
          900: "#0b1024",
          800: "#121736",
          700: "#1a214a",
        },
        gold: {
          50: "#fff8e6",
          100: "#fdebb6",
          200: "#fadf85",
          300: "#f6cf52",
          400: "#efbc2c",
          500: "#d99e15",
          600: "#a87809",
          700: "#7a560a",
        },
        cream: {
          50: "#fffdf7",
          100: "#fbf6e8",
          200: "#f3ebd1",
        },
      },
      backgroundImage: {
        "gold-radial":
          "radial-gradient(circle at top, rgba(239,188,44,0.18), transparent 60%)",
        "ink-radial":
          "radial-gradient(circle at bottom right, rgba(26,33,74,0.5), transparent 65%)",
        "shimmer":
          "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)",
      },
      boxShadow: {
        glow: "0 10px 40px -10px rgba(239,188,44,0.45)",
        "glow-lg": "0 30px 90px -25px rgba(239,188,44,0.55)",
        soft: "0 12px 40px -16px rgba(11,16,36,0.3)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "fade-up": "fade-up 0.8s ease-out both",
        "spin-slow": "spin-slow 24s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
