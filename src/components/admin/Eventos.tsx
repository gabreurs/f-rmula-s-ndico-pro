import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  adminAtualizarParticipacao,
  adminListarEventos,
  adminParticipantes,
  adminSalvarEvento,
} from "@/lib/crm.functions";
import {
  MODALIDADES,
  STATUS_EVENTO,
  STATUS_PARTICIPACAO,
  TIPOS_EVENTO,
  rotulo,
  slugify,
} from "@/lib/crm";
import { UFS } from "@/lib/formula-sindico";
import { Campo, Painel, Selecao, btnCls, btnGhostCls, dataBr, inputCls } from "./ui";

type Evento = Record<string, any>;

const vazio = {
  nome: "",
  tipo: "curso_presencial",
  modalidade: "presencial",
  data: "",
  horario: "",
  cidade: "",
  uf: "",
  local: "",
  url_inscricao: "",
  plataforma_inscricao: "",
  status: "planejamento",
  observacoes: "",
};

export function Eventos() {
  const listar = useServerFn(adminListarEventos);
  const salvar = useServerFn(adminSalvarEvento);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [form, setForm] = useState<Record<string, string>>(vazio);
  const [editando, setEditando] = useState<string | null>(null);
  const [verParticipantes, setVerParticipantes] = useState<Evento | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const buscar = useCallback(async () => {
    setEventos((await listar()) as Evento[]);
  }, [listar]);

  useEffect(() => {
    void buscar();
  }, [buscar]);

  async function onSalvar() {
    setErro(null);
    if (!form["nome"]?.trim()) {
      setErro("Informe o nome do evento.");
      return;
    }
    const valores: Record<string, string | null> = {
      ...form,
      slug: slugify(form["nome"]!),
      data: form["data"] || null,
    };
    for (const k of Object.keys(valores)) if (valores[k] === "") valores[k] = null;
    try {
      await salvar({ data: editando ? { id: editando, valores } : { valores } });
      setForm(vazio);
      setEditando(null);
      await buscar();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Falha ao salvar.");
    }
  }

  if (verParticipantes) {
    return (
      <Participantes evento={verParticipantes} onVoltar={() => setVerParticipantes(null)} />
    );
  }

  return (
    <div className="space-y-5">
      <Painel titulo={editando ? "Editar evento" : "Novo evento / turma"}>
        <div className="grid gap-3 md:grid-cols-4">
          <Campo label="Nome" value={form["nome"] ?? ""} onChange={(v) => setForm((f) => ({ ...f, nome: v }))} />
          <Selecao label="Tipo" value={form["tipo"] ?? ""} onChange={(v) => setForm((f) => ({ ...f, tipo: v }))} options={TIPOS_EVENTO} />
          <Selecao label="Modalidade" value={form["modalidade"] ?? ""} onChange={(v) => setForm((f) => ({ ...f, modalidade: v }))} options={MODALIDADES} />
          <Selecao label="Situação" value={form["status"] ?? ""} onChange={(v) => setForm((f) => ({ ...f, status: v }))} options={STATUS_EVENTO} />
          <Campo label="Data" type="date" value={form["data"] ?? ""} onChange={(v) => setForm((f) => ({ ...f, data: v }))} />
          <Campo label="Horário" value={form["horario"] ?? ""} onChange={(v) => setForm((f) => ({ ...f, horario: v }))} />
          <Campo label="Cidade" value={form["cidade"] ?? ""} onChange={(v) => setForm((f) => ({ ...f, cidade: v }))} />
          <Selecao label="Estado" value={form["uf"] ?? ""} onChange={(v) => setForm((f) => ({ ...f, uf: v }))} options={UFS.map((u) => ({ value: u, label: u }))} />
          <Campo label="Local" value={form["local"] ?? ""} onChange={(v) => setForm((f) => ({ ...f, local: v }))} />
          <Campo label="URL de inscrição" value={form["url_inscricao"] ?? ""} onChange={(v) => setForm((f) => ({ ...f, url_inscricao: v }))} />
          <Campo label="Plataforma" placeholder="Sympla" value={form["plataforma_inscricao"] ?? ""} onChange={(v) => setForm((f) => ({ ...f, plataforma_inscricao: v }))} />
        </div>
        <label className="mt-3 block text-sm">
          <span className="mb-1 block text-muted-foreground">Observações</span>
          <textarea rows={2} className={inputCls} value={form["observacoes"] ?? ""} onChange={(e) => setForm((f) => ({ ...f, observacoes: e.target.value }))} />
        </label>
        {erro && <p className="mt-3 text-sm text-destructive">{erro}</p>}
        <div className="mt-4 flex gap-3">
          <button onClick={onSalvar} className={btnCls}>
            {editando ? "Salvar alterações" : "Criar evento"}
          </button>
          {editando && (
            <button className={btnGhostCls} onClick={() => { setEditando(null); setForm(vazio); }}>
              Cancelar
            </button>
          )}
        </div>
      </Painel>

      <Painel titulo={`Eventos (${eventos.length})`}>
        {eventos.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum evento cadastrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="py-2 pr-4">Nome</th>
                  <th className="py-2 pr-4">Tipo</th>
                  <th className="py-2 pr-4">Data</th>
                  <th className="py-2 pr-4">Cidade/UF</th>
                  <th className="py-2 pr-4">Situação</th>
                  <th className="py-2 pr-4"></th>
                </tr>
              </thead>
              <tbody>
                {eventos.map((e) => (
                  <tr key={e["id"]} className="border-t border-border">
                    <td className="py-2 pr-4">{e["nome"]}</td>
                    <td className="py-2 pr-4">{rotulo(TIPOS_EVENTO, e["tipo"])}</td>
                    <td className="py-2 pr-4">{dataBr(e["data"])}</td>
                    <td className="py-2 pr-4">{[e["cidade"], e["uf"]].filter(Boolean).join("/") || "—"}</td>
                    <td className="py-2 pr-4">{rotulo(STATUS_EVENTO, e["status"])}</td>
                    <td className="py-2 pr-4">
                      <div className="flex gap-2">
                        <button
                          className="text-gold hover:underline"
                          onClick={() => {
                            setEditando(e["id"]);
                            setForm({
                              nome: e["nome"] ?? "",
                              tipo: e["tipo"] ?? "",
                              modalidade: e["modalidade"] ?? "",
                              data: e["data"] ?? "",
                              horario: e["horario"] ?? "",
                              cidade: e["cidade"] ?? "",
                              uf: e["uf"] ?? "",
                              local: e["local"] ?? "",
                              url_inscricao: e["url_inscricao"] ?? "",
                              plataforma_inscricao: e["plataforma_inscricao"] ?? "",
                              status: e["status"] ?? "",
                              observacoes: e["observacoes"] ?? "",
                            });
                          }}
                        >
                          Editar
                        </button>
                        <button className="text-gold hover:underline" onClick={() => setVerParticipantes(e)}>
                          Participantes
                        </button>
                      </div>
                    </td>
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

function Participantes({ evento, onVoltar }: { evento: Evento; onVoltar: () => void }) {
  const listar = useServerFn(adminParticipantes);
  const atualizar = useServerFn(adminAtualizarParticipacao);
  const [linhas, setLinhas] = useState<any[]>([]);

  const buscar = useCallback(async () => {
    setLinhas((await listar({ data: { event_id: evento["id"] } })) as any[]);
  }, [listar, evento]);

  useEffect(() => {
    void buscar();
  }, [buscar]);

  return (
    <div className="space-y-5">
      <button className={btnGhostCls} onClick={onVoltar}>
        ← Voltar
      </button>
      <Painel titulo={`${evento["nome"]} — participantes (${linhas.length})`}>
        {linhas.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum participante vinculado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="py-2 pr-4">Nome</th>
                  <th className="py-2 pr-4">E-mail</th>
                  <th className="py-2 pr-4">WhatsApp</th>
                  <th className="py-2 pr-4">Cidade/UF</th>
                  <th className="py-2 pr-4">Situação</th>
                </tr>
              </thead>
              <tbody>
                {linhas.map((p) => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="py-2 pr-4">{p.contacts?.nome}</td>
                    <td className="py-2 pr-4">{p.contacts?.email ?? "—"}</td>
                    <td className="py-2 pr-4">{p.contacts?.whatsapp ?? "—"}</td>
                    <td className="py-2 pr-4">
                      {[p.contacts?.cidade, p.contacts?.uf].filter(Boolean).join("/") || "—"}
                    </td>
                    <td className="py-2 pr-4">
                      <select
                        className={inputCls}
                        value={p.status}
                        onChange={async (e) => {
                          await atualizar({ data: { id: p.id, status: e.target.value } });
                          await buscar();
                        }}
                      >
                        {STATUS_PARTICIPACAO.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>
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
