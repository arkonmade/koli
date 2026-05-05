'use client'
// src/components/BrowseClient.tsx
import { useState, useMemo } from 'react'
import type { Influencer } from '@/lib/supabase'
import Nav from './Nav'
import InfluencerCard from './InfluencerCard'

const CATEGORIES = ['All', 'Fashion', 'Food', 'Lifestyle', 'Comedy', 'Tech', 'Fitness', 'Beauty', 'Travel']
const PLATFORMS = ['All', 'Instagram', 'TikTok']

export default function BrowseClient({
  initialInfluencers,
  initialQuery,
  initialCategory,
}: {
  initialInfluencers: Influencer[]
  initialQuery: string
  initialCategory: string
}) {
  const [query, setQuery] = useState(initialQuery)
  const [category, setCategory] = useState(initialCategory)
  const [platform, setPlatform] = useState('All')
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const results = useMemo(() => {
    return initialInfluencers.filter(inf => {
      const q = query.toLowerCase()
      const matchQ = !q || inf.name.toLowerCase().includes(q) || inf.bio.toLowerCase().includes(q) || inf.category.toLowerCase().includes(q) || inf.tags.some(t => t.toLowerCase().includes(q))
      const matchCat = category === 'All' || inf.category === category || inf.tags.includes(category)
      const matchPlatform = platform === 'All' || (platform === 'Instagram' && inf.instagram_followers > 0) || (platform === 'TikTok' && inf.tiktok_followers > 0)
      return matchQ && matchCat && matchPlatform
    })
  }, [query, category, platform, initialInfluencers])

  return (
    <>
      <Nav />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 20px' }}>
        {/* Search bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 10,
            background: 'var(--surface2)', border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-md)', padding: '0 14px',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gray)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by name, niche, or keyword…"
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                color: 'var(--white)', fontSize: 15, padding: '12px 0',
                fontFamily: 'var(--font-body)',
              }}
            />
          </div>
        </div>

        {/* Category filters */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--gray)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', marginRight: 4 }}>Category:</span>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} style={{
              background: category === cat ? 'var(--lime)' : 'var(--surface2)',
              border: `1px solid ${category === cat ? 'var(--lime)' : 'var(--border)'}`,
              color: category === cat ? 'var(--black)' : 'var(--gray)',
              fontSize: 13, fontWeight: 500, padding: '7px 14px',
              borderRadius: 100, cursor: 'pointer', fontFamily: 'var(--font-body)',
              transition: 'all 0.12s',
            }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Platform filters */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--gray)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', marginRight: 4 }}>Platform:</span>
          {PLATFORMS.map(p => (
            <button key={p} onClick={() => setPlatform(p)} style={{
              background: platform === p ? 'var(--lime)' : 'var(--surface2)',
              border: `1px solid ${platform === p ? 'var(--lime)' : 'var(--border)'}`,
              color: platform === p ? 'var(--black)' : 'var(--gray)',
              fontSize: 13, fontWeight: 500, padding: '7px 14px',
              borderRadius: 100, cursor: 'pointer', fontFamily: 'var(--font-body)',
              transition: 'all 0.12s',
            }}>
              {p}
            </button>
          ))}
        </div>

        {/* Results header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <span style={{ fontSize: 13, color: 'var(--gray)' }}>
            {results.length} creator{results.length !== 1 ? 's' : ''} found
          </span>
          <div style={{ display: 'flex', gap: 4 }}>
            {(['grid', 'list'] as const).map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                background: view === v ? 'var(--surface2)' : 'none',
                border: `1px solid ${view === v ? 'rgba(182,255,46,0.3)' : 'var(--border)'}`,
                color: view === v ? 'var(--lime)' : 'var(--gray)',
                padding: '7px 10px', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                display: 'flex', alignItems: 'center',
              }}>
                {v === 'grid' ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--gray)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, marginBottom: 8, color: 'var(--white)' }}>No creators found</div>
            <p>Try a different search or clear the filters above.</p>
          </div>
        ) : view === 'grid' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {results.map(inf => <InfluencerCard key={inf.id} influencer={inf} view="grid" />)}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {results.map(inf => <InfluencerCard key={inf.id} influencer={inf} view="list" />)}
          </div>
        )}
      </div>
    </>
  )
}
