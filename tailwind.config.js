/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "void-black": "#0A0A0A",
        "dark-charcoal": "#121212",
        "neon-yellow": "#FCEE0A",
        "electric-cyan": "#00F0FF",
        "glitch-red": "#FF003C",
        "matrix-slate": "#8F9BA8",
      },
      fontFamily: {
        mono: ['"Fira Code"', "Courier New", "monospace"],
        heading: ['"Orbitron"', '"Inter"', "sans-serif"],
        body: ['"Inter"', "sans-serif"],
      },
      padding: {
        safe: "env(safe-area-inset-bottom)",
      },
      animation: {
        flicker: "flicker 0.15s infinite",
        "flicker-slow": "flicker 0.3s infinite",
        glitch: "glitch 0.3s ease-in-out",
        scanline: "scanline 6s linear infinite",
        "typing-cursor": "typingCursor 1s step-end infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.97" },
          "25%": { opacity: "0.99" },
          "75%": { opacity: "0.96" },
        },
        glitch: {
          "0%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
          "100%": { transform: "translate(0)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        typingCursor: {
          "0%, 100%": { borderColor: "transparent" },
          "50%": { borderColor: "#00F0FF" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 5px #00F0FF, 0 0 10px #00F0FF" },
          "50%": { boxShadow: "0 0 10px #00F0FF, 0 0 20px #00F0FF, 0 0 30px #00F0FF" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      boxShadow: {
        neon: "0 0 5px #00F0FF, 0 0 10px #00F0FF",
        "neon-yellow": "0 0 5px #FCEE0A, 0 0 10px #FCEE0A",
        "neon-strong": "0 0 10px #00F0FF, 0 0 20px #00F0FF, 0 0 40px #00F0FF",
      },
    },
  },
  plugins: [],
};
