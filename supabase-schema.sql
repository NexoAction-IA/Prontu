-- Schema: Sistema de Gestão Fonoaudiológica — Tayrini Lenart
-- Rodar no Supabase: SQL Editor > New query > colar e executar

-- Clínicas
CREATE TABLE IF NOT EXISTS clinicas (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nome text NOT NULL,
  criado_em timestamptz DEFAULT now()
);

-- Pacientes
CREATE TABLE IF NOT EXISTS pacientes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  clinica_id uuid REFERENCES clinicas(id) ON DELETE CASCADE NOT NULL,
  nome text NOT NULL,
  data_nascimento date,
  diagnostico text,
  observacoes text,
  criado_em timestamptz DEFAULT now()
);

-- Evoluções de sessão
CREATE TABLE IF NOT EXISTS evolucoes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  paciente_id uuid REFERENCES pacientes(id) ON DELETE CASCADE NOT NULL,
  data_sessao date NOT NULL DEFAULT CURRENT_DATE,
  relato_bruto text NOT NULL,
  texto_processado text,
  objetivos text,
  estrategias text,
  desregulou boolean DEFAULT false,
  teve_melhora boolean DEFAULT true,
  observacoes text,
  criado_em timestamptz DEFAULT now()
);

-- Documentos (anamnese, avaliações, histórico externo, PEI, relatórios em PDF/DOCX)
CREATE TABLE IF NOT EXISTS documentos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  paciente_id uuid REFERENCES pacientes(id) ON DELETE CASCADE NOT NULL,
  tipo text NOT NULL CHECK (tipo IN ('anamnese', 'avaliacao', 'relatorio', 'historico', 'pei')),
  titulo text NOT NULL,
  arquivo_url text,
  conteudo_extraido text,
  status text NOT NULL DEFAULT 'processado',
  data_documento date DEFAULT CURRENT_DATE,
  criado_em timestamptz DEFAULT now()
);

-- Relatórios gerados
CREATE TABLE IF NOT EXISTS relatorios (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  paciente_id uuid REFERENCES pacientes(id) ON DELETE CASCADE NOT NULL,
  conteudo text NOT NULL,
  periodo_inicio date,
  periodo_fim date,
  aprovado boolean DEFAULT false,
  criado_em timestamptz DEFAULT now()
);

-- Storage bucket para PDFs (rodar separado no SQL Editor)
INSERT INTO storage.buckets (id, name, public)
VALUES ('documentos', 'documentos', false)
ON CONFLICT DO NOTHING;

-- Dados iniciais: 3 clínicas de Tayrini
-- Ajuste os nomes conforme necessário
INSERT INTO clinicas (nome) VALUES
  ('Clínica 1'),
  ('Clínica 2'),
  ('Clínica 3')
ON CONFLICT DO NOTHING;
