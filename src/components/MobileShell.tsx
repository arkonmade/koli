'use client'
// src/components/MobileShell.tsx
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { signOut, supabase } from '@/lib/supabase'

const HomeIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
const BrowseIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
const UserIcon  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const AdminIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
const ChatIcon  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>

export default function MobileShell({ children }: { children: React.ReactNode }) {
  const path = usePathname()
  const router = useRouter()
  const { user,profile, isAdmin, loading } = useAuth()

  const isProfile = path.startsWith('/influencer/')
  const isAuth    = path.startsWith('/auth/')
  
  

  const tabs = [
    { href: '/',       label: 'Home',    Icon: HomeIcon  },
    { href: '/browse', label: 'Browse',  Icon: BrowseIcon },
    ...(isAdmin ? [{ href: '/admin', label: 'Admin', Icon: AdminIcon }] : []),
    ...(user && !isAdmin ? [{ href: '/contact', label: 'Talk', Icon: ChatIcon }] : []),
    { href: user ? `/u/${profile?.username}` : '/auth/login', label: user ? 'You' : 'Login', Icon: UserIcon },
  ]

  const isActive = (href: string) => {
    if (href === '/') return path === '/'
    return path.startsWith(href)
  }

  return (
    <div className="app-shell">
      {/* Mobile top bar - hidden on profile & auth pages */}
      {!isProfile && !isAuth && (
        <div className="mob-topbar">
          <div className="mob-logo">KO<em>LI</em></div>
          <span style={{ fontSize: 11, color: 'var(--gray)', fontWeight: 500 }}>
            {path === '/' ? "Rwanda's Creator Network"
              : path.startsWith('/browse') ? 'Discover Creators'
              : path.startsWith('/admin') ? 'Admin Panel'
              : path.startsWith('/contact') ? 'Talk to Us'
              : ''}
          </span>
          {user && (
            <button
              onClick={async () => { await signOut(); router.push('/'); router.refresh(); }}
              style={{ background: 'none', border: 'none', color: 'var(--lime-dk)', fontWeight: 500, fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              Out
            </button>
          )}
        </div>
      )}

      {/* Page content */}
      <div className="page-scroll">
        {children}
      </div>

      {/* Bottom tabs - hidden on profile & auth */}
      {!isProfile && !isAuth && (
        <div className="bottom-tabs">
          {tabs.map(t => (
            <button key={t.href} className={`tab-btn ${isActive(t.href) ? 'active' : ''}`}
              onClick={() => router.push(t.href)}>
              <div className="tab-bar" />
              <t.Icon />
              <span className="tab-label">{t.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
