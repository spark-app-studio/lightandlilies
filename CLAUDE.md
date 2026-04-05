# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start dev server (localhost:3000)
- `npm run build` — Production build (also runs TypeScript checking)
- `npm run lint` — ESLint
- `npm start` — Serve production build

## Architecture

**Next.js 15 App Router** site for Light & Lilies, a curated Christian art gallery.

### Tech Stack
- **Next.js 15** with App Router, TypeScript
- **Tailwind CSS v4** with inline `@theme` tokens in `app/globals.css`
- **embla-carousel-react** for collection image carousels
- **react-hook-form + zod v4** for artist registration form validation
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
- `/api/signup` — Email signup stub (POST)
- `/api/register` — Artist registration stub (POST, validates with Zod)

### Key Patterns
- **Shared layout**: `Header` + `Footer` in `app/layout.tsx`, `Hero` component reused across pages
- **Collection data**: All 5 collections defined in `lib/collections.ts` — single source of truth
- **Form validation**: Zod schemas in `lib/validation.ts`, connected via `@hookform/resolvers`
- **API routes are stubs**: They validate input and return success; no database or email service yet
- **Carousel modals**: CSS-driven hover overlays inside carousel slides (not React portals)
- **Placeholder images**: Using placehold.co URLs; swap to local files in `public/images/` when real artwork is available
