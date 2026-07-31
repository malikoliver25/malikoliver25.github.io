import { useState, useEffect, useCallback } from "react";

interface BootSequenceProps {
  onComplete: () => void;
}

const BOOT_LINES = [
  { text: "NETRUNNER OS v2.77 // BUILD 20260731", delay: 0 },
  { text: "BIOS POST... INITIALIZING NEURAL INTERFACE", delay: 200 },
  { text: "CHECKING CORE MEMORY... OK", delay: 400 },
  { text: "LOADING KERNEL MODULES... OK", delay: 550 },
  { text: "MOUNTING SECURE FILESYSTEM... OK", delay: 700 },
  { text: "DECRYPTING CREDENTIAL VAULT... OK", delay: 900 },
  { text: "ESTABLISHING ENCRYPTED UPLINK... OK", delay: 1100 },
  { text: "LOADING AGENTIC FRAMEWORKS... LANGGRAPH v0.4... OK", delay: 1350 },
  { text: "INITIALIZING LLM INFERENCE ENGINE... vLLM READY", delay: 1550 },
  { text: "SCANNING THREAT ENVIRONMENT... ALL CLEAR", delay: 1750 },
  { text: "LOADING USER PROFILE: MALIK OLIVER", delay: 1950 },
  { text: "ROLE: MLOps & AI Infrastructure Engineer", delay: 2100 },
  { text: "STATUS: ACTIVE // CLEARANCE: LEVEL-5", delay: 2250 },
  { text: "SYSTEM READY. WELCOME, NETRUNNER.", delay: 2450 },
];

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [fading, setFading] = useState(false);

  const handleSkip = useCallback(() => {
    setFading(true);
    setTimeout(onComplete, 400);
  }, [onComplete]);

  useEffect(() => {
    if (fading) return;
    if (visibleLines >= BOOT_LINES.length) {
      setTimeout(() => {
        setFading(true);
        setTimeout(onComplete, 600);
      }, 800);
      return;
    }
    const line = BOOT_LINES[visibleLines];
    const timer = setTimeout(() => {
      setVisibleLines((prev) => prev + 1);
    }, line.delay - (visibleLines > 0 ? BOOT_LINES[visibleLines - 1].delay : 0));
    return () => clearTimeout(timer);
  }, [visibleLines, onComplete, fading]);

  return (
    <div
      className="fixed inset-0 z-[10000] bg-void-black flex items-center justify-center transition-opacity duration-400"
      style={{ height: "100dvh" }}
    >
      <div className="w-full max-w-3xl px-4 sm:px-8">
        <div className="border border-electric-cyan/30 bg-dark-charcoal/50 p-4 sm:p-6 md:p-8">
          <div className="flex items-center gap-2 border-b border-electric-cyan/20 pb-3 mb-4">
            <div className="w-2.5 h-2.5 rounded-full bg-glitch-red" />
            <div className="w-2.5 h-2.5 rounded-full bg-neon-yellow" />
            <div className="w-2.5 h-2.5 rounded-full bg-electric-cyan" />
            <span className="ml-3 text-matrix-slate text-xs font-mono tracking-widest uppercase">
              System Boot
            </span>
          </div>

          <div className="min-h-[200px] sm:min-h-[320px] overflow-y-auto max-h-[60dvh]">
            {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
              <div key={i} className="boot-line flex gap-2 sm:gap-3">
                <span className="text-electric-cyan select-none shrink-0">
                  [{String(i).padStart(2, "0")}]
                </span>
                <span
                  className={`${
                    line.text.includes("OK") || line.text.includes("READY")
                      ? "text-neon-yellow"
                      : line.text.includes("WELCOME")
                      ? "text-electric-cyan text-glow-cyan"
                      : "text-matrix-slate"
                  }`}
                >
                  {line.text}
                </span>
              </div>
            ))}
            {visibleLines < BOOT_LINES.length && !fading && (
              <div className="boot-line flex gap-2 sm:gap-3">
                <span className="text-electric-cyan select-none shrink-0">
                  [{String(visibleLines).padStart(2, "0")}]
                </span>
                <span className="boot-cursor" />
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleSkip}
          className="mt-4 text-matrix-slate hover:text-electric-cyan font-mono text-xs tracking-widest transition-colors duration-200 uppercase min-h-[44px] min-w-[44px] flex items-center"
        >
          [SKIP] ▸▸
        </button>
      </div>
    </div>
  );
}
