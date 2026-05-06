# KOLI v2 — Rwanda's Influencer Platform

> Next.js 14 + Supabase. Auth-gated. Role-based admin. Mobile-first app shell on ≤450px.

---

## What's New in v2

- **Auth** — Supabase email/password. Sign up → profile auto-created.
- **Role-based UI** — Admin nav only shows if `profile.role = 'admin'`.
- **Gated profiles** — Non-auth users see bio/category only. Phone, rate, stats visible to signed-in users only.
- **Mobile app shell** — On ≤450px: bottom tab nav, app-like feel. On >450px: full desktop layout.
- **Dynamic socials** — Admin can add unlimited social accounts per creator (19 platforms).
- **Cover image + gallery** — First image = cover, up to 5 images total.
- **Contact Admin** — Signed-in users send messages. Admin sees them in dashboard with reply-via info.
- **Collaboration requests** — Auth users request collabs. Admin manages status in dashboard.
- **Full Supabase backend** — All data is live from your Supabase project.

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 (App Router) |
| Auth | Supabase Auth (email/password) |
| Database | Supabase Postgres + RLS |
| Styling | CSS Variables (no Tailwind runtime needed) |
| Hosting | Vercel |

---

## Setup

### 1. Install

```bash
unzip koli-nextjs.zip && cd koli-nextjs
npm install
```

### 2. Supabase schema

1. Go to [supabase.com](https://supabase.com) → your project → SQL Editor
2. Paste the entire content of `supabase/schema.sql` → Run

### 3. Environment variables

`.env.local` is already populated with your project keys.

### 4. Run

```bash
npm run dev
# open http://localhost:3000
```

### 5. Create your admin account

1. Sign up at `/auth/signup` with your admin email
2. In Supabase → SQL Editor, run:
```sql
update public.profiles set role = 'admin' where email = 'your@email.com';
```
3. Sign out and back in → Admin tab appears

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                   # Homepage (SSG, ISR)
│   ├── browse/page.tsx            # Creator directory
│   ├── influencer/[slug]/page.tsx # Profile (SSG + ISR, gated contact)
│   ├── admin/page.tsx             # Admin panel (role-gated client page)
│   ├── contact/page.tsx           # Talk to Us (auth-gated)
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   └── api/
│       ├── request/route.ts       # POST collab request
│       ├── contact/route.ts       # POST contact message
│       └── admin/influencers/route.ts
├── components/
│   ├── AuthProvider.tsx           # Global auth context
│   ├── Nav.tsx                    # Desktop nav (role-aware)
│   ├── MobileShell.tsx            # Mobile app shell (≤450px)
│   ├── HomeClient.tsx
│   ├── BrowseClient.tsx
│   ├── ProfileClient.tsx          # Gated contact/stats
│   ├── InfluencerCard.tsx
│   ├── AdminForm.tsx              # Dynamic socials/links/images
│   ├── RequestModal.tsx
│   └── Toast.tsx
├── hooks/useAuth.ts               # Auth context + role check
├── lib/
│   ├── supabase.ts                # All data helpers
│   └── platforms.ts               # 19 social platforms registry
└── types/index.ts
```

---

## Deploy to Vercel

```bash
npx vercel --prod
```

Add environment variables in Vercel Dashboard → Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## Auth Flow

| User type | What they see |
|---|---|
| Not logged in | Browse creators, see bio/category/tags, NO contact info |
| Logged in (`role=user`) | Full profile: phone, rate, stats, WhatsApp button, collab request |
| Logged in (`role=admin`) | Everything + Admin tab with creator management, requests, messages, users |

## Making Someone Admin

```sql
-- Run in Supabase SQL Editor after they sign up:
update public.profiles set role = 'admin' where email = 'admin@yourdomain.com';
```
