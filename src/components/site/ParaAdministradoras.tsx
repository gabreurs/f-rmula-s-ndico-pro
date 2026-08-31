import { Reveal } from "@/components/site/Reveal";
import { BENEFICIOS_ADMINISTRADORAS, PASSOS_ADMINISTRADORAS } from "@/data/ecossistema";
import { CTA_PRINCIPAL } from "@/lib/formula-sindico";

export function ParaAdministradoras() {
  return (
    <section
      id="administradoras"
      className="scroll-mt-24 bg-paper text-paper-foreground"
    >
      <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-32">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-20">
          <div>
            <Reveal>
              <p className="rule-label text-paper-muted">Para administradoras</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="display-xl mt-7 max-w-[16ch]">
                Formação também fortalece a relação com sua clientela de
                síndicos.
              </h2>
            </Reveal>
          </div>
          <div className="max-w-xl space-y-6 self-end text-base leading-relaxed text-paper-muted md:text-lg">
            <Reveal delay={140} as="p">
              Leve cursos, encontros e experiências relevantes para os síndicos
              atendidos pela sua administradora e crie novos pontos de
              relacionamento, desenvolvimento e aproximação.
            </Reveal>
            <Reveal delay={200} as="p">
              O Fórmula Síndico pode assumir diferentes formatos de acordo com o
              perfil da empresa, dos participantes e do objetivo de cada
              encontro.
            </Reveal>
            <Reveal delay={260}>
              <a
                href="#conversa"
                className="group inline-flex items-center gap-3 bg-paper-foreground px-7 py-4 text-sm font-semibold text-paper transition-colors hover:bg-gold hover:text-primary-foreground"
              >
                Quero levar o Fórmula Síndico para minha administradora
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  &#8594;
                </span>
              </a>
            </Reveal>
          </div>
        </div>

        <ul className="mt-20 grid gap-px border-t border-paper-border sm:grid-cols-2 lg:grid-cols-5">
          {BENEFICIOS_ADMINISTRADORAS.map((b, i) => (
            <Reveal
              as="li"
              key={b.titulo}
              delay={i * 70}
              className="border-b border-paper-border px-1 py-8 lg:border-r lg:pr-6 lg:last:border-r-0"
            >
              <h3 className="rule-label text-paper-foreground">{b.titulo}</h3>
              <p className="mt-3 text-sm leading-relaxed text-paper-muted">{b.texto}</p>
            </Reveal>
          ))}
        </ul>

        <div className="mt-24">
          <Reveal>
            <p className="rule-label text-paper-muted">Como funciona</p>
          </Reveal>
          <ol className="relative mt-10 grid gap-10 md:grid-cols-4 md:gap-6">
            <span
              aria-hidden="true"
              className="absolute left-0 top-3 hidden h-px w-full bg-paper-border md:block"
            />
            {PASSOS_ADMINISTRADORAS.map((p, i) => (
              <Reveal as="li" key={p.numero} delay={i * 120} className="relative md:pr-6">
                <span
                  aria-hidden="true"
                  className="absolute -top-[3px] left-0 hidden h-[7px] w-[7px] rounded-full bg-gold md:block"
                />
                <span className="block font-display text-3xl text-gold md:mt-8">
                  {p.numero}
                </span>
                <h3 className="mt-3 text-lg">{p.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-paper-muted">{p.texto}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
