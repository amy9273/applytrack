# ApplyTrack — System Architecture & Invariants

## Architecture
- **Framework**: Next.js 15 (App Router, Server Actions, Route Handlers) + React 19 + TypeScript
- **Styling**: Tailwind CSS + Lucide React Icons
- **Database**: Prisma ORM with SQLite (dev) / PostgreSQL (production ready)
- **Integrations**: Google OAuth 2.0 (`googleapis`), Gmail API (`gmail.readonly`), Gemini AI & Rule-based NLP Extractor

## Invariants
1. **Privacy & Minimal Scope**: Request only `https://www.googleapis.com/auth/gmail.readonly` and `userinfo.email`. Never request write or delete scopes.
2. **Targeted Querying**: Never scan or ingest the user's entire mailbox. Filter using recruitment-specific queries.
3. **Secret Isolation**: OAuth client secret, refresh tokens, and AI keys must never be exposed to the client or prefixed with `NEXT_PUBLIC_`.
4. **Idempotency & Deduplication**: Emails are keyed by `gmailMessageId`. Re-syncing must never create duplicates.
5. **No Hallucination**: If an entity (company, role, date, link) is missing, leave it null/empty. Flag ambiguous items with `needsReview = true`.
6. **Timezone Awareness**: Default to `Asia/Manila` while respecting explicit timezones in interview invites.
7. **4-State UI**: All data screens must render Skeleton Loading, Empty State, Error with Retry, and Populated View.
