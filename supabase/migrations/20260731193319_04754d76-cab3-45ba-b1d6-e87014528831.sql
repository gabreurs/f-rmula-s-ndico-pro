ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS status_atualizado_em timestamptz NOT NULL DEFAULT now();