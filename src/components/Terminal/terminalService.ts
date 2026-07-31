import type { TerminalCommand } from "@/types";
import { profile } from "@/data/profile";
import { skillCategories } from "@/data/skills";
import { certifications } from "@/data/certs";
import { projects } from "@/data/projects";

const COMMANDS: TerminalCommand[] = [
  {
    name: "whoami",
    description: "Display operator identity",
    handler: () => [
      `╔══════════════════════════════════════════════╗`,
      `║  OPERATOR: ${profile.realName}`,
      `║  HANDLE: ${profile.handle}`,
      `║  ROLE: ${profile.title}`,
      `║  STATUS: ${profile.status} // CLEARANCE: ${profile.clearance}`,
      `║  LOC: ${profile.location}`,
      `╚══════════════════════════════════════════════╝`,
      ``,
      profile.summary,
    ],
  },
  {
    name: "skills",
    description: "Display cyberware loadout",
    handler: () => {
      const lines: string[] = ["┌─── CYBERWARE LOADOUT ───────────────────────┐"];
      for (const cat of skillCategories) {
        lines.push(`│`);
        lines.push(`│ ${cat.icon} ${cat.category}`);
        for (const skill of cat.skills) {
          const bar = "█".repeat(skill.level) + "░".repeat(5 - skill.level);
          lines.push(`│   ${skill.name.padEnd(30)} [${bar}]`);
        }
      }
      lines.push(`│`);
      lines.push(`└──────────────────────────────────────────────┘`);
      return lines;
    },
  },
  {
    name: "certs",
    description: "Display verified certifications",
    handler: () => {
      const lines: string[] = [
        "┌─── VERIFIED DATA LOGS ─────────────────────┐",
        "│",
      ];
      for (const cert of certifications) {
        lines.push(`│ [VERIFIED] ${cert.name}`);
        lines.push(`│   └─ ${cert.issuer} // ${cert.issued}`);
      }
      lines.push("│");
      lines.push(`└──────────────────────────────────────────────┘`);
      return lines;
    },
  },
  {
    name: "projects",
    description: "List active mission briefs",
    handler: () => {
      const lines: string[] = [
        "┌─── ACTIVE GIGS ────────────────────────────┐",
        "│",
      ];
      for (const p of projects) {
        lines.push(`│ ◈ ${p.codename} [${p.status}]`);
        lines.push(`│   ${p.name}`);
        lines.push(`│   ${p.url}`);
        lines.push(`│`);
      }
      lines.push(`└──────────────────────────────────────────────┘`);
      return lines;
    },
  },
  {
    name: "contact",
    description: "Display comm endpoints",
    handler: () => [
      "┌─── COMM ENDPOINTS ─────────────────────────┐",
      "│",
      `│ EMAIL:   ${profile.email}`,
      `│ PHONE:   ${profile.phone}`,
      `│ GITHUB:  ${profile.github}`,
      `│ LINKEDIN: ${profile.linkedin}`,
      "│",
      "└──────────────────────────────────────────────┘",
    ],
  },
  {
    name: "clear",
    description: "Clear terminal output",
    handler: () => [],
  },
  {
    name: "help",
    description: "Display available commands",
    handler: () => {
      const lines: string[] = [
        "┌─── AVAILABLE COMMANDS ─────────────────────┐",
        "│",
      ];
      for (const cmd of COMMANDS) {
        lines.push(`│ ${cmd.name.padEnd(14)} ${cmd.description}`);
      }
      lines.push("│");
      lines.push(`└──────────────────────────────────────────────┘`);
      return lines;
    },
  },
];

export function executeCommand(input: string): string[] {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return [];

  const [cmdName, ...args] = trimmed.split(/\s+/);
  const command = COMMANDS.find((c) => c.name === cmdName);

  if (!command) {
    return [
      `bash: ${cmdName}: command not found`,
      `Type 'help' for available commands.`,
    ];
  }

  return command.handler(args.join(" "));
}

export function getCommandList() {
  return COMMANDS.map((c) => c.name);
}
