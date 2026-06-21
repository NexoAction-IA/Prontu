import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data, error } = await supabaseAdmin.from('clinicas').select('*').eq('id', id).single()
  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(data)
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const contentType = req.headers.get('content-type') || ''

  // Logo upload (multipart)
  if (contentType.includes('multipart/form-data')) {
    const formData = await req.formData()
    const arquivo = formData.get('logo') as File | null

    if (!arquivo) return NextResponse.json({ error: 'Arquivo não enviado' }, { status: 400 })

    const ext = arquivo.name.split('.').pop()?.toLowerCase() || 'png'
    const path = `clinicas/${id}/logo.${ext}`
    const bytes = await arquivo.arrayBuffer()

    const { error: uploadError } = await supabaseAdmin.storage
      .from('documentos')
      .upload(path, Buffer.from(bytes), {
        contentType: arquivo.type || 'image/png',
        upsert: true,
      })

    if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })

    const { data: { publicUrl } } = supabaseAdmin.storage.from('documentos').getPublicUrl(path)

    const { error } = await supabaseAdmin
      .from('clinicas')
      .update({ logo_url: publicUrl })
      .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ logo_url: publicUrl })
  }

  // Dados da clínica (JSON)
  const body = await req.json()
  const { nome, cidade, telefone, email } = body

  const { data, error } = await supabaseAdmin
    .from('clinicas')
    .update({ nome, cidade, telefone, email })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
