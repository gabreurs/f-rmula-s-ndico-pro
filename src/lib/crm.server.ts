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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .update(patch as any)
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

export type LinhaBruta = {
  nome?: string | null;
  email?: string | null;
  whatsapp?: string | null;
  cidade?: string | null;
  uf?: string | null;
};

export type RelatorioImportacao = {
  total: number;
  novos: number;
  atualizados: number;
  ignorados: number;
  erros: number;
  detalhesErros: { linha: number; motivo: string; dados: LinhaBruta }[];
};

/** Importa linhas de planilha deduplicando por e-mail e telefone. */
export async function processarImportacao(args: {
  linhas: LinhaBruta[];
  event_id?: string | null;
  source: string;
  source_detail?: string | null;
  perfil?: string | null;
  tags?: string[];
  arquivo?: string | null;
}): Promise<RelatorioImportacao> {
  const rel: RelatorioImportacao = {
    total: args.linhas.length,
    novos: 0,
    atualizados: 0,
    ignorados: 0,
    erros: 0,
    detalhesErros: [],
  };
  const vistos = new Set<string>();

  for (let i = 0; i < args.linhas.length; i++) {
    const linha = args.linhas[i]!;
    const nome = (linha.nome ?? "").trim();
    const email = normalizarEmail(linha.email);
    const tel = normalizarTelefone(linha.whatsapp);

    if (!nome) {
      rel.erros++;
      rel.detalhesErros.push({ linha: i + 2, motivo: "Nome ausente", dados: linha });
      continue;
    }
    if (!email && !tel) {
      rel.erros++;
      rel.detalhesErros.push({
        linha: i + 2,
        motivo: "Sem e-mail nem telefone válidos",
        dados: linha,
      });
      continue;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      rel.erros++;
      rel.detalhesErros.push({ linha: i + 2, motivo: "E-mail inválido", dados: linha });
      continue;
    }
    const chave = email ?? tel!;
    if (vistos.has(chave)) {
      rel.ignorados++;
      continue;
    }
    vistos.add(chave);

    try {
      const { id, criado } = await upsertContato({
        nome,
        email: linha.email ?? null,
        whatsapp: linha.whatsapp ?? null,
        cidade: linha.cidade ?? null,
        uf: (linha.uf ?? "").trim().slice(0, 2).toUpperCase() || null,
        perfis: args.perfil ? [args.perfil] : [],
        tags: args.tags ?? [],
        source: args.source,
        source_detail: args.source_detail ?? null,
      });
      if (criado) rel.novos++;
      else rel.atualizados++;

      if (args.event_id) {
        await vincularEvento(id, args.event_id, "inscrito");
      }
      await registrarInteracao({
        contact_id: id,
        tipo: "importacao",
        descricao: `Importação via ${args.source}${args.arquivo ? ` (${args.arquivo})` : ""}`,
        event_id: args.event_id ?? null,
        source: args.source,
      });
    } catch (e) {
      rel.erros++;
      rel.detalhesErros.push({
        linha: i + 2,
        motivo: e instanceof Error ? e.message : "Falha ao gravar",
        dados: linha,
      });
    }
  }

  await supabaseAdmin.from("imports").insert({
    arquivo: args.arquivo ?? null,
    event_id: args.event_id ?? null,
    source: args.source,
    source_detail: args.source_detail ?? null,
    total: rel.total,
    novos: rel.novos,
    atualizados: rel.atualizados,
    ignorados: rel.ignorados,
    erros: rel.erros,
    relatorio: rel.detalhesErros.slice(0, 200),
  });

  return rel;
}
