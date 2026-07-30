# Habits

A minimal, sleek habit tracker.
**Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Auth.js · MongoDB.**

Sign up, then tap a habit to mark it done for the day. Each one grows a 14-day "stem" so you can see your rhythm at a glance, and your success rate, streak, and category are tracked automatically. Every account sees only its own habits.

See [TODO.md](TODO.md) for the full feature roadmap.

## Analytics

Each habit tracks more than a streak:

- **Category** (Health, Fitness, Learning, Finance, Productivity, Personal) and
  **frequency** (Daily, Weekdays, Weekends, N times/week, or specific days of
  the week), set at creation. The dashboard shows filter tabs once more than
  one category is in use.
- **Success rate** — completed ÷ trackable days since creation, frequency-aware
  (a weekday-only habit isn't penalized for weekends).
- **Current & best streak** for daily/weekdays/weekends/custom-day habits;
  N-times/week habits show progress toward this week's target instead, since a
  daily streak doesn't fit that shape.
- **Habit detail page** (click any habit) — a GitHub-style completion heatmap,
  its stats, usual completion time, and plain-language insights (e.g. "your
  success rate is up 17% vs last month", "you complete this most often on
  Tuesdays") generated from simple period-over-period and weekday diffing — no
  AI, and nothing shown until there's enough history to say something real.
- **Reports** page — completed/missed/success rate, top and weakest habit, and
  a per-category breakdown, for the current week, month, quarter, or year.
  Computed client-side from each habit's history — no extra API calls.

## Advanced habit features

- **Targets** — give a habit a daily numeric goal instead of a plain checkmark
  (count/time/distance/currency + a unit, e.g. "8 glasses"). Logging a value
  derives "done" from value ≥ goal, so streaks/success-rate/the heatmap all
  keep working unchanged underneath.
- **Miss allowance** — set how many misses per week are still "on track" for a
  habit; the card and detail page show on-track status for the current week
  instead of (or alongside) a strict streak.
- **Templates** — 30-Day Fitness, Student, Developer, and Morning Routine
  bundles, offered when your habit list is empty; picks a category + frequency
  per habit and creates them all in one request.

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
    page.tsx                  Home (auth-gated) — header + dashboard
    reports/page.tsx          Weekly/monthly/quarterly/yearly reports (auth-gated)
    habit/[id]/page.tsx       Habit detail — stats + heatmap (auth-gated)
    login/ · register/        Auth pages
    globals.css               Tailwind v4 import + design tokens
    api/
      auth/[...nextauth]/     Auth.js route handler
      register/route.ts       POST (sign up)
      habits/
        route.ts              GET (list) · POST (create)    — auth-gated
        bulk/route.ts         POST (create from a template)  — auth-gated
        [id]/route.ts         DELETE                         — auth-gated
        [id]/toggle/route.ts  POST (toggle a date)           — auth-gated
        [id]/progress/route.ts POST (log a target value)     — auth-gated
  components/
    AppHeader.tsx              Nav + account bar + sign-out (server component)
    HabitDashboard.tsx · HabitList.tsx · HabitCard.tsx · AddHabit.tsx · StreakStem.tsx
    HabitDetail.tsx · Heatmap.tsx · ReportsView.tsx · StatTile.tsx · AuthForm.tsx
  hooks/useHabits.ts          Client data layer with optimistic updates
  lib/
    mongodb.ts                Cached MongoDB connection (safe across HMR)
    password.ts               scrypt hash/verify
    habits.ts                 Habit data access (toggle, target-progress logging — both atomic update pipelines)
    habitInput.ts              Shared request-body validation (category, frequency, target, miss allowance)
    templates.ts               Static habit-template bundles
    users.ts                  User data access (unique-email index, race-safe create)
    dates.ts                  Local-date helpers
    frequency.ts              Trackable-day logic + frequency labels (incl. custom days)
    analytics.ts               Success rate, streaks, weekly progress, on-track status, reports
    completionStats.ts         Completion-time-of-day stats
    insights.ts                 Trend detection (period-over-period + weekday diffing)
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

## How streaks and success rate work

A day counts when you tap the circle. Your current streak is the number of
consecutive *trackable* days completed, ending today — or yesterday if today
isn't done yet — so a streak survives until you actually miss a trackable day.
For a weekdays-only habit, weekends don't count and don't break the streak. For
an N-times/week habit, a daily streak doesn't fit the shape of the goal, so its
card shows progress toward the current week's target instead.

Success rate is completed ÷ trackable days since the habit was created (capped
per calendar week at the target for N-times/week habits, so over-completing one
week doesn't inflate the rate). Dates use your local timezone.

## Notes

- Auth uses JWT sessions (no session table), so it needs no database adapter — the API routes read the user id from the session on every request and scope all habit queries by it.
- The MongoDB connection is cached on the global object in development so hot-reloads don't open a new pool each time.
- Toggling a day is a single atomic MongoDB update (an aggregation pipeline that adds the date if absent and removes it if present), so rapid taps stay consistent.
- The unique index on `users.email` is created lazily on first use and self-heals if that first attempt fails (e.g. Mongo isn't up yet) rather than wedging the store for the process's lifetime.
- The client updates optimistically and rolls back if a request fails.
