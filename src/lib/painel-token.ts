import { createMiddleware } from "@tanstack/react-start";

const CHAVE = "painel-formula-sindico-token";

export function guardarToken(token: string) {
  try {
    localStorage.setItem(CHAVE, token);
  } catch {
    /* ignore */
  }
}

export function lerToken(): string | null {
  try {
    return localStorage.getItem(CHAVE);
  } catch {
    return null;
  }
}

export function limparToken() {
  try {
    localStorage.removeItem(CHAVE);
  } catch {
    /* ignore */
  }
}

/**
 * Cookies de sessão são bloqueados quando o app roda dentro de um iframe
 * cross-site (preview). Por isso o token do painel viaja em um header.
 */
export const attachPainelToken = createMiddleware({ type: "function" }).client(
  async ({ next }) => {
    const token = typeof window === "undefined" ? null : lerToken();
    return next(token ? { headers: { "x-painel-token": token } } : {});
  },
);
