import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState, type FormEvent } from "react";
import {
  entrarPainel,
  listarLeads,
  atualizarLead,
  sairPainel,
  statusPainel,
} from "@/lib/painel.functions";
import { STATUS_OPTIONS } from "@/lib/formula-sindico";
import type { Tables } from "@/integrations/supabase/types";

type Lead = Tables<"leads">;

export const Route = createFileRoute("/painel")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Painel interno — Fórmula Síndico" },
      { name: "description", content: "Área interna de gestão de leads do Fórmula Síndico." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Painel interno — Fórmula Síndico" },
      { property: "og:description", content: "Área interna de gestão de leads." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Painel,
});

const fieldClass =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-gold focus:outline-none";

function Painel() {
  const entrar = useServerFn(entrarPainel);
  const sair = useServerFn(sairPainel);
  const carregar = useServerFn(listarLeads);
  const checar = useServerFn(statusPainel);

  const [liberado, setLiberado] = useState(false);
  const [verificando, setVerificando] = useState(true);
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [carregando, setCarregando] = useState(false);

  async function buscar() {
    setCarregando(true);
    try {
      setLeads((await carregar()) as Lead[]);
    } catch {
      setErro("Não foi possível carregar os leads.");
    }
    setCarregando(false);
  }

  useEffect(() => {
    checar()
      .then(async (r) => {
        if (r.unlocked) {
          setLiberado(true);
          await buscar();
        }
      })
      .finally(() => setVerificando(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onEntrar(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    const { ok } = await entrar({ data: { senha } });
    if (!ok) {
      setErro("Senha incorreta.");
      return;
    }
    setLiberado(true);
    setSenha("");
    await buscar();
  }

  if (verificando) {
    return <p className="p-10 text-sm text-muted-foreground">Carregando…</p>;
  }

  if (!liberado) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <form onSubmit={onEntrar} className="surface-panel w-full max-w-sm p-8">
          <h1 className="text-2xl">Painel interno</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Acesso restrito à equipe do Fórmula Síndico.
          </p>
          <label htmlFor="senha" className="mt-6 mb-1.5 block text-sm font-medium">
            Senha
          </label>
          <input
            id="senha"
            type="password"
            autoComplete="current-password"
            className={fieldClass}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          {erro && (
            <p role="alert" className="mt-2 text-xs text-destructive">
              {erro}
            </p>
          )}
          <button
            type="submit"
            className="mt-6 w-full rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-gold-soft"
          >
            Entrar
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl">Leads</h1>
          <p className="text-sm text-muted-foreground">
            {leads.length} registro(s){carregando ? " — atualizando…" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={buscar}
            className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-accent"
          >
            Atualizar
          </button>
          <button
            onClick={async () => {
              await sair();
              setLiberado(false);
              setLeads([]);
            }}
            className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-accent"
          >
            Sair
          </button>
        </div>
      </div>

      <div className="mt-8 space-y-5">
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} onSaved={buscar} />
        ))}
        {leads.length === 0 && !carregando && (
          <p className="text-sm text-muted-foreground">Nenhum lead ainda.</p>
        )}
      </div>
    </main>
  );
}

function LeadCard({ lead, onSaved }: { lead: Lead; onSaved: () => void }) {
  const salvar = useServerFn(atualizarLead);
  const [status, setStatus] = useState(lead.status);
  const [responsavel, setResponsavel] = useState(lead.responsavel_interno ?? "");
  const [followup, setFollowup] = useState(lead.proximo_followup ?? "");
  const [obs, setObs] = useState(lead.observacoes_internas ?? "");
  const [estado, setEstado] = useState<"idle" | "salvando" | "ok" | "erro">("idle");

  async function onSalvar() {
    setEstado("salvando");
    try {
      await salvar({
        data: {
          id: lead.id,
          status,
          responsavel_interno: responsavel,
          proximo_followup: followup,
          observacoes_internas: obs,
        },
      });
      setEstado("ok");
      onSaved();
    } catch {
      setEstado("erro");
    }
  }

  return (
    <article className="surface-panel p-6">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <h2 className="text-lg">{lead.administradora}</h2>
          <p className="text-sm text-muted-foreground">
            {lead.nome_responsavel}
            {lead.cargo ? ` · ${lead.cargo}` : ""} — {lead.cidade}/{lead.uf}
          </p>
          <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <Info label="WhatsApp" valor={lead.whatsapp} />
            <Info label="E-mail" valor={lead.email} />
            <Info label="Condomínios" valor={lead.qtd_condominios} />
            <Info label="Síndicos" valor={lead.qtd_sindicos} />
            <Info label="Formato" valor={lead.formato_preferido} />
            <Info label="Período" valor={lead.periodo_desejado} />
            <Info label="Origem" valor={lead.origem} />
            <Info
              label="Recebido em"
              valor={new Date(lead.created_at).toLocaleString("pt-BR")}
            />
          </dl>
          {lead.observacoes_lead && (
            <p className="mt-4 rounded-md border border-border bg-background/60 p-3 text-sm text-muted-foreground">
              {lead.observacoes_lead}
            </p>
          )}
        </div>

        <div className="grid gap-4">
          <div>
            <label htmlFor={`status-${lead.id}`} className="mb-1.5 block text-sm font-medium">
              Status
            </label>
            <select
              id={`status-${lead.id}`}
              className={fieldClass}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor={`resp-${lead.id}`}
                className="mb-1.5 block text-sm font-medium"
              >
                Responsável interno
              </label>
              <input
                id={`resp-${lead.id}`}
                className={fieldClass}
                value={responsavel}
                onChange={(e) => setResponsavel(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor={`fup-${lead.id}`}
                className="mb-1.5 block text-sm font-medium"
              >
                Próximo follow-up
              </label>
              <input
                id={`fup-${lead.id}`}
                type="date"
                className={fieldClass}
                value={followup}
                onChange={(e) => setFollowup(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor={`obs-${lead.id}`} className="mb-1.5 block text-sm font-medium">
              Observações internas
            </label>
            <textarea
              id={`obs-${lead.id}`}
              rows={3}
              className={fieldClass}
              value={obs}
              onChange={(e) => setObs(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onSalvar}
              disabled={estado === "salvando"}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-gold-soft disabled:opacity-60"
            >
              {estado === "salvando" ? "Salvando…" : "Salvar"}
            </button>
            {estado === "ok" && <span className="text-xs text-gold">Salvo.</span>}
            {estado === "erro" && (
              <span className="text-xs text-destructive">Erro ao salvar.</span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function Info({ label, valor }: { label: string; valor: string | number | null }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd>{valor === null || valor === "" ? "—" : valor}</dd>
    </div>
  );
}
