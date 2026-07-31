CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  nome_responsavel TEXT NOT NULL,
  administradora TEXT NOT NULL,
  cidade TEXT NOT NULL,
  uf TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT,
  cargo TEXT,
  qtd_condominios INTEGER,
  qtd_sindicos INTEGER,
  formato_preferido TEXT,
  periodo_desejado TEXT,
  observacoes_lead TEXT,
  origem TEXT NOT NULL DEFAULT 'landing',
  status TEXT NOT NULL DEFAULT 'novo_lead',
  responsavel_interno TEXT,
  proximo_followup DATE,
  observacoes_internas TEXT
);

GRANT INSERT ON public.leads TO anon;
GRANT INSERT ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Qualquer visitante pode enviar um lead" ON public.leads FOR INSERT TO anon, authenticated WITH CHECK (true);
