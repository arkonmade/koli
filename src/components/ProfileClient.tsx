'use client'
// src/components/ProfileClient.tsx
import { useState } from 'react'
import Link from 'next/link'
import type { Influencer } from '@/lib/supabase'
import Nav from './Nav'
import RequestModal from './RequestModal'

const fmt = (n: number) =>
  n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1000 ? `${Math.round(n / 1000)}k` : `${n}`

const waLink = (phone: string, name: string) =>
  `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${name}, I found you on KOLI and I'm interested in a collaboration!`)}`

export default function ProfileClient({ influencer: inf }: { influencer: Influencer }) {
  const [showModal, setShowModal] = useState(false)
  const s = (css: React.CSSProperties) => css

  return (
    <>
      <Nav />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 20px 80px' }}>
        <Link href="/browse" style={{
          display: 'flex', alignItems: 'center', gap: 8, color: 'var(--gray)',
          fontSize: 14, textDecoration: 'none', marginBottom: 24, transition: 'color 0.15s',
        }}>
          ← Back to search
        </Link>

        {/* HERO CARD */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)', padding: 32, marginBottom: 20,
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Glow */}
          <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: `radial-gradient(ellipse, ${inf.color} 0%, transparent 70%)`, opacity: 0.08, pointerEvents: 'none' }} />

          {/* Top */}
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: inf.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: '#000', flexShrink: 0 }}>
              {inf.avatar}
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 5vw, 32px)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 4 }}>{inf.name}</h1>
              <div style={{ color: 'var(--gray)', fontSize: 14, marginBottom: 12 }}>{inf.category} · {inf.location}</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {inf.tags.map(t => (
                  <span key={t} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--gray)', fontSize: 12, fontWeight: 500, padding: '4px 12px', borderRadius: 100 }}>{t}</span>
                ))}
                {inf.is_featured && (
                  <span style={{ background: 'rgba(182,255,46,0.08)', border: '1px solid rgba(182,255,46,0.25)', color: 'var(--lime)', fontSize: 12, fontWeight: 500, padding: '4px 12px', borderRadius: 100 }}>⭐ Featured</span>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--gray)', marginBottom: 24 }}>{inf.bio}</p>

          {/* Platforms */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
            {[
              { label: 'Instagram', handle: `@${inf.instagram}`, followers: inf.instagram_followers },
              { label: 'TikTok', handle: `@${inf.tiktok}`, followers: inf.tiktok_followers },
            ].map(p => (
              <div key={p.label} style={{
                background: 'var(--surface2)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)', padding: '14px 20px',
                display: 'flex', flexDirection: 'column', gap: 4, minWidth: 160,
              }}>
                <div style={{ fontSize: 11, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 500 }}>{p.label}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>{fmt(p.followers)}</div>
                <div style={{ fontSize: 12, color: 'var(--gray-mid)' }}>{p.handle}</div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a
              href={waLink(inf.phone, inf.name)}
              target="_blank"
              rel="noreferrer"
              style={{
                flex: '1 1 200px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                background: '#25D366', color: '#fff', textDecoration: 'none',
                fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 600,
                padding: '14px 24px', borderRadius: 'var(--radius-md)',
                transition: 'all 0.15s',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              Contact on WhatsApp
            </a>
            <button
              onClick={() => setShowModal(true)}
              style={{
                flex: '1 1 180px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                background: 'var(--surface2)', color: 'var(--white)', border: '1px solid var(--border-strong)',
                fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 500,
                padding: '14px 24px', borderRadius: 'var(--radius-md)',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              ✉ Request Collaboration
            </button>
          </div>
        </div>

        {/* DETAIL CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          {[
            {
              label: 'Content Types',
              content: inf.content_types.length ? (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {inf.content_types.map(c => <span key={c} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--gray)', fontSize: 12, padding: '4px 12px', borderRadius: 100 }}>{c}</span>)}
                </div>
              ) : <span style={{ color: 'var(--gray-mid)', fontSize: 14 }}>—</span>,
            },
            {
              label: 'Estimated Rate',
              content: <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--lime)' }}>{inf.rate_range || 'Contact for rates'}</div>,
            },
            {
              label: 'Total Reach',
              content: (
                <>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800 }}>{fmt(inf.instagram_followers + inf.tiktok_followers)}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray)', marginTop: 4 }}>across all platforms</div>
                </>
              ),
            },
            {
              label: 'Best for',
              content: (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {inf.tags.map(t => <span key={t} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--gray)', fontSize: 12, padding: '4px 12px', borderRadius: 100 }}>{t}</span>)}
                </div>
              ),
            },
          ].map(({ label, content }) => (
            <div key={label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 20 }}>
              <div style={{ fontSize: 11, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 500, marginBottom: 10 }}>{label}</div>
              {content}
            </div>
          ))}
        </div>
      </div>

      {showModal && <RequestModal influencer={inf} onClose={() => setShowModal(false)} />}
    </>
  )
}
