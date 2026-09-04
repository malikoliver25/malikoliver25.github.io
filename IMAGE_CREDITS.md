# Image Credits

## Aura.build Assets — matched to content, no people

All previews use [Aura.build Assets](https://www.aura.build/assets) (abstract/architecture, commercially usable). No portraits/headshots per owner request. Each asset chosen for narrative fit, not decoration.

| Usage | Aura Asset | URL (1600w) | Why it matches |
|---|---|---|---|
| Hero fallback — reduced-motion / offscreen poster | Abstract neon light wave on black | `https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/fa51902b-c2a4-4c33-a96e-a8f1ef67edc6_1600w.jpg` | Light wave = orchestration field flow; dark field matches `Void #06080B`, keeps negative space for headline |
| Field Node 03 thumb (96×72, MTM edge) | Isometric 3D Render of Modern Tiny House | `https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/fb6415fd-bf4d-4ccf-8e9d-7ab445e99207_1600w.jpg` | Tiny house = modular, containerized edge node; isolated, deployable, matches "air-gapped, no egress" |
| SENTINEL-CORE preview | Futuristic Deconstructed Pyramid in Grayscale | `https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/724142aa-44a6-48d3-9cf3-761e00d05b78_1600w.jpg` | Deconstructed geometry = graph-based attack paths and agentic workflow steps |
| MTM-INDUSTRIAL-AI preview | Ring-Shaped Futuristic City Against Starry Night | `https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/5ee0a38a-b5d3-4531-8793-98beed4af162_1600w.jpg` | Enclosed ring = air-gapped perimeter; starry night = no external APIs, matches CMMC-compliant enclosure |
| PORTFOLIO-ASSISTANT preview | Abstract Blue Wave at Dusk | `https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/e534354d-c5f2-4399-a1d9-2f50338e8c47_1600w.jpg` | Wave = async streaming + deterministic routing; calm dusk = low-latency flow |
| NETRUNNER-DECK preview | Modern glass villa at dusk in lush landscape | `https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/005600e5-f6ab-4e59-bc86-eaeb02797dfa_1600w.jpg` | Clean glass structure = terminal HUD shell; dusk glass = dark editorial interface |

**Handling**
- Fallback: 16:9 `object-cover opacity-60`, `loading="eager"`
- Field thumb: 4:3 `96×72` eager, `rounded-[8px] border-white/10`
- Deployment strips: 16:9 `h-[110px]` `object-cover opacity-70 grayscale → hover:grayscale-0`

**Other assets**
- `logo.glb` (`public/logo.glb`) — local `model-viewer` asset from `7fbf9d5`, not rendered in current build.
- Fonts: `Space Grotesk`, `JetBrains Mono`, `Inter` via Google Fonts (OFL / Apache 2.0).
- Former Unsplash URLs and `photo-1507003211169` portrait removed (0 `unsplash` remaining); prior `IMAGE_CREDITS.md` Unsplash table archived in git history.

To swap, replace `src/App.tsx` URLs (`_1600w` → `_3840w` for 4K) and update this table.
