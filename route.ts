import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const safeCard = (data: any) => ({
  id: data.id,
  business_name: data.business_name,
  review_url: data.review_url,
  active: data.active,
  created_at: data.created_at,
  activated_at: data.activated_at,
})

export async function GET(req: Request) {
  const u = new URL(req.url)
  const code = u.searchParams.get('code')?.toUpperCase()
  if (!code) return NextResponse.json({ error: 'Kode wajib diisi' }, { status: 400 })
  const { data, error } = await sb.from('qr_codes').select('*').eq('id', code).maybeSingle()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data) return NextResponse.json({ card: null })
  if (u.searchParams.get('meta') === '1') return NextResponse.json({ pinHash: data.pin_hash || '' })
  return NextResponse.json({ card: safeCard(data) })
}

export async function POST(req: Request) {
  const b = await req.json()
  const code = String(b.code || '').toUpperCase()
  if (!/^[A-Z0-9]{6}$/.test(code) || !b.name || !b.review || !/^[0-9]{4}$/.test(String(b.pin || ''))) {
    return NextResponse.json({ error: 'Data aktivasi belum lengkap' }, { status: 400 })
  }
  const existing = await sb.from('qr_codes').select('id').eq('id', code).maybeSingle()
  if (existing.data) return NextResponse.json({ error: 'Kode sudah terdaftar' }, { status: 409 })
  const { data, error } = await sb.from('qr_codes').insert({
    id: code,
    business_name: String(b.name).trim(),
    review_url: String(b.review).trim(),
    active: true,
    activated_at: new Date().toISOString(),
    pin_hash: String(b.pinHash),
  }).select('*').single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ card: safeCard(data) })
}

export async function PUT(req: Request) {
  const b = await req.json()
  const code = String(b.code || '').toUpperCase()
  if (!/^[A-Z0-9]{6}$/.test(code)) return NextResponse.json({ error: 'Kode tidak valid' }, { status: 400 })
  const update: any = { business_name: String(b.name || '').trim(), review_url: String(b.review || '').trim(), active: Boolean(b.active) }
  if (b.pinHash) update.pin_hash = String(b.pinHash)
  const { data, error } = await sb.from('qr_codes').update(update).eq('id', code).select('*').single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ card: safeCard(data) })
}

export async function DELETE(req: Request) {
  const code = new URL(req.url).searchParams.get('code')?.toUpperCase()
  if (!code) return NextResponse.json({ error: 'Kode wajib diisi' }, { status: 400 })
  const { error } = await sb.from('qr_codes').delete().eq('id', code)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
