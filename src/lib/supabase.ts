// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";
import type {
  Influencer,
  SocialAccount,
  InfluencerLink,
  InfluencerImage,
  CollaborationRequest,
  ContactMessage,
  Profile,
  Blog,
} from "@/types";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser client (singleton)
export const supabase = createClient(URL, ANON);

// Server-only admin client
export const adminClient = () =>
  createClient(URL, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// ─── AUTH ─────────────────────────────────────────────────────────────────────
export async function signUp(
  email: string,
  password: string,
  fullName: string,
) {
  return supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, role: "user" } },
  });
}

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return data as Profile | null;
}

// ─── INFLUENCERS ──────────────────────────────────────────────────────────────
export async function getInfluencers(filters?: {
  category?: string;
  search?: string;
  featured?: boolean;
}): Promise<Influencer[]> {
  let q = supabase
    .from("influencers")
    .select(
      `
      *,
      socials:influencer_socials(id,platform,handle,followers,sort_order),
      links:influencer_links(id,link_type,url,label,sort_order),
      images:influencer_images(id,url,label,sort_order)
    `,
    )
    .eq("is_active", true)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (filters?.featured) q = q.eq("is_featured", true);
  if (filters?.category && filters.category !== "All") {
    q = q.or(`category.eq.${filters.category},tags.cs.{${filters.category}}`);
  }
  if (filters?.search) {
    const s = filters.search;
    q = q.or(`name.ilike.%${s}%,bio.ilike.%${s}%,category.ilike.%${s}%`);
  }

  const { data, error } = await q;
  if (error) throw error;

  // Sort nested arrays
  return (data as any[]).map(normalise);
}

export async function getInfluencerBySlug(slug: string): Promise<Influencer> {
  const { data, error } = await supabase
    .from("influencers")
    .select(
      `
      *,
      socials:influencer_socials(id,platform,handle,followers,sort_order),
      links:influencer_links(id,link_type,url,label,sort_order),
      images:influencer_images(id,url,label,sort_order)
    `,
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  if (error) throw error;
  return normalise(data);
}

function normalise(raw: any): Influencer {
  return {
    ...raw,
    socials: (raw.socials || []).sort(
      (a: any, b: any) => a.sort_order - b.sort_order,
    ),
    links: (raw.links || []).sort(
      (a: any, b: any) => a.sort_order - b.sort_order,
    ),
    images: (raw.images || []).sort(
      (a: any, b: any) => a.sort_order - b.sort_order,
    ),
  };
}

// ─── ADMIN — INFLUENCERS ──────────────────────────────────────────────────────
export async function adminGetInfluencers(): Promise<Influencer[]> {
  const { data, error } = await supabase
    .from("influencers")
    .select(
      `
      *,
      socials:influencer_socials(id,platform,handle,followers,sort_order),
      links:influencer_links(id,link_type,url,label,sort_order),
      images:influencer_images(id,url,label,sort_order)
    `,
    )
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as any[]).map(normalise);
}

export async function adminUpsertInfluencer(
  inf: Partial<Influencer> & {
    socials?: Partial<SocialAccount>[];
    links?: Partial<InfluencerLink>[];
    images?: Partial<InfluencerImage>[];
  },
) {
  const db = supabase;
  const { socials, links, images, ...core } = inf;

  // Upsert core
  const { data, error } = await db
    .from("influencers")
    .upsert([core])
    .select()
    .single();
  if (error) throw error;
  const id = (data as any).id;

  // Replace socials
  if (socials !== undefined) {
    await db.from("influencer_socials").delete().eq("influencer_id", id);
    if (socials.length > 0) {
      await db
        .from("influencer_socials")
        .insert(
          socials
            .filter((s) => s.handle)
            .map((s, i) => ({ ...s, influencer_id: id, sort_order: i })),
        );
    }
  }

  // Replace links
  if (links !== undefined) {
    await db.from("influencer_links").delete().eq("influencer_id", id);
    if (links.length > 0) {
      await db
        .from("influencer_links")
        .insert(
          links
            .filter((l) => l.url)
            .map((l, i) => ({ ...l, influencer_id: id, sort_order: i })),
        );
    }
  }

  // Replace images
  if (images !== undefined) {
    await db.from("influencer_images").delete().eq("influencer_id", id);
    if (images.length > 0) {
      await db
        .from("influencer_images")
        .insert(
          images
            .filter((img) => img.url)
            .map((img, i) => ({ ...img, influencer_id: id, sort_order: i })),
        );
    }
  }

  return data;
}

export async function adminDeleteInfluencer(id: string) {
  const { error } = await supabase.from("influencers").delete().eq("id", id);
  if (error) throw error;
}

export async function adminToggleFeatured(id: string, featured: boolean) {
  const { error } = await supabase
    .from("influencers")
    .update({ is_featured: featured })
    .eq("id", id);
  if (error) throw error;
}

// ─── COLLABORATION REQUESTS ───────────────────────────────────────────────────
export async function submitCollabRequest(payload: {
  influencer_id: string;
  user_id: string;
  brand_name: string;
  contact_name: string;
  contact_email: string;
  message: string;
}) {
  const { error } = await supabase
    .from("collaboration_requests")
    .insert([payload]);
  if (error) throw error;
}

export async function adminGetRequests(): Promise<CollaborationRequest[]> {
  const { data, error } = await supabase
    .from("collaboration_requests")
    .select("*, influencer:influencers(name,slug,category)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as CollaborationRequest[];
}

export async function adminUpdateRequestStatus(id: string, status: string) {
  const { error } = await supabase
    .from("collaboration_requests")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}

// ─── CONTACT MESSAGES ─────────────────────────────────────────────────────────
export async function submitContactMessage(payload: {
  user_id: string;
  sender_name: string;
  sender_email: string;
  sender_phone: string;
  preferred_contact: string;
  social_handle: string;
  subject: string;
  message: string;
  type: string;
}) {
  const { error } = await supabase.from("contact_messages").insert([payload]);
  if (error) throw error;
}

export async function adminGetMessages(): Promise<ContactMessage[]> {
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as ContactMessage[];
}

export async function adminUpdateMessageStatus(id: string, status: string) {
  const { error } = await supabase
    .from("contact_messages")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}

// ─── ADMIN — ALL PROFILES ─────────────────────────────────────────────────────
export async function adminGetProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Profile[];
}

// ________ BLOGS ______________

export async function adminGetBlogs() {
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function adminGetBlogBySlug(slug: string) {
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) throw error;
  return data;
}

export async function adminUpsertBlog(blog: Partial<Blog>) {
  const { error } = await supabase.from("blogs").upsert(blog);

  if (error) throw error;
}
export async function adminDeleteBlog(id: string) {
  const { error } = await supabase.from("blogs").delete().eq("id", id);

  if (error) throw error;
}
export async function adminToggleBlogFeatured(id: string, featured: boolean) {
  const { error } = await supabase
    .from("blogs")
    .update({ featured })
    .eq("id", id);

  if (error) throw error;
}
export async function adminToggleBlogPublished(
  id: string,
  is_published: boolean,
) {
  const { error } = await supabase
    .from("blogs")
    .update({ is_published })
    .eq("id", id);
  if (error) throw error;
}

// _______ USER PROFILES _______________
export async function getProfileByUsername(username: string) {
  const res = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .maybeSingle();

 console.log("SB RESULTS: ", res)

  return res.data?.[0] ?? null;
}

export async function updateProfile(id: string, updates: Partial<Profile>) {
  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", id);

  if (error) throw error;
}
export async function getBlogsByAuthor(
  authorId: string,
) {
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("author_id", authorId)
    .eq("is_published", true);

  if (error) throw error;

  return data;
}
