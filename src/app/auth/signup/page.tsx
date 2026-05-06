'use client'
// src/app/auth/signup/page.tsx
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signUp } from '@/lib/supabase'

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    const { error: err } = await signUp(form.email, form.password, form.name)
    setLoading(false)
    if (err) { setError(err.message); return }
    router.push('/')
    router.refresh()
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">KO<span style={{ color: 'var(--lime)' }}>LI</span></div>
        <div className="auth-sub">Create your account</div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="fl">Full Name</label>
            <input className="fi" placeholder="Your name" value={form.name} onChange={set('name')} required />
          </div>
          <div>
            <label className="fl">Email</label>
            <input className="fi" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
          </div>
          <div>
            <label className="fl">Password</label>
            <input className="fi" type="password" placeholder="At least 6 characters" value={form.password} onChange={set('password')} required />
          </div>
          <div>
            <label className="fl">Confirm Password</label>
            <input className="fi" type="password" placeholder="Repeat password" value={form.confirm} onChange={set('confirm')} required />
          </div>
          {error && <div className="err-msg">{error}</div>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--gray)' }}>
          Already have an account?{' '}
          <Link href="/auth/login" style={{ color: 'var(--lime)', fontWeight: 600 }}>Sign in</Link>
        </p>
        <p style={{ textAlign: 'center', marginTop: 8 }}>
          <Link href="/" style={{ fontSize: 13, color: 'var(--gray)' }}>← Back to KOLI</Link>
        </p>
      </div>
    </div>
  )
}
