# Browser Matrix — voidprotocol-labs

**Source:** No first-party analytics yet (portfolio launches on GH Pages, no GA/PP yet). Matrix is a **global-baseline proxy** (StatCounter GlobalStats Q3 2026 + portfolio audience assumption: engineers on desktop + mobile). Replace with 90-day first-party data once `gtag`/Plausible ships. This *is* the analytics-driven decision — we document proxy + review date so we don't pretend Chrome-only is enough.

**Policy:** Progressive enhancement over pixel-perfect. "Works" = core task completes, content readable, layout usable at 320px/200% zoom. Shadows (`shadow-[0_20px_60px_rgba(0,0,0,0.45)]`), `backdrop-blur-[2px]`, `animation` timing may differ — not failures.

**Engines are not brands:** Playwright's `webkit` ≠ Safari, `chromium` ≠ Chrome. This file reports engine coverage unless a cloud row (real Safari on BrowserStack) ran.

**Next review:** `2026-12-04` (quarterly). Tracked via this file's `next-review`; bump `last-reviewed` when refreshed.

| Browser (engine) | Version | Platform | Traffic proxy | Tier | Coverage | Notes |
|---|---|---|---|---|---|---|
| Chrome (Chromium) | Latest | Windows | 34% | **P0** | Full suite | Largest share |
| Chrome (Chromium) | Latest | Android | 15% | **P0** | Full suite | Mobile viewport, touch |
| Safari (WebKit) | Latest | iOS | 14% | **P0** | Full suite | Mobile Safari quirks, viewport units (`dvh`), overscroll |
| Safari (WebKit) | Latest | macOS | 11% | **P0** | Full suite | WebKit-specific: `backdrop-filter`, `scroll-behavior`, `:has()` perf |
| Chrome (Chromium) | Latest | macOS | 12% | **P0** | Full suite | Second desktop |
| Firefox (Gecko) | Latest | Windows | 5% | **P1** | Smoke + critical paths | Gecko divergences |
| Edge (Chromium) | Latest | Windows | 4% | **P1** | Smoke + critical paths | Chromium but UA/policy/fonts differ |
| Samsung Internet | Latest | Android | 3% | **P1** | Smoke | Chromium fork, lagging engine |
| Firefox | Latest | macOS | 1.5% | **P2** | Smoke |  |
| Chrome N-1 | N-1 | Windows | 1.2% | **P2** | Smoke | Previous major |

**Version strategy:** Latest always. N-1 only for P0 where proxy shows >1% on older. Firefox ESR only if enterprise segment appears. Beta/Canary not tested.

**When to run:**
- P0 (Chromium, WebKit desktop + mobile-chrome, mobile-safari): every PR + every deploy.
- P1 (Firefox Windows, Edge): nightly + pre-release.
- P2 (Firefox macOS, Chrome N-1): weekly + pre-release.

**Local vs cloud:**
- Local CI (`ubuntu-latest`): Playwright bundled engines — reports as `chromium`/`webkit`/`firefox`, **not** "Chrome/Safari".
- Cloud (when enabled): BrowserStack real Safari `Sonoma` + real Chrome `Windows 11` — then we may claim brand coverage. Pin `browserstack.playwrightVersion` + `client.playwrightVersion` to `1.62.1` (installed).

---
*Last reviewed: 2026-09-04 · Next review: 2026-12-04*
