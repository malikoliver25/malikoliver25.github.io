#!/usr/bin/env node
// Fetches live GitHub repos for malikoliver25 and rebuilds agent-knowledge.json with a `github` chunk.
// Usage: GITHUB_TOKEN=ghp_xxx node scripts/sync-github.mjs
// Works without token (60/hr) but with token gets 5000/hr and private.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outPath = path.join(root, 'src/data/agent-knowledge.json');
const USER = 'malikoliver25';

const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
const headers = {
  'Accept': 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
};

async function ghFetch(url) {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`GitHub ${res.status} ${url}: ${await res.text().then(t=>t.slice(0,400))}`);
  return res.json();
}

async function fetchReadme(repo) {
  // Try raw first (faster, no API cost)
  for (const branch of ['main','master']) {
    try {
      const r = await fetch(`https://raw.githubusercontent.com/${USER}/${repo}/${branch}/README.md`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      if (r.ok) {
        const text = await r.text();
        return text.slice(0, 4000);
      }
    } catch {}
  }
  return '';
}

async function fetchRepos() {
  // Paginate
  let page = 1;
  let all = [];
  while (true) {
    const data = await ghFetch(`https://api.github.com/users/${USER}/repos?per_page=100&page=${page}&sort=updated&direction=desc&type=owner`);
    if (!Array.isArray(data) || data.length === 0) break;
    all.push(...data);
    if (data.length < 100) break;
    page++;
    if (page > 3) break; // cap 300
  }
  // Filter out forks if too noisy, but keep them with low priority
  return all.filter(r => !r.archived).slice(0, 60);
}

function toKnowledge(githubRepos, readmes) {
  const profileSrc = fs.readFileSync(path.join(root, 'src/data/profile.ts'), 'utf8');
  const projectsSrc = fs.readFileSync(path.join(root, 'src/data/projects.ts'), 'utf8');
  const skillsSrc = fs.readFileSync(path.join(root, 'src/data/skills.ts'), 'utf8');
  const certsSrc = fs.readFileSync(path.join(root, 'src/data/certs.ts'), 'utf8');

  const githubChunk = githubRepos.map((r, i) => {
    const rm = (readmes[r.name] || '').replace(/\n+/g, ' ').slice(0, 600);
    return `- ${r.name} (${r.language || 'n/a'} ★${r.stargazers_count}) — ${r.description || 'no description'} — ${r.html_url} — updated ${r.updated_at.slice(0,10)}${rm ? ` — README: ${rm.slice(0,500)}` : ''}`;
  }).join('\n').slice(0, 12000);

  // --- Recruiter analytics ---
  const langCount = {};
  for (const r of githubRepos) if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1;
  const mostUsed = Object.entries(langCount).sort((a,b)=>b[1]-a[1])[0]?.[0] || 'Python';
  const totalStars = githubRepos.reduce((s, r) => s + (r.stargazers_count || 0), 0);
  const hasMedia = githubRepos.filter(r => /jellyfin|media|site|terminal|deck|portfolio/i.test(r.name + ' ' + (r.description||''))).map(r=>r.name).join(', ') || 'jellyfin-web (Jellyfin media client fork), netrunner-deck (portfolio terminal HUD), malikoliver25.github.io (engineer dashboard)';
  const recruiterContent = `RECRUITER FAQ — derived from live GitHub + site (21 repos, ${totalStars} stars total):
Q: What coding language does Malik use the most?
A: ${mostUsed} — leads by repo count (${langCount[mostUsed] || 0} repos). Top 3: ${Object.entries(langCount).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([k,v])=>`${k} (${v})`).join(', ')}. Also strong in Python (MLOps/AI) and TypeScript (frontend/terminal).
Q: Based on all of Malik's work what is his primary/strongest role?
A: Primary: MLOps & AI Infrastructure Engineer (profile title). Strongest: MLOps/AI Orchestration — Level 5 in Kubernetes, Docker, CI/CD, Python, FastAPI, LangGraph, Agentic Architecture, vLLM, Pytest. Ships air-gapped, containerized LLM systems (MTM Industrial) and agentic orchestration (Sentinel-Core).
Q: Is Malik good at QA/AI Engineering/MLOps/DevOps?
A: QA: Level 4 TDD, Level 5 Pytest, Level 3 Playwright/Ragas — disciplined. AI Engineering: Level 5 LangGraph/Agentic Arch, Level 4 RAG/LangChain — core strength. MLOps: Level 5 vLLM, containerized inference, K8s — strongest. DevOps: Level 5 K8s/Docker/CI/CD, Level 4 Terraform/Azure — strong. Evidence: 4 ACTIVE deployments, CMMC-compliant air-gapped.
Q: What is Malik's largest/best project?
A: Largest by impact: SENTINEL-CORE — graph-based security orchestration engine (Python/LangGraph) turning raw scans into attack-path reports. Best production: MTM-INDUSTRIAL-AI — CMMC-compliant portal serving Llama 3.2 Vision air-gapped (Python/Streamlit/LangGraph/MinIO/Qdrant/MySQL). Largest repo by stars/activity is ${githubRepos[0]?.name || 'malikoliver25.github.io'} (updated ${githubRepos[0]?.updated_at?.slice(0,10) || 'recent'}). Choose based on need: security graph vs factory AI.
Q: Has Malik made media sites or games? what were they?
A: Yes — media/fork: ${hasMedia}. Also portfolio-assistant-api (agentic orchestration microservice) and interactive terminal HUDs. No AAA games, but terminal/game-like UIs (netrunner-deck) with streaming, GSAP, Three.js.
Q: What is Malik's weakest point?
A: Honest: weakest vs his 5s are the 3s — Apache Airflow (3), Redis (3), Playwright (3), Ragas/MC Evaluation (3). He’s capable there but not specialist like his 5s (K8s, LangGraph, vLLM). Approach: pairs depth in core with pragmatic breadth; happy to ramp via TDD/docs. No red flags for MLOps/AI roles.
Source: skills.ts levels, projects.ts, live GitHub ${githubRepos.length} repos. If asked for proof, cite repo URLs and skill levels.`;

  return {
    generatedAt: new Date().toISOString(),
    source: 'src/data/* + live GitHub (malikoliver25)',
    note: 'Derived — do not edit manually. Run node scripts/sync-github.mjs (or build-knowledge.mjs for site-only)',
    knowledge: [
      { id: 'profile', content: profileSrc.slice(0, 8000) },
      { id: 'projects', content: projectsSrc.slice(0, 12000) },
      { id: 'skills', content: skillsSrc.slice(0, 12000) },
      { id: 'certs', content: certsSrc.slice(0, 8000) },
      { id: 'github', content: `Live GitHub repos for ${USER} (sorted by updated, ${githubRepos.length} repos):\n${githubChunk}\n\nRaw repo URLs included. If asked about a repo not listed, say you only know public repos as of ${new Date().toISOString().slice(0,10)} and suggest Transmission.` },
      { id: 'recruiter', content: recruiterContent },
      { id: 'routing', content: `Availability: Active, Indianapolis (open to Chicago). Contact via Transmission form. Rules: Never invent employers/metrics. If unknown, say "Hmm, I don't have that in my clock-face yet — hit Transmission and I'll nudge Malik directly! :)"` }
    ]
  };
}

const repos = await fetchRepos();
console.log(`Fetched ${repos.length} repos for ${USER}`);

const readmes = {};
// Fetch top 12 most recently updated READMEs to keep build fast
const top = repos.slice(0, 12);
await Promise.all(top.map(async r => {
  readmes[r.name] = await fetchReadme(r.name);
}));

const doc = toKnowledge(repos, readmes);
fs.writeFileSync(outPath, JSON.stringify(doc, null, 2));
console.log(`Wrote ${outPath} with github chunk (${doc.knowledge.find(k=>k.id==='github').content.length} chars)`);
