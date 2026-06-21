'use client'

import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NovaEvolucaoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: pacienteId } = use(params)
  const router = useRouter()

  const [form, setForm] = useState({
    data_sessao: new Date().toISOString().split('T')[0],
    relato_bruto: '',
    desregulou: false,
    teve_melhora: true,
    observacoes: '',
  })
  const [processando, setProcessando] = useState(false)
  const [resultado, setResultado] = useState('')
  const [salvando, setSalvando] = useState(false)

  async function processar() {
    if (!form.relato_bruto.trim()) return
    setProcessando(true)
    setResultado('')
    const res = await fetch('/api/evolucao/processar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paciente_id: pacienteId, relato_bruto: form.relato_bruto }),
    })
    const data = await res.json()
    setResultado(data.texto_processado || '')
    setProcessando(false)
  }

  async function salvar() {
    setSalvando(true)
    const res = await fetch('/api/evolucao', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paciente_id: pacienteId, ...form, texto_processado: resultado }),
    })
    if (res.ok) {
      router.push(`/paciente/${pacienteId}`)
    } else {
      alert('Erro ao salvar evolução')
      setSalvando(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <Link href={`/paciente/${pacienteId}`} className="inline-flex items-center gap-1.5 text-sm text-green-600 hover:text-green-800 mb-6 transition-colors cursor-pointer">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Voltar
      </Link>
      <h1 className="text-2xl font-bold text-green-900 mb-6" style={{ fontFamily: 'Figtree, sans-serif' }}>Nova evolução de sessão</h1>

      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-green-100 p-6 space-y-5 shadow-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Data da sessão</label>
              <input
                type="date"
                value={form.data_sessao}
                onChange={e => setForm({ ...form, data_sessao: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
              />
            </div>
            <div className="flex items-end gap-5 pb-0.5">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.desregulou}
                  onChange={e => setForm({ ...form, desregulou: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-400"
                />
                <span>Desregulou</span>
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.teve_melhora}
                  onChange={e => setForm({ ...form, teve_melhora: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-400"
                />
                <span>Melhora</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Relato da sessão</label>
            <textarea
              value={form.relato_bruto}
              onChange={e => setForm({ ...form, relato_bruto: e.target.value })}
              rows={7}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all resize-none"
              placeholder="Descreva o que aconteceu na sessão: o que foi trabalhado, como o paciente reagiu, quais objetivos foram abordados, dificuldades observadas..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Observações adicionais</label>
            <textarea
              value={form.observacoes}
              onChange={e => setForm({ ...form, observacoes: e.target.value })}
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all resize-none"
              placeholder="Observações extras (opcional)"
            />
          </div>

          <button
            onClick={processar}
            disabled={processando || !form.relato_bruto.trim()}
            className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {processando ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processando com IA...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Processar em linguagem fonoaudiológica
              </>
            )}
          </button>
        </div>

        {(processando || resultado) && (
          <div className="bg-white rounded-2xl border border-green-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-green-900" style={{ fontFamily: 'Figtree, sans-serif' }}>Texto processado</h2>
              {resultado && (
                <span className="text-xs text-green-700 bg-green-100 px-2.5 py-1 rounded-full font-medium border border-green-200">
                  Revisado pela IA
                </span>
              )}
            </div>
            {processando ? (
              <div className="space-y-2.5 animate-pulse">
                <div className="h-3 bg-green-100 rounded-full w-full" />
                <div className="h-3 bg-green-100 rounded-full w-5/6" />
                <div className="h-3 bg-green-100 rounded-full w-4/6" />
                <div className="h-3 bg-green-100 rounded-full w-full" />
                <div className="h-3 bg-green-100 rounded-full w-3/4" />
              </div>
            ) : (
              <>
                <textarea
                  value={resultado}
                  onChange={e => setResultado(e.target.value)}
                  rows={9}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all resize-none"
                />
                <button
                  onClick={salvar}
                  disabled={salvando}
                  className="mt-4 inline-flex items-center gap-2 bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-green-800 transition-colors duration-200 disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {salvando ? 'Salvando...' : 'Salvar evolução'}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
