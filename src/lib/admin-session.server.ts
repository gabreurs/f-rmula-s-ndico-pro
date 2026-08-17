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

/** Garante que a requisição vem de uma sessão administrativa liberada. */
export async function requireUnlocked() {
  const session = await useSession<PainelSession>(sessionConfig());
  if (!session.data.unlocked) throw new Error("NAO_AUTORIZADO");
  return session;
}
