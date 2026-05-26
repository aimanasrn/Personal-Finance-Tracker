# Deployment Guide

This app is designed for `Vercel` + `Supabase`.

## 1. Supabase Setup

Create a Supabase project, then run these SQL files in the Supabase SQL Editor in this order:

1. [20260524_init_personal_finance_tracker.sql](../supabase/migrations/20260524_init_personal_finance_tracker.sql)
2. [20260525_auth_profile_rls_patch.sql](../supabase/migrations/20260525_auth_profile_rls_patch.sql)
3. [seed.sql](../supabase/seed.sql)

## 2. Required Environment Variables

Add these in Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

Important:

- `NEXT_PUBLIC_SUPABASE_URL` must be the base project URL.
- Do not use the REST endpoint ending with `/rest/v1/`.

## 3. Supabase Auth Domain Configuration

In `Supabase > Authentication > URL Configuration`:

- Set `Site URL` to your main deployed domain
- Add redirect URLs for your deployed app

Recommended entries:

- `https://your-app.vercel.app`
- `https://your-app.vercel.app/login`
- `https://your-app.vercel.app/signup`
- `https://your-app.vercel.app/dashboard`

If you use a custom domain, use that domain as the main `Site URL` too.

## 4. Vercel Deploy Checklist

- Project is connected to the correct Git repository
- All three environment variables are set in the correct Vercel environment
- Supabase SQL has already been applied
- Supabase `Site URL` matches the live Vercel domain
- Supabase redirect URLs include the live domain

## 5. Common Production Issues

### `POST /login 500`

Usually caused by:

- missing Vercel environment variables
- incorrect Supabase URL
- server-side auth action failing before redirect

Check Vercel `Functions` logs for the failing request.

### Signup returns `400`

Usually caused by:

- Supabase auth rate limiting
- user already exists
- redirect/site URL mismatch
- disabled or misconfigured auth settings

### Login succeeds, dashboard crashes

Usually caused by:

- missing tables in Supabase
- missing `profiles` backfill/RLS patch
- policies or schema not applied yet

### Charts warn about width or height

If you still see this after deployment, make sure the latest build containing the `ResponsiveContainer` sizing fix is deployed.

## 6. Recommended Production Checks

- Sign up with a fresh account
- Log in with an existing account
- Add a transaction
- Edit and delete a transaction
- Open reports
- Export CSV
- Save settings
- Sign out
