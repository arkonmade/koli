'use client'
// src/components/HomeClient.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Influencer } from '@/lib/supabase'
import Nav from './Nav'
import InfluencerCard from './InfluencerCard'
import Footer from './Footer'
import styles from './home.module.css'

const CATEGORY_PILLS = ['Fashion', 'Food', 'Lifestyle', 'Comedy', 'Tech', 'Fitness', 'Beauty', 'Travel']

export default function HomeClient({ featured }: { featured: Influencer[] }) {
  const router = useRouter()
  const [query, setQuery] = useState('')

  const search = (q?: string, cat?: string) => {
    const params = new URLSearchParams()
    if (q ?? query) params.set('q', q ?? query)
    if (cat) params.set('category', cat)
    router.push(`/browse?${params.toString()}`)
  }

  return (
    <>
      <Nav />
      <main>
        {/* HERO */}
        <section className={styles.hero}>
          <div className={styles.heroBg} />
          <div className={styles.kicker}>
            <span className={styles.kickerDot} />
            Rwanda's Influencer Network
          </div>

          <h1 className={styles.headline}>
            Find creators that<br />
            <span className={styles.accent}>move Rwanda</span>
          </h1>

          <p className={styles.sub}>
            Discover and connect with top influencers in Rwanda — instantly, directly, no middlemen.
          </p>

          <div className={styles.searchBar}>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search: fashion, food, tech, comedy…"
              onKeyDown={e => e.key === 'Enter' && search()}
              className={styles.searchInput}
            />
            <button className={styles.searchBtn} onClick={() => search()}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              Search
            </button>
          </div>

          <div className={styles.categories}>
            {CATEGORY_PILLS.map(cat => (
              <button key={cat} className={styles.pill} onClick={() => search('', cat)}>
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* FEATURED */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Featured Creators</h2>
            <button className={styles.seeAll} onClick={() => router.push('/browse')}>
              See all →
            </button>
          </div>
          <div className={styles.grid}>
            {featured.map(inf => (
              <InfluencerCard key={inf.id} influencer={inf} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
