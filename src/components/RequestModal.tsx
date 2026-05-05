'use client'
// src/components/RequestModal.tsx
import { useState } from 'react'
import type { Influencer } from '@/lib/supabase'

export default function RequestModal({
  influencer,
  onClose,
}: {
  influencer: Influencer
  onClose: () => void
}) {
  const [form, setForm] = useState({ brand: '', name: '', email: '', message: '' })
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  const submit = async () => {
    if (!form.brand || !form.name) return
    setState('loading')
    try {
      const res = await fetch('/api/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          influencer_id: influencer.id,
          brand_name: form.brand,
          contact_name: form.name,
          contact_email: form.email,
          message: form.message,
        }),
      })
      if (res.ok) setState('done')
      else setState('error')
    } catch {
      setState('error')
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'var(--surface2)', border: '1px solid var(--border-strong)',
    borderRadius: 'var(--radius-sm)', padding: '11px 14px',
    color: 'var(--white)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none',
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 20 }}
      onClick={onClose}
    >
      <div
        style={{ background: 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-xl)', padding: 28, width: '100%', maxWidth: 480 }}
        onClick={e => e.stopPropagation()}
      >
        {state === 'done' ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(182,255,46,0.1)', border: '1px solid rgba(182,255,46,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--lime)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Request sent!</div>
            <div style={{ fontSize: 14, color: 'var(--gray)', lineHeight: 1.6 }}>
              Your collaboration request was sent to <strong>{influencer.name}</strong>. Expect a reply within 48 hours.
            </div>
            <button onClick={onClose} style={{ marginTop: 24, width: '100%', background: 'var(--lime)', border: 'none', color: 'var(--black)', fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600, padding: 12, borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>Done</button>
          </div>
        ) : (
          <>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Request Collaboration</div>
            <div style={{ fontSize: 14, color: 'var(--gray)', marginBottom: 24 }}>Reach out to {influencer.name} for a partnership</div>

            {[
              { key: 'brand', label: 'Brand / Company *', placeholder: 'e.g. Kigali Coffee Co.', type: 'text' },
              { key: 'name', label: 'Your Name *', placeholder: 'Full name', type: 'text' },
              { key: 'email', label: 'Email', placeholder: 'you@brand.com', type: 'email' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--gray)', marginBottom: 6 }}>{f.label}</label>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  value={(form as any)[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  style={inputStyle}
                />
              </div>
            ))}

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--gray)', marginBottom: 6 }}>Message</label>
              <textarea
                placeholder="Tell them about your campaign, product, or idea…"
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                style={{ ...inputStyle, resize: 'vertical', minHeight: 90 }}
              />
            </div>

            {state === 'error' && <div style={{ fontSize: 13, color: '#F87171', marginBottom: 12 }}>Something went wrong. Please try again.</div>}

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={onClose} style={{ flex: '0 0 100px', background: 'none', border: '1px solid var(--border-strong)', color: 'var(--gray)', fontFamily: 'var(--font-body)', fontSize: 14, padding: 11, borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>Cancel</button>
              <button onClick={submit} disabled={state === 'loading'} style={{ flex: 1, background: 'var(--lime)', border: 'none', color: 'var(--black)', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, padding: 11, borderRadius: 'var(--radius-sm)', cursor: 'pointer', opacity: state === 'loading' ? 0.7 : 1 }}>
                {state === 'loading' ? 'Sending…' : '✓ Send Request'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
