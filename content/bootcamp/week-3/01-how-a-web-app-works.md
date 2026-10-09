---
title: How a web app works, in plain English
duration_minutes: 12
published: false
video_url:
chapters: [{"label":"Website or web app","at":0},{"label":"The five parts","at":0},{"label":"Amaka's order page, part by part","at":0},{"label":"How the whole thing fits together","at":0},{"label":"A warm-up, if you want one","at":0}]
resources: [{"label":"How Claude Code works","url":"https://code.claude.com/docs/en/how-claude-code-works","kind":"doc","cost":"Free"}]
resources_checked_on: 2026-09-29
---

This week you build something real and put it on the internet. You won't write the code yourself. Claude Code will. Your job is to know what you're asking for, and that starts with knowing what the parts are called.

## Website or web app

A **website** shows the same thing to everyone. Your week one "about me" page is a website.

A **web app** remembers things and responds to who is using it. People can fill in a form, sign in, and see their own information. If it saves anything, it's an app.

Both are built the same way this week. An app just has more parts switched on.

## The five parts

| Part | What it does | Your tool |
|---|---|---|
| **Front end** | What people see and tap: pages, buttons, forms | Built by Claude Code |
| **Back end** | The work people do not see: checking a form, saving an order | Built by Claude Code |
| **Database** | Where information is kept, in tables, like a spreadsheet that code can read | Supabase |
| **Sign-in** | Knowing who someone is, so they only see what is theirs | Supabase |
| **Hosting** | A computer that is always on and serves your site at a link | Vercel |

**GitHub** sits in the middle. It stores every version of your code, and Vercel watches it. When your code changes on GitHub, Vercel puts the new version live.

## Amaka's order page, part by part

Amaka wants customers to order a cake without a long WhatsApp back and forth. Here is her idea in those five parts:

- **Front end:** a page with her four cakes, prices and photos, and an order form: name, phone number, cake, date, delivery address.
- **Back end:** checks the form is filled in properly and saves it.
- **Database:** an `orders` table with one row per order.
- **Sign-in:** only Amaka can sign in, to see the list of orders. Customers don't need an account.
- **Hosting:** live on Vercel, at a link she puts in her Instagram bio.

Written out like that, Claude Code knows exactly what to build. "Build me a cake website" doesn't tell it much.

## How the whole thing fits together

This is the setup every project this week follows, in the order the work happens:

1. **Decide, in the Claude app.** Before any file exists, Claude interviews you and writes down what you're building, for whom, and what it must never look like. Most builds that go wrong, go wrong at this step, before there's any code.
2. **Context, in your project folder.** `CLAUDE.md` and your `context` folder from week one tell Claude Code the rules of this project, so you stop re-explaining it every session.
3. **Build, in VS Code.** Claude Code writes the code. You read what it proposes, push back when it's wrong, and approve.
4. **Save, on GitHub.** Every working step is saved as a version. It's your undo button.
5. **Live, on Vercel.** Vercel watches GitHub and puts each new version on the internet. Supabase holds the data and the sign-ins.

You don't need to understand the code, but you do need to name what it's made of, because naming it makes Claude Code produce fewer mistakes. This week that is **Next.js** (the framework the site is built in), **TypeScript** (the careful kind of JavaScript it is written in) and **Tailwind** (how it gets styled).

When something breaks, the first question is always *which part is it?* A page that looks wrong is front end. A form that says "saved" but nothing appears is the database. A link that won't open is hosting.

## A warm-up, if you want one

If you would like to see a result before you open VS Code, try **v0** (v0.app) or **Lovable** (lovable.dev). You describe a page in a chat box and they build it in the browser. Both have free allowances.

They're good for sketching an idea in ten minutes. This week's project is built in Claude Code, because you own every file, it works with the setup from week one, and nothing limits what you can add later.

## What you should be able to do after this

Describe your own project idea in the five parts, and say which tool handles each one.

## Transcript
