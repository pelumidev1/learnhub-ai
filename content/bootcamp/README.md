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

## Writing rules

The voice rules in section 9 of `learnhub-master-context.md` apply here as much
as they do to marketing. Short sentences. Speak to one person. Name what they
will be able to do rather than what they will learn about. No em dashes.
