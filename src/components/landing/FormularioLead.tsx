import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  CTA_TEXT,
  ESTRUTURA_PRESENCIAL,
  FORMATOS,
  INTENCAO_90_DIAS,
  PARTICIPA_DECISAO,
  UFS,
  WHATSAPP_EQUIPE_URL,
} from "@/lib/formula-sindico";

type Campos = {
  nome_responsavel: string;
  administradora: string;
  cidade: string;
  uf: string;
  whatsapp: string;
  email: string;
  cargo: string;
  participa_decisao: string;
  qtd_condominios: string;
  qtd_sindicos: string;
  formato_preferido: string;
  periodo_desejado: string;
  estrutura_presencial: string;
  objetivo_principal: string;
  intencao_90_dias: string;
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
  participa_decisao: "",
  qtd_condominios: "",
  qtd_sindicos: "",
  formato_preferido: "",
  periodo_desejado: "",
  estrutura_presencial: "",
  objetivo_principal: "",
  intencao_90_dias: "",
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

  if (!v.formato_preferido) erros.formato_preferido = "Selecione o formato de preferência.";

  if (v.qtd_condominios.trim() && !/^\d+$/.test(v.qtd_condominios.trim()))
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
      participa_decisao: valores.participa_decisao || null,
      qtd_condominios: valores.qtd_condominios.trim()
        ? Number(valores.qtd_condominios)
        : null,
      qtd_sindicos: valores.qtd_sindicos.trim() ? Number(valores.qtd_sindicos) : null,
      formato_preferido: valores.formato_preferido,
      periodo_desejado: valores.periodo_desejado.trim() || null,
      estrutura_presencial: valores.estrutura_presencial || null,
      objetivo_principal: valores.objetivo_principal.trim() || null,
      intencao_90_dias: valores.intencao_90_dias || null,
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
        <p className="mt-4 text-muted-foreground">
          Obrigado, {valores.nome_responsavel.split(" ")[0]}. Recebemos os dados
          da {valores.administradora}.
        </p>
        <p className="mt-4 text-muted-foreground">
          Nossa equipe vai analisar as informações e entrar em contato pelo
          WhatsApp para entender melhor o interesse da administradora.
        </p>
        <p className="mt-4 text-muted-foreground">
          Na sequência, vamos organizar uma conversa com Maicon Guedes para
          avaliar o formato mais adequado, as possibilidades de realização e os
          próximos passos para confirmação da turma.
        </p>
        <a
          href={WHATSAPP_EQUIPE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-block rounded-lg border border-border px-5 py-2.5 text-sm font-medium hover:bg-accent"
        >
          Falar com nossa equipe
        </a>
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
        <div>
          <label htmlFor="formato_preferido" className="mb-1.5 block text-sm font-medium">
            Formato de preferência <span className="text-gold">*</span>
          </label>
          <select
            id="formato_preferido"
            className={fieldClass}
            value={valores.formato_preferido}
            aria-invalid={Boolean(erros.formato_preferido)}
            aria-describedby={erros.formato_preferido ? "formato_preferido-erro" : undefined}
            onChange={(e) => set("formato_preferido", e.target.value)}
          >
            <option value="">Selecione</option>
            {FORMATOS.map((f) => (
              <option key={f} value={f}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </option>
            ))}
          </select>
          {erros.formato_preferido && (
            <Erro id="formato_preferido-erro">{erros.formato_preferido}</Erro>
          )}
        </div>
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
        <Selecao
          id="participa_decisao"
          label="Participa da decisão? (opcional)"
          value={valores.participa_decisao}
          opcoes={PARTICIPA_DECISAO}
          onChange={(v) => set("participa_decisao", v)}
        />
        <Campo
          id="qtd_condominios"
          label="Condomínios administrados (opcional)"
          inputMode="numeric"
          placeholder="45"
          value={valores.qtd_condominios}
          erro={erros.qtd_condominios}
          onChange={(v) => set("qtd_condominios", v)}
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
        <Selecao
          id="estrutura_presencial"
          label="Tem estrutura para receber o encontro? (opcional)"
          value={valores.estrutura_presencial}
          opcoes={ESTRUTURA_PRESENCIAL}
          onChange={(v) => set("estrutura_presencial", v)}
        />
        <Selecao
          id="intencao_90_dias"
          label="Pretende realizar nos próximos 90 dias? (opcional)"
          value={valores.intencao_90_dias}
          opcoes={INTENCAO_90_DIAS}
          onChange={(v) => set("intencao_90_dias", v)}
        />
        <div className="sm:col-span-2">
          <Campo
            id="periodo_desejado"
            label="Período ou mês desejado (opcional)"
            placeholder="Ex.: segunda quinzena de outubro ou 4º trimestre"
            value={valores.periodo_desejado}
            onChange={(v) => set("periodo_desejado", v)}
          />
        </div>
        <div className="sm:col-span-2">
          <Campo
            id="objetivo_principal"
            label="Principal objetivo da administradora com o curso (opcional)"
            placeholder="Ex.: aproximar os síndicos e reduzir conflitos"
            value={valores.objetivo_principal}
            onChange={(v) => set("objetivo_principal", v)}
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
        Sem compromisso. Usamos seus dados apenas para avaliar o interesse e
        organizar a conversa.
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

function Selecao({
  id,
  label,
  value,
  opcoes,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  opcoes: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <select
        id={id}
        className={fieldClass}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Selecione</option>
        {opcoes.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
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
