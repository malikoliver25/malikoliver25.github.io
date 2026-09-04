# ADR 001 — Editorial Hairline System (Awwwards rebuild)

Date: 2026-09-04
Status: Accepted
Context: `7fbf9d5` cyberpunk HUD (Orbitron / neon / CRT) → product portfolio for MLOps & air-gapped AI. Needs to read as infrastructural, not gamer, while preserving `NETRUNNER_M4LIK` identity.

Decision:
- Palette `Void #06080B / Ink #0E131A / Panel #141A23 / Hairline #1C232E / Mist #8B9AB1 / Paper #EEF2F7` + accents `Signal #FFE81A` (primary fill) + `Cyan #00E5FF` (focus/ring) — dark-only, semantic tokens directly (no primitive layer for 6-color scope).
- Typography `Space Grotesk` (display) + `Inter` (body) + `JetBrains Mono` (mono) — `display-hero clamp(34px,6vw,62px)`, `heading-section`, `label` semantic scale.
- Motion grammar: GSAP `ScrollTrigger once:true` word-by-word `power3.out` stagger, hairline `scaleX` draw, native scroll (Lenis added then removed per slow-scroll feedback), `is-offscreen` pause + Three.js `IntersectionObserver 0.01` + `data-animation-active`.
- Imagery: Aura.build abstract/architecture only (no people) — `IMAGE_CREDITS.md` documents 6 assets and why each matches (pyramid = attack graph, ring city = air-gapped enclosure, tiny house = edge container, wave = streaming).
- Metrics: `99.98%`/`P95 <80ms` retitled `TARGET — design target` until linked to benchmark; `STACK • VERIFIED` static, no `LIVE` pulse.

Consequences:
- `tailwind.config.js` semantic `fontSize` added; hard-coded `text-[…]` migrating incrementally.
- `framer-motion` / `@google/model-viewer` retained in `package.json` for now (YAGNI deferred — see Brooks Lint).
- `logo.glb` remains in `public/` history but not rendered.

Alternatives considered: Keep neon HUD (rejected — reads as gaming, not manufacturing), Lenis inertial scroll (rejected — felt slow), Unsplash factory photos (replaced — random).
