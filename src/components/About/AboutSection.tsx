import { profile } from "@/data/profile";
import NeonBorder from "@/components/effects/NeonBorder";
import TypingText from "@/components/effects/TypingText";

export default function AboutSection() {
  return (
    <section id="about" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <span className="text-electric-cyan font-mono text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase">
            ▸ System Identity
          </span>
          <div className="flex-1 h-px bg-matrix-slate/20" />
        </div>

        <NeonBorder color="cyan" animate className="p-0">
          <div className="hud-window-header">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-2 h-2 rounded-full bg-neon-yellow shrink-0" />
              <span className="font-mono text-[10px] sm:text-xs text-matrix-slate tracking-wider uppercase truncate">
                Mercenary Profile // {profile.handle}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-mono text-electric-cyan">●</span>
              <span className="text-[10px] sm:text-xs font-mono text-neon-yellow">
                {profile.status}
              </span>
            </div>
          </div>

          <div className="p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
              <div className="min-w-0">
                <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-neon-yellow text-glow-yellow tracking-wide break-words">
                  {profile.realName}
                </h2>
                <p className="font-mono text-electric-cyan text-xs sm:text-sm mt-1 tracking-wider break-words">
                  {profile.title}
                </p>
              </div>
              <div className="flex flex-col gap-1 sm:text-right shrink-0">
                <span className="font-mono text-[10px] sm:text-xs text-matrix-slate">
                  LOC: {profile.location}
                </span>
                <span className="font-mono text-[10px] sm:text-xs text-matrix-slate">
                  RELOC: {profile.openToRelocation}
                </span>
                <span className="font-mono text-[10px] sm:text-xs text-neon-yellow">
                  CLEARANCE: {profile.clearance}
                </span>
              </div>
            </div>

            <div className="border-t border-matrix-slate/20 pt-5 sm:pt-6">
              <p className="text-[10px] sm:text-xs font-mono text-matrix-slate mb-3 tracking-wider uppercase">
                ▸ Professional Summary
              </p>
              <div className="text-xs sm:text-sm text-matrix-slate leading-relaxed break-words">
                <TypingText text={profile.summary} speed={8} showCursor={false} />
              </div>
            </div>

            <div className="border-t border-matrix-slate/20 pt-5 sm:pt-6 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              <a
                href={`mailto:${profile.email}`}
                className="font-mono text-[10px] sm:text-xs text-electric-cyan hover:text-glow-cyan transition-all min-h-[44px] flex items-center break-all"
              >
                [EMAIL] {profile.email}
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] sm:text-xs text-electric-cyan hover:text-glow-cyan transition-all min-h-[44px] flex items-center"
              >
                [GITHUB] malikoliver25
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] sm:text-xs text-electric-cyan hover:text-glow-cyan transition-all min-h-[44px] flex items-center"
              >
                [LINKEDIN] malik-o
              </a>
            </div>
          </div>
        </NeonBorder>
      </div>
    </section>
  );
}
