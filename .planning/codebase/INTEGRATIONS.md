# External Integrations

**Analysis Date:** 2026-03-18

## APIs & External Services

**OAuth 2.0 Authentication:**
- GitHub OAuth - Social login provider via NextAuth
  - SDK/Client: `next-auth/providers/github`
  - Configuration: `src/lib/auth.ts` (line 2)
  - Auth: Environment variables (GitHub OAuth credentials not in checked files)
- Google OAuth - Social login provider via NextAuth
  - SDK/Client: `next-auth/providers/google`
  - Configuration: `src/lib/auth.ts` (line 3)
  - Auth: Environment variables (Google OAuth credentials not in checked files)

**Bazi Calculation Engine:**
- Custom internal library (no external API)
  - Location: `src/lib/bazi/` (core calculation logic)
  - Modules: `solar-lunar.ts`, `pillars.ts`, `ten-gods.ts`, `spirit-stars.ts`, `luck-cycles.ts`, `life-cycle.ts`, `menh-cung.ts`, `compass.ts`, `constants.ts`, `types.ts`
  - Calculation endpoint: `src/app/api/bazi/calculate/route.ts`
  - Luck pillar endpoint: `src/app/api/bazi/daivan/[year]/route.ts`

## Data Storage

**Databases:**
- SQLite - Primary database
  - Provider: SQLite via Prisma
  - Connection: Via `DATABASE_URL` environment variable
  - Default development: `file:./dev.db` (present at repository root)
  - Client: Prisma Client (`@prisma/client` 6.x)
  - Schema: `prisma/schema.prisma`

**Database Tables:**
- `User` - User accounts and profiles
  - Fields: id, name, email, emailVerified, image, createdAt, updatedAt
  - Relations: accounts, sessions, readings
- `BaziReading` - User Bazi chart readings
  - Fields: id, userId, name, gender, birthYear, birthMonth, birthDay, birthHour, birthMinute, result (JSON), slug, isPublic, createdAt, updatedAt
  - Relations: user (foreign key)
  - Index: userId
- `BaziCase` - Published celebrity/case study readings
  - Fields: id, slug, name, birthDate, birthTime, gender, location, description, categories (JSON), tags (JSON), chartData (JSON), coreAnalysis, traits (JSON), timeline (JSON), luckPillars (JSON), faq (JSON), isPublished, publishedAt, createdAt, updatedAt
- `Account` - OAuth provider credentials
  - Fields: id, userId, type, provider, providerAccountId, refresh_token, access_token, expires_at, token_type, scope, id_token, session_state
  - Relations: user (foreign key)
  - Unique constraint: provider + providerAccountId
- `Session` - User session tokens
  - Fields: id, sessionToken, userId, expires
  - Relations: user (foreign key)
- `VerificationToken` - Email verification tokens
  - Fields: identifier, token, expires
  - Unique constraint: identifier + token

**File Storage:**
- Local filesystem only - No external file storage service
  - Public assets: `public/` directory

**Caching:**
- Not detected - No Redis or caching service configured

## Authentication & Identity

**Auth Provider:**
- NextAuth.js (built-in with OAuth integration)
  - Implementation: Multi-provider strategy (GitHub + Google)
  - Adapter: Prisma adapter for session/token storage
  - Routes: `src/app/api/auth/[...nextauth]/route.ts` (handles all auth endpoints)
  - Library: `src/lib/auth.ts` (exports handlers, auth, signIn, signOut)
  - Session management: Database-backed sessions via Prisma
  - Sign-in page: Custom route at `/signin`
  - Protected APIs: Auth status checked via `await auth()` in route handlers

**Auth Flow:**
1. User initiates sign-in at `/signin`
2. NextAuth routes user through GitHub or Google OAuth
3. OAuth provider returns authenticated user data
4. Prisma adapter stores user, account, and session records
5. Session token stored in cookie
6. API routes verify `auth()` before allowing data access

## Monitoring & Observability

**Error Tracking:**
- Not detected - No error tracking service integrated

**Logs:**
- Console logging via `console.error()` and `console.log()`
  - Example in `src/app/api/bazi/readings/route.ts` (line 65): `console.error('Save reading error:', error)`

**Observability:**
- Core Web Vitals linting via ESLint (`eslint-config-next/core-web-vitals`)

## CI/CD & Deployment

**Hosting:**
- Docker-ready deployment via `Dockerfile`
  - Multi-stage build process
  - Bun runtime container
  - Port 3000 exposed
  - Supports Docker registry push for container-based deployment
- Optional Vercel deployment (Next.js standalone mode supported)
  - Next.js output mode: "standalone" allows serverless/serverful deployment

**CI Pipeline:**
- GitHub Actions
  - Workflow: `.github/workflows/deploy.yml`
  - Triggers: Push to main branch and pull requests
  - Steps:
    1. Checkout code
    2. Setup Bun runtime (`oven-sh/setup-bun@v2`)
    3. Install dependencies (frozen lockfile)
    4. Generate Prisma client
    5. Run ESLint
    6. Build Next.js application
  - Optional: Docker build/push (commented out, requires configuration)
  - Optional: Vercel deployment (disabled, requires Vercel connection)

**Build Environment Variables (CI):**
- `DATABASE_URL=file:./dev.db` - Uses development database for CI builds
- `AUTH_SECRET=ci-build-secret-not-for-production` - Dummy secret for CI (not for production)

## Environment Configuration

**Required env vars:**
- `DATABASE_URL` - Database connection string (e.g., `file:./dev.db` for SQLite)
- `AUTH_SECRET` - NextAuth.js encryption secret (required for session management)

**Optional env vars (OAuth providers):**
- GitHub OAuth credentials (GITHUB_ID, GITHUB_SECRET) - For GitHub provider
- Google OAuth credentials (GOOGLE_ID, GOOGLE_SECRET) - For Google provider

**Secrets location:**
- Environment variables managed via `.env` (not in git)
- CI/CD: GitHub Actions secrets or build-time environment variables
- Docker: Environment variables passed at runtime or in `.env` file mounted to container

## Webhooks & Callbacks

**Incoming:**
- Not detected - No webhook endpoints configured

**Outgoing:**
- OAuth callbacks: NextAuth handles GitHub and Google OAuth redirect URIs internally
- No outgoing webhooks to external services

## API Endpoints (Internal)

**Authentication:**
- `POST /api/auth/signin` - Sign in user
- `POST /api/auth/callback/[provider]` - OAuth provider callback
- `POST /api/auth/signout` - Sign out user
- All routes handled by NextAuth via `src/app/api/auth/[...nextauth]/route.ts`

**Bazi Calculations:**
- `POST /api/bazi/calculate` - Calculate Bazi chart from birth details
- `GET /api/bazi/daivan/[year]` - Get luck pillar (Đại Vận) for specific year

**User Readings:**
- `GET /api/bazi/readings` - List authenticated user's readings
- `POST /api/bazi/readings` - Save new reading
- `GET /api/bazi/readings/[id]` - Get specific reading details

---

*Integration audit: 2026-03-18*
