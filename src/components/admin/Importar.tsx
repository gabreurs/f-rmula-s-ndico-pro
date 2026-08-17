import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { adminImportar, adminListarEventos } from "@/lib/crm.functions";
import { PERFIS, SOURCES } from "@/lib/crm";
import { Campo, Painel, Selecao, btnCls, btnGhostCls, inputCls } from "./ui";

type Tabela = { colunas: string[]; linhas: string[][]; arquivo: string };

const DESTINOS = [
  { value: "", label: "Ignorar coluna" },
  { value: "nome", label: "Nome" },
  { value: "email", label: "E-mail" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "cidade", label: "Cidade" },
  { value: "uf", label: "Estado" },
];

function adivinhar(coluna: string) {
  const c = coluna
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  if (/(nome|participante|comprador)/.test(c) && !/sobrenome/.test(c)) return "nome";
  if (/(e-?mail)/.test(c)) return "email";
  if (/(celular|whats|telefone|fone)/.test(c)) return "whatsapp";
  if (/(cidade|munic)/.test(c)) return "cidade";
  if (/(estado|uf)/.test(c)) return "uf";
  return "";
}

export function Importar() {
  const importar = useServerFn(adminImportar);
  const listarEventos = useServerFn(adminListarEventos);

  const [tabela, setTabela] = useState<Tabela | null>(null);
  const [mapa, setMapa] = useState<string[]>([]);
  const [eventos, setEventos] = useState<any[]>([]);
  const [config, setConfig] = useState({
    source: "Sympla",
    source_detail: "",
    event_id: "",
    perfil: "sindico",
    tags: "",
  });
  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [relatorio, setRelatorio] = useState<any>(null);

  const carregarEventos = useCallback(async () => {
    setEventos((await listarEventos()) as any[]);
  }, [listarEventos]);

  useEffect(() => {
    void carregarEventos();
  }, [carregarEventos]);

  async function onArquivo(file: File) {
    setErro(null);
    setRelatorio(null);
    try {
      // Biblioteca de planilha carregada sob demanda — nunca entra no bundle público.
      const XLSX = await import("xlsx");
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const sheetName = wb.SheetNames[0];
      if (!sheetName) throw new Error("Planilha vazia.");
      const linhas = XLSX.utils.sheet_to_json<string[]>(wb.Sheets[sheetName]!, {
        header: 1,
        blankrows: false,
        defval: "",
        raw: false,
      });
      if (linhas.length < 2) throw new Error("A planilha não possui linhas de dados.");
      const colunas = (linhas[0] ?? []).map((c) => String(c ?? "").trim());
      setTabela({ colunas, linhas: linhas.slice(1) as string[][], arquivo: file.name });
      setMapa(colunas.map(adivinhar));
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível ler o arquivo.");
    }
  }

  async function onImportar() {
    if (!tabela) return;
    setProcessando(true);
    setErro(null);
    try {
      const registros = tabela.linhas.map((l) => {
        const obj: Record<string, string> = {};
        mapa.forEach((destino, i) => {
          if (destino) obj[destino] = String(l[i] ?? "").trim();
        });
        return obj;
      });
      const r = await importar({
        data: {
          linhas: registros,
          event_id: config.event_id || null,
          source: config.source,
          source_detail: config.source_detail || null,
          perfil: config.perfil || null,
          tags: config.tags
            ? config.tags.split(",").map((t) => t.trim()).filter(Boolean)
            : [],
          arquivo: tabela.arquivo,
        },
      });
      setRelatorio(r);
      setTabela(null);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Falha na importação.");
    }
    setProcessando(false);
  }

  function baixarErros() {
    if (!relatorio?.detalhesErros?.length) return;
    const linhas = [
      "linha,motivo,nome,email,whatsapp",
      ...relatorio.detalhesErros.map((e: any) =>
        [e.linha, e.motivo, e.dados?.nome ?? "", e.dados?.email ?? "", e.dados?.whatsapp ?? ""]
          .map((v: string) => `"${String(v).replace(/"/g, '""')}"`)
          .join(","),
      ),
    ].join("\n");
    const url = URL.createObjectURL(new Blob([linhas], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "erros-importacao.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-5">
      <Painel titulo="Importar participantes (CSV / XLSX)">
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          className={inputCls}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void onArquivo(f);
          }}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Exportações do Sympla e planilhas próprias. A leitura acontece no
          navegador; nada é enviado antes da conferência.
        </p>
        {erro && <p className="mt-3 text-sm text-destructive">{erro}</p>}
      </Painel>

      {tabela && (
        <>
          <Painel titulo="Antes de importar">
            <div className="grid gap-3 md:grid-cols-5">
              <Selecao
                label="Origem"
                value={config.source}
                onChange={(v) => setConfig((c) => ({ ...c, source: v }))}
                options={SOURCES.map((s) => ({ value: s, label: s }))}
                vazio="Selecione"
              />
              <Campo
                label="Detalhe da origem"
                value={config.source_detail}
                onChange={(v) => setConfig((c) => ({ ...c, source_detail: v }))}
              />
              <Selecao
                label="Evento relacionado"
                value={config.event_id}
                onChange={(v) => setConfig((c) => ({ ...c, event_id: v }))}
                options={eventos.map((e) => ({ value: e.id, label: e.nome }))}
                vazio="Sem evento"
              />
              <Selecao
                label="Perfil predominante"
                value={config.perfil}
                onChange={(v) => setConfig((c) => ({ ...c, perfil: v }))}
                options={PERFIS.map((p) => ({ value: p.value, label: p.label }))}
                vazio="Não definir"
              />
              <Campo
                label="Tags adicionais (vírgula)"
                value={config.tags}
                onChange={(v) => setConfig((c) => ({ ...c, tags: v }))}
              />
            </div>
          </Painel>

          <Painel titulo={`Mapeamento de colunas — ${tabela.linhas.length} linhas`}>
            <div className="grid gap-3 md:grid-cols-3">
              {tabela.colunas.map((col, i) => (
                <Selecao
                  key={`${col}-${i}`}
                  label={col || `Coluna ${i + 1}`}
                  value={mapa[i] ?? ""}
                  onChange={(v) => setMapa((m) => m.map((x, j) => (j === i ? v : x)))}
                  options={DESTINOS.filter((d) => d.value)}
                  vazio="Ignorar coluna"
                />
              ))}
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-xs">
                <thead className="uppercase tracking-wider text-muted-foreground">
                  <tr>
                    {tabela.colunas.map((c, i) => (
                      <th key={i} className="py-2 pr-4">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tabela.linhas.slice(0, 5).map((l, i) => (
                    <tr key={i} className="border-t border-border">
                      {tabela.colunas.map((_, j) => (
                        <td key={j} className="py-2 pr-4">
                          {String(l[j] ?? "")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5 flex gap-3">
              <button className={btnCls} disabled={processando} onClick={onImportar}>
                {processando ? "Importando…" : "Importar"}
              </button>
              <button className={btnGhostCls} onClick={() => setTabela(null)}>
                Cancelar
              </button>
            </div>
          </Painel>
        </>
      )}

      {relatorio && (
        <Painel titulo="Relatório da importação">
          <ul className="space-y-1 text-sm">
            <li>{relatorio.total} registros processados</li>
            <li>{relatorio.novos} novos contatos</li>
            <li>{relatorio.atualizados} contatos atualizados</li>
            <li>{relatorio.ignorados} duplicidades internas ignoradas</li>
            <li>{relatorio.erros} registros com erro</li>
          </ul>
          {relatorio.detalhesErros?.length > 0 && (
            <>
              <ul className="mt-4 space-y-1 text-sm text-destructive">
                {relatorio.detalhesErros.slice(0, 20).map((e: any, i: number) => (
                  <li key={i}>
                    Linha {e.linha}: {e.motivo}
                  </li>
                ))}
              </ul>
              <button className={`${btnGhostCls} mt-4`} onClick={baixarErros}>
                Baixar erros em CSV
              </button>
            </>
          )}
        </Painel>
      )}
    </div>
  );
}
