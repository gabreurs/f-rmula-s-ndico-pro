/** Vocabulário compartilhado do CRM Lite (client-safe). */

export const PERFIS = [
  { value: "sindico", label: "Síndico" },
  { value: "administradora", label: "Administradora" },
  { value: "parceiro", label: "Parceiro / Fornecedor" },
] as const;

export const TIPOS_SINDICO = [
  { value: "profissional", label: "Síndico profissional" },
  { value: "morador", label: "Síndico morador" },
];

export const INTERESSES = [
  "Cursos",
  "Materiais",
  "Mentoria",
  "Lives",
  "Eventos",
  "Empreendedorismo",
  "Gestão",
  "Mercado condominial",
  "Formação profissional",
];

export const SOURCES = [
  "Site Fórmula Síndico",
  "Sympla",
  "Instagram Maicon Guedes",
  "Sindiconet",
  "Prospecção ativa",
  "Evento presencial",
  "Live",
  "Material",
  "Indicação",
  "Campanha",
  "Cadastro manual",
];

export const TIPOS_EVENTO = [
  { value: "curso_presencial", label: "Curso presencial" },
  { value: "curso_online", label: "Curso online" },
  { value: "workshop", label: "Workshop" },
  { value: "live", label: "Live" },
  { value: "palestra", label: "Palestra" },
  { value: "mentoria", label: "Mentoria" },
  { value: "webinar", label: "Webinar" },
  { value: "entrevista", label: "Entrevista" },
];

export const MODALIDADES = [
  { value: "presencial", label: "Presencial" },
  { value: "online", label: "Online" },
  { value: "hibrido", label: "Híbrido" },
];

export const STATUS_EVENTO = [
  { value: "planejamento", label: "Planejamento" },
  { value: "inscricoes_abertas", label: "Inscrições abertas" },
  { value: "confirmado", label: "Confirmado" },
  { value: "realizado", label: "Realizado" },
  { value: "encerrado", label: "Encerrado" },
];

export const STATUS_PARTICIPACAO = [
  { value: "interessado", label: "Interessado" },
  { value: "inscrito", label: "Inscrito" },
  { value: "confirmado", label: "Confirmado" },
  { value: "participou", label: "Participou" },
  { value: "nao_compareceu", label: "Não compareceu" },
];

export const TIPOS_INTERACAO = [
  { value: "cadastro", label: "Cadastro realizado" },
  { value: "material", label: "Material solicitado" },
  { value: "inscricao_curso", label: "Inscrição em curso" },
  { value: "importacao", label: "Importação de planilha" },
  { value: "participacao", label: "Participou de evento" },
  { value: "informacoes", label: "Pediu informações" },
  { value: "mentoria", label: "Solicitou mentoria" },
  { value: "reuniao", label: "Reunião realizada" },
  { value: "observacao", label: "Observação manual" },
];

export function rotulo(lista: { value: string; label: string }[], v?: string | null) {
  return lista.find((i) => i.value === v)?.label ?? v ?? "—";
}

export function normalizarEmail(v?: string | null) {
  const t = (v ?? "").trim().toLowerCase();
  return t || null;
}

export function normalizarTelefone(v?: string | null) {
  const d = (v ?? "").replace(/\D/g, "");
  return d || null;
}

export function slugify(v: string) {
  return v
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
