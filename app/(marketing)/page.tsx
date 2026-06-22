import type { Metadata } from 'next'
import LandingPage from './LandingPage'

export const metadata: Metadata = {
  title: 'Prontu — Prontuário clínico inteligente para fonoaudiólogos',
  description: 'Gerencie pacientes, registre evoluções e gere relatórios com IA em segundos. O sistema de prontuário eletrônico feito para fonoaudiólogos.',
  keywords: ['prontuário eletrônico', 'fonoaudiologia', 'gestão de pacientes', 'relatório fonoaudiológico', 'sistema clínico fonoaudiologia', 'prontuário fonoaudiólogo'],
  authors: [{ name: 'Prontu' }],
  openGraph: {
    title: 'Prontu — Prontuário clínico inteligente para fonoaudiólogos',
    description: 'Gerencie pacientes, registre evoluções e gere relatórios com IA em segundos.',
    url: 'https://useprontu.com',
    siteName: 'Prontu',
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prontu — Prontuário clínico inteligente',
    description: 'Gestão de pacientes com IA para fonoaudiólogos.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: 'https://useprontu.com',
  },
}

export default function Page() {
  return <LandingPage />
}
