const beneficios = [
  {
    titulo: "Retenção de síndicos",
    texto:
      "Um síndico capacitado pela sua administradora tem um motivo concreto para permanecer com você — e para indicar você.",
  },
  {
    titulo: "Menos risco e menos demanda",
    texto:
      "Síndico que entende suas responsabilidades erra menos, aciona menos o jurídico e gera menos retrabalho para a sua equipe.",
  },
  {
    titulo: "Relacionamento fortalecido",
    texto:
      "Um encontro de valor real com a sua base, sem discurso comercial, posiciona a administradora como parceira e não como fornecedora.",
  },
  {
    titulo: "Pipeline de novos síndicos",
    texto:
      "A turma aproxima síndicos profissionais alinhados às boas práticas que a sua administradora defende.",
  },
];

export function Beneficios() {
  return (
    <section id="beneficios" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-20 md:py-28">
      <p className="eyebrow">Para quem é</p>
      <h2 className="mt-4 max-w-2xl text-3xl md:text-4xl">
        Feito para administradoras que querem uma base de síndicos mais forte
      </h2>
      <p className="mt-5 max-w-2xl text-muted-foreground">
        Gerentes gerais, diretores, donos e responsáveis pelo relacionamento com
        síndicos encontram aqui um benefício pronto para oferecer à carteira.
      </p>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {beneficios.map((b, i) => (
          <article key={b.titulo} className="surface-panel p-7">
            <span className="font-display text-2xl text-gold">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-3 text-lg">{b.titulo}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.texto}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
