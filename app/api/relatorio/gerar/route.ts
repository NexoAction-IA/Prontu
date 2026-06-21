import { supabaseAdmin } from '@/lib/supabase'
import { gerarRelatorio } from '@/lib/claude'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { paciente_id, modelo, promptComplementar } = await req.json()

  const [{ data: paciente }, { data: documentos }, { data: evolucoes }] = await Promise.all([
    supabaseAdmin.from('pacientes').select('*').eq('id', paciente_id).single(),
    supabaseAdmin.from('documentos').select('*').eq('paciente_id', paciente_id).order('criado_em'),
    supabaseAdmin.from('evolucoes').select('*').eq('paciente_id', paciente_id).order('data_sessao'),
  ])

  if (!paciente) return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 })

  type Doc = { tipo: string; titulo: string; conteudo_extraido: string }

  const anamnese = documentos
    ?.filter((d: Doc) => d.tipo === 'anamnese')
    .map((d: Doc) => `${d.titulo}:\n${d.conteudo_extraido}`)
    .join('\n\n') ?? 'Não disponível'

  const avaliacoes = documentos
    ?.filter((d: Doc) => d.tipo === 'avaliacao')
    .map((d: Doc) => `${d.titulo}:\n${d.conteudo_extraido}`) ?? []

  const historico = documentos
    ?.filter((d: Doc) => d.tipo === 'historico')
    .map((d: Doc) => `${d.titulo}:\n${d.conteudo_extraido}`) ?? []

  const pei = documentos
    ?.filter((d: Doc) => d.tipo === 'pei')
    .map((d: Doc) => `${d.titulo}:\n${d.conteudo_extraido}`) ?? []

  const historicoEvolucoes = evolucoes?.map((e: { data_sessao: string; texto_processado: string }) =>
    `${e.data_sessao}: ${e.texto_processado}`
  ) ?? []

  const relatorio = await gerarRelatorio({
    paciente,
    anamnese,
    avaliacoes,
    historico,
    pei,
    evolucoes: historicoEvolucoes,
    promptComplementar: promptComplementar ?? '',
    modelo,
  })

  await supabaseAdmin.from('relatorios').insert({
    paciente_id,
    conteudo: relatorio,
    periodo_inicio: evolucoes?.[0]?.data_sessao ?? null,
    periodo_fim: evolucoes?.[evolucoes.length - 1]?.data_sessao ?? null,
  })

  return NextResponse.json({ relatorio })
}
