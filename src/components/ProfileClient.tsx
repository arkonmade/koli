'use client'
// src/components/ProfileClient.tsx
import { useState } from 'react'
import Link from 'next/link'
import type { Influencer } from '@/types'
import { useAuth } from '@/hooks/useAuth'
import { getPlatform, buildUrl, fmtFollowers, totalReach } from '@/lib/platforms'
import RequestModal from './RequestModal'

const BackIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
const WAIcon   = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
const ExtIcon  = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
const LockIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>

export default function ProfileClient({ inf }: { inf: Influencer }) {
  const { user } = useAuth()
  const [lightbox, setLightbox] = useState<string | null>(null)
  const [showReq, setShowReq]   = useState(false)

  const reach     = totalReach(inf.socials ?? [])
  const coverImg  = (inf.images ?? [])[0]?.url ?? null
  const gallery   = (inf.images ?? []).slice(1)
  const waLink    = `https://wa.me/${inf.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${inf.name}, I found you on KOLI and I'm interested in a collaboration!`)}`

  return (
    <div className="profile-inner">
      {/* Cover */}
      <div className="profile-cover">
        {coverImg
          ? <img className="cover-img" src={coverImg} alt={`${inf.name} cover`} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
          : <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, ${inf.color}44 0%, ${inf.color}99 50%, var(--s2) 100%)` }} />
        }
        <div className="cover-grad" />
        <Link href="/browse" className="back-btn"><BackIcon /> Back</Link>
      </div>

      <div className="prof-body" style={{ padding: '0 20px 32px', marginTop: -48, position: 'relative' }}>
        {/* Avatar + CTA */}
        <div className="prof-av-row">
          <div className="prof-av" style={{ background: inf.color, width: 80, height: 80, fontSize: 24 }}>{inf.avatar}</div>
          {user ? (
            <a className="wa-btn" href={waLink} target="_blank" rel="noreferrer">
              <WAIcon /> WhatsApp
            </a>
          ) : (
            <Link href="/auth/login" className="lock-btn">
              <LockIcon /> Login to Contact
            </Link>
          )}
        </div>

        <h1 className="prof-name" style={{ fontSize: 'clamp(22px, 6vw, 30px)' }}>{inf.name}</h1>
        <div className="prof-sub">{inf.category} · 📍 {inf.location}</div>
        <div className="prof-tags">
          {(inf.tags ?? []).map(t => <span key={t} className="ptag">{t}</span>)}
          {inf.is_featured && <span className="ptag" style={{ color: 'var(--lime)', borderColor: 'rgba(182,255,46,0.3)' }}>⭐ Featured</span>}
        </div>
        <p className="prof-bio">{inf.bio}</p>

        {/* Social accounts */}
        {(inf.socials ?? []).length > 0 && (
          <>
            <div className="sub-label">Platforms</div>
            {inf.socials!.map(s => {
              const p = getPlatform(s.platform)
              return (
                <a key={s.id} className="soc-row" href={buildUrl(s.platform, s.handle)} target="_blank" rel="noreferrer">
                  <div style={{ width: 34, height: 34, borderRadius: 'var(--r-xs)', background: p.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>
                    {p.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 1 }}>{p.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--gray)' }}>@{s.handle}</div>
                  </div>
                  {s.followers > 0 && (
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
                      {fmtFollowers(s.followers)}
                    </div>
                  )}
                  <ExtIcon />
                </a>
              )
            })}
          </>
        )}

        {/* Other links */}
        {(inf.links ?? []).length > 0 && (
          <>
            <div className="sub-label" style={{ marginTop: 16 }}>Links</div>
            {inf.links!.map(l => {
              const p = getPlatform(l.link_type)
              return (
                <a key={l.id} className="link-row" href={l.url} target="_blank" rel="noreferrer">
                  <span style={{ fontSize: 18 }}>{p.icon}</span>
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{l.label || p.label}</span>
                  <ExtIcon />
                </a>
              )
            })}
          </>
        )}

        {/* Gallery */}
        {gallery.length > 0 && (
          <>
            <div className="sub-label" style={{ marginTop: 16 }}>Gallery</div>
            <div className="gallery">
              {gallery.map(img => (
                <div key={img.id} className="gallery-item" onClick={() => img.url && setLightbox(img.url)}>
                  {img.url
                    ? <img src={img.url} alt="" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    : <span style={{ fontSize: 22, opacity: 0.4 }}>🖼</span>
                  }
                </div>
              ))}
            </div>
          </>
        )}

        {/* Stats — gated */}
        {user ? (
          <div className="det-grid">
            <div className="det-card">
              <div className="det-label">Total Reach</div>
              <div className="det-val" style={{ color: 'var(--lime)' }}>{fmtFollowers(reach)}</div>
              <div style={{ fontSize: 11, color: 'var(--gray)', marginTop: 4 }}>across {(inf.socials ?? []).length} platforms</div>
            </div>
            <div className="det-card">
              <div className="det-label">Rate</div>
              <div className="det-val" style={{ fontSize: 15, lineHeight: 1.4 }}>{inf.rate_range || '—'}</div>
            </div>
            {(inf.content_types ?? []).length > 0 && (
              <div className="det-card" style={{ gridColumn: '1 / -1' }}>
                <div className="det-label">Content Types</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                  {inf.content_types!.map(c => <span key={c} className="chip">{c}</span>)}
                </div>
              </div>
            )}
            {inf.phone && (
              <div className="det-card" style={{ gridColumn: '1 / -1' }}>
                <div className="det-label">Contact Info</div>
                <div style={{ fontSize: 14, fontWeight: 500, marginTop: 4 }}>📱 {inf.phone}</div>
                {inf.email && <div style={{ fontSize: 14, fontWeight: 500, marginTop: 4 }}>✉️ {inf.email}</div>}
              </div>
            )}
          </div>
        ) : (
          <div className="gated-box">
            <LockIcon />
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, margin: '10px 0 6px' }}>
              Sign in to see statistics & contact info
            </div>
            <p style={{ fontSize: 13, color: 'var(--gray)', lineHeight: 1.6, marginBottom: 16 }}>
              Phone number, rate, total reach, and analytics are only visible to signed-in users.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <Link href="/auth/login" style={{ flex: 1, background: 'var(--lime)', color: 'var(--black)', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700, padding: '11px 16px', borderRadius: 'var(--r-sm)', textAlign: 'center', textDecoration: 'none' }}>
                Login
              </Link>
              <Link href="/auth/signup" style={{ flex: 1, background: 'none', border: '1px solid var(--border-hi)', color: 'var(--white)', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, padding: '11px 16px', borderRadius: 'var(--r-sm)', textAlign: 'center', textDecoration: 'none' }}>
                Sign Up
              </Link>
            </div>
          </div>
        )}

        {/* Collab request */}
        {user && (
          <button
            onClick={() => setShowReq(true)}
            style={{ width: '100%', background: 'var(--s2)', border: '1px solid var(--border-hi)', color: 'var(--white)', fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600, padding: 13, borderRadius: 'var(--r-md)', cursor: 'pointer', marginTop: 4 }}
          >
            ✉ Request Collaboration
          </button>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="" style={{ maxWidth: '95%', maxHeight: '90svh', borderRadius: 'var(--r-md)', objectFit: 'contain' }} />
        </div>
      )}

      {showReq && user && <RequestModal inf={inf} userId={user.id} onClose={() => setShowReq(false)} />}
    </div>
  )
}
