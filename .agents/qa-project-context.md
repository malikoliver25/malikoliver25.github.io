# QA Project Context — voidprotocol-labs

## Tech stack
- Vite 5 + React 18 + TypeScript 5.5, Tailwind 3.4, GSAP 3.15, Three.js 0.163
- Static deployment: GitHub Pages (Vercel handler `api/chat.ts` for NOVA)
- Email dep: `@emailjs/browser` installed but unused — `TransmissionForm`/`ContactModal` mock-only
- Playwright 1.62.1 (`tests/cross-browser.spec.ts`, `playwright.config.ts`)

## Browser Matrix (cross-browser-testing)
- Source: No first-party analytics yet — global proxy (StatCounter Q3 2026), next-review `2026-12-04`, see `docs/browser-matrix.md`
- P0 (every PR): `chromium`, `webkit`, `mobile-chrome` (Pixel 7), `mobile-safari` (iPhone 15) — desktop + mobile
- P1 (nightly/pre-release): `firefox`, `edge` (`channel: msedge`)
- P2 (weekly): `ipad` (iPad Pro 11)
- Policy: progressive enhancement over pixel-perfect; engines are not brands (`webkit` ≠ real Safari)
- Known divergences: `docs/browser-issues.md` (scroll-behavior, backdrop-filter, clipboard, date, dialog, View Transitions, partitioned cookies)
- Config pins: BrowserStack `browserstack.playwrightVersion` + `client.playwrightVersion` = `1.62.1` when cloud enabled

## email-testing — out of scope
- No signup / password-reset / magic-link / OTP / notification flows. Transmission is UI flag only. Full suite not applicable; if added, default Mailpit `:1025`/`:8025`.

## Previous reviews
- 2026-09-04 interface-review HEAD~1..HEAD `63f4f2d` — Verdict Approve, one MEDIUM writing fix collapsed `useAgentChat.ts:31` roles→job guard (tsc passes)
