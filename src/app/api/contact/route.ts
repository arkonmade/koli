// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { submitContactMessage } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    await submitContactMessage(body)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
