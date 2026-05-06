// src/app/api/admin/influencers/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { adminUpsertInfluencer, adminDeleteInfluencer, adminToggleFeatured, adminGetInfluencers } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action, ...data } = body

    switch (action) {
      case 'list':
        return NextResponse.json(await adminGetInfluencers())
      case 'upsert':
        return NextResponse.json(await adminUpsertInfluencer(data))
      case 'delete':
        await adminDeleteInfluencer(data.id)
        return NextResponse.json({ success: true })
      case 'feature':
        await adminToggleFeatured(data.id, data.featured)
        return NextResponse.json({ success: true })
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
