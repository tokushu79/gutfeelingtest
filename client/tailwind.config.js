/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
      },
      colors: {
        base: {
          950: "#05050a",
          900: "#0b0b14",
          850: "#101019",
          800: "#15151f",
          700: "#1f1f2c",
          600: "#2a2a3a",
        },
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(139, 92, 246, 0.45)",
        card: "0 8px 30px rgba(0,0,0,0.35)",
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(circle at 20% 20%, rgba(139,92,246,0.15), transparent 40%), radial-gradient(circle at 80% 0%, rgba(236,72,153,0.12), transparent 45%), radial-gradient(circle at 50% 100%, rgba(56,189,248,0.10), transparent 40%)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-700px 0" },
          "100%": { backgroundPosition: "700px 0" },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s infinite linear",
      },
    },
  },
  plugins: [],
};
