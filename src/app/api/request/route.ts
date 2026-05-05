// src/app/api/request/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { submitCollaborationRequest } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { influencer_id, brand_name, contact_name, contact_email, message } = body

    if (!influencer_id || !brand_name || !contact_name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await submitCollaborationRequest({
      influencer_id,
      brand_name,
      contact_name,
      contact_email: contact_email ?? '',
      message: message ?? '',
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to submit request' }, { status: 500 })
  }
}
