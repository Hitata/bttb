# Admin Page for Client Profile & Token Management

## Overview

Admin page for managing client profiles, viewing their Bazi/TuVi readings, and generating shareable time-limited reading links with a 10-question chat cap.

Related issues: #13 (this feature), #12 (client-facing reading page, blocked by this)

## Schema

### AdminUser

Stores admin credentials. Password is bcrypt-hashed. First user created via CLI script.

```prisma
model AdminUser {
  id        String   @id @default(cuid())
  username  String   @unique
  password  String   // bcrypt hashed
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### ClientProfile

Unifies BaziClient and TuViClient under a single person. A client may have one or both reading types linked. At least one must be linked at creation time.

Birth data is NOT duplicated — it is derived from whichever linked client record exists (prefer BaziClient if both exist). The `name` field is the display name for the admin list.

```prisma
model ClientProfile {
  id            String       @id @default(cuid())
  name          String
  baziClientId  String?      @unique
  tuViClientId  String?      @unique
  baziClient    BaziClient?  @relation(fields: [baziClientId], references: [id])
  tuViClient    TuViClient?  @relation(fields: [tuViClientId], references: [id])
  tokens        ReadingToken[]
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt

  @@index([name])
}
```

Requires adding a reverse relation field to both `BaziClient` and `TuViClient`:

```prisma
// Add to BaziClient
clientProfile ClientProfile?

// Add to TuViClient
clientProfile ClientProfile?
```

### Client creation workflow

BaziClient and TuViClient records are created via the existing calculator pages (`/bazi/clients/` and `/tu-vi/clients/`). The admin page links these existing records into a ClientProfile — it does not create new chart data.

### ReadingToken

A shareable link for a client to view their reading and ask follow-up questions. Each token is tied to one reading type (Bazi or TuVi) for one client.

`clientType` indicates which reading to use. The actual client record ID is resolved via `ClientProfile.baziClientId` or `ClientProfile.tuViClientId` — no need to duplicate it here.

`sessionId` stores the Claude Agent SDK session ID, used to resume conversation context across messages (see #12 for chat implementation).

`maxMessages` counts only client messages (not assistant responses). 10 means 10 questions from the client.

```prisma
model ReadingToken {
  id              String         @id @default(cuid())
  clientProfileId String
  clientType      String         // "bazi" | "tuvi"
  sessionId       String?        // Claude Agent SDK session ID for chat resume
  maxMessages     Int            @default(10) // counts client messages only
  expiresAt       DateTime       // createdAt + 7 days
  createdAt       DateTime       @default(now())
  clientProfile   ClientProfile  @relation(fields: [clientProfileId], references: [id])
  messages        ReadingMessage[]

  @@index([clientProfileId])
}
```

### ReadingMessage

Chat messages between client and Claude, scoped to a token.

```prisma
model ReadingMessage {
  id        String       @id @default(cuid())
  tokenId   String
  role      String       // "client" | "assistant"
  content   String
  createdAt DateTime     @default(now())
  token     ReadingToken @relation(fields: [tokenId], references: [id])

  @@index([tokenId])
}
```

## Admin Auth

### Login flow

1. Admin visits `/admin` → sees login form
2. POST `/api/admin/login` with `{ username, password }`
3. Server verifies against `AdminUser` table (bcrypt compare)
4. On success: sets HTTP-only, secure, SameSite=Strict cookie containing a signed session token (JWT with admin user ID, expires in 24 hours)
5. On failure: returns 401

### Cookie details

- Name: `admin_session`
- HTTP-only, Secure (in production), SameSite=Strict
- Contains JWT signed with `ADMIN_JWT_SECRET` env var
- 24-hour expiry

### Middleware

All `/admin` pages and `/api/admin/*` routes (except `/api/admin/login`) check for valid `admin_session` cookie. Invalid or expired cookie redirects to login.

### First admin user

CLI script at `scripts/create-admin.ts`:

```
npx tsx scripts/create-admin.ts
```

Prompts for username and password interactively. Hashes password with bcrypt, inserts into `AdminUser` table. Can be run multiple times to create additional admins.

### Dependencies

- `bcryptjs` — password hashing (pure JS, no native compilation issues in CI)
- `jsonwebtoken` — JWT for session cookie

## Pages

### `/admin` — Login + Client List

**When not authenticated:** Login form (username + password fields, submit button).

**When authenticated:**

- Header: "Admin" title, logout button
- Search bar: filter clients by name
- Client table:
  - Name
  - Birth date (formatted)
  - Gender (always display Vietnamese format: Nam/Nu)
  - Readings: icons/badges showing which types exist (Bazi, TuVi)
  - Active tokens: count of non-expired, non-maxed tokens
  - Click row → navigates to `/admin/clients/[id]`

### `/admin/clients/[id]` — Client Profile

**Header section:**
- Client name, birth date, gender

**Tabs:**
- **Bazi**: shows BaziClient chart summary (day master, element strengths) if linked. "Not linked" state if no BaziClient.
- **TuVi**: shows TuViClient chart summary (cục, mệnh) if linked. "Not linked" state if no TuViClient.

**Tokens section:**
- List of all tokens for this client
- Each token row:
  - Reading type (Bazi/TuVi)
  - Status badge: Active (green) / Expired (gray) / Maxed (orange)
  - Questions used: "3/10"
  - Expiry date
  - Copy link button (copies `/readings/[tokenId]` to clipboard)
- "Generate Link" button:
  - Select reading type (Bazi or TuVi) — only shows types that are linked
  - Creates ReadingToken with `expiresAt = now + 7 days`, `maxMessages = 10`
  - Shows the generated URL with a copy button

## API Routes

All `/api/admin/*` routes (except login) require valid `admin_session` cookie.

### `POST /api/admin/login`
- Body: `{ username: string, password: string }`
- Verifies credentials, sets cookie
- Returns: `{ success: true }` or 401

### `POST /api/admin/logout`
- Clears `admin_session` cookie
- Returns: `{ success: true }`

### `GET /api/admin/clients`
- Query params: `?q=` for name search
- Returns: list of ClientProfiles with linked reading type indicators and active token counts

### `POST /api/admin/clients`
- Body: `{ name, baziClientId?, tuViClientId? }` — at least one ID required
- Creates ClientProfile, linking to existing BaziClient/TuViClient by ID
- Validates that referenced BaziClient/TuViClient exists and is not already linked to another profile
- Returns: created ClientProfile

### `GET /api/admin/clients/[id]`
- Returns: ClientProfile with full BaziClient data, TuViClient data, and all tokens with message counts

### `POST /api/admin/tokens`
- Body: `{ clientProfileId, clientType: "bazi" | "tuvi" }`
- Creates ReadingToken (7-day expiry, 10-message cap)
- Returns: created token with full URL

### `PATCH /api/admin/clients/[id]`
- Body: `{ baziClientId?, tuViClientId? }` — link/unlink reading types after creation
- Validates referenced records exist and are not already linked elsewhere
- Returns: updated ClientProfile

### `DELETE /api/admin/tokens/[id]`
- Soft-invalidates token (sets `expiresAt` to now)
- Returns: `{ success: true }`

## UI Components

Uses existing project patterns: Tailwind CSS v4, shadcn components, lucide-react icons. Server components where possible, client components only for interactive parts (search, forms, copy button).

## Security

- Passwords bcrypt-hashed (cost factor 12)
- JWT-signed session cookie (HTTP-only, Secure, SameSite=Strict)
- No admin creation endpoint — CLI script only
- Token IDs are cuid (unguessable)
- Admin routes protected by middleware

## Out of scope

- Admin user management UI (use CLI script)
- Creating new BaziClient/TuViClient from admin (use existing calculator pages)
- Client-facing reading page and chat (issue #12)
- Email notifications
