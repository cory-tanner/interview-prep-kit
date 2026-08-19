# Authoring study-guide lessons

Lesson content lives here as markdown files, one folder per company, discovered
from the filesystem at request time — there's no build step and no manifest to
keep in sync.

## Directory layout

```
content/<company-slug>/
├── 00-overview.md
├── 01-<topic>.md
└── ...                  # two-digit prefix, kebab-case topic
```

- `<company-slug>` must match the `id` of the corresponding entry in
  `data/jobs.json`.
- File names are `NN-topic.md` — the two-digit prefix drives both display
  order and the number shown in the sidebar. Keep numbering contiguous.

## Frontmatter

Every lesson file needs:

```yaml
---
title: "Overview & Learning Path"
section: "Crash Course"
company: "Acme Corp"
---
```

- `section` groups lessons within a company's sidebar block. Give lessons in
  the same phase of prep the same `section` string.
- `company` must be **byte-for-byte identical** to the `company` field of the
  matching entry in `data/jobs.json`. This string match is what groups a
  company's lessons together in the sidebar — a typo here silently splits or
  orphans a company's study guide.

## Markdown → HTML

Lesson bodies are rendered with `marked` (GFM enabled). Raw HTML in the
markdown passes through untouched, which is what makes the diagram classes
below work — write plain `<div>` markup with these classes directly in the
`.md` file.

## Diagram classes

Use these instead of inventing new ones. See
[`acme-corp/01-example-diagrams.md`](acme-corp/01-example-diagrams.md)
for working examples of every class.

| Class | Use for |
|---|---|
| `diagram-compare` + `diagram-compare__card` / `__title` / `__content` | Two-up comparison cards |
| `diagram-flow` + `diagram-box` / `diagram-box--highlight` / `diagram-arrow` | Sequential step flows |
| `diagram-schedule` + `diagram-schedule__day` / `__title` / `__content` | Day-by-day study plans |
| `diagram-tier` + `diagram-tier__label` / `__bar` | Big-O / complexity bar comparisons |
| `diagram-node` / `diagram-node--small` | Tree / graph nodes |
| `diagram-label` | Caption above a diagram |

Before inventing a new diagram style, grep existing `.md` lessons for prior
art (`grep -r "diagram-" content/`).

## Tone conventions

- Crash courses work best as a `diagram-schedule` day-by-day plan with one
  clearly-flagged priority lesson, not a uniform list.
- Lean on a Situation / Decision / Trade-offs / Outcome structure for
  behavioral-prep lessons unless `data/profile.md` describes a different
  framework the user prefers.
- If `data/profile.md` exists, read it before writing lessons — it describes
  the user's background and learning style, and content should be framed
  accordingly (e.g. real-world analogies instead of CS-degree vocabulary for a
  self-taught reader).
