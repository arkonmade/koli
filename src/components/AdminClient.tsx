'use client'
// src/components/AdminClient.tsx
import { useState } from 'react'
import type { Influencer } from '@/lib/supabase'
import Nav from './Nav'

const fmt = (n: number) =>
  n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1000 ? `${Math.round(n / 1000)}k` : `${n}`

const ACCENT_COLORS = ['#B6FF2E', '#FF6B2E', '#A78BFA', '#38BDF8', '#F472B6', '#FACC15', '#34D399', '#FB923C']
const CATEGORIES = ['Fashion', 'Food', 'Lifestyle', 'Comedy', 'Tech', 'Fitness', 'Beauty', 'Travel']

const EMPTY_FORM = {
  name: '', category: 'Fashion', location: 'Kigali',
  phone: '', instagram: '', instagram_followers: '',
  tiktok: '', tiktok_followers: '', bio: '', rate_range: '',
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 999,
      background: 'var(--surface)', border: '1px solid var(--border-strong)',
      borderRadius: 'var(--radius-md)', padding: '14px 20px',
      display: 'flex', alignItems: 'center', gap: 12,
      fontSize: 14, fontWeight: 500, boxShadow: 'var(--shadow)',
    }}>
      <span style={{ color: 'var(--lime)' }}>✓</span> {message}
    </div>
  )
}

export default function AdminClient({ initialInfluencers }: { initialInfluencers: Influencer[] }) {
  const [influencers, setInfluencers] = useState<Influencer[]>(initialInfluencers)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [toast, setToast] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3200)
  }

  const callAdmin = async (action: string, data: object) => {
    const res = await fetch('/api/admin/influencers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...data }),
    })
    if (!res.ok) throw new Error('Request failed')
    return res.json()
  }

  const openAdd = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setShowForm(true)
  }

  const openEdit = (inf: Influencer) => {
    setForm({
      name: inf.name,
      category: inf.category,
      location: inf.location,
      phone: inf.phone,
      instagram: inf.instagram,
      instagram_followers: String(inf.instagram_followers),
      tiktok: inf.tiktok,
      tiktok_followers: String(inf.tiktok_followers),
      bio: inf.bio,
      rate_range: inf.rate_range,
    })
    setEditingId(inf.id)
    setShowForm(true)
  }

  const saveInfluencer = async () => {
    if (!form.name || !form.phone) return
    setLoading(true)
    try {
      const payload: Partial<Influencer> = {
        ...(editingId ? { id: editingId } : {}),
        name: form.name,
        slug: form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        category: form.category,
        location: form.location,
        phone: form.phone,
        instagram: form.instagram,
        instagram_followers: parseInt(form.instagram_followers) || 0,
        tiktok: form.tiktok,
        tiktok_followers: parseInt(form.tiktok_followers) || 0,
        bio: form.bio,
        rate_range: form.rate_range,
        avatar: form.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase(),
        color: ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)],
        tags: [form.category],
        content_types: [],
        is_active: true,
        is_featured: false,
      }
      await callAdmin('upsert', payload)

      if (editingId) {
        setInfluencers(prev => prev.map(i => i.id === editingId ? { ...i, ...payload } as Influencer : i))
        showToast('Creator updated ✓')
      } else {
        // Refresh list from server for new slug/id
        const res = await fetch('/api/admin/influencers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'list' }),
        })
        // Optimistic update with temp id
        setInfluencers(prev => [{ ...payload, id: `tmp-${Date.now()}`, created_at: new Date().toISOString() } as Influencer, ...prev])
        showToast('Creator added to KOLI 🎉')
      }
      setShowForm(false)
      setEditingId(null)
    } catch {
      showToast('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const toggleFeatured = async (inf: Influencer) => {
    const newVal = !inf.is_featured
    setInfluencers(prev => prev.map(i => i.id === inf.id ? { ...i, is_featured: newVal } : i))
    try {
      await callAdmin('feature', { id: inf.id, featured: newVal })
      showToast(newVal ? 'Creator featured ⭐' : 'Removed from featured')
    } catch {
      setInfluencers(prev => prev.map(i => i.id === inf.id ? { ...i, is_featured: inf.is_featured } : i))
      showToast('Failed to update')
    }
  }

  const deleteInfluencer = async (id: string) => {
    setInfluencers(prev => prev.filter(i => i.id !== id))
    setDeleteConfirm(null)
    try {
      await callAdmin('delete', { id })
      showToast('Creator removed')
    } catch {
      showToast('Failed to delete')
    }
  }

  const stats = {
    total: influencers.length,
    featured: influencers.filter(i => i.is_featured).length,
    reach: influencers.reduce((a, i) => a + i.instagram_followers + i.tiktok_followers, 0),
    categories: [...new Set(influencers.map(i => i.category))].length,
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'var(--surface2)', border: '1px solid var(--border-strong)',
    borderRadius: 'var(--radius-sm)', padding: '10px 14px',
    color: 'var(--white)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none',
  }

  return (
    <>
      <Nav />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 20px 80px' }}>

        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Admin Panel</h1>
            <div style={{ fontSize: 14, color: 'var(--gray)' }}>Manage KOLI's influencer database</div>
          </div>
          <button
            onClick={openAdd}
            style={{
              background: 'var(--lime)', border: 'none', color: 'var(--black)',
              fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600,
              padding: '10px 20px', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            + Add Creator
          </button>
        </div>

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 28 }}>
          {[
            { label: 'Total Creators', value: stats.total, accent: true },
            { label: 'Featured', value: stats.featured, accent: false },
            { label: 'Total Reach', value: fmt(stats.reach), accent: false },
            { label: 'Categories', value: stats.categories, accent: false },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '18px 20px' }}>
              <div style={{ fontSize: 11, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 500, marginBottom: 8 }}>{s.label}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: s.accent ? 'var(--lime)' : 'var(--white)' }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* ADD / EDIT FORM */}
        {showForm && (
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-lg)', padding: 24, marginBottom: 24,
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 20 }}>
              {editingId ? 'Edit Creator' : 'Add New Creator'}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 14 }}>
              {[
                { key: 'name', placeholder: 'Full name *' },
                { key: 'phone', placeholder: 'WhatsApp (+250…) *' },
                { key: 'instagram', placeholder: 'Instagram handle' },
                { key: 'instagram_followers', placeholder: 'Instagram followers' },
                { key: 'tiktok', placeholder: 'TikTok handle' },
                { key: 'tiktok_followers', placeholder: 'TikTok followers' },
                { key: 'location', placeholder: 'Location' },
                { key: 'rate_range', placeholder: 'Rate range (e.g. 50–150k RWF)' },
              ].map(f => (
                <input
                  key={f.key}
                  placeholder={f.placeholder}
                  value={(form as any)[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  style={inputStyle}
                />
              ))}
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                style={inputStyle}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <textarea
              placeholder="Bio / description…"
              value={form.bio}
              onChange={e => setForm({ ...form, bio: e.target.value })}
              style={{ ...inputStyle, resize: 'vertical', minHeight: 80, marginBottom: 16 }}
            />

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { setShowForm(false); setEditingId(null) }} style={{ flex: '0 0 100px', background: 'none', border: '1px solid var(--border-strong)', color: 'var(--gray)', fontFamily: 'var(--font-body)', fontSize: 14, padding: '10px', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={saveInfluencer} disabled={loading} style={{ flex: 1, background: 'var(--lime)', border: 'none', color: 'var(--black)', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, padding: '10px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Saving…' : editingId ? '✓ Save Changes' : '✓ Add Creator'}
              </button>
            </div>
          </div>
        )}

        {/* TABLE */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 140px', padding: '14px 20px', borderBottom: '1px solid var(--border)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray)' }}>
            <span>Creator</span>
            <span>Category</span>
            <span>Instagram</span>
            <span>TikTok</span>
            <span>Actions</span>
          </div>

          {influencers.length === 0 && (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--gray)' }}>
              No creators yet. Add your first one above.
            </div>
          )}

          {influencers.map(inf => (
            <div
              key={inf.id}
              style={{
                display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 140px',
                padding: '14px 20px', borderBottom: '1px solid var(--border)',
                alignItems: 'center', transition: 'background 0.12s',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--surface2)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
            >
              {/* Creator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: inf.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12, color: '#000', flexShrink: 0 }}>
                  {inf.avatar}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{inf.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray)' }}>{inf.location}</div>
                </div>
                {inf.is_featured && (
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--lime)', flexShrink: 0 }} title="Featured" />
                )}
              </div>

              {/* Category */}
              <span style={{ fontSize: 14, color: 'var(--gray)' }}>{inf.category}</span>

              {/* Instagram */}
              <span style={{ fontSize: 14, color: 'var(--gray)' }}>{fmt(inf.instagram_followers)}</span>

              {/* TikTok */}
              <span style={{ fontSize: 14, color: 'var(--gray)' }}>{fmt(inf.tiktok_followers)}</span>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 6 }}>
                {/* Feature toggle */}
                <button
                  onClick={() => toggleFeatured(inf)}
                  title={inf.is_featured ? 'Unfeature' : 'Feature'}
                  style={{
                    background: 'none',
                    border: `1px solid ${inf.is_featured ? 'rgba(182,255,46,0.3)' : 'var(--border)'}`,
                    color: inf.is_featured ? 'var(--lime)' : 'var(--gray)',
                    padding: '5px 8px', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                    fontSize: 13, transition: 'all 0.12s',
                  }}
                >
                  ★
                </button>

                {/* Edit */}
                <button
                  onClick={() => openEdit(inf)}
                  title="Edit"
                  style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--gray)', padding: '5px 8px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 12, transition: 'all 0.12s' }}
                >
                  Edit
                </button>

                {/* Delete */}
                {deleteConfirm === inf.id ? (
                  <button
                    onClick={() => deleteInfluencer(inf.id)}
                    style={{ background: 'none', border: '1px solid #F87171', color: '#F87171', padding: '5px 8px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}
                  >
                    Sure?
                  </button>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(inf.id)}
                    title="Delete"
                    style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--gray)', padding: '5px 8px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 12, transition: 'all 0.12s' }}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* REQUESTS SECTION PLACEHOLDER */}
        <div style={{ marginTop: 32, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Collaboration Requests</div>
          <div style={{ fontSize: 14, color: 'var(--gray)' }}>
            Incoming brand requests appear here. Connect Supabase to start tracking them in real-time.
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
            <div style={{ background: 'var(--surface2)', borderRadius: 'var(--radius-md)', padding: '12px 20px', fontSize: 13, color: 'var(--gray)' }}>0 pending</div>
            <div style={{ background: 'var(--surface2)', borderRadius: 'var(--radius-md)', padding: '12px 20px', fontSize: 13, color: 'var(--gray)' }}>0 this week</div>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </>
  )
}
