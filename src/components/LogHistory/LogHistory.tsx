import { certifications } from "@/data/certs";
import NeonBorder from "@/components/effects/NeonBorder";

export default function LogHistory() {
  return (
    <section id="certs" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <span className="text-electric-cyan font-mono text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase">
            ▸ Verified Data Logs
          </span>
          <div className="flex-1 h-px bg-matrix-slate/20" />
        </div>

        <NeonBorder color="cyan" animate className="p-0">
          <div className="hud-window-header">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-2 h-2 rounded-full bg-neon-yellow shrink-0" />
              <span className="font-mono text-[10px] sm:text-xs text-matrix-slate tracking-wider uppercase truncate">
                Credential Matrix // {certifications.length} VERIFIED
              </span>
            </div>
            <span className="font-mono text-[10px] sm:text-xs text-neon-yellow shrink-0">
              [ALL CLEAR]
            </span>
          </div>

          <div className="overflow-x-auto -mx-px">
            <table className="w-full text-left min-w-[480px]">
              <thead>
                <tr className="border-b border-matrix-slate/20">
                  <th className="font-mono text-[10px] sm:text-xs text-matrix-slate px-3 sm:px-5 py-3 tracking-wider">
                    STATUS
                  </th>
                  <th className="font-mono text-[10px] sm:text-xs text-matrix-slate px-3 sm:px-5 py-3 tracking-wider">
                    CERTIFICATION
                  </th>
                  <th className="font-mono text-[10px] sm:text-xs text-matrix-slate px-3 sm:px-5 py-3 tracking-wider hidden md:table-cell">
                    ISSUER
                  </th>
                  <th className="font-mono text-[10px] sm:text-xs text-matrix-slate px-3 sm:px-5 py-3 tracking-wider hidden md:table-cell">
                    ISSUED
                  </th>
                </tr>
              </thead>
              <tbody>
                {certifications.map((cert, i) => (
                  <tr
                    key={cert.id || cert.name}
                    className={`border-b border-matrix-slate/10 hover:bg-dark-charcoal/50 transition-colors ${
                      i % 2 === 0 ? "bg-dark-charcoal/20" : ""
                    }`}
                  >
                    <td className="px-3 sm:px-5 py-3">
                      <span className="font-mono text-[10px] sm:text-xs text-neon-yellow whitespace-nowrap">
                        {cert.verified ? "[VERIFIED]" : "[PENDING]"}
                      </span>
                    </td>
                    <td className="px-3 sm:px-5 py-3">
                      <span className="font-mono text-[10px] sm:text-xs text-electric-cyan break-words">
                        {cert.name}
                      </span>
                    </td>
                    <td className="px-3 sm:px-5 py-3 hidden md:table-cell">
                      <span className="font-mono text-[10px] sm:text-xs text-matrix-slate whitespace-nowrap">
                        {cert.issuer}
                      </span>
                    </td>
                    <td className="px-3 sm:px-5 py-3 hidden md:table-cell">
                      <span className="font-mono text-[10px] sm:text-xs text-matrix-slate whitespace-nowrap">
                        {cert.issued}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </NeonBorder>
      </div>
    </section>
  );
}
