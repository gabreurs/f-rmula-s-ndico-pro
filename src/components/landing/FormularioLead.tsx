import { useEffect, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { enviarLeadSite } from "@/lib/crm.functions";
import { UFS, WHATSAPP_EQUIPE_URL } from "@/lib/formula-sindico";
import { capturarUtms, lerUtms } from "@/lib/utm";

type Perfil = "sindico" | "administradora" | "outro";

type Campos = {
  nome: string;
  whatsapp: string;
  email: string;
  perfil: Perfil | "";
  empresa: string;
  cargo: string;
  qtd_condominios: string;
  qtd_sindicos: string;
  cidade: string;
  uf: string;
  interesse: string;
  mensagem: string;
};

const inicial: Campos = {
  nome: "",
  whatsapp: "",
  email: "",
  perfil: "",
  empresa: "",
  cargo: "",
  qtd_condominios: "",
  qtd_sindicos: "",
  cidade: "",
  uf: "",
  interesse: "",
  mensagem: "",
};

const PERFIS: { value: Perfil; label: string }[] = [
  { value: "sindico", label: "Síndico profissional" },
  { value: "administradora", label: "Administradora de condomínios" },
  { value: "outro", label: "Outro profissional do mercado condominial" },
];

const INTERESSES_SINDICO = [
  "Participar do Fórmula Síndico",
  "Cursos e atividades",
  "Mentoria",
  "Materiais",
  "Parceria",
  "Outro",
];

const INTERESSES_ADM = [
  "Levar o Fórmula para uma administradora",
  "Cursos e atividades",
  "Mentoria",
  "Materiais",
  "Parceria",
  "Outro",
];

const fieldClass =
  "w-full border border-input bg-background px-3.5 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-gold focus:outline-none";

/** Máscara brasileira de WhatsApp: (11) 99999-9999. */
function mascararWhatsapp(valor: string) {
  const d = valor.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function validar(v: Campos) {
  const erros: Partial<Record<keyof Campos, string>> = {};
  if (!v.nome.trim()) erros.nome = "Informe seu nome.";
  const digitos = v.whatsapp.replace(/\D/g, "");
  if (digitos.length < 10) erros.whatsapp = "Use DDD + número, ex.: (11) 99999-9999.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim()))
    erros.email = "E-mail inválido, ex.: nome@email.com.br.";
  if (!v.perfil) erros.perfil = "Selecione seu perfil.";
  if (v.perfil === "administradora" && !v.empresa.trim())
    erros.empresa = "Informe o nome da administradora.";
  if (!v.cidade.trim()) erros.cidade = "Informe a cidade.";
  if (!v.uf) erros.uf = "Selecione o estado.";
  if (!v.interesse) erros.interesse = "Selecione o interesse.";
  if (v.qtd_condominios.trim() && !/^\d+$/.test(v.qtd_condominios.trim()))
    erros.qtd_condominios = "Use apenas números.";
  if (v.qtd_sindicos.trim() && !/^\d+$/.test(v.qtd_sindicos.trim()))
    erros.qtd_sindicos = "Use apenas números.";
  return erros;
}

export function FormularioLead() {
  const enviar = useServerFn(enviarLeadSite);
  const [v, setValores] = useState<Campos>(inicial);
  const [erros, setErros] = useState<Partial<Record<keyof Campos, string>>>({});
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [armadilha, setArmadilha] = useState("");
  const [abertoEm] = useState(() => Date.now());

  useEffect(() => {
    capturarUtms();
  }, []);

  function set(campo: keyof Campos, valor: string) {
    setValores((s) => ({ ...s, [campo]: valor }));
    setErros((e) => ({ ...e, [campo]: undefined }));
  }

  const ehAdm = v.perfil === "administradora";
  const interesses = ehAdm ? INTERESSES_ADM : INTERESSES_SINDICO;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (enviando || enviado) return;
    setErroEnvio(null);

    // Anti-spam: honeypot + tempo mínimo de preenchimento.
    if (armadilha.trim() || Date.now() - abertoEm < 2500) {
      setEnviado(true);
      return;
    }

    const novos = validar(v);
    setErros(novos);
    if (Object.keys(novos).length > 0) {
      document.getElementById(Object.keys(novos)[0] as string)?.focus();
      return;
    }

    setEnviando(true);
    try {
      await enviar({
        data: {
          nome: v.nome.trim(),
          whatsapp: v.whatsapp.trim(),
          email: v.email.trim(),
          perfil: v.perfil as Perfil,
          empresa: v.empresa.trim() || null,
          cargo: v.cargo.trim() || null,
          qtd_condominios: v.qtd_condominios.trim() ? Number(v.qtd_condominios) : null,
          qtd_sindicos: v.qtd_sindicos.trim() ? Number(v.qtd_sindicos) : null,
          cidade: v.cidade.trim(),
          uf: v.uf,
          interesse: v.interesse,
          mensagem: v.mensagem.trim() || null,
          ...lerUtms(),
        },
      });
      setEnviado(true);
    } catch {
      setErroEnvio(
        "Não conseguimos enviar seus dados agora. Tente novamente em instantes ou chame a gente pelo WhatsApp.",
      );
    }
    setEnviando(false);
  }

  if (enviado) {
    return (
      <div className="border border-border bg-background p-10" role="status" aria-live="polite">
        <span aria-hidden="true" className="font-display text-4xl text-gold">
          &#10003;
        </span>
        <h3 className="display-lg mt-4">Recebemos seu contato</h3>
        <p className="mt-5 text-muted-foreground">
          Obrigado, {v.nome.split(" ")[0] || "tudo certo"}. Nossa equipe vai
          analisar as informações e retornar pelo WhatsApp com os próximos
          passos dentro do Fórmula Síndico.
        </p>
        <a
          href={WHATSAPP_EQUIPE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block border border-border px-6 py-3 text-sm font-medium transition-colors hover:border-gold hover:text-gold"
        >
          Falar com nossa equipe
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="border border-border bg-background p-7 md:p-10">
      <div className="grid gap-5 sm:grid-cols-2">
        <Campo id="nome" label="Nome" required value={v.nome} erro={erros.nome} onChange={(x) => set("nome", x)} />
        <Campo
          id="whatsapp"
          label="WhatsApp"
          required
          type="tel"
          placeholder="(11) 99999-9999"
          value={v.whatsapp}
          erro={erros.whatsapp}
          onChange={(x) => set("whatsapp", mascararWhatsapp(x))}
        />
        <Campo
          id="email"
          label="E-mail"
          required
          type="email"
          placeholder="nome@email.com.br"
          value={v.email}
          erro={erros.email}
          onChange={(x) => set("email", x)}
        />
        <Selecao
          id="perfil"
          label="Perfil"
          required
          value={v.perfil}
          erro={erros.perfil}
          onChange={(x) => {
            set("perfil", x);
            setValores((s) => ({ ...s, interesse: "" }));
          }}
          options={PERFIS}
        />

        {(ehAdm || v.perfil === "outro") && (
          <Campo
            id="empresa"
            label={ehAdm ? "Administradora" : "Empresa"}
            required={ehAdm}
            value={v.empresa}
            erro={erros.empresa}
            onChange={(x) => set("empresa", x)}
          />
        )}
        {ehAdm && (
          <>
            <Campo id="cargo" label="Cargo" value={v.cargo} onChange={(x) => set("cargo", x)} />
            <Campo
              id="qtd_condominios"
              label="Condomínios atendidos (aprox.)"
              inputMode="numeric"
              placeholder="45"
              value={v.qtd_condominios}
              erro={erros.qtd_condominios}
              onChange={(x) => set("qtd_condominios", x)}
            />
            <Campo
              id="qtd_sindicos"
              label="Síndicos que poderiam participar (aprox.)"
              inputMode="numeric"
              placeholder="30"
              value={v.qtd_sindicos}
              erro={erros.qtd_sindicos}
              onChange={(x) => set("qtd_sindicos", x)}
            />
          </>
        )}

        <Campo id="cidade" label="Cidade" required value={v.cidade} erro={erros.cidade} onChange={(x) => set("cidade", x)} />
        <Selecao
          id="uf"
          label="Estado"
          required
          value={v.uf}
          erro={erros.uf}
          onChange={(x) => set("uf", x)}
          options={UFS.map((u) => ({ value: u, label: u }))}
        />
        <div className="sm:col-span-2">
          <Selecao
            id="interesse"
            label="Interesse"
            required
            value={v.interesse}
            erro={erros.interesse}
            onChange={(x) => set("interesse", x)}
            options={interesses.map((i) => ({ value: i, label: i }))}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="mensagem" className="mb-1.5 block text-sm font-medium">
            Mensagem (opcional)
          </label>
          <textarea
            id="mensagem"
            rows={4}
            placeholder="Conte o que você busca no Fórmula Síndico."
            className={fieldClass}
            value={v.mensagem}
            onChange={(e) => set("mensagem", e.target.value)}
          />
        </div>
      </div>

      {/* honeypot */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="empresa_site">Não preencher</label>
        <input
          id="empresa_site"
          name="empresa_site"
          tabIndex={-1}
          autoComplete="off"
          value={armadilha}
          onChange={(e) => setArmadilha(e.target.value)}
        />
      </div>

      {erroEnvio && (
        <p role="alert" className="mt-6 border border-destructive/50 px-4 py-3 text-sm text-destructive">
          {erroEnvio}
        </p>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="group mt-8 inline-flex w-full items-center justify-center gap-3 bg-gold px-6 py-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-gold-soft disabled:opacity-60"
      >
        {enviando ? "Enviando..." : "Enviar contato"}
        <span className="transition-transform duration-300 group-hover:translate-x-1">&#8594;</span>
      </button>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Usamos seus dados apenas para entender o interesse e organizar a conversa.
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

function Selecao({
  id,
  label,
  value,
  onChange,
  options,
  erro,
  required,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  erro?: string | undefined;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label} {required && <span className="text-gold">*</span>}
      </label>
      <select
        id={id}
        className={fieldClass}
        value={value}
        aria-invalid={Boolean(erro)}
        aria-describedby={erro ? `${id}-erro` : undefined}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Selecione</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {erro && <Erro id={`${id}-erro`}>{erro}</Erro>}
    </div>
  );
}
