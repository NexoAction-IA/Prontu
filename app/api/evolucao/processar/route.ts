import { supabaseAdmin } from '@/lib/supabase'
import { processarEvolucao } from '@/lib/claude'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { paciente_id, relato_bruto } = await req.json()

  const { data: evolucoes } = await supabaseAdmin
    .from('evolucoes')
    .select('texto_processado, data_sessao')
    .eq('paciente_id', paciente_id)
    .order('data_sessao', { ascending: false })
    .limit(4)

  const historico = evolucoes
    ?.map((e: { data_sessao: string; texto_processado: string }) =>
      `[${e.data_sessao}] ${e.texto_processado}`
    )
    .join('\n\n') ?? ''

  const texto_processado = await processarEvolucao(relato_bruto, historico)
  return NextResponse.json({ texto_processado })
}
