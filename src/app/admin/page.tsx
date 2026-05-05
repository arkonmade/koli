// src/app/admin/page.tsx
// NOTE: In production, protect this route with middleware + auth
// e.g. Supabase Auth with admin role check
import { getAllInfluencersAdmin } from '@/lib/supabase'
import AdminClient from '@/components/AdminClient'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const influencers = await getAllInfluencersAdmin()
  return <AdminClient initialInfluencers={influencers} />
}
