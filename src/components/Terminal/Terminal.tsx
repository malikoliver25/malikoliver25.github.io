import { useState, useRef, useEffect } from "react";
import { useTerminal } from "@/hooks/useTerminal";
import GlitchText from "@/components/effects/GlitchText";

export default function Terminal() {
  const {
    lines,
    inputValue,
    setInputValue,
    handleSubmit,
    handleKeyDown,
  } = useTerminal();
  const [expanded, setExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  // Auto-focus input when mobile drawer opens
  useEffect(() => {
    if (expanded) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [expanded]);

  // Collapse on escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && expanded) {
        setExpanded(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [expanded]);

  return (
    <>
      {/* Mobile toggle button - shows when collapsed */}
      {!expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="terminal-toggle md:hidden"
          aria-label="Open terminal"
        >
          <span className="font-mono text-electric-cyan text-base sm:text-lg">▸_</span>
        </button>
      )}

      {/* Desktop: inline terminal at bottom of page */}
      <section className="hidden md:block py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <TerminalBody
            lines={lines}
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleSubmit={handleSubmit}
            handleKeyDown={handleKeyDown}
            scrollRef={scrollRef}
            inputRef={inputRef}
            showMinimize={false}
          />
        </div>
      </section>

      {/* Mobile: bottom sheet drawer terminal */}
      {expanded && (
        <div className="md:hidden fixed inset-0 z-[95] flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-void-black/70 backdrop-blur-sm"
            onClick={() => setExpanded(false)}
          />

          {/* Drawer */}
          <div
            className="relative terminal-drawer border-t border-electric-cyan/30 bg-void-black shadow-[0_-10px_40px_rgba(0,240,255,0.15)]"
          >
            <TerminalBody
              lines={lines}
              inputValue={inputValue}
              setInputValue={setInputValue}
              handleSubmit={handleSubmit}
              handleKeyDown={handleKeyDown}
              scrollRef={scrollRef}
              inputRef={inputRef}
              showMinimize
              onMinimize={() => setExpanded(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}

interface TerminalBodyProps {
  lines: { id: number; type: string; content: string }[];
  inputValue: string;
  setInputValue: (val: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  scrollRef: React.RefObject<HTMLDivElement>;
  inputRef: React.RefObject<HTMLInputElement>;
  showMinimize: boolean;
  onMinimize?: () => void;
}

function TerminalBody({
  lines,
  inputValue,
  setInputValue,
  handleSubmit,
  handleKeyDown,
  scrollRef,
  inputRef,
  showMinimize,
  onMinimize,
}: TerminalBodyProps) {
  return (
    <div className="h-full flex flex-col border border-electric-cyan/30 bg-void-black/95 backdrop-blur-md">
      {/* Title bar */}
      <div className="hud-window-header border-b-electric-cyan/20 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-glitch-red" />
          <div className="w-2.5 h-2.5 rounded-full bg-neon-yellow" />
          <div className="w-2.5 h-2.5 rounded-full bg-electric-cyan" />
          <GlitchText
            text="THE DECK"
            className="ml-3 font-mono text-[10px] sm:text-xs text-electric-cyan tracking-[0.2em]"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[9px] sm:text-[10px] text-matrix-slate hidden sm:inline">
            netrunner@deck:~$
          </span>
          {showMinimize && onMinimize && (
            <button
              onClick={onMinimize}
              className="font-mono text-[10px] sm:text-xs text-matrix-slate hover:text-electric-cyan transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              [MINIMIZE]
            </button>
          )}
        </div>
      </div>

      {/* Terminal body */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 sm:p-4 font-mono text-xs sm:text-sm min-h-0"
      >
        {lines.map((line) => (
          <div
            key={line.id}
            className={`whitespace-pre-wrap break-all ${
              line.type === "input"
                ? "text-neon-yellow"
                : line.type === "system"
                ? "text-electric-cyan"
                : "text-matrix-slate"
            }`}
          >
            {line.type === "input" ? (
              <span>
                <span className="text-electric-cyan">netrunner@deck</span>
                <span className="text-matrix-slate">:</span>
                <span className="text-electric-cyan">~</span>
                <span className="text-matrix-slate">$ </span>
                {line.content}
              </span>
            ) : (
              line.content
            )}
          </div>
        ))}

        {/* Input line */}
        <form onSubmit={handleSubmit} className="flex items-center mt-1">
          <span className="text-electric-cyan select-none shrink-0">
            netrunner@deck
          </span>
          <span className="text-matrix-slate select-none">:</span>
          <span className="text-electric-cyan select-none">~</span>
          <span className="text-matrix-slate select-none">$ </span>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="terminal-input flex-1 ml-0"
            spellCheck={false}
            autoComplete="off"
          />
        </form>
      </div>
    </div>
  );
}
