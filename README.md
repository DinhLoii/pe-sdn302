# ExpenseTrail — SDN302 practice

Next.js App Router, TypeScript, Tailwind, ShadCN UI, Prisma 7 and Supabase PostgreSQL.

## Implemented

- Home page and responsive registration/login forms with the trial test hooks and exact field validation messages.
- POST /api/auth/register, POST /api/auth/login, POST /api/auth/logout, GET /api/auth/me.
- Bcrypt password hashes, JWT sessions in the HttpOnly session_token cookie, server-protected /expenses entry page.
- Demo account: grader.qe190167@example.com / Test1234! (shared testing only). The login page can fill these credentials with one click.
- User migration applied through Prisma. The account is created through the app Register API, never a database seed.

## Development

Use Node 22.x. Run npm ci, configure DATABASE_URL, DIRECT_URL and AUTH_SECRET in private .env, then npm run dev.
DATABASE_URL uses the Supabase transaction pooler (6543); DIRECT_URL uses its session pooler (5432) for migrations. AUTH_SECRET is a random secret of at least 32 characters. Never commit real values.

npm run build runs prisma generate before next build. npm run lint checks source. npm run db:deploy applies committed migrations without a reset. npm run db:check checks both connections without modifying data.

## Verification

Start a production build locally on port 3100, then run node --env-file=.env scripts/test-auth.mjs. The integration check covers validation, duplicate accounts, login, cookie flags, protected routing, invalid and expired JWTs and logout. It registers the demo account if absent. TEST_BASE_URL can target the production URL.

## Deployment

GitHub: https://github.com/DinhLoii/pe-sdn302 (main)
Production: https://pe-sdn302.vercel.app
Vercel project: pe-sdn302 under dinhvanloi000-1347s-projects. DATABASE_URL, DIRECT_URL and AUTH_SECRET must be configured in Production. Git pushes deploy automatically.

## Remaining scope

Expense models, expense APIs, expense Context, list, forms, filters, summary, and final submission document are not implemented. /expenses currently confirms authentication only. This is a preparation milestone, not the full trial solution.

All project source and verification files belong in this project folder. npm run submission -- -StudentCode QE190167 packages committed source after the final work is complete.

## User design preferences

For a new exam topic or application theme, research relevant existing websites before implementation. Present the reference links and previews, proposed color palette with hex values, layout, typography, icons and key UI/UX decisions to the user. Wait for the user's explicit approval of the design direction before implementing it. Do not assume an earlier design approval applies to a new topic.

Keep the header Login action as a rounded outlined button, paired with a solid Register action, following the user-provided Lovable screenshot. This reference concerns the Login button, not an instruction to copy the full Lovable homepage.

All generated source, helpers and deliverables must stay inside E:/FPTU/Term07/SDN302/pe-sdn302. Preserve the user's customized QE190167/QE190167.docx; use it as the submission template and only revise it when requested.
