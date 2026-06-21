'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeletarPaciente({ pacienteId, clinicaId }: { pacienteId: string; clinicaId: string }) {
  const [confirmando, setConfirmando] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function deletar() {
    setLoading(true)
    const res = await fetch(`/api/paciente/${pacienteId}`, { method: 'DELETE' })
    if (res.ok) {
      router.push(`/clinica/${clinicaId}`)
    } else {
      const d = await res.json().catch(() => ({}))
      alert(d.error || 'Erro ao remover paciente')
      setLoading(false)
      setConfirmando(false)
    }
  }

  if (confirmando) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-red-600 font-medium">Remover paciente e todos os dados?</span>
        <button
          onClick={deletar}
          disabled={loading}
          className="text-sm font-medium text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Removendo...' : 'Remover'}
        </button>
        <button
          onClick={() => setConfirmando(false)}
          className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          Cancelar
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirmando(true)}
      className="inline-flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 border border-red-200 hover:border-red-300 px-3 py-2 rounded-xl transition-colors cursor-pointer"
      title="Remover paciente"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
      Remover
    </button>
  )
}
