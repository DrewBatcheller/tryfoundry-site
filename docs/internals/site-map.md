# Site Map

<!-- verified: 2026-04-27 against commit 4c3ae0a -->

Atlas of the four pages, the section structure of `index.html`, the cross-page invariants, the runtime patterns, and the house-style rules. Read this before acting on a vague directive ("do X on the homepage", "update the download CTA", "add a new screenshot").

## Pages

| File | What it is |
|------|------------|
| `index.html` | Landing page. Sections detailed below. |
| `build-notes.html` | Two-tab page: full release notes (every shipped version) + upcoming features (numbered, grouped by major version). |
| `faq.html` | Single-column FAQ accordion. Pre-install questions: API key, code privacy, lock-in, platforms, SmartScreen warning, telemetry. |
| `privacy.html` | Privacy policy. |

All four are standalone HTML with inline CSS + JS. No shared header/footer template — nav and footer are duplicated in each file (see Cross-page invariants).

## `index.html` section atlas

Sections in document order. Line numbers as of the verified commit; if drift, search for the structural anchor.

| Friendly name | ~Line | Structural anchor | What's inside |
|---|---|---|---|
| Hero | 961 | `<section class="hero">` | Beta badge, h1, tagline, primary download CTA + secondary "Build Notes" button. |
| Product Showcase | 980 | `<!-- Product showcase -->` followed by `<section style="padding: 32px 0 16px;">` | Hero-extension visual: team-page screenshot with caption. |
| Changelog | 998 | `<section id="whats-new">` | "Three most recent" release entries, mirrored from `build-notes.html`. Top entry has `open` attribute. Linked to full build notes. |
| Forge Showcase | 1140 | `<!-- Forge editor showcase -->` followed by `<section class="forge-section">` | "Every surface. One editor." — main hero shot of Forge plus a 2x3 grid of bucket screenshots with captions. |
| Meet Scholar | 1187 | `<!-- Meet Scholar -->` | Scholar persona introduction. |
| The Pitch | 1201 | `<!-- The pitch -->` | Value-prop block. |
| What it builds | 1222 | `<section id="what">` | What Foundry creates after running. |
| Audiences | 1260 | `<section id="audiences">` | "Solo and team work" — split for solo devs vs teams. |
| Foundations | 1298 | `<section id="features">` | Feature grid: open architecture, etc. |
| The flow | 1332 | `<section>` containing eyebrow "The flow" | Numbered step cards: Analyze → Scope → Interview → ... |
| Beta note | 1381 | `<section class="beta-note">` | Footer-adjacent disclosure about the beta period. |
| Lightbox overlay | 1411 | `<div id="lightbox">` | Hidden overlay element + script (auto-attaches to image selectors below). |

When asked to "edit the X section," map the friendly name to its structural anchor and grep for that — line numbers drift on every meaningful edit.

## Cross-page invariants

These are duplicated across all four pages. When one changes, all four must change:

- **Nav** — brand link, "Build Notes" link, "FAQ" link, primary "Download" link. The Download link must point at `https://github.com/try-foundry/tryfoundry-releases/releases/latest` (NOT a same-page anchor — that bug shipped once and got fixed).
- **Footer** — privacy + ko-fi + contact + © line.
- **Beta badge** wording on `index.html` only — currently `v1.1.0 Beta · Live`. "Live" is evergreen-correct; bump only the version part on a release.

## Patterns

### Download-link rewriter (`index.html` only)

A small `<script>` at the bottom of `index.html` (~line 1417 area, after the lightbox script) selects every `<a href="...tryfoundry-releases/releases/latest">` and rewrites the href to the direct `.exe` asset URL pulled from the GitHub API at page load. This makes the download a single-click direct download instead of a redirect to the GitHub release page.

**The contract:** every download CTA on `index.html` must point at the `releases/latest` URL. The rewriter only catches `href*="tryfoundry-releases/releases/latest"`. New buttons that bypass this URL won't get rewritten and will open the GitHub page instead of triggering a download.

The rewriter does not exist on the subpages (`build-notes.html`, `faq.html`, `privacy.html`). Their nav Download link points at the same `releases/latest` URL, opens in a new tab, and lands the user on the GitHub release page where the `.exe` is the top asset. Acceptable subpage UX; do not propose a click-jack-style direct-download from subpages without weighing the maintenance cost of duplicating the rewriter.

### Release-notes mirror

The full release list lives in `build-notes.html` under the Release Notes tab (`<section class="tab-panel active" data-panel="releases">`). The "three most recent" block on `index.html` (the Changelog section, `<section id="whats-new">`) is a manual mirror of the top three entries.

When a new version ships:
1. Add a new `<details class="release-item" open>` to `build-notes.html` at the top of the tab.
2. Mirror it to `index.html`'s Changelog section. Remove the `open` attribute from the previous top entry in both files (only the newest is open by default).
3. Optional: trim the oldest entry off `index.html`'s Changelog if you want to keep a strict 3-entry visible block. `build-notes.html` keeps the full history.

The full release runbook is in the app repo: `docs/internals/release-process.md` (Step 5 covers site updates).

### Upcoming-features list (`build-notes.html` only)

Lives in the Upcoming Features tab (`<section class="tab-panel" data-panel="upcoming">`). Numbered `<div class="upcoming-item">` cards, grouped by major version with eyebrow headers ("Foundry 2.0", "Foundry 3.0").

When adding an item: pick a version group, give it the next number, write a 1–2 sentence description. **Mind the no-emdashes rule** — past additions have used emdashes and required cleanup.

### Lightbox auto-attach

Script at the bottom of `index.html` selects images via `SHOT_SELECTORS`:

```js
const SHOT_SELECTORS = [
  '.showcase-frame img',
  '.forge-hero-shot img',
  '.forge-shot img',
  'img.artifact-screenshot',
  '.release-shot img',
];
```

Any `<img>` matching one of those selectors gets a click-to-expand lightbox handler attached on page load. Decorative images (robot illustrations, icons) deliberately don't match — they shouldn't expand.

When adding a new screenshot to `index.html`: drop the file in `screenshots/`, then place the `<img>` inside one of the matching containers (`.showcase-frame`, `.forge-hero-shot`, `.forge-shot`) OR give it `class="artifact-screenshot"` directly. The lightbox attaches automatically — no per-image wiring.

If a new image type should be expandable, add its selector to `SHOT_SELECTORS` rather than adding inline `onclick` handlers.

## House-style conventions

- **No emdashes anywhere.** Replace with comma, period, colon, parens, semicolon, or rephrase. (`build-notes.html` carried 4 emdashes through a release; we strip them on sight.)
- **Beta badge** says "Live", not "Launching Now" or any time-bound phrase. Stays accurate every release.
- **Download CTAs** all use the `releases/latest` GitHub URL so the rewriter catches them.
- **No cross-page anchor scrolls in nav.** The pattern `<a href="/#download">` from a subpage looks like it works (it scrolls to the homepage's `#download`), but UX is jumpy and broken when the homepage layout changes. Always link to a real destination URL or stay within the current page.
- **Cloudflare cache.** Push to `main` deploys in ~30s, but Cloudflare's edge cache can show stale content for up to ~60s. Hard-refresh in incognito to verify a deploy; purge from the dashboard if needed.

## Common edits cookbook

| Task | What to touch |
|------|---------------|
| Bump version on release | `index.html` beta badge + 4 download-button labels; `index.html` + `build-notes.html` Changelog mirror; full procedure in app repo's `docs/internals/release-process.md` Step 5. |
| Add a new screenshot to landing page | Drop file in `screenshots/`. Add `<img>` inside `.showcase-frame`, `.forge-hero-shot`, `.forge-shot`, or with `class="artifact-screenshot"`. Lightbox auto-attaches. |
| Add an upcoming feature | Append a numbered `<div class="upcoming-item">` to the right version group in `build-notes.html`. Bump the tab count if the total changed. |
| Reorder landing-page sections | Find the section's structural anchor (table above), cut+paste the full `<section>...</section>` block. Watch for sections that share a `<!-- comment -->` boundary. |
| Update FAQ | `faq.html` is single-column. Add `<details class="faq-item">` blocks. |

## Key files

| Concept | File |
|---|---|
| This atlas | `docs/internals/site-map.md` |
| Documentation index | `docs/internals/README.md` |
| Repo-root agent reference | `CLAUDE.md` |
| Landing page | `index.html` |
| Full release notes + upcoming features | `build-notes.html` |
| FAQ | `faq.html` |
| Privacy policy | `privacy.html` |
| Screenshots | `screenshots/` |
| App repo's release runbook | `../claude-team-builder/docs/internals/release-process.md` |
