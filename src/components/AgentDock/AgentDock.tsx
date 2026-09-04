import { useEffect, useRef, useState } from 'react';
import { useAgentChat } from '@/hooks/useAgentChat';
import NovaEmblem from './NovaEmblem';

export default function AgentDock({ enabled }: { enabled: boolean }) {
  const [open, setOpen] = useState(false);
  const { messages, streaming, send, reset } = useAgentChat();
  const [input, setInput] = useState('');
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pillRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, open, streaming]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        pillRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!enabled) return null;

  return (
    <>
      {/* Dock */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 pointer-events-none">
        {open && (
          <div
            role="dialog"
            aria-label="NOVA — Malik's assistant"
            aria-modal="false"
            className="pointer-events-auto w-[360px] max-w-[calc(100vw-32px)] sm:w-[380px] overflow-hidden rounded-[18px] border border-hairline-strong bg-panel shadow-[0_20px_60px_rgba(0,0,0,0.45)] flex flex-col max-h-[min(68dvh,520px)]"
          >
            <div className="flex items-center justify-between gap-2 border-b border-hairline px-3.5 py-3 bg-void/60">
              <div className="flex items-center gap-2 min-w-0">
                <div className="min-w-0">
                  <div className="font-mono text-[11px] tracking-[0.16em] text-paper">NOVA</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={reset} className="rounded-full border border-hairline bg-void px-2.5 py-1.5 font-mono text-[10px] tracking-[0.14em] text-mist hover:text-paper hover:border-hairline-strong transition-colors">RESET</button>
                <button onClick={() => { setOpen(false); pillRef.current?.focus(); }} aria-label="Close chat" className="grid h-8 w-8 place-items-center rounded-full border border-hairline bg-void font-mono text-mist hover:text-paper">✕</button>
              </div>
            </div>

            <div ref={listRef} className="flex-1 overflow-auto overscroll-contain px-3.5 py-3 space-y-3 bg-ink/40" style={{ overscrollBehavior: 'contain' } as unknown as React.CSSProperties}>
              {messages.map(m => (
                <div key={m.id} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                  <div className={m.role === 'user'
                    ? 'max-w-[82%] rounded-[14px] bg-paper px-3 py-2.5 font-body text-[13px] leading-[1.5] text-void'
                    : 'max-w-[88%] rounded-[14px] border border-hairline bg-void px-3 py-2.5 font-body text-[13px] leading-[1.6] text-mist'}>
                    {m.content || (streaming ? <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse" aria-hidden="true" /> thinking</span> : '')}
                  </div>
                </div>
              ))}
              <div className="pt-2 flex flex-wrap gap-1.5">
                {['What is SENTINEL-CORE?', 'Show MTM stack', 'Are you available to hire?'].map(q => (
                  <button key={q} onClick={() => send(q)} className="rounded-full border border-hairline bg-void px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] text-mist hover:text-paper hover:border-hairline-strong transition-colors text-left">{q}</button>
                ))}
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); const t = input.trim(); if (!t) return; send(t); setInput(''); }} className="border-t border-hairline bg-panel p-2.5 flex items-center gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask NOVA about your next project…"
                aria-label="Ask NOVA"
                className="flex-1 rounded-full border border-hairline bg-void px-4 py-2.5 font-body text-[13px] text-paper placeholder:text-mist/60 focus:outline-none focus:border-cyan/50 focus:ring-2 focus:ring-cyan/20"
                autoComplete="off"
              />
              <button type="submit" disabled={!input.trim() || streaming} className="grid h-9 w-9 place-items-center rounded-full bg-signal text-void font-mono text-[14px] disabled:opacity-40 hover:bg-[#FFF04A] active:scale-[0.96] transition">↗</button>
            </form>
            <div className="border-t border-hairline bg-void px-3.5 py-2 flex items-center justify-between">
              <span className="font-mono text-[10px] tracking-[0.12em] text-mist/60">Live from GitHub · no hallucination</span>
              <a href="#transmission" onClick={(e) => { e.preventDefault(); document.querySelector('#transmission')?.scrollIntoView({ behavior: 'smooth' }); setOpen(false); }} className="font-mono text-[10px] tracking-[0.14em] text-cyan hover:text-white">Transmission →</a>
            </div>
          </div>
        )}
        {/* Big emblem splash when open */}
        {open && (
          <div className="pointer-events-none hidden sm:flex justify-center -mb-2 mr-2">
            <NovaEmblem size={72} />
          </div>
        )}

        <button
          ref={pillRef}
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          aria-controls="agent-dock"
          aria-label={open ? 'Close NOVA' : 'Open NOVA'}
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-hairline-strong bg-panel px-3 py-2 shadow-[0_12px_30px_rgba(0,0,0,0.35)] hover:border-cyan/30 transition-colors"
        >
          {!open && <span className="grid place-items-center"><NovaEmblem size={28} /></span>}
          <span className="font-mono text-[11px] font-semibold tracking-[0.16em] text-paper">{open ? 'CLOSE NOVA' : 'NOVA — ASK ME!'}</span>
        </button>
      </div>

      {/* Mobile inert backdrop when open */}
      {open && <button onClick={() => setOpen(false)} aria-label="Close chat backdrop" className="fixed inset-0 z-40 bg-void/20 backdrop-blur-[2px] sm:hidden" />}
    </>
  );
}
