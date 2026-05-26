# Testing Guide

## Local Verification

Run these commands before deploying:

```bash
npm run test
npm run build
```

For browser coverage:

```bash
npm run test:e2e
```

## What The Tests Cover

- auth action behavior
- session handling
- transaction validation and CRUD flows
- profile/settings updates
- server-side logging helpers

## Current Practical Notes

- `Vitest` is the most reliable local verification path for fast feedback.
- `Playwright` coverage exists for auth, transactions, reports, and settings.
- Some e2e flows depend on a working Supabase project and valid environment variables.

## Manual QA Checklist

### Guest flow

- Landing page loads
- `Sign up` and `Log in` buttons navigate correctly

### Auth flow

- Sign up with a new email
- Log in with an existing user
- Sign out returns to the login page

### Transactions

- Add income
- Add expense
- Confirm category suggestion appears when expected
- Edit a transaction
- Delete a transaction
- Filter by date, category, and type

### Reports

- Open the reports page
- Confirm monthly totals render
- Confirm charts render without layout warnings
- Export CSV

### Settings

- Update display name
- Change preferred currency
- Save preferences and confirm success state

## Debugging Tips

- Check browser `Network` tab for `400` or `500` auth responses.
- Check Vercel `Functions` logs for production-only crashes.
- Check Supabase `Authentication` settings if sign-up or login works locally but fails on the deployed domain.
- If authenticated pages cannot load data, verify the migration, patch, seed, and RLS policies were all applied.
