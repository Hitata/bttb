# Codebase Structure

**Analysis Date:** 2026-03-18

## Directory Layout

```
bttb/
├── .claude/                    # Claude settings and local config
├── .github/                    # GitHub workflows and CI/CD
├── .planning/                  # Planning documents and context
├── node_modules/               # Dependencies (generated, not committed)
├── prisma/                     # Database schema and migrations
│   ├── migrations/             # Prisma schema history
│   └── schema.prisma           # Database schema definition
├── public/                     # Static assets (CSS, images)
├── src/                        # Source code
│   ├── app/                    # Next.js App Router pages and API
│   ├── components/             # React components
│   ├── lib/                    # Shared utilities and domain logic
│   └── ...
├── .gitignore                  # Git ignore patterns
├── bun.lock                    # Dependency lockfile (Bun package manager)
├── components.json             # shadcn/ui configuration
├── Dockerfile                  # Docker build configuration
├── eslint.config.mjs           # ESLint rules
├── next.config.ts              # Next.js configuration
├── package.json                # Project metadata and dependencies
├── postcss.config.mjs          # PostCSS configuration for Tailwind
├── prisma.config.ts            # Prisma IDE plugin config
├── README.md                   # Project documentation
├── tsconfig.json               # TypeScript configuration
└── dev.db                      # SQLite database (development only)
```

## Directory Purposes

**`src/`:**
- Purpose: All application source code
- Contains: Pages, components, utilities, configuration
- Key files: All TypeScript/TSX source files

**`src/app/`:**
- Purpose: Next.js App Router with pages and API routes
- Contains: Page components, layout, dynamic routes, API handlers
- Key files: `layout.tsx` (root wrapper), `page.tsx` (home), API route folders

**`src/app/api/`:**
- Purpose: HTTP API endpoints (Route Handlers)
- Contains: `/auth`, `/bazi/calculate`, `/bazi/readings`, `/bazi/daivan` endpoints
- Key files: `route.ts` files (POST, GET handlers)

**`src/app/api/auth/[...nextauth]/`:**
- Purpose: NextAuth.js authentication endpoints
- Contains: OAuth callback handlers for GitHub and Google
- Key files: `route.ts` (exports handlers from `@/lib/auth`)

**`src/app/api/bazi/calculate/`:**
- Purpose: POST endpoint for Bazi calculation
- Contains: Request validation, calls `computeBazi()`, returns `BaziResult`
- Key files: `route.ts`

**`src/app/api/bazi/readings/`:**
- Purpose: GET/POST endpoints for user's saved readings
- Contains: List user readings, save new reading to database
- Key files: `route.ts`, `[id]/route.ts` (fetch single reading)

**`src/app/api/bazi/daivan/`:**
- Purpose: GET endpoint for year-specific pillar data
- Contains: Dynamic route `[year]/route.ts` that computes year data
- Key files: `[year]/route.ts`

**`src/app/bazi/`:**
- Purpose: Bazi calculator pages
- Contains: `/page.tsx` (input form and results), `/[id]/page.tsx` (saved reading view)
- Key files: `page.tsx`, `[id]/page.tsx`, `cases/page.tsx`, `cases/[slug]/page.tsx`

**`src/app/readings/`:**
- Purpose: List user's saved readings
- Contains: Client component that fetches and displays saved charts
- Key files: `page.tsx`

**`src/app/signin/`:**
- Purpose: Sign-in page
- Contains: Auth.js sign-in UI
- Key files: `page.tsx`

**`src/components/`:**
- Purpose: Reusable React components
- Contains: UI components, feature components, layout components
- Key files: Organized by subdirectories: `auth/`, `bazi/`, `ui/`

**`src/components/auth/`:**
- Purpose: Authentication-related components
- Contains: Session provider wrapper, user dropdown button
- Key files: `session-provider.tsx`, `user-button.tsx`

**`src/components/bazi/`:**
- Purpose: Bazi chart display and calculation form components
- Contains: Input form, pillar table, luck cycle grid, compass, spirit stars, etc.
- Key files:
  - `BirthInputForm.tsx`: Form for birth date input
  - `BaziPillarTable.tsx`: Four Pillars display
  - `DaiVanSection.tsx`: Luck cycles and clickable 90-year grid
  - `CurrentYearPanel.tsx`: Active year sidebar
  - `FengShuiCompass.tsx`: Compass directions
  - `ThanSatTable.tsx`: Spirit stars table
  - `ThaiMenhCung.tsx`: Thai Menh Cung palace display
  - `RawDataExport.tsx`: Raw JSON export
  - `ShareLinkBar.tsx`: Generate shareable URL

**`src/components/bazi/cases/`:**
- Purpose: Celebrity case detail page components
- Contains: Hero section, traits grid, timeline, FAQ, luck pillars
- Key files:
  - `CaseCard.tsx`: Case summary card (cases list)
  - `CaseHeroSection.tsx`: Biography and overview
  - `BaziChartDisplay.tsx`: Four Pillars for case
  - `TraitsGrid.tsx`: Personality traits
  - `TimelineSection.tsx`: Life events timeline
  - `LuckPillarsSection.tsx`: Luck cycle analysis
  - `FAQSection.tsx`: Q&A

**`src/components/ui/`:**
- Purpose: Headless UI primitives (shadcn/ui)
- Contains: Reusable unstyled component base classes
- Key files: `button.tsx`, `card.tsx`, `avatar.tsx`, `dropdown-menu.tsx`

**`src/lib/`:**
- Purpose: Shared utilities and core logic
- Contains: Authentication, Prisma client, Bazi calculation engine
- Key files: `auth.ts`, `prisma.ts`, `utils.ts`, `bazi/`

**`src/lib/auth.ts`:**
- Purpose: NextAuth.js configuration
- Contains: Provider setup (GitHub, Google), Prisma adapter
- Key files: Main auth config exported to API

**`src/lib/prisma.ts`:**
- Purpose: Prisma client singleton
- Contains: Global Prisma instance to prevent connection pool exhaustion
- Key files: Default export `prisma` used by all API handlers

**`src/lib/bazi/`:**
- Purpose: Pure Bazi calculation domain logic
- Contains: Calendar conversion, stem-branch logic, 10 gods, luck cycles, etc.
- Key files:
  - `index.ts`: Main entry point, exports `computeBazi()` and `computeYearPillar()`
  - `types.ts`: All TypeScript interfaces (BaziResult, BirthInput, Pillar, etc.)
  - `constants.ts`: Stem, branch, ten god, element data
  - `pillars.ts`: Computes four pillars from birth date
  - `luck-cycles.ts`: Computes Đại Vận and Chu Ky
  - `solar-lunar.ts`: Date conversion (solar ↔ lunar ↔ nong lich)
  - `compass.ts`: Feng shui directions
  - `spirit-stars.ts`: Than Sat calculation
  - `ten-gods.ts`: Ten god mapping
  - `na-yin.ts`: Na Yin resonance
  - `menh-cung.ts`: Thai Menh Cung palace
  - `life-cycle.ts`: Trường Sinh (12 life stages)
  - `raw-data-generator.ts`: Export raw data and test questions for AI analysis

**`prisma/`:**
- Purpose: Database schema and migrations
- Contains: Prisma schema definition, migration history
- Key files:
  - `schema.prisma`: User, BaziReading, BaziCase, Account, Session, VerificationToken models
  - `migrations/`: Timestamped migration folders (auto-generated)

**`public/`:**
- Purpose: Static assets served at root URL
- Contains: Images, icons, static CSS
- Key files: Static assets used in HTML

**`prisma/migrations/`:**
- Purpose: Version control for database schema changes
- Contains: Timestamped migration folders
- Key migrations:
  - `20260316125540_init`: Initial schema (User, Account, Session, VerificationToken)
  - `20260316174636_add_bazi_models`: Added BaziReading and BaziCase tables

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx`: Root layout wrapper with SessionProvider and header
- `src/app/page.tsx`: Home/landing page
- `next.config.ts`: Next.js build config
- `package.json`: Project entry point metadata

**Configuration:**
- `tsconfig.json`: TypeScript compiler options (strict mode, path aliases `@/*`)
- `tailwind.config.ts`: Tailwind CSS (generated by PostCSS)
- `postcss.config.mjs`: PostCSS pipeline (Tailwind processor)
- `eslint.config.mjs`: Linting rules
- `components.json`: shadcn/ui component registry

**Core Logic:**
- `src/lib/bazi/index.ts`: Main Bazi calculation orchestrator
- `src/lib/bazi/pillars.ts`: Four Pillars computation
- `src/lib/bazi/luck-cycles.ts`: Luck cycle calculations
- `src/lib/auth.ts`: Authentication setup
- `src/lib/prisma.ts`: Database client singleton

**API Routes:**
- `src/app/api/auth/[...nextauth]/route.ts`: OAuth handlers
- `src/app/api/bazi/calculate/route.ts`: Calculation endpoint
- `src/app/api/bazi/readings/route.ts`: Readings list/save endpoints
- `src/app/api/bazi/readings/[id]/route.ts`: Single reading fetch
- `src/app/api/bazi/daivan/[year]/route.ts`: Year pillar data endpoint

**Testing:**
- Not configured (no test files present)

## Naming Conventions

**Files:**
- **Pages:** `page.tsx` (required by Next.js App Router)
- **API Routes:** `route.ts` (required by Next.js)
- **Dynamic segments:** `[paramName]` or `[...catchall]` (Next.js convention)
- **Components:** PascalCase for files: `BirthInputForm.tsx`, `BaziPillarTable.tsx`
- **Utilities:** camelCase for files: `solar-lunar.ts`, `spirit-stars.ts`
- **Types:** Named interfaces in files: `BirthInput`, `BaziResult`, `Pillar`

**Directories:**
- **Feature domains:** Lowercase: `auth`, `bazi`, `ui`
- **Sub-features:** Lowercase: `bazi/cases`
- **Nested routes:** Brackets for dynamic: `[...nextauth]`, `[id]`, `[slug]`, `[year]`

**Functions:**
- **Exports:** camelCase: `computeBazi()`, `computeTuTru()`, `getCompassDirections()`
- **Constants:** UPPER_SNAKE_CASE: `HEAVENLY_STEMS`, `EARTHLY_BRANCHES`, `ELEMENT_COLORS`
- **React Components:** PascalCase: `BirthInputForm`, `BaziPillarTable`
- **Hooks:** camelCase with `use` prefix: `useSession`, `useSearchParams`, `useState`

**Variables:**
- **General:** camelCase: `name`, `birthYear`, `pillarData`
- **Boolean:** Prefixed `is`, `has`, `can`: `isLoading`, `hasError`, `isPublished`

**Types:**
- **Interfaces:** PascalCase: `BaziResult`, `BirthInput`, `Pillar`, `Stem`, `Branch`
- **Types:** PascalCase: `FiveElement = 'Kim' | 'Mộc' | ...`, `Gender = 'male' | 'female'`
- **Enums:** PascalCase (not used; unions preferred)

## Where to Add New Code

**New Feature Page:**
- Create `src/app/[feature]/page.tsx` (server or client component)
- If requires layout: Create `src/app/[feature]/layout.tsx`
- If dynamic route: Create `src/app/[feature]/[param]/page.tsx`
- If needs API: Create `src/app/api/[feature]/route.ts`

**New Component:**
- If domain-specific (Bazi-related): `src/components/bazi/NewComponent.tsx`
- If general/shared: `src/components/ui/NewComponent.tsx`
- If authentication: `src/components/auth/NewComponent.tsx`

**New Calculation Logic:**
- Add to `src/lib/bazi/` as new module file (e.g., `src/lib/bazi/new-module.ts`)
- Export pure functions, no side effects
- Add types to `src/lib/bazi/types.ts` or new `new-module.ts` if module-specific
- Import and use in `src/lib/bazi/index.ts` orchestrator

**New API Endpoint:**
- Create folder: `src/app/api/[resource]/`
- Create handler: `src/app/api/[resource]/route.ts` (POST, GET, etc.)
- If single-item route: `src/app/api/[resource]/[id]/route.ts`
- Authenticate with `const session = await auth()`
- Use Prisma from `src/lib/prisma.ts` for database

**New Database Model:**
- Edit `prisma/schema.prisma`
- Create migration: `bunx prisma migrate dev`
- Add TypeScript types to `src/lib/bazi/types.ts` or generate from Prisma
- Update API handlers to use new model

**Utility Functions:**
- Generic utilities: `src/lib/utils.ts`
- Bazi-specific: `src/lib/bazi/[module].ts`
- Component-specific helpers: Define inline or in component file

**Shared Constants:**
- Global constants: `src/lib/bazi/constants.ts` (only Bazi constants currently exist)
- Component constants: Define inline in component file

## Special Directories

**`node_modules/`:**
- Purpose: Installed dependencies via Bun package manager
- Generated: Yes (from `bun.lock` via `bun install`)
- Committed: No (gitignored)

**`.next/`:**
- Purpose: Next.js build output and type cache
- Generated: Yes (during `next build`)
- Committed: No (gitignored)

**`prisma/migrations/`:**
- Purpose: Database schema version history
- Generated: Yes (by `prisma migrate dev`)
- Committed: Yes (preserve schema history)

**`.planning/`:**
- Purpose: GSD planning documents
- Generated: Yes (by `/gsd:map-codebase`, `/gsd:plan-phase`, etc.)
- Committed: Yes (shared context for Claude agents)

**`.claude/`:**
- Purpose: Local Claude settings and preferences
- Generated: Yes (by Claude Code editor)
- Committed: No (local only)

---

*Structure analysis: 2026-03-18*
