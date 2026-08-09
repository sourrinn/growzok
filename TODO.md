# Roadmap

Living backlog for turning the habit tracker into a retention-focused product.
Organized by phase; check items off as they ship.

## Phase 1 — Analytics core (complete)

The highest-ROI slice: make consistency visible, not just streaks.

- [x] **Habit categories** — Health / Fitness / Learning / Finance / Productivity / Personal, set at creation, shown on each habit and broken out in Reports.
- [x] **Flexible frequency** — Daily, Weekdays, Weekends, N times/week, or specific days of the week (custom).
- [x] **Success rate** — `completed / trackable` since a habit's creation date, frequency-aware (e.g. weekends don't count against a weekdays-only habit).
- [x] **Current & best streak** — frequency-aware (skips non-trackable days without breaking the streak); for times/week habits, shown as "this week's progress" instead, since a daily streak doesn't fit that shape.
- [x] **Habit heatmap** — GitHub-style calendar on each habit's detail page.
- [x] **Weekly / monthly / quarterly / yearly reports** — completed, missed, success rate, top habit, weakest habit, category breakdown, computed client-side from already-loaded habit history (no new endpoints).
- [x] **Dashboard category filter tabs** — shown once more than one category is in use.
- [x] **Completion-time analytics** — logs a timestamp per completion; shows usual completion time on the habit detail page.
- [x] **Trend detection** — simple period-over-period diffing (this month vs last) plus weekday distribution ("most often on Tuesdays", "primarily missed on Saturdays"), shown as plain-language insights. No AI — just arithmetic over existing history, only surfaced when there's enough signal.

## Phase 2 — Advanced habit features & retention hooks (core shipped)

- [x] **Habit targets** — optional daily numeric goal (count/time/distance/currency + unit, e.g. "8 glasses"). Logging a value derives "done" from value ≥ goal, so every existing streak/success-rate/heatmap consumer works unchanged.
- [x] **Miss allowance** — an optional allowed-misses-per-week number per habit; the card/detail page shows "on track" vs "N over" for the current week instead of (or alongside) a strict streak.
- [x] **Habit templates** — 30-Day Fitness, Student, Developer, Morning Routine bundles, offered on the empty-state dashboard; bulk-creates all of a template's habits in one request.
- [ ] **Goals linked to habits** — e.g. "Read 12 Books" progress driven by a reading habit's completions. Needs a new `goals` collection + CRUD + UI; not yet built.
- [ ] **Journal entries** — a short note per completion. Needs a UI change to the toggle interaction (a note field) and storage; not yet built. The "mined for consistency correlations" part from the original pitch needs enough real usage data to be meaningful — track as a much later fast-follow, not a v1 feature.
- [ ] **Smart reminders (email)** — needs a decision only you can make: which email provider (e.g. Resend, SendGrid, Postmark) and its API key, plus a way to trigger sends on a schedule (e.g. Vercel Cron). Not started — ask before building this one, since it can't be faked or deferred quietly.
- [ ] **PWA basics** (installable, offline-tolerant) — no external dependency needed, just not yet prioritized in this pass.

## Phase 3 — AI & social (build only after Phase 1/2 data exists to work with)

- [ ] AI weekly review (auto-generated summary of strongest/weakest areas, best days)
- [ ] AI habit coach (correlate a slump in one habit with a shift in another)
- [ ] Lightweight accountability: invite a partner, share a streak
- [ ] Optional leaderboards / shared habits (family challenge) — keep opt-in; this is where habit apps often overreach
- [ ] Health app integration (Apple Health / Google Fit auto-import for steps, sleep, exercise)
