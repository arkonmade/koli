// src/app/influencer/[slug]/page.tsx
import { getInfluencerBySlug, getInfluencers } from '@/lib/supabase'
import ProfileClient from '@/components/ProfileClient'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const revalidate = 300

// Pre-generate all slugs at build time (ISR fallback for new ones)
export async function generateStaticParams() {
  const influencers = await getInfluencers()
  return influencers.map(i => ({ slug: i.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const inf = await getInfluencerBySlug(params.slug)
    return {
      title: `${inf.name} — ${inf.category} Creator | KOLI`,
      description: inf.bio,
      openGraph: {
        title: `${inf.name} on KOLI`,
        description: inf.bio,
      },
    }
  } catch {
    return { title: 'Creator | KOLI' }
  }
}

export default async function ProfilePage({ params }: { params: { slug: string } }) {
  try {
    const influencer = await getInfluencerBySlug(params.slug)
    return <ProfileClient influencer={influencer} />
  } catch {
    notFound()
  }
}
