import { createSupabaseServer } from '@/lib/supabase'
import NavUser from './NavUser'
import { LOGO_SRC } from '@/lib/logo-b64'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-full" style={{ background: '#f0fdf4' }}>
      <nav className="bg-white border-b border-green-100 px-6 py-0 sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between h-40">
          <a href="/dashboard" className="flex items-center cursor-pointer">
            <img src={LOGO_SRC} alt="Prontu" className="h-36 w-auto" />
          </a>
          <NavUser email={user?.email ?? ''} />
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  )
}
