import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { chromium } from 'playwright-core'
import chromiumLambda from '@sparticuz/chromium'

export const maxDuration = 60

function markdownToHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^(\d+\.\s+.+)$/gm, '<p class="section-header">$1</p>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
}

function gerarHtml(params: {
  nomePaciente: string
  dataNascimento: string | null
  idade: number | null
  clinicaNome: string
  logoUrl: string | null
  telefone: string | null
  email: string | null
  cidade: string | null
  texto: string
}): string {
  const { nomePaciente, dataNascimento, idade, clinicaNome, logoUrl, telefone, email, cidade, texto } = params

  const hoje = new Date()
  const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
  const dataFormatada = `${hoje.getDate()} de ${meses[hoje.getMonth()]} de ${hoje.getFullYear()}`
  const cidadeStr = cidade || clinicaNome

  const dataNasc = dataNascimento
    ? new Date(dataNascimento + 'T12:00:00').toLocaleDateString('pt-BR')
    : ''
  const idadeStr = idade !== null ? `${idade} anos` : ''

  const textoFormatado = markdownToHtml(texto)

  const footerText = [
    telefone ? `Telefone: ${telefone}` : '',
    email || '',
  ].filter(Boolean).join(' / ')

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  @page { margin: 18mm 20mm 28mm 20mm; size: A4; }
  body { font-family: Arial, Helvetica, sans-serif; font-size: 10.5pt; color: #222; line-height: 1.55; }

  .header { text-align: center; padding-bottom: 14px; }
  .logo { max-height: 85px; max-width: 220px; object-fit: contain; }
  .clinic-name { font-size: 16pt; font-weight: bold; color: #1a7a74; }

  .divider { border: none; border-top: 2px solid #1a7a74; margin: 12px 0; }

  .date-line { text-align: right; font-size: 10pt; margin-bottom: 18px; }
  .report-title { text-align: center; font-size: 13pt; font-weight: bold; margin-bottom: 22px; letter-spacing: 0.3px; }

  .content p { margin-bottom: 10px; }
  .content p.section-header { font-weight: bold; margin-top: 16px; margin-bottom: 4px; }
  .content strong { font-weight: bold; }

  .identification { margin-bottom: 20px; }
  .identification .field { margin-bottom: 3px; font-size: 10.5pt; }
  .identification .label { font-weight: bold; }

  .footer {
    position: fixed;
    bottom: 8mm;
    left: 20mm;
    right: 20mm;
    border-top: 1.5px solid #1a7a74;
    padding-top: 6px;
    text-align: center;
    font-size: 9pt;
    color: #1a7a74;
    font-weight: 500;
  }
</style>
</head>
<body>

<div class="header">
  ${logoUrl
    ? `<img src="${logoUrl}" class="logo" alt="${clinicaNome}" />`
    : `<div class="clinic-name">${clinicaNome}</div>`
  }
</div>

<hr class="divider" />

<div class="date-line">${cidadeStr}, ${dataFormatada}.</div>

<div class="report-title">RELATÓRIO DE AVALIAÇÃO FONOAUDIOLÓGICA</div>

<div class="identification">
  <div class="field"><span class="label">Paciente:</span> ${nomePaciente}</div>
  ${dataNasc ? `<div class="field"><span class="label">Data de Nascimento:</span> ${dataNasc}</div>` : ''}
  ${idadeStr ? `<div class="field"><span class="label">Idade:</span> ${idadeStr}</div>` : ''}
  <div class="field"><span class="label">Fonoaudióloga Responsável:</span> Tayrini Lenart</div>
</div>

<div class="content">
  <p>${textoFormatado}</p>
</div>

${footerText ? `<div class="footer">${footerText}</div>` : ''}

</body>
</html>`
}

export async function POST(req: Request) {
  const { paciente_id, texto } = await req.json()
  if (!paciente_id || !texto) {
    return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
  }

  const { data: paciente } = await supabaseAdmin
    .from('pacientes')
    .select('nome, data_nascimento, clinica_id')
    .eq('id', paciente_id)
    .single()

  if (!paciente) return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 })

  const { data: clinica } = await supabaseAdmin
    .from('clinicas')
    .select('nome, logo_url, telefone, email, cidade')
    .eq('id', paciente.clinica_id)
    .single()

  const idade = paciente.data_nascimento
    ? Math.floor((Date.now() - new Date(paciente.data_nascimento).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
    : null

  const html = gerarHtml({
    nomePaciente: paciente.nome,
    dataNascimento: paciente.data_nascimento,
    idade,
    clinicaNome: clinica?.nome ?? 'Clínica',
    logoUrl: clinica?.logo_url ?? null,
    telefone: clinica?.telefone ?? null,
    email: clinica?.email ?? null,
    cidade: clinica?.cidade ?? null,
    texto,
  })

  const isLocal = process.env.NODE_ENV === 'development'
  const browser = await chromium.launch({
    args: isLocal ? ['--no-sandbox', '--disable-setuid-sandbox'] : chromiumLambda.args,
    executablePath: isLocal
      ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      : await chromiumLambda.executablePath(),
    headless: true,
  })

  try {
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'domcontentloaded' })
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '18mm', right: '20mm', bottom: '28mm', left: '20mm' },
    })

    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="relatorio-${paciente.nome.replace(/\s+/g, '-')}.pdf"`,
      },
    })
  } finally {
    await browser.close()
  }
}
