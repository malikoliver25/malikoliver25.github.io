import { useState, useEffect, useCallback, useRef } from "react";

interface BootSequenceProps {
  onComplete: () => void;
}

const BOOT_LINES = [
  { text: "NETRUNNER OS v2.77 // BUILD 20260731 // AIR-GAPPED", delay: 0 },
  { text: "BIOS POST… INITIALIZING NEURAL INTERFACE", delay: 180 },
  { text: "CHECKING CORE MEMORY… 64GB ECC — OK", delay: 360 },
  { text: "LOADING KERNEL MODULES… OK", delay: 520 },
  { text: "MOUNTING SECURE FILESYSTEM… LUKS — OK", delay: 680 },
  { text: "DECRYPTING CREDENTIAL VAULT… OK", delay: 860 },
  { text: "ESTABLISHING ENCRYPTED UPLINK… QUIC/TLS 1.3 — OK", delay: 1080 },
  { text: "LOADING AGENTIC FRAMEWORKS… LANGGRAPH v0.4 — OK", delay: 1280 },
  { text: "INITIALIZING LLM INFERENCE ENGINE… vLLM — READY", delay: 1480 },
  { text: "SCANNING THREAT ENVIRONMENT… ALL CLEAR", delay: 1680 },
  { text: "LOADING USER PROFILE: MALIK OLIVER", delay: 1860 },
  { text: "ROLE: MLOps & AI Infrastructure Engineer", delay: 2020 },
  { text: "STATUS: ACTIVE // CLEARANCE: LEVEL-5", delay: 2180 },
  { text: "SYSTEM READY. WELCOME, NETRUNNER.", delay: 2380 },
];

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [fading, setFading] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const triggerComplete = useCallback(() => {
    if (fading) return;
    setFading(true);
    // cinematic fade: allow CSS transition then unmount
    window.setTimeout(onComplete, 720);
  }, [fading, onComplete]);

  const handleSkip = useCallback(() => triggerComplete(), [triggerComplete]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        triggerComplete();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [triggerComplete]);

  useEffect(() => {
    if (fading) return;
    if (visibleLines >= BOOT_LINES.length) {
      const t = window.setTimeout(triggerComplete, 750);
      return () => window.clearTimeout(t);
    }
    const line = BOOT_LINES[visibleLines];
    const prevDelay = visibleLines > 0 ? BOOT_LINES[visibleLines - 1].delay : 0;
    const delta = Math.max(16, line.delay - prevDelay);
    const timer = window.setTimeout(() => setVisibleLines((p) => p + 1), delta);
    return () => window.clearTimeout(timer);
  }, [visibleLines, fading, triggerComplete]);

  const progress = Math.min(100, (visibleLines / BOOT_LINES.length) * 100);

  return (
    <div
      ref={rootRef}
      className={`fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden bg-void px-4 py-6 sm:px-6 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${fading ? "opacity-0 scale-[0.985] blur-[2px] pointer-events-none" : "opacity-100 scale-100 blur-0"}`}
      style={{ height: "100dvh" }}
      role="dialog"
      aria-label="System boot sequence"
      aria-modal="true"
    >
      {/* base */}
      <div className="absolute inset-0 bg-void" aria-hidden="true" />
      {/* subtle grid */}
      <div className="absolute inset-0 opacity-[0.045]" aria-hidden="true" style={{ backgroundImage: "linear-gradient(#1C232E 1px, transparent 1px), linear-gradient(90deg, #1C232E 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      {/* vignette */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true" style={{ background: "radial-gradient(70% 60% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)" }} />
      {/* CRT scanlines */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-soft-light" aria-hidden="true" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,229,255,0.22) 2px, rgba(0,229,255,0.22) 3px)" }} />
      {/* moving scan beam */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30" aria-hidden="true">
        <div className="absolute inset-x-0 h-[120px] -translate-y-[120px] bg-gradient-to-b from-transparent via-cyan/10 to-transparent" style={{ animation: "bootScan 2.8s linear infinite" }} />
      </div>
      {/* RGB shift fringe */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.015] mix-blend-screen" aria-hidden="true" style={{ background: "linear-gradient(90deg, rgba(255,0,60,0.5) 0%, transparent 1%, transparent 99%, rgba(0,229,255,0.5) 100%)" }} />

      <div className={`relative w-full max-w-[760px] transition-all duration-700 ${fading ? "translate-y-2" : "translate-y-0"}`}>
        {/* terminal shell */}
        <div className="relative overflow-hidden rounded-[16px] border border-hairline-strong bg-panel/90 shadow-[0_24px_80px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,255,255,0.03)_inset] backdrop-blur-[8px]">
          {/* top bar */}
          <div className="flex items-center justify-between gap-3 border-b border-hairline bg-void/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF3B30] shadow-[0_0_8px_rgba(255,59,48,0.5)]" aria-hidden="true" />
              <span className="h-2.5 w-2.5 rounded-full bg-signal shadow-[0_0_8px_rgba(255,232,26,0.4)]" aria-hidden="true" />
              <span className="h-2.5 w-2.5 rounded-full bg-cyan shadow-[0_0_8px_rgba(0,229,255,0.5)]" aria-hidden="true" />
              <span className="ml-2 hidden sm:inline font-mono text-[10px] tracking-[0.16em] text-mist">SYS_BOOT — NETRUNNER_DECK</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.12em] text-mist/70">
              <span className="hidden sm:inline">SECURE • AIR-GAPPED</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#18E07A] animate-pulse" aria-hidden="true" />
              <span className="text-[#18E07A]">LINK OK</span>
            </div>
          </div>

          {/* log */}
          <div className="px-4 sm:px-5 py-4 sm:py-5 min-h-[280px] sm:min-h-[340px] max-h-[52dvh] overflow-hidden">
            <div className="space-y-1 font-mono text-[11px] sm:text-[12px] leading-[1.7]">
              {BOOT_LINES.slice(0, visibleLines).map((line, i) => {
                const isOk = line.text.includes("OK") || line.text.includes("READY");
                const isWelcome = line.text.includes("WELCOME");
                return (
                  <div key={i} className="flex gap-2 sm:gap-3" style={{ animation: "bootLineIn 280ms cubic-bezier(0.16,1,0.3,1) both", animationDelay: `${i * 12}ms` }}>
                    <span className="select-none shrink-0 tabular-nums text-cyan/60">[{String(i).padStart(2, "0")}]</span>
                    <span className={`${isWelcome ? "text-cyan font-semibold tracking-[0.02em] drop-shadow-[0_0_10px_rgba(0,229,255,0.45)]" : isOk ? "text-signal" : "text-mist-soft"}`}>
                      {line.text}
                      {isOk && <span className="ml-2 text-[#18E07A]">✓</span>}
                    </span>
                  </div>
                );
              })}
              {visibleLines < BOOT_LINES.length && !fading && (
                <div className="flex gap-2 sm:gap-3">
                  <span className="select-none shrink-0 tabular-nums text-cyan/60">[{String(visibleLines).padStart(2, "0")}]</span>
                  <span className="inline-flex items-center gap-1 text-mist">
                    <span className="h-3 w-2 bg-cyan/80" style={{ animation: "blink 1s step-end infinite" }} aria-hidden="true" />
                    <span className="sr-only">Loading</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* progress bar */}
          <div className="border-t border-hairline bg-void/40 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[10px] tracking-[0.16em] text-mist">INITIALIZING</span>
              <span className="font-mono text-[10px] tracking-[0.12em] text-mist/70 tabular-nums" aria-live="polite">{Math.round(progress)}%</span>
            </div>
            <div className="mt-2 h-[4px] w-full overflow-hidden rounded-full bg-void border border-hairline" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label="Boot progress">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan via-signal to-cyan transition-all duration-300 ease-out" style={{ width: `${progress}%`, boxShadow: progress > 4 ? "0 0 12px rgba(0,229,255,0.5)" : undefined }} aria-hidden="true" />
            </div>
            <div className="mt-1.5 flex justify-between font-mono text-[9px] tracking-[0.12em] text-mist/40">
              <span>ORCHESTRATION FIELD</span>
              <span>v2.77 • {visibleLines}/{BOOT_LINES.length}</span>
            </div>
          </div>

          {/* bottom glow */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent opacity-60" aria-hidden="true" />
        </div>

        {/* actions */}
        <div className="mt-3 flex items-center justify-between gap-3">
          <button
            onClick={handleSkip}
            className="group inline-flex items-center gap-2 rounded-full border border-hairline bg-panel px-4 py-2 font-mono text-[11px] tracking-[0.14em] text-mist hover:text-paper hover:border-hairline-strong hover:bg-[#1A212C] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/50"
          >
            SKIP SEQUENCE <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">↗</span>
          </button>
          <span className="hidden sm:inline font-mono text-[10px] tracking-[0.12em] text-mist/50">Press Esc / Space to skip • Auto-continues in {(BOOT_LINES.length - visibleLines) * 0.14 + 0.8 || 0}s</span>
          <span className="sm:hidden font-mono text-[10px] tracking-[0.12em] text-mist/50">ESC to skip</span>
        </div>

        {/* caption */}
        <p className="mt-4 text-center font-mono text-[10px] tracking-[0.12em] text-mist/30">
          MLOps & AI Infrastructure — Malik Oliver • Indianapolis → Chicago
        </p>
      </div>

      <style>{`
        @keyframes bootScan { 0% { transform: translateY(-140px); } 100% { transform: translateY(860px); } }
        @keyframes bootLineIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
        @media (prefers-reduced-motion: reduce) {
          div[style*="bootScan"] { animation: none !important; opacity: 0 !important; }
        }
      `}</style>
    </div>
  );
}
