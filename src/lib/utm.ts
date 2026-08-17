/** Captura e preserva UTMs na sessão até o envio de um formulário. */

export type Utms = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

const CHAVES: (keyof Utms)[] = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
];

const STORAGE = "fs_utms";

/** Chame dentro de useEffect. Persiste UTMs da URL na sessão. */
export function capturarUtms() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const encontrados: Utms = {};
  for (const k of CHAVES) {
    const v = params.get(k);
    if (v) encontrados[k] = v.slice(0, 180);
  }
  if (Object.keys(encontrados).length === 0) return;
  try {
    window.sessionStorage.setItem(STORAGE, JSON.stringify(encontrados));
  } catch {
    /* sessão indisponível — segue sem UTMs */
  }
}

export function lerUtms(): Utms {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.sessionStorage.getItem(STORAGE) ?? "{}") as Utms;
  } catch {
    return {};
  }
}
