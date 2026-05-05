'use client'
// src/components/InfluencerCard.tsx
import Link from 'next/link'
import type { Influencer } from '@/lib/supabase'

const fmt = (n: number) =>
  n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1000 ? `${Math.round(n / 1000)}k` : `${n}`

export default function InfluencerCard({
  influencer: inf,
  view = 'grid',
}: {
  influencer: Influencer
  view?: 'grid' | 'list'
}) {
  const href = `/influencer/${inf.slug}`
  const totalReach = inf.instagram_followers + inf.tiktok_followers

  if (view === 'list') return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)', padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: 16,
        transition: 'all 0.15s', cursor: 'pointer',
      }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)'; (e.currentTarget as HTMLElement).style.background = 'var(--surface2)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.background = 'var(--surface)'; }}
      >
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: inf.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: '#000', flexShrink: 0 }}>{inf.avatar}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{inf.name}</div>
          <div style={{ fontSize: 13, color: 'var(--gray)' }}>{inf.category} · {inf.location}</div>
        </div>
        {inf.is_featured && <span style={{ background: 'rgba(182,255,46,0.1)', color: 'var(--lime)', border: '1px solid rgba(182,255,46,0.25)', fontSize: 10, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 100 }}>Featured</span>}
        <div style={{ display: 'flex', gap: 16, color: 'var(--gray)', fontSize: 13 }}>
          <span>📸 {fmt(inf.instagram_followers)}</span>
          <span>📱 {fmt(inf.tiktok_followers)}</span>
        </div>
        <span style={{ color: 'var(--lime)', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap' }}>View Profile →</span>
      </div>
    </Link>
  )

  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div
        style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: 20, cursor: 'pointer',
          transition: 'all 0.2s', position: 'relative', overflow: 'hidden',
          height: '100%', display: 'flex', flexDirection: 'column',
        }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border-strong)'; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = 'var(--shadow)'; }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border)'; el.style.transform = 'none'; el.style.boxShadow = 'none'; }}
      >
        {/* Accent top border */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: inf.color, opacity: 0.6 }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: inf.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: '#000', flexShrink: 0 }}>{inf.avatar}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 2 }}>{inf.name}</div>
            <div style={{ fontSize: 13, color: 'var(--gray)' }}>{inf.category} · {inf.location}</div>
          </div>
          {inf.is_featured && <span style={{ background: 'rgba(182,255,46,0.1)', color: 'var(--lime)', border: '1px solid rgba(182,255,46,0.25)', fontSize: 10, fontWeight: 600, padding: '3px 6px', borderRadius: 100 }}>⭐</span>}
        </div>

        <p style={{ fontSize: 13, color: 'var(--gray)', lineHeight: 1.5, marginBottom: 16, flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {inf.bio}
        </p>

        <div style={{ display: 'flex', gap: 16, marginBottom: 16, fontSize: 13, fontWeight: 500 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: 'var(--gray)', fontSize: 12 }}>IG</span>
            {fmt(inf.instagram_followers)}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: 'var(--gray)', fontSize: 12 }}>TT</span>
            {fmt(inf.tiktok_followers)}
          </span>
        </div>

        <div style={{
          width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)',
          color: 'var(--white)', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500,
          padding: 10, borderRadius: 'var(--radius-sm)', textAlign: 'center',
        }}>
          View Profile →
        </div>
      </div>
    </Link>
  )
}
