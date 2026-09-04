# Goal: Portfolio exploratory smoke — NOVA + Transmission still work

**Why agentic:** `agent-knowledge.json` syncs nightly via `sync-github.mjs`; NOVA's answers drift with GitHub data. Scripted selectors would chase copy churn. One NL goal survives a moved button or reworded reply and proves the happy path without maintaining a brittle script. Stable critical paths (checkout/payment) don't exist here — this is the exploratory smoke per skill Fit table.

**START:** `{{SEEDED_URL}}/` (no auth, no seeded DB — static portfolio, fresh profile via `--isolated`)

**GOAL:** Open the NOVA dock, ask “what does malik do”, confirm it answers with Malik’s role, then scroll to the Transmission form and confirm it is usable. Do not invent data; use only what the page shows.

**RULES:**
- Read the accessibility snapshot (`browser_snapshot`) to find controls; act by `ref` (`browser_click` / `browser_type` / `browser_wait_for`). No pixel coordinates.
- Bounded to `{{MAX_STEPS}}` steps. If you cannot progress, FAIL — do not loop, do not retry.
- Use `browser_wait_for` on text, never a fixed sleep.

**SUCCESS (all must hold — assert against the final `browser_snapshot`, not a screenshot):**
- URL still matches `/` or `/#transmission` (no unexpected navigation)
- Snapshot contains text matching /MLOps & AI Infrastructure Engineer/ (NOVA answered from knowledge)
- Snapshot contains the Transmission form heading /TRANSMISSION FORM.*ENCRYPTED/ and a button named /SEND TRANSMISSION/

**NEGATIVE (forbidden state — fail fast if any is true):**
- Still on a URL matching /404 → FAIL
- Snapshot contains `role="alert"` with /Delivery failed|Rate limited/ → FAIL
- Snapshot contains `role="dialog"` with boot overlay still blocking (aria-label="System boot sequence" visible and not dismissed) → FAIL (pointer events intercept)

**OUTPUT:** single JSON `{"passed": true|false, "evidence": "...", "steps": N}` written to `result.json` by the harness (LLM does not decide).
