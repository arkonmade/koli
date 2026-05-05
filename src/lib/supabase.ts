// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side admin client (uses service role key, never expose to browser)
export const getAdminClient = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

// ─── TYPES ───────────────────────────────────────────────────────────────────
export type Influencer = {
  id: string
  name: string
  slug: string
  bio: string
  category: string
  location: string
  phone: string
  instagram: string
  instagram_followers: number
  tiktok: string
  tiktok_followers: number
  avatar: string
  color: string
  tags: string[]
  content_types: string[]
  rate_range: string
  is_featured: boolean
  is_active: boolean
  created_at: string
}

export type CollaborationRequest = {
  id: string
  influencer_id: string
  brand_name: string
  contact_name: string
  contact_email: string
  message: string
  status: 'pending' | 'seen' | 'accepted' | 'declined'
  created_at: string
}

// ─── DATA HELPERS ─────────────────────────────────────────────────────────────
export async function getInfluencers(filters?: {
  category?: string
  search?: string
  platform?: string
  featured?: boolean
}) {
  let query = supabase
    .from('influencers')
    .select('*')
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('instagram_followers', { ascending: false })

  if (filters?.featured) {
    query = query.eq('is_featured', true)
  }

  if (filters?.category && filters.category !== 'All') {
    query = query.or(`category.eq.${filters.category},tags.cs.{${filters.category}}`)
  }

  if (filters?.search) {
    const s = filters.search
    query = query.or(
      `name.ilike.%${s}%,bio.ilike.%${s}%,category.ilike.%${s}%`
    )
  }

  const { data, error } = await query
  if (error) throw error
  return data as Influencer[]
}

export async function getInfluencerBySlug(slug: string) {
  const { data, error } = await supabase
    .from('influencers')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  if (error) throw error
  return data as Influencer
}

export async function submitCollaborationRequest(req: Omit<CollaborationRequest, 'id' | 'status' | 'created_at'>) {
  const { error } = await supabase
    .from('collaboration_requests')
    .insert([req])
  if (error) throw error
}

export async function getAllInfluencersAdmin() {
  const admin = getAdminClient()
  const { data, error } = await admin
    .from('influencers')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Influencer[]
}

export async function upsertInfluencer(inf: Partial<Influencer>) {
  const admin = getAdminClient()
  const { data, error } = await admin
    .from('influencers')
    .upsert([inf])
    .select()
  if (error) throw error
  return data
}

export async function deleteInfluencer(id: string) {
  const admin = getAdminClient()
  const { error } = await admin
    .from('influencers')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export async function toggleFeatured(id: string, featured: boolean) {
  const admin = getAdminClient()
  const { error } = await admin
    .from('influencers')
    .update({ is_featured: featured })
    .eq('id', id)
  if (error) throw error
}
