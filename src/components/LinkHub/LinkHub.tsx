import { profile } from "@/data/profile";

const LINKS = [
  {
    label: "GITHUB",
    url: profile.github,
    icon: "⌘",
  },
  {
    label: "LINKEDIN",
    url: profile.linkedin,
    icon: "◆",
  },
  {
    label: "EMAIL",
    url: `mailto:${profile.email}`,
    icon: "✉",
  },
];

export default function LinkHub() {
  return (
    <section id="contact" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <span className="text-electric-cyan font-mono text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase">
            ▸ Comm Links
          </span>
          <div className="flex-1 h-px bg-matrix-slate/20" />
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target={link.url.startsWith("http") ? "_blank" : undefined}
              rel={link.url.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group flex items-center gap-3 px-5 sm:px-6 py-4 min-h-[56px] border border-matrix-slate/30 bg-dark-charcoal/50 hover:border-electric-cyan hover:shadow-neon transition-all duration-300"
            >
              <span className="text-xl text-neon-yellow group-hover:text-glow-yellow transition-all shrink-0">
                {link.icon}
              </span>
              <div className="min-w-0">
                <span className="block font-mono text-[10px] sm:text-xs text-electric-cyan tracking-wider group-hover:text-glow-cyan transition-all">
                  {link.label}
                </span>
                <span className="block font-mono text-[9px] sm:text-[10px] text-matrix-slate mt-0.5 truncate">
                  {link.url.replace("mailto:", "").replace("https://", "")}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
