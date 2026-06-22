import { supabaseAdmin } from '@/lib/supabase'
import NovoPacienteForm from './NovoPacienteForm'

export default async function NovoPacientePage() {
  const { data: clinicas } = await supabaseAdmin
    .from('clinicas')
    .select('id, nome')
    .order('nome')

  return <NovoPacienteForm clinicas={clinicas ?? []} />
}
