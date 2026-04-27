# Documentation Standards

<!-- verified: 2026-04-27 against commit 4c3ae0a -->

How docs in this repo are written, indexed, verified, and maintained. Mirrors the main Foundry repo's standards (`../claude-team-builder/docs/internals/documentation-standards.md`) — same methodology, scoped to a static site.

## What warrants a doc

Write or update a doc when a change is **structural** — meaning a future agent would have to re-derive a non-obvious decision from scratch without it:

- A new pattern or invariant is introduced (e.g., the lightbox auto-attach selector list, the download-link rewriter contract)
- An existing pattern is significantly redesigned (e.g., when the Changelog section moved above Forge)
- A cross-page invariant is established or broken ("the Download CTA must point at `releases/latest`")
- A non-obvious deployment constraint emerges (Cloudflare cache, GitHub API rate limits)

**Do not** create a doc for: copy tweaks, version bumps, single-screenshot adds, color or font tweaks, isolated bug fixes that don't establish a pattern.

## What goes in a doc

Each doc in `docs/internals/` covers **one system or one cohesive area** (e.g., the section atlas, the release-notes mirror pattern, deployment quirks). Structure:

1. **Title + verified stamp** — stamp format: `<!-- verified: YYYY-MM-DD against commit <short-sha> -->`
2. **What it is** — one paragraph: the area's purpose and scope.
3. **How it works** — the load-bearing decisions and invariants. The *why* and the *shape*, not a step-by-step walkthrough of the HTML.
4. **Key files** — a small table mapping concepts to file paths so future agents navigate without grepping.

Keep docs to **100–200 lines**. If it's longer, split the area.

## When to update an existing doc

Update (and re-stamp) when:
- You changed HTML/CSS/JS that contradicts a doc's claims
- You confirmed the claims still hold after a related change → bump the stamp
- You introduced a new pattern that belongs in an existing doc

Do **not** re-stamp for: typo fixes, link repairs, formatting tweaks. Those don't reset verification.

## The verified stamp

```
<!-- verified: YYYY-MM-DD against commit <short-sha> -->
```

- **No stamp** → unverified; the live HTML is source of truth.
- **Stamp older than 3 months** → treat as suspect; spot-check before citing.
- **Stamp current** → safe to cite; report any code-vs-doc contradictions instead of silently trusting either side.

When you edit a doc, read the whole thing and confirm all claims still hold before stamping. Don't drive-by stamp.

## Docs index

`docs/internals/README.md` is the authoritative index. When you add a new doc, add a row to the table in that file. Format:

```
| [filename.md](filename.md) | One-sentence description of what it covers |
```

When you delete a doc, remove its row.

## Checklist before committing a structural change

- [ ] Does any existing doc in `docs/internals/` describe a pattern this change touches? If yes, update it.
- [ ] Did this change introduce a new pattern or invariant? If yes, write a doc.
- [ ] Did you re-stamp any docs you updated?
- [ ] Did you add a row to `docs/internals/README.md` for any new doc?
- [ ] Does `CLAUDE.md` need an updated reference to the new doc? (Usually no — the index handles discoverability.)
