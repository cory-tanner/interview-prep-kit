---
name: update-design-system
description: Use when the user asks to change the design system itself (new colors, new component patterns, new spacing/typography rules, new conventions) — keeps docs/design-system.md and the /style-guide route in sync with the actual code so the living style guide never goes stale.
---

# Update the design system

This project's design rules live in `docs/design-system.md` and render live
at `/style-guide` (`app/style-guide/page.tsx`). Both must stay accurate
whenever the design system itself changes — not just whenever a page uses it.

## 1. Make the actual change first

Implement the requested change in code (`app/globals.css` for tokens,
`components/ui/*` for primitives, etc.) exactly as you would for any other
styling task. Read `docs/design-system.md` first if you haven't already this
session, so you understand what currently exists before changing it.

## 2. Recompute contrast if colors changed

If you touched `--bg`, `--surface`, `--text`, `--text-muted`, or `--brand` in
either theme, recheck WCAG contrast for every place that color is used as
*text* (not just as a background) — this project has been bitten by this
twice already (see the "Contrast gotcha" note in `docs/design-system.md`).
Don't skip this even for a small-looking tweak.

## 3. Update `docs/design-system.md`

Edit the relevant section(s) — Color, Typography, Layout & spacing,
Components, Interaction patterns, Accessibility, or Repo conventions. Keep
the same terse, decision-plus-rationale style already in the file (state the
rule, then why, especially if it was arrived at after trying something else
first — that history prevents re-litigating settled decisions).

## 4. Adding a new shadcn/ui primitive

If the change involves a new interactive primitive (a dropdown, combobox,
dialog, etc.), check whether shadcn/ui already has one before hand-rolling
it: `npx shadcn add <name> -o` (the `-o` skips the overwrite prompt — you
want that, but it means you should `git diff` afterward, not just trust the
"Created/Updated" file list, since it can silently revert an already-trimmed
file like `components/ui/button.tsx` back to shadcn's stock version if that
file happens to be a registry dependency of whatever you just added). After
adding:
- Re-apply any project-specific trims (e.g. Button's `primary`/`secondary`/
  `ghost` variants replacing shadcn's stock set) if the file got reverted.
- Check the new file's classes against the `@theme inline` bridge in
  `app/globals.css` — add any missing semantic-token mapping rather than
  hardcoding a color.
- Trim unused variants/props rather than leaving shadcn's full stock surface
  area sitting there unused — this repo treats `components/ui/*` as editable
  app code, not a vendored black box.

## 5. Verify `/style-guide` still reflects it

Since the style guide renders live components and reads `docs/design-system.md`
directly, most changes propagate automatically. Check specifically:
- New color tokens → add a row to the `COLOR_TOKENS` array in
  `app/style-guide/page.tsx` so the swatch actually shows up.
- New component variants → add a live example in the relevant `Section` of
  that same file.
- Everything else (prose changes, contrast values, rationale) — no action
  needed, the page re-reads the markdown file on every request.

## 6. Verify

`npx tsc --noEmit`, `npm run lint`, `npm run build` — same standard as any
other change in this repo. Then spot-check `/style-guide` in both themes if
you can run the dev server.
