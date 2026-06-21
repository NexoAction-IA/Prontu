import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data: doc, error: fetchError } = await supabaseAdmin
    .from('documentos')
    .select('arquivo_url')
    .eq('id', id)
    .single()

  if (fetchError || !doc) {
    return NextResponse.json({ error: 'Documento não encontrado' }, { status: 404 })
  }

  // Extrai o caminho do arquivo dentro do bucket a partir da URL pública
  const url = new URL(doc.arquivo_url)
  const parts = url.pathname.split('/public/documentos/')
  if (parts.length === 2) {
    await supabaseAdmin.storage.from('documentos').remove([decodeURIComponent(parts[1])])
  }

  const { error } = await supabaseAdmin.from('documentos').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
