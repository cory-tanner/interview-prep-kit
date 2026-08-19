---
name: update-application-status
description: Update a job application's stage, status, or notes in data/jobs.json from a natural-language instruction, e.g. "mark Acme as at the onsite stage, interview is next Tuesday", "we got an offer from Acme, $150k", "got rejected by Globex", or "add a note that the Initech recruiter said comp is flexible". Use whenever the user reports any news, outcome, or update about an application already being tracked, even a small one — don't wait for them to say "update" explicitly.
---

# Update application status

## 1. Read the current state

Read `data/jobs.json`. If it's missing, tell the user to run
`add-application` first (or copy `data/jobs.example.json` to
`data/jobs.json`) — don't invent a job record from scratch here.

## 2. Resolve the company

Fuzzy-match the mentioned company against existing `id`/`company` values. If
there's no close match, ask for clarification or offer to run
`add-application` instead — don't silently create a new job entry from this
skill.

## 3. Parse the instruction

Extract: target stage name, status (default to `active` for "at the X
stage", or `complete` for stages clearly already passed), any date (resolve
relative dates like "next Tuesday" against today's date), and any note text.

## 4. Apply the update

- If the mentioned stage doesn't already exist in that job's `stages` array,
  append it in logical order — ask the user if placement is ambiguous, don't
  guess silently. If it's a genuinely new stage name (not already in
  `data/stages.json`), add it there too — bootstrap from
  `data/stages.example.json` first if the file doesn't exist yet. That file
  backs the web UI's stage dropdown across every job, so skipping this means
  the name silently doesn't show up as an option next time, even though it's
  sitting right there in this job's timeline.
- Set the newly-mentioned stage's status/date. Don't automatically flip
  earlier `pending` stages to `complete` as a side effect — a stage the user
  never mentioned might genuinely still be pending, or it might have quietly
  happened without them saying so. Guessing either way risks corrupting their
  timeline, so ask first if it looks like steps were skipped.
- Append a short, dated line to `notes` (don't overwrite existing notes)
  unless the user explicitly asks to replace them.
- Bump `updatedAt` to the current time (ISO 8601).

## 5. Write and confirm

Write `data/jobs.json` back with 2-space indentation and a trailing newline.
Show the user a brief before/after summary of exactly what changed. Remind
them this file is gitignored local data and won't be committed.
