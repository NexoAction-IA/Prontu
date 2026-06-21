'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { use } from 'react'

export default function NovoPacientePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: clinicaId } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    nome: '',
    data_nascimento: '',
    diagnostico: '',
    observacoes: '',
  })

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/paciente', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, clinica_id: clinicaId }),
    })
    if (res.ok) {
      const { id } = await res.json()
      router.push(`/paciente/${id}`)
    } else {
      alert('Erro ao salvar paciente')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl">
      <Link href={`/clinica/${clinicaId}`} className="inline-flex items-center gap-1.5 text-sm text-green-600 hover:text-green-800 mb-6 transition-colors cursor-pointer">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Voltar
      </Link>
      <h1 className="text-2xl font-bold text-green-900 mb-6" style={{ fontFamily: 'Figtree, sans-serif' }}>Novo paciente</h1>

      <form onSubmit={salvar} className="bg-white rounded-2xl border border-green-100 p-6 space-y-5 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome completo *</label>
          <input
            type="text"
            required
            value={form.nome}
            onChange={e => setForm({ ...form, nome: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
            placeholder="Nome do paciente"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Data de nascimento</label>
          <input
            type="date"
            value={form.data_nascimento}
            onChange={e => setForm({ ...form, data_nascimento: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Diagnóstico</label>
          <input
            type="text"
            value={form.diagnostico}
            onChange={e => setForm({ ...form, diagnostico: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
            placeholder="Ex: TEA, Síndrome de Down, Atraso de fala"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Observações iniciais</label>
          <textarea
            value={form.observacoes}
            onChange={e => setForm({ ...form, observacoes: e.target.value })}
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all resize-none"
            placeholder="Informações relevantes para o acompanhamento"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 cursor-pointer shadow-sm"
        >
          {loading ? 'Salvando...' : 'Salvar paciente'}
        </button>
      </form>
    </div>
  )
}
