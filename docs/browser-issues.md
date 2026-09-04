# Known Browser Divergences — voidprotocol-labs

One row per real divergence. Each row's **Test asserts** column checks the **user outcome, not the CSS property**. A row with no workaround and no ticket is an open bug, not a documented issue.

Matrix: `docs/browser-matrix.md` (next-review 2026-12-04). Engine vs brand: `webkit` is Playwright's WebKit engine, not real Safari unless the test ran on BrowserStack real Safari.

| Affected browser | Repro | Workaround / fallback / ticket | Test asserts (user outcome, not CSS) |
|---|---|---|---|
| Safari (WebKit) — all | `scroll-behavior: smooth` is partial / no-op on some programmatic scrolls; GSAP `ScrollTrigger` uses JS scroll | Rely on anchor/nav + native scroll; GSAP reveals use `once:true` and do not gate navigation on animation | Anchor link `#transmission` puts `Transmission` heading in viewport (`toBeInViewport`) — see `tests/cross-browser.spec.ts` "anchor scrolls to transmission" |
| Firefox ≤102 (historical; kept for P2 smoke) | `backdrop-filter: blur(10px)` unsupported, fallback `rgba` needed | CSS already has `background-color: rgba(…)` fallback via `bg-void/20` + `backdrop-blur-[2px]` on mobile backdrop; `-webkit-backdrop-filter` added for Safari | Mobile menu / chat backdrop overlay still readable and modal content visible (`toBeVisible`) — not "backdrop-filter applied" |
| Chromium-only feature | Clipboard API `navigator.clipboard.writeText` requires `grantPermissions` (Chromium only) | Gate `context.grantPermissions(['clipboard-read','clipboard-write'])` on `browserName === 'chromium'`; Firefox/WebKit assert UI feedback `Copied!` instead | `Copy link` button shows `Copied!` text (clipboard write not asserted directly) |
| All (partitioned storage) | Third-party cookie/partitioned storage (`Partitioned` / ITP / State Partitioning) differs per engine for embedded third-party widgets | No third-party widget today; if embedded widget ships, use per-engine iframe test — Chromium keeps partitioned cookie, WebKit/Firefox degrade to same-context fallback | Widget `Start chat` remains usable after reload in all engines (per-engine branch) |
| WebKit | `<input type="date">` renders as plain text input (no native picker) | Branch on `browserName === 'webkit'`: `pressSequentially('2026-06-15')` vs `fill('2026-06-15')`; assert booking outcome | Booking/search results show formatted date `June 15, 2026` (example pattern) — not "input value is ISO" |
| All (captured now) | Cross-document View Transitions: Chrome 126+, Safari 18.2+, Firefox flagged | Progressive enhancement — instant navigation fallback | Navigation completes and destination heading visible regardless of transition (`toHaveURL` + heading `toBeVisible`) |
| `<dialog>` | Safari had `::backdrop` and `form[method=dialog]` quirks | Use `role="dialog"` + focus-trap in app code; not native `<dialog>` today — documented for when dialog adopts | `Confirm deletion` dialog `toBeVisible` / `not.toBeVisible` on Cancel |

**Common-divergence checklist (P0/P1 relevant, Nov 2026):**

- [x] Partitioned cookies / CHIPS — row above + test pattern (no third-party widget yet; fallback defined)
- [x] `<input type="date">` — WebKit fallback pattern documented (no date input in portfolio today; pattern ready)
- [x] Clipboard API — Chromium-gated permission + UI-feedback assert
- [x] `scroll-behavior` — anchor-viewport assert
- [x] `backdrop-filter` — readable fallback assert
- [x] `<dialog>` — open/close visibility assert
- [x] View Transitions (cross-document) — progressive-enhancement assert (same-document now Baseline)

Add rows here instead of re-debugging. Close a row only when the fix ships and the per-engine test passes on the relevant BrowserStack real brand.
