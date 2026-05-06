-- ============================================================
-- KOLI DATABASE SCHEMA v2
-- Run entirely in Supabase SQL Editor → New Query → Run
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm"; -- for fast text search

-- ─── PROFILES (extends auth.users) ──────────────────────────────────────────
create table public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  email       text,
  full_name   text,
  avatar_url  text,
  role        text not null default 'user' check (role in ('user', 'admin')),
  created_at  timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'user')
  );
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── INFLUENCERS ─────────────────────────────────────────────────────────────
create table public.influencers (
  id            uuid default uuid_generate_v4() primary key,
  created_at    timestamptz default now(),
  name          text not null,
  slug          text unique not null,
  bio           text,
  category      text not null,
  location      text default 'Kigali',
  phone         text,          -- only shown to signed-in users
  email         text,          -- only shown to signed-in users
  avatar        text,          -- 2-char initials
  color         text default '#B6FF2E',
  tags          text[] default '{}',
  content_types text[] default '{}',
  rate_range    text,          -- only shown to signed-in users
  is_featured   boolean default false,
  is_active     boolean default true
);

-- ─── INFLUENCER SOCIALS (dynamic, unlimited) ─────────────────────────────────
create table public.influencer_socials (
  id             uuid default uuid_generate_v4() primary key,
  influencer_id  uuid references public.influencers(id) on delete cascade not null,
  platform       text not null,   -- 'instagram', 'tiktok', 'twitter', etc.
  handle         text not null,
  followers      integer default 0,
  sort_order     integer default 0,
  created_at     timestamptz default now()
);

-- ─── INFLUENCER LINKS (website, podcast, linktree, etc.) ─────────────────────
create table public.influencer_links (
  id             uuid default uuid_generate_v4() primary key,
  influencer_id  uuid references public.influencers(id) on delete cascade not null,
  link_type      text not null,   -- 'website', 'podcast', 'substack', etc.
  url            text not null,
  label          text,
  sort_order     integer default 0,
  created_at     timestamptz default now()
);

-- ─── INFLUENCER IMAGES ───────────────────────────────────────────────────────
create table public.influencer_images (
  id             uuid default uuid_generate_v4() primary key,
  influencer_id  uuid references public.influencers(id) on delete cascade not null,
  url            text not null,
  label          text,
  sort_order     integer default 0, -- 0 = cover
  created_at     timestamptz default now()
);

-- ─── COLLABORATION REQUESTS ──────────────────────────────────────────────────
create table public.collaboration_requests (
  id              uuid default uuid_generate_v4() primary key,
  created_at      timestamptz default now(),
  influencer_id   uuid references public.influencers(id) on delete cascade,
  user_id         uuid references auth.users(id) on delete set null,
  brand_name      text not null,
  contact_name    text not null,
  contact_email   text,
  message         text,
  status          text default 'pending' check (status in ('pending','seen','accepted','declined'))
);

-- ─── CONTACT MESSAGES (user → admin) ────────────────────────────────────────
create table public.contact_messages (
  id              uuid default uuid_generate_v4() primary key,
  created_at      timestamptz default now(),
  user_id         uuid references auth.users(id) on delete set null,
  sender_name     text not null,
  sender_email    text,
  sender_phone    text,
  preferred_contact text default 'email' check (preferred_contact in ('email','phone','whatsapp','social')),
  social_handle   text,
  subject         text,
  message         text not null,
  type            text default 'general' check (type in ('general','problem','advice','assistance','request','partnership')),
  status          text default 'unread' check (status in ('unread','read','replied','closed'))
);

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────────────────────
alter table public.profiles              enable row level security;
alter table public.influencers           enable row level security;
alter table public.influencer_socials    enable row level security;
alter table public.influencer_links      enable row level security;
alter table public.influencer_images     enable row level security;
alter table public.collaboration_requests enable row level security;
alter table public.contact_messages      enable row level security;

-- Profiles: users read own, admins read all
create policy "Users read own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Admin read all profiles"
  on public.profiles for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
create policy "Users update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Influencers: everyone reads active (but sensitive fields gated in app layer)
create policy "Public read active influencers"
  on public.influencers for select using (is_active = true);
create policy "Admin full access influencers"
  on public.influencers for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Socials / Links / Images: public read
create policy "Public read socials"
  on public.influencer_socials for select using (true);
create policy "Admin manage socials"
  on public.influencer_socials for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
create policy "Public read links"
  on public.influencer_links for select using (true);
create policy "Admin manage links"
  on public.influencer_links for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
create policy "Public read images"
  on public.influencer_images for select using (true);
create policy "Admin manage images"
  on public.influencer_images for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Collaboration requests: authed users insert, admin reads all
create policy "Auth users insert requests"
  on public.collaboration_requests for insert with check (auth.uid() is not null);
create policy "Admin read all requests"
  on public.collaboration_requests for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
create policy "Users read own requests"
  on public.collaboration_requests for select using (user_id = auth.uid());

-- Contact messages: authed users insert, admin reads all
create policy "Auth users insert messages"
  on public.contact_messages for insert with check (auth.uid() is not null);
create policy "Admin manage messages"
  on public.contact_messages for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
create policy "Users read own messages"
  on public.contact_messages for select using (user_id = auth.uid());

-- ─── INDEXES ─────────────────────────────────────────────────────────────────
create index idx_influencers_category  on public.influencers(category);
create index idx_influencers_featured  on public.influencers(is_featured) where is_featured = true;
create index idx_influencers_active    on public.influencers(is_active) where is_active = true;
create index idx_influencers_slug      on public.influencers(slug);
create index idx_socials_influencer    on public.influencer_socials(influencer_id);
create index idx_links_influencer      on public.influencer_links(influencer_id);
create index idx_images_influencer     on public.influencer_images(influencer_id);
create index idx_requests_influencer   on public.collaboration_requests(influencer_id);
create index idx_messages_status       on public.contact_messages(status);
create index idx_influencers_search    on public.influencers using gin(to_tsvector('english', name || ' ' || coalesce(bio,'') || ' ' || category));

-- ─── SEED DATA ───────────────────────────────────────────────────────────────
-- Insert influencers
with ins as (
  insert into public.influencers (name, slug, bio, category, location, phone, avatar, color, tags, content_types, rate_range, is_featured) values
  ('Ange Irakoze','ange-irakoze','Fashion content creator based in Kigali. I create lookbooks, style inspiration, and showcase Rwandan designers to an audience that loves bold, authentic looks.','Fashion','Kigali','+250788000001','AI','#B6FF2E',ARRAY['Fashion','Lifestyle'],ARRAY['Lookbooks','OOTD','Brand collabs'],'50–150k RWF',true),
  ('Eric Mugisha','eric-mugisha','Food reviewer and chef. From street food to fine dining in Kigali — honest reviews, recipes, and restaurant spotlights that make people hungry.','Food','Kigali','+250788000002','EM','#FF6B2E',ARRAY['Food','Lifestyle'],ARRAY['Restaurant reviews','Recipes','Food tours'],'30–100k RWF',true),
  ('Claudine Uwimana','claudine-uwimana','Lifestyle and wellness creator. Everyday life in Rwanda — health, beauty, relationships, motivation. Audience: young Kigali women 18–30.','Lifestyle','Kigali','+250788000003','CU','#A78BFA',ARRAY['Lifestyle','Beauty','Wellness'],ARRAY['Day-in-my-life','Beauty','Motivation'],'80–250k RWF',true),
  ('Kevin Nkusi','kevin-nkusi','Comedy sketches, roasts, and relatable Rwandan content. Videos hit 500k+ views consistently.','Comedy','Kigali','+250788000004','KN','#FACC15',ARRAY['Comedy','Entertainment'],ARRAY['Sketches','Brand integrations','Challenges'],'100–400k RWF',true),
  ('Diane Mutoni','diane-mutoni','Tech creator breaking down innovation, startups, and gadgets for East Africa.','Tech','Kigali','+250788000005','DM','#38BDF8',ARRAY['Tech','Business'],ARRAY['Tech reviews','Career advice','Startup spotlights'],'40–120k RWF',false),
  ('Grace Ineza','grace-ineza','Beauty creator focusing on skincare for melanin-rich skin and Afro hair tutorials.','Beauty','Kigali','+250788000007','GI','#F472B6',ARRAY['Beauty','Skincare','Hair'],ARRAY['Skincare','Hair tutorials','Product reviews'],'60–200k RWF',true),
  ('Samuel Nzeyimana','samuel-nzeyimana','Showing the world that Rwanda and East Africa are must-visit destinations. Cinematic travel content.','Travel','Kigali','+250788000008','SN','#FB923C',ARRAY['Travel','Lifestyle','Photography'],ARRAY['Travel vlogs','Destination guides','Brand trips'],'60–180k RWF',false)
  returning id, slug
)
-- Socials
insert into public.influencer_socials (influencer_id, platform, handle, followers, sort_order)
select i.id, s.platform, s.handle, s.followers, s.sort_order
from ins i
join lateral (values
  ('ange-irakoze',    'instagram',0,'ange.irakoze',42000),
  ('ange-irakoze',    'tiktok',   1,'angestyle',   89000),
  ('ange-irakoze',    'twitter',  2,'angirakoze',  8200),
  ('eric-mugisha',    'instagram',0,'ericfoodkigali',  28000),
  ('eric-mugisha',    'tiktok',   1,'ericmugisha_eats',115000),
  ('eric-mugisha',    'youtube',  2,'@ericfoodkigali', 12000),
  ('claudine-uwimana','instagram',0,'claudine.uwimana',67000),
  ('claudine-uwimana','tiktok',   1,'claudinelife',    210000),
  ('claudine-uwimana','linkedin', 2,'claudine-uwimana',4100),
  ('claudine-uwimana','twitter',  3,'claudinelife_rw', 11000),
  ('kevin-nkusi',     'tiktok',   0,'nkusicomedy',  380000),
  ('kevin-nkusi',     'instagram',1,'kevinnkusi',   95000),
  ('kevin-nkusi',     'youtube',  2,'@nkusicomedy', 67000),
  ('kevin-nkusi',     'facebook', 3,'kevinnkusi',   42000),
  ('diane-mutoni',    'instagram',0,'dianemutoni.tech', 18000),
  ('diane-mutoni',    'tiktok',   1,'dianemutonitech',  54000),
  ('diane-mutoni',    'linkedin', 2,'diane-mutoni-tech',9800),
  ('diane-mutoni',    'twitter',  3,'dianemutoni',  14000),
  ('grace-ineza',     'instagram',0,'graceineza.beauty',51000),
  ('grace-ineza',     'tiktok',   1,'graceineza',   143000),
  ('grace-ineza',     'pinterest',2,'graceineza',   7200),
  ('samuel-nzeyimana','instagram',0,'samuelexplores',  33000),
  ('samuel-nzeyimana','tiktok',   1,'samuel_travels',  92000),
  ('samuel-nzeyimana','youtube',  2,'@samuelexplores', 28000)
) as s(slug, platform, sort_order, handle, followers) on i.slug = s.slug;

-- Links
with influencer_ids as (select id, slug from public.influencers)
insert into public.influencer_links (influencer_id, link_type, url, label, sort_order)
select i.id, l.link_type, l.url, l.label, l.sort_order
from influencer_ids i
join lateral (values
  ('ange-irakoze',    'website', 'https://angestyle.rw',          'Portfolio', 0),
  ('claudine-uwimana','podcast', 'https://anchor.fm/claudinelife', 'My Podcast',0),
  ('diane-mutoni',    'website', 'https://dianemutoni.tech',       'Tech Blog', 0),
  ('samuel-nzeyimana','website', 'https://samuelexplores.com',     'Travel Blog',0)
) as l(slug, link_type, url, label, sort_order) on i.slug = l.slug;

-- ─── CREATE ADMIN USER (run AFTER signing up with admin@koli.rw) ─────────────
-- After you sign up via the app with your admin email, run:
-- update public.profiles set role = 'admin' where email = 'admin@koli.rw';
