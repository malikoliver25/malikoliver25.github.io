import { useState, useEffect, useRef } from "react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      onClose();
      setSent(false);
      setName("");
      setEmail("");
      setMessage("");
    }, 2000);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-void-black/80 backdrop-blur-sm px-0 sm:px-4"
      onClick={onClose}
      style={{ minHeight: "100dvh" }}
    >
      <div
        className="w-full sm:max-w-lg border border-glitch-red/50 bg-dark-charcoal shadow-[0_0_30px_rgba(255,0,60,0.2)] sm:rounded-none rounded-t-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="hud-window-header border-b-glitch-red/30">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-glitch-red animate-pulse" />
            <span className="font-mono text-[10px] sm:text-xs text-glitch-red tracking-wider uppercase">
              Incoming Transmission
            </span>
          </div>
          <button
            onClick={onClose}
            className="font-mono text-xs text-matrix-slate hover:text-glitch-red transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            [X]
          </button>
        </div>

        <div className="p-4 sm:p-6">
          {sent ? (
            <div className="text-center py-8">
              <p className="font-mono text-sm sm:text-base text-neon-yellow text-glow-yellow">
                TRANSMISSION SENT
              </p>
              <p className="font-mono text-xs text-matrix-slate mt-2">
                Signal received. Standby for response.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] sm:text-xs text-matrix-slate mb-1 tracking-wider">
                  IDENTIFIER
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="terminal-input border border-matrix-slate/30 px-3 py-2.5 bg-void-black/50"
                  placeholder="Enter callsign..."
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] sm:text-xs text-matrix-slate mb-1 tracking-wider">
                  COMM CHANNEL
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="terminal-input border border-matrix-slate/30 px-3 py-2.5 bg-void-black/50"
                  placeholder="your@signal.com"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] sm:text-xs text-matrix-slate mb-1 tracking-wider">
                  MESSAGE PAYLOAD
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={4}
                  className="terminal-input border border-matrix-slate/30 px-3 py-2.5 bg-void-black/50 resize-none"
                  placeholder="Transmit message..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 min-h-[48px] border border-glitch-red/50 text-glitch-red font-mono text-xs sm:text-sm tracking-widest uppercase hover:bg-glitch-red/10 hover:shadow-[0_0_15px_rgba(255,0,60,0.3)] transition-all"
              >
                [TRANSMIT]
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
