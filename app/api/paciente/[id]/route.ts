import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data, error } = await supabaseAdmin
    .from('pacientes')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(data)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Remove arquivos do Storage antes de deletar o paciente
  const { data: docs } = await supabaseAdmin
    .from('documentos')
    .select('arquivo_url')
    .eq('paciente_id', id)

  if (docs && docs.length > 0) {
    const paths = docs
      .map((d: { arquivo_url: string }) => {
        const url = d.arquivo_url || ''
        const marker = '/object/public/documentos/'
        const idx = url.indexOf(marker)
        return idx !== -1 ? url.slice(idx + marker.length) : null
      })
      .filter(Boolean) as string[]

    if (paths.length > 0) {
      await supabaseAdmin.storage.from('documentos').remove(paths)
    }
  }

  // Deleta paciente — cascade apaga evoluções e documentos no banco
  const { error } = await supabaseAdmin.from('pacientes').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
