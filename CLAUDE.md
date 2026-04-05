# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start dev server (localhost:3000)
- `npm run build` — Production build (also runs TypeScript checking)
- `npm run lint` — ESLint
- `npm start` — Serve production build
- `docker compose up` — Run app + PostgreSQL locally in containers
- `node scripts/hash-password.mjs <password>` — Generate bcrypt hash for ADMIN_PASSWORD_HASH

## Architecture

**Next.js 15 App Router** site for Light & Lilies, a curated Christian art gallery. Operated by Spark App Studios LLC.

### Tech Stack
- **Next.js 15** with App Router, TypeScript, standalone output
- **Tailwind CSS v4** with inline `@theme` tokens in `app/globals.css`
- **PostgreSQL** via `pg` — artwork storage (`lib/db.ts`, `lib/artworks.ts`)
- **embla-carousel-react** for collection image carousels
- **react-hook-form + zod v4** for form validation
- **Resend** for email notifications (registrations + signups)
- **jose** for JWT auth, **bcryptjs** for password hashing
- **next/font/google** with Playfair Display (headings) + Lora (body)

### Design System (defined in `app/globals.css`)
- Background: cream `#FDF8F0`
- Primary colors: dark purple `#2D1B4E`, purple `#6B4C8A`, light purple `#E8D5F5`
- Accent: light green `#D4E8D0`, green `#7BA67D`
- All headings use `font-heading` (Playfair Display), body uses `font-body` (Lora)

### Route Structure
- `/` — Homepage with hero, mission, 5 collection carousels, why/how sections, email signup
- `/about` — About page
- `/contact` — Contact page
- `/register` — Artist registration form (TOS + consignment agreement)
- `/register/success` — Post-registration confirmation
- `/admin` — Admin dashboard (JWT-protected)
- `/admin/artworks/new` — Create artwork
- `/admin/artworks/[id]/edit` — Edit artwork
- `/api/signup` — Email signup (POST, sends via Resend)
- `/api/register` — Artist registration (POST, validates with Zod, sends via Resend)
- `/api/admin/*` — Admin CRUD APIs (protected by middleware)

### Security
- **Middleware** (`middleware.ts`) protects all `/admin` and `/api/admin` routes, adds security headers
- **Rate limiting** (`lib/rate-limit.ts`) on login: 5 attempts per IP per 15 minutes
- **Bcrypt** password hashing via `ADMIN_PASSWORD_HASH` (plain-text `ADMIN_PASSWORD` supported for dev with warning)
- **JWT sessions** (8h expiry, httpOnly, secure, sameSite=strict)
- **Zod validation** on all API inputs (`lib/validation.ts`)

### Key Patterns
- **Shared layout**: `Header` + `Footer` in `app/layout.tsx`, `Hero` component reused across pages
- **Collection definitions** in `lib/collections.ts` — carousel structure and placeholders
- **Artwork data** in PostgreSQL — admin-created artworks replace placeholders per collection
- **Carousel modals**: CSS-driven hover overlays inside carousel slides (not React portals)
- **DB auto-init**: `lib/db.ts` creates tables on first query if they don't exist

### Environment Variables
- `DATABASE_URL` — PostgreSQL connection string
- `RESEND_API_KEY` — Resend API key
- `ADMIN_PASSWORD_HASH` — bcrypt hash (production) or `ADMIN_PASSWORD` (dev only)
- `ADMIN_SECRET` — JWT signing secret (required, no fallback)
- `DATABASE_SSL` — set to `true` for Railway/hosted PostgreSQL
