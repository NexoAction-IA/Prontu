import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function ClinicaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [{ data: clinica }, { data: pacientes }] = await Promise.all([
    supabaseAdmin.from('clinicas').select('*').eq('id', id).single(),
    supabaseAdmin.from('pacientes').select('*').eq('clinica_id', id).order('nome'),
  ])

  if (!clinica) notFound()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-green-600 hover:text-green-800 mb-2 transition-colors cursor-pointer">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Clínicas
          </Link>
          <h1 className="text-2xl font-bold text-green-900" style={{ fontFamily: 'Figtree, sans-serif' }}>{clinica.nome}</h1>
          <p className="text-green-600 text-sm mt-1">
            {pacientes?.length ?? 0} paciente{(pacientes?.length ?? 0) !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/clinica/${id}/configurar`}
            className="inline-flex items-center gap-2 bg-white border border-green-200 text-green-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-green-50 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Configurar
          </Link>
          <Link
            href={`/clinica/${id}/novo-paciente`}
            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors duration-200 shadow-sm cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Novo paciente
          </Link>
        </div>
      </div>

      {pacientes && pacientes.length > 0 ? (
        <div className="bg-white rounded-2xl border border-green-100 overflow-hidden shadow-sm">
          {pacientes.map((p: { id: string; nome: string; diagnostico: string; data_nascimento: string }, idx: number) => {
            const idade = p.data_nascimento
              ? Math.floor((Date.now() - new Date(p.data_nascimento).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
              : null

            return (
              <Link
                key={p.id}
                href={`/paciente/${p.id}`}
                className={`flex items-center justify-between px-6 py-4 hover:bg-green-50 transition-colors duration-150 cursor-pointer group ${idx !== 0 ? 'border-t border-green-50' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-green-700">
                      {p.nome.split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 group-hover:text-green-700 transition-colors">{p.nome}</p>
                    <p className="text-sm text-gray-500">
                      {p.diagnostico || 'Sem diagnóstico'}
                      {idade !== null ? ` · ${idade} anos` : ''}
                    </p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-300 group-hover:text-green-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-green-100">
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">Nenhum paciente cadastrado</p>
          <p className="text-sm text-gray-400 mt-1 mb-4">Adicione o primeiro paciente desta clínica</p>
          <Link href={`/clinica/${id}/novo-paciente`} className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors cursor-pointer">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Novo paciente
          </Link>
        </div>
      )}
    </div>
  )
}
