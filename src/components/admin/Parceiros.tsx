import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { adminListarParceiros, adminSalvarParceiro } from "@/lib/crm.functions";
import { UFS } from "@/lib/formula-sindico";
import { Campo, Painel, Selecao, btnCls, btnGhostCls, inputCls } from "./ui";

const vazio = {
  empresa: "",
  segmento: "",
  responsavel: "",
  telefone: "",
  email: "",
  cidade: "",
  uf: "",
  tipo_parceria: "",
  observacoes: "",
};

export function Parceiros() {
  const listar = useServerFn(adminListarParceiros);
  const salvar = useServerFn(adminSalvarParceiro);
  const [linhas, setLinhas] = useState<any[]>([]);
  const [form, setForm] = useState<Record<string, string>>(vazio);
  const [editando, setEditando] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const buscar = useCallback(async () => {
    setLinhas((await listar()) as any[]);
  }, [listar]);

  useEffect(() => {
    void buscar();
  }, [buscar]);

  async function onSalvar() {
    setErro(null);
    if (!form["empresa"]?.trim()) {
      setErro("Informe o nome da empresa.");
      return;
    }
    const valores: Record<string, string | null> = { ...form };
    for (const k of Object.keys(valores)) if (valores[k] === "") valores[k] = null;
    await salvar({ data: editando ? { id: editando, valores } : { valores } });
    setForm(vazio);
    setEditando(null);
    await buscar();
  }

  return (
    <div className="space-y-5">
      <Painel titulo={editando ? "Editar parceiro" : "Novo parceiro / fornecedor"}>
        <div className="grid gap-3 md:grid-cols-4">
          <Campo label="Empresa" value={form["empresa"] ?? ""} onChange={(v) => setForm((f) => ({ ...f, empresa: v }))} />
          <Campo label="Segmento" value={form["segmento"] ?? ""} onChange={(v) => setForm((f) => ({ ...f, segmento: v }))} />
          <Campo label="Responsável" value={form["responsavel"] ?? ""} onChange={(v) => setForm((f) => ({ ...f, responsavel: v }))} />
          <Campo label="Telefone" value={form["telefone"] ?? ""} onChange={(v) => setForm((f) => ({ ...f, telefone: v }))} />
          <Campo label="E-mail" value={form["email"] ?? ""} onChange={(v) => setForm((f) => ({ ...f, email: v }))} />
          <Campo label="Cidade" value={form["cidade"] ?? ""} onChange={(v) => setForm((f) => ({ ...f, cidade: v }))} />
          <Selecao label="Estado" value={form["uf"] ?? ""} onChange={(v) => setForm((f) => ({ ...f, uf: v }))} options={UFS.map((u) => ({ value: u, label: u }))} />
          <Campo label="Tipo de parceria" value={form["tipo_parceria"] ?? ""} onChange={(v) => setForm((f) => ({ ...f, tipo_parceria: v }))} />
        </div>
        <label className="mt-3 block text-sm">
          <span className="mb-1 block text-muted-foreground">Observações</span>
          <textarea rows={2} className={inputCls} value={form["observacoes"] ?? ""} onChange={(e) => setForm((f) => ({ ...f, observacoes: e.target.value }))} />
        </label>
        {erro && <p className="mt-3 text-sm text-destructive">{erro}</p>}
        <div className="mt-4 flex gap-3">
          <button className={btnCls} onClick={onSalvar}>
            {editando ? "Salvar alterações" : "Cadastrar parceiro"}
          </button>
          {editando && (
            <button className={btnGhostCls} onClick={() => { setEditando(null); setForm(vazio); }}>
              Cancelar
            </button>
          )}
        </div>
      </Painel>

      <Painel titulo={`Parceiros (${linhas.length})`}>
        {linhas.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum parceiro cadastrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="py-2 pr-4">Empresa</th>
                  <th className="py-2 pr-4">Segmento</th>
                  <th className="py-2 pr-4">Responsável</th>
                  <th className="py-2 pr-4">Contato</th>
                  <th className="py-2 pr-4">Cidade/UF</th>
                  <th className="py-2 pr-4">Parceria</th>
                  <th className="py-2 pr-4"></th>
                </tr>
              </thead>
              <tbody>
                {linhas.map((p) => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="py-2 pr-4">{p.empresa}</td>
                    <td className="py-2 pr-4">{p.segmento ?? "—"}</td>
                    <td className="py-2 pr-4">{p.responsavel ?? "—"}</td>
                    <td className="py-2 pr-4">{p.telefone ?? p.email ?? "—"}</td>
                    <td className="py-2 pr-4">{[p.cidade, p.uf].filter(Boolean).join("/") || "—"}</td>
                    <td className="py-2 pr-4">{p.tipo_parceria ?? "—"}</td>
                    <td className="py-2 pr-4">
                      <button
                        className="text-gold hover:underline"
                        onClick={() => {
                          setEditando(p.id);
                          setForm({
                            empresa: p.empresa ?? "",
                            segmento: p.segmento ?? "",
                            responsavel: p.responsavel ?? "",
                            telefone: p.telefone ?? "",
                            email: p.email ?? "",
                            cidade: p.cidade ?? "",
                            uf: p.uf ?? "",
                            tipo_parceria: p.tipo_parceria ?? "",
                            observacoes: p.observacoes ?? "",
                          });
                        }}
                      >
                        Editar
                      </button>
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
