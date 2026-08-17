-- ============ CONTACTS ============
CREATE TABLE public.contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  nome text NOT NULL,
  email text,
  email_norm text GENERATED ALWAYS AS (nullif(lower(btrim(email)), '')) STORED,
  whatsapp text,
  whatsapp_norm text GENERATED ALWAYS AS (nullif(regexp_replace(coalesce(whatsapp,''), '\D', '', 'g'), '')) STORED,
  cidade text,
  uf text,
  perfis text[] NOT NULL DEFAULT '{}',
  tipo_sindico text,
  qtd_condominios integer,
  administradora text,
  cargo text,
  interesses text[] NOT NULL DEFAULT '{}',
  tags text[] NOT NULL DEFAULT '{}',
  source text NOT NULL DEFAULT 'Cadastro manual',
  source_detail text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  consentimento boolean NOT NULL DEFAULT false,
  observacoes text,
  ultima_interacao_em timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.contacts TO service_role;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX contacts_email_norm_key ON public.contacts (email_norm) WHERE email_norm IS NOT NULL;
CREATE UNIQUE INDEX contacts_whatsapp_norm_key ON public.contacts (whatsapp_norm) WHERE whatsapp_norm IS NOT NULL;
CREATE INDEX contacts_created_at_idx ON public.contacts (created_at DESC);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$
LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER contacts_updated_at BEFORE UPDATE ON public.contacts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ PARTNERS ============
CREATE TABLE public.partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  empresa text NOT NULL,
  segmento text,
  responsavel text,
  telefone text,
  email text,
  cidade text,
  uf text,
  tipo_parceria text,
  observacoes text
);
GRANT ALL ON public.partners TO service_role;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER partners_updated_at BEFORE UPDATE ON public.partners
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ EVENTS ============
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  nome text NOT NULL,
  slug text NOT NULL UNIQUE,
  tipo text NOT NULL DEFAULT 'curso_presencial',
  modalidade text NOT NULL DEFAULT 'presencial',
  data date,
  horario text,
  cidade text,
  uf text,
  local text,
  url_inscricao text,
  plataforma_inscricao text,
  status text NOT NULL DEFAULT 'planejamento',
  partner_id uuid REFERENCES public.partners(id) ON DELETE SET NULL,
  observacoes text
);
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE INDEX events_data_idx ON public.events (data);
CREATE TRIGGER events_updated_at BEFORE UPDATE ON public.events
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ EVENT PARTICIPANTS ============
CREATE TABLE public.event_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  contact_id uuid NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'inscrito',
  observacoes text,
  UNIQUE (contact_id, event_id)
);
GRANT ALL ON public.event_participants TO service_role;
ALTER TABLE public.event_participants ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER event_participants_updated_at BEFORE UPDATE ON public.event_participants
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ INTERACTIONS (timeline) ============
CREATE TABLE public.contact_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  contact_id uuid NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  tipo text NOT NULL,
  descricao text,
  event_id uuid REFERENCES public.events(id) ON DELETE SET NULL,
  source text
);
GRANT ALL ON public.contact_interactions TO service_role;
ALTER TABLE public.contact_interactions ENABLE ROW LEVEL SECURITY;
CREATE INDEX contact_interactions_contact_idx ON public.contact_interactions (contact_id, created_at DESC);

-- ============ IMPORTS ============
CREATE TABLE public.imports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  arquivo text,
  event_id uuid REFERENCES public.events(id) ON DELETE SET NULL,
  source text NOT NULL DEFAULT 'Sympla',
  source_detail text,
  total integer NOT NULL DEFAULT 0,
  novos integer NOT NULL DEFAULT 0,
  atualizados integer NOT NULL DEFAULT 0,
  ignorados integer NOT NULL DEFAULT 0,
  erros integer NOT NULL DEFAULT 0,
  relatorio jsonb
);
GRANT ALL ON public.imports TO service_role;
ALTER TABLE public.imports ENABLE ROW LEVEL SECURITY;
CREATE INDEX imports_created_at_idx ON public.imports (created_at DESC);