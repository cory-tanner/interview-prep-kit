# interview-prep-kit

A local, single-user job-search companion: an application tracker + a
markdown-based study-guide viewer, driven entirely by local files on your
machine. No account, no database, no server other than your own `npm run dev`.

## What it does

- **Jobs dashboard** — track applications through a stage pipeline you define
  per company (Applied, Recruiter Screen, Onsite, Offer, or whatever your
  process actually looks like), with notes. Stage names are picked from a
  reusable dropdown shared across every job — add a new one on the fly and
  it's available for the next company too, or remove one you don't use
  anymore. Click a job (or its expand icon) for a full detail page with the
  complete stage timeline and notes.
- **Study guide** — a sidebar of company → section → lesson, rendering
  markdown content you (or Claude Code, via the included skills) write.
  Progress checkboxes, collapsible groups, light/dark theme, print support.
- **A documented, extensible design system** — one brand accent, flat
  bordered buttons, a shared LED-square status language. Living rules at
  `docs/design-system.md`, viewable with real component examples at
  `/style-guide` (not linked in the nav — open it directly). UI primitives
  (buttons, dropdowns, dialogs) are shadcn/ui, so they're yours to extend,
  not a black box.

## Quick start

```bash
npm install
npm run dev
open http://localhost:3000
```

On first run, if you haven't added real data yet, the app boots from the
committed example data (`data/jobs.example.json`, `content/acme-corp/`)
so there's something to look at immediately.

## Add your own data

Your real data is gitignored — it never leaves your machine unless you
choose to back it up yourself.

- Copy `data/jobs.example.json` → `data/jobs.json` and edit it, or use the
  `add-application` skill (see below) — either way writes the same file.
- Copy `data/profile.example.md` → `data/profile.md` (optional) and fill in
  your background — this personalizes generated study content.
- The reusable stage-name dropdown (`data/stages.json`) bootstraps itself
  from `data/stages.example.json` the first time it's read — nothing to set
  up by hand, just start adding jobs.

## Claude Code skills

This repo ships five skills under `.claude/skills/`. Open the project in
Claude Code and just ask — you don't need to name the skill, phrasing like
this is enough to trigger the right one:

- *"Add an application for Acme Corp, Senior Frontend Engineer, I applied
  today."* → `add-application`
- *"Build a study guide for Acme Corp based on this job posting: ..."* →
  `build-study-guide`
- *"Mark Acme as at the onsite stage, interview is next Tuesday."* →
  `update-application-status`
- *"Change the app's accent color"* or any other request to style/redesign
  something → `design-system` (read first, automatically) and
  `update-design-system` (keeps `docs/design-system.md` and `/style-guide`
  from drifting once a design decision actually changes).

## Study-guide authoring conventions

See [`content/README.md`](content/README.md) for the lesson file format and
the diagram-class vocabulary (`diagram-compare`, `diagram-flow`,
`diagram-schedule`, `diagram-tier`, `diagram-node`, `diagram-label`) used
inside lesson markdown. `content/acme-corp/01-example-diagrams.md`
demonstrates all of them.

## Project structure

```
app/                    Next.js App Router pages + API routes
  jobs/[id]/               Job detail page (stage timeline, notes)
  style-guide/              Live design-system reference (unlinked route)
components/
  ui/                       shadcn/ui primitives (button, select, dialog, ...)
  layout/                   Root chrome: nav, theme toggle, breadcrumb state
  jobs/                     Jobs dashboard: board, card, stage editor/combobox
  study-guide/               Sidebar + lesson renderer
lib/                    Data access (jobs.ts, stages.ts, content.ts) + markdown
data/                   jobs.json, stages.json, profile.md — all gitignored
content/                Lesson markdown, one folder per company
docs/                   design-system.md — the living design-rules doc
.claude/skills/         add-application, build-study-guide,
                        update-application-status, design-system,
                        update-design-system
```

## Scripts

```bash
npm run dev      # start the local dev server
npm run build    # production build (still run locally, no deploy story)
npm run lint
```

## Notes

- No auth, no database, no deployment target — this is meant to run on your
  own machine only.
- Nothing under `data/jobs.json`, `data/stages.json`, `data/profile.md`, or
  `content/<your-company>/` is ever committed — see `.gitignore`. Only the
  `.example` templates and the sample `content/acme-corp/` ship in the
  repo.
- Built with Next.js (App Router, Tailwind v4) and shadcn/ui. See
  `docs/design-system.md` for the design rules and rationale.

## License

No license is granted — all rights reserved. This repo is public so you can
look around, clone it, and run it locally, but there's no explicit
permission to redistribute or reuse the code.
