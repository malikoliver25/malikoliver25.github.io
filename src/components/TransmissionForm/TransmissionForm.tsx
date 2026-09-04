import { useEffect, useState } from "react";

export function validateTransmission({ name, email, message }: { name: string; email: string; message: string }): string | null {
  if (!name.trim()) return "Enter your name";
  if (!email.trim()) return "Enter a work email like ada@systems.co";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a work email like ada@systems.co";
  if (!message.trim()) return "Describe your mission — stack, constraints, timeline";
  return null;
}

export default function TransmissionForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!error) return;
    const name = document.querySelector<HTMLInputElement>('#transmission input[name="name"]');
    if (name && !name.value.trim()) { name.focus(); return; }
    const email = document.querySelector<HTMLInputElement>('#transmission input[name="email"]');
    if (email && (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value))) { email.focus(); return; }
    const msg = document.querySelector<HTMLTextAreaElement>('#transmission textarea[name="message"]');
    if (msg && !msg.value.trim()) msg.focus();
  }, [error]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "");
    const email = String(fd.get("email") || "");
    const message = String(fd.get("message") || "");
    const err = validateTransmission({ name, email, message });
    if (err) { setError(err); return; }
    setError(null);
    setSent(true);
    setTimeout(() => setSent(false), 4200);
    (e.currentTarget as HTMLFormElement).reset();
  };

  return (
    <form onSubmit={onSubmit} noValidate id="transmission-form" className="reveal-card relative rounded-[18px] border border-hairline-strong bg-panel p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
      <div className="flex items-center justify-between"><span className="font-mono text-[10px] tracking-[0.16em] text-mist">TRANSMISSION FORM • ENCRYPTED</span><span className="font-mono text-[10px] tracking-[0.12em] text-mist/60">RFC 2119 • MUST REPLY</span></div>
      <div id="tx-status" role="status" aria-live="polite" aria-atomic="true" className={sent ? "mt-4 rounded-[12px] border border-[#18E07A]/20 bg-[#18E07A]/10 px-4 py-3 font-mono text-[12px] tracking-[0.02em] text-[#18E07A]" : "sr-only"}>{sent ? "✓ Transmission queued — I'll respond within 24 hours. Check your inbox for confirmation." : ""}</div>
      <div id="tx-error" role="alert" aria-live="assertive" aria-atomic="true" className={error ? "mt-4 rounded-[12px] border border-[#FF3B30]/20 bg-[#FF3B30]/10 px-4 py-3 font-mono text-[12px] text-[#FF8A80]" : "sr-only"}>{error || ""}</div>
      <div className="mt-4 grid gap-4">
        <label className="block"><span className="font-mono text-[10px] tracking-[0.16em] text-mist">YOUR NAME</span><input name="name" required autoComplete="name" aria-describedby="tx-error" aria-invalid={error ? true : undefined} placeholder="Ada Lovelace" className="mt-1.5 w-full rounded-[10px] border border-hairline bg-void px-3.5 py-3 font-body text-[14px] text-paper placeholder:text-mist/50 focus:border-cyan/40 focus:outline-none aria-[invalid=true]:border-[#FF3B30]/40" /></label>
        <label className="block"><span className="font-mono text-[10px] tracking-[0.16em] text-mist">WORK EMAIL</span><input name="email" type="email" required autoComplete="email" inputMode="email" aria-describedby="tx-error" aria-invalid={error ? true : undefined} placeholder="ada@systems.co" className="mt-1.5 w-full rounded-[10px] border border-hairline bg-void px-3.5 py-3 font-body text-[14px] text-paper placeholder:text-mist/50 focus:border-cyan/40 focus:outline-none aria-[invalid=true]:border-[#FF3B30]/40" /></label>
        <label className="block"><span className="font-mono text-[10px] tracking-[0.16em] text-mist">MISSION BRIEF</span><textarea name="message" required rows={4} aria-describedby="tx-error" aria-invalid={error ? true : undefined} placeholder="What system needs to stay up when the network goes down? Stack, constraints, timeline…" className="mt-1.5 w-full resize-none rounded-[10px] border border-hairline bg-void px-3.5 py-3 font-body text-[14px] leading-[1.6] text-paper placeholder:text-mist/50 focus:border-cyan/40 focus:outline-none aria-[invalid=true]:border-[#FF3B30]/40" /></label>
        <div className="flex flex-wrap items-center gap-3 pt-1"><button type="submit" className="inline-flex items-center gap-2 rounded-full bg-signal px-6 py-3 font-mono text-[11px] font-semibold tracking-[0.14em] text-void hover:bg-[#FFF04A] active:scale-[0.96] transition-[color,background-color,border-color,transform,opacity]">SEND TRANSMISSION <span aria-hidden="true">↗</span></button><span className="font-mono text-[10px] tracking-[0.12em] text-mist/60">No spam. No templates. Direct reply.</span></div>
      </div>
      <div className="pointer-events-none absolute -right-px -top-px h-6 w-6 overflow-hidden rounded-tr-[18px]" aria-hidden="true"><div className="absolute right-0 top-0 h-px w-6 bg-cyan/60" /><div className="absolute right-0 top-0 h-6 w-px bg-cyan/60" /></div>
    </form>
  );
}
