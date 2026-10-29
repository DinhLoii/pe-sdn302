# SDN302 practical starter

Setup only. No ExpenseTrail models, authentication endpoints, business API or exam pages have been implemented.

## Local development

Node.js 22.x. Run `npm ci`, configure the three names in `.env.example` in your private `.env`, then `npm run dev`.
The build command is exactly `prisma generate && next build`. Only DATABASE_URL, DIRECT_URL and AUTH_SECRET are application configuration variables. Never commit their values.

## Database

Prisma 7 uses DIRECT_URL from prisma.config.ts for migrations (Supabase session pooler, port 5432). Runtime uses DATABASE_URL via @prisma/adapter-pg (transaction pooler, port 6543).
`npm run db:check` performs SELECT 1 against both connections without changing tables. No migration exists until the actual models are added.
After adding models, run `npm run db:migrate -- --name init`, review and commit prisma/migrations, then run `npm run db:deploy` against the production database.
Do not use migrate reset on a shared database.

## Vercel

Import https://github.com/DinhLoii/pe-sdn302 with the Next.js preset and Node 22.x.
Set DATABASE_URL, DIRECT_URL and AUTH_SECRET in Vercel Environment Variables. Use the same AUTH_SECRET across deployments; do not regenerate it on each build.
Deploy main to Production. Set Deployment Protection > Vercel Authentication to Off as required by the trial specification. Check the production domain anonymously.
Environment updates require a new deployment. Database migrations are a separate explicit step, not part of the build.

## Scope still to implement from the actual paper

- Prisma models and real migration, authentication and session handling.
- Required API contracts, validation, ownership rules, React Context, pages and test hooks.
- Register a grader account through the completed app and verify login on production.
- Final Word document and source ZIP matching the final Git commit.

Do not submit this setup as a completed exam solution.

## Packaging

`npm run submission -- -StudentCode QE190167` creates an ignored submission/QE190167.zip from committed Git files only. Commit the final changes first. It excludes secrets and build output by using an allowlist and checks the required source paths.
The final Word document must contain the actual production URL and working grader credentials and must be generated after the completed app is verified.

Assignment reference: E:/FPTU/Term07/SDN302/assignment/assignments (not copied wholesale; no Pusher, assignment data or assignment secrets).
