// src/app/page.tsx
import { getInfluencers } from '@/lib/supabase'
import HomeClient from '@/components/HomeClient'
import Nav from '@/components/Nav'
import MobileShell from '@/components/MobileShell'

export const revalidate = 300

export default async function HomePage() {
  let featured: any[] = []
  try {
    featured = await getInfluencers({ featured: true })
  } catch {
    // DB not connected yet — render empty state gracefully
    featured = []
  }

  return (
    <>
      <Nav />
      <MobileShell>
        <HomeClient featured={featured} />
      </MobileShell>
    </>
  )
}
