# The Most Useless Quiz Ever

Every question is a real, independently verifiable fact. Every question is also
something roughly 0.1% of the population could plausibly know. That's the entire
premise — difficulty by design, no common trivia, no shortcuts.

10 subjects, 1 quiz each (10 questions per quiz) ship out of the box, all
hand-researched and fact-checked. The app is built so an admin can add many
more quizzes/questions at any time without touching code.

---

## 1. Folder structure

```
gutfeelingtest/
├── client/                     # React + TypeScript + Vite frontend
│   ├── src/
│   │   ├── animations/         # Framer Motion variants
│   │   ├── components/
│   │   │   ├── admin/          # Admin-only layout/guard components
│   │   │   ├── layout/         # NavBar, Footer, PageContainer, AppLayout
│   │   │   ├── leaderboard/    # LeaderboardTable
│   │   │   ├── quiz/           # ChoiceButton, ProgressBar, NicknameForm/Gate, SubjectCard
│   │   │   └── ui/             # Modal, Skeleton, ErrorBoundary, PageTransition
│   │   ├── constants/          # Route helpers, icon map, config (API base URL, storage keys)
│   │   ├── context/            # NicknameContext, ToastContext, AdminAuthContext
│   │   ├── hooks/               # React Query hooks (subjects, quiz play, leaderboards, daily)
│   │   ├── pages/               # One file per route, admin pages under pages/admin
│   │   ├── services/             # Typed fetch wrappers per API resource
│   │   ├── types/                 # Shared frontend types
│   │   └── utils/                  # formatTime/scoreMessage/nickname validation
│   └── index.html, vite.config.ts, tailwind.config.js
│
├── server/                       # Express + TypeScript backend (JSON file storage)
│   ├── src/
│   │   ├── db/                   # JsonCollection (generic CRUD over a JSON file) + collections
│   │   ├── middleware/           # requireAdmin (JWT), error handler
│   │   ├── routes/                # One file per resource; routes/admin/* are protected
│   │   ├── seed/                  # content.ts (the 100 questions) + run.ts (seed script)
│   │   ├── services/               # Business logic (subjects, quizzes, questions, attempts,
│   │   │                             daily rotation, leaderboards, auth, stats)
│   │   ├── types/                   # Shared backend types
│   │   ├── utils/                    # ids, slugify, shuffle, date, errors
│   │   └── validation/                # Zod schemas for every mutating endpoint
│   └── data/                            # JSON "database" files, created on first run (gitignored)
│
├── package.json                          # npm workspaces root (client + server)
└── README.md
```

Clean separation of concerns throughout: routes never contain business logic
(that lives in `services/`), all mutations are Zod-validated, and the storage
layer (`JsonCollection`) is a single abstraction — swapping it for a real
database later means rewriting `server/src/db/` only, none of the routes or
services.

---

## 2. "Database" schema

There's no external database — the brief asked for something simpler than
Supabase, so persistence is a set of JSON files in `server/data/`, one per
collection, each behaving like a table with an auto-generated `id` primary key.
Every write is queued per-file and written atomically (temp file + rename), so
concurrent requests can't corrupt a collection.

| Collection | Shape | Notes |
|---|---|---|
| `subjects.json` | `{ id, slug, name, description, icon, color, order }` | One of the 10 top-level categories |
| `quizzes.json` | `{ id, subjectId, slug, title, description, order }` | FK → `subjects.id` |
| `questions.json` | `{ id, quizId, text, choices: [{id,text}], correctChoiceId, order }` | FK → `quizzes.id`. Exactly 4 choices |
| `players.json` | `{ id, nickname, nicknameLower, createdAt, lastSeenAt }` | No password — nickname is the identity |
| `attempts.json` | `{ id, playerId, nickname, quizId, subjectId, score, totalQuestions, timeMs, answers[], completedAt }` | One row per completed quiz |
| `dailyQuestions.json` | `{ id, date, text, choices[], correctChoiceId, source }` | `source` is `"scheduled"` (admin-set) or `"auto"` (rotated from the fallback pool) |
| `dailySubmissions.json` | `{ id, date, playerId, nickname, correct, timeMs, submittedAt }` | Unique per `(date, nickname)` |
| `admins.json` | `{ id, username, passwordHash }` | bcrypt-hashed; seeded once from env vars |

Foreign keys are enforced in application code (services check existence before
insert/delete, and deleting a subject cascades to its quizzes and questions).
"Indexes" are simple `Array.filter`/`Map` lookups — perfectly fine at this
scale (hundreds to low thousands of rows); see the scaling note below if you
outgrow it.

Ranking logic (used identically for overall/subject/quiz/daily boards): sort
by `score` descending, tie-break by `timeMs` ascending.

---

## 3. Environment variables

**`server/.env`** (copy from `server/.env.example`):
```
PORT=4000
JWT_SECRET=change-this-to-a-long-random-secret-in-production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=ChangeMe123!
CLIENT_ORIGIN=http://localhost:5173
```
`ADMIN_USERNAME`/`ADMIN_PASSWORD` are only used the very first time the server
starts (to seed `admins.json`). Changing them afterwards does nothing — use
the in-app "change password" flow instead (or delete `server/data/admins.json`
to reseed).

**`client/.env`** (copy from `client/.env.example`):
```
VITE_API_BASE_URL=/api
```
Leave this as `/api` for local dev (Vite proxies it to the backend) and for
same-origin production deploys. Point it at a full URL only if the API is
hosted on a different domain than the frontend.

---

## 4. Running it locally

```bash
# from the repo root
npm install                 # installs both client & server (npm workspaces)
cp server/.env.example server/.env
cp client/.env.example client/.env
npm run seed   # creates the 10 subjects / 10 quizzes / 100 questions + admin user
npm run dev                        # runs API (port 4000) and client (port 5173) together
```

Visit `http://localhost:5173`. Admin panel is at `http://localhost:5173/admin/login`
(default `admin` / `ChangeMe123!` unless you changed the env vars before the
first run — change the password immediately after logging in).

## 5. Deployment instructions

This is a plain Node.js API + a static frontend build, so it runs anywhere
that can do both:

**Build:**
```bash
npm run build            # builds server (tsc) to server/dist and client (vite build) to client/dist
```

**Option A — single VM / container (simplest):**
1. Copy the whole repo (minus `node_modules`) to the server, run `npm install --omit=dev` at the root, then `npm run build`.
2. Run the API: `npm run start --workspace server` (serves on `PORT`, default 4000).
3. Serve `client/dist` as static files behind any web server (nginx, Caddy, or
   even `npx serve client/dist`), with that web server reverse-proxying
   `/api/*` to the Node process on port 4000. This keeps everything same-origin
   so you don't need CORS or a separate `VITE_API_BASE_URL`.
4. Put the server's `data/` folder on persistent disk (a normal volume mount
   is enough — it's just JSON files) so scores survive restarts/redeploys.

**Option B — split hosting (e.g. Railway/Render/Fly for the API, Vercel/Netlify/Cloudflare Pages for the frontend):**
1. Deploy `server/` as a Node service (build command `npm run build`, start
   command `npm run start`, expose `PORT`). Attach a persistent volume for
   `server/data`, otherwise scores reset on every deploy.
2. Deploy `client/` as a static site (build command `npm run build`, output
   dir `dist`).
3. Set `CLIENT_ORIGIN` on the server to the frontend's deployed URL (for CORS),
   and set `VITE_API_BASE_URL` on the client to the server's deployed URL
   before building.

Either way, set `JWT_SECRET` to a long random value in production — never
ship the default.

---

## 6. How to use the admin panel

Go to `/admin/login` and sign in. From the sidebar:

- **Dashboard** — totals (subjects, quizzes, questions, players, attempts),
  attempts today, average score, and a per-subject breakdown.
- **Subjects** — create/edit/delete subjects (name, description, icon, gradient color).
  Deleting a subject deletes its quizzes and questions too (confirmed before it happens).
- **Quizzes** — create/edit/delete/duplicate quizzes within a subject. Duplicate
  copies all of that quiz's questions as a starting point for a variant.
- **Questions** — pick a quiz (or search across all questions), then
  create/edit/delete individual questions. Each question is text + exactly 4
  choices with one marked correct.
  - **Import** — upload a JSON file shaped like:
    ```json
    [
      { "text": "...", "choices": ["A", "B", "C", "D"], "correctChoiceIndex": 0 }
    ]
    ```
  - **Export** — downloads the currently selected quiz's questions in that
    same JSON shape (handy for editing offline and re-importing, or for
    backing up content).
- **Daily Question** — schedule a specific question for any future date. Any
  date without a scheduled question automatically pulls the next entry from a
  built-in fallback pool, so the "Daily Impossible Question" always rotates
  even if you never touch this page.
- **Leaderboards** — reset the overall, daily, a specific subject's, or a
  specific quiz's leaderboard. This permanently deletes the underlying attempt
  records for that scope, so it asks for confirmation first.

## 7. Adding more quizzes and questions later

You don't need to touch code for day-to-day content work — the admin panel
covers subject/quiz/question CRUD, duplication, search, and JSON import/export
directly. Two common workflows:

- **Add a new quiz to an existing subject**: Quizzes → New quiz → pick the
  subject → then add questions one at a time from the Questions page, or
  write them as a JSON file (see the import format above) and import them all
  at once.
- **Add a brand-new subject**: Subjects → New subject (pick an icon and
  gradient) → then create quizzes under it the same way.

If you do want to seed content programmatically (e.g. scripting a large batch
of fact-checked questions), edit `server/src/seed/content.ts` — it's a plain
array of `{ name, description, icon, color, quizzes: [{ title, description,
questions: [{ text, choices, correctIndex }] }] }` and `npm run seed`
will only run if `subjects.json` is currently empty, so delete
`server/data/*.json` first if you want to reseed from scratch (this also
resets the admin user, so `ADMIN_USERNAME`/`ADMIN_PASSWORD` from `.env` will
apply again).

**Keeping with the site's premise:** every fact must be real and independently
verifiable, extremely obscure (not something that shows up on "did you know"
lists), and have exactly one unambiguous correct answer among 4 choices. If a
fact can't be verified from a primary or reliable secondary source, it
shouldn't go in.

## 8. Scaling beyond JSON files

The JSON-file storage is intentionally simple and works well up to roughly
tens of thousands of attempts/questions on a single instance. If you outgrow
it (multi-instance deployments needing shared state, or collections large
enough that `Array.filter` scans get slow), the migration path is: replace the
`JsonCollection` implementations in `server/src/db/` with equivalent
SQLite/Postgres-backed classes exposing the same `all/findById/insert/update/
remove` interface — every route and service is written against that interface
and wouldn't need to change.
