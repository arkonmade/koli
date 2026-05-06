'use client'
// src/components/Nav.tsx
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { signOut } from '@/lib/supabase'

export default function Nav() {
  const path = usePathname()
  const router = useRouter()
  const { user, isAdmin, loading } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
    router.refresh()
  }

  const links = [
    { href: '/', label: 'Home' },
    { href: '/browse', label: 'Browse' },
    ...(isAdmin ? [{ href: '/admin', label: 'Admin' }] : []),
    ...(user ? [{ href: '/contact', label: 'Talk to Us' }] : []),
  ]

  return (
    <nav className="desk-nav">
      <Link href="/" className="logo">KO<em>LI</em></Link>
      <div className="desk-links">
        {links.map(l => (
          <Link key={l.href} href={l.href}
            className={`dnav ${path === l.href || path.startsWith(l.href + '/') ? 'act' : ''}`}>
            {l.label}
          </Link>
        ))}
        {!loading && (
          user ? (
            <button className="dnav" onClick={handleSignOut}>Sign Out</button>
          ) : (
            <>
              <Link href="/auth/login"  className="dnav">Login</Link>
              <Link href="/auth/signup" className="dnav cta">Sign Up</Link>
            </>
          )
        )}
      </div>
    </nav>
  )
}
