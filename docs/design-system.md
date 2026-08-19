---
title: "Design System"
updated: "2026-08-18"
---

# Design System

This is the **living** source of truth for interview-prep-kit's design system —
rendered at [`/style-guide`](/style-guide) alongside real, live examples of every
token and component listed here. When a design decision changes, update this
file (see the `update-design-system` skill) — don't let it drift from the code.

## Brand tone

**Adjectives:** Playful, precise, utilitarian. One accent color doing all the
interactive/status work, not three.

**History worth knowing** (so it doesn't get re-litigated): a warm cream/brown
palette was tried and rejected ("too brown"). A "retro computing" direction
(hard offset shadows, multi-color status bands, scanline texture, bouncy
spring easing) was tried next and rejected as "the theme" — but its
*structural* ideas (bold card grid, menu-bar chrome, inline editing, LED-style
status indicators) were kept and carried into the current direction. A serif
display-font pass was also tried and reverted in favor of one unified sans
family. Buttons and status pills were originally solid-filled, then flattened
to transparent-background/colored-border on request.

## Color

One brand accent (teal) — used for links, active states, CTA borders/text,
and status. Neutrals lean true black/white, not warm, not soft zinc-gray.

**Light theme:**

| Token | Value | Use |
|---|---|---|
| `--bg` | `#fafafa` | Page background |
| `--surface` | `#ffffff` | Cards, header, inputs |
| `--surface-raised` | `#ffffff` | Modals |
| `--border` | `#e5e5e5` | Hairline borders |
| `--text` | `#0a0a0a` | Primary text |
| `--text-muted` | `#595959` | Secondary text |
| `--brand` | `#0f766e` | Accent — links, active states, CTA border/text |
| `--brand-hover` | `#115e59` | Hover/press state |
| `--brand-soft` | `#f0fdfa` | Light tint backgrounds |
| `--brand-contrast` | `#ffffff` | Text on a *solid* brand fill (rare now — see Buttons) |
| `--amber` | `#b45309` | Legacy secondary accent — don't add new usages, prefer brand |
| `--red` | `#dc2626` | Destructive only |

**Dimmed theme** (`data-theme="dark"` — despite the name, this is
**intentionally not a true dark theme**, it's a muted/dimmed variant of light
mode, per explicit direction: "make it more of a slightly darker light mode"):

| Token | Value | Note |
|---|---|---|
| `--bg` | `#dedee0` | Light-medium gray, not near-black |
| `--surface` | `#eaeaeb` | |
| `--surface-raised` | `#f5f5f6` | |
| `--border` | `#c6c6ca` | |
| `--text` | `#0a0a0a` | **Same as light** — text stays dark in both themes |
| `--text-muted` | `#595959` | **Same as light** |
| `--brand` | `#115e59` | **Darker than light mode's brand** — see gotcha below |
| `--brand-hover` | `#0c4a45` | |
| `--brand-soft` | `#f0fdfa` | Same as light |
| `--brand-contrast` | `#ffffff` | |
| `--amber` | `#96450a` | |
| `--red` | `#b91c1c` | |

**Contrast gotcha — recompute whenever `--brand` or `--bg`/`--surface`
changes.** `--brand` is used as a *text* color (links, active nav, CTA
button/pill text) far more than as a solid fill, so its luminance has to
clear ~4.5:1 against whatever background it sits on:
- Light mode's `--brand` went through two iterations: teal-600 (`#0d9488`)
  only hit **3.6:1** as text — had to move to teal-700 (`#0f766e`) for ~5.2:1.
- The dimmed theme's lighter background meant even `#0f766e` only cleared
  **~4.1:1** there — had to reuse light mode's own *hover* shade (`#115e59`)
  as the dimmed theme's base `--brand` to hold ≥5.6:1.

If you change either background or brand lightness, redo this check before
shipping — don't eyeball it.

## Typography

- **Fonts:** Geist Sans (`--font-sans`) for all UI/body text, Geist Mono
  (`--font-mono`) for data/status/labels, both via `next/font/google`.
  `--font-display` is aliased to `--font-sans` — there is deliberately no
  separate display face.
- **The mono-vs-sans split is load-bearing, not decorative:** mono signals
  "this is data/status" (roles, stage names, section eyebrows, field labels,
  pill text), sans signals "this is content" (company names, headings, body
  copy, notes). Keep new UI consistent with this split.
- **Weight:** don't be shy — `font-extrabold` at card-title scale reads well
  and was explicit positive feedback ("bold... looks great").

## Layout & spacing

- **Density:** comfortable. Err toward more padding/gap, not less — "cramped"
  was explicit negative feedback on an earlier pass.
- **Radius:** tight — `--radius-sm: 5px`, `--radius: 8px`, `--radius-lg: 12px`.
  Sharp/geometric over soft/pillowy.
- **Shadows:** minimal by default (`--shadow`); reserved for hover states and
  floating overlays (`--shadow-lg` for modals).

## The app shell ("OS window")

The whole app renders inside one bordered, rounded, inset container — a
single component, not separately-margined header/content pieces — evoking a
floating OS window:

```
body (h-full, flex column)
  └─ outer frame: m-3 gutter on all sides, border, rounded-[--radius], overflow-hidden
       ├─ header: fixed h-9, NOT position:sticky — it's structurally outside
       │          the scroll area, so it can't scroll away
       └─ main: the ONLY scroll container (overflow-y-auto), custom
                 scrollbar via the `.app-shell` class, rounded-b to match
                 the frame's bottom corners
```

**Why header isn't `sticky`:** it doesn't need to be. Only `main` scrolls: the
header lives above the scrolling region entirely, so it's permanently visible
by construction rather than by pinning.

The header background is a **6% brand tint**
(`bg-[color-mix(in_srgb,var(--brand)_6%,var(--surface))]`), not flat
`bg-card` — a deliberate small accent so the "OS menu bar" reads as distinct
chrome rather than just another surface, without being loud enough to
compete with actual content. Expressed as `color-mix()` against `--surface`
(not a fixed hex) specifically so it stays correctly proportioned in both
themes automatically — recompute the mix percentage, not a hardcoded color,
if the tint needs adjusting.

**A real CSS gotcha this shell ran into twice — read before touching this
structure:** a flex item's "automatic minimum content size" collapses to `0`
the instant its own `overflow` isn't `visible`. That means `overflow-hidden`
(or `auto`) on a flex-1 item that *directly* contains unbounded/growing
content will silently **clip** that content instead of letting the page grow
to fit it — this broke page scrolling entirely the first time. The fix that
holds: exactly **one** element owns scrolling (`main`, via `overflow-y-auto`),
and it must be a descendant whose own content is what's actually unbounded.
Once that's true, the *outer* frame can safely use `overflow-hidden` to
hard-cap its height to the viewport — safe specifically because `main`
already self-contains everything below it. Never add `overflow-hidden` to a
container whose direct child has unconstrained content without an
`overflow-y-auto` boundary somewhere in between.

Custom scrollbar (`.app-shell` class in `app/globals.css`): thin, styled with
`--border`/`--text-muted` instead of the OS-native scrollbar. Applied to
`main` and to the Study Guide sidebar's own nested scroll area.

**Another gotcha, this time React Server Components:** any component with its
own event handlers (`onClick`, etc.) needs its **own** `"use client"`
directive — don't rely on it working just because every current caller
happens to be inside a client component. `StagePipeline` broke this way: it
had no `"use client"` of its own and only worked because its one usage
(`job-card.tsx`) was already a client component; rendering it directly from
a server component (`/style-guide`) threw "Event handlers cannot be passed to
Client Component props." Fixed by adding `"use client"` to
`stage-pipeline.tsx` itself. `npm run build` does **not** catch this for
dynamic routes — the error only surfaces on an actual request, not at build
time. Always hit a new page with the dev server running, not just `tsc`/lint/
build, before calling it done.

## Components

- **Button** (`components/ui/button.tsx`) — a shadcn/ui primitive (`cva` +
  Radix `Slot`, vendored via `npx shadcn add button` and then hand-trimmed),
  not a bespoke component. Only three variants exist — `primary` / `secondary`
  / `ghost` — the stock shadcn `default`/`destructive`/`outline`/`link`
  variants were deleted rather than left unused. All three are **flat**:
  transparent background. `primary` = brand-teal border + brand-teal text
  (the CTA), `secondary` = neutral border + normal text, `ghost` = no border,
  muted text (for low-emphasis/destructive actions like "Remove"). None use a
  solid color fill. Two sizes beyond the default: `sm` (compact, job-card
  actions) and `icon` (square, icon-only — e.g. the job-card expand link).
  Supports `asChild` (Radix `Slot`) to render as a different element — e.g.
  `<Button variant="ghost" size="icon" asChild><Link href=.../></Button>` —
  use this instead of hand-styling a look-alike `<Link>` whenever a "button"
  needs to navigate.
- **Pill** (`components/ui/pill.tsx`) — `brand` (soft tint bg, rounded-full,
  for lightweight tags), `brand-outline` (transparent bg + brand border +
  brand text, `rounded-sm`, for the job-card status badge — matches Button
  primary's flat treatment), `amber` / `muted` (legacy, avoid new usage).
- **Card** — surface bg, border, `radius-lg`, subtle shadow.
- **StagePipeline** (`components/jobs/stage-pipeline.tsx`) — LED-square status
  row: solid `--text` = complete, solid `--brand` + `led-pulse` animation =
  active, outlined (border only, transparent fill) = pending. **No visible
  text label by default** — every square needs `title` + `aria-label` since
  color/shape alone isn't an accessible status signal.
- **Nav active state** (`components/layout/nav-links.tsx`) — reuses the
  LED-square language: active page gets a filled brand-teal square + brand-colored bold
  text; inactive pages show an outlined (unfilled) square.
- **Breadcrumb** (`components/layout/breadcrumb-context.tsx` +
  `components/layout/nav-links.tsx`) — a `BreadcrumbProvider` (mounted once in
  `app/layout.tsx`, wrapping the header + main) lets any page announce a
  header suffix via `useSetBreadcrumb(label)`; `NavLinks` reads it with
  `useBreadcrumbLabel()` and renders it after "Jobs" (`Jobs / {label}`) only
  while on a `/jobs/*` sub-route. The suffix is `truncate`d inside a
  `min-w-0 flex-1` span so a long company name clips with an ellipsis instead
  of pushing the theme toggle off-screen. Cleanup is automatic — the setting
  page's `useEffect` clears the label on unmount, so navigating away drops it
  without any manual reset.
- **Theme toggle** — bordered icon button (not borderless), matches the
  weight of other header chrome.
- **StageCombobox** (`components/jobs/stage-combobox.tsx`) — replaces a plain
  text input for picking a job's stage name. Built on shadcn's `Popover` +
  `Command` primitives (`components/ui/popover.tsx`, `components/ui/command.tsx`,
  backed by `cmdk`) rather than a hand-rolled dropdown — this is the standard
  shadcn "combobox" pattern. `Command` uses `shouldFilter={false}`: filtering,
  the "+ Add" row, and the inline remove button are all custom logic layered
  on top (cmdk's own fuzzy-match isn't a good fit for an editable list), so
  don't expect cmdk's built-in search to do anything here. Getting this from
  Radix `Popover` for free: click-outside-to-close and Escape-to-close, no
  manual `mousedown`/`keydown` listeners needed anymore. Backed by a reusable,
  persistent stage-name list (`lib/stages.ts`, `data/stages.json`) shared
  across every job — typing a new name adds it for future use everywhere, and
  each listed name has an inline remove affordance (a `CommandItem`'s
  `onSelect` bubbles from a click; the remove button calls
  `event.stopPropagation()` so removing doesn't also select). Removing a name
  is deliberately **not** gated behind a `confirm()` — lower stakes than
  deleting a job, and it's already a deliberate click on a small icon inside
  an opened panel. Disabled (renaming an existing stage) renders as static
  text, matching the old disabled-input behavior exactly.
- **Select** (`components/ui/select.tsx`) — shadcn/Radix Select, used for the
  stage-status field (pending/active/complete) in `StageEditor`. The trigger
  is styled with the same `.field` class every other form control uses
  (`.field`'s plain-CSS declarations beat Radix's own Tailwind-utility
  classes under Tailwind v4's cascade layers, so it fully reskins the
  trigger — don't also add width/padding utilities expecting them to win).
  Displays each status via the shared `statusLabel()` helper (exported from
  `components/jobs/stage-pipeline.tsx`) rather than the raw `pending` /
  `active` / `complete` enum value — that same helper backs the stage LED
  dots' `aria-label` and the detail page's visible status word, so the word
  for "active" ("In Progress") reads identically everywhere it appears.
  **Any new place that displays a stage status should call this shared
  helper**, not write its own copy of the pending/active/complete → label
  mapping — that duplication is exactly what caused the wording to drift in
  the first place (dropdown said "active", detail page said "In progress").
- **DeleteConfirmDialog** (`components/jobs/delete-confirm-dialog.tsx`) — a
  shadcn `AlertDialog` (`components/ui/alert-dialog.tsx`), used for
  confirming job removal from both the job card and the detail page. This
  replaced a browser-native `window.confirm()`. The confirm button is styled
  red (`--red`) via a `className` override on that one instance — the shared
  `Button`/`AlertDialogAction` primitive has no "destructive" variant (kept
  lean, see Button above), so danger styling for a specific action is a
  local override, not a new global variant. `AlertDialogAction`'s `onClick`
  calls `event.preventDefault()` before the async delete request — Radix's
  default behavior is to close the dialog immediately on click, which would
  hide the "Removing…" pending state; the dialog now stays open (and
  controlled) until the request resolves. State (`confirmDeleteOpen`,
  `requestDelete`, `confirmDelete`) lives in `useJobActions` — the async
  `confirmDelete()` only sets `confirmDeleteOpen` to `false` on a confirmed
  200 response, same "did it actually succeed" guarantee the old
  boolean-returning `handleDelete` gave callers (the detail page's Remove
  still only redirects to `/jobs` after a real success, not just a click).

## Interaction patterns

- **Inline editing over dialogs** — editing a job's stage happens in place
  (click → inline `StageEditor`, no modal). This was explicit, repeated
  feedback. Preserve this pattern for any new editable field. A job's
  *expanded* view (fuller stage timeline, full notes) is **not** a dialog
  either — it's a dedicated route, `app/jobs/[id]/page.tsx`
  (`components/jobs/job-detail-view.tsx`). This was a direct pivot from an
  earlier quick-view modal, reversed on request ("no dialog, give them their
  own page"). Editing *inside* the detail page still stays inline via the
  same `StageEditor`, swapped in over the clicked stage row — the "no modal
  for editing" principle holds; only the container for "view expanded detail"
  changed from overlay to route. The one exception that *is* a dialog:
  destructive confirmation (`DeleteConfirmDialog`, see Components above) —
  a confirmation isn't a form or a view, so it doesn't fall under this
  principle the way an editor or expanded-detail view would.
- **Clickable cards (stretched link)** — the whole job card
  (`components/jobs/job-card.tsx`) navigates to `/jobs/[id]`, not just the
  expand icon (which is kept, mainly as a discoverability cue). Implemented
  as the standard "stretched link" pattern: an `<Link>` absolutely
  positioned `inset-0` over the `relative` Card, `aria-label`'d with the
  company name since it has no visible text of its own, placed *behind*
  (`z-0`) the real content. **Every interactive element inside the card
  needs its own `relative z-10`** (or it silently becomes unclickable,
  covered by the overlay) — currently applied to the `StagePipeline`
  wrapper, `StageEditor`'s root, and the actions row. If you add a new
  interactive element as a direct-or-nested child of the card, give it (or
  a `relative z-10` ancestor within the card) the same treatment. Purely
  informational areas (company/role text, notes, the stage-status pills)
  intentionally have no `z-10` — clicking them falls through to the overlay
  and navigates, which is the point of a stretched-link card.
- **Optimistic feel** — instant local visual feedback over spinner-then-update
  where possible.
- **Motion** — clean `ease-out`, 150–200ms. No bounce/spring/overshoot easing
  — tried once in the retro exploration and explicitly dropped even though
  the surrounding boldness was praised.

## Accessibility rules

- Icon-only indicators (LED squares, nav dots) need `title` **and** a real
  `aria-label` — don't rely on color/shape alone.
- Purely decorative chrome must be `aria-hidden`.
- Recheck contrast whenever `--text`, `--text-muted`, `--border`, or `--brand`
  change — see the Color section's contrast gotcha above.
- Destructive actions get a real, focusable confirmation UI
  (`DeleteConfirmDialog`/`AlertDialog`), not `window.confirm()` — the native
  browser dialog isn't stylable, isn't part of the app's own focus
  management, and can't show a pending/loading state.
- A stretched-link card (see "Clickable cards" above) needs its `<Link>` to
  carry the accessible name via `aria-label`, since the link itself has no
  visible text — don't let it fall back to an empty/unlabeled link.

## Repo conventions

- Tailwind v4, CSS-first config (no `tailwind.config.*` file). Tokens are
  plain CSS custom properties in `app/globals.css` under `:root` /
  `:root[data-theme="dark"]`. Reference them via the semantic name from the
  `@theme inline` bridge when one exists and is unambiguous (`bg-primary`,
  `text-muted-foreground`, `rounded-lg`, `font-mono`) — check
  `app/globals.css`'s `@theme inline` block first. Only fall back to the
  canonical custom-property shorthand (`bg-(--brand)`, not the older
  `bg-[var(--brand)]` bracket form) for tokens with **no** bridge entry
  (`--shadow`, `--shadow-lg`, `--amber`, `--font-display`) or where a token
  maps to more than one semantic name (`--surface` backs `bg-card`,
  `bg-secondary`, *and* `bg-muted` identically — picking one over another is
  a judgment call, not a mechanical fact, so don't let an editor's
  "canonical class" suggestion silently relabel it). One caution learned the
  hard way: `font-[var(--font-mono)]` (and its `font-(--font-mono)`
  shorthand) silently compiles to `font-weight`, not `font-family` — Tailwind
  can't infer a bare `var()` is a font name. Always use `font-mono`/
  `font-sans` (the named utility) or `font-(family-name:--font-x)` (the
  explicit type-hinted form) for font-family tokens, never the bare form.
- Dark/dimmed mode is driven by a `data-theme` attribute, **not** Tailwind's
  `dark:` variant — set via `next-themes`
  (`components/layout/theme-provider.tsx`, configured with
  `attribute="data-theme"` specifically so it drives the *existing*
  `:root[data-theme="dark"]` tokens instead of the library's default `.dark`
  class, which would've meant rewriting every token selector in this file for
  no functional gain). `components/layout/theme-toggle.tsx` just calls the
  library's `useTheme()` hook now — this project used to hand-roll the
  flash-prevention script and storage/persistence logic; `next-themes` does
  the identical job (it injects its own equivalent blocking script into
  `<head>`, verified byte-for-byte equivalent to the old one before removing
  it) as a maintained dependency instead of bespoke code.
- Reuse `components/ui/*` primitives rather than one-off styling.
- `lib/jobs.ts`, `lib/stages.ts`, `lib/content.ts`, `app/api/jobs/**`, and
  `app/api/stages/**` are off-limits for design/visual passes —
  presentation-only changes, always. (They're fair game for genuine
  data/functional features, like the reusable stage-name list itself was.)

### shadcn/ui primitives

Interactive primitives (`Button`, `Select`, `Popover`, `Command`, plus their
transitive dependency `Dialog`) are vendored from shadcn/ui via
`npx shadcn add <name>` (`components.json` at the repo root configures the
`utils` alias to `@/lib/cn`, so generated files import our existing `cn`
rather than creating a duplicate `lib/utils.ts`). Treat `components/ui/*` as
**editable app code, not a black box** — every generated file gets
hand-trimmed to this project's actual needs (see Button's variant list
above) rather than left with shadcn's full stock surface area.

**The token bridge is what makes this work without visual drift.** Generated
primitives are styled with shadcn's semantic Tailwind classes (`bg-primary`,
`border-input`, `ring-ring`, `text-muted-foreground`, etc.), not our
`bg-[var(--brand)]` arbitrary-value convention. An `@theme inline` block at
the top of `app/globals.css` maps every one of those semantic names to our
actual `:root` tokens (`--color-primary: var(--brand);`, etc.) — `inline` is
load-bearing: a plain `@theme` block bakes values in at Tailwind's build
time, which would break `data-theme="dark"` runtime switching, since that
switching works by reassigning the underlying `--brand`/`--bg`/etc. custom
properties at runtime. **When adding a new shadcn primitive, check its
generated classes against this map first** — if it references a semantic
token that isn't in the bridge yet (e.g. `bg-sidebar`), add the mapping
rather than hardcoding a color into the generated file.

`lib/cn.ts` was upgraded from a plain `.filter(Boolean).join(" ")` to
`clsx` + `tailwind-merge` as part of this — required so conflicting Tailwind
classes passed via `className` (e.g. a call site's `size="sm"` padding
overriding the variant default) resolve correctly; plain string
concatenation can't do that.
