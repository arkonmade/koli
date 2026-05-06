'use client'
// src/app/auth/login/page.tsx
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setLoading(true)
    const { error: err } = await signIn(form.email, form.password)
    setLoading(false)
    if (err) { setError(err.message); return }
    router.push('/')
    router.refresh()
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">KO<span style={{ color: 'var(--lime)' }}>LI</span></div>
        <div className="auth-sub">Sign in to discover creators</div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="fl">Email</label>
            <input className="fi" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          </div>
          <div>
            <label className="fl">Password</label>
            <input className="fi" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
          </div>
          {error && <div className="err-msg">{error}</div>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--gray)' }}>
          No account?{' '}
          <Link href="/auth/signup" style={{ color: 'var(--lime)', fontWeight: 600 }}>Sign up</Link>
        </p>
        <p style={{ textAlign: 'center', marginTop: 8 }}>
          <Link href="/" style={{ fontSize: 13, color: 'var(--gray)' }}>← Back to KOLI</Link>
        </p>
      </div>
    </div>
  )
}
