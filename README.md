# ReadLog — SDN302 practical application

A private reading-session journal built with Next.js App Router, TypeScript, Tailwind CSS, ShadCN UI and Prisma 7 on Supabase PostgreSQL.

## Features

- Custom email/password registration and JWT authentication in the HttpOnly session_token cookie.
- Owner-scoped reading-session list, creation, partial editing, favorites and deletion.
- Combined genre, favorites and case-insensitive title/note search filters.
- Live summary: count, favorite count, total minutes and ordered genre breakdown.
- Shared React Context with canceled stale requests and cleared state on account changes/logout.
- Responsive 375px / 1280px layouts, illustrated book covers, keyboard focus, reduced-motion support, loading and error states.
- Bonus: inline title/minutes editing and export of currently displayed sessions to CSV.

## Setup

Use Node.js 22.x. Run npm install, configure the three private variables from .env.example in .env, then npm run db:deploy and npm run dev.

DATABASE_URL is used by the PostgreSQL runtime adapter (transaction pooler, 6543). DIRECT_URL is used by prisma.config.ts for migrations (session pooler, 5432). AUTH_SECRET signs HS256 JWTs. Do not commit real values. No Supabase Auth, public Supabase client key, external image service or extra environment variable is required.

npm run build runs prisma generate && next build. The User and ReadingLog migrations are committed under prisma/migrations and applied to the live database.

## Verification

npm run lint
npm run build

Start the production server locally on port 3100, then run:

node --env-file=.env scripts/test-auth.mjs
node scripts/test-reading.mjs

TEST_BASE_URL can target production. Reading tests use two dedicated QA accounts and clean up only their own test sessions. The authentication test registers the grader account through the app API if it is absent. Never seed grader credentials directly into the database.

## Deployment and grader account

Repository: https://github.com/DinhLoii/pe-sdn302
Production: https://pe-sdn302.vercel.app
Production branch: main
Vercel account/team: dinhvanloi000-1347s-projects
Project: pe-sdn302

Email: grader.qe190167@example.com
Password: Test1234!

Use Fill demo account on /login, then Login. This account is shared for grading/sample data only. Sessions are protected on /reading-logs and /api/reading-logs; /expenses is a legacy redirect.

## API

POST /api/auth/register, POST /api/auth/login, POST /api/auth/logout, GET /api/auth/me.
GET/POST /api/reading-logs, GET /api/reading-logs/summary, PATCH/DELETE /api/reading-logs/:id.

Reading-log API responses use the exact bookTitle, minutesRead, genre, note, favorite, readOn and createdAt names in the specification. Ownership comes from the verified cookie, not user input. Database uniqueness prevents duplicate bookTitle/minutesRead/readOn combinations for each user.

## Submission

QE190167/QE190167.docx and QE190167/QE190167.zip are local output files. ZIP source is exported from the final committed code with package.json at its root. Real environment files, generated Prisma client, node_modules, .next and .git are excluded. Generated client is recreated by the build script.

## Design and workspace preferences

All project files and helpers stay inside E:/FPTU/Term07/SDN302/pe-sdn302. A new topic requires a brief reference/color/layout proposal and user approval before implementation. ReadLog uses the approved warm-paper and forest-green reading-journal design. Keep Login as a rounded outlined action beside the solid Register action.

The practical assessment window is 70 minutes. Required API contracts, security, validation, test hooks, deployment and packaging take priority over bonus features. PASS means verified, not a score guarantee. AI integration is not part of this application.
