'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeletarDocumento({ docId }: { docId: string }) {
  const router = useRouter()
  const [confirmando, setConfirmando] = useState(false)
  const [loading, setLoading] = useState(false)

  async function deletar() {
    setLoading(true)
    await fetch(`/api/documento/${docId}`, { method: 'DELETE' })
    router.refresh()
  }

  if (confirmando) {
    return (
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          onClick={deletar}
          disabled={loading}
          className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors cursor-pointer disabled:opacity-50"
        >
          {loading ? '...' : 'Remover'}
        </button>
        <span className="text-gray-200">|</span>
        <button
          onClick={() => setConfirmando(false)}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          Cancelar
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirmando(true)}
      className="opacity-0 group-hover:opacity-100 flex-shrink-0 text-gray-300 hover:text-red-400 transition-all duration-150 cursor-pointer"
      title="Remover documento"
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  )
}
