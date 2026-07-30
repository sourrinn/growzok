# Habits

A minimal, sleek habit tracker.
**Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Auth.js · MongoDB.**

Sign up, then tap a habit to mark it done for the day. Each one grows a 14-day "stem" so you can see your rhythm at a glance, and your current streak is tracked automatically. Every account sees only its own habits.

## Accounts

Auth is email + password via [Auth.js](https://authjs.dev) (NextAuth v5), with JWT
session cookies. Users are stored in MongoDB, same as habits, and every habit is
scoped to its owner.

- Register at `/register`, sign in at `/login`; the dashboard redirects to `/login`
  when signed out.
- Passwords are hashed with Node's built-in scrypt (no native dependencies).
- Set `AUTH_SECRET` in the environment (used to sign session cookies). Generate one
  with `npx auth secret` or `openssl rand -base64 32`.

## Requirements

- Node.js 20 or newer
- A MongoDB database — either:
  - MongoDB running locally (`mongodb://127.0.0.1:27017`), or
  - A free MongoDB Atlas cluster (https://www.mongodb.com/atlas)

## Setup

**1. Install dependencies**

```bash
npm install
```

**2. Configure environment**

```bash
cp .env.local.example .env.local
```

Set `AUTH_SECRET` (required — run `npx auth secret` to generate one) and
`MONGODB_URI`. For Atlas the URI looks like:

```
mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
```

The database and its `habits` / `users` collections are created automatically the
first time they're written.

**3. Run it**

```bash
npm run dev
```

Open http://localhost:3000

## Production

Set `AUTH_SECRET` and `MONGODB_URI` (and optionally `MONGODB_DB`) in the
environment before starting.

If you're self-hosting anywhere other than Vercel (a VM, a Docker container, a
plain Node server), also set `AUTH_URL` to the app's public URL. Without it,
Auth.js falls back to trusting the incoming request's `Host` header to build
its own callback/redirect URLs — fine behind a reverse proxy that sets that
header itself, but worth pinning explicitly once the app is reachable from the
internet.

```bash
npm run build
npm start
```

## Deploy to Vercel

This app deploys cleanly to Vercel. In your project settings, add `AUTH_SECRET`,
`MONGODB_URI`, and `MONGODB_DB` as environment variables and use an Atlas connection
string. Under Atlas Network Access, allow your deployment's IP (or `0.0.0.0/0` for
anywhere). `AUTH_URL` isn't needed here — Vercel's own URL is auto-detected.

## Project structure

```
src/
  auth.ts                     Auth.js config (Credentials provider, JWT sessions)
  app/
    layout.tsx                Root layout, fonts, global styles
    page.tsx                  Home (auth-gated) — account bar + dashboard
    login/ · register/        Auth pages
    globals.css               Tailwind v4 import + design tokens
    api/
      auth/[...nextauth]/     Auth.js route handler
      register/route.ts       POST (sign up)
      habits/
        route.ts              GET (list) · POST (create)   — auth-gated
        [id]/route.ts         DELETE                        — auth-gated
        [id]/toggle/route.ts  POST (toggle a date)          — auth-gated
  components/                 UI: dashboard, list, card, add form, streak stem, auth form
  hooks/useHabits.ts          Client data layer with optimistic updates
  lib/
    mongodb.ts                Cached MongoDB connection (safe across HMR)
    password.ts               scrypt hash/verify
    habits.ts                 Habit data access (atomic toggle via update pipeline)
    users.ts                  User data access (unique-email index, race-safe create)
    dates.ts                  Local-date + streak helpers
  types/habit.ts · user.ts    Shared types + serializers
  types/next-auth.d.ts        Session augmentation (adds user id)
```

## Troubleshooting

**`MongoServerError: bad auth : authentication failed`** — Atlas rejected the
username/password in `MONGODB_URI`. This is a database user, created in Atlas
under **Database Access**, not your Atlas account login. Check:

- The user exists in **Database Access** with the exact username/password used
  in the connection string.
- If the real password contains special characters (`@ : / % ? #`), they must
  be percent-encoded in the URI, or authentication will fail even with the
  correct password.
- The user has read/write permissions on the target cluster/database.

**Connection hangs or times out** — usually **Network Access** (the IP
allowlist), not credentials. Add your current IP (or `0.0.0.0/0` for testing)
under Atlas's **Network Access**.

## How streaks work

A day counts when you tap the circle. Your streak is the number of consecutive completed days ending today — or yesterday if today isn't done yet — so a streak survives until you actually miss a day. Dates use your local timezone.

## Notes

- Auth uses JWT sessions (no session table), so it needs no database adapter — the API routes read the user id from the session on every request and scope all habit queries by it.
- The MongoDB connection is cached on the global object in development so hot-reloads don't open a new pool each time.
- Toggling a day is a single atomic MongoDB update (an aggregation pipeline that adds the date if absent and removes it if present), so rapid taps stay consistent.
- The unique index on `users.email` is created lazily on first use and self-heals if that first attempt fails (e.g. Mongo isn't up yet) rather than wedging the store for the process's lifetime.
- The client updates optimistically and rolls back if a request fails.
