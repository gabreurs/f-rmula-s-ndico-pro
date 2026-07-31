const pilares = [
  {
    titulo: "Riscos e responsabilidades do síndico",
    texto:
      "O que o síndico responde civil, criminal e tributariamente, como documentar decisões, assembleias, contratos, prestação de contas e obrigações trabalhistas do condomínio.",
  },
  {
    titulo: "Sindicatura profissional",
    texto:
      "Posicionamento, precificação, rotina de gestão, relacionamento com condôminos e com a administradora, e como conduzir a função com método e previsibilidade.",
  },
];

export function Programa() {
  return (
    <section id="programa" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-20 md:py-28">
      <p className="eyebrow">O que é</p>
      <h2 className="mt-4 max-w-2xl text-3xl md:text-4xl">
        Um curso de formação para a base de síndicos da sua administradora
      </h2>
      <p className="mt-5 max-w-2xl text-muted-foreground">
        A administradora convida os próprios síndicos. Não há custo para a
        administradora nem para os participantes. Em formatos híbridos, a
        administradora entra apenas com o espaço e o coffee break. Todo o
        conteúdo, material e condução são do Maicon Guedes.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {pilares.map((p) => (
          <article key={p.titulo} className="surface-panel p-7">
            <h3 className="text-xl">{p.titulo}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.texto}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
