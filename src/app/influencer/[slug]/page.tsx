// src/app/influencer/[slug]/page.tsx
import { getInfluencerBySlug, getInfluencers } from '@/lib/supabase'
import ProfileClient from '@/components/ProfileClient'
import Nav from '@/components/Nav'
import MobileShell from '@/components/MobileShell'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const revalidate = 300

// 🔹 Pre-generate pages
export async function generateStaticParams() {
  try {
    const infs = await getInfluencers()
    return infs.map((i) => ({ slug: i.slug }))
  } catch {
    return []
  }
}

// 🔹 SEO metadata
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  try {
    const inf = await getInfluencerBySlug(params.slug)

    const title = `${inf.name} — ${inf.category} Influencer in Kigali, Rwanda | KOLI`

    const description =
      inf.bio ||
      `Work with ${inf.name}, a top ${inf.category.toLowerCase()} influencer in Rwanda. Discover audience, content style, and contact directly on KOLI.`

    return {
      title,
      description,

      keywords: [
        `${inf.name}`,
        `${inf.category} influencer Rwanda`,
        `Kigali influencers`,
        `Rwanda content creators`,
      ],

      alternates: {
        canonical: `https://koli.rw/influencer/${inf.slug}`,
      },

      openGraph: {
        title,
        description,
        url: `https://koli.rw/influencer/${inf.slug}`,
        siteName: 'KOLI',
        locale: 'en_RW',
        type: 'profile',
        images: inf.images?.length
          ? [
              {
                url: inf.images[0].url,
                width: 1200,
                height: 630,
              },
            ]
          : [],
      },

      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
    }
  } catch {
    return {
      title: 'Creator | KOLI',
    }
  }
}

// 🔹 Page
export default async function ProfilePage({
  params,
}: {
  params: { slug: string }
}) {
  let inf: any

  try {
    inf = await getInfluencerBySlug(params.slug)
  } catch {
    notFound()
  }

  return (
    <>
      {/* 🔥 PERSON SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: inf.name,
            description: inf.bio,
            jobTitle: `${inf.category} Influencer`,
            address: {
              "@type": "Place",
              addressLocality: inf.location || "Kigali",
              addressCountry: "Rwanda",
            },
            url: `https://koli.rw/influencer/${inf.slug}`,
            sameAs: (inf.socials || []).map((s: any) => {
              if (s.platform === 'instagram') return `https://instagram.com/${s.handle}`
              if (s.platform === 'tiktok') return `https://tiktok.com/@${s.handle}`
              if (s.platform === 'twitter') return `https://twitter.com/${s.handle}`
              return null
            }).filter(Boolean),
          }),
        }}
      />

      <Nav />
      <MobileShell>
        <ProfileClient inf={inf} />
      </MobileShell>
    </>
  )
}