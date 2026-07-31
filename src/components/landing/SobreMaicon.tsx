const credenciais = [
  "Advogado, especialista e mestre em Direito",
  "MBA em Gestão Estratégica e Inovação",
  "Professor de Direito e Gestão Condominial",
  "Palestrante em eventos condominiais",
  "Ex-síndico profissional, com centenas de condomínios administrados",
  "Colunista de portais de gestão condominial",
];

export function SobreMaicon() {
  return (
    <section id="maicon" className="scroll-mt-20 border-y border-border bg-surface/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-[1fr_1.2fr] md:py-28">
        <div>
          <p className="eyebrow">Quem ministra</p>
          <h2 className="mt-4 text-3xl md:text-4xl">Maicon Guedes</h2>
          <p className="mt-5 text-muted-foreground">
            Une a técnica jurídica de quem leciona Direito Condominial à
            realidade prática de quem já esteve do outro lado, administrando
            condomínios como síndico profissional. É essa combinação que faz o
            conteúdo chegar ao síndico de forma aplicável, sem juridiquês.
          </p>
        </div>
        <ul className="grid gap-3 self-center">
          {credenciais.map((c) => (
            <li
              key={c}
              className="flex items-start gap-3 rounded-lg border border-border bg-background/60 px-4 py-3 text-sm"
            >
              <span aria-hidden="true" className="mt-0.5 text-gold">
                &#9670;
              </span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
