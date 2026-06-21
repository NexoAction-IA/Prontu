'use client'

import { useState, useEffect, use, useRef } from 'react'
import Link from 'next/link'

const TEMPLATE = `RELATÓRIO DE AVALIAÇÃO FONOAUDIOLÓGICA

1. Identificação do Paciente
Paciente:
Data de Nascimento:
Idade:
Responsáveis:
Data(s) da Avaliação:
Fonoaudióloga Responsável: Tayrini Lenart

2. Queixa Principal / Encaminhamento
[Queixa relatada pelos responsáveis, quem encaminhou e motivo da avaliação]

3. Resumo da Anamnese
Gestação e parto (tipo, intercorrências, Apgar):
Desenvolvimento neuropsicomotor:
Alimentação (amamentação, seletividade, consistência):
Sono:
Histórico de saúde:
Aspectos comportamentais e sensoriais:
Comunicação atual segundo os responsáveis:

4. Avaliação Observacional
Adaptação ao ambiente terapêutico:
Contato visual:
Intenção comunicativa:
Atenção compartilhada:
Resposta ao nome e a comandos simples/múltiplos:
Forma de exploração dos brinquedos (funcional/não funcional):
Brincadeira simbólica:
Presença de estereotipias ou comportamentos repetitivos:
Estratégias comunicativas utilizadas (gestos, vocalizações, palavras):

5. Procedimentos e Protocolos Utilizados
[Listar apenas os protocolos efetivamente aplicados com este paciente, conforme constar nos documentos de avaliação]

6. Resultados dos Protocolos Aplicados
[Para cada protocolo listado na seção 5, descrever: se foi aplicado integral ou parcialmente, principais achados e limitações observadas]

7. Hipótese Diagnóstica Fonoaudiológica (CID-10 / CID-11)
[Códigos diagnósticos e justificativa com base nos achados clínicos]

8. Conclusão
[Síntese do quadro fonoaudiológico, destacando os principais prejuízos e potencialidades]

9. Conduta Fonoaudiológica
Indicação de terapia fonoaudiológica (frequência semanal):
Objetivos iniciais da intervenção:
Orientações familiares:
Encaminhamentos interdisciplinares:
Reavaliação periódica:

10. Observações Finais
[Considerações adicionais]

____________________________________
Tayrini Lenart
Fonoaudióloga`

type Paciente = { nome: string; data_nascimento: string; diagnostico: string }
type Documento = { id: string; titulo: string; tipo: string; status: string }

export default function RelatorioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: pacienteId } = use(params)

  const [paciente, setPaciente] = useState<Paciente | null>(null)
  const [documentos, setDocumentos] = useState<Documento[]>([])
  const [carregado, setCarregado] = useState(false)
  const [modelo, setModelo] = useState(TEMPLATE)
  const [promptComplementar, setPromptComplementar] = useState('')
  const [loading, setLoading] = useState(false)
  const [relatorio, setRelatorio] = useState('')
  const [copiado, setCopiado] = useState(false)
  const [downloadingPdf, setDownloadingPdf] = useState(false)
  const preenchido = useRef(false)

  useEffect(() => {
    Promise.all([
      fetch(`/api/paciente/${pacienteId}`).then(r => r.json()),
      fetch(`/api/documento?paciente_id=${pacienteId}`).then(r => r.json()),
    ]).then(([p, docs]) => {
      setPaciente(p)
      setDocumentos(Array.isArray(docs) ? docs : [])
      setCarregado(true)

      if (!preenchido.current && p?.nome) {
        preenchido.current = true
        const idade = p.data_nascimento
          ? Math.floor((Date.now() - new Date(p.data_nascimento).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
          : null
        const nascimento = p.data_nascimento
          ? new Date(p.data_nascimento + 'T12:00:00').toLocaleDateString('pt-BR')
          : ''

        setModelo(prev => prev
          .replace('Paciente:', `Paciente: ${p.nome}`)
          .replace('Data de Nascimento:', `Data de Nascimento: ${nascimento}`)
          .replace('Idade:', `Idade: ${idade !== null ? `${idade} anos` : ''}`)
        )
      }
    })
  }, [pacienteId])

  const anamnesePendente = documentos.some(d => d.tipo === 'anamnese' && d.status === 'processando')
  const temAnamnese = documentos.some(d => d.tipo === 'anamnese')

  async function gerar() {
    setLoading(true)
    setRelatorio('')
    const res = await fetch('/api/relatorio/gerar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paciente_id: pacienteId, modelo, promptComplementar }),
    })
    const data = await res.json()
    setRelatorio(data.relatorio || data.error || 'Erro ao gerar relatório')
    setLoading(false)
  }

  function copiar() {
    navigator.clipboard.writeText(relatorio)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  async function gerarPdf() {
    setDownloadingPdf(true)
    const res = await fetch('/api/relatorio/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paciente_id: pacienteId, texto: relatorio }),
    })
    if (res.ok) {
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `relatorio-${paciente?.nome?.replace(/\s+/g, '-') || 'paciente'}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } else {
      alert('Erro ao gerar PDF. Tente novamente.')
    }
    setDownloadingPdf(false)
  }

  return (
    <div className="max-w-3xl">
      <Link href={`/paciente/${pacienteId}`} className="inline-flex items-center gap-1.5 text-sm text-green-600 hover:text-green-800 mb-6 transition-colors cursor-pointer">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Voltar
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-green-900" style={{ fontFamily: 'Figtree, sans-serif' }}>Gerar relatório</h1>
        {paciente && (
          <p className="text-gray-500 text-sm mt-1">{paciente.nome} · {paciente.diagnostico}</p>
        )}
      </div>

      {carregado && anamnesePendente && (
        <div className="mb-4 flex items-start gap-2.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl px-4 py-3 text-sm">
          <svg className="w-4 h-4 animate-spin flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>A anamnese ainda está sendo lida pela IA. Aguarde terminar antes de gerar o relatório para ter o conteúdo completo.</span>
        </div>
      )}

      {carregado && !temAnamnese && (
        <div className="mb-4 flex items-start gap-2.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl px-4 py-3 text-sm">
          <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Nenhuma anamnese upada para este paciente. O relatório será gerado apenas com os dados do cadastro.</span>
        </div>
      )}

      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-green-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-green-900 text-sm" style={{ fontFamily: 'Figtree, sans-serif' }}>
              Modelo de relatório
            </h2>
            <span className="text-xs text-gray-400">Edite conforme necessário</span>
          </div>
          <textarea
            value={modelo}
            onChange={e => setModelo(e.target.value)}
            rows={18}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all resize-none bg-gray-50"
          />
          <div className="mt-5 border-t border-gray-100 pt-5">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Instruções adicionais para a IA
              <span className="text-gray-400 font-normal ml-1.5">(opcional)</span>
            </label>
            <p className="text-xs text-gray-400 mb-2">
              Destaque o que a IA deve priorizar: protocolos aplicados, comportamentos observados, atualizações recentes, pontos de atenção específicos deste paciente.
            </p>
            <textarea
              value={promptComplementar}
              onChange={e => setPromptComplementar(e.target.value)}
              rows={4}
              placeholder="Ex: Atentar para o resultado do ABFW aplicado em 05/06. O paciente evoluiu no contato visual desde a última avaliação — verificar nas evoluções de abril. Priorizar os objetivos de ampliação de vocabulário do PEI."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all resize-none bg-gray-50 placeholder:text-gray-300"
            />
          </div>

          <button
            onClick={gerar}
            disabled={loading || anamnesePendente}
            className="mt-4 inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Gerando com IA...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Gerar relatório completo
              </>
            )}
          </button>
        </div>

        {(loading || relatorio) && (
          <div className="bg-white rounded-2xl border border-green-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-green-900" style={{ fontFamily: 'Figtree, sans-serif' }}>Relatório gerado</h2>
              {relatorio && (
                <div className="flex gap-2">
                  <button
                    onClick={copiar}
                    className="inline-flex items-center gap-1.5 text-xs text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    {copiado ? (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Copiado!
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copiar texto
                      </>
                    )}
                  </button>
                  <button
                    onClick={gerarPdf}
                    disabled={downloadingPdf}
                    className="inline-flex items-center gap-1.5 text-xs text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {downloadingPdf ? (
                      <>
                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Gerando PDF...
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Baixar PDF
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
            {loading ? (
              <div className="space-y-2.5 animate-pulse">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className={`h-3 bg-green-100 rounded-full ${i % 3 === 2 ? 'w-3/4' : 'w-full'}`} />
                ))}
              </div>
            ) : (
              <textarea
                value={relatorio}
                onChange={e => setRelatorio(e.target.value)}
                rows={22}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all resize-none"
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
