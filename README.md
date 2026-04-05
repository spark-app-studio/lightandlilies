# Light & Lilies

Selectively curated original works of art for the Christian home. Featuring explicitly Christian works alongside vintage and antique pieces that reflect the beauty of God's creation.

**[lightandlilies.com](https://lightandlilies.com)**

## Tech Stack

- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS v4**
- **embla-carousel-react** — Collection image carousels
- **react-hook-form + zod** — Form validation
- **Resend** — Email notifications
- **jose** — JWT authentication for admin panel

## Getting Started

```bash
npm install
cp .env.local.example .env.local  # then fill in your values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a `.env.local` file with:

```
RESEND_API_KEY=re_your_api_key
ADMIN_PASSWORD=your_secure_password
ADMIN_SECRET=a_random_secret_string
```

| Variable | Description |
|---|---|
| `RESEND_API_KEY` | API key from [resend.com](https://resend.com) for email notifications |
| `ADMIN_PASSWORD` | Password for the admin panel at `/admin` |
| `ADMIN_SECRET` | Secret used to sign JWT session tokens |

## Pages

| Route | Description |
|---|---|
| `/` | Homepage — hero, mission, 5 collection carousels, email signup |
| `/about` | About Light & Lilies |
| `/contact` | Contact information |
| `/register` | Artist registration with Terms of Service and consignment agreement |
| `/admin` | Admin dashboard for managing artwork entries |

## Admin Panel

Access at `/admin/login`. Artworks created through the admin panel automatically appear in the homepage collection carousels, replacing the placeholder images.

## Deployment

Optimized for [Vercel](https://vercel.com). Connect the repo and add the environment variables in the Vercel dashboard.

Note: The current data storage uses a local JSON file (`data/artworks.json`). For production at scale, this should be migrated to a database.

## Operated By

Spark App Studios LLC
