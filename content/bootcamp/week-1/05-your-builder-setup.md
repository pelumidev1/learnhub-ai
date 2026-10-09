---
title: Your builder setup: VS Code, Claude Code, GitHub, Supabase and Vercel
duration_minutes: 22
published: true
video_url:
chapters: [{"label":"VS Code: where you build","at":0},{"label":"Claude Code inside VS Code","at":0},{"label":"The terminal, the few times you need it","at":0},{"label":"GitHub, so Claude Code can save your work","at":0},{"label":"Supabase and Vercel","at":0},{"label":"Check it all works","at":0}]
resources: [{"label":"Download VS Code","url":"https://code.visualstudio.com","kind":"tool","cost":"Free"},{"label":"Claude Code in VS Code","url":"https://code.claude.com/docs/en/vs-code","kind":"doc","cost":"Free"},{"label":"GitHub CLI","url":"https://cli.github.com","kind":"tool","cost":"Free"},{"label":"Node.js","url":"https://nodejs.org","kind":"tool","cost":"Free"},{"label":"Supabase pricing","url":"https://supabase.com/pricing","kind":"doc","cost":"Free plan available"},{"label":"Vercel pricing","url":"https://vercel.com/pricing","kind":"doc","cost":"Free Hobby plan"}]
resources_checked_on: 2026-09-29
---

This is the lesson people are nervous about, and it's the one that makes weeks three to six possible. Do it on your laptop, with a charger nearby and a decent connection. Give it an hour the first time.

If something fails, write down exactly what you saw and post it in your pod. Lots of people get stuck at this step. Asking early saves you an evening.

## VS Code: where you build

VS Code is a free app for working on a project's files. You won't write code in it. Claude Code will, inside VS Code, and you'll watch every file it creates or changes, right there beside the chat.

1. Download it from code.visualstudio.com and install it.
2. Make a folder called `learnhub` in your Documents folder.
3. In VS Code, choose **File**, then **Open Folder**, and pick `learnhub`. If it asks whether you trust the folder, say yes. It's yours.

That folder is where you'll build for the rest of the bootcamp.

## Claude Code inside VS Code

1. In VS Code, press **Cmd+Shift+X** (Mac) or **Ctrl+Shift+X** (Windows) to open Extensions.
2. Search for **Claude Code**, check the publisher is **Anthropic**, and click **Install**.
3. Click the Claude Code icon (a small spark) in the bar on the left.
4. Click **Sign in** and finish in your browser, with your Claude Pro account. The free plan doesn't include Claude Code, which is why Pro was step one of lesson three.

Test it. Type: *"Create a file called hello.md that says hello, then tell me what you did."* Claude Code shows you the file before it saves it and asks for your permission. Click accept, and the file appears in the list on the left.

That's the pattern for everything you build: you ask, it proposes, you read, you approve.

## The terminal, the few times you need it

The terminal is a window where you type instructions to your computer instead of clicking. VS Code has one built in: choose **Terminal**, then **New Terminal**. It opens at the bottom, already inside your `learnhub` folder.

You'll only need it for a few setup steps. These five commands are enough:

| Command | What it does |
|---|---|
| `pwd` | Shows which folder you are in |
| `ls` | Lists what is in this folder (`dir` also works on Windows) |
| `mkdir notes` | Makes a new folder called notes |
| `cd notes` | Moves into that folder |
| `cd ..` | Moves back up one folder |

Now make sure your laptop has **Git**, the tool that saves versions of your work:

- **Mac:** type `git --version` and press Enter. If a box asks to install developer tools, click **Install** and wait for it to finish.
- **Windows:** install **Git for Windows** from git-scm.com, keeping the default options. Then close VS Code and open it again.

And **Node.js**, which runs the websites you build in week three and the videos in week four. Download the version marked **LTS** from nodejs.org and install it with the default options. Close VS Code and open it again, then type `node --version`. A number starting with `v` means it worked.

## GitHub, so Claude Code can save your work

GitHub stores your code and every version of it. It's your undo button: if a change breaks everything, you go back to the last version that worked.

Sign up at github.com first. Then give Claude Code permission to save to your GitHub account, once, with the GitHub CLI:

**Windows**, in the VS Code terminal:

```powershell
winget install --id GitHub.cli --source winget
```

Then close VS Code completely and open it again, so it finds the new command.

**Mac:** download the macOS installer from github.com/cli/cli/releases/latest (the file ending `.pkg`) and open it. If your Mac refuses to open it, go to **System Settings**, then **Privacy & Security**, and click **Open Anyway**. If you already use Homebrew, `brew install gh` does the same job.

Then, on either computer, in the VS Code terminal:

```bash
gh auth login
```

Answer the questions: **GitHub.com**, then **HTTPS**, then **Yes** to authenticate Git with your GitHub credentials, then **Login with a web browser**. Copy the code it shows, press Enter, paste the code in the browser and approve.

From now on, when you tell Claude Code "commit and push", it can.

## Supabase and Vercel

Two more free accounts. Use **Continue with GitHub** for both, so one login covers all three.

- **Supabase** (supabase.com) is a database with sign-in built in. You'll use it in week three. The free plan gives you two projects. A free project pauses after a week with no activity, which is fine: you can wake it up from the dashboard.
- **Vercel** (vercel.com) puts your site on the internet at a real link. The free Hobby plan is for personal, non-commercial projects, which is everything you build in this course until you start charging for it.

You don't need to create anything inside Supabase or Vercel yet. Signing in is enough.

## Check it all works

Let Claude Code check your setup for you. Ask it:

> *"Check I am ready to build: run git --version, node --version and gh auth status, and tell me in plain English whether I can save work to GitHub. If anything is missing, tell me how to fix it."*

Then take the screenshots for this week's assignment: Claude showing Pro, ChatGPT, Gemini, GitHub, Supabase and Vercel all signed in, and Claude Code open in VS Code.

If you have all seven, your builder setup is done. This week's project uses every piece of it.

## What you should be able to do after this

Open your project folder in VS Code, work with Claude Code beside your files, use the built-in terminal when a step needs it, and let Claude Code save your work to GitHub.

## Transcript
