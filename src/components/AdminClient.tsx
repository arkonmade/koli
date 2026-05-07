'use client'
import { useState } from 'react'
import type { Influencer } from '@/types'
import Nav from './Nav'

const fmt = (n: number = 0) =>
  n >= 1e6 ? `${(n / 1e6).toFixed(1)}M`
  : n >= 1000 ? `${Math.round(n / 1000)}k`
  : `${n}`

const ACCENT_COLORS = ['#B6FF2E','#FF6B2E','#A78BFA','#38BDF8','#F472B6','#FACC15','#34D399','#FB923C']
const CATEGORIES = ['Fashion','Food','Lifestyle','Comedy','Tech','Fitness','Beauty','Travel']

const EMPTY_FORM = {
  name: '',
  category: 'Fashion',
  location: 'Kigali',
  phone: '',
  instagram: '',
  instagram_followers: '',
  tiktok: '',
  tiktok_followers: '',
  bio: '',
  rate_range: '',
}

function Toast({ message }: { message: string }) {
  return (
    <div style={{
      position:'fixed', bottom:24, right:24, zIndex:999,
      background:'var(--surface)', border:'1px solid var(--border-strong)',
      borderRadius:'var(--radius-md)', padding:'14px 20px',
      display:'flex', alignItems:'center', gap:12,
      fontSize:14, fontWeight:500
    }}>
      <span style={{ color:'var(--lime)' }}>✓</span> {message}
    </div>
  )
}

export default function AdminClient({ initialInfluencers }: { initialInfluencers: Influencer[] }) {
  const [influencers, setInfluencers] = useState(initialInfluencers)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [toast, setToast] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const callAdmin = async (action: string, data: any) => {
    const res = await fetch('/api/admin/influencers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...data }),
    })
    if (!res.ok) throw new Error()
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
      instagram: inf.instagram ?? '',
      instagram_followers: String(inf.instagram_followers ?? 0),
      tiktok: inf.tiktok ?? '',
      tiktok_followers: String(inf.tiktok_followers ?? 0),
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
        ...(editingId && { id: editingId }),
        name: form.name,
        slug: form.name.toLowerCase().replace(/\s+/g, '-'),
        category: form.category,
        location: form.location,
        phone: form.phone,
        instagram: form.instagram,
        instagram_followers: Number(form.instagram_followers) || 0,
        tiktok: form.tiktok,
        tiktok_followers: Number(form.tiktok_followers) || 0,
        bio: form.bio,
        rate_range: form.rate_range,
        avatar: form.name.slice(0,2).toUpperCase(),
        color: ACCENT_COLORS[Math.floor(Math.random()*ACCENT_COLORS.length)],
        tags: [form.category],
        content_types: [],
        is_active: true,
        is_featured: false,
      }

      await callAdmin('upsert', payload)

      setInfluencers(prev =>
        editingId
          ? prev.map(i => i.id === editingId ? { ...i, ...payload } as Influencer : i)
          : [{ ...payload, id:`tmp-${Date.now()}`, created_at:new Date().toISOString() } as Influencer, ...prev]
      )

      showToast(editingId ? 'Updated' : 'Added')
      setShowForm(false)
      setEditingId(null)
    } catch {
      showToast('Error')
    } finally {
      setLoading(false)
    }
  }

  const stats = {
    total: influencers.length,
    featured: influencers.filter(i => i.is_featured).length,
    reach: influencers.reduce((a,i) => a + (i.instagram_followers ?? 0) + (i.tiktok_followers ?? 0), 0),
  }

  return (
    <>
      <Nav />

      <div style={{ maxWidth:1100, margin:'0 auto', padding:20 }}>

        <button onClick={openAdd}>+ Add Creator</button>

        <div>Total: {stats.total}</div>
        <div>Reach: {fmt(stats.reach)}</div>

        {showForm && (
          <div>
            <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
            <input placeholder="Instagram followers" value={form.instagram_followers} onChange={e=>setForm({...form,instagram_followers:e.target.value})}/>
            <button onClick={saveInfluencer}>{loading ? 'Saving...' : 'Save'}</button>
          </div>
        )}

        {influencers.map(inf => (
          <div key={inf.id}>
            {inf.name} — IG: {fmt(inf.instagram_followers)} — TT: {fmt(inf.tiktok_followers)}
          </div>
        ))}

      </div>

      {toast && <Toast message={toast} />}
    </>
  )
}