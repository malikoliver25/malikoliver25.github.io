import { projects } from "@/data/projects";
import NeonBorder from "@/components/effects/NeonBorder";

export default function ProjectCards() {
  return (
    <section id="missions" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <span className="text-electric-cyan font-mono text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase">
            ▸ Active Gigs
          </span>
          <div className="flex-1 h-px bg-matrix-slate/20" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {projects.map((project) => (
            <NeonBorder key={project.codename} color="cyan" animate className="p-0 project-card">
              <div className="hud-window-header">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      project.status === "ACTIVE"
                        ? "bg-neon-yellow animate-pulse"
                        : "bg-electric-cyan"
                    }`}
                  />
                  <span className="font-mono text-[10px] sm:text-xs text-neon-yellow tracking-wider truncate">
                    {project.codename}
                  </span>
                </div>
                <span
                  className={`font-mono text-[9px] sm:text-[10px] tracking-wider shrink-0 ${
                    project.status === "ACTIVE"
                      ? "text-neon-yellow"
                      : "text-electric-cyan"
                  }`}
                >
                  {project.status}
                </span>
              </div>

              <div className="p-4 sm:p-6 flex flex-col h-full">
                <h3 className="font-heading text-base sm:text-lg font-bold text-white mb-2 break-words">
                  {project.name}
                </h3>

                <p className="font-mono text-[10px] sm:text-xs text-matrix-slate leading-relaxed mb-4 flex-1 break-words">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 text-[9px] sm:text-[10px] font-mono text-electric-cyan border border-electric-cyan/30 rounded-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-xs text-neon-yellow hover:text-glow-yellow transition-all group min-h-[44px]"
                >
                  <span>ACCESS REPO</span>
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </a>
              </div>
            </NeonBorder>
          ))}
        </div>
      </div>
    </section>
  );
}
