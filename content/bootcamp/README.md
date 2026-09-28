# Bootcamp lesson content

One markdown file per lesson. `scripts/sync-bootcamp-content.mjs` reads this
folder and upserts it into the `lessons` table, which is what the app renders.

```
content/bootcamp/<module-slug>/<NN>-<lesson-slug>.md
```

The number prefix sets the order and is stripped from the slug, so `01-intro.md`
becomes the lesson `intro` at position 1. Renumbering files reorders the week.

## Frontmatter

```yaml
---
title: What prompting actually is
video_url: https://...        # optional
duration_minutes: 8           # optional
published: false              # default false, so a draft cannot leak
---
```

Everything after the frontmatter is the lesson body, in markdown.

## Publishing

Nothing appears to students until `published: true` **and** the module itself is
published. Two switches on purpose: a finished lesson inside an unfinished week
should still not show.

## To sync

```bash
npm run bootcamp:sync
```

Reads every file here and writes it to Supabase with the service role. Safe to
run repeatedly. It never deletes: a lesson removed from this folder stays in the
database until someone removes it deliberately, because a student mid-week
should not lose a page because a file got renamed.

## Assignments, projects and tests

Each week's coursework lives in a `work/` folder beside its lessons:

```
content/bootcamp/week-1/work/01-your-stack-and-first-skill.md
content/bootcamp/week-1/work/02-your-ai-workspace.md
content/bootcamp/week-1/work/test.json
```

A task file has `title`, `kind` (`assignment`, `project` or `final`) and
`published` in its frontmatter; the body is the brief. `test.json` is
`{ "published": false, "questions": [...] }`, each question with an `id`, a
`prompt`, exactly four `options`, a `correct_index` (0 to 3) and an
`explanation`. The sync refuses a test with a malformed question rather than
publishing it shorter than written.

Two checks before publishing a test, because both let a student pass without
knowing anything: spread the right answers across all four positions, and keep
the options about the same length. Right answers that are always the longest
option are the most common giveaway in hand-written tests.

A lesson file cannot be called `work`, since that is the week's work page.

## Writing rules

The voice rules in section 9 of `learnhub-master-context.md` apply here as much
as they do to marketing. Short sentences. Speak to one person. Name what they
will be able to do rather than what they will learn about. No em dashes.
