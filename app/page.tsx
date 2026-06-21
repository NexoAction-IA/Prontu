import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'

export default async function Home() {
  const { data: clinicas } = await supabaseAdmin
    .from('clinicas')
    .select('*')
    .order('nome')

  return (
    <div>
      <div className="mb-8">
        <p className="text-green-600 text-sm font-medium mb-1">Bom dia, Tayrini</p>
        <h1 className="text-2xl font-bold text-green-900" style={{ fontFamily: 'Figtree, sans-serif' }}>
          Onde você está atendendo hoje?
        </h1>
      </div>

      {clinicas && clinicas.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {clinicas.map((c: { id: string; nome: string }) => (
            <Link
              key={c.id}
              href={`/clinica/${c.id}`}
              className="group block bg-white rounded-2xl border border-green-100 p-6 hover:border-green-300 hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors duration-200">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="font-semibold text-green-900 group-hover:text-green-700 transition-colors" style={{ fontFamily: 'Figtree, sans-serif' }}>
                {c.nome}
              </h2>
              <p className="text-sm text-green-500 mt-1 flex items-center gap-1">
                Ver pacientes
                <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-800 text-sm">
          <p className="font-medium mb-1">Banco de dados não configurado ainda.</p>
          <p>Rode o arquivo <code className="bg-amber-100 px-1 rounded">supabase-schema.sql</code> no SQL Editor do Supabase.</p>
        </div>
      )}
    </div>
  )
}
