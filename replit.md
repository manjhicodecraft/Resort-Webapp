# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### Hotel & Resort Demo (`artifacts/hotel-resort`)
- A fully responsive Hotel/Resort demo web application — "Grand Azure Resort"
- **No database** — all data is demo/hardcoded
- **Framework**: React + Vite + TypeScript
- **Styling**: Tailwind CSS v4, Playfair Display + Inter fonts, gold/navy luxury palette
- **Routing**: Wouter
- **Charts**: Recharts (admin panel)
- **Auth**: localStorage-based demo auth (admin@grandazure.com / admin123)

**Pages:**
- `/` — Home (hero, special offers, gallery, amenities, reviews, attractions, CTA)
- `/rooms` — Rooms listing (Standard, Deluxe, Suite)
- `/booking` — Multi-step booking form with fake payment (Card/UPI)
- `/search` — Search & filter rooms (type, price range, guests, availability)
- `/reviews` — Guest reviews with star ratings + submit form
- `/contact` — Contact info, inquiry form, Google Maps embed
- `/auth` — Login/Signup (demo auth)
- `/admin` — Admin panel (dashboard, room/booking/user management)
- `/virtual-tour` — YouTube video tour + photo gallery
- `/invoice` — Printable invoice/receipt

**Features:**
- Chatbot FAQ widget (bottom-right)
- Language toggle (EN/HI)
- Responsive navbar with hamburger menu
- Fully mobile responsive

**Running with npm:**
```bash
cd artifacts/hotel-resort
npm install
npm run dev     # Start dev server on port 3000
npm run build   # Build for production
npm run serve   # Serve production build
```

**Running with pnpm (in monorepo):**
```bash
pnpm --filter @workspace/hotel-resort run dev
pnpm --filter @workspace/hotel-resort run build
```

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
