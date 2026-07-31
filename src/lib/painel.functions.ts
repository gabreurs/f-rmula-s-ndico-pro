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

export const atualizarLead = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      id: string;
      status?: string;
      responsavel_interno?: string | null;
      proximo_followup?: string | null;
      observacoes_internas?: string | null;
    }) => data,
  )
  .handler(async ({ data }) => {
    await requireUnlocked();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { id, ...campos } = data;
    const patch: Record<string, unknown> = {};
    if (campos.status !== undefined) patch["status"] = campos.status;
    if (campos.responsavel_interno !== undefined)
      patch["responsavel_interno"] = campos.responsavel_interno || null;
    if (campos.proximo_followup !== undefined)
      patch["proximo_followup"] = campos.proximo_followup || null;
    if (campos.observacoes_internas !== undefined)
      patch["observacoes_internas"] = campos.observacoes_internas || null;

    const { error } = await supabaseAdmin.from("leads").update(patch).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
