'use client'
// src/app/contact/page.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { submitContactMessage } from '@/lib/supabase'
import Nav from '@/components/Nav'
import MobileShell from '@/components/MobileShell'

const TYPES = [
  { v:'general',     l:'General Inquiry' },
  { v:'problem',     l:'Report a Problem' },
  { v:'advice',      l:'Advice & Feedback' },
  { v:'assistance',  l:'Need Assistance' },
  { v:'request',     l:'Feature Request' },
  { v:'partnership', l:'Partnership / Business' },
]
const CONTACT_METHODS = [
  { v:'email',    l:'Email' },
  { v:'phone',    l:'Phone call' },
  { v:'whatsapp', l:'WhatsApp' },
  { v:'social',   l:'Social Media DM' },
]

function ContactForm({ userId }: { userId: string }) {
  const [form, setForm] = useState({
    sender_name: '', sender_email: '', sender_phone: '',
    preferred_contact: 'email', social_handle: '',
    subject: '', message: '', type: 'general',
  })
  const [state, setState] = useState<'idle'|'loading'|'done'|'error'>('idle')

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.sender_name || !form.message) return
    setState('loading')
    try {
      await submitContactMessage({ ...form, user_id: userId })
      setState('done')
    } catch {
      setState('error')
    }
  }

  if (state === 'done') return (
    <div style={{ textAlign: 'center', padding: '60px 24px' }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(182,255,46,.1)', border: '1px solid rgba(182,255,46,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--lime)', fontSize: 28 }}>✓</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, marginBottom: 10 }}>Message sent!</h2>
      <p style={{ color: 'var(--gray)', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
        We received your message and will get back to you via your preferred contact method within 24–48 hours.
      </p>
      <Link href="/" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none', padding: '12px 32px', borderRadius: 'var(--r-sm)', background: 'var(--lime)', color: 'var(--black)', fontWeight: 700, fontSize: 15 }}>
        Back to Home
      </Link>
    </div>
  )

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Type + Subject */}
      <div className="frow2">
        <div>
          <label className="fl">Type</label>
          <select className="fi" value={form.type} onChange={set('type')}>
            {TYPES.map(t => <option key={t.v} value={t.v}>{t.l}</option>)}
          </select>
        </div>
        <div>
          <label className="fl">Subject</label>
          <input className="fi" placeholder="Short subject" value={form.subject} onChange={set('subject')} />
        </div>
      </div>

      {/* Sender info */}
      <div>
        <label className="fl">Your Name *</label>
        <input className="fi" placeholder="Full name" value={form.sender_name} onChange={set('sender_name')} required />
      </div>
      <div className="frow2">
        <div>
          <label className="fl">Email</label>
          <input className="fi" type="email" placeholder="you@example.com" value={form.sender_email} onChange={set('sender_email')} />
        </div>
        <div>
          <label className="fl">Phone / WhatsApp</label>
          <input className="fi" placeholder="+250…" value={form.sender_phone} onChange={set('sender_phone')} />
        </div>
      </div>

      {/* Preferred contact */}
      <div>
        <label className="fl">Best way to reach you</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
          {CONTACT_METHODS.map(m => (
            <button
              key={m.v} type="button"
              onClick={() => setForm(f => ({ ...f, preferred_contact: m.v }))}
              style={{
                background: form.preferred_contact === m.v ? 'var(--lime)' : 'var(--s2)',
                border: `1px solid ${form.preferred_contact === m.v ? 'var(--lime)' : 'var(--border)'}`,
                color: form.preferred_contact === m.v ? 'var(--black)' : 'var(--gray)',
                fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
                padding: '7px 14px', borderRadius: 100, cursor: 'pointer',
              }}
            >{m.l}</button>
          ))}
        </div>
      </div>

      {form.preferred_contact === 'social' && (
        <div>
          <label className="fl">Social handle (so we can DM you)</label>
          <input className="fi" placeholder="@yourhandle or platform/username" value={form.social_handle} onChange={set('social_handle')} />
        </div>
      )}

      {/* Message */}
      <div>
        <label className="fl">Message *</label>
        <textarea className="fi" placeholder="Describe your question, issue, or request in detail…" value={form.message} onChange={set('message')} style={{ minHeight: 120 }} required />
      </div>

      {state === 'error' && <div className="err-msg">Something went wrong. Please try again.</div>}

      <button type="submit" className="btn-primary" disabled={state === 'loading'}>
        {state === 'loading' ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  )
}

export default function ContactPage() {
  const { user, loading } = useAuth()

  if (loading) return (
    <>
      <Nav />
      <MobileShell>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: 'var(--gray)', fontSize: 14 }}>Loading…</div>
      </MobileShell>
    </>
  )

  return (
    <>
      <Nav />
      <MobileShell>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '32px 20px 80px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 800, letterSpacing: '-.5px', marginBottom: 8 }}>
            Talk to Us
          </h1>
          <p style={{ color: 'var(--gray)', fontSize: 14, lineHeight: 1.65, marginBottom: 28 }}>
            Questions, feedback, problems, or partnership ideas — we read every message and reply within 24–48 hours.
          </p>

          {user ? (
            <ContactForm userId={user.id} />
          ) : (
            <div className="gated-box">
              <div style={{ fontSize: 32, marginBottom: 12 }}>🔒</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
                Sign in to contact us
              </div>
              <p style={{ color: 'var(--gray)', fontSize: 14, lineHeight: 1.65, marginBottom: 20 }}>
                We require sign-in so we can reply to you directly and track your message.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <Link href="/auth/login" className="btn-primary" style={{ flex: 1, textDecoration: 'none', textAlign: 'center', padding: '12px', borderRadius: 'var(--r-sm)', background: 'var(--lime)', color: 'var(--black)', fontWeight: 700 }}>Login</Link>
                <Link href="/auth/signup" style={{ flex: 1, textDecoration: 'none', textAlign: 'center', padding: '12px', borderRadius: 'var(--r-sm)', border: '1px solid var(--border-hi)', color: 'var(--white)', fontSize: 14 }}>Sign Up</Link>
              </div>
            </div>
          )}
        </div>
      </MobileShell>
    </>
  )
}
