import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { normalizarEmail, normalizarTelefone } from "./crm";

export type EntradaContato = {
  nome: string;
  email?: string | null;
  whatsapp?: string | null;
  cidade?: string | null;
  uf?: string | null;
  perfis?: string[];
  tipo_sindico?: string | null;
  qtd_condominios?: number | null;
  administradora?: string | null;
  cargo?: string | null;
  interesses?: string[];
  tags?: string[];
  source?: string;
  source_detail?: string | null;
  observacoes?: string | null;
  consentimento?: boolean;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  utm_term?: string | null;
};

type Existente = Record<string, unknown> & { id: string };

function unir(a?: string[] | null, b?: string[] | null) {
  return Array.from(new Set([...(a ?? []), ...(b ?? [])].filter(Boolean)));
}

/** Procura contato por e-mail normalizado e depois por telefone normalizado. */
export async function encontrarContato(email?: string | null, whatsapp?: string | null) {
  const e = normalizarEmail(email);
  const t = normalizarTelefone(whatsapp);
  if (e) {
    const { data } = await supabaseAdmin
      .from("contacts")
      .select("*")
      .eq("email_norm", e)
      .maybeSingle();
    if (data) return data as Existente;
  }
  if (t) {
    const { data } = await supabaseAdmin
      .from("contacts")
      .select("*")
      .eq("whatsapp_norm", t)
      .maybeSingle();
    if (data) return data as Existente;
  }
  return null;
}

export type ResultadoUpsert = {
  id: string;
  criado: boolean;
};

/**
 * Cria ou enriquece um contato sem gerar duplicata.
 * Em contatos existentes, só preenche campos ausentes e soma listas.
 */
export async function upsertContato(entrada: EntradaContato): Promise<ResultadoUpsert> {
  const existente = await encontrarContato(entrada.email, entrada.whatsapp);

  if (!existente) {
    const { data, error } = await supabaseAdmin
      .from("contacts")
      .insert({
        nome: entrada.nome,
        email: entrada.email || null,
        whatsapp: entrada.whatsapp || null,
        cidade: entrada.cidade || null,
        uf: entrada.uf || null,
        perfis: entrada.perfis ?? [],
        tipo_sindico: entrada.tipo_sindico || null,
        qtd_condominios: entrada.qtd_condominios ?? null,
        administradora: entrada.administradora || null,
        cargo: entrada.cargo || null,
        interesses: entrada.interesses ?? [],
        tags: entrada.tags ?? [],
        source: entrada.source ?? "Cadastro manual",
        source_detail: entrada.source_detail || null,
        observacoes: entrada.observacoes || null,
        consentimento: entrada.consentimento ?? false,
        utm_source: entrada.utm_source || null,
        utm_medium: entrada.utm_medium || null,
        utm_campaign: entrada.utm_campaign || null,
        utm_content: entrada.utm_content || null,
        utm_term: entrada.utm_term || null,
        ultima_interacao_em: new Date().toISOString(),
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: data.id, criado: true };
  }

  const patch: Record<string, unknown> = {
    perfis: unir(existente["perfis"] as string[], entrada.perfis),
    interesses: unir(existente["interesses"] as string[], entrada.interesses),
    tags: unir(existente["tags"] as string[], entrada.tags),
    ultima_interacao_em: new Date().toISOString(),
  };

  const preencher: [keyof EntradaContato, string][] = [
    ["email", "email"],
    ["whatsapp", "whatsapp"],
    ["cidade", "cidade"],
    ["uf", "uf"],
    ["tipo_sindico", "tipo_sindico"],
    ["administradora", "administradora"],
    ["cargo", "cargo"],
    ["qtd_condominios", "qtd_condominios"],
    ["utm_source", "utm_source"],
    ["utm_medium", "utm_medium"],
    ["utm_campaign", "utm_campaign"],
    ["utm_content", "utm_content"],
    ["utm_term", "utm_term"],
  ];
  for (const [campo, coluna] of preencher) {
    const valor = entrada[campo];
    if (valor !== undefined && valor !== null && valor !== "" && !existente[coluna]) {
      patch[coluna] = valor;
    }
  }
  if (entrada.consentimento) patch["consentimento"] = true;

  const { error } = await supabaseAdmin
    .from("contacts")
    .update(patch)
    .eq("id", existente.id);
  if (error) throw new Error(error.message);
  return { id: existente.id, criado: false };
}

export async function registrarInteracao(args: {
  contact_id: string;
  tipo: string;
  descricao?: string | null;
  event_id?: string | null;
  source?: string | null;
}) {
  await supabaseAdmin.from("contact_interactions").insert({
    contact_id: args.contact_id,
    tipo: args.tipo,
    descricao: args.descricao ?? null,
    event_id: args.event_id ?? null,
    source: args.source ?? null,
  });
}

export async function vincularEvento(
  contact_id: string,
  event_id: string,
  status = "inscrito",
) {
  await supabaseAdmin
    .from("event_participants")
    .upsert({ contact_id, event_id, status }, { onConflict: "contact_id,event_id" });
}
