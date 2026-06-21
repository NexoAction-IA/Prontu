'use client'

import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function NavUser({ email }: { email: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function sair() {
    setLoading(true)
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    )
    await supabase.auth.signOut()
    router.push('/login')
  }

  const inicial = email?.[0]?.toUpperCase() ?? 'U'

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center">
          <span className="text-xs font-semibold text-white">{inicial}</span>
        </div>
        <span className="text-sm text-green-800 font-medium hidden sm:block">{email}</span>
      </div>
      <button
        onClick={sair}
        disabled={loading}
        className="text-xs text-gray-400 hover:text-red-500 transition-colors cursor-pointer disabled:opacity-50"
      >
        Sair
      </button>
    </div>
  )
}
