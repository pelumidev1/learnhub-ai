---
title: Adding a database and sign-in with Supabase
duration_minutes: 20
published: false
video_url:
chapters: [{"label":"Create a Supabase project","at":0},{"label":"Your two keys","at":0},{"label":"Let Claude Code build the table","at":0},{"label":"Who can see what","at":0},{"label":"Sign-in","at":0},{"label":"The same keys on Vercel","at":0}]
resources: [{"label":"Supabase docs","url":"https://supabase.com/docs","kind":"doc","cost":"Free"},{"label":"Supabase pricing","url":"https://supabase.com/pricing","kind":"doc","cost":"Free plan available"}]
resources_checked_on: 2026-09-29
---

A database is what turns a page into an app. This lesson connects yours to Supabase, so what people submit is saved, and only the right people can see it.

## Create a Supabase project

1. Sign in to supabase.com and click **New project**.
2. Give it a name, choose a strong database password and save it in your password manager.
3. Pick the region closest to your customers. For West Africa, a European region is usually the closest option.

It takes a minute or two to set up.

## Your two keys

Supabase gives your project two kinds of key. Knowing the difference is the most important security fact in this course.

- **Publishable key** (starts `sb_publishable_`). Safe to use in the browser. On its own it can only do what your rules allow.
- **Secret key** (starts `sb_secret_`). Full access to everything, ignoring all rules. It must never appear in a web page, a screenshot or a WhatsApp message.

Older projects and older tutorials call these the **anon** key and the **service_role** key. Same idea: anon is the safe one, service_role is the dangerous one.

Find them under **Project Settings**, then **API Keys**. You also need your **Project URL**.

Ask Claude Code where to put them. It will create a file called `.env.local` in your project. Paste the URL and the publishable key there yourself. Only give it the secret key if the plan truly needs one, and ask why first.

## Let Claude Code build the table

> *"Act as a senior backend engineer. Do the database step of PLAN.md. Design the Supabase tables this project needs, how they relate, and the security rules so people can only see what BUILD.md says they can. Keep it minimal but real. Show me the SQL before you run anything. Then explain the whole design in plain English, as if I have never seen a database, and flag anything that will cause me pain later if I get it wrong now."*

Read the explanation, especially the last part. Amaka's says: *orders: one row per cake order, with name, phone, cake, date and address.* It also flagged that storing the cake as free text would make her weekly totals messy, and suggested a short list of cakes instead. That matches her BUILD.md, so she approves.

Then test it: submit the form on `localhost`, and open **Table Editor** in Supabase. Your test order should be there.

## Who can see what

Every table needs rules about who can read and write it. Supabase calls this **Row Level Security**, or RLS.

With RLS on and no rules, nobody can read the table through your site. That's the safe starting point. Then you add rules for exactly what your BUILD.md says. Amaka's are:

- anyone can **add** an order
- only Amaka, signed in, can **read** orders

Ask Claude Code to write rules like these and to explain each one. Then check the table in Supabase shows RLS as enabled. **Never switch RLS off to make something work.** If something is blocked, the rule is wrong. Fix the rule.

## Sign-in

> *"Add sign-in with email and password using Supabase Auth. Only signed-in users can see the orders page. Customers do not sign in."*

Supabase sends the sign-in emails for you. Its built-in email sender only sends a few emails an hour. That's fine while you're building and testing. Before real customers sign up in numbers, you'll need your own email sender, and Claude Code can set one up for you then.

## The same keys on Vercel

Your `.env.local` file stays on your laptop and never goes to GitHub. So Vercel doesn't have your keys yet.

1. In Vercel, open your project, then **Settings**, then **Environment Variables**.
2. Add the same names and values that are in `.env.local` for the URL and publishable key.
3. Go to **Deployments** and **Redeploy** the latest one. Changes to these settings only apply to a new deployment.

Now test on the live link: place an order on your phone, sign in on your laptop, and check it's there.

## What you should be able to do after this

Connect your project to Supabase, save what people submit, control who can read it with RLS, add sign-in, and give Vercel the keys it needs, without ever exposing your secret key.

## Transcript
