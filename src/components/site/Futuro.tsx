import { Reveal } from "@/components/site/Reveal";

export function Futuro() {
  return (
    <section className="relative isolate overflow-hidden bg-background text-foreground">
      <span
        aria-hidden="true"
        className="watermark absolute -left-6 bottom-0 -z-10 text-foreground/[0.035]"
      >
        EVOLUÇÃO
      </span>
      <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-32">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
          <Reveal>
            <p className="rule-label text-gold">Em constante evolução</p>
          </Reveal>
          <div>
            <Reveal delay={80}>
              <h2 className="display-lg max-w-[18ch]">
                O conhecimento não termina em uma única atividade.
              </h2>
            </Reveal>
            <Reveal delay={140} as="p" className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              O Fórmula Síndico está sendo construído como um ambiente contínuo
              de formação, reunindo novas experiências, materiais e conteúdos
              para acompanhar profissionais ao longo da sua evolução no mercado.
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
