import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  adminAtualizarContato,
  adminContato,
  adminListarContatos,
  adminRegistrarInteracao,
} from "@/lib/crm.functions";
import { INTERESSES, PERFIS, SOURCES, TIPOS_INTERACAO, rotulo } from "@/lib/crm";
import { UFS } from "@/lib/formula-sindico";
import { Campo, Painel, Selecao, btnCls, btnGhostCls, dataBr, inputCls } from "./ui";

type Contato = Record<string, any>;

export function Contatos() {
  const listar = useServerFn(adminListarContatos);
  const [filtros, setFiltros] = useState({
    busca: "",
    perfil: "",
    uf: "",
    source: "",
    interesse: "",
  });
  const [linhas, setLinhas] = useState<Contato[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [aberto, setAberto] = useState<string | null>(null);

  const buscar = useCallback(async () => {
    setCarregando(true);
    try {
      setLinhas((await listar({ data: filtros })) as Contato[]);
    } finally {
      setCarregando(false);
    }
  }, [listar, filtros]);

  useEffect(() => {
    const t = setTimeout(buscar, 250);
    return () => clearTimeout(t);
  }, [buscar]);

  if (aberto) {
    return <Ficha id={aberto} onVoltar={() => { setAberto(null); void buscar(); }} />;
  }

  return (
    <div className="space-y-5">
      <Painel titulo="Filtros">
        <div className="grid gap-3 md:grid-cols-5">
          <Campo
            label="Busca (nome, e-mail, telefone)"
            value={filtros.busca}
            onChange={(v) => setFiltros((f) => ({ ...f, busca: v }))}
          />
          <Selecao
            label="Perfil"
            value={filtros.perfil}
            onChange={(v) => setFiltros((f) => ({ ...f, perfil: v }))}
            options={PERFIS.map((p) => ({ value: p.value, label: p.label }))}
            vazio="Todos"
          />
          <Selecao
            label="Estado"
            value={filtros.uf}
            onChange={(v) => setFiltros((f) => ({ ...f, uf: v }))}
            options={UFS.map((u) => ({ value: u, label: u }))}
            vazio="Todos"
          />
          <Selecao
            label="Origem"
            value={filtros.source}
            onChange={(v) => setFiltros((f) => ({ ...f, source: v }))}
            options={SOURCES.map((s) => ({ value: s, label: s }))}
            vazio="Todas"
          />
          <Selecao
            label="Interesse"
            value={filtros.interesse}
            onChange={(v) => setFiltros((f) => ({ ...f, interesse: v }))}
            options={INTERESSES.map((s) => ({ value: s, label: s }))}
            vazio="Todos"
          />
        </div>
      </Painel>

      <Painel titulo={`Contatos (${linhas.length})`}>
        {carregando && <p className="text-sm text-muted-foreground">Carregando…</p>}
        {!carregando && linhas.length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhum contato encontrado.</p>
        )}
        {linhas.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="py-2 pr-4">Nome</th>
                  <th className="py-2 pr-4">Perfil</th>
                  <th className="py-2 pr-4">Cidade/UF</th>
                  <th className="py-2 pr-4">Origem</th>
                  <th className="py-2 pr-4">Interesses</th>
                  <th className="py-2 pr-4">Última interação</th>
                  <th className="py-2 pr-4">Entrada</th>
                </tr>
              </thead>
              <tbody>
                {linhas.map((c) => (
                  <tr
                    key={c["id"]}
                    onClick={() => setAberto(c["id"])}
                    className="cursor-pointer border-t border-border hover:bg-background"
                  >
                    <td className="py-2 pr-4">{c["nome"]}</td>
                    <td className="py-2 pr-4">
                      {(c["perfis"] ?? [])
                        .map((p: string) => rotulo([...PERFIS], p))
                        .join(", ") || "—"}
                    </td>
                    <td className="py-2 pr-4">
                      {[c["cidade"], c["uf"]].filter(Boolean).join("/") || "—"}
                    </td>
                    <td className="py-2 pr-4">{c["source"]}</td>
                    <td className="py-2 pr-4">{(c["interesses"] ?? []).join(", ") || "—"}</td>
                    <td className="py-2 pr-4">{dataBr(c["ultima_interacao_em"])}</td>
                    <td className="py-2 pr-4">{dataBr(c["created_at"])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Painel>
    </div>
  );
}

function Ficha({ id, onVoltar }: { id: string; onVoltar: () => void }) {
  const carregar = useServerFn(adminContato);
  const salvar = useServerFn(adminAtualizarContato);
  const interagir = useServerFn(adminRegistrarInteracao);

  const [dados, setDados] = useState<any>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [novaInteracao, setNovaInteracao] = useState({ tipo: "observacao", descricao: "" });
  const [salvo, setSalvo] = useState(false);

  const buscar = useCallback(async () => {
    const r = (await carregar({ data: { id } })) as any;
    setDados(r);
    const c = r.contato ?? {};
    setForm({
      nome: c.nome ?? "",
      email: c.email ?? "",
      whatsapp: c.whatsapp ?? "",
      cidade: c.cidade ?? "",
      uf: c.uf ?? "",
      administradora: c.administradora ?? "",
      cargo: c.cargo ?? "",
      qtd_condominios: c.qtd_condominios?.toString() ?? "",
      observacoes: c.observacoes ?? "",
    });
  }, [carregar, id]);

  useEffect(() => {
    void buscar();
  }, [buscar]);

  if (!dados?.contato) return <p className="text-sm text-muted-foreground">Carregando…</p>;
  const c = dados.contato;

  async function onSalvar() {
    await salvar({
      data: {
        id,
        patch: {
          ...form,
          qtd_condominios: form["qtd_condominios"] ? Number(form["qtd_condominios"]) : null,
        },
      },
    });
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2500);
    await buscar();
  }

  return (
    <div className="space-y-5">
      <button onClick={onVoltar} className={btnGhostCls}>
        ← Voltar
      </button>

      <Painel titulo="Informações">
        <div className="grid gap-3 md:grid-cols-3">
          {(
            [
              ["nome", "Nome"],
              ["email", "E-mail"],
              ["whatsapp", "WhatsApp"],
              ["cidade", "Cidade"],
              ["uf", "Estado"],
              ["administradora", "Administradora"],
              ["cargo", "Cargo"],
              ["qtd_condominios", "Qtd. condomínios"],
            ] as [string, string][]
          ).map(([k, label]) => (
            <Campo
              key={k}
              label={label}
              value={form[k] ?? ""}
              onChange={(v) => setForm((f) => ({ ...f, [k]: v }))}
            />
          ))}
        </div>
        <label className="mt-3 block text-sm">
          <span className="mb-1 block text-muted-foreground">Observações</span>
          <textarea
            rows={3}
            className={inputCls}
            value={form["observacoes"] ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, observacoes: e.target.value }))}
          />
        </label>
        <div className="mt-4 flex items-center gap-3">
          <button onClick={onSalvar} className={btnCls}>
            Salvar
          </button>
          {salvo && <span className="text-sm text-gold">Salvo.</span>}
        </div>
      </Painel>

      <div className="grid gap-5 lg:grid-cols-2">
        <Painel titulo="Perfil, interesses e origem">
          <dl className="space-y-2 text-sm">
            <Linha t="Perfis" v={(c.perfis ?? []).map((p: string) => rotulo([...PERFIS], p)).join(", ")} />
            <Linha t="Tipo de síndico" v={c.tipo_sindico} />
            <Linha t="Interesses" v={(c.interesses ?? []).join(", ")} />
            <Linha t="Origem" v={c.source} />
            <Linha t="Detalhe da origem" v={c.source_detail} />
            <Linha
              t="Campanha (UTM)"
              v={[c.utm_source, c.utm_medium, c.utm_campaign, c.utm_content, c.utm_term]
                .filter(Boolean)
                .join(" · ")}
            />
            <Linha t="Entrada" v={dataBr(c.created_at)} />
          </dl>
        </Painel>

        <Painel titulo="Eventos / cursos">
          {dados.participacoes.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma participação registrada.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {dados.participacoes.map((p: any) => (
                <li key={p.id} className="border-b border-border pb-2">
                  {p.events?.nome ?? "Evento"} — {p.status}
                  <span className="text-muted-foreground"> · {dataBr(p.events?.data)}</span>
                </li>
              ))}
            </ul>
          )}
        </Painel>
      </div>

      <Painel titulo="Timeline">
        <div className="flex flex-wrap items-end gap-3">
          <div className="w-52">
            <Selecao
              label="Tipo"
              value={novaInteracao.tipo}
              onChange={(v) => setNovaInteracao((n) => ({ ...n, tipo: v }))}
              options={TIPOS_INTERACAO}
              vazio="Selecione"
            />
          </div>
          <div className="min-w-[240px] flex-1">
            <Campo
              label="Descrição"
              value={novaInteracao.descricao}
              onChange={(v) => setNovaInteracao((n) => ({ ...n, descricao: v }))}
            />
          </div>
          <button
            className={btnCls}
            onClick={async () => {
              if (!novaInteracao.descricao.trim()) return;
              await interagir({ data: { contact_id: id, ...novaInteracao } });
              setNovaInteracao({ tipo: "observacao", descricao: "" });
              await buscar();
            }}
          >
            Registrar
          </button>
        </div>

        <ul className="mt-5 space-y-2 text-sm">
          {dados.interacoes.map((i: any) => (
            <li key={i.id} className="border-b border-border pb-2">
              <span className="text-muted-foreground">{dataBr(i.created_at)}</span> —{" "}
              {rotulo(TIPOS_INTERACAO, i.tipo)}
              {i.descricao ? `: ${i.descricao}` : ""}
            </li>
          ))}
          {dados.interacoes.length === 0 && (
            <li className="text-muted-foreground">Sem registros ainda.</li>
          )}
        </ul>
      </Painel>
    </div>
  );
}

function Linha({ t, v }: { t: string; v?: string | null }) {
  return (
    <div className="flex gap-3">
      <dt className="w-40 shrink-0 text-muted-foreground">{t}</dt>
      <dd>{v || "—"}</dd>
    </div>
  );
}
