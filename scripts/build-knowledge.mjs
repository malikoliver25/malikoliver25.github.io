#!/usr/bin/env node
// Generates src/data/agent-knowledge.json from canonical src/data/*
// Run: node scripts/build-knowledge.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outPath = path.join(root, 'src/data/agent-knowledge.json');

function readTsExport(file, exportName) {
  const src = fs.readFileSync(path.join(root, file), 'utf8');
  // crude: extract JSON-like array between export const ... = [
  // For profile (single object), extract object
  return src;
}

function parse() {
  // Import via dynamic JSON extraction — easier: read raw TS and eval-ish
  // Instead, we directly import the compiled data by reading TS as text and converting
  // Simple approach: use filesystem to require the TS via jiti? Avoid dep — just regex parse.

  // Profile
  const profileSrc = fs.readFileSync(path.join(root, 'src/data/profile.ts'), 'utf8');
  const projectsSrc = fs.readFileSync(path.join(root, 'src/data/projects.ts'), 'utf8');
  const skillsSrc = fs.readFileSync(path.join(root, 'src/data/skills.ts'), 'utf8');
  const certsSrc = fs.readFileSync(path.join(root, 'src/data/certs.ts'), 'utf8');

  return { profileSrc, projectsSrc, skillsSrc, certsSrc };
}

// Simpler: just concatenate source text as knowledge chunks
const { profileSrc, projectsSrc, skillsSrc, certsSrc } = parse();

const recruiterStatic = `RECRUITER FAQ — derived from site data (projects + skills):
Q: What coding language does Malik use the most?
A: Python — leads for MLOps/AI (LangGraph, FastAPI, vLLM) plus TypeScript for the portfolio terminal. GitHub live count via sync-github shows Python strongest by repo count.
Q: Based on all of Malik's work what is his primary/strongest role?
A: Primary: MLOps & AI Infrastructure Engineer. Strongest: MLOps/AI Orchestration — Level 5 in Kubernetes, Docker, CI/CD, Python, FastAPI, LangGraph, Agentic Architecture, vLLM.
Q: Is Malik good at QA/AI Engineering/MLOps/DevOps?
A: QA: TDD 4, Pytest 5, Playwright 3 — disciplined. AI Eng: LangGraph 5, RAG 4 — core strength. MLOps: vLLM 5, K8s 5 — strongest. DevOps: K8s/Docker/CI/CD 5, Terraform 4 — strong.
Q: What is Malik's largest/best project?
A: SENTINEL-CORE (graph security orchestration) for impact, MTM-INDUSTRIAL-AI (CMMC air-gapped Llama Vision) for production. See projects.ts for tech stacks.
Q: Has Malik made media sites or games?
A: Yes — jellyfin-web (media client fork), netrunner-deck/portfolio terminal HUDs with GSAP/Three.js streaming. No AAA games but game-like UIs.
Q: What is Malik's weakest point?
A: Honest: his 3s — Airflow 3, Redis 3, Playwright 3, Ragas 3 vs his 5s. Capable but not specialist there; ramps fast via TDD.`;

const doc = {
  generatedAt: new Date().toISOString(),
  source: 'src/data/*',
  note: 'Derived — do not edit manually. Run node scripts/build-knowledge.mjs',
  knowledge: [
    { id: 'profile', content: profileSrc.slice(0, 8000) },
    { id: 'projects', content: projectsSrc.slice(0, 12000) },
    { id: 'skills', content: skillsSrc.slice(0, 12000) },
    { id: 'certs', content: certsSrc.slice(0, 8000) },
    { id: 'recruiter', content: recruiterStatic },
    {
      id: 'routing',
      content: `Availability: Active, Indianapolis (open to Chicago). Contact via Transmission form. Rules: Never invent employers/metrics. If unknown, say "Hmm, I don't have that in my clock-face yet — hit Transmission and I'll nudge Malik directly! :)"`
    }
  ]
};

fs.writeFileSync(outPath, JSON.stringify(doc, null, 2));
console.log(`Wrote ${outPath} (${doc.knowledge.length} chunks)`);
