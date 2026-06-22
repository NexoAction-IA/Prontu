'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { LOGO_SRC } from '@/lib/logo-b64'

/* ─── Particle Canvas ─── */
function ParticleCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let animId: number
    let W = canvas.offsetWidth
    let H = canvas.offsetHeight
    canvas.width = W
    canvas.height = H

    const COLORS = ['#16a34a', '#22c55e', '#4ade80', '#86efac']
    const N = Math.floor((W * H) / 14000)

    type Particle = { x: number; y: number; vx: number; vy: number; r: number; color: string }
    const particles: Particle[] = Array.from({ length: N }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2.5 + 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }))

    function draw() {
      ctx.clearRect(0, 0, W, H)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = 0.6
        ctx.fill()

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const dx = p.x - q.x
          const dy = p.y - q.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 130) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = '#16a34a'
            ctx.globalAlpha = (1 - dist / 130) * 0.2
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }
      ctx.globalAlpha = 1
      animId = requestAnimationFrame(draw)
    }

    draw()

    const onResize = () => {
      W = canvas.offsetWidth
      H = canvas.offsetHeight
      canvas.width = W
      canvas.height = H
    }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return <canvas ref={canvasRef} className={className} style={{ width: '100%', height: '100%' }} />
}

/* ─── Nav ─── */
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid #d1fae5' : 'none',
        boxShadow: scrolled ? '0 1px 20px rgba(0,0,0,0.06)' : 'none',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <img src={LOGO_SRC} alt="Prontu" className="h-9 w-auto" />
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-green-800 hover:text-green-600 transition-colors cursor-pointer px-4 py-2"
          >
            Entrar
          </Link>
          <Link
            href="/login"
            className="text-sm font-semibold bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700 transition-colors cursor-pointer shadow-sm"
          >
            Criar conta
          </Link>
        </div>
      </div>
    </header>
  )
}

/* ─── Hero ─── */
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: 'linear-gradient(145deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)' }}>
      <ParticleCanvas className="absolute inset-0" />
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-20 text-center w-full">
        <div className="inline-flex items-center gap-2 bg-white/80 border border-green-200 text-green-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 shadow-sm backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
          Sistema clínico com Inteligência Artificial
        </div>
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-green-950 leading-tight mb-6"
          style={{ fontFamily: 'Figtree, sans-serif' }}
        >
          O prontuário que
          <br />
          <span className="text-green-600">trabalha com você</span>
        </h1>
        <p className="text-lg sm:text-xl text-green-800/80 max-w-2xl mx-auto mb-10 leading-relaxed">
          Gestão de pacientes com IA para fonoaudiólogos. Evoluções organizadas, relatórios gerados em segundos e documentos centralizados. Tudo em um só lugar.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 bg-green-600 text-white text-base font-semibold px-8 py-4 rounded-2xl hover:bg-green-700 transition-all cursor-pointer shadow-lg hover:shadow-green-200 hover:shadow-xl"
          >
            Começar agora
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 bg-white/80 text-green-800 text-base font-medium px-8 py-4 rounded-2xl hover:bg-white transition-all cursor-pointer border border-green-200 backdrop-blur-sm"
          >
            Já tenho conta
          </Link>
        </div>
        <p className="text-sm text-green-700/60 mt-6">Sem cartão de crédito. Acesso imediato.</p>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 80L60 70C120 60 240 40 360 35C480 30 600 40 720 45C840 50 960 50 1080 43C1200 36 1320 22 1380 15L1440 8V80H0Z" fill="white" />
        </svg>
      </div>
    </section>
  )
}

/* ─── Stats strip ─── */
function Stats() {
  const items = [
    { num: '100+', label: 'Pacientes gerenciados' },
    { num: '3', label: 'Clínicas ativas' },
    { num: '< 30s', label: 'Para gerar um relatório' },
    { num: '0', label: 'Papéis perdidos' },
  ]
  return (
    <section className="bg-white py-12 border-b border-green-50">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
        {items.map((item) => (
          <div key={item.label}>
            <p className="text-3xl font-bold text-green-600" style={{ fontFamily: 'Figtree, sans-serif' }}>{item.num}</p>
            <p className="text-sm text-gray-500 mt-1">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─── Features ─── */
function Features() {
  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'Evoluções organizadas',
      desc: 'Registre cada sessão com estrutura clínica completa. Histórico por paciente, por data e por clínica, sempre acessível.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: 'Relatórios com IA',
      desc: 'A IA lê as evoluções e gera relatórios fonoaudiológicos completos em segundos. Você revisa, ajusta e exporta em PDF com cabeçalho da clínica.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Documentos centralizados',
      desc: 'Anamneses, avaliações, PEIs e relatórios externos. Tudo indexado e pesquisável. A IA lê os documentos e os incorpora no contexto clínico.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      title: 'Multi-clínica',
      desc: 'Gerencie múltiplas clínicas com identidades separadas. Cada unidade com seu logo, dados e papel timbrado próprio.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: 'Seguro e privado',
      desc: 'Dados armazenados com criptografia. Acesso protegido por autenticação. Compatível com os requisitos de sigilo do CFFa.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      ),
      title: 'PDF profissional',
      desc: 'Exporte relatórios com o papel timbrado da sua clínica: logo, dados de contato e formatação clínica. Pronto para entregar.',
    },
  ]

  return (
    <section className="py-24 bg-white" id="funcionalidades">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-green-600 uppercase tracking-widest mb-3">Funcionalidades</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900" style={{ fontFamily: 'Figtree, sans-serif' }}>
            Tudo que você precisa<br />em um sistema só
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-md transition-all duration-200 cursor-default"
            >
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 mb-4">
                {f.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── How it works ─── */
function HowItWorks() {
  const steps = [
    { n: '01', title: 'Cadastre seus pacientes', desc: 'Crie o perfil completo de cada paciente com dados clínicos, diagnósticos e histórico.' },
    { n: '02', title: 'Registre cada sessão', desc: 'Adicione evoluções após cada atendimento. Simples, rápido e estruturado clinicamente.' },
    { n: '03', title: 'Gere o relatório com IA', desc: 'A IA analisa todo o histórico e entrega um relatório fonoaudiológico completo para você revisar e exportar.' },
  ]

  return (
    <section className="py-24" style={{ background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)' }} id="como-funciona">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-green-600 uppercase tracking-widest mb-3">Como funciona</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900" style={{ fontFamily: 'Figtree, sans-serif' }}>
            Em 3 passos, do atendimento ao relatório
          </h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-8 relative">
          {steps.map((s, i) => (
            <div key={s.n} className="text-center relative">
              <div className="w-16 h-16 rounded-2xl bg-green-600 text-white text-xl font-bold flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-200">
                {s.n}
              </div>
              {i < steps.length - 1 && (
                <div className="hidden sm:block absolute top-8 left-[calc(50%+32px)] right-[calc(-50%+32px)] h-0.5 bg-green-100" />
              )}
              <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── CTA Band ─── */
function CTABand() {
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #14532d 0%, #166534 50%, #15803d 100%)' }}>
      <ParticleCanvas className="absolute inset-0 opacity-30" />
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Figtree, sans-serif' }}>
          Pronto para organizar<br />sua clínica?
        </h2>
        <p className="text-green-200 text-lg mb-10">
          Comece hoje e tenha o histórico completo dos seus pacientes ao alcance de um clique.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 bg-white text-green-800 text-base font-semibold px-10 py-4 rounded-2xl hover:bg-green-50 transition-colors cursor-pointer shadow-xl"
        >
          Criar minha conta grátis
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </section>
  )
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer className="bg-white border-t border-green-50 py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <img src={LOGO_SRC} alt="Prontu" className="h-7 w-auto opacity-80" />
        <p className="text-sm text-gray-400">
          Sistema de prontuário eletrônico para fonoaudiólogos. useprontu.com
        </p>
        <div className="flex gap-5 text-sm text-gray-400">
          <Link href="/login" className="hover:text-green-600 transition-colors cursor-pointer">Entrar</Link>
          <a href="mailto:contato@useprontu.com" className="hover:text-green-600 transition-colors cursor-pointer">Contato</a>
        </div>
      </div>
    </footer>
  )
}

/* ─── Main ─── */
export default function LandingPage() {
  return (
    <div style={{ fontFamily: 'Figtree, sans-serif' }}>
      <Nav />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <CTABand />
      <Footer />
    </div>
  )
}
