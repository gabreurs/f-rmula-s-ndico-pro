import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";

type PainelSession = { unlocked?: boolean };

function sessionConfig() {
  return {
    password: process.env["SESSION_SECRET"]!,
    name: "painel-formula-sindico",
    maxAge: 60 * 60 * 8,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "lax" as const,
      path: "/",
    },
  };
}

function matches(input: string, expected: string) {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

async function requireUnlocked() {
  const session = await useSession<PainelSession>(sessionConfig());
  if (!session.data.unlocked) {
    throw new Error("NAO_AUTORIZADO");
  }
  return session;
}

export const entrarPainel = createServerFn({ method: "POST" })
  .inputValidator((data: { senha: string }) => data)
  .handler(async ({ data }) => {
    const esperada = process.env["PAINEL_SENHA"];
    if (!esperada) return { ok: false as const };
    if (!data.senha || !matches(data.senha, esperada)) {
      return { ok: false as const };
    }
    const session = await useSession<PainelSession>(sessionConfig());
    await session.update({ unlocked: true });
    return { ok: true as const };
  });

export const sairPainel = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<PainelSession>(sessionConfig());
  await session.clear();
  return { ok: true as const };
});

export const statusPainel = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<PainelSession>(sessionConfig());
  return { unlocked: Boolean(session.data.unlocked) };
});

export const listarLeads = createServerFn({ method: "GET" }).handler(async () => {
  await requireUnlocked();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

type PatchLead = {
  status?: string;
  responsavel_interno?: string | null;
  responsavel_followup?: string | null;
  proximo_followup?: string | null;
  data_confirmacao_formato?: string | null;
  observacoes_internas?: string | null;
};

export const atualizarLead = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string } & PatchLead) => data)
  .handler(async ({ data }) => {
    await requireUnlocked();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { id, ...campos } = data;
    const patch: PatchLead & { status_atualizado_em?: string } = {};
    if (campos.status !== undefined) {
      const { data: atual } = await supabaseAdmin
        .from("leads")
        .select("status")
        .eq("id", id)
        .maybeSingle();
      patch.status = campos.status;
      if (atual && atual.status !== campos.status) {
        patch.status_atualizado_em = new Date().toISOString();
      }
    }
    if (campos.responsavel_interno !== undefined)
      patch.responsavel_interno = campos.responsavel_interno || null;
    if (campos.responsavel_followup !== undefined)
      patch.responsavel_followup = campos.responsavel_followup || null;
    if (campos.proximo_followup !== undefined)
      patch.proximo_followup = campos.proximo_followup || null;
    if (campos.data_confirmacao_formato !== undefined)
      patch.data_confirmacao_formato = campos.data_confirmacao_formato || null;
    if (campos.observacoes_internas !== undefined)
      patch.observacoes_internas = campos.observacoes_internas || null;

    const { error } = await supabaseAdmin.from("leads").update(patch).eq("id", id);


    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

