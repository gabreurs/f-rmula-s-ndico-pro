export const CTA_SINDICO = "Quero participar do Fórmula Síndico";
export const CTA_ADMINISTRADORA = "Leve o Fórmula Síndico para sua administradora";
export const CTA_ATIVIDADES = "Quero conhecer as atividades";
export const CTA_PRINCIPAL = CTA_ADMINISTRADORA;
export const CTA_HEADER = "Quero participar";
export const CTA_FINAL = "Conversar sobre o Fórmula Síndico";
export const CTA_FORM = "Enviar contato";
export const CTA_TEXT = CTA_SINDICO;

// WhatsApp da equipe do projeto (não do Maicon).
export const WHATSAPP_EQUIPE = "5511999999999";
export const WHATSAPP_EQUIPE_URL = `https://wa.me/${WHATSAPP_EQUIPE}`;

export const STATUS_OPTIONS = [
  { value: "novo_lead", label: "Novo lead" },
  { value: "em_qualificacao", label: "Em qualificação" },
  { value: "contato_realizado", label: "Contato realizado" },
  { value: "reuniao_agendada", label: "Reunião agendada" },
  { value: "reuniao_realizada", label: "Reunião realizada" },
  { value: "alinhamento_formato_data", label: "Em alinhamento de formato e data" },
  { value: "curso_confirmado", label: "Curso confirmado" },
  { value: "curso_realizado", label: "Curso realizado" },
  { value: "sem_interesse", label: "Sem interesse" },
  { value: "followup_futuro", label: "Follow-up futuro" },
];

export const FORMATOS = ["presencial", "híbrido", "online"] as const;

export const PARTICIPA_DECISAO = [
  { value: "sim", label: "Sim" },
  { value: "parcialmente", label: "Parcialmente" },
  { value: "nao_decide", label: "Não decide" },
];

export const ESTRUTURA_PRESENCIAL = [
  { value: "sim", label: "Sim" },
  { value: "nao", label: "Não" },
  { value: "nao_sei", label: "Não sei" },
];

export const INTENCAO_90_DIAS = [
  { value: "sim", label: "Sim" },
  { value: "talvez", label: "Talvez" },
  { value: "nao", label: "Não" },
];

export const UFS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR",
  "PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];
