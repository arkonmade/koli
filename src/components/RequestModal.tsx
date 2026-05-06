'use client'
// src/components/RequestModal.tsx
import { useState } from 'react'
import type { Influencer } from '@/types'
import { submitCollabRequest } from '@/lib/supabase'

export default function RequestModal({ inf, userId, onClose }: { inf: Influencer; userId: string; onClose: () => void }) {
  const [form, setForm] = useState({ brand: '', name: '', email: '', message: '' })
  const [state, setState] = useState<'idle'|'loading'|'done'|'error'>('idle')
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async () => {
    if (!form.brand || !form.name) return
    setState('loading')
    try {
      await submitCollabRequest({
        influencer_id: inf.id, user_id: userId,
        brand_name: form.brand, contact_name: form.name,
        contact_email: form.email, message: form.message,
      })
      setState('done')
    } catch { setState('error') }
  }

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-drag" />
        {state === 'done' ? (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(182,255,46,.1)', border: '1px solid rgba(182,255,46,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', color: 'var(--lime)', fontSize: 22 }}>✓</div>
            <div className="modal-title">Request sent!</div>
            <p style={{ fontSize: 13, color: 'var(--gray)', lineHeight: 1.65, margin: '8px 0 20px' }}>Your request was sent to <strong>{inf.name}</strong>. Expect a reply within 48 hours.</p>
            <button className="btn-primary" onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <div className="modal-title">Request Collaboration</div>
            <div className="modal-sub">Send a brief to {inf.name}</div>
            {[
              { k:'brand', l:'Brand / Company *', ph:'e.g. Kigali Coffee Co.' },
              { k:'name',  l:'Your Name *',        ph:'Full name' },
              { k:'email', l:'Email',              ph:'you@brand.com' },
            ].map(f => (
              <div key={f.k} style={{ marginBottom: 11 }}>
                <label className="fl">{f.l}</label>
                <input className="fi" placeholder={f.ph} value={(form as any)[f.k]} onChange={set(f.k)} />
              </div>
            ))}
            <label className="fl">Message</label>
            <textarea className="fi" placeholder="Tell them about your campaign, product, or idea…" value={form.message} onChange={set('message')} />
            {state === 'error' && <div className="err-msg">Something went wrong. Try again.</div>}
            <div className="modal-actions">
              <button className="btn-ghost" onClick={onClose}>Cancel</button>
              <button className="btn-primary" style={{ flex: 2 }} onClick={submit} disabled={state === 'loading'}>
                {state === 'loading' ? 'Sending…' : 'Send Request'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
