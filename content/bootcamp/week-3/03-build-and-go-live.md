---
title: Building a website with Claude Code and putting it live on Vercel
duration_minutes: 20
published: false
video_url:
chapters: [{"label":"Run it on your laptop","at":0},{"label":"Save versions with GitHub Desktop","at":0},{"label":"Connect GitHub to Vercel","at":0},{"label":"Every save goes live","at":0},{"label":"When the build fails","at":0}]
resources: [{"label":"GitHub Desktop","url":"https://desktop.github.com","kind":"tool","cost":"Free"},{"label":"Claude Code common workflows","url":"https://code.claude.com/docs/en/common-workflows","kind":"doc","cost":"Free"}]
resources_checked_on: 2026-09-29
---

By the end of this lesson your project is on the internet at a real link, and every change you save goes live on its own.

## Run it on your laptop

After step 1 of your plan, ask Claude Code:

> *"How do I see this running on my laptop? Start it for me."*

It will start a local version and give you a link like `http://localhost:3000`. Open it in Chrome. Only your laptop can see this link. It is where you check each step before anyone else sees it.

If the page is blank or shows an error, copy the whole error, paste it into Claude Code, and say what you expected to see.

## Save versions with GitHub Desktop

GitHub stores your code and every version of it. The easiest way to use it is **GitHub Desktop**, a free app for Mac and Windows. Install it and sign in with your GitHub account.

1. **File, Add local repository**, and choose your project folder. If it says the folder is not a repository yet, click **create a repository**.
2. You will see every changed file. At the bottom left, type a short note of what changed, like *"Menu page with four cakes"*, and click **Commit**.
3. Click **Publish repository**. Leave **Keep this code private** ticked.

A commit is a saved version. Commit after every step of your plan that works. If step 4 breaks everything, you can go back to step 3.

## Connect GitHub to Vercel

1. Sign in to vercel.com (with GitHub, as in week one).
2. Click **Add New**, then **Project**.
3. Find your repository in the list and click **Import**.
4. Leave the settings as they are and click **Deploy**.

After a minute or two you get a link ending in `.vercel.app`. Open it on your phone. That is your project, live.

If it fails because the project uses Supabase, that is expected until the next lesson adds your keys. Go on to lesson 4 and come back.

## Every save goes live

From now on the loop is:

1. Ask Claude Code for one change.
2. Check it on `localhost`.
3. Commit in GitHub Desktop, then click **Push origin**.
4. Vercel sees the new version and puts it live within a minute or two.

You never upload files by hand. Pushing to GitHub is the upload.

## When the build fails

Sometimes a change works on your laptop and fails on Vercel. The Vercel dashboard shows the deployment in red.

1. Click the failed deployment and open the **build logs**.
2. Copy the lines in red.
3. Paste them into Claude Code: *"The Vercel build failed with this error. Fix it, and tell me why it happened."*

The live site keeps showing the last version that worked while you fix it, so a failed build never takes your site down.

## What you should be able to do after this

Run your project on your laptop, save versions to GitHub, and have every pushed change go live on Vercel.

## Transcript
