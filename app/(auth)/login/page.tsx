'use client'

import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { LOGO_SRC } from '@/lib/logo-b64'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )

  async function entrar(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErro(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
    if (error) {
      setErro('E-mail ou senha incorretos.')
      setLoading(false)
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 60%, #bbf7d0 100%)' }}>

      {/* ECG background SVG */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" preserveAspectRatio="xMidYMid slice">
        <polyline
          points="0,200 80,200 100,160 120,240 140,80 160,320 180,200 260,200 280,170 300,230 320,140 340,260 360,200 440,200 460,175 480,225 500,150 520,250 540,200 640,200"
          fill="none"
          stroke="#16a34a"
          strokeWidth="2"
          style={{ transform: 'scale(2)', transformOrigin: 'center' }}
        />
      </svg>

      {/* Floating health icons */}
      <div className="absolute top-16 left-16 w-10 h-10 rounded-xl bg-green-100/60 flex items-center justify-center animate-bounce" style={{ animationDuration: '3s' }}>
        <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </div>
      <div className="absolute bottom-20 right-20 w-10 h-10 rounded-xl bg-green-100/60 flex items-center justify-center animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
        <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <div className="absolute top-1/3 right-12 w-8 h-8 rounded-lg bg-green-100/60 flex items-center justify-center animate-bounce" style={{ animationDuration: '5s', animationDelay: '0.5s' }}>
        <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img src={LOGO_SRC} alt="Prontu" className="h-16 w-auto mb-2" />
          <p className="text-gray-500 text-sm mt-1">Entre na sua conta para continuar</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-8">
          <form onSubmit={entrar} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Senha</label>
              <div className="relative">
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {mostrarSenha ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {erro && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors cursor-pointer disabled:opacity-50 shadow-sm"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>

        <div className="text-center mt-6 flex items-center justify-center gap-4">
          <a href="/" className="text-xs text-gray-400 hover:text-green-600 transition-colors cursor-pointer">
            Voltar ao site
          </a>
          <span className="text-gray-200">|</span>
          <p className="text-xs text-gray-400">Prontu — useprontu.com</p>
        </div>
      </div>
    </div>
  )
}
