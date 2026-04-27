# tryfoundry-site — Internal Reference

<!-- verified: 2026-04-27 against commit 4c3ae0a -->

Documentation that helps agents (and future Drew) navigate the site repo. Each doc is 100–200 lines and focused on one area.

**Before reading**, scan the table to find the right doc.

## Documents

| Doc | What it covers |
|-----|----------------|
| [documentation-standards.md](documentation-standards.md) | What warrants a doc, how to write one, the verified-stamp convention, when to update vs. write new, pre-commit checklist. Read this before adding or editing any doc. |
| [site-map.md](site-map.md) | The four pages. Section atlas for `index.html` (named sections with line anchors). Cross-page invariants (nav, footer). Patterns (download-link rewriter, release-notes mirror, lightbox auto-attach). House-style conventions (no emdashes, "Live" badge wording, releases/latest URL contract). |

## Adding a new doc

See `documentation-standards.md` for the methodology. The short version:

1. Confirm the change is **structural** (not a copy/version/typo tweak)
2. Write the doc, 100–200 lines, with a verified stamp
3. Add a row to this index
4. Re-stamp any related doc you confirmed still holds
