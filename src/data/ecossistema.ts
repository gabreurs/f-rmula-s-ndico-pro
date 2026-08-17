/**
 * Fonte única de dados públicos do ecossistema Fórmula Síndico.
 * Mantido separado dos componentes para permitir migração futura para banco/API.
 */

export type Modalidade = "presencial" | "online" | "híbrido";

export type Atividade = {
  slug: string;
  tipo: "Curso" | "Workshop" | "Mentoria" | "Live" | "Encontro" | "Entrevista";
  titulo: string;
  descricao: string;
  modalidade: Modalidade;
  cidade?: string;
  data?: string;
  status: "inscricoes_abertas" | "em_preparacao" | "encerrada";
  imagem?: string;
};

/** Nenhuma atividade divulgada publicamente até o momento. Não inventar dados. */
export const ATIVIDADES: Atividade[] = [];

export type Material = {
  slug: string;
  tipo: "E-book" | "Guia" | "Checklist" | "Estudo" | "Material";
  titulo: string;
  descricao: string;
  url?: string;
};

/** Nenhum material publicado ainda. */
export const MATERIAIS: Material[] = [];

export type Parceiro = { nome: string; logo: string; url?: string };

/** Sem logos reais liberados — a seção não é renderizada enquanto estiver vazia. */
export const PARCEIROS: Parceiro[] = [];

export type FormatoBloco = {
  chave: string;
  titulo: string;
  texto: string;
  escala: "grande" | "medio" | "vertical" | "horizontal";
};

export const FORMATOS_ECOSSISTEMA: FormatoBloco[] = [
  {
    chave: "cursos-presenciais",
    titulo: "Cursos presenciais",
    texto:
      "Encontros de formação conduzidos junto a administradoras, com conteúdo aplicado à realidade dos síndicos que participam.",
    escala: "grande",
  },
  {
    chave: "cursos-online",
    titulo: "Cursos online",
    texto: "Turmas ao vivo, para grupos distribuídos em diferentes cidades.",
    escala: "medio",
  },
  {
    chave: "mentorias",
    titulo: "Mentorias",
    texto:
      "Acompanhamento próximo para quem conduz a sindicatura como profissão e quer estruturar a própria operação.",
    escala: "vertical",
  },
  {
    chave: "lives-entrevistas",
    titulo: "Lives e entrevistas",
    texto:
      "Conversas abertas com profissionais do setor sobre o que está mudando no mercado condominial.",
    escala: "horizontal",
  },
  {
    chave: "workshops",
    titulo: "Workshops",
    texto: "Sessões curtas e temáticas, com foco em aplicação imediata.",
    escala: "medio",
  },
  {
    chave: "materiais-eventos",
    titulo: "Materiais e eventos",
    texto:
      "Conteúdos de apoio e experiências presenciais que ampliam o alcance de cada formação.",
    escala: "medio",
  },
];

export const CONCEITOS = [
  {
    numero: "01",
    titulo: "Experiência",
    texto: "Conhecimento que nasce do mercado, de quem já esteve dentro da operação.",
  },
  {
    numero: "02",
    titulo: "Método",
    texto: "Conteúdo organizado para virar aplicação, decisão e rotina.",
  },
  {
    numero: "03",
    titulo: "Evolução",
    texto: "Formação para acompanhar um setor em movimento constante.",
  },
];

export const PASSOS_ADMINISTRADORAS = [
  {
    numero: "01",
    titulo: "Entendemos o cenário",
    texto: "Conhecemos administradora, público e objetivo.",
  },
  {
    numero: "02",
    titulo: "Definimos o formato",
    texto: "Presencial, online, workshop ou experiência especial.",
  },
  {
    numero: "03",
    titulo: "Construímos a experiência",
    texto: "Conteúdo, comunicação e dinâmica.",
  },
  {
    numero: "04",
    titulo: "Colocamos em movimento",
    texto: "A atividade acontece e pode abrir novas jornadas de formação.",
  },
];

export const BADGES_HERO = [
  {
    titulo: "Formação prática",
    texto: "Conteúdo conectado ao mercado real.",
    animacao: "float-a" as const,
  },
  {
    titulo: "Presencial + online",
    texto: "Diferentes formatos de aprendizagem.",
    animacao: "float-b" as const,
  },
  {
    titulo: "Mercado condominial",
    texto: "Experiência transformada em conhecimento.",
    animacao: "float-c" as const,
  },
  {
    titulo: "Cursos · mentorias · encontros",
    texto: "Um ecossistema em movimento.",
    animacao: "float-a" as const,
  },
];

export const BENEFICIOS_ADMINISTRADORAS = [
  {
    titulo: "Formação",
    texto: "Síndicos mais preparados para decidir, documentar e conduzir o condomínio.",
  },
  {
    titulo: "Relacionamento",
    texto: "Um encontro de valor real com os síndicos atendidos pela administradora.",
  },
  {
    titulo: "Autoridade",
    texto: "A empresa passa a ser reconhecida como referência técnica, não só operacional.",
  },
  {
    titulo: "Experiência",
    texto: "Um momento memorável, fora da rotina de chamados e cobranças.",
  },
  {
    titulo: "Desenvolvimento",
    texto: "Profissionais que evoluem junto com o próprio mercado.",
  },
];

export const CREDENCIAIS_MAICON = [
  "Especialista em condomínios",
  "Professor de Direito e Gestão Condominial",
  "Palestrante em eventos do setor",
  "Empreendedor e ex-síndico profissional",
];
