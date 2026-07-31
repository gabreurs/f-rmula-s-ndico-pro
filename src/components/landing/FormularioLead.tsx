import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CTA_TEXT, FORMATOS, UFS } from "@/lib/formula-sindico";

type Campos = {
  nome_responsavel: string;
  administradora: string;
  cidade: string;
  uf: string;
  whatsapp: string;
  email: string;
  cargo: string;
  qtd_condominios: string;
  qtd_sindicos: string;
  formato_preferido: string;
  periodo_desejado: string;
  observacoes_lead: string;
};

const inicial: Campos = {
  nome_responsavel: "",
  administradora: "",
  cidade: "",
  uf: "",
  whatsapp: "",
  email: "",
  cargo: "",
  qtd_condominios: "",
  qtd_sindicos: "",
  formato_preferido: "",
  periodo_desejado: "",
  observacoes_lead: "",
};

const fieldClass =
  "w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-gold focus:outline-none";

function validar(v: Campos) {
  const erros: Partial<Record<keyof Campos, string>> = {};
  if (!v.nome_responsavel.trim())
    erros.nome_responsavel = "Informe o nome de quem está preenchendo.";
  if (!v.administradora.trim())
    erros.administradora = "Informe o nome da administradora.";
  if (!v.cidade.trim()) erros.cidade = "Informe a cidade da administradora.";
  if (!v.uf) erros.uf = "Selecione a UF.";

  const digitos = v.whatsapp.replace(/\D/g, "");
  if (!digitos) erros.whatsapp = "Informe um WhatsApp para contato.";
  else if (digitos.length < 10 || digitos.length > 13)
    erros.whatsapp = "WhatsApp inválido. Use DDD + número, ex.: (11) 99999-9999.";

  if (!v.qtd_condominios.trim())
    erros.qtd_condominios = "Informe a quantidade aproximada de condomínios.";
  else if (!/^\d+$/.test(v.qtd_condominios.trim()))
    erros.qtd_condominios = "Use apenas números, ex.: 45.";

  if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim()))
    erros.email = "E-mail inválido. Confira o formato, ex.: nome@empresa.com.br.";

  if (v.qtd_sindicos.trim() && !/^\d+$/.test(v.qtd_sindicos.trim()))
    erros.qtd_sindicos = "Use apenas números, ex.: 30.";

  return erros;
}

export function FormularioLead() {
  const [valores, setValores] = useState<Campos>(inicial);
  const [erros, setErros] = useState<Partial<Record<keyof Campos, string>>>({});
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  function set(campo: keyof Campos, valor: string) {
    setValores((v) => ({ ...v, [campo]: valor }));
    setErros((e) => ({ ...e, [campo]: undefined }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErroEnvio(null);
    const novosErros = validar(valores);
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) {
      const primeiro = Object.keys(novosErros)[0];
      document.getElementById(primeiro as string)?.focus();
      return;
    }

    setEnviando(true);
    const { error } = await supabase.from("leads").insert({
      nome_responsavel: valores.nome_responsavel.trim(),
      administradora: valores.administradora.trim(),
      cidade: valores.cidade.trim(),
      uf: valores.uf,
      whatsapp: valores.whatsapp.trim(),
      email: valores.email.trim() || null,
      cargo: valores.cargo.trim() || null,
      qtd_condominios: Number(valores.qtd_condominios),
      qtd_sindicos: valores.qtd_sindicos.trim() ? Number(valores.qtd_sindicos) : null,
      formato_preferido: valores.formato_preferido || null,
      periodo_desejado: valores.periodo_desejado.trim() || null,
      observacoes_lead: valores.observacoes_lead.trim() || null,
      origem: "landing",
      status: "novo_lead",
    });
    setEnviando(false);

    if (error) {
      setErroEnvio(
        "Não conseguimos enviar seus dados agora. Tente novamente em instantes ou chame a gente pelo WhatsApp.",
      );
      return;
    }
    setEnviado(true);
  }

  if (enviado) {
    return (
      <div
        className="surface-panel mx-auto max-w-2xl p-10 text-center"
        role="status"
        aria-live="polite"
      >
        <span aria-hidden="true" className="font-display text-4xl text-gold">
          &#10003;
        </span>
        <h3 className="mt-4 text-2xl">Recebemos sua solicitação</h3>
        <p className="mt-3 text-muted-foreground">
          Obrigado, {valores.nome_responsavel.split(" ")[0]}. Os dados da{" "}
          {valores.administradora} chegaram até nós. Nossa equipe entra em
          contato pelo WhatsApp para agendar a conversa com o Maicon Guedes e
          alinhar formato, datas e turma.
        </p>
        <button
          type="button"
          onClick={() => {
            setValores(inicial);
            setEnviado(false);
          }}
          className="mt-7 rounded-lg border border-border px-5 py-2.5 text-sm font-medium hover:bg-accent"
        >
          Enviar outra solicitação
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="surface-panel mx-auto max-w-2xl p-7 md:p-9">
      <div className="grid gap-5 sm:grid-cols-2">
        <Campo
          id="nome_responsavel"
          label="Seu nome"
          required
          value={valores.nome_responsavel}
          erro={erros.nome_responsavel}
          onChange={(v) => set("nome_responsavel", v)}
        />
        <Campo
          id="administradora"
          label="Administradora"
          required
          value={valores.administradora}
          erro={erros.administradora}
          onChange={(v) => set("administradora", v)}
        />
        <Campo
          id="cidade"
          label="Cidade"
          required
          value={valores.cidade}
          erro={erros.cidade}
          onChange={(v) => set("cidade", v)}
        />
        <div>
          <label htmlFor="uf" className="mb-1.5 block text-sm font-medium">
            UF <span className="text-gold">*</span>
          </label>
          <select
            id="uf"
            className={fieldClass}
            value={valores.uf}
            aria-invalid={Boolean(erros.uf)}
            aria-describedby={erros.uf ? "uf-erro" : undefined}
            onChange={(e) => set("uf", e.target.value)}
          >
            <option value="">Selecione</option>
            {UFS.map((uf) => (
              <option key={uf} value={uf}>
                {uf}
              </option>
            ))}
          </select>
          {erros.uf && <Erro id="uf-erro">{erros.uf}</Erro>}
        </div>
        <Campo
          id="whatsapp"
          label="WhatsApp"
          required
          type="tel"
          placeholder="(11) 99999-9999"
          value={valores.whatsapp}
          erro={erros.whatsapp}
          onChange={(v) => set("whatsapp", v)}
        />
        <Campo
          id="qtd_condominios"
          label="Condomínios administrados (aprox.)"
          required
          inputMode="numeric"
          placeholder="45"
          value={valores.qtd_condominios}
          erro={erros.qtd_condominios}
          onChange={(v) => set("qtd_condominios", v)}
        />
        <Campo
          id="email"
          label="E-mail (opcional)"
          type="email"
          placeholder="nome@empresa.com.br"
          value={valores.email}
          erro={erros.email}
          onChange={(v) => set("email", v)}
        />
        <Campo
          id="cargo"
          label="Cargo (opcional)"
          value={valores.cargo}
          onChange={(v) => set("cargo", v)}
        />
        <Campo
          id="qtd_sindicos"
          label="Síndicos que poderia reunir (opcional)"
          inputMode="numeric"
          placeholder="30"
          value={valores.qtd_sindicos}
          erro={erros.qtd_sindicos}
          onChange={(v) => set("qtd_sindicos", v)}
        />
        <div>
          <label htmlFor="formato_preferido" className="mb-1.5 block text-sm font-medium">
            Formato de preferência (opcional)
          </label>
          <select
            id="formato_preferido"
            className={fieldClass}
            value={valores.formato_preferido}
            onChange={(e) => set("formato_preferido", e.target.value)}
          >
            <option value="">Sem preferência</option>
            {FORMATOS.map((f) => (
              <option key={f} value={f}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <Campo
            id="periodo_desejado"
            label="Período desejado (opcional)"
            placeholder="Ex.: segunda quinzena de outubro"
            value={valores.periodo_desejado}
            onChange={(v) => set("periodo_desejado", v)}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="observacoes_lead" className="mb-1.5 block text-sm font-medium">
            Observações (opcional)
          </label>
          <textarea
            id="observacoes_lead"
            rows={4}
            className={fieldClass}
            value={valores.observacoes_lead}
            onChange={(e) => set("observacoes_lead", e.target.value)}
          />
        </div>
      </div>

      {erroEnvio && (
        <p role="alert" className="mt-6 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive-foreground">
          {erroEnvio}
        </p>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="mt-7 w-full rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-gold-soft disabled:opacity-60"
      >
        {enviando ? "Enviando..." : CTA_TEXT}
      </button>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Sem compromisso. Usamos seus dados apenas para agendar a conversa.
      </p>
    </form>
  );
}

function Erro({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className="mt-1.5 text-xs text-destructive">
      {children}
    </p>
  );
}

function Campo({
  id,
  label,
  value,
  onChange,
  erro,
  required,
  type = "text",
  placeholder,
  inputMode,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  erro?: string | undefined;
  required?: boolean;
  type?: string;
  placeholder?: string;
  inputMode?: "numeric" | "text";
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label} {required && <span className="text-gold">*</span>}
      </label>
      <input
        id={id}
        type={type}
        {...(placeholder ? { placeholder } : {})}
        {...(inputMode ? { inputMode } : {})}
        className={fieldClass}
        value={value}
        aria-invalid={Boolean(erro)}
        aria-describedby={erro ? `${id}-erro` : undefined}
        onChange={(e) => onChange(e.target.value)}
      />
      {erro && <Erro id={`${id}-erro`}>{erro}</Erro>}
    </div>
  );
}
