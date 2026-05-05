'use client'
// src/components/Nav.tsx
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Nav() {
  const path = usePathname()
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(11,11,15,0.85)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      padding: '0 20px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', height: 60,
    }}>
      <Link href="/" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, letterSpacing: '-0.5px', color: 'var(--white)', textDecoration: 'none' }}>
        KO<span style={{ color: 'var(--lime)' }}>LI</span>
      </Link>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {[
          { href: '/', label: 'Home' },
          { href: '/browse', label: 'Browse' },
          { href: '/admin', label: 'Admin' },
        ].map(({ href, label }) => (
          <Link key={href} href={href} style={{
            background: 'none', border: 'none',
            color: path === href ? 'var(--white)' : 'var(--gray)',
            fontFamily: 'var(--font-body)', fontSize: 14, cursor: 'pointer',
            padding: '8px 14px', borderRadius: 'var(--radius-sm)',
            textDecoration: 'none', transition: 'color 0.15s',
          }}>
            {label}
          </Link>
        ))}
        <Link href="/browse" style={{
          background: 'var(--lime)', border: 'none',
          color: 'var(--black)', fontFamily: 'var(--font-body)',
          fontSize: 14, fontWeight: 600, cursor: 'pointer',
          padding: '8px 18px', borderRadius: 'var(--radius-sm)',
          textDecoration: 'none',
        }}>
          Find Creators
        </Link>
      </div>
    </nav>
  )
}
