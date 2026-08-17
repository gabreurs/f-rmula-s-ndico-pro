import type { ReactNode } from "react";

export const inputCls =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none";

export const btnCls =
  "rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-gold-soft disabled:opacity-60";

export const btnGhostCls =
  "rounded-md border border-border px-4 py-2 text-sm transition-colors hover:border-gold hover:text-gold";

export function Card({ titulo, valor }: { titulo: string; valor: number | string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{titulo}</p>
      <p className="mt-2 text-3xl">{valor}</p>
    </div>
  );
}

export function Painel({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-border bg-surface p-5">
      <h2 className="text-sm uppercase tracking-wider text-muted-foreground">{titulo}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function Campo({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
      />
    </label>
  );
}

export function Selecao({
  label,
  value,
  onChange,
  options,
  vazio = "Selecione",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  vazio?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-muted-foreground">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls}>
        <option value="">{vazio}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function dataBr(v?: string | null) {
  if (!v) return "—";
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("pt-BR");
}
