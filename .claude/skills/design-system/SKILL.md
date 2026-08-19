---
name: design-system
description: Reference this project's design system before any styling, UI, visual, or theming work. Use whenever asked to style a component, redesign a page, add new UI, change colors/typography/spacing, or touch app/globals.css.
---

# Design system reference

Before making any visual or UI change, read:

1. **`docs/design-system.md`** — the living rules doc (brand tone, color
   tokens with rationale, typography, layout/spacing, component conventions,
   interaction patterns, accessibility rules, repo conventions).
2. **`app/globals.css`** — the actual current token values (`:root` and
   `:root[data-theme="dark"]`). The markdown doc explains *why*; this file has
   the *current numbers*. Trust the CSS file over your memory of past
   conversations — tokens have changed multiple times.
3. **`/style-guide`** route (`app/style-guide/page.tsx`) if you want to see
   the tokens/components rendered live rather than just read about them.

## The essentials (so you don't have to open files for small asks)

- **One brand accent** (teal, `--brand`) does all interactive/status
  signaling. Don't introduce new accent colors.
- **Buttons and status pills are flat**: transparent background, colored
  border for emphasis. No solid fills — this was explicitly requested after
  an earlier solid-fill pass.
- **Mono font = data/status, sans font = content.** Keep this split for any
  new UI text. Use the named utility (`font-mono`/`font-sans`) or the
  type-hinted form (`font-(family-name:--font-display)` for the one token
  with no named utility) — never a bare `font-(--font-x)`/`font-[var(--font-x)]`,
  which silently compiles to `font-weight` instead of `font-family` (a real
  bug this project shipped with for a while before it was caught).
- **"Dark mode" is not a true dark theme** — it's a dimmed/muted variant of
  light mode (light-ish background, same dark text as light mode). Don't
  "fix" this by making it darker without being asked; it's intentional.
- **Tight radii, minimal shadows, comfortable-not-cramped spacing.** No
  bounce/spring motion easing.
- **Interactive primitives (`components/ui/*`) are shadcn/ui**, vendored via
  `npx shadcn add <name>` and then hand-trimmed to this project's actual
  variants — reuse and extend them rather than hand-rolling a new dropdown,
  select, dialog, etc. If you add a new shadcn primitive, check its generated
  classes against the `@theme inline` token bridge in `app/globals.css` — if
  it references a semantic token (`bg-sidebar`, etc.) that isn't mapped to
  one of this project's actual `:root` tokens yet, add the mapping instead of
  hardcoding a color into the generated file. Also expect `shadcn add` to
  silently overwrite an already-customized `components/ui/*` file if it's a
  registry dependency of whatever you're adding (this has happened) — diff
  after running it, don't assume it only touched the file you asked for.
- **`lib/jobs.ts`, `lib/stages.ts`, `lib/content.ts`, `app/api/jobs/**`, and
  `app/api/stages/**` are off-limits** for design passes — presentation-only
  changes.

## When you make a design decision

If the user asks you to change something about the design system itself
(a new color, a new component pattern, a new spacing rule — not just "add a
button that uses the existing secondary style"), use the
`update-design-system` skill afterward so `docs/design-system.md` stays
accurate. Don't let this doc drift from the code — a stale style guide is
worse than no style guide.
