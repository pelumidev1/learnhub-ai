---
title: Building a website with Claude Code and putting it live on Vercel
duration_minutes: 20
published: false
video_url:
chapters: [{"label":"Set up the project","at":0},{"label":"Run it on your laptop","at":0},{"label":"Save it to GitHub","at":0},{"label":"Connect GitHub to Vercel","at":0},{"label":"Every save goes live","at":0},{"label":"When the build fails","at":0},{"label":"Your own domain, when you are ready","at":0}]
resources: [{"label":"Claude Code in VS Code","url":"https://code.claude.com/docs/en/vs-code","kind":"doc","cost":"Free"},{"label":"Adding a custom domain, Vercel docs","url":"https://vercel.com/docs/domains/working-with-domains/add-a-domain","kind":"doc","cost":"Free"}]
resources_checked_on: 2026-09-29
---

By the end of this lesson your project is on the internet at a real link, and every change you save goes live on its own.

## Set up the project

Step 1 of most plans is setting up the project. If yours does not say how, use this:

> *"Set up a new Next.js project in this folder with TypeScript and Tailwind, using the App Router. Put all the site's words in one file. I am not a developer: as you go, explain each decision in one plain sentence, and at the end tell me which files I will actually edit and which I should leave alone."*

Watch the files appear on the left as it works. Read its explanation at the end. You now know which two or three files are yours to touch.

## Run it on your laptop

Ask Claude Code:

> *"How do I see this running on my laptop? Start it for me."*

It starts a local version and gives you a link like `http://localhost:3000`. Open it in Chrome. Only your laptop can see this link. It is where you check each step before anyone else sees it.

If the page is blank or shows an error, copy the whole error, paste it into Claude Code, and say what you expected to see.

## Save it to GitHub

GitHub stores your code and every version of it. You set up the permission in week one, so Claude Code does this part for you:

> *"Create a private GitHub repository for this project, commit everything, and push it."*

A **commit** is a saved version with a short note saying what changed. A **push** sends it up to GitHub. From now on, after every step of your plan that works:

> *"Commit this with a short note saying what changed, and push."*

If step 4 breaks everything, you can go back to step 3.

## Connect GitHub to Vercel

You do this once per project:

1. Sign in to vercel.com.
2. Click **Add New**, then **Project**.
3. Find your repository in the list and click **Import**.
4. Leave the settings as they are and click **Deploy**.

After a minute or two you get a link ending in `.vercel.app`. Open it on your phone. That is your project, live.

If it fails because the project uses Supabase, that is expected until the next lesson adds your keys. Go on to lesson 4 and come back.

## Every save goes live

From now on the loop is:

1. Ask Claude Code for one change.
2. Check it on `localhost`.
3. Tell it to commit and push.
4. Vercel sees the new version and puts it live within a minute or two.

You never upload files by hand. Pushing to GitHub is the upload.

## When the build fails

Sometimes a change works on your laptop and fails on Vercel. The Vercel dashboard shows the deployment in red.

1. Click the failed deployment and open the **build logs**.
2. Copy the lines in red.
3. Paste them into Claude Code: *"The Vercel build failed with this error. Find the cause and show me before you change anything. Then fix it, check the build passes on my laptop, and push."*

The live site keeps showing the last version that worked while you fix it, so a failed build never takes your site down.

## Your own domain, when you are ready

A `.vercel.app` link works, but `amakasbakes.com` is what customers remember. A `.com` costs about $10 to $15 a year from a registrar such as Namecheap. It is optional on this course, because it is not free, but it is the first thing to buy when your site starts bringing in money.

1. Buy the domain at the registrar.
2. In Vercel, open your project, then **Settings**, then **Domains**, and click **Add Domain**.
3. Vercel shows you the exact records to add. Copy them into your registrar's DNS settings (on Namecheap, **Advanced DNS**). Use the values Vercel shows for your project, not ones from a tutorial.
4. Wait. It can take from a few minutes to a few hours. Vercel shows a green tick when it is ready.

## What you should be able to do after this

Have Claude Code set up your project and explain it, run it on your laptop, save versions to GitHub by asking, and have every push go live on Vercel, with your own domain when you want one.

## Transcript
