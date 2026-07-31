ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS participa_decisao text,
  ADD COLUMN IF NOT EXISTS estrutura_presencial text,
  ADD COLUMN IF NOT EXISTS objetivo_principal text,
  ADD COLUMN IF NOT EXISTS intencao_90_dias text,
  ADD COLUMN IF NOT EXISTS responsavel_followup text,
  ADD COLUMN IF NOT EXISTS data_confirmacao_formato date,
  ADD COLUMN IF NOT EXISTS origem_atribuida text NOT NULL DEFAULT 'studio_marqo';