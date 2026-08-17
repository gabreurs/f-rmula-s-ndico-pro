import { useEffect, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Reveal } from "@/components/site/Reveal";
import { enviarContatoPublico } from "@/lib/crm.functions";
import { INTERESSES, TIPOS_SINDICO } from "@/lib/crm";
import { UFS } from "@/lib/formula-sindico";
import { capturarUtms, lerUtms } from "@/lib/utm";

const campo =
  "w-full border border-input bg-background px-3.5 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-gold focus:outline-none";

type Valores = {
  nome: string;
  email: string;
  whatsapp: string;
  cidade: string;
  uf: string;
  tipo_sindico: string;
  qtd_condominios: string;
};

const inicial: Valores = {
  nome: "",
  email: "",
  whatsapp: "",
  cidade: "",
  uf: "",
  tipo_sindico: "",
  qtd_condominios: "",
};

export function CaptacaoSindicos() {
  const enviar = useServerFn(enviarContatoPublico);
  const [v, setV] = useState<Valores>(inicial);
  const [interesses, setInteresses] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    capturarUtms();
  }, []);

  function set(k: keyof Valores, valor: string) {
    setV((s) => ({ ...s, [k]: valor }));
  }

  function alternar(i: string) {
    setInteresses((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    if (!consent) {
      setErro("Confirme o consentimento para receber as informações.");
      return;
    }
    setEnviando(true);
    try {
      await enviar({
        data: {
          nome: v.nome.trim(),
          email: v.email.trim(),
          whatsapp: v.whatsapp.trim(),
          cidade: v.cidade.trim(),
          uf: v.uf,
          tipo_sindico: v.tipo_sindico || null,
          qtd_condominios: v.qtd_condominios ? Number(v.qtd_condominios) : null,
          interesses,
          consentimento: true,
          source: "Site Fórmula Síndico",
          source_detail: "Formulário de acompanhamento",
          ...lerUtms(),
        },
      });
      setPronto(true);
    } catch {
      setErro(
        "Confira os dados informados (nome, e-mail, WhatsApp, cidade e estado) e tente novamente.",
      );
    }
    setEnviando(false);
  }

  return (
    <section id="acompanhar" className="scroll-mt-24 bg-graphite text-ink-foreground">
      <div className="gutter mx-auto grid max-w-[1600px] gap-12 py-20 md:py-32 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
        <div>
          <Reveal>
            <p className="rule-label text-gold">Para síndicos</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="display-xl mt-7 max-w-[15ch]">
              Quer acompanhar as próximas atividades?
            </h2>
          </Reveal>
          <Reveal delay={140} as="p" className="mt-8 max-w-xl leading-relaxed text-ink-foreground/70">
            Receba informações sobre cursos, materiais, encontros, lives e
            mentorias do Fórmula Síndico.
          </Reveal>
        </div>

        {pronto ? (
          <div className="border border-ink-foreground/15 p-10" role="status" aria-live="polite">
            <span aria-hidden="true" className="font-display text-4xl text-gold">
              &#10003;
            </span>
            <h3 className="display-lg mt-4">Cadastro confirmado</h3>
            <p className="mt-5 text-ink-foreground/70">
              Você passa a receber as novidades das próximas atividades do
              Fórmula Síndico.
            </p>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            noValidate
            className="border border-ink-foreground/15 p-7 md:p-10"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Campo id="s_nome" label="Nome" value={v.nome} onChange={(x) => set("nome", x)} />
              <Campo id="s_email" label="E-mail" type="email" value={v.email} onChange={(x) => set("email", x)} />
              <Campo id="s_whats" label="WhatsApp" type="tel" placeholder="(11) 99999-9999" value={v.whatsapp} onChange={(x) => set("whatsapp", x)} />
              <Campo id="s_cidade" label="Cidade" value={v.cidade} onChange={(x) => set("cidade", x)} />
              <div>
                <label htmlFor="s_uf" className="mb-1.5 block text-sm font-medium">
                  Estado <span className="text-gold">*</span>
                </label>
                <select id="s_uf" className={campo} value={v.uf} onChange={(e) => set("uf", e.target.value)}>
                  <option value="">Selecione</option>
                  {UFS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="s_perfil" className="mb-1.5 block text-sm font-medium">
                  Perfil
                </label>
                <select
                  id="s_perfil"
                  className={campo}
                  value={v.tipo_sindico}
                  onChange={(e) => set("tipo_sindico", e.target.value)}
                >
                  <option value="">Selecione</option>
                  {TIPOS_SINDICO.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <Campo
                id="s_qtd"
                label="Quantos condomínios você atende? (opcional)"
                type="number"
                value={v.qtd_condominios}
                onChange={(x) => set("qtd_condominios", x)}
              />
            </div>

            <fieldset className="mt-7">
              <legend className="mb-3 text-sm font-medium">Interesses</legend>
              <div className="flex flex-wrap gap-2">
                {INTERESSES.map((i) => {
                  const ativo = interesses.includes(i);
                  return (
                    <button
                      type="button"
                      key={i}
                      onClick={() => alternar(i)}
                      aria-pressed={ativo}
                      className={`border px-3 py-2 text-xs transition-colors ${
                        ativo
                          ? "border-gold bg-gold text-primary-foreground"
                          : "border-ink-foreground/20 text-ink-foreground/75 hover:border-gold/60"
                      }`}
                    >
                      {i}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <label className="mt-7 flex items-start gap-3 text-xs leading-relaxed text-ink-foreground/70">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 accent-[var(--color-gold)]"
              />
              Autorizo o contato do Fórmula Síndico sobre atividades, materiais e
              oportunidades de formação.
            </label>

            {erro && (
              <p className="mt-5 border border-destructive/50 px-4 py-3 text-sm text-destructive" role="alert">
                {erro}
              </p>
            )}

            <button
              type="submit"
              disabled={enviando}
              className="mt-8 inline-flex w-full items-center justify-center gap-3 bg-gold px-6 py-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-gold-soft disabled:opacity-60"
            >
              {enviando ? "Enviando..." : "Quero acompanhar"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

function Campo({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={campo}
      />
    </div>
  );
}
