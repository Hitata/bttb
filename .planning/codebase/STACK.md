# Technology Stack

**Analysis Date:** 2026-03-18

## Languages

**Primary:**
- TypeScript 5.x - Used for all source files in `src/`
- JavaScript - Build configuration files and Node.js tooling

**Secondary:**
- SQL - Prisma migrations in `prisma/migrations/`

## Runtime

**Environment:**
- Node.js (compatible) - Deployed via Bun runtime
- Bun 1.x - JavaScript/TypeScript runtime and package manager
  - Used in CI/CD pipeline (GitHub Actions via `oven-sh/setup-bun@v2`)
  - Used in Docker builds (`FROM oven/bun:1`)

**Package Manager:**
- Bun - Primary package manager
- Lockfile: `bun.lock` (present)

## Frameworks

**Core:**
- Next.js 16.1.6 - React framework for full-stack web application
  - Deployed with `output: "standalone"` configuration in `next.config.ts`
  - RSC (React Server Components) enabled via shadcn config

**UI & Components:**
- React 19.2.3 - UI framework
- React DOM 19.2.3 - React DOM renderer
- shadcn/ui 4.0.8 - Pre-built component library
- Base UI/React 1.3.0 - Headless UI components (configured in `components.json`)
- Lucide React 0.577.0 - Icon library (configured as default icon library in `components.json`)
- Tailwind CSS 4.x - Utility-first CSS framework with PostCSS integration
- Tailwind Merge 3.5.0 - Utility for merging Tailwind classes
- Class Variance Authority 0.7.1 - CSS variant management
- tw-animate-css 1.4.0 - Tailwind animation utilities

**Database:**
- Prisma 6.x - ORM and database toolkit
  - Database client: `@prisma/client` 6.x
  - Configuration: `prisma/schema.prisma` with SQLite provider
  - Migrations directory: `prisma/migrations/`
  - Seed script: `prisma/seed.ts` (runs via `bun run prisma/seed.ts`)

**Authentication:**
- NextAuth 5.0.0-beta.30 - Authentication library
  - Adapter: `@auth/prisma-adapter` 2.x (Prisma integration)
  - Auth route: `src/app/api/auth/[...nextauth]/route.ts`
  - Auth library: `src/lib/auth.ts`

**Testing:**
- Not detected - No test framework configured in package.json

**Build/Dev:**
- ESLint 9.x - Code linting
  - Config: `eslint.config.mjs` (flat config format)
  - Extensions: `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- Tailwind CSS PostCSS 4.x - CSS processing
  - Config: `postcss.config.mjs`
- TypeScript 5.x - Type checking

## Key Dependencies

**Critical:**
- `@prisma/client` 6.x - Database access layer (required at runtime)
- `next-auth` 5.0.0-beta.30 - Authentication provider (core feature)
- `@auth/prisma-adapter` 2.x - NextAuth/Prisma integration (required for auth)
- `next` 16.1.6 - Web framework (primary dependency)

**Infrastructure:**
- `prisma` 6.x - ORM and migrations management (required for build: `prisma generate`)
- `@types/react` 19.x - TypeScript definitions for React
- `@types/react-dom` 19.x - TypeScript definitions for React DOM
- `@types/node` 20.x - TypeScript definitions for Node.js
- `clsx` 2.1.1 - Conditional classname utility

## Configuration

**Environment:**
- Environment configuration via environment variables (referenced in `prisma.config.ts` and Docker build)
- Required env vars (from `.github/workflows/deploy.yml` and code):
  - `DATABASE_URL` - Prisma database connection string (supports SQLite: `file:./dev.db`)
  - `AUTH_SECRET` - NextAuth secret for session encryption
  - `NODE_ENV` - Environment indicator (development/production)

**Build:**
- TypeScript compilation: `tsconfig.json` with strict mode enabled
  - Target: ES2017
  - Module resolution: bundler
  - Strict: true
  - Path alias: `@/*` maps to `./src/*`
- Next.js build: `next.config.ts` with standalone output
- Prisma schema: `prisma/schema.prisma`
- Prisma config: `prisma.config.ts`

## Platform Requirements

**Development:**
- Node.js runtime (Bun can serve as drop-in replacement)
- Bun package manager for local development (`bun dev`, `bun run build`, etc.)
- SQLite database (local file-based at `dev.db`)

**Production:**
- Deployment target: Docker container with Bun runtime
  - Multi-stage build in `Dockerfile`
  - Production runs on Bun with Node.js entrypoint
  - Exposes port 3000
  - Database: SQLite or any Prisma-supported database via `DATABASE_URL`
- Supports Vercel deployment (Next.js standalone mode)
- Supports Docker deployment (Dockerfile included)

## Build Pipeline

**Development:**
```bash
bun install              # Install dependencies
bun run dev             # Start Next.js dev server
bun run db:migrate      # Run Prisma migrations
bun run db:studio       # Open Prisma Studio
```

**Production:**
```bash
prisma generate        # Generate Prisma client (in Dockerfile)
bun run build          # Build Next.js application
bun run start          # Start Next.js production server
```

**Linting:**
```bash
bun run lint           # Run ESLint
```

**Database:**
```bash
bun run db:migrate     # Run pending migrations
bun run db:seed        # Seed database with initial data
bun run db:studio      # Open Prisma Studio GUI
```

---

*Stack analysis: 2026-03-18*
