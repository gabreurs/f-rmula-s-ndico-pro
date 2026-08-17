import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState, type FormEvent } from "react";
import { entrarPainel, sairPainel, statusPainel } from "@/lib/painel.functions";
import { adminResumo } from "@/lib/crm.functions";
import { Contatos } from "@/components/admin/Contatos";
import { Eventos } from "@/components/admin/Eventos";
import { Parceiros } from "@/components/admin/Parceiros";
import { Importar } from "@/components/admin/Importar";
import { Card, Painel, btnCls, dataBr, inputCls } from "@/components/admin/ui";
import { TIPOS_EVENTO, rotulo } from "@/lib/crm";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Base de relacionamento — Fórmula Síndico" },
      {
        name: "description",
        content:
          "Área interna da base central de relacionamento do Fórmula Síndico: contatos, eventos, parceiros e importações.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Base de relacionamento — Fórmula Síndico" },
      {
        property: "og:description",
        content: "Área interna de gestão de contatos e eventos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Admin,
});

const ABAS = [
  { id: "visao", label: "Visão geral" },
  { id: "contatos", label: "Contatos" },
  { id: "eventos", label: "Eventos" },
  { id: "parceiros", label: "Parceiros" },
  { id: "importar", label: "Importar" },
] as const;

type Aba = (typeof ABAS)[number]["id"];

function Admin() {
  const entrar = useServerFn(entrarPainel);
  const sair = useServerFn(sairPainel);
  const checar = useServerFn(statusPainel);

  const [liberado, setLiberado] = useState(false);
  const [verificando, setVerificando] = useState(true);
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [aba, setAba] = useState<Aba>("visao");

  useEffect(() => {
    checar()
      .then((r) => setLiberado(Boolean(r?.unlocked)))
      .catch(() => setLiberado(false))
      .finally(() => setVerificando(false));
  }, [checar]);

  async function onEntrar(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    const r = await entrar({ data: { senha } });
    if (r.ok) {
      setLiberado(true);
      setSenha("");
    } else {
      setErro("Senha inválida.");
    }
  }

  if (verificando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Carregando…
      </main>
    );
  }

  if (!liberado) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-5">
        <form onSubmit={onEntrar} className="surface-panel w-full max-w-sm p-8">
          <h1 className="display-lg">Base de relacionamento</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Área restrita à equipe do Fórmula Síndico.
          </p>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Senha de acesso"
            className={`${inputCls} mt-6`}
          />
          {erro && <p className="mt-3 text-sm text-destructive">{erro}</p>}
          <button type="submit" className={`${btnCls} mt-5 w-full`}>
            Entrar
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1600px] px-5 py-10 md:px-10">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="rule-label text-gold">Interno</p>
            <h1 className="display-lg mt-3">Base central de relacionamento</h1>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/painel" className="text-muted-foreground hover:text-gold">
              Pipeline de administradoras
            </Link>
            <button
              className="text-muted-foreground hover:text-gold"
              onClick={async () => {
                await sair();
                setLiberado(false);
              }}
            >
              Sair
            </button>
          </div>
        </header>

        <nav className="mt-8 flex flex-wrap gap-2 border-b border-border">
          {ABAS.map((a) => (
            <button
              key={a.id}
              onClick={() => setAba(a.id)}
              className={`-mb-px border-b-2 px-4 py-3 text-sm transition-colors ${
                aba === a.id
                  ? "border-gold text-gold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {a.label}
            </button>
          ))}
        </nav>

        <div className="mt-8">
          {aba === "visao" && <VisaoGeral />}
          {aba === "contatos" && <Contatos />}
          {aba === "eventos" && <Eventos />}
          {aba === "parceiros" && <Parceiros />}
          {aba === "importar" && <Importar />}
        </div>
      </div>
    </main>
  );
}

function VisaoGeral() {
  const resumo = useServerFn(adminResumo);
  const [dados, setDados] = useState<any>(null);

  useEffect(() => {
    resumo()
      .then(setDados)
      .catch(() => setDados(null));
  }, [resumo]);

  if (!dados) return <p className="text-sm text-muted-foreground">Carregando…</p>;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card titulo="Contatos" valor={dados.total} />
        <Card titulo="Síndicos" valor={dados.sindicos} />
        <Card titulo="Administradoras" valor={dados.administradoras} />
        <Card titulo="Parceiros" valor={dados.parceiros} />
        <Card titulo="Novos (30 dias)" valor={dados.novos30} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Painel titulo="Últimos contatos">
          {dados.ultimos.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum contato ainda.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {dados.ultimos.map((c: any) => (
                <li key={c.id} className="flex justify-between gap-4 border-b border-border pb-2">
                  <span>{c.nome}</span>
                  <span className="text-muted-foreground">
                    {[c.cidade, c.uf].filter(Boolean).join("/") || c.source || "—"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Painel>

        <Painel titulo="Próximos eventos">
          {dados.proximosEventos.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum evento cadastrado.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {dados.proximosEventos.map((e: any) => (
                <li key={e.id} className="flex justify-between gap-4 border-b border-border pb-2">
                  <span>
                    {e.nome}
                    <span className="ml-2 text-xs text-muted-foreground">
                      {rotulo(TIPOS_EVENTO, e.tipo)}
                    </span>
                  </span>
                  <span className="text-muted-foreground">{dataBr(e.data)}</span>
                </li>
              ))}
            </ul>
          )}
        </Painel>
      </div>

      <Painel titulo="Importações recentes">
        {dados.importacoes.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma importação realizada.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {dados.importacoes.map((i: any) => (
              <li key={i.id} className="flex flex-wrap justify-between gap-4 border-b border-border pb-2">
                <span>{i.arquivo ?? i.source ?? "Importação"}</span>
                <span className="text-muted-foreground">
                  {i.novos} novos · {i.atualizados} atualizados · {i.erros} erros ·{" "}
                  {dataBr(i.created_at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Painel>
    </div>
  );
}
