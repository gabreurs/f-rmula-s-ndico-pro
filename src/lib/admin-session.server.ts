import { useSession } from "@tanstack/react-start/server";

export type PainelSession = { unlocked?: boolean };

export function sessionConfig() {
  return {
    password: process.env["SESSION_SECRET"]!,
    name: "painel-formula-sindico",
    maxAge: 60 * 60 * 8,
    cookie: {
      httpOnly: true,
      secure: true,
      // "none" para o cookie funcionar dentro do preview em iframe (cross-site).
      sameSite: "none" as const,
      path: "/",
    },
  };
}

const DURACAO_MS = 1000 * 60 * 60 * 8;

async function assinar(payload: string) {
  const { createHmac } = await import("node:crypto");
  return createHmac("sha256", process.env["SESSION_SECRET"]!)
    .update(payload)
    .digest("hex");
}

/** Token HMAC usado quando o cookie de sessão é bloqueado (iframe cross-site). */
export async function criarTokenPainel() {
  const exp = String(Date.now() + DURACAO_MS);
  return `${exp}.${await assinar(exp)}`;
}

export async function tokenPainelValido(token: string | null | undefined) {
  if (!token) return false;
  const [exp, assinatura] = token.split(".");
  if (!exp || !assinatura) return false;
  if (Number(exp) < Date.now()) return false;
  const esperado = await assinar(exp);
  return esperado === assinatura;
}

/** true se o request tem cookie de sessão liberado OU token válido no header. */
export async function sessaoLiberada() {
  const { getRequestHeader } = await import("@tanstack/react-start/server");
  if (await tokenPainelValido(getRequestHeader("x-painel-token"))) return true;
  try {
    const session = await useSession<PainelSession>(sessionConfig());
    return Boolean(session.data.unlocked);
  } catch {
    return false;
  }
}

/** Garante que a requisição vem de uma sessão administrativa liberada. */
export async function requireUnlocked() {
  if (!(await sessaoLiberada())) throw new Error("NAO_AUTORIZADO");
}
