'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { LOGO_SRC } from '@/lib/logo-b64'

type Clinica = { id: string; nome: string }

export default function Sidebar({ clinicas, email }: { clinicas: Clinica[]; email: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const [saindo, setSaindo] = useState(false)
  const [clinicasOpen, setClinicasOpen] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )

  async function sair() {
    setSaindo(true)
    await supabase.auth.signOut()
    router.push('/')
  }

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/')

  return (
    <aside className="w-60 shrink-0 h-screen bg-white border-r border-green-100 flex flex-col">
      {/* Logo */}
      <div className="px-5 h-16 flex items-center border-b border-green-50 shrink-0">
        <Link href="/dashboard">
          <img src={LOGO_SRC} alt="Prontu" className="h-8 w-auto" />
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
        {/* Painel */}
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
            pathname === '/dashboard'
              ? 'bg-green-50 text-green-700'
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Painel
        </Link>

        {/* Pacientes */}
        <Link
          href="/pacientes"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
            isActive('/pacientes') || isActive('/paciente')
              ? 'bg-green-50 text-green-700'
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Pacientes
        </Link>

        {/* Clínicas section */}
        <div className="pt-3">
          <button
            onClick={() => setClinicasOpen(!clinicasOpen)}
            className="flex items-center justify-between w-full px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-600 transition-colors"
          >
            <span>Clínicas</span>
            <svg
              className={`w-3 h-3 transition-transform duration-200 ${clinicasOpen ? '' : '-rotate-90'}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {clinicasOpen && (
            <div className="mt-1 space-y-0.5">
              {clinicas.map(c => {
                const active = isActive(`/clinica/${c.id}`)
                return (
                  <Link
                    key={c.id}
                    href={`/clinica/${c.id}`}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all duration-150 cursor-pointer ${
                      active
                        ? 'bg-green-50 text-green-700 font-medium'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                      active ? 'bg-green-200 text-green-700' : 'bg-green-100 text-green-600'
                    }`}>
                      {c.nome[0].toUpperCase()}
                    </div>
                    <span className="truncate">{c.nome}</span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Separator + Configurações */}
        <div className="pt-3">
          <div className="h-px bg-green-50 mx-1 mb-3" />
          <Link
            href="/configuracoes"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
              isActive('/configuracoes') || pathname.includes('/configurar')
                ? 'bg-green-50 text-green-700'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Configurações
          </Link>
        </div>
      </nav>

      {/* User footer */}
      <div className="border-t border-green-100 p-3 shrink-0">
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center shrink-0">
            <span className="text-xs font-semibold text-white">{email?.[0]?.toUpperCase() ?? 'U'}</span>
          </div>
          <p className="text-xs text-gray-600 truncate flex-1">{email}</p>
          <button
            onClick={sair}
            disabled={saindo}
            title="Sair"
            aria-label="Sair"
            className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-150 cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  )
}
