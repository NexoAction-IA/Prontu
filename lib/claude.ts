import Anthropic from '@anthropic-ai/sdk'
import mammoth from 'mammoth'
import { FONO_KNOWLEDGE } from './fono-knowledge'

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function processarEvolucao(relatoBruto: string, historico: string): Promise<string> {
  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Você é um assistente especializado em fonoaudiologia. Reescreva o relato abaixo em linguagem fonoaudiológica técnica e profissional, estruturando em: objetivos da sessão, estratégias terapêuticas utilizadas, resposta do paciente e observações clínicas relevantes.

${historico ? `Histórico recente do paciente:\n${historico}\n\n` : ''}Relato da sessão:\n${relatoBruto}

Devolva apenas o texto estruturado, sem explicações adicionais.`,
      },
    ],
  })

  return msg.content[0].type === 'text' ? msg.content[0].text : ''
}

export async function extrairTextoPDF(pdfBase64: string): Promise<string> {
  const msg = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'base64',
              media_type: 'application/pdf',
              data: pdfBase64,
            },
          },
          {
            type: 'text',
            text: 'Extraia e organize todas as informações relevantes deste documento fonoaudiológico. Mantenha os dados de identificação do paciente, datas, quem encaminhou, diagnósticos, observações clínicas e qualquer informação relevante para o acompanhamento terapêutico. Formate de forma estruturada e clara.',
          },
        ],
      },
    ],
  })

  return msg.content[0].type === 'text' ? msg.content[0].text : ''
}

export async function extrairTextoDocx(buffer: Buffer): Promise<string> {
  const { value: textoRaw } = await mammoth.extractRawText({ buffer })

  const msg = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `Organize as informações abaixo extraídas de um documento fonoaudiológico (Word). Mantenha todos os dados relevantes: identificação do paciente, datas, nome da clínica ou profissional de origem, diagnósticos, observações clínicas e histórico de atendimento. Formate de forma estruturada e clara.\n\n${textoRaw}`,
      },
    ],
  })

  return msg.content[0].type === 'text' ? msg.content[0].text : textoRaw
}

export async function gerarRelatorio(params: {
  paciente: { nome: string; data_nascimento: string; diagnostico: string }
  anamnese: string
  avaliacoes: string[]
  historico: string[]
  pei: string[]
  evolucoes: string[]
  promptComplementar: string
  modelo: string
}): Promise<string> {
  const idadeMs = Date.now() - new Date(params.paciente.data_nascimento).getTime()
  const idadeAnos = Math.floor(idadeMs / (1000 * 60 * 60 * 24 * 365.25))
  const idadeMeses = Math.floor(idadeMs / (1000 * 60 * 60 * 24 * 30.44))

  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8192,
    messages: [
      {
        role: 'user',
        content: `Você é uma fonoaudióloga clínica especializada em linguagem infantil, TEA, Síndrome de Down e desenvolvimento neuropsicomotor. Você tem conhecimento profundo de todos os protocolos de avaliação fonoaudiológica utilizados no Brasil, suas normas, tabelas e interpretação clínica. Use a base de conhecimento abaixo como referência técnica para gerar o relatório.

${FONO_KNOWLEDGE}

---
Preencha o relatório fonoaudiológico abaixo com linguagem técnica, profissional e justificada, baseando-se nos dados fornecidos.

${params.promptComplementar ? `⚠️ INSTRUÇÕES PRIORITÁRIAS DA FONOAUDIÓLOGA (leia primeiro e atenda com prioridade):
${params.promptComplementar}

` : ''}REGRAS GERAIS:
- Não invente informações. Se algo não constar nos documentos, escreva "Informação não disponível nos documentos".
- Use linguagem técnica fonoaudiológica em todas as seções.
- O paciente tem ${idadeAnos} anos e ${idadeMeses % 12} meses — use sempre como referência para avaliar adequação ao desenvolvimento.

INSTRUÇÕES POR SEÇÃO:

[Seção 1 — Identificação]
Preencha com os dados do paciente disponíveis. "Fonoaudióloga Responsável" é sempre Tayrini Lenart.

[Seção 2 — Queixa Principal / Encaminhamento]
Extraia da anamnese: o que os responsáveis relataram como queixa, quem encaminhou e o motivo. Escreva em texto corrido.

[Seção 3 — Resumo da Anamnese]
Escreva em texto corrido e justificado (sem tópicos/bullets). Sintetize as informações relevantes da anamnese: gestação, parto, desenvolvimento neuropsicomotor, alimentação, sono, histórico de saúde, aspectos comportamentais/sensoriais e comunicação relatada pelos responsáveis.

[Seção 4 — Avaliação Observacional]
Use TANTO os documentos de avaliação QUANTO os registros de evolução semanal. As evoluções contêm observações clínicas diretas do comportamento nas sessões — são fonte primária para esta seção.
Descreva de forma narrativa e técnica: adaptação ao ambiente terapêutico, contato visual, intenção comunicativa, atenção compartilhada, resposta ao nome e a comandos simples e múltiplos, exploração dos brinquedos (funcional ou não funcional), brincadeira simbólica, presença de estereotipias ou comportamentos repetitivos, estratégias comunicativas utilizadas (gestos, vocalizações, palavras, CAA).

[Seção 5 — Procedimentos e Protocolos Utilizados]
Liste APENAS os protocolos mencionados nos documentos. Para cada um, inclua o nome completo e uma descrição do que avalia. Use o glossário abaixo:
- ADL (Avaliação do Desenvolvimento da Linguagem — Hage, 2000): avalia a linguagem oral nas dimensões compreensiva e expressiva em crianças de 2 a 12 anos.
- LAVE (Lista de Avaliação do Vocabulário Expressivo): avalia o vocabulário expressivo por categorias semânticas.
- ABFW (Befi-Lopes et al.): instrumento padronizado que avalia fonologia, vocabulário e pragmática na linguagem infantil.
- PROC (Protocolo de Observação do Comportamento Comunicativo): avalia o perfil comunicativo por observação direta da interação criança-terapeuta.
- MIOF (Motricidade Orofacial): avalia estruturas e funções do sistema estomatognático (lábios, língua, bochechas, palato, deglutição, mastigação, respiração).
- MPGR (Motor Planning and Grading Research Protocol): avalia planejamento motor oral e gradação de movimentos.
- Protocolo de Habilidades Comunicativas e Linguísticas: avalia habilidades pré-linguísticas, comunicativas e linguísticas em crianças em desenvolvimento atípico.
- Avaliação Observacional Lúdica: avaliação informal das habilidades comunicativas, cognitivas e sociais por meio do brincar.
- Se o protocolo não estiver na lista, descreva com base no seu conhecimento clínico.

[Seção 6 — Resultados dos Protocolos Aplicados]
Para cada protocolo listado na Seção 5:
1. Informe se foi aplicado integral ou parcialmente e por quê.
2. Descreva os principais achados.
3. Compare com o esperado para ${idadeAnos} anos e ${idadeMeses % 12} meses, usando seu conhecimento das normas de cada instrumento.
4. Para o ABFW: organize os resultados em tabela (Área | Resultado obtido | Esperado para a idade | Adequado?).
5. Indique limitações durante a aplicação (atenção, engajamento, recusa, etc.) se mencionadas.

[Seção 7 — Hipótese Diagnóstica]
Com base em TODA a avaliação (anamnese + avaliação observacional + resultados dos protocolos), formule a hipótese diagnóstica fonoaudiológica com código CID-10 ou CID-11. Justifique com base nos achados clínicos.

[Seção 8 — Conclusão]
Síntese clara em texto corrido: quadro fonoaudiológico atual, principais prejuízos e potencialidades do paciente.

[Seção 9 — Conduta Fonoaudiológica]
${params.pei.length > 0 ? 'Use os objetivos do PEI para alinhar os objetivos terapêuticos fonoaudiológicos com a equipe interdisciplinar.' : ''}
Inclua: frequência indicada, objetivos iniciais, orientações familiares, encaminhamentos interdisciplinares necessários, reavaliação periódica.

[Seção 10 — Observações Finais]
Informações complementares relevantes, incluindo trajetória de atendimento em outras clínicas (se houver histórico externo), tempo total de acompanhamento e observações da equipe interdisciplinar.

---
MODELO DE RELATÓRIO A PREENCHER:
${params.modelo}

---
DADOS DO PACIENTE:
- Nome: ${params.paciente.nome}
- Idade: ${idadeAnos} anos e ${idadeMeses % 12} meses
- Diagnóstico: ${params.paciente.diagnostico}

ANAMNESE:
${params.anamnese}

DOCUMENTOS DE AVALIAÇÃO FONOAUDIOLÓGICA:
${params.avaliacoes.length > 0 ? params.avaliacoes.join('\n\n---\n\n') : 'Nenhum documento de avaliação disponível.'}

${params.historico.length > 0 ? `HISTÓRICO DE ATENDIMENTOS ANTERIORES (outras clínicas — contexto temporal, NÃO condição atual):
Regra: formule SEMPRE no passado. Ex: "Em [data], na [clínica], foi identificado que o paciente apresentava...". Nunca afirme condição atual com base nesses documentos. Use na Seção 10 para mostrar trajetória.
${params.historico.join('\n\n---\n\n')}` : ''}

${params.pei.length > 0 ? `PEI — PLANO DE INTERVENÇÃO INDIVIDUALIZADO (objetivos da equipe interdisciplinar — use na Seção 9):
${params.pei.join('\n\n---\n\n')}` : ''}

${params.evolucoes.length > 0 ? `EVOLUÇÕES SEMANAIS (registros das sessões com esta fonoaudióloga — use especialmente na Seção 4):
${params.evolucoes.join('\n\n')}` : ''}

Preencha o modelo de relatório acima com todas as informações disponíveis.`,
      },
    ],
  })

  return msg.content[0].type === 'text' ? msg.content[0].text : ''
}
