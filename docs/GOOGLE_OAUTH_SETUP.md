# Google Sign-In setup

_Configured and tested 2026-07-23. This is a dashboard-only setup — the app code (button, server action, callback handler) is already built. Keep this on file in case the provider ever needs re-creating._

## How it flows
1. User taps **Continue with Google** → the app calls Supabase.
2. Supabase sends them to Google → Google sends them **back to Supabase** → Supabase sends them to the app's `/auth/callback`, which sets the session.

The key gotcha: the redirect URL you give **Google** is the **Supabase** one, not the app's.

## Part 1 — Google Cloud Console
https://console.cloud.google.com

1. Create/select a project (e.g. `LearnHub AI`).
2. **APIs & Services → OAuth consent screen** (now branded **Google Auth Platform**):
   - **Get started** → App name `LearnHub AI`, support email → **Next**
   - **Audience** → **External** → **Next** _(this is the old "User type")_
   - Contact email → **Next** → agree → **Create**
   - Then **Publish app** so anyone can sign in (not just test users).
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID**:
   - Type: **Web application**, name `LearnHub Web`
   - **Authorized redirect URIs** → add exactly:
     ```
     https://ohuahkhoimykmxlqbrvh.supabase.co/auth/v1/callback
     ```
   - **Create** → copy the **Client ID** and **Client Secret**.

## Part 2 — Supabase
https://supabase.com/dashboard → project → **Authentication**

4. **Sign In / Providers → Google** → enable → paste **Client ID** + **Client Secret** → **Save** (wait for the green confirmation).
5. **URL Configuration → Redirect URLs** → ensure both are allow-listed:
   ```
   https://learnhub-ai-alpha.vercel.app/**
   http://localhost:3000/**
   ```

## Test
6. https://learnhub-ai-alpha.vercel.app/login → **Continue with Google** → should land on the dashboard. The `handle_new_user` DB trigger fills the profile row from Google's `full_name` / `avatar_url` automatically.

## Common error
- `{"error_code":"validation_failed","msg":"Unsupported provider: provider is not enabled"}` → the provider isn't enabled/saved in Supabase (Part 2, step 4). Usually **Save** wasn't clicked or the secret box was blank.
