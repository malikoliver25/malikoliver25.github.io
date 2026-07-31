import { useState } from "react";
import GlitchText from "@/components/effects/GlitchText";

const NAV_ITEMS = [
  { label: "ABOUT", href: "#about" },
  { label: "SKILLS", href: "#skills" },
  { label: "CERTS", href: "#certs" },
  { label: "MISSIONS", href: "#missions" },
  { label: "CONTACT", href: "#contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] border-b border-matrix-slate/20 bg-void-black/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 sm:gap-3 group min-h-[44px]">
          <div className="w-2.5 h-2.5 rounded-full bg-neon-yellow animate-glow-pulse shrink-0" />
          <GlitchText
            text="MALIK_OLIVER"
            className="font-heading text-xs sm:text-sm md:text-base font-bold tracking-[0.15em] sm:tracking-[0.2em] text-neon-yellow"
          />
          <span className="hidden lg:inline text-matrix-slate text-xs font-mono">
            // NETRUNNER_DECK
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-3 py-1.5 min-h-[44px] flex items-center text-xs font-mono text-matrix-slate hover:text-electric-cyan hover:text-glow-cyan transition-all duration-200 tracking-wider"
            >
              [{item.label}]
            </a>
          ))}
        </nav>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-1.5 p-3 min-h-[44px] min-w-[44px] items-center justify-center"
          aria-label="Toggle menu"
        >
          <span
            className={`w-5 h-0.5 bg-electric-cyan transition-transform duration-200 ${
              mobileOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`w-5 h-0.5 bg-electric-cyan transition-opacity duration-200 ${
              mobileOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`w-5 h-0.5 bg-electric-cyan transition-transform duration-200 ${
              mobileOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t border-matrix-slate/20 bg-void-black/95 backdrop-blur-md">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block px-6 py-4 min-h-[48px] text-sm font-mono text-matrix-slate hover:text-electric-cyan hover:bg-dark-charcoal/50 transition-colors tracking-wider"
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
