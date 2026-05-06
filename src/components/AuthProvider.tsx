'use client'
// src/components/AuthProvider.tsx
import { AuthContext, useAuthProvider } from '@/hooks/useAuth'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuthProvider()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}
