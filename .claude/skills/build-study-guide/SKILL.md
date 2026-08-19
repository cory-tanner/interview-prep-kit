---
name: build-study-guide
description: Generate study-guide lesson markdown files for a company/role, using a job posting and/or the user's profile.md, following this repo's diagram-class conventions. Use whenever the user wants interview prep, study material, or lessons for a company they're tracking — "build a study guide for Acme", "help me prep for the Globex onsite", "generate more lessons on system design" — not just literal "study guide" phrasing. Use after add-application for a brand-new company, or any time to add more lessons to one that already has some.
---

# Build a study guide

## 1. Resolve the target company

Ask which company (or infer from context). The `content/<slug>/` folder must
already exist (created by `add-application`) — if it doesn't, run that skill
first.

## 2. Gather inputs

- Ask for a job posting (pasted text or URL) if not already provided — pull
  out tech stack, seniority, domain, and anything distinctive about the role.
- Check for `data/profile.md`. If present, read it for the user's background,
  learning style, and gaps to address. If missing, mention
  `data/profile.example.md` exists as a template and proceed generically
  without blocking on it.

## 3. Survey existing lessons

List `content/<slug>/*.md` already present so you don't duplicate topics or
reuse a numeric prefix. Lessons must stay contiguous and correctly ordered.

## 4. Propose a lesson plan

Based on role/company/profile, propose a set of lessons grouped into sections
(e.g. "Day 1: Fundamentals", "Day 2: System Design", ...). For crash-course
style content, prefer a day-by-day schedule (`diagram-schedule`) with one
lesson clearly flagged as highest priority over a flat uniform list — someone
prepping under time pressure needs to know what to do first if they only get
through part of it, and a flat list doesn't communicate that. Confirm the
plan with the user before writing files if the scope is large (more than
~4 lessons) — cheap to redirect before generating content, expensive after.

## 5. Use the established diagram-class vocabulary

Prefer these existing classes over inventing new ones — grep existing
`content/**/*.md` for prior art first:

| Class | Use for |
|---|---|
| `diagram-compare` + `diagram-compare__card`/`__title`/`__content` | Two-up comparison cards |
| `diagram-flow` + `diagram-box`/`diagram-box--highlight`/`diagram-arrow` | Sequential step flows |
| `diagram-schedule` + `diagram-schedule__day`/`__title`/`__content` | Day-by-day study plans |
| `diagram-tier` + `diagram-tier__label`/`__bar` | Big-O / complexity bar comparisons |
| `diagram-node` / `diagram-node--small` | Tree / graph nodes |
| `diagram-label` | Caption above a diagram |

See `content/acme-corp/01-example-diagrams.md` for working examples of
each, and `content/README.md` for the full authoring reference.

## 6. Write the files

Each new file: `content/<slug>/NN-topic.md`, two-digit zero-padded prefix,
kebab-case topic, contiguous with existing numbering. Frontmatter on every
file:

```yaml
---
title: "<lesson title>"
section: "<sidebar section label>"
company: "<must exactly match the company field in data/jobs.json for this job>"
---
```

## 7. Adapt tone to the profile (if present)

If `data/profile.md` describes the user's background (e.g. non-CS,
self-taught, bootcamp), frame technical vocabulary using analogies from what
they already know rather than assuming a CS degree. Use behavioral-prep
frameworks the user's profile mentions, if any; otherwise default to a
Situation / Decision / Trade-offs / Outcome structure for behavioral-prompt
lessons.

## 8. Wrap up

No manifest or index file needs updating — content is discovered by scanning
the filesystem at request time. Tell the user to run `npm run dev` and visit
`/study-guide/<slug>` to review, and that this skill can be re-run later
(e.g. "generate onsite prep lessons for acme-corp") to add follow-up lessons
as the process advances.
