---
name: add-application
description: Scaffold a new job application — creates a data/jobs.json entry and a content/<company-slug>/ folder for study-guide lessons. Use whenever the user says they applied to, are interviewing with, or want to start tracking a company or role — e.g. "I just applied to Acme Corp", "add a new company", "start tracking this role", even if they don't name this skill directly.
---

# Add a new application

## 1. Gather the basics

Ask the user (skip anything already given) for:
- Company display name (e.g. "Acme Corp")
- Role title
- Application date (default: today)
- Any known upcoming stage/interview and its date
- Short notes: how they found the role, warm contacts, anything load-bearing

## 2. Compute the slug

Kebab-case the company name (`Acme Corp` → `acme-corp`). Check both
`data/jobs.json` (if it exists) and `content/` for an existing folder/id with
that slug. If there's a collision, ask the user how to disambiguate (e.g.
append the role or year) rather than overwriting.

## 3. Ensure data/jobs.json exists

If `data/jobs.json` is missing, copy `data/jobs.example.json` to
`data/jobs.json` first. It is gitignored — safe to fill with real
information.

## 4. Append the job entry

Add an entry matching this shape (see existing entries in `data/jobs.json`
for examples):

```json
{
  "id": "<slug>",
  "company": "<display name>",
  "role": "<role title>",
  "stages": [
    { "name": "Applied", "date": "<today or given date>", "status": "complete" },
    { "name": "Recruiter Screen", "date": null, "status": "pending" },
    { "name": "Technical Screen", "date": null, "status": "pending" },
    { "name": "Onsite", "date": null, "status": "pending" },
    { "name": "Offer", "date": null, "status": "pending" }
  ],
  "notes": "<notes>",
  "createdAt": "<now, ISO 8601>",
  "updatedAt": "<now, ISO 8601>"
}
```

Adjust the default stage list if the user describes a different process.
`status` is one of `complete | active | pending`; `date` is `YYYY-MM-DD` or
`null`. Write the file back with 2-space indentation and a trailing newline.

(This is exactly what `POST /api/jobs` does under the hood if the user adds
the job through the web UI instead — both paths write the same file.)

If you used any stage name outside the default five (Applied, Recruiter
Screen, Technical Screen, Onsite, Offer), also make sure it exists in the
reusable stage-name list at `data/stages.json` (bootstrap it from
`data/stages.example.json` first if it doesn't exist yet, same pattern as
step 3). The web UI's stage picker is a dropdown backed by that file — a
custom stage name that's only inside this one job's `stages` array won't be
offered as an option for *other* jobs until someone types it in by hand at
least once. Case-insensitive dedupe, alphabetical order; see `lib/stages.ts`
if you want the exact logic.

## 5. Scaffold the content folder

Create `content/<slug>/00-overview.md`:

```markdown
---
title: "Overview & Learning Path"
section: "Crash Course"
company: "<display name>"
---

# <display name> — <role title>

_Study guide content coming soon. Run the build-study-guide skill to generate lessons._
```

## 6. Verify the invariant

The `company` field must be byte-for-byte identical between the
`data/jobs.json` entry and every lesson's frontmatter in `content/<slug>/` —
this string match is what groups lessons under the right company in the
sidebar. Double-check before finishing.

## 7. Tell the user what's next

- Their real data lives in `data/jobs.json` and `content/<slug>/`, both
  gitignored — never committed.
- Run `npm run dev` and visit `/jobs` to see the new card.
- Run the `build-study-guide` skill next to generate real lesson content, or
  `update-application-status` later as the process moves along.
