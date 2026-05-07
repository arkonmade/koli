// src/types/index.ts

export type UserRole = 'user' | 'admin'

export type Profile = {
  id: string
  email: string
  full_name: string
  avatar_url: string | null
  role: UserRole
  created_at: string
}

export type SocialAccount = {
  id: string
  influencer_id: string
  platform: string
  handle: string
  followers: number
  sort_order: number
}

export type InfluencerLink = {
  id: string
  influencer_id: string
  link_type: string
  url: string
  label: string
  sort_order: number
}

export type InfluencerImage = {
  id: string
  influencer_id: string
  url: string
  label: string
  sort_order: number
}

export type Influencer = {
  id: string
  name: string
  slug: string
  bio: string
  category: string
  location: string
  phone: string
  email: string
  avatar: string
  color: string
  tags: string[]
  content_types: string[]
  rate_range: string
  is_featured: boolean
  is_active: boolean
  created_at: string

  // ✅ ADD THESE (this is what fixes EVERYTHING)
  instagram?: string
  instagram_followers?: number
  tiktok?: string
  tiktok_followers?: number

  // optional relations (keep if you use them)
  socials?: SocialAccount[]
  links?: InfluencerLink[]
  images?: InfluencerImage[]
}

export type CollaborationRequest = {
  id: string
  influencer_id: string
  user_id: string | null
  brand_name: string
  contact_name: string
  contact_email: string
  message: string
  status: 'pending' | 'seen' | 'accepted' | 'declined'
  created_at: string
  influencer?: { name: string; slug: string; category: string }
}

export type ContactMessage = {
  id: string
  user_id: string | null
  sender_name: string
  sender_email: string
  sender_phone: string
  preferred_contact: 'email' | 'phone' | 'whatsapp' | 'social'
  social_handle: string
  subject: string
  message: string
  type: 'general' | 'problem' | 'advice' | 'assistance' | 'request' | 'partnership'
  status: 'unread' | 'read' | 'replied' | 'closed'
  created_at: string
  profile?: { email: string; full_name: string }
}
