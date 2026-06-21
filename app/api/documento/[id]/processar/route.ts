import { supabaseAdmin } from '@/lib/supabase'
import { extrairTextoPDF, extrairTextoDocx } from '@/lib/claude'
import { NextResponse } from 'next/server'

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data: doc, error: fetchError } = await supabaseAdmin
    .from('documentos')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !doc) {
    return NextResponse.json({ error: 'Documento não encontrado' }, { status: 404 })
  }

  if (doc.status === 'concluido' && doc.conteudo_extraido) {
    return NextResponse.json({ status: 'concluido' })
  }

  try {
    const response = await fetch(doc.arquivo_url)
    const buffer = await response.arrayBuffer()
    const nodeBuffer = Buffer.from(buffer)

    const isDocx = doc.arquivo_url.toLowerCase().includes('.docx')
    const conteudo_extraido = isDocx
      ? await extrairTextoDocx(nodeBuffer)
      : await extrairTextoPDF(nodeBuffer.toString('base64'))

    await supabaseAdmin
      .from('documentos')
      .update({ conteudo_extraido, status: 'concluido' })
      .eq('id', id)

    return NextResponse.json({ status: 'concluido' })
  } catch {
    await supabaseAdmin
      .from('documentos')
      .update({ status: 'erro' })
      .eq('id', id)

    return NextResponse.json({ error: 'Erro ao processar documento' }, { status: 500 })
  }
}
