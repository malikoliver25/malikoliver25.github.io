/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#06080B",
        ink: "#0E131A",
        panel: "#141A23",
        hairline: "#1C232E",
        "hairline-strong": "#253041",
        mist: "#8B9AB1",
        "mist-soft": "#C2CFE2",
        paper: "#EEF2F7",
        signal: "#FFE81A",
        cyan: "#00E5FF",
        "signal-soft": "rgba(255,232,26,0.12)",
        "cyan-soft": "rgba(0,229,255,0.12)",
      },
      fontFamily: {
        display: ['"Space Grotesk"', '"Instrument Sans"', "Inter", "sans-serif"],
        mono: ['"JetBrains Mono"', '"Fira Code"', "monospace"],
        body: ["Inter", "sans-serif"],
      },
      fontSize: {
        "display-hero": ["clamp(34px,6vw,62px)", { lineHeight: "0.88", letterSpacing: "-0.032em", fontWeight: "600" }],
        "heading-section": ["clamp(28px,3.2vw,34px)", { lineHeight: "0.95", letterSpacing: "-0.03em", fontWeight: "600" }],
        "heading-card": ["19px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "600" }],
        "body": ["15px", { lineHeight: "1.7", fontWeight: "400" }],
        "body-sm": ["14px", { lineHeight: "1.65", fontWeight: "400" }],
        "label": ["10px", { lineHeight: "1.4", letterSpacing: "0.16em", fontWeight: "400" }],
        "label-sm": ["11px", { lineHeight: "1.4", letterSpacing: "0.14em", fontWeight: "400" }],
      },
      maxWidth: {
        frame: "1440px",
      },
      animation: {
        "hairline-draw": "hairlineDraw 1.2s cubic-bezier(0.16,1,0.3,1) forwards",
      },
      keyframes: {
        hairlineDraw: {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
      },
    },
  },
  plugins: [],
};
