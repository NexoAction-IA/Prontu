import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ProcessarPendentes from './ProcessarPendentes'
import DeletarDocumento from './DeletarDocumento'
import DeletarPaciente from './DeletarPaciente'

export default async function PacientePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [{ data: paciente }, { data: evolucoes }, { data: documentos }] = await Promise.all([
    supabaseAdmin.from('pacientes').select('*, clinicas(nome, id)').eq('id', id).single(),
    supabaseAdmin.from('evolucoes').select('*').eq('paciente_id', id).order('data_sessao', { ascending: false }),
    supabaseAdmin.from('documentos').select('*').eq('paciente_id', id).order('criado_em', { ascending: false }),
  ])

  if (!paciente) notFound()

  const TIPO_LABEL: Record<string, string> = {
    anamnese: 'Anamnese',
    avaliacao: 'Avaliação',
    relatorio: 'Relatório próprio',
    historico: 'Histórico externo',
    pei: 'PEI',
  }

  const clinica = paciente.clinicas as { nome: string; id: string }
  const pendentes = (documentos ?? []).filter((d: { status: string }) => d.status === 'processando').map((d: { id: string }) => d.id)
  const idade = paciente.data_nascimento
    ? Math.floor((Date.now() - new Date(paciente.data_nascimento).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
    : null
  const iniciais = paciente.nome.split(' ').map((n: string) => n[0]).slice(0, 2).join('')

  return (
    <div>
      <ProcessarPendentes docIds={pendentes} />
      <Link href={`/clinica/${clinica.id}`} className="inline-flex items-center gap-1.5 text-sm text-green-600 hover:text-green-800 mb-5 transition-colors cursor-pointer">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        {clinica.nome}
      </Link>

      {/* Header do paciente */}
      <div className="bg-white rounded-2xl border border-green-100 p-6 mb-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-bold text-green-700" style={{ fontFamily: 'Figtree, sans-serif' }}>{iniciais}</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-green-900" style={{ fontFamily: 'Figtree, sans-serif' }}>{paciente.nome}</h1>
              <div className="flex flex-wrap gap-2 mt-2">
                {paciente.diagnostico && (
                  <span className="inline-flex items-center bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full border border-green-200">
                    {paciente.diagnostico}
                  </span>
                )}
                {idade !== null && (
                  <span className="inline-flex items-center bg-gray-50 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full border border-gray-200">
                    {idade} anos
                  </span>
                )}
                {paciente.data_nascimento && (
                  <span className="inline-flex items-center bg-gray-50 text-gray-500 text-xs px-2.5 py-1 rounded-full border border-gray-200">
                    {new Date(paciente.data_nascimento + 'T12:00:00').toLocaleDateString('pt-BR')}
                  </span>
                )}
              </div>
              {paciente.observacoes && (
                <p className="text-sm text-gray-500 mt-2 max-w-lg">{paciente.observacoes}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end">
            <DeletarPaciente pacienteId={id} clinicaId={clinica.id} />
            <Link
              href={`/paciente/${id}/nova-evolucao`}
              className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors duration-200 cursor-pointer shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Evolução
            </Link>
            <Link
              href={`/paciente/${id}/relatorio`}
              className="inline-flex items-center gap-2 bg-white border border-green-200 text-green-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-green-50 transition-colors duration-200 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Relatório
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Evoluções */}
        <div className="col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-green-900" style={{ fontFamily: 'Figtree, sans-serif' }}>
              Evoluções <span className="text-green-400 font-normal text-sm ml-1">({evolucoes?.length ?? 0})</span>
            </h2>
            <Link href={`/paciente/${id}/nova-evolucao`} className="text-sm text-green-600 hover:text-green-800 font-medium transition-colors cursor-pointer">
              + Nova
            </Link>
          </div>

          {evolucoes && evolucoes.length > 0 ? (
            <div className="space-y-3">
              {evolucoes.map((ev: {
                id: string; data_sessao: string; texto_processado: string
                relato_bruto: string; objetivos: string; desregulou: boolean; teve_melhora: boolean
              }) => (
                <div key={ev.id} className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-green-900" style={{ fontFamily: 'Figtree, sans-serif' }}>
                      {new Date(ev.data_sessao + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </span>
                    <div className="flex gap-1.5">
                      {ev.desregulou && (
                        <span className="text-xs bg-red-50 text-red-600 px-2.5 py-1 rounded-full border border-red-100 font-medium">Desregulou</span>
                      )}
                      {ev.teve_melhora && (
                        <span className="text-xs bg-green-50 text-green-600 px-2.5 py-1 rounded-full border border-green-200 font-medium">Melhora</span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {ev.texto_processado || ev.relato_bruto}
                  </p>
                  {ev.objetivos && (
                    <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-50">{ev.objetivos}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-green-200 p-10 text-center">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <p className="text-sm text-gray-500 font-medium">Nenhuma evolução registrada</p>
              <Link href={`/paciente/${id}/nova-evolucao`} className="text-green-600 text-sm mt-2 block hover:text-green-800 transition-colors cursor-pointer">
                Registrar primeira evolução →
              </Link>
            </div>
          )}
        </div>

        {/* Documentos */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-green-900" style={{ fontFamily: 'Figtree, sans-serif' }}>Documentos</h2>
            <Link href={`/paciente/${id}/upload`} className="text-sm text-green-600 hover:text-green-800 font-medium transition-colors cursor-pointer">+ PDF</Link>
          </div>

          {documentos && documentos.length > 0 ? (
            <div className="space-y-2">
              {documentos.map((doc: { id: string; titulo: string; tipo: string; status: string; data_documento: string }) => (
                <div
                  key={doc.id}
                  className="group flex items-center gap-3 bg-white rounded-xl border border-green-100 px-4 py-3 transition-all duration-150"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${doc.status === 'processando' ? 'bg-amber-50' : 'bg-red-50'}`}>
                    {doc.status === 'processando' ? (
                      <svg className="w-4 h-4 text-amber-500 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800 truncate">{doc.titulo}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {TIPO_LABEL[doc.tipo] ?? doc.tipo}{doc.status === 'processando' ? ' · lendo com IA...' : ''}
                    </p>
                  </div>
                  {doc.status !== 'processando' && <DeletarDocumento docId={doc.id} />}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-green-200 p-6 text-center">
              <svg className="w-8 h-8 text-green-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <p className="text-xs text-gray-400 font-medium">Nenhum documento</p>
              <Link href={`/paciente/${id}/upload`} className="text-green-600 text-xs mt-1.5 block hover:text-green-800 transition-colors cursor-pointer">
                Fazer upload →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
