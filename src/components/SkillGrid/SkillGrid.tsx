import { skillCategories } from "@/data/skills";
import NeonBorder from "@/components/effects/NeonBorder";

function SkillBar({ level }: { level: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={`w-2.5 sm:w-3 h-1.5 rounded-sm transition-colors duration-300 ${
            i < level
              ? "bg-electric-cyan shadow-[0_0_4px_rgba(0,240,255,0.5)]"
              : "bg-matrix-slate/20"
          }`}
        />
      ))}
    </div>
  );
}

export default function SkillGrid() {
  return (
    <section id="skills" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <span className="text-electric-cyan font-mono text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase">
            ▸ Cyberware Loadout
          </span>
          <div className="flex-1 h-px bg-matrix-slate/20" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {skillCategories.map((cat, idx) => (
            <NeonBorder
              key={cat.category}
              color={idx % 2 === 0 ? "cyan" : "yellow"}
              animate
              className="p-0"
            >
              <div className="hud-window-header">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-neon-yellow text-base sm:text-lg shrink-0">{cat.icon}</span>
                  <span className="font-mono text-[10px] sm:text-xs text-matrix-slate tracking-wider uppercase truncate">
                    {cat.category}
                  </span>
                </div>
                <span className="font-mono text-[10px] sm:text-xs text-electric-cyan shrink-0">
                  {cat.skills.length} MODULES
                </span>
              </div>

              <div className="p-3 sm:p-5 space-y-2.5 sm:space-y-3">
                {cat.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="flex items-center justify-between gap-2 group"
                  >
                    <span className="font-mono text-[10px] sm:text-xs text-matrix-slate group-hover:text-electric-cyan transition-colors truncate min-w-0">
                      {skill.name}
                    </span>
                    <SkillBar level={skill.level} />
                  </div>
                ))}
              </div>
            </NeonBorder>
          ))}
        </div>
      </div>
    </section>
  );
}
