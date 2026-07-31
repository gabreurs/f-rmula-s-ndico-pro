const formatos = [
  {
    nome: "Formato híbrido",
    carga: "9h30 no total",
    itens: [
      "Abertura presencial de 3h30, com coffee break",
      "Duas aulas online de 6h no total",
      "Estrutura e coffee break por conta da administradora",
    ],
  },
  {
    nome: "Formato online",
    carga: "9h no total",
    itens: [
      "Três aulas ao vivo via Zoom",
      "Sem necessidade de espaço físico",
      "Ideal para carteiras distribuídas em várias cidades",
    ],
  },
];

export function ComoFunciona() {
  return (
    <section
      id="como-funciona"
      className="scroll-mt-20 border-y border-border bg-surface/40"
    >
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <p className="eyebrow">Como funciona</p>
        <h2 className="mt-4 max-w-2xl text-3xl md:text-4xl">
          Dois eixos de conteúdo, dois formatos possíveis
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {formatos.map((f) => (
            <article key={f.nome} className="surface-panel bg-background/60 p-7">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-xl">{f.nome}</h3>
                <span className="text-sm font-semibold text-gold">{f.carga}</span>
              </div>
              <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
                {f.itens.map((i) => (
                  <li key={i} className="flex gap-3">
                    <span aria-hidden="true" className="text-gold">
                      &#8212;
                    </span>
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <dl className="mt-8 grid gap-5 sm:grid-cols-2">
          <div className="surface-panel bg-background/60 p-6">
            <dt className="text-sm text-muted-foreground">
              Investimento da administradora
            </dt>
            <dd className="mt-1 font-display text-3xl text-gold">R$ 0</dd>
          </div>
          <div className="surface-panel bg-background/60 p-6">
            <dt className="text-sm text-muted-foreground">Turma mínima</dt>
            <dd className="mt-1 font-display text-3xl text-gold">20 síndicos</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
