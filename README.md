# KOLI — Rwanda's Influencer Platform

> A clean, mobile-first platform to discover and contact influencers in Rwanda.
> Built with Next.js 14 + Supabase. Launch-ready in under a day.

---

## What KOLI Does

**For brands:** Search influencers by category, see their stats, and contact them directly on WhatsApp — no login required.

**For influencers:** Get discovered by brands. Profiles live publicly on KOLI.

**For you (admin):** Add/edit/feature creators through a clean admin panel.

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | CSS Variables + Tailwind utilities |
| Database | Supabase (Postgres + Row Level Security) |
| Hosting | Vercel (recommended) |
| Fonts | Syne (display) + DM Sans (body) |

---

## Project Structure

```
koli/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout, fonts, metadata
│   │   ├── globals.css             # Design tokens (CSS variables)
│   │   ├── page.tsx                # Homepage (server, ISR)
│   │   ├── browse/
│   │   │   └── page.tsx            # Browse/search page
│   │   ├── influencer/
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # Dynamic profile page (SSG + ISR)
│   │   ├── admin/
│   │   │   └── page.tsx            # Admin panel
│   │   └── api/
│   │       ├── request/route.ts    # POST: submit collaboration request
│   │       └── admin/
│   │           └── influencers/route.ts  # Admin CRUD actions
│   ├── components/
│   │   ├── Nav.tsx                 # Sticky navigation
│   │   ├── Footer.tsx              # Simple footer
│   │   ├── HomeClient.tsx          # Hero + search + featured grid
│   │   ├── BrowseClient.tsx        # Search + filters + results
│   │   ├── InfluencerCard.tsx      # Grid and list view card
│   │   ├── ProfileClient.tsx       # Full influencer profile
│   │   ├── RequestModal.tsx        # Collaboration request form
│   │   ├── AdminClient.tsx         # Admin panel (add/edit/feature/delete)
│   │   └── home.module.css         # Home page styles
│   └── lib/
│       └── supabase.ts             # Client, types, data helpers
├── supabase/
│   └── schema.sql                  # Full DB schema + seed data
├── .env.local.example              # Environment variable template
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Setup (Step by Step)

### 1. Clone and install

```bash
git clone <your-repo>
cd koli
npm install
```

### 2. Create Supabase project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Choose a region close to Rwanda (e.g. `eu-west-2` London or `af-south-1` Cape Town if available)
3. Note your **Project URL** and **API keys** (Settings → API)

### 3. Run the database schema

1. In Supabase Dashboard → SQL Editor
2. Open `supabase/schema.sql`
3. Paste the entire file and click **Run**

This creates:
- `influencers` table with all fields
- `collaboration_requests` table
- Row Level Security policies
- Indexes for performance
- Seed data (6 sample creators)

### 4. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
```

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Pages

| Route | Description |
|---|---|
| `/` | Homepage — hero, search bar, category pills, featured creators |
| `/browse` | Full directory — search, category + platform filters, grid/list view |
| `/influencer/[slug]` | Creator profile — bio, stats, WhatsApp CTA, collaboration request form |
| `/admin` | Admin panel — add/edit/feature/delete creators |

---

## Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Then in Vercel Dashboard → your project → Settings → Environment Variables, add:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Re-deploy after adding variables:
```bash
vercel --prod
```

**Custom domain:** In Vercel → Domains → add `koli.rw` or your domain.

---

## Adding Influencers

### Option A: Admin Panel (recommended)
Go to `/admin` → **Add Creator** → fill in the form → **Add Creator**

### Option B: Supabase Dashboard
Go to your Supabase project → Table Editor → `influencers` → Insert row

### Option C: SQL
```sql
INSERT INTO public.influencers (name, slug, bio, category, location, phone, instagram, instagram_followers, tiktok, tiktok_followers, avatar, color, tags, is_featured)
VALUES (
  'Jane Doe', 'jane-doe',
  'Lifestyle creator based in Kigali...',
  'Lifestyle', 'Kigali', '+250788000099',
  'janedoe', 35000, 'janedoe_tt', 82000,
  'JD', '#B6FF2E', ARRAY['Lifestyle','Fashion'], true
);
```

---

## Design Tokens

All colors are CSS variables in `globals.css`:

```css
--black: #0B0B0F    /* Background */
--lime: #B6FF2E     /* Primary accent (buttons, CTAs) */
--white: #FFFFFF    /* Text */
--gray: #A1A1AA     /* Muted text */
--surface: #141418  /* Card background */
--surface2: #1C1C22 /* Input/pill background */
```

---

## Securing the Admin Panel

The `/admin` route is currently open. Before going live, protect it:

### Option 1: Basic password protection (quick)
Add middleware in `src/middleware.ts`:
```ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const auth = req.headers.get('authorization')
    const expected = 'Basic ' + Buffer.from('admin:yourpassword').toString('base64')
    if (auth !== expected) {
      return new NextResponse('Unauthorized', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Admin"' },
      })
    }
  }
  return NextResponse.next()
}

export const config = { matcher: ['/admin/:path*', '/api/admin/:path*'] }
```

### Option 2: Supabase Auth (proper)
1. Enable Email Auth in Supabase Dashboard → Authentication
2. Use `@supabase/ssr` to validate sessions in middleware
3. Redirect non-admin users to login page

---

## Monetisation Roadmap (from the spec)

| Phase | What | How |
|---|---|---|
| Now | Free for all | Build supply and demand |
| Phase 2 | Featured placement | Charge brands 50–100k RWF/month to feature a creator |
| Phase 2 | "Find for me" service | Manual matchmaking for brands, charge a flat fee |
| Phase 3 | Brand subscriptions | Monthly plan for unlimited requests and priority access |

---

## Roadmap / Next Features

- [ ] Supabase Auth for admin login
- [ ] Image upload for creator photos (Supabase Storage)
- [ ] Collaboration requests dashboard in admin
- [ ] Creator self-signup form (pending approval)
- [ ] Email notification when a brand requests collaboration
- [ ] Simple analytics (profile views, WhatsApp clicks)
- [ ] Creator search by follower count range
- [ ] Mobile app (React Native)

---

## License

MIT — build freely, ship fast, credit if you feel like it.

---

Built for Rwanda. 🇷🇼
