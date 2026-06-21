'use client'

import { use, useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ConfigurarClinicaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const [form, setForm] = useState({ nome: '', cidade: '', telefone: '', email: '' })
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const logoRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch(`/api/clinica/${id}`)
      .then(r => r.json())
      .then(d => {
        setForm({ nome: d.nome || '', cidade: d.cidade || '', telefone: d.telefone || '', email: d.email || '' })
        setLogoUrl(d.logo_url || null)
      })
  }, [id])

  async function salvarDados(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMsg(null)
    const res = await fetch(`/api/clinica/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaving(false)
    if (res.ok) {
      setMsg('Dados salvos com sucesso.')
      router.refresh()
    } else {
      const d = await res.json().catch(() => ({}))
      setMsg(d.error || 'Erro ao salvar.')
    }
  }

  async function enviarLogo() {
    if (!logoFile) return
    setUploading(true)
    setMsg(null)
    const fd = new FormData()
    fd.append('logo', logoFile)
    const res = await fetch(`/api/clinica/${id}`, { method: 'PUT', body: fd })
    setUploading(false)
    if (res.ok) {
      const d = await res.json()
      setLogoUrl(d.logo_url)
      setLogoFile(null)
      setMsg('Logo atualizado com sucesso.')
    } else {
      const d = await res.json().catch(() => ({}))
      setMsg(d.error || 'Erro ao enviar logo.')
    }
  }

  return (
    <div className="max-w-lg">
      <Link href={`/clinica/${id}`} className="inline-flex items-center gap-1.5 text-sm text-green-600 hover:text-green-800 mb-6 transition-colors cursor-pointer">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Voltar
      </Link>

      <h1 className="text-2xl font-bold text-green-900 mb-1" style={{ fontFamily: 'Figtree, sans-serif' }}>Configurar clínica</h1>
      <p className="text-gray-500 text-sm mb-6">Logo e dados usados no papel timbrado dos relatórios.</p>

      {/* Logo */}
      <div className="bg-white rounded-2xl border border-green-100 p-6 mb-4 shadow-sm space-y-4">
        <h2 className="font-semibold text-green-900 text-sm">Logo da clínica</h2>
        <div className="flex items-center gap-4">
          <div
            onClick={() => logoRef.current?.click()}
            className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-green-300 transition-colors overflow-hidden bg-gray-50"
          >
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
            ) : (
              <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <input
              ref={logoRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              className="hidden"
              onChange={e => setLogoFile(e.target.files?.[0] || null)}
            />
            {logoFile ? (
              <div className="space-y-2">
                <p className="text-sm text-green-700 font-medium">{logoFile.name}</p>
                <button
                  onClick={enviarLogo}
                  disabled={uploading}
                  className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {uploading ? 'Enviando...' : 'Salvar logo'}
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Clique na imagem para selecionar.<br />PNG, JPG ou SVG. Recomendado 400×200px.</p>
            )}
          </div>
        </div>
      </div>

      {/* Dados */}
      <form onSubmit={salvarDados} className="bg-white rounded-2xl border border-green-100 p-6 shadow-sm space-y-4">
        <h2 className="font-semibold text-green-900 text-sm">Dados da clínica</h2>

        {[
          { label: 'Nome', key: 'nome', placeholder: 'Ex: Integra Núcleo de Desenvolvimento' },
          { label: 'Cidade', key: 'cidade', placeholder: 'Ex: Sumaré' },
          { label: 'Telefone', key: 'telefone', placeholder: 'Ex: 19 97128-3056' },
          { label: 'E-mail', key: 'email', placeholder: 'Ex: integra.fono24@gmail.com' },
        ].map(({ label, key, placeholder }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
              type="text"
              value={form[key as keyof typeof form]}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
              placeholder={placeholder}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
            />
          </div>
        ))}

        {msg && (
          <p className={`text-sm px-4 py-3 rounded-xl border ${msg.includes('sucesso') ? 'text-green-700 bg-green-50 border-green-200' : 'text-red-600 bg-red-50 border-red-200'}`}>
            {msg}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-green-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors cursor-pointer disabled:opacity-50 shadow-sm"
        >
          {saving ? 'Salvando...' : 'Salvar dados'}
        </button>
      </form>
    </div>
  )
}
