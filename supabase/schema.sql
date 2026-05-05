-- ============================================================
-- KOLI DATABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── INFLUENCERS TABLE ────────────────────────────────────────────────────────
create table public.influencers (
  id            uuid default uuid_generate_v4() primary key,
  created_at    timestamp with time zone default timezone('utc', now()),
  name          text not null,
  slug          text unique not null,
  bio           text,
  category      text not null,
  location      text default 'Kigali',
  phone         text,                          -- WhatsApp number, e.g. +250788000001
  instagram     text,                          -- handle without @
  instagram_followers integer default 0,
  tiktok        text,
  tiktok_followers    integer default 0,
  avatar        text,                          -- 2-char initials, e.g. "AI"
  color         text default '#B6FF2E',        -- accent color hex
  tags          text[] default '{}',           -- e.g. ["Fashion","Lifestyle"]
  content_types text[] default '{}',          -- e.g. ["Lookbooks","OOTD"]
  rate_range    text,                          -- e.g. "50-150k RWF"
  is_featured   boolean default false,
  is_active     boolean default true
);

-- ─── COLLABORATION REQUESTS TABLE ─────────────────────────────────────────────
create table public.collaboration_requests (
  id              uuid default uuid_generate_v4() primary key,
  created_at      timestamp with time zone default timezone('utc', now()),
  influencer_id   uuid references public.influencers(id) on delete cascade,
  brand_name      text not null,
  contact_name    text not null,
  contact_email   text,
  message         text,
  status          text default 'pending' check (status in ('pending','seen','accepted','declined'))
);

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────────────────────
alter table public.influencers enable row level security;
alter table public.collaboration_requests enable row level security;

-- Public can read active influencers
create policy "Public read influencers"
  on public.influencers for select
  using (is_active = true);

-- Public can insert collaboration requests
create policy "Public insert requests"
  on public.collaboration_requests for insert
  with check (true);

-- Admin full access (service role bypasses RLS automatically)
-- For admin panel, use Supabase service role key server-side

-- ─── INDEXES ──────────────────────────────────────────────────────────────────
create index idx_influencers_category on public.influencers(category);
create index idx_influencers_featured on public.influencers(is_featured) where is_featured = true;
create index idx_influencers_active on public.influencers(is_active) where is_active = true;
create index idx_requests_influencer on public.collaboration_requests(influencer_id);

-- ─── SEED DATA ────────────────────────────────────────────────────────────────
insert into public.influencers (name, slug, bio, category, location, phone, instagram, instagram_followers, tiktok, tiktok_followers, avatar, color, tags, content_types, rate_range, is_featured) values
(
  'Ange Irakoze', 'ange-irakoze',
  'Fashion content creator based in Kigali. I create lookbooks, style inspiration, and showcase Rwandan designers to an audience that loves bold, authentic looks.',
  'Fashion', 'Kigali', '+250788000001',
  'ange.irakoze', 42000, 'angestyle', 89000,
  'AI', '#B6FF2E', ARRAY['Fashion','Lifestyle'], ARRAY['Lookbooks','OOTD','Brand collabs'],
  '50–150k RWF', true
),
(
  'Eric Mugisha', 'eric-mugisha',
  'Food reviewer and chef. From street food to fine dining in Kigali — I share honest reviews, recipes, and restaurant spotlights that make people hungry.',
  'Food', 'Kigali', '+250788000002',
  'ericfoodkigali', 28000, 'ericmugisha_eats', 115000,
  'EM', '#FF6B2E', ARRAY['Food','Lifestyle'], ARRAY['Restaurant reviews','Recipes','Food tours'],
  '30–100k RWF', true
),
(
  'Claudine Uwimana', 'claudine-uwimana',
  'Lifestyle and wellness creator. I talk about everyday life in Rwanda — health, beauty, relationships, and motivation. My audience is young Kigali women 18–30.',
  'Lifestyle', 'Kigali', '+250788000003',
  'claudine.uwimana', 67000, 'claudinelife', 210000,
  'CU', '#A78BFA', ARRAY['Lifestyle','Beauty','Wellness'], ARRAY['Day-in-my-life','Beauty','Motivation'],
  '80–250k RWF', true
),
(
  'Kevin Nkusi', 'kevin-nkusi',
  'Comedy sketches, roasts, and relatable Rwandan content. My videos hit 500k+ views consistently. If you want your brand to go viral in Rwanda, let us talk.',
  'Comedy', 'Kigali', '+250788000004',
  'kevinnkusi', 95000, 'nkusicomedy', 380000,
  'KN', '#FACC15', ARRAY['Comedy','Entertainment'], ARRAY['Sketches','Brand integrations','Challenges'],
  '100–400k RWF', true
),
(
  'Diane Mutoni', 'diane-mutoni',
  'Tech creator breaking down innovation, startups, and gadgets for East Africa.',
  'Tech', 'Kigali', '+250788000005',
  'dianemutoni.tech', 18000, 'dianemutonitech', 54000,
  'DM', '#38BDF8', ARRAY['Tech','Business'], ARRAY['Tech reviews','Career advice','Startup spotlights'],
  '40–120k RWF', false
),
(
  'Grace Ineza', 'grace-ineza',
  'Beauty creator focusing on skincare for melanin-rich skin and Afro hair tutorials.',
  'Beauty', 'Kigali', '+250788000007',
  'graceineza.beauty', 51000, 'graceineza', 143000,
  'GI', '#F472B6', ARRAY['Beauty','Skincare','Hair'], ARRAY['Skincare','Hair tutorials','Product reviews'],
  '60–200k RWF', true
);
