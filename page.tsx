import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

export default async function ReviewRedirect({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const { data } = await sb.from('qr_codes').select('review_url,active').eq('id', code.toUpperCase()).maybeSingle()
  if (data?.active && data.review_url) redirect(data.review_url)
  return <main style={{fontFamily:'system-ui',padding:40,textAlign:'center'}}><h1>Kartu tidak aktif</h1><p>Kartu ini belum aktif atau sedang dinonaktifkan.</p></main>
}
