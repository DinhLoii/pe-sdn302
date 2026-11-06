# ReadLog

A personal reading-session journal for the SDN302 practical exam. Built with Next.js 16 App Router, TypeScript, Tailwind CSS, ShadCN UI, Prisma 7 and Supabase PostgreSQL.

## Submission and live application

- Student Code: QE190167
- Full Name: Dinh Van Loi
- GitHub Repository URL: https://github.com/DinhLoii/pe-sdn302
- Vercel Production URL: https://pe-sdn302.vercel.app
- Test account email: grader.qe190167@example.com
- Test account password: Test1234!

Open `/login`, choose **Fill demo account**, then **Login**. The grader account was registered through the application's Register API. It contains eight sample reading sessions. New accounts start with an empty journal.

## Run locally

Use Node.js 22.x and npm.

```sh
npm install
```

Copy `.env.example` to `.env` and set **only** these three variables:

```dotenv
DATABASE_URL=
DIRECT_URL=
AUTH_SECRET=
```

`DATABASE_URL` connects Prisma's PostgreSQL runtime adapter to the Supabase transaction pooler (port 6543). `DIRECT_URL` connects migrations to the session pooler (port 5432). Use an independently generated secret of at least 32 characters for `AUTH_SECRET`. Keep all actual values private; they are not included in this repository or submission.

```sh
npm run db:deploy
npm run dev
```

For a production build:

```sh
npm run build
npm run start
```

The build script is `prisma generate && next build`; the generated Prisma client is recreated automatically. The live database already has both committed migrations applied. Supabase is used only as PostgreSQL through Prisma; no Supabase Auth or public client key is required.

## Features

- Email/password registration, bcrypt password hashes and JWT authentication in the HttpOnly `session_token` cookie.
- Protected `/reading-logs` page and owner-scoped reading-session APIs.
- Add sessions, toggle favorites and delete; changes persist after refreshing.
- Combined genre, favorites-only and case-insensitive title/note search filters, with Clear.
- Filtered session count, favorite count, total minutes and genre breakdown in the prescribed order.
- React Context shared by form, list, filters and summary; account changes clear previous user state.
- Exact validation messages, conditional success/error elements and required `data-testid` hooks.
- Responsive layouts, illustrated book covers, keyboard focus, loading/error states and reduced-motion support.
- Bonuses: inline title/minutes editing and CSV export of the current filtered list.

Sample entries are marked in their notes and are not a claim of real reading history. Book-cover artwork is original illustration, not official publisher imagery.

## API contracts

| Method | Route | Result |
| --- | --- | --- |
| POST | `/api/auth/register` | 201 `{ id, email }`, without login |
| POST | `/api/auth/login` | 200 `{ id, email }` and session cookie |
| POST | `/api/auth/logout` | 200 and cleared cookie |
| GET | `/api/auth/me` | 200 `{ id, email }` or 401 |
| GET | `/api/reading-logs` | Current user's sessions, date descending and title ascending ignoring case |
| GET | `/api/reading-logs/summary` | Filtered count, favoriteCount, totalMinutes and breakdown |
| POST | `/api/reading-logs` | 201 created reading session |
| PATCH | `/api/reading-logs/:id` | 200 updated reading session |
| DELETE | `/api/reading-logs/:id` | 200 `{ success: true }` |

Both list and summary accept `genre`, `favorite=true` and `q`. A reading-session response contains `id`, `bookTitle`, `minutesRead`, `genre`, `note`, `favorite`, `readOn` and `createdAt`. Errors have the shape `{ "error": "message" }`.

Each reading API verifies the session and derives ownership from it. Body/query owner identifiers are ignored. A missing or another user's reading-session ID produces the same 404. All database access uses Prisma's query builder. A per-user unique constraint prevents duplicate book title/minutes/date combinations.

## Verification

```sh
npm run lint
npm run build
npm run db:check
```

To run integration tests, first start a local server on port 3100:

```sh
npm run start -- --port 3100
```

In another terminal:

```sh
node --env-file=.env scripts/test-auth.mjs
node scripts/test-reading.mjs
```

`TEST_BASE_URL` can select another running instance. The auth test needs the matching `AUTH_SECRET` to sign an expired test token. Reading tests use dedicated QA accounts and clean only their own reading sessions. They do not clear the grader's sample data.

The current application passed authentication integration checks and 99 reading-API assertions against production. A clean source install/build and responsive browser checks were also completed. These checks do not substitute for the examiner's grading suite.

## Deployment

The public repository's `main` branch deploys to Vercel project `pe-sdn302` in team `dinhvanloi000-1347s-projects`. Configure the same three variables in Vercel, apply the committed migrations to the target database and redeploy. The production domain is public and does not require Vercel Authentication.

## Submission package

The local `QE190167` folder contains exactly:

```text
QE190167/
  QE190167.docx
  QE190167.zip
```

The Word report retains the candidate's report framework and contains the six required submission fields. The ZIP contains the committed repository source directly at its root, including `package.json`, `package-lock.json`, `src/`, `public/`, `components.json`, Prisma schema/migrations and `.env.example` with empty values. There is no enclosing project folder. Real `.env` files, `node_modules`, `.next`, `.git`, generated client files and local report/verification outputs are excluded.

After committing all final source changes, regenerate the ZIP with:

```sh
npm run submission -- -StudentCode QE190167
```

Submit the `QE190167` folder, containing the Word document and ZIP together.
