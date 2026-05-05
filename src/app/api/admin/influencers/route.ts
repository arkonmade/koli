// src/app/api/admin/influencers/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { upsertInfluencer, deleteInfluencer, toggleFeatured } from '@/lib/supabase'

// In production: validate admin session cookie here
function isAdmin(req: NextRequest) {
  // TODO: check Supabase session for admin role
  return true
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await req.json()
    const { action, ...data } = body

    if (action === 'upsert') {
      const result = await upsertInfluencer(data)
      return NextResponse.json({ success: true, data: result })
    }
    if (action === 'delete') {
      await deleteInfluencer(data.id)
      return NextResponse.json({ success: true })
    }
    if (action === 'feature') {
      await toggleFeatured(data.id, data.featured)
      return NextResponse.json({ success: true })
    }
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
