---
title: Your builder setup: the terminal, Claude Code, GitHub, Supabase and Vercel
duration_minutes: 20
published: false
video_url:
chapters: [{"label":"The terminal is just a text box","at":0},{"label":"Five commands","at":0},{"label":"Install Claude Code","at":0},{"label":"GitHub, Supabase and Vercel","at":0},{"label":"Check it all works","at":0}]
resources: [{"label":"Terminal guide for beginners","url":"https://code.claude.com/docs/en/terminal-guide","kind":"doc","cost":"Free"},{"label":"Claude Code setup","url":"https://code.claude.com/docs/en/setup","kind":"doc","cost":"Free"},{"label":"Supabase pricing","url":"https://supabase.com/pricing","kind":"doc","cost":"Free plan available"},{"label":"Vercel pricing","url":"https://vercel.com/pricing","kind":"doc","cost":"Free Hobby plan"}]
resources_checked_on: 2026-09-28
---

This is the lesson people are nervous about, and it is the one that makes weeks three to six possible. Do it on your laptop, with a charger nearby and a decent connection. Budget an hour, not twenty minutes, the first time.

If something fails, write down exactly what you saw and post it in your pod. Getting stuck here is normal. Staying stuck is not necessary.

## The terminal is just a text box

The terminal is a window where you type instructions to your computer instead of clicking. That is all it is.

- **Mac:** press Command and Space, type **Terminal**, press Enter.
- **Windows:** press the Start key, type **PowerShell**, press Enter.

## Five commands

You only need these five this week. Type each one and press Enter.

| Command | What it does |
|---|---|
| `pwd` | Shows which folder you are in |
| `ls` | Lists what is in this folder (`dir` also works on Windows) |
| `mkdir learnhub` | Makes a new folder called learnhub |
| `cd learnhub` | Moves into that folder |
| `cd ..` | Moves back up one folder |

Try them now. Make the `learnhub` folder and move into it. That is where you will build.

## Install Claude Code

Copy the line for your computer, paste it into the terminal and press Enter.

**Mac:**

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**Windows (PowerShell):**

```powershell
irm https://claude.ai/install.ps1 | iex
```

On Windows, also install Git for Windows from git-scm.com. Claude Code works better with it.

When it finishes, **close the terminal and open a new one**. Then type:

```bash
claude --version
```

If you see a version number, it worked. If you see "not found", the fix is in the setup guide linked below this lesson.

Now move into your folder and start it:

```bash
cd learnhub
claude
```

It opens your browser and asks you to sign in. Use your Claude Pro account. The free plan does not include Claude Code, which is why Pro was step one of lesson three.

## GitHub, Supabase and Vercel

Three free accounts. Sign up for GitHub first, then use **Continue with GitHub** for the other two. One login for all three saves a lot of trouble.

- **GitHub** (github.com) is where your code is stored and saved, every version of it.
- **Supabase** (supabase.com) is a database with sign-in built in. You will use it in week three. The free plan gives you two projects. A free project pauses after a week with no activity, which is fine: you can wake it up from the dashboard.
- **Vercel** (vercel.com) puts your site on the internet at a real link. The free Hobby plan is for personal, non-commercial projects, which is everything you build in this course until you start charging for it.

You do not need to create anything inside Supabase or Vercel yet. Signing in is enough.

## Check it all works

Before you finish, take the screenshots for this week's assignment: Claude showing Pro, ChatGPT, Gemini, GitHub, Supabase and Vercel all signed in, and Claude Code running in your terminal.

If you have all seven, your builder setup is done. This week's project uses every piece of it.

## What you should be able to do after this

Open a terminal, move between folders, and start Claude Code in a folder of your choice, signed in, with the accounts you need to put what you build on the internet.

## Transcript
