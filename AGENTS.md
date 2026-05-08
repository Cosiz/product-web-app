# Neo — Coding Standards (AGENTS.md)

## Architecture
- Max 200 lines per file — enforce strictly
- Separation: UI in src/components/, business logic in src/lib/, mutations in src/actions/
- Server Components for all data reads (no client-side fetching)
- Server Actions (src/actions/) for all mutations
- Zod for all input validation
- TypeScript strict mode — no any, no implicit any
- No raw SQL in components — use typed queries

## File Structure
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth routes: login/, join/
│   ├── (app)/             # Authenticated routes
│   │   ├── dashboard/
│   │   ├── tasks/
│   │   ├── map/
│   │   ├── feed/
│   │   ├── album/
│   │   └── settings/
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                # shadcn/ui primitives (DO NOT EDIT)
│   ├── tasks/
│   ├── map/
│   ├── feed/
│   └── shared/
├── lib/
│   ├── database.ts        # Supabase server client
│   ├── database.types.ts  # Generated types
│   ├── schemas.ts         # Zod schemas
│   └── utils.ts           # cn(), formatDate()
├── actions/               # Server Actions
│   ├── tasks.ts
│   ├── family.ts
│   ├── members.ts
│   └── photos.ts
├── hooks/
└── types/

## Component Rules
Server Component (default): no 'use client', direct DB calls.
Client Component: explicit 'use client', only for interactivity.

## data-testid Rules
EVERY interactive element MUST have data-testid.
Format: {component}-{identifier}-{action} or {component}-{identifier}
Examples:
- btn-create-task
- task-card-{id}
- input-task-title
- nav-tasks
- btn-checkin-{childId}
- toast-success
- skeleton-task-card
- empty-tasks

## Git Checkpoints
After Phase 2: git add . && git commit -m "Checkpoint: Phase 2 complete"
After Phase 3: git add . && git commit -m "Checkpoint: Phase 3 complete"
After Phase 4: git add . && git commit -m "Checkpoint: Phase 4 complete"

## Build Requirements
npm run build: 0 errors. ESLint: 0 warnings. TypeScript: strict. Playwright: all pass.

## No-Go List
- No use client unless necessary
- No console.log in production
- No inline styles (Tailwind only)
- No hardcoded colors (design tokens only)
- No raw SQL in components
- No API routes unless Server Action insufficient
- No @ts-ignore, no any type
