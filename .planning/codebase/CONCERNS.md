# Codebase Concerns

**Analysis Date:** 2026-03-18

## Tech Debt

**Large calculation modules with complex logic:**
- Issue: Core Bazi calculation modules (`solar-lunar.ts`, `pillars.ts`, `compass.ts`) contain complex mathematical logic without unit tests or validation layers. Modifications are high-risk.
- Files: `src/lib/bazi/solar-lunar.ts` (345 lines), `src/lib/bazi/pillars.ts` (259 lines), `src/lib/bazi/compass.ts` (180 lines)
- Impact: Bugs in date conversion or pillar calculations propagate to all downstream features. No regression detection possible.
- Fix approach: Add unit tests for critical path calculations. Create validation/assertion functions for intermediate results. Consider extracting pure functions with documented preconditions.

**Data serialization without type safety:**
- Issue: Complex Bazi calculation results and case data stored as JSON strings in database without parsing validation. Multiple `JSON.parse()` calls throughout codebase without error handling.
- Files: `src/app/bazi/cases/[slug]/page.tsx` (lines 20-26), `src/app/bazi/cases/page.tsx` (line 37), `src/app/api/bazi/readings/[id]/route.ts` (line 31)
- Impact: Corrupted or malformed JSON data in database will cause silent runtime errors or runtime crashes when retrieved. No safeguards during deserialization.
- Fix approach: Create typed validators using Zod or similar. Wrap all JSON.parse() calls in try-catch with proper error responses. Add migration to validate existing data.

**No input validation on API endpoints:**
- Issue: API routes accept user input without schema validation. Number coercion happens implicitly without bounds checking.
- Files: `src/app/api/bazi/calculate/route.ts` (lines 9-26), `src/app/api/bazi/readings/route.ts` (lines 42)
- Impact: Invalid birth dates, negative hours, out-of-range years could produce nonsensical calculations. No protection against edge cases.
- Fix approach: Implement Zod schemas for all input types (`BirthInput`). Validate year range (1900-2100 as per `solar-lunar.ts`). Validate month (1-12), day (1-31), hour (0-23), minute (0-59).

**Silent error handling in async operations:**
- Issue: Year pillar fetch in `src/app/bazi/page.tsx` (line 123-125) has empty catch block with "silently fail" comment. User receives no feedback when operation fails.
- Files: `src/app/bazi/page.tsx` (lines 109-126)
- Impact: Users cannot distinguish between slow network and failed calculation. Year data may not update, causing confusion.
- Fix approach: Log errors to console or error tracking. Show user toast notification on failure. Implement retry logic with exponential backoff.

## Known Bugs

**Potential JSON.parse() crash on malformed database records:**
- Symptoms: Page crashes with SyntaxError if case data stored in database is corrupted or incomplete
- Files: `src/app/bazi/cases/[slug]/page.tsx`
- Trigger: Access case detail page when corresponding database record has invalid JSON in `chartData`, `traits`, `timeline`, `luckPillars`, `faq`, or `categories` fields
- Workaround: Edit database directly to fix JSON, or delete and recreate case record

**No error state displayed on readings page after API failure:**
- Symptoms: Readings list shows "loading" state indefinitely if `/api/bazi/readings` returns 500 error
- Files: `src/app/readings/page.tsx` (lines 28-31)
- Trigger: Call API when database is unavailable
- Workaround: Refresh page to retry

## Security Considerations

**Missing CSRF protection on mutation endpoints:**
- Risk: POST to `/api/bazi/readings` could be exploited via cross-site request forgery if session cookies are SameSite=None
- Files: `src/app/api/bazi/readings/route.ts`
- Current mitigation: Next.js/Auth.js handles CSRF by default with secure cookies; Prisma adapter uses authenticated context
- Recommendations: Document CSRF assumptions. Consider explicit CSRF token validation if cookies modified. Test with SameSite=None scenario.

**Database query results containing sensitive timing information:**
- Risk: Creation timestamps in readings list could leak user activity patterns
- Files: `src/app/readings/page.tsx` (line 74), `src/app/api/bazi/readings/route.ts` (line 14)
- Current mitigation: Only authenticated users can access their own readings; timestamps are user's own data
- Recommendations: None critical—acceptable for personal data. Consider allowing users to hide creation dates if sharing readings.

**JSON.parse() vulnerability (remote injection):**
- Risk: If database records become user-modifiable or are synced from untrusted source, malicious JSON could execute code
- Files: `src/app/bazi/cases/[slug]/page.tsx`, `src/app/bazi/cases/page.tsx`
- Current mitigation: Database is owned/managed by application; no user-generated JSON storage
- Recommendations: If feature expands to allow user-created cases, sanitize/validate JSON schema before storage. Never use `eval()` on JSON data.

## Performance Bottlenecks

**Synchronous Bazi calculation on every page load:**
- Problem: `/api/bazi/calculate` computes entire chart (4 pillars, luck cycles, compass, spirit stars) on every request with no caching
- Files: `src/app/api/bazi/calculate/route.ts`, `src/lib/bazi/index.ts`
- Cause: Stateless API; client re-requests on every form submission even for identical input
- Improvement path: Add client-side caching of results (useCallback + memoization). Cache by hash of input. Consider server-side cache or Redis for repeated calculations.

**N+1 risk on cases listing page:**
- Problem: Reads all case metadata without pagination; no limit clause on `findMany()`
- Files: `src/app/bazi/cases/page.tsx` (line 5)
- Cause: Could retrieve 100+ records at once if database grows
- Improvement path: Implement pagination with cursor-based approach. Add `take: 20` limit. Consider full-text search index on `name` field for filtering.

**Large component re-renders on Bazi page:**
- Problem: `BaziPageContent` manages multiple state variables; form submission updates 6 different display components
- Files: `src/app/bazi/page.tsx` (lines 26-33)
- Cause: React re-renders entire subtree when any state changes
- Improvement path: Split into smaller components with isolated state. Memoize read-only display sections. Consider Context API to avoid prop drilling.

## Fragile Areas

**Solar-lunar calendar conversion logic:**
- Files: `src/lib/bazi/solar-lunar.ts`
- Why fragile: Lookup table-based algorithm (LUNAR_INFO array) is sensitive to correct encoding. Year range is fixed 1900-2100; out-of-range inputs produce undefined behavior.
- Safe modification: Add guards at function entry points to validate year is in range. Add unit tests for boundary years (1900, 2100). Document the bit-packing format before any edits.
- Test coverage: No visible test suite; critical path untested.

**Pillar computation with modulo arithmetic:**
- Files: `src/lib/bazi/pillars.ts`
- Why fragile: Multiple modulo operations with offsets (`% 10`, `% 12`, `+ 10`, `- 4`). Off-by-one errors shift all subsequent calculations.
- Safe modification: Add inline comments explaining each modulo step. Create helper functions for Stem/Branch index calculations. Add test cases for year transitions.
- Test coverage: No tests; high risk of regression.

**DB schema using JSON string columns:**
- Files: `prisma/schema.prisma` (lines 34, 52, 56, 58, 59)
- Why fragile: `result`, `chartData`, `traits`, `timeline`, `luckPillars`, `faq`, `categories`, `tags` are all JSON strings. No schema validation at database layer. Manual serialization/deserialization throughout codebase.
- Safe modification: Migrate to separate typed tables (e.g., separate `BaziChartData` table with typed columns) or use JSON schema validation in Prisma. Add pre-migration backups.
- Test coverage: No migrations testing; risky to add new columns or change types.

## Scaling Limits

**SQLite database for production:**
- Current capacity: Single file-based database; works for <1000 concurrent users
- Limit: SQLite lacks concurrent write support. Multiple simultaneous mutations cause "database is locked" errors.
- Scaling path: Migrate to PostgreSQL or MySQL before deploying. Implement connection pooling. Add read replicas if read-heavy.

**No pagination on readings list:**
- Current capacity: Users with <1000 saved readings load all at once
- Limit: 1000+ readings cause slow page loads and memory issues
- Scaling path: Implement cursor-based pagination with `skip`/`take` in Prisma. Add infinite scroll or traditional pagination UI.

**Computation time for large luck cycle grids:**
- Current capacity: 90-year grid renders fine for single user
- Limit: Large case detail pages with grids + charts could hit 3-5 second render time at scale
- Scaling path: Move grid computation to server component. Consider pagination for Chu Ky grid. Memoize chart calculations.

## Fragile Dependencies

**Auth.js version pinned to beta:**
- Risk: `next-auth@5.0.0-beta.30` is beta software; no SemVer stability guarantee. Breaking changes possible in updates.
- Impact: Authentication flow could break silently. Session handling could change.
- Migration plan: Pin to stable release once v5.0.0 ships. Subscribe to Auth.js releases for breaking change notices. Add integration tests for sign-in/sign-out flows.

**No lockfile security auditing:**
- Risk: `bun.lock` is not audited for vulnerabilities. No automated dependency scanning (Dependabot, Snyk) configured.
- Impact: Known CVEs in transitive dependencies remain undetected.
- Migration plan: Add GitHub Actions workflow to run `npm audit` or `yarn audit`. Consider Dependabot integration. Review `bun.lock` before major deployments.

## Missing Critical Features

**No error logging or observability:**
- Problem: Errors are logged to console only (`console.error()` in routes). No centralized error tracking (Sentry, LogRocket).
- Blocks: Cannot diagnose production issues. Silent failures go unnoticed. User impact unknown.
- Fix approach: Integrate Sentry or similar. Create error middleware in API routes. Add structured logging with context (userId, timestamp).

**No input validation library:**
- Problem: No Zod, Yup, or similar validation. All validation is ad-hoc (checking `if (!name)`).
- Blocks: Cannot safely validate complex nested objects (e.g., case creation with multiple arrays).
- Fix approach: Implement Zod schemas for all input types. Create middleware to validate requests. Add API documentation with schema specs.

**No database migration testing:**
- Problem: No test suite for schema migrations or data transformations.
- Blocks: Cannot safely deploy schema changes. Risk of data loss or corruption.
- Fix approach: Add Prisma migration tests. Seed test database with sample data before migration. Add rollback tests.

## Test Coverage Gaps

**No unit tests for calculation engine:**
- What's not tested: All Bazi calculation modules (`solar-lunar.ts`, `pillars.ts`, `luck-cycles.ts`, `spirit-stars.ts`, `ten-gods.ts`, `compass.ts`, etc.)
- Files: `src/lib/bazi/*.ts`
- Risk: Critical calculations produce incorrect results without detection. Regressions go unnoticed.
- Priority: **HIGH** - Core business logic is untested. Should add tests for all public functions and edge cases.

**No integration tests for API endpoints:**
- What's not tested: POST `/api/bazi/readings`, POST `/api/bazi/calculate`, GET `/api/bazi/daivan/[year]`
- Files: `src/app/api/bazi/*.ts`
- Risk: API contract changes, auth failures, database errors are not caught before deployment.
- Priority: **HIGH** - Critical user paths untested.

**No E2E tests for happy path:**
- What's not tested: User sign-in → fill birth form → calculate → save reading → view saved readings
- Files: All of `/src/app/*`, `/src/components/*`
- Risk: UI breaks silently. Form submissions fail. Auth flow broken without knowing.
- Priority: **MEDIUM** - Important for user-facing features but less critical than calculation tests.

**No component snapshot tests:**
- What's not tested: `BaziPillarTable`, `DaiVanSection`, `CurrentYearPanel` rendering with various input states
- Files: `src/components/bazi/*.tsx`
- Risk: Visual regressions go undetected (wrong colors, missing data).
- Priority: **LOW** - Can be caught via manual review; less critical than logic tests.

---

*Concerns audit: 2026-03-18*
