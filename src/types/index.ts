export interface Profile {
  handle: string;
  realName: string;
  title: string;
  location: string;
  openToRelocation: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  summary: string;
  status: string;
  clearance: string;
}

export interface SkillCategory {
  category: string;
  icon: string;
  skills: Skill[];
}

export interface Skill {
  name: string;
  level: number;
}

export interface Certification {
  name: string;
  issuer: string;
  issued: string;
  id?: string;
  verified: boolean;
}

export interface Project {
  codename: string;
  name: string;
  description: string;
  url: string;
  techStack: string[];
  status: "ACTIVE" | "DEPLOYED" | "MAINTENANCE";
}

export interface TerminalCommand {
  name: string;
  description: string;
  handler: (args: string) => string[];
}

export interface TerminalLine {
  id: number;
  type: "input" | "output" | "system";
  content: string;
}
