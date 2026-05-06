'use client'
// src/components/AdminForm.tsx
import { useState } from 'react'
import type { Influencer, SocialAccount, InfluencerLink, InfluencerImage } from '@/types'
import { PLATFORMS, SOCIAL_PLATFORMS, getPlatform } from '@/lib/platforms'

const ACCENT = ['#B6FF2E','#FF6B2E','#A78BFA','#38BDF8','#F472B6','#FACC15','#34D399','#FB923C','#E879F9','#F87171','#06B6D4','#84CC16']
const CATS   = ['Fashion','Food','Lifestyle','Comedy','Tech','Fitness','Beauty','Travel','Music','Gaming','Sports','Education']

type FormData = {
  name: string; category: string; location: string; phone: string; email: string
  bio: string; rate_range: string; color: string; is_active: boolean
  socials: Partial<SocialAccount>[]; links: Partial<InfluencerLink>[]; images: Partial<InfluencerImage>[]
}

export default function AdminForm({ initial, onSave, onCancel }: {
  initial?: Influencer | null
  onSave: (data: any) => void
  onCancel: () => void
}) {
  const isEdit = !!initial?.id

  const [f, setF] = useState<FormData>(() => ({
    name:       initial?.name       ?? '',
    category:   initial?.category   ?? 'Fashion',
    location:   initial?.location   ?? 'Kigali',
    phone:      initial?.phone      ?? '',
    email:      initial?.email      ?? '',
    bio:        initial?.bio        ?? '',
    rate_range: initial?.rate_range ?? '',
    color:      initial?.color      ?? '#B6FF2E',
    is_active:  initial?.is_active  ?? true,
    socials:    initial?.socials?.length ? initial.socials.map(s => ({ ...s })) : [{ platform: 'instagram', handle: '', followers: 0 }],
    links:      initial?.links?.length  ? initial.links.map(l => ({ ...l }))   : [],
    images:     initial?.images?.length ? initial.images.map(i => ({ ...i }))  : [],
  }))

  const up = <K extends keyof FormData>(k: K, v: FormData[K]) => setF(p => ({ ...p, [k]: v }))

  // Socials
  const addSocial  = () => up('socials', [...f.socials, { platform: 'tiktok', handle: '', followers: 0 }])
  const rmSocial   = (i: number) => up('socials', f.socials.filter((_, idx) => idx !== i))
  const updSocial  = (i: number, k: string, v: any) => up('socials', f.socials.map((s, idx) => idx === i ? { ...s, [k]: v } : s))

  // Links
  const addLink    = () => up('links', [...f.links, { link_type: 'website', url: '', label: '' }])
  const rmLink     = (i: number) => up('links', f.links.filter((_, idx) => idx !== i))
  const updLink    = (i: number, k: string, v: any) => up('links', f.links.map((l, idx) => idx === i ? { ...l, [k]: v } : l))

  // Images
  const addImage   = () => {
    if (f.images.length >= 5) return
    const url = window.prompt('Paste an image URL (https://...):')
    if (url !== null) up('images', [...f.images, { url: url.trim(), label: '' }])
  }
  const rmImage    = (i: number) => up('images', f.images.filter((_, idx) => idx !== i))

  const handleSave = () => {
    if (!f.name.trim() || !f.phone.trim()) return
    const initials = f.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    onSave({
      ...(initial ?? {}),
      ...f,
      avatar: initials,
      slug: f.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      tags: [f.category],
      content_types: initial?.content_types ?? [],
      is_featured: initial?.is_featured ?? false,
      socials: f.socials.filter(s => s.handle?.trim()),
      links:   f.links.filter(l => l.url?.trim()),
      images:  f.images.filter(img => img.url?.trim()),
    })
  }

  return (
    <div className="form-sheet">
      <div className="form-overlay" onClick={onCancel} />
      <div className="form-panel">
        <div className="drag-handle" />
        <div className="form-title">{isEdit ? 'Edit Creator' : 'Add New Creator'}</div>
        <div className="form-sub">Fill in the creator's details</div>

        {/* Basic */}
        <div className="fsec">
          <label className="fl">Basic Info</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            <input className="fi" placeholder="Full name *" value={f.name} onChange={e => up('name', e.target.value)} />
            <input className="fi" placeholder="WhatsApp number * (+250…)" value={f.phone} onChange={e => up('phone', e.target.value)} />
            <input className="fi" placeholder="Email (optional)" type="email" value={f.email} onChange={e => up('email', e.target.value)} />
            <div className="frow2">
              <select className="fi" value={f.category} onChange={e => up('category', e.target.value)}>
                {CATS.map(c => <option key={c}>{c}</option>)}
              </select>
              <input className="fi" placeholder="Location" value={f.location} onChange={e => up('location', e.target.value)} />
            </div>
            <input className="fi" placeholder="Rate range (e.g. 50–150k RWF)" value={f.rate_range} onChange={e => up('rate_range', e.target.value)} />
            <textarea className="fi" placeholder="Bio…" value={f.bio} onChange={e => up('bio', e.target.value)} />
          </div>
        </div>

        {/* Color */}
        <div className="fsec">
          <label className="fl">Accent Color</label>
          <div className="swatches">
            {ACCENT.map(c => (
              <div key={c} className={`swatch ${f.color === c ? 'on' : ''}`} style={{ background: c }} onClick={() => up('color', c)} />
            ))}
            <input type="color" value={f.color} onChange={e => up('color', e.target.value)} style={{ width: 30, height: 30, border: 'none', background: 'none', cursor: 'pointer', padding: 0, borderRadius: '50%' }} />
          </div>
        </div>

        {/* Images */}
        <div className="fsec">
          <label className="fl">Images (max 5 — first = cover)</label>
          <div className="img-manager">
            {f.images.map((img, i) => (
              <div key={i} className="img-slot">
                {img.url ? <img src={img.url} alt="" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} /> : <span style={{ fontSize: 20, opacity: 0.5 }}>🖼</span>}
                <button className="img-rm" onClick={() => rmImage(i)}>✕</button>
                {i === 0 && <span className="img-badge">COVER</span>}
              </div>
            ))}
            {f.images.length < 5 && (
              <div className="img-slot" onClick={addImage} style={{ cursor: 'pointer' }}>
                <span style={{ fontSize: 20, opacity: 0.5 }}>+</span>
              </div>
            )}
          </div>
          <div style={{ fontSize: 11, color: 'var(--gray)', marginTop: 6 }}>First image = cover. Tap + to add image URL. Max 5.</div>
        </div>

        {/* Social media — UNLIMITED */}
        <div className="fsec">
          <label className="fl">Social Media Accounts ({f.socials.length})</label>
          {f.socials.map((s, i) => {
            const plat = getPlatform(s.platform ?? 'instagram')
            return (
              <div key={i} className="ditem">
                <div className="ditem-top">
                  <select className="d-select" value={s.platform} onChange={e => updSocial(i, 'platform', e.target.value)}>
                    {SOCIAL_PLATFORMS.map(p => <option key={p.id} value={p.id}>{p.icon} {p.label}</option>)}
                  </select>
                  <button className="rm-btn" onClick={() => rmSocial(i)}>✕</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: 6 }}>
                  <input className="d-input" placeholder={plat.ph} value={s.handle ?? ''} onChange={e => updSocial(i, 'handle', e.target.value)} />
                  <input className="d-input" placeholder="Followers" type="number" min="0" value={s.followers ?? ''} onChange={e => updSocial(i, 'followers', parseInt(e.target.value) || 0)} />
                </div>
              </div>
            )
          })}
          <button className="add-item-btn" onClick={addSocial}>+ Add Social Account</button>
        </div>

        {/* Links — UNLIMITED */}
        <div className="fsec">
          <label className="fl">Other Links ({f.links.length})</label>
          {f.links.map((l, i) => {
            const plat = getPlatform(l.link_type ?? 'website')
            return (
              <div key={i} className="ditem">
                <div className="ditem-top">
                  <select className="d-select" value={l.link_type} onChange={e => updLink(i, 'link_type', e.target.value)}>
                    {PLATFORMS.map(p => <option key={p.id} value={p.id}>{p.icon} {p.label}</option>)}
                  </select>
                  <button className="rm-btn" onClick={() => rmLink(i)}>✕</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <input className="d-input" placeholder="URL (https://…)" value={l.url ?? ''} onChange={e => updLink(i, 'url', e.target.value)} />
                  <input className="d-input" placeholder="Label (e.g. My Portfolio)" value={l.label ?? ''} onChange={e => updLink(i, 'label', e.target.value)} />
                </div>
              </div>
            )
          })}
          <button className="add-item-btn" onClick={addLink}>+ Add Link</button>
        </div>

        <div className="form-footer">
          <button className="f-cancel" onClick={onCancel}>Cancel</button>
          <button className="f-save" onClick={handleSave} disabled={!f.name.trim() || !f.phone.trim()}>
            {isEdit ? 'Save Changes' : 'Add Creator'}
          </button>
        </div>
      </div>
    </div>
  )
}
