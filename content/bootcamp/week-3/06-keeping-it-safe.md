---
title: Keeping it safe and watching it: secrets, keys, security and monitoring
duration_minutes: 16
published: false
video_url:
chapters: [{"label":"Secrets stay secret","at":0},{"label":"Rules on every table","at":0},{"label":"Lock your accounts","at":0},{"label":"Ask for a security review","at":0},{"label":"Watching it after launch","at":0}]
resources: [{"label":"Claude Code security","url":"https://code.claude.com/docs/en/security","kind":"doc","cost":"Free"},{"label":"Supabase docs","url":"https://supabase.com/docs","kind":"doc","cost":"Free"}]
resources_checked_on: 2026-09-29
---

The moment your link is public, strangers can find it. Most will be customers. A few will be people trying things they should not. This lesson closes the doors they try first.

## Secrets stay secret

A secret is anything that gives access: your Supabase secret key, a database password, an API key for any service.

- Secrets live in `.env.local` on your laptop and in Vercel's **Environment Variables**. Nowhere else.
- Check your project has a file called `.gitignore` that lists `.env.local`. Ask Claude Code: *"Confirm .env.local is in .gitignore and has never been committed."*
- In a Next.js project, any setting whose name starts with `NEXT_PUBLIC_` is sent to every visitor's browser. The publishable key can go there. **A secret key must never have that prefix.**
- Never paste a secret into WhatsApp, a screenshot or a support chat.

If a secret leaks, create a new one in the service's dashboard, delete the old one, and update `.env.local` and Vercel. Do it the same day.

## Rules on every table

You turned on RLS in lesson 4. Check it again every time you add a table:

> *"List every table in my Supabase project, whether RLS is on, and what each rule allows, in plain English."*

If any answer surprises you, fix the rule before you push. Supabase also flags exposed tables: the Table Editor labels any table with RLS off, and the **Security Advisor** in the dashboard lists problems it finds. Read both.

## Lock your accounts

Most sites are not hacked through their code. They are taken over through an account.

- Turn on **two-factor authentication** for GitHub, Vercel, Supabase and your email.
- Use a password manager and a different password for each.
- Keep your GitHub repository **private** unless you mean to share it.

## Ask for a security review

Before you share your link widely, ask Claude Code to check your work as an attacker would:

> *"Review this project for security problems. Check for exposed secrets, tables without RLS, pages that should need sign-in but do not, and forms that accept anything. List what you find, most serious first. Do not change anything yet."*

Claude Code also has a built-in `/security-review` command that does a similar check on your latest changes. Fix the serious items one at a time, testing after each.

A review is not a guarantee. It catches the common mistakes, and the common mistakes are what attackers try first.

## Watching it after launch

A live site needs checking, the way a shop needs opening every morning.

- **Vercel dashboard:** every deployment, and whether it worked. The **Logs** tab shows errors as they happen on the live site. Paste anything red into Claude Code.
- **Vercel Analytics:** switch it on in your project to see how many people visit and which pages they use. It has a free allowance.
- **Supabase dashboard:** check your tables for new rows, and the usage page, so you know before you hit a free-plan limit.

Amaka checks all three every Monday morning. It takes five minutes. The first week, the logs showed an error every time someone typed a phone number with a space in it. She had lost three orders without knowing.

## What you should be able to do after this

Keep your secrets out of your code and out of the browser, check every table has the right rules, protect your accounts, get a security review before launch, and check your live site every week.

## Transcript
