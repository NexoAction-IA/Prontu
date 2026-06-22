import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'

export default async function ConfiguracoesPage() {
  const { data: clinicas } = await supabaseAdmin
    .from('clinicas')
    .select('id, nome, cidade, email, telefone, logo_url')
    .order('nome')

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-400 text-sm mt-1">Gerencie os dados de cada clínica</p>
      </div>

      <div className="space-y-3">
        {(clinicas ?? []).map(c => (
          <div
            key={c.id}
            className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                {c.logo_url ? (
                  <img src={c.logo_url} alt={c.nome} className="w-10 h-10 rounded-xl object-contain p-1" />
                ) : (
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                )}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 truncate">{c.nome}</p>
                <p className="text-xs text-gray-400 mt-0.5 truncate">
                  {[c.cidade, c.email, c.telefone].filter(Boolean).join(' · ') || 'Dados não configurados'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/clinica/${c.id}`}
                className="inline-flex items-center gap-1.5 border border-green-100 text-gray-600 px-3.5 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Pacientes
              </Link>
              <Link
                href={`/clinica/${c.id}/configurar`}
                className="inline-flex items-center gap-1.5 bg-green-600 text-white px-3.5 py-2 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors cursor-pointer shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Configurar
              </Link>
            </div>
          </div>
        ))}

        {(!clinicas || clinicas.length === 0) && (
          <div className="bg-white rounded-2xl border border-green-100 p-12 text-center shadow-sm">
            <p className="text-gray-400 text-sm">Nenhuma clínica encontrada</p>
          </div>
        )}
      </div>
    </div>
  )
}
