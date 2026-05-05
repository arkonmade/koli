// src/app/browse/page.tsx
import { getInfluencers } from '@/lib/supabase'
import BrowseClient from '@/components/BrowseClient'

export const revalidate = 60

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; platform?: string }
}) {
  const influencers = await getInfluencers({
    search: searchParams.q,
    category: searchParams.category,
  })

  return (
    <BrowseClient
      initialInfluencers={influencers}
      initialQuery={searchParams.q ?? ''}
      initialCategory={searchParams.category ?? 'All'}
    />
  )
}
