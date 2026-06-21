// Base de conhecimento clínico em fonoaudiologia
// Utilizada como contexto especializado no prompt de geração de relatórios

export const FONO_KNOWLEDGE = `
=== BASE DE CONHECIMENTO CLÍNICO — FONOAUDIOLOGIA ===

## 1. MARCOS DO DESENVOLVIMENTO DA LINGUAGEM (SBFa / CFF 2023)

| Idade       | Compreensão                                              | Expressão                                                              | Alertas                                                          |
|-------------|----------------------------------------------------------|------------------------------------------------------------------------|------------------------------------------------------------------|
| 0–3 meses   | Reage a sons; acalma com voz familiar                    | Choro diferenciado; sons vegetativos                                   | Ausência total de reação a sons                                  |
| 3–6 meses   | Localiza fonte sonora; responde ao nome                  | Balbucios vocálicos (ah, oh); sorriso social                           | Não balbucia; não sorri                                          |
| 6–9 meses   | Entende entonações (proibição, chamado)                  | Balbucio reduplicado (bababa, mamama)                                  | Ausência de balbucio                                             |
| 9–12 meses  | Compreende "não"; segue um comando com gesto             | Proto-palavras; 1–3 palavras com sentido; aponta para pedir            | Não aponta; não imita sons/gestos; ausência de palavras          |
| 12–18 meses | Identifica objetos nomeados; segue 1 comando simples     | 10–20 palavras; jargão com entonação; nomeia objetos conhecidos        | Menos de 5 palavras aos 15 meses                                 |
| 18–24 meses | Identifica partes do corpo; segue 2 comandos             | 50+ palavras; primeiras combinações de 2 palavras; usa "meu/minha"     | Menos de 50 palavras; sem combinações de 2 palavras              |
| 2–3 anos    | Compreende frases simples e perguntas (onde? quem?)      | 200–1000 palavras; frases de 3 palavras; usa pronomes; faz perguntas   | Não faz frases; vocabulário < 50 palavras                        |
| 3–4 anos    | Compreende conceitos (grande/pequeno, em cima/embaixo)   | 1000+ palavras; frases de 4–5 palavras; conta fatos; usa plural        | Fala ininteligível para familiares; gagueja constantemente       |
| 4–5 anos    | Compreende histórias; segue 3 comandos sequenciais       | Narrativas simples; domina maioria dos fonemas; usa verbos no passado  | Fala incompreensível para estranhos; omite consoantes finais     |
| 5–6 anos    | Compreensão metalinguística inicial; compreende metáforas| Todos os fonemas corretos (exceto variações); frases complexas         | Trocas fonêmicas persistentes; dificuldade de narrativa          |
| 6–8 anos    | Compreende ironia simples; segue instruções complexas    | Narrativas com episódios completos; início da escrita; consciência fonológica estabelecida | Dificuldade de leitura/escrita; fala com processos fonológicos  |
| 8–10 anos   | Inferência; linguagem figurada; compreensão de texto     | Discurso expositivo; argumentação inicial; metalinguagem               | Dificuldade de compreensão leitora; erros ortográficos persistentes |
| 10–12 anos  | Compreende múltiplos significados; linguagem acadêmica   | Narrativas complexas com perspectiva do outro; escrita com coesão      | Dificuldade em resumo/interpretação; linguagem empobrecida      |
| 12–14 anos  | Compreensão crítica; subtexto; inferência pragmática     | Argumentação elaborada; adequação ao interlocutor; metalinguagem madura| Dificuldade de expressão oral/escrita formal; pragmática atípica|

## 2. AQUISIÇÃO FONOLÓGICA DO PORTUGUÊS BRASILEIRO

### Ordem de aquisição de consoantes (Wertzner / Mota):
- Plosivos e nasais: /p b t d k g m n/ — adquiridos até 2 anos
- Fricativas: /f v s z ʃ ʒ/ — adquiridas entre 2;6 e 4 anos
- Africadas: /tʃ dʒ/ — adquiridas entre 2 e 3 anos (variação dialetal)
- Laterais: /l ʎ/ — adquiridas entre 3 e 4 anos
- Tepe: /ɾ/ — adquirido entre 4 e 5 anos
- Vibrante: /R/ — adquirida entre 4 e 6 anos
- Encontros consonantais (CCV): estabelecidos até 7 anos

### Processos fonológicos e idades esperadas de eliminação (ABFW — Wertzner):
| Processo Fonológico                   | Eliminação esperada |
|---------------------------------------|---------------------|
| Redução de sílaba                     | 2;6 anos            |
| Harmonia consonantal                  | 2;6 anos            |
| Plosivização de fricativas            | 2;6 anos            |
| Frontalização de velares (/k g/)      | 3;0 anos            |
| Simplificação de líquidas             | 3;6 anos            |
| Posteriorização para velar            | 3;6 anos            |
| Posteriorização para palatal          | 4;6 anos            |
| Frontalização de palatais             | 4;6 anos            |
| Simplificação do encontro consonantal | 7;0 anos            |
| Simplificação da consoante final      | 7;0 anos            |

Processos presentes acima da idade de eliminação = transtorno fonológico.

## 3. PROTOCOLOS DE AVALIAÇÃO — DESCRIÇÕES DETALHADAS

### ABFW — Teste de Linguagem Infantil (Befi-Lopes, Wertzner et al., 2000/2024)
- Faixa etária: 2 a 12 anos
- Áreas: Fonologia, Vocabulário, Fluência, Pragmática
- FONOLOGIA: Nomeação de figuras; análise de processos fonológicos; comparação com índice de eliminação por idade. Resultado expresso em processos presentes/ausentes e porcentagem de ocorrência.
- VOCABULÁRIO: 118 figuras em 9 categorias semânticas (animais, alimentos, vestuário, móveis e utensílios, meios de transporte, brinquedos, profissões, lugares, formas e cores). Resultado expresso em DR% (designação por rótulo), UP% (uso de palavras próximas) e NC% (não-conseguiu). Esperado: DR% ≥ 75% por categoria para desenvolvimento típico.
- FLUÊNCIA: Análise qualitativa e quantitativa de rupturas da fala (hesitações, repetições, revisões, interjeições). Esperado: rupturas dentro do padrão típico para a idade.
- PRAGMÁTICA: Observação de 7 funções comunicativas (instrumental, regulatória, interacional, pessoal, heurística, imaginativa, informativa) durante interação lúdica. Resultado: checklist de funções presentes/ausentes.
- Formato de resultado: Para VOCABULÁRIO use tabela com colunas: Categoria | DR% | UP% | NC% | Esperado | Adequado (S/N)

### ADL / ADL-2 — Avaliação do Desenvolvimento da Linguagem (Hage, 2000; 2ª ed.)
- Faixa etária: 2 a 12 anos (ADL original); 1 a 6 anos (ADL-2)
- Avalia: Linguagem compreensiva e expressiva por meio de tarefas com figuras e comandos verbais
- Resultado: Escore Bruto convertido em Escore Padrão. Faixa de normalidade: EP entre 85 e 115 (±1 DP)
- EP < 85: déficit de linguagem. EP < 70: déficit severo.
- Subescalas: Compreensão (identificação de substantivos, verbos, adjetivos, preposições, frases) e Expressão (nomeação, descrição, repetição, completar frases)

### LAVE — Lista de Avaliação do Vocabulário Expressivo (adaptação LDS)
- Faixa etária: 2 a 6 anos (mais sensível abaixo de 3 anos)
- Aplicação: Entrevista com responsável; lista de palavras por categoria semântica
- Resultado: Número de palavras produzidas; presença de combinações de 2+ palavras
- Referência: Aos 2 anos = mínimo 50 palavras e combinações de 2 palavras

### PROC — Protocolo de Observação do Comportamento Comunicativo (Fernandes, 2004)
- Faixa etária: 0 a 6 anos (principalmente pré-linguístico e linguístico inicial)
- Aplicação: 30 minutos de interação filmada (criança + adulto + brinquedos)
- Avalia: Habilidades dialógicas (turnos comunicativos, iniciativas, respostas) e Meios de comunicação (olhar, gesto, vocalização, palavras, frases)
- Perfil típico: Crianças de 2–3 anos usam palavras como meio predominante; 70–80% dos turnos com intenção comunicativa clara
- Resultado: Categorias presentes/ausentes; perfil comunicativo (vocal/verbal/gestual/misto)

### MIOF / AMIOFE / MBGR — Avaliação Miofuncional Orofacial
- Avalia: Postura de lábios e língua em repouso, mobilidade, tonicidade; funções estomatognáticas: respiração, sucção, mastigação, deglutição e fala
- MBGR (Genaro et al., 2009): protocolo com escores; avalia face, ATM, dentes, oclusão, língua, lábios, bochechas, palato, amígdalas, adenoide, frenulo, funções
- Resultado: Escores por domínio; presença de alterações (disfunção, alteração estrutural, padrão alterado de função)

### MPGR — Protocolo de Gradação e Planejamento Motor da Fala
- Avalia: planejamento e gradação motora oral; associado à avaliação de apraxia de fala infantil (AFI)
- Aplica-se quando há suspeita de Apraxia de Fala Infantil (AFI): inconsistência de erros, dificuldade em sequências, prosódia comprometida

### ACOTEA — Avaliação da Comunicação no Transtorno do Espectro do Autismo
- Específico para TEA; avalia: intenção comunicativa, funções comunicativas, meios, responsividade social, linguagem verbal e não-verbal, atenção compartilhada

### PFC-C — Perfil Funcional da Comunicação Checklist
- Avalia comunicação funcional em contextos cotidianos; aplicado com responsáveis
- Relevante para TEA, paralisia cerebral, síndromes

### Avaliação Observacional Lúdica (informal)
- Observação não padronizada durante brincadeira livre
- Registra: contato visual, atenção compartilhada, intenção comunicativa, imitação, jogo simbólico, exploração de objetos, flexibilidade/rigidez comportamental

## 4. CODIFICAÇÃO CID-10 e CID-11

### CID-10 — Transtornos da Fala e Linguagem
| Código  | Descrição                                                               |
|---------|-------------------------------------------------------------------------|
| F80.0   | Transtorno específico da articulação da fala (dislalia fonológica)      |
| F80.1   | Transtorno expressivo da linguagem                                      |
| F80.2   | Transtorno receptivo da linguagem                                       |
| F80.3   | Afasia adquirida com epilepsia (Síndrome de Landau-Kleffner)            |
| F80.8   | Outros transtornos do desenvolvimento da fala e da linguagem            |
| F80.9   | Transtorno não especificado do desenvolvimento da fala e da linguagem   |
| F84.0   | Autismo infantil (TEA nível 1–3 no CID-11)                              |
| F84.1   | Autismo atípico                                                         |
| F84.3   | Síndrome de Rett                                                        |
| F84.8   | Outros transtornos globais do desenvolvimento                           |
| F84.9   | TGD não especificado                                                    |
| R47.0   | Afasia e Disfasia                                                       |
| R47.1   | Disartria e Anartria                                                    |
| R47.8   | Outras perturbações e as não especificadas da fala                      |
| R48.0   | Dislexia e Alexia                                                       |
| R49.0   | Disfonia                                                                |
| R49.1   | Afonia                                                                  |
| Q90     | Síndrome de Down                                                        |
| F70–F79 | Deficiência intelectual (por grau)                                      |

### CID-11 — Principais códigos relevantes
| Código | Descrição                                              |
|--------|--------------------------------------------------------|
| 6A02   | Transtorno do Espectro do Autismo (substitui F84.x)    |
| 6A01   | Transtorno do Desenvolvimento da Linguagem             |
| 6A00   | Transtorno do Desenvolvimento Intelectual              |
| MA80   | Transtornos da fala e fluência                         |
| LD90   | Síndrome de Down                                       |

Nota: O CID-11 está em transição no Brasil (obrigatório a partir de 2025 conforme MS). Relatórios podem citar ambos enquanto houver período de adaptação.

## 5. PERFIL FONOAUDIOLÓGICO — TEA

### Habilidades pré-linguísticas comprometidas (sinais de alerta):
- Atenção compartilhada (joint attention) reduzida ou ausente
- Apontar declarativo ausente (aponta para pedir mas não para compartilhar)
- Imitação deficitária (motora e vocal)
- Contato visual inconsistente ou funcional (olha para obter, não para interagir)
- Resposta ao nome inconsistente ou ausente
- Uso de adultos como "ferramenta" (leva pela mão sem olhar)
- Ausência de gestos convencionais (tchau, sim/não com cabeça)

### Perfil de linguagem no TEA:
- Ecolalia imediata e/ou tardia (funcional vs. não-funcional)
- Inversão pronominal ("você quer água" = "eu quero água")
- Linguagem literal; dificuldade com ironia, metáfora, duplo sentido
- Discurso monológico, dificuldade em narrativa dialogada
- Prosódia atípica (entonação plana, volume inadequado, ritmo irregular)
- Hiperlexia possível (decodifica sem compreensão)
- CAA (Comunicação Aumentativa e Alternativa) indicada quando fala funcional ausente ou insuficiente

### Funções comunicativas avaliadas no TEA (PROC/ACOTEA):
- Instrumental (pedir objetos)
- Regulatória (pedir ações/comportamentos)
- Interacional (iniciar e manter interação social)
- Informativa (comentar, declarar)
- Heurística (perguntar para explorar)
- Imaginativa (jogo simbólico)
Presença de função declarativa/informativa = prognostico mais favorável.

## 6. PERFIL FONOAUDIOLÓGICO — SÍNDROME DE DOWN

- Hipotonia generalizada afeta motricidade orofacial: protrusão de língua, respiração oral, mastigação imatura, voz rouca/hiponasal
- Linguagem expressiva geralmente mais comprometida que a receptiva
- Vocabulário receptivo avança, expressão oral é mais lenta
- Frases curtas e telegráficas persistem além do esperado
- Apraxia de fala frequente; disfluência presente
- Dificuldade em consciência fonológica e alfabetização
- Avaliação inclui MIOF + protocolos de linguagem + avaliação auditiva (hipoacusia condutiva frequente)

## 7. ATRASO DE LINGUAGEM vs. TRANSTORNO — DIFERENCIAÇÃO CLÍNICA

### Atraso simples de linguagem:
- Desenvolvimento seguindo a sequência típica, mas atrasado cronologicamente
- Progresso com estimulação adequada
- Demais áreas do desenvolvimento preservadas
- Geralmente resolve com terapia

### Transtorno específico de linguagem (TEL / DLD):
- Déficit persistente em pelo menos 2 áreas (fonologia, morfossintaxe, semântica, pragmática, discurso)
- Não explicado por: perda auditiva, baixo QI, TEA, condição neurológica
- Dificuldades em memória verbal de trabalho
- CID: F80.1 (expressivo) ou F80.2 (receptivo-expressivo)

### Transtorno fonológico (F80.0):
- Dificuldades apenas no sistema fonológico
- Vocabulário e gramática preservados
- Processos fonológicos além da idade de eliminação esperada
- Inclui: dislalia, transtorno fonológico não evolutivo

## 7b. LINGUAGEM ESCOLAR E METALINGUAGEM (6–14 ANOS)

### Desenvolvimento esperado por fase:
- 6–7 anos: Consciência fonológica consolidada (rima, aliteração, segmentação silábica e fonêmica); decodificação leitora inicial; escrita alfabética
- 7–8 anos: Leitura fluente de palavras simples; escrita com correspondência fonema-grafema; início da narrativa escrita
- 8–10 anos: Leitura com compreensão de textos curtos; ortografia com regras contextuais; coesão textual básica
- 10–12 anos: Compreensão leitora de textos longos e complexos; argumentação escrita; uso de linguagem formal e informal
- 12–14 anos: Inferência pragmática; discurso crítico; metalinguagem (consciência de estrutura gramatical, figuras de linguagem)

### Transtornos em idade escolar:
- **Dislexia (F81.0 / 6A03.0):** dificuldade específica de leitura; consciência fonológica e decodificação comprometidas; memória verbal de trabalho reduzida; sem comprometimento intelectual geral
- **Transtorno específico de ortografia (F81.1):** erros ortográficos persistentes; dissociação entre leitura e escrita possível
- **TDAH com impacto na linguagem:** dificuldade de organização do discurso, narrativa fragmentada, pragmática comprometida (manutenção de tópico, relevância)
- **TEA em idade escolar:** dificuldade pragmática persistente (inferência social, sarcasmo, linguagem não-literal), discurso monológico, dificuldade de narrativa perspectivada

### Protocolos adicionais para faixa escolar (6–14 anos):
- **ABFW (fonologia/vocabulário/pragmática):** válido até 12 anos
- **ADL-2:** válido até 12 anos
- **TDE (Teste de Desempenho Escolar):** avalia leitura, escrita e aritmética — não é protocolo fono mas frequentemente complementa a avaliação
- **CELF-P2 / CELF-5 (adaptação):** avaliação clínica de linguagem (compreensão e expressão de estruturas linguísticas complexas)
- **Prova de Consciência Fonológica — PCF / CONFIAS:** avalia habilidades metafonológicas por nível (sílaba → fonema)
- **Avaliação da narrativa oral:** análise de estrutura episódica, coesão, coerência, perspectiva de personagens
- **Protocolo de avaliação pragmática:** análise de atos de fala, turnos, relevância, adequação ao interlocutor

## 8. SINAIS DE ALERTA GERAIS — QUANDO ENCAMINHAR

- 12 meses: não aponta, não balbucia, não diz nenhuma palavra
- 16 meses: não diz nenhuma palavra
- 24 meses: não diz frases de 2 palavras espontâneas; vocabulário < 50 palavras
- Qualquer idade: perda de habilidades comunicativas já adquiridas (regressão)
- Fala ininteligível para familiares após 3 anos
- Gagueira com tensão muscular, esquiva ou ansiedade em qualquer idade
- Dificuldade de mastigação/deglutição persistente
- Escolar: dificuldade persistente de leitura/escrita após 2 anos de alfabetização
- Escolar: linguagem oral empobrecida, dificuldade de narrativa ou argumentação
- Adolescente: pragmática atípica (não lê contexto social, interpretação literal excessiva)

## 9. CONDUTA FONOAUDIOLÓGICA — ORIENTAÇÕES PADRÃO POR PERFIL

### TEA — Objetivos frequentes iniciais:
- Ampliação das funções comunicativas (especialmente declarativa e interacional)
- Aumento do repertório comunicativo (verbal e/ou CAA)
- Estabelecimento/aumento de atenção compartilhada
- Manutenção de turno comunicativo
- Estimulação de vocabulário funcional por campo semântico
- Orientação familiar: estratégias de modelagem, espera estruturada, oferta de escolhas

### Atraso de linguagem — Objetivos frequentes:
- Expansão de vocabulário por categorias semânticas
- Estimulação de combinações de palavras → frases
- Compreensão de comandos e conceitos por idade
- Estimulação de funções comunicativas variadas

### Transtorno fonológico — Objetivos frequentes:
- Eliminação de processos fonológicos além da idade
- Consciência fonológica
- Discriminação auditiva dos pares mínimos
- Generalização para fala espontânea

### Motricidade orofacial — Objetivos frequentes:
- Adequação do tônus de lábios e língua
- Correção da respiração oral (encaminhamento ORL/alergologista)
- Adequação da mastigação (bilateral, alternada)
- Correção de padrão de deglutição atípico

## 10. FORMATO DE TABELA — ABFW VOCABULÁRIO

Para apresentar resultados do ABFW Vocabulário, use este modelo:

| Categoria Semântica     | DR%  | UP%  | NC%  | Esperado (DR%) | Adequado? |
|-------------------------|------|------|------|----------------|-----------|
| Animais                 | xx%  | xx%  | xx%  | ≥75%           | S / N     |
| Alimentos               | xx%  | xx%  | xx%  | ≥75%           | S / N     |
| Vestuário               | xx%  | xx%  | xx%  | ≥75%           | S / N     |
| Móveis e utensílios     | xx%  | xx%  | xx%  | ≥75%           | S / N     |
| Meios de transporte     | xx%  | xx%  | xx%  | ≥75%           | S / N     |
| Brinquedos              | xx%  | xx%  | xx%  | ≥75%           | S / N     |
| Profissões              | xx%  | xx%  | xx%  | ≥75%           | S / N     |
| Lugares                 | xx%  | xx%  | xx%  | ≥75%           | S / N     |
| Formas e cores          | xx%  | xx%  | xx%  | ≥75%           | S / N     |

DR = designação por rótulo; UP = uso de palavra próxima; NC = não-conseguiu

## 11. FORMATO DE TABELA — ABFW FONOLOGIA

| Processo Fonológico                  | Ocorrências | Idade de eliminação esperada | Adequado? |
|--------------------------------------|-------------|------------------------------|-----------|
| Redução de sílaba                    | xx          | 2;6 anos                     | S / N     |
| Plosivização de fricativas           | xx          | 2;6 anos                     | S / N     |
| Frontalização de velares             | xx          | 3;0 anos                     | S / N     |
| Simplificação de líquidas            | xx          | 3;6 anos                     | S / N     |
| Simplificação do encontro consonantal| xx          | 7;0 anos                     | S / N     |

=== FIM DA BASE DE CONHECIMENTO ===
`
