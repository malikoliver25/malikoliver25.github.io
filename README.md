# voidprotocol-labs — Malik Oliver Portfolio

Infrastructural portfolio for **MLOps & Air-Gapped AI** (Malik Oliver — Indianapolis, open to Chicago). Dark editorial system (Void #06080B / Paper #EEF2F7, Space Grotesk / JetBrains Mono), GSAP `ScrollTrigger` reveals, Three.js field, and **NOVA** — a TVA Miss Minutes-style assistant that answers only from live GitHub + site knowledge.

> Live: `https://voidprotocol-labs.github.io` (GitHub Pages) · API: `https://malikoliver25githubio.vercel.app/api/chat` (Vercel)

## What it does

- **Systems / Deployments / Signal Log** — project cards, verified stack, chronology
- **NOVA** (`src/hooks/useAgentChat.ts` + `api/chat.ts`) — chat dock, deterministic `localMockReply` fallback when no LLM key, streaming via Groq/Gemini/Anthropic when keys present; never invents employers/metrics
- **Transmission** (`#transmission`) — contact form (mock-queued, no SMTP in static build)
- **Three.js / GSAP** — field nodes, hairline draws, `is-offscreen` pause, `IntersectionObserver 0.01`

ADR `docs/adr-001-editorial-system.md` documents the Awwwards rebuild (HUD → infrastructural).

## Quick start

```bash
npm ci
npm run dev        # http://localhost:5173
npm run build      # tsc -b && vite build → dist/
npm run preview    # serve dist
npm run typecheck  # tsc --noEmit
```

Node 20+ required (see `.github/workflows/deploy.yml`).

## Environment variables

Copy `.env.example` → `.env.local` (never commit `.env*`):

```bash
cp .env.example .env.local
```

| Var | Where | Notes |
|---|---|---|
| `VITE_AGENT_API` | client (`VITE_` → baked at build) | `http://localhost:8787/api/chat` local, `/api/chat` or `https://…vercel.app/api/chat` prod |
| `VITE_TRANSMISSION_API` | client | `/api/transmission` if you wire SMTP (currently mock) |
| `GROQ_API_KEY` | server only (Vercel) | `gsk_…` — 14k req/day, `llama-3.1-8b-instant` |
| `GEMINI_API_KEY` | server only | `…` — 60 RPM flash |
| `ANTHROPIC_API_KEY` | server only | `sk-ant-…` paid |
| `OPENAI_API_KEY` | server only | `sk-…` paid |

Only `VITE_` vars ship to the browser. Never put `GROQ_API_KEY` etc. in `VITE_`. `.env.production` is gitignored (removed from history in this audit).

## Project structure

```
src/
  App.tsx              39KB — sections + scroll/ boot wiring
  components/          AgentDock, TransmissionForm, Terminal, Projects, ThreeField …
  hooks/useAgentChat.ts  NOVA chat + localMockReply (deterministic, testable)
  data/agent-knowledge.json  live GitHub sync (scripts/sync-github.mjs)
api/chat.ts            Vercel handler — rate limit 20/min, CORS, Groq→Gemini→Anthropic fallback
scripts/               build-knowledge.mjs, sync-github.mjs, detect_injection.py, mobile_nova_visual.py
tests/                 cross-browser.spec.ts (P0 every PR), ai-system, agentic smoke
docs/                  adr-001, browser-matrix.md, browser-issues.md
```

## Testing

| Suite | Command | When |
|---|---|---|
| **Cross-browser P0** (every PR) | `npx playwright test --project=chromium --project=webkit --project=mobile-chrome --project=mobile-safari` | `ubuntu-latest` CI (`docs/browser-matrix.md` next-review 2026-12-04) |
| **Full matrix** | `npx playwright test` (7 projects) | nightly |
| **Typecheck** | `npm run typecheck` | pre-push |
| **Mobile visual smoke** (local) | `npm run test:mobile-visual` (Pixel 7 / iPhone 15 / iPad Pro 11 viewports, NOVA + Transmission) | `mac12` helper — complements P0 where webkit 1.62.1 unavailable |
| **Agentic smoke** | `node scripts/run-agent-goal.mjs --config agent-run.config.json` → `result.json {passed:bool}` | `pull_request` (`agentic-smoke.yml` gates on `jq .passed`) |
| **Injection detector** | `python3 scripts/detect_injection.py --selftest` | pre-agent gate |

`playwright.config.ts` pins `1.62.1`; BrowserStack `browserstack.playwrightVersion` + `client.playwrightVersion` match. `docs/browser-issues.md` logs known divergences (scroll-behavior, backdrop-filter, clipboard, View Transitions).

## Security

- No hardcoded secrets — all keys via `process.env` (verified in audit)
- `api/chat.ts` rate limit `Map<ip, number[]>` (20/min), CORS `Allow-Origin *` + `OPTIONS 204`, method check `405 POST only`
- `TransmissionForm` validates `name/email/message` both client and server (`api/transmission.ts` if enabled)
- `detect_injection.py` screens untrusted RAG/tool output before agent acts (`--selftest` PASS)
- `npm audit` — see below

## Performance

- `vite build` chunk 818KB (234KB gzip) — consider `manualChunks` for Three/GSAP if >500KB warning persists
- GSAP `ScrollTrigger once:true`, Three.js `is-offscreen` pause, `data-animation-active` gate
- Images via Aura.build (`IMAGE_CREDITS.md`), `logo.glb` 7.3MB not rendered in current build (deferred)

## Deployment

Push to `main` → `.github/workflows/deploy.yml` → `actions/upload-pages-artifact` `dist` → GitHub Pages. `sync-knowledge.yml` nightly syncs `agent-knowledge.json` from GitHub API.

## Credits

Aura.build abstract assets (no people) — see `IMAGE_CREDITS.md`. Fonts Space Grotesk / JetBrains Mono / Inter (OFL/Apache 2.0).
