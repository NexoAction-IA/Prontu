import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const paciente_id = searchParams.get('paciente_id')
  if (!paciente_id) return NextResponse.json({ error: 'paciente_id obrigatório' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('documentos')
    .select('id, titulo, tipo, status, criado_em')
    .eq('paciente_id', paciente_id)
    .order('criado_em', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const { paciente_id, tipo, titulo, path } = await req.json()

  if (!paciente_id || !path) {
    return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
  }

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from('documentos')
    .getPublicUrl(path)

  const nomeArquivo = path.split('/').pop() || path
  const { data, error } = await supabaseAdmin
    .from('documentos')
    .insert({
      paciente_id,
      tipo: tipo || 'anamnese',
      titulo: titulo || nomeArquivo.replace(/\.(pdf|docx)$/i, ''),
      arquivo_url: publicUrl,
      conteudo_extraido: null,
      status: 'processando',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
