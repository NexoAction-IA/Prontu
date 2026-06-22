import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'

type EvolucaoRecente = {
  id: string
  data_sessao: string
  desregulou: boolean
  teve_melhora: boolean
  pacientes: {
    id: string
    nome: string
    clinicas: { nome: string }
  }
}

function StatCard({
  label,
  value,
  icon,
  bg,
  iconColor,
}: {
  label: string
  value: number
  icon: React.ReactNode
  bg: string
  iconColor: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm">
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
        <span className={iconColor}>{icon}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
    </div>
  )
}

export default async function Dashboard() {
  const hoje = new Date().toISOString().split('T')[0]

  const [
    { count: totalPacientes },
    { count: totalClinicas },
    { count: totalDocs },
    { count: evolHoje },
    { data: evolRecentes },
  ] = await Promise.all([
    supabaseAdmin.from('pacientes').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('clinicas').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('documentos').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('evolucoes').select('*', { count: 'exact', head: true }).eq('data_sessao', hoje),
    supabaseAdmin
      .from('evolucoes')
      .select('id, data_sessao, desregulou, teve_melhora, pacientes(id, nome, clinicas(nome))')
      .order('data_sessao', { ascending: false })
      .limit(6),
  ])

  const data = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Painel</h1>
        <p className="text-gray-400 text-sm mt-1 capitalize">{data}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Pacientes ativos"
          value={totalPacientes ?? 0}
          bg="bg-green-50"
          iconColor="text-green-600"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
        <StatCard
          label="Evoluções hoje"
          value={evolHoje ?? 0}
          bg="bg-blue-50"
          iconColor="text-blue-500"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
        <StatCard
          label="Documentos"
          value={totalDocs ?? 0}
          bg="bg-purple-50"
          iconColor="text-purple-500"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatCard
          label="Clínicas"
          value={totalClinicas ?? 0}
          bg="bg-amber-50"
          iconColor="text-amber-500"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />
      </div>

      {/* Evoluções recentes */}
      <div className="bg-white rounded-2xl border border-green-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-green-50">
          <h2 className="font-semibold text-gray-900 text-sm">Evoluções recentes</h2>
          <Link
            href="/pacientes"
            className="text-xs text-green-600 hover:text-green-800 font-medium transition-colors cursor-pointer"
          >
            Ver todos os pacientes
          </Link>
        </div>

        {evolRecentes && evolRecentes.length > 0 ? (
          <div>
            {(evolRecentes as unknown as EvolucaoRecente[]).map((ev, idx) => {
              const p = ev.pacientes
              const iniciais = p?.nome?.split(' ').map(n => n[0]).slice(0, 2).join('') ?? '?'
              return (
                <Link
                  key={ev.id}
                  href={`/paciente/${p?.id}`}
                  className={`flex items-center justify-between px-6 py-4 hover:bg-green-50 transition-colors duration-150 cursor-pointer group ${idx !== 0 ? 'border-t border-green-50' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <span className="text-sm font-semibold text-green-700">{iniciais}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 group-hover:text-green-700 transition-colors">
                        {p?.nome ?? 'Paciente'}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {p?.clinicas?.nome} · {new Date(ev.data_sessao + 'T12:00:00').toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {ev.desregulou && (
                      <span className="text-xs bg-red-50 text-red-500 px-2.5 py-0.5 rounded-full border border-red-100">
                        Desregulou
                      </span>
                    )}
                    {ev.teve_melhora && (
                      <span className="text-xs bg-green-50 text-green-600 px-2.5 py-0.5 rounded-full border border-green-200">
                        Melhora
                      </span>
                    )}
                    <svg className="w-4 h-4 text-gray-300 group-hover:text-green-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-14">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <p className="text-gray-400 text-sm">Nenhuma evolução registrada ainda</p>
            <Link href="/pacientes" className="text-green-600 text-sm mt-2 block hover:text-green-800 transition-colors cursor-pointer">
              Ver pacientes →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
