@AGENTS.md

# interview-prep-kit

A local job-search companion: an application tracker (`data/jobs.json`) and a
markdown-based study-guide viewer (`content/<company>/*.md`). No backend, no
database — everything is read/written directly as files on disk by both the
Next.js app and the skills below.

## Skills

Five skills live in `.claude/skills/` and are the primary way this repo is
meant to be used day-to-day:

- **add-application** — scaffold a new company: appends to `data/jobs.json`,
  creates `content/<slug>/00-overview.md`.
- **build-study-guide** — generate lesson markdown for a company/role from a
  job posting (and optionally `data/profile.md`).
- **update-application-status** — parse a natural-language status update
  ("mark Acme as at onsite, interview Tuesday") into a `data/jobs.json` edit.
- **design-system** — read before any styling/UI/visual work. Points to the
  living design rules (see below) instead of guessing or re-deriving them.
- **update-design-system** — use when a design *decision* changes (new color,
  new component pattern, new convention), so the living style guide never
  drifts from the actual code.

Prefer invoking these over hand-editing files when the user's request matches
what they do — they encode the invariants (slug matching, frontmatter shape,
diagram-class vocabulary) so the app renders correctly.

## Design system

`docs/design-system.md` is the living source of truth for this app's design
system (color tokens with contrast rationale, typography, layout, component
conventions, interaction patterns) and renders with live examples at
`/style-guide`. Read it — via the `design-system` skill — before any visual
change; update it — via the `update-design-system` skill — whenever a design
decision changes, not just when a page happens to use one.

## Invariants to preserve

- The `company` field in a `data/jobs.json` entry must exactly match the
  `company` frontmatter field in every lesson under `content/<slug>/` — this
  string equality is what groups lessons under a job in the sidebar.
- Lesson files are `NN-topic.md`, two-digit zero-padded prefix, contiguous
  numbering within a company folder.
- `data/jobs.json`, `data/stages.json`, `data/profile.md`, and everything
  under `content/` except `content/README.md` and `content/acme-corp/` are
  gitignored — never suggest committing them. See `content/README.md` for
  the full authoring reference (diagram classes, frontmatter shape).
- A job's stage names and the reusable stage-name list (`data/stages.json`,
  backing the web UI's stage dropdown across every job) are deliberately
  decoupled — removing a name from the reusable list never touches any job's
  existing `stages[]`. Never add a cascade-delete between them.

## Working with data files

`lib/jobs.ts`, `lib/stages.ts`, and `lib/content.ts` are the canonical
read/write logic used by the app's API routes — mirror their shape (see
`data/jobs.example.json`, `data/stages.example.json`, and any file under
`content/acme-corp/`) when a skill edits these files by hand, rather than
inventing a different structure.
