# tryfoundry-site

Marketing site for Foundry. Four standalone HTML pages (`index.html`, `build-notes.html`, `faq.html`, `privacy.html`), all CSS + JS inline. No build step. Deployed to Cloudflare Pages on push to `main`.

**Before any non-trivial edit, read `docs/internals/README.md`.** It is the authoritative index of the section atlas, cross-page invariants, and conventions an agent needs to act correctly when given a vague directive like "do X on the homepage."

Skipping the index means you may grep blind for a section, miss a cross-page invariant (nav, footer, download URL), or violate a house-style rule (no emdashes, no scroll-anchor links from cross-page nav). All of those have bitten before.

## Sister repos

- **Foundry app source:** `C:/Users/dbatc/Projects/claude-team-builder/` — the desktop app the site advertises. Product copy referenced from this site originates in the app repo's `docs/marketing/`.
- **Public releases:** `try-foundry/tryfoundry-releases` (no local clone needed) — the `.exe` installers and `latest.yml` autoupdate manifest the site's download buttons resolve to.

## Release flow

The site bumps version-text references when the Foundry app ships a new build. Full procedure lives in the app repo at `docs/internals/release-process.md` (Step 5 covers what to touch on this side).

@docs/internals/documentation-standards.md
