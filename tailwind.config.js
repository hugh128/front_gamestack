/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Orbitron'", "monospace"],
        mono: ["'Share Tech Mono'", "monospace"],
        body: ["'Exo 2'", "sans-serif"],
      },
      colors: {
        neon: {
          cyan: "#00f5ff",
          pink: "#ff006e",
          green: "#39ff14",
          yellow: "#ffbe0b",
        },
        dark: {
          950: "#03030a",
          900: "#06060f",
          800: "#0d0d1f",
          700: "#141428",
          600: "#1c1c35",
        },
      },
      animation: {
        "scan": "scan 4s linear infinite",
        "pulse-neon": "pulseNeon 2s ease-in-out infinite",
        "glitch": "glitch 0.3s ease-in-out",
        "flicker": "flicker 3s infinite",
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        pulseNeon: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        glitch: {
          "0%": { transform: "translate(0)" },
          "25%": { transform: "translate(-2px, 2px)" },
          "50%": { transform: "translate(2px, -2px)" },
          "75%": { transform: "translate(-2px, -2px)" },
          "100%": { transform: "translate(0)" },
        },
        flicker: {
          "0%, 95%, 100%": { opacity: "1" },
          "96%": { opacity: "0.8" },
          "97%": { opacity: "1" },
          "98%": { opacity: "0.7" },
          "99%": { opacity: "1" },
        },
      },
      boxShadow: {
        "neon-cyan": "0 0 20px rgba(0,245,255,0.4), 0 0 60px rgba(0,245,255,0.1)",
        "neon-pink": "0 0 20px rgba(255,0,110,0.4), 0 0 60px rgba(255,0,110,0.1)",
        "neon-green": "0 0 20px rgba(57,255,20,0.4), 0 0 60px rgba(57,255,20,0.1)",
      },
    },
  },
  plugins: [],
};
