import { z } from "zod";

const texto = (max: number) => z.string().trim().max(max);

export const contatoPublicoSchema = z.object({
  nome: texto(120).min(2, "Informe seu nome."),
  email: texto(180).email("E-mail inválido."),
  whatsapp: texto(30).refine((v) => v.replace(/\D/g, "").length >= 10, "WhatsApp inválido."),
  cidade: texto(120).min(2, "Informe a cidade."),
  uf: texto(2).length(2, "Selecione o estado."),
  tipo_sindico: z.enum(["profissional", "morador"]).optional().nullable(),
  qtd_condominios: z.number().int().min(0).max(9999).optional().nullable(),
  interesses: z.array(texto(60)).max(12).default([]),
  consentimento: z.literal(true),
  source: texto(80).default("Site Fórmula Síndico"),
  source_detail: texto(180).optional().nullable(),
  utm_source: texto(180).optional().nullable(),
  utm_medium: texto(180).optional().nullable(),
  utm_campaign: texto(180).optional().nullable(),
  utm_content: texto(180).optional().nullable(),
  utm_term: texto(180).optional().nullable(),
});

export type ContatoPublico = z.infer<typeof contatoPublicoSchema>;

export const linhaImportacaoSchema = z.object({
  nome: texto(160).optional().nullable(),
  email: texto(180).optional().nullable(),
  whatsapp: texto(40).optional().nullable(),
  cidade: texto(120).optional().nullable(),
  uf: texto(40).optional().nullable(),
});

export type LinhaImportacao = z.infer<typeof linhaImportacaoSchema>;
