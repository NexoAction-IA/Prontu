import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'

type Paciente = {
  id: string
  nome: string
  diagnostico: string
  data_nascimento: string
  clinica_id: string
  clinicas: { id: string; nome: string }
}

export default async function PacientesPage() {
  const { data: raw } = await supabaseAdmin
    .from('pacientes')
    .select('id, nome, diagnostico, data_nascimento, clinica_id, clinicas(id, nome)')
    .order('nome')

  const pacientes = (raw ?? []) as unknown as Paciente[]

  // Group by clinic
  const porClinica: Record<string, { nome: string; id: string; pacientes: Paciente[] }> = {}
  for (const p of pacientes) {
    const cid = p.clinica_id
    if (!porClinica[cid]) {
      porClinica[cid] = { nome: p.clinicas?.nome ?? 'Sem clínica', id: p.clinicas?.id ?? cid, pacientes: [] }
    }
    porClinica[cid].pacientes.push(p)
  }

  const total = pacientes.length

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pacientes</h1>
          <p className="text-gray-400 text-sm mt-1">
            {total} paciente{total !== 1 ? 's' : ''} no total
          </p>
        </div>
        <Link
          href="/paciente/novo"
          className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors duration-150 cursor-pointer shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Novo paciente
        </Link>
      </div>

      {Object.keys(porClinica).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(porClinica).map(([clinicaId, grupo]) => (
            <div key={clinicaId}>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-6 h-6 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-green-700">{grupo.nome[0]}</span>
                </div>
                <h2 className="text-sm font-semibold text-gray-700">{grupo.nome}</h2>
                <span className="text-xs text-gray-400">
                  {grupo.pacientes.length} paciente{grupo.pacientes.length !== 1 ? 's' : ''}
                </span>
                <Link
                  href={`/clinica/${grupo.id}/novo-paciente`}
                  className="ml-auto text-xs text-green-600 hover:text-green-800 font-medium transition-colors cursor-pointer"
                >
                  + Adicionar
                </Link>
              </div>

              <div className="bg-white rounded-2xl border border-green-100 overflow-hidden shadow-sm">
                {grupo.pacientes.map((p, idx) => {
                  const idade = p.data_nascimento
                    ? Math.floor((Date.now() - new Date(p.data_nascimento).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
                    : null
                  const iniciais = p.nome.split(' ').map((n: string) => n[0]).slice(0, 2).join('')

                  return (
                    <Link
                      key={p.id}
                      href={`/paciente/${p.id}`}
                      className={`flex items-center justify-between px-5 py-3.5 hover:bg-green-50 transition-colors duration-150 cursor-pointer group ${idx !== 0 ? 'border-t border-green-50' : ''}`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                          <span className="text-sm font-semibold text-green-700">{iniciais}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 group-hover:text-green-700 transition-colors">
                            {p.nome}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {p.diagnostico || 'Sem diagnóstico'}
                            {idade !== null ? ` · ${idade} anos` : ''}
                          </p>
                        </div>
                      </div>
                      <svg className="w-4 h-4 text-gray-300 group-hover:text-green-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-green-100 p-16 text-center shadow-sm">
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">Nenhum paciente cadastrado</p>
          <p className="text-sm text-gray-400 mt-1 mb-5">Adicione o primeiro paciente de uma clínica</p>
          <Link
            href="/paciente/novo"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Novo paciente
          </Link>
        </div>
      )}
    </div>
  )
}
