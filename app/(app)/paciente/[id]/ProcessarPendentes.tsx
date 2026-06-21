'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function ProcessarPendentes({ docIds }: { docIds: string[] }) {
  const router = useRouter()
  const processando = useRef(false)

  useEffect(() => {
    if (docIds.length === 0 || processando.current) return
    processando.current = true

    async function processar() {
      for (const id of docIds) {
        try {
          await fetch(`/api/documento/${id}/processar`, { method: 'POST' })
        } catch {
          // continua pro próximo mesmo se um falhar
        }
      }
      router.refresh()
    }

    processar()
  }, [docIds, router])

  return null
}
