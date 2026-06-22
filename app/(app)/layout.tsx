import { createSupabaseServer } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase'
import Sidebar from './Sidebar'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: clinicas } = await supabaseAdmin
    .from('clinicas')
    .select('id, nome')
    .order('nome')

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50" style={{ fontFamily: 'Figtree, sans-serif' }}>
      <Sidebar clinicas={clinicas ?? []} email={user?.email ?? ''} />
      <div className="flex-1 overflow-y-auto">
        <main className="px-6 py-8 max-w-5xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
