'use client'

import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function UploadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: pacienteId } = use(params)
  const router = useRouter()

  const [form, setForm] = useState({ tipo: 'anamnese', titulo: '' })
  const [arquivo, setArquivo] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    if (!arquivo) return
    setLoading(true)
    setErro(null)

    const urlRes = await fetch('/api/documento/url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paciente_id: pacienteId, filename: arquivo.name }),
    })
    if (!urlRes.ok) {
      const d = await urlRes.json().catch(() => ({}))
      setErro(d.error || 'Erro ao iniciar upload')
      setLoading(false)
      return
    }

    const { signedUrl, path } = await urlRes.json()
    const contentType = arquivo.name.toLowerCase().endsWith('.docx')
      ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      : 'application/pdf'

    const uploadRes = await fetch(signedUrl, {
      method: 'PUT',
      body: arquivo,
      headers: { 'Content-Type': contentType },
    })
    if (!uploadRes.ok) {
      const txt = await uploadRes.text().catch(() => `status ${uploadRes.status}`)
      setErro(`Erro no envio: ${txt}`)
      setLoading(false)
      return
    }

    const metaRes = await fetch('/api/documento', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paciente_id: pacienteId,
        tipo: form.tipo,
        titulo: form.titulo || arquivo.name.replace(/\.(pdf|docx)$/i, ''),
        path,
      }),
    })
    if (metaRes.ok) {
      router.push(`/paciente/${pacienteId}`)
    } else {
      const d = await metaRes.json().catch(() => ({}))
      setErro(d.error || 'Erro ao salvar documento')
      setLoading(false)
    }
  }

  const TIPOS = [
    { value: 'anamnese',  label: 'Anamnese',           desc: 'Histórico clínico inicial' },
    { value: 'avaliacao', label: 'Avaliação',           desc: 'Protocolo de avaliação fono' },
    { value: 'historico', label: 'Histórico externo',   desc: 'Relatório de outra clínica' },
    { value: 'pei',       label: 'PEI',                 desc: 'Plano de intervenção interdisciplinar' },
    { value: 'relatorio', label: 'Relatório próprio',   desc: 'Relatório emitido por você' },
  ]

  return (
    <div className="max-w-lg">
      <Link href={`/paciente/${pacienteId}`} className="inline-flex items-center gap-1.5 text-sm text-green-600 hover:text-green-800 mb-6 transition-colors cursor-pointer">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Voltar
      </Link>
      <h1 className="text-2xl font-bold text-green-900 mb-1" style={{ fontFamily: 'Figtree, sans-serif' }}>Upload de documento</h1>
      <p className="text-gray-500 text-sm mb-6">O PDF será salvo e lido pela IA em background. Você pode navegar livremente.</p>

      <form onSubmit={enviar} className="bg-white rounded-2xl border border-green-100 p-6 space-y-5 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de documento</label>
          <div className="grid grid-cols-2 gap-2">
            {TIPOS.map(({ value, label, desc }) => (
              <button
                key={value}
                type="button"
                onClick={() => setForm({ ...form, tipo: value })}
                className={`py-2.5 px-3 rounded-xl text-left transition-all duration-200 cursor-pointer border ${
                  form.tipo === value
                    ? 'bg-green-600 text-white border-green-600 shadow-sm'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-green-300 hover:text-green-700'
                }`}
              >
                <span className="block text-sm font-medium">{label}</span>
                <span className={`block text-xs mt-0.5 ${form.tipo === value ? 'text-green-100' : 'text-gray-400'}`}>{desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Título <span className="text-gray-400 font-normal">(opcional)</span></label>
          <input
            type="text"
            value={form.titulo}
            onChange={e => setForm({ ...form, titulo: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
            placeholder="Ex: Anamnese inicial Jan/2025"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Arquivo PDF *</label>
          <div
            onClick={() => document.getElementById('fileInput')?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
              arquivo ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
            }`}
          >
            {arquivo ? (
              <div>
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center mx-auto mb-2">
                  <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-green-800">{arquivo.name}</p>
                <p className="text-xs text-green-600 mt-1">{(arquivo.size / 1024).toFixed(0)} KB · Clique para trocar</p>
              </div>
            ) : (
              <div>
                <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <p className="text-sm font-medium text-gray-600">Clique para selecionar o PDF</p>
                <p className="text-xs text-gray-400 mt-1">PDF ou DOCX</p>
              </div>
            )}
            <input id="fileInput" type="file" accept=".pdf,.docx" className="hidden" onChange={e => setArquivo(e.target.files?.[0] || null)} />
          </div>
        </div>

        {erro && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{erro}</p>
        )}

        <button
          type="submit"
          disabled={loading || !arquivo}
          className="w-full bg-green-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 cursor-pointer shadow-sm flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Salvando...
            </>
          ) : 'Fazer upload'}
        </button>
      </form>
    </div>
  )
}
