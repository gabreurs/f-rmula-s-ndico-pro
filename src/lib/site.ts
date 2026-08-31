/** Domínio oficial do projeto. Centraliza URLs públicas (canonical, OG, sitemap). */
export const SITE_URL = "https://formulasindico.com.br";

/** Monta uma URL absoluta a partir de um caminho interno. */
export function urlAbsoluta(path = "/") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Ponto único de configuração de tags de analytics/ads.
 * Preencha quando os IDs oficiais existirem — vazio = nada é carregado.
 */
export const ANALYTICS = {
  googleAdsId: "",
  googleAnalyticsId: "",
};
