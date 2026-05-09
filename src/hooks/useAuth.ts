'use client'
// src/hooks/useAuth.ts
import { useState, useEffect, createContext, useContext } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase, getProfile } from '@/lib/supabase'
import type { Profile } from '@/types'

type AuthCtx = {
  session: Session | null
  user: User | null
  profile: Profile | null
  isAdmin: boolean
  loading: boolean
  refresh: () => void
}

export const AuthContext = createContext<AuthCtx>({
  session: null, user: null, profile: null, isAdmin: false, loading: true, refresh: () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

export function useAuthProvider(): AuthCtx {
  const [session, setSession]   = useState<Session | null>(null)
  const [profile, setProfile]   = useState<Profile | null>(null)
  const [loading, setLoading]   = useState(true)

  const loadProfile = async (uid: string) => {
    const p = await getProfile(uid)
    // console.log("PROFILE:", p)
    // console.log(await supabase.auth.getSession())
    setProfile(p)
  }

  const refresh = () => {
    if (session?.user) loadProfile(session.user.id)
  }

  // useEffect(() => {
  //   supabase.auth.getSession().then(({ data }) => {
  //     setSession(data.session)
  //     if (data.session?.user) loadProfile(data.session.user.id)
  //     setLoading(false)
  //   })

  //   const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
  //     setSession(s)
  //     if (s?.user) loadProfile(s.user.id)
  //     else setProfile(null)
  //   })
  //   return () => subscription.unsubscribe()
  // }, [])

  useEffect(() => {
  const init = async () => {
    const { data } = await supabase.auth.getSession()
    const session = data.session

    setSession(session)

    if (session?.user?.id) {
      await loadProfile(session.user.id)
    }

    setLoading(false)
  }

  init()

  const { data: { subscription } } =
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)

      if (session?.user?.id) {
        loadProfile(session.user.id)
      } else {
        setProfile(null)
      }
    })

  return () => subscription.unsubscribe()
}, [])

  return {
    session,
    user: session?.user ?? null,
    profile,
    isAdmin: profile?.role === 'admin',
    loading,
    refresh,
  }
}
