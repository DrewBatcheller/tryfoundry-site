# tryfoundry-site

Landing page for [Foundry](https://tryfoundry.dev) — AI agent teams for Claude Code.

Deployed to Cloudflare Pages on push to `main`. Single static `index.html`, no build step.

## Structure

- `index.html` — the landing page. All CSS + JS inline.
- `.nojekyll` — prevents GitHub Pages (unused) from interfering if ever enabled.

## Updating

Edit `index.html`, commit, push. Cloudflare deploys in ~20s.

The download button fetches the latest release from `try-foundry/tryfoundry-releases` via the GitHub API on page load. The fallback URL (if the API call fails) points to the releases index page.

## Copy source

Product copy originates in the main repo at `docs/marketing/product-copy.md` and `docs/marketing/audience-value-props.md`. Keep changes here in sync with those docs when they materially change.
