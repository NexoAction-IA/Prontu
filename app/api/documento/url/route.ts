import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { paciente_id, filename } = await req.json()
  if (!paciente_id || !filename) {
    return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
  }

  const safeName = filename
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_+/g, '_')
  const path = `${paciente_id}/${Date.now()}-${safeName}`
  const { data, error } = await supabaseAdmin.storage
    .from('documentos')
    .createSignedUploadUrl(path)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ signedUrl: data.signedUrl, path })
}
