import { Reveal } from "@/components/site/Reveal";

const palavras = ["GESTÃO", "LIDERANÇA", "MERCADO", "ESTRATÉGIA"];

export function ParaSindicos() {
  return (
    <section
      id="sindicos"
      className="relative isolate scroll-mt-24 overflow-hidden bg-graphite text-ink-foreground"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 flex flex-col justify-center gap-2 overflow-hidden"
      >
        {palavras.map((p, i) => (
          <span
            key={p}
            className="watermark whitespace-nowrap text-ink-foreground/[0.035]"
            style={{ transform: `translateX(${i % 2 === 0 ? "-4%" : "10%"})` }}
          >
            {p}
          </span>
        ))}
      </div>

      <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36">
        <div className="max-w-3xl">
          <Reveal>
            <p className="rule-label text-gold">Para síndicos</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="display-xl mt-7">
              Evolua sua atuação dentro de um mercado cada vez mais profissional.
            </h2>
          </Reveal>
          <Reveal delay={150} as="p" className="mt-8 text-base leading-relaxed text-ink-foreground/70 md:text-lg">
            Cursos, encontros, conteúdos e experiências para síndicos que
            desejam ampliar repertório, fortalecer sua gestão e acompanhar as
            transformações do mercado condominial. Você pode participar
            diretamente, sem depender de uma administradora.
          </Reveal>
          <Reveal delay={190} as="p" className="mt-6 text-sm uppercase tracking-[0.14em] text-ink-foreground/45">
            Gestão · Liderança · Mercado · Estratégia · Empreendedorismo ·
            Relacionamento · Comunicação
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#conversa"
                className="group inline-flex items-center justify-center gap-3 bg-gold px-7 py-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-gold-soft"
              >
                Quero participar do Fórmula Síndico
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  &#8594;
                </span>
              </a>
              <a
                href="/atividades"
                className="group inline-flex items-center justify-center gap-3 border border-ink-foreground/25 px-7 py-4 text-sm font-medium transition-colors hover:border-gold hover:text-gold"
              >
                Quero conhecer as atividades
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  &#8594;
                </span>
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
