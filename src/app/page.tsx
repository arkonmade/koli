// src/app/page.tsx
import { getInfluencers } from '@/lib/supabase'
import HomeClient from '@/components/HomeClient'

// Revalidate every 5 minutes
export const revalidate = 300

export default async function HomePage() {
  const featured = await getInfluencers({ featured: true })
  return <HomeClient featured={featured} />
}
