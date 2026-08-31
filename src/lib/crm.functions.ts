import { createServerFn } from "@tanstack/react-start";
import { contatoPublicoSchema, leadSiteSchema } from "./crm-schemas";
import type { LinhaBruta } from "./crm.server";

const PERFIL_LABEL: Record<string, string> = {
  sindico: "Síndico profissional",
  administradora: "Administradora de condomínios",
  outro: "Outro profissional do mercado condominial",
};

/**
 * Entrada única do site (síndicos, administradoras e outros perfis).
 * Reutiliza a base central de contatos e, para administradoras,
 * alimenta também o pipeline comercial já existente em `leads`.
 */
export const enviarLeadSite = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => leadSiteSchema.parse(data))
  .handler(async ({ data }) => {
    const { upsertContato, registrarInteracao } = await import("./crm.server");
    const uf = data.uf.toUpperCase();
    const perfil = data.perfil === "administradora" ? "administradora" : "sindico";

    const { id, criado } = await upsertContato({
      nome: data.nome,
      email: data.email,
      whatsapp: data.whatsapp,
      cidade: data.cidade,
      uf,
      perfis: [perfil],
      administradora: data.empresa ?? null,
      cargo: data.cargo ?? null,
      qtd_condominios: data.qtd_condominios ?? null,
      interesses: [data.interesse],
      source: "Site Fórmula Síndico",
      source_detail: `Formulário do site — ${PERFIL_LABEL[data.perfil]}`,
      observacoes: data.mensagem ?? null,
      consentimento: true,
      utm_source: data.utm_source ?? null,
      utm_medium: data.utm_medium ?? null,
      utm_campaign: data.utm_campaign ?? null,
      utm_content: data.utm_content ?? null,
      utm_term: data.utm_term ?? null,
    });

    await registrarInteracao({
      contact_id: id,
      tipo: criado ? "cadastro" : "informacoes",
      descricao: `${PERFIL_LABEL[data.perfil]} — interesse: ${data.interesse}`,
      source: "Site Fórmula Síndico",
    });

    if (data.perfil === "administradora") {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await supabaseAdmin.from("leads").insert({
        nome_responsavel: data.nome,
        administradora: data.empresa || data.nome,
        cargo: data.cargo ?? null,
        cidade: data.cidade,
        uf,
        whatsapp: data.whatsapp,
        email: data.email,
        qtd_condominios: data.qtd_condominios ?? null,
        qtd_sindicos: data.qtd_sindicos ?? null,
        observacoes_lead: [`Interesse: ${data.interesse}`, data.mensagem]
          .filter(Boolean)
          .join(" — "),
        origem: "Site Fórmula Síndico",
        origem_atribuida: data.utm_source || "site",
        status: "novo_lead",
      });
    }

    return { ok: true as const };
  });

/** Público: entrada de síndicos/interessados na base central. */
export const enviarContatoPublico = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => contatoPublicoSchema.parse(data))
  .handler(async ({ data }) => {
    const { upsertContato, registrarInteracao } = await import("./crm.server");
    const { id, criado } = await upsertContato({
      nome: data.nome,
      email: data.email,
      whatsapp: data.whatsapp,
      cidade: data.cidade,
      uf: data.uf.toUpperCase(),
      perfis: ["sindico"],
      tipo_sindico: data.tipo_sindico ?? null,
      qtd_condominios: data.qtd_condominios ?? null,
      interesses: data.interesses,
      source: data.source,
      source_detail: data.source_detail ?? null,
      consentimento: true,
      utm_source: data.utm_source ?? null,
      utm_medium: data.utm_medium ?? null,
      utm_campaign: data.utm_campaign ?? null,
      utm_content: data.utm_content ?? null,
      utm_term: data.utm_term ?? null,
    });
    await registrarInteracao({
      contact_id: id,
      tipo: criado ? "cadastro" : "informacoes",
      descricao: criado
        ? "Cadastro realizado pelo site"
        : "Novo interesse registrado pelo site",
      source: data.source,
    });
    return { ok: true as const };
  });

export const adminResumo = createServerFn({ method: "GET" }).handler(async () => {
  const { requireUnlocked } = await import("./admin-session.server");
  await requireUnlocked();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const [contatos, eventos, parceiros, importacoes] = await Promise.all([
    supabaseAdmin
      .from("contacts")
      .select("id, nome, cidade, uf, perfis, source, created_at")
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("events")
      .select("*")
      .order("data", { ascending: true, nullsFirst: false })
      .limit(6),
    supabaseAdmin.from("partners").select("id"),
    supabaseAdmin
      .from("imports")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const lista = contatos.data ?? [];
  const trintaDias = Date.now() - 30 * 24 * 60 * 60 * 1000;
  return {
    total: lista.length,
    sindicos: lista.filter((c) => (c.perfis ?? []).includes("sindico")).length,
    administradoras: lista.filter((c) => (c.perfis ?? []).includes("administradora"))
      .length,
    parceiros: parceiros.data?.length ?? 0,
    novos30: lista.filter((c) => new Date(c.created_at).getTime() > trintaDias).length,
    ultimos: lista.slice(0, 8),
    proximosEventos: eventos.data ?? [],
    importacoes: importacoes.data ?? [],
  };
});

export const adminListarContatos = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      busca?: string;
      perfil?: string;
      uf?: string;
      source?: string;
      interesse?: string;
      eventId?: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    const { requireUnlocked } = await import("./admin-session.server");
    await requireUnlocked();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let ids: string[] | null = null;
    if (data.eventId) {
      const { data: parts } = await supabaseAdmin
        .from("event_participants")
        .select("contact_id")
        .eq("event_id", data.eventId);
      ids = (parts ?? []).map((p) => p.contact_id);
      if (ids.length === 0) return [];
    }

    let q = supabaseAdmin
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (ids) q = q.in("id", ids);
    if (data.perfil) q = q.contains("perfis", [data.perfil]);
    if (data.interesse) q = q.contains("interesses", [data.interesse]);
    if (data.uf) q = q.eq("uf", data.uf);
    if (data.source) q = q.eq("source", data.source);
    if (data.busca?.trim()) {
      const b = data.busca.trim().replace(/[%,]/g, "");
      q = q.or(`nome.ilike.%${b}%,email.ilike.%${b}%,whatsapp.ilike.%${b}%`);
    }
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const adminContato = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const { requireUnlocked } = await import("./admin-session.server");
    await requireUnlocked();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [contato, interacoes, participacoes] = await Promise.all([
      supabaseAdmin.from("contacts").select("*").eq("id", data.id).maybeSingle(),
      supabaseAdmin
        .from("contact_interactions")
        .select("*")
        .eq("contact_id", data.id)
        .order("created_at", { ascending: false }),
      supabaseAdmin
        .from("event_participants")
        .select("*, events(nome, data, cidade, uf)")
        .eq("contact_id", data.id),
    ]);
    return {
      contato: contato.data,
      interacoes: interacoes.data ?? [],
      participacoes: participacoes.data ?? [],
    };
  });

export const adminAtualizarContato = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      id: string;
      patch: Record<string, string | number | boolean | string[] | null>;
    }) => data,
  )
  .handler(async ({ data }) => {
    const { requireUnlocked } = await import("./admin-session.server");
    await requireUnlocked();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("contacts")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .update(data.patch as any)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const adminRegistrarInteracao = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      contact_id: string;
      tipo: string;
      descricao?: string;
      event_id?: string | null;
    }) => data,
  )
  .handler(async ({ data }) => {
    const { requireUnlocked } = await import("./admin-session.server");
    await requireUnlocked();
    const { registrarInteracao } = await import("./crm.server");
    await registrarInteracao({
      contact_id: data.contact_id,
      tipo: data.tipo,
      descricao: data.descricao ?? null,
      event_id: data.event_id ?? null,
      source: "Cadastro manual",
    });
    return { ok: true as const };
  });

export const adminListarEventos = createServerFn({ method: "GET" }).handler(async () => {
  const { requireUnlocked } = await import("./admin-session.server");
  await requireUnlocked();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("events")
    .select("*")
    .order("data", { ascending: false, nullsFirst: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const adminSalvarEvento = createServerFn({ method: "POST" })
  .inputValidator(
    (data: { id?: string; valores: Record<string, string | null> }) => data,
  )
  .handler(async ({ data }) => {
    const { requireUnlocked } = await import("./admin-session.server");
    await requireUnlocked();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (data.id) {
      const { error } = await supabaseAdmin
        .from("events")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .update(data.valores as any)
        .eq("id", data.id);
      if (error) throw new Error(error.message);
      return { ok: true as const };
    }
    const { error } = await supabaseAdmin
      .from("events")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .insert(data.valores as any);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const adminParticipantes = createServerFn({ method: "POST" })
  .inputValidator((data: { event_id: string }) => data)
  .handler(async ({ data }) => {
    const { requireUnlocked } = await import("./admin-session.server");
    await requireUnlocked();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("event_participants")
      .select("*, contacts(nome, email, whatsapp, cidade, uf)")
      .eq("event_id", data.event_id)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const adminAtualizarParticipacao = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string; status: string }) => data)
  .handler(async ({ data }) => {
    const { requireUnlocked } = await import("./admin-session.server");
    await requireUnlocked();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("event_participants")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const adminListarParceiros = createServerFn({ method: "GET" }).handler(
  async () => {
    const { requireUnlocked } = await import("./admin-session.server");
    await requireUnlocked();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("partners")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  },
);

export const adminSalvarParceiro = createServerFn({ method: "POST" })
  .inputValidator(
    (data: { id?: string; valores: Record<string, string | null> }) => data,
  )
  .handler(async ({ data }) => {
    const { requireUnlocked } = await import("./admin-session.server");
    await requireUnlocked();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (data.id) {
      const { error } = await supabaseAdmin
        .from("partners")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .update(data.valores as any)
        .eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin
        .from("partners")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .insert(data.valores as any);
      if (error) throw new Error(error.message);
    }
    return { ok: true as const };
  });

export const adminImportar = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      linhas: LinhaBruta[];
      event_id?: string | null;
      source: string;
      source_detail?: string | null;
      perfil?: string | null;
      tags?: string[];
      arquivo?: string | null;
    }) => data,
  )
  .handler(async ({ data }) => {
    const { requireUnlocked } = await import("./admin-session.server");
    await requireUnlocked();
    const { processarImportacao } = await import("./crm.server");
    return processarImportacao(data);
  });
