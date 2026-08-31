import heroBuilding from "@/assets/hero-building.jpg";
import { Reveal } from "@/components/site/Reveal";
import { CTA_FINAL, WHATSAPP_EQUIPE_URL } from "@/lib/formula-sindico";

export function CtaFinal() {
  return (
    <section className="relative isolate flex min-h-[80vh] items-center overflow-hidden bg-ink text-ink-foreground">
      <div aria-hidden="true" className="absolute inset-0 -z-20 overflow-hidden">
        <img
          src={heroBuilding}
          alt=""
          loading="lazy"
          className="hero-zoom h-full w-full object-cover opacity-25"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,var(--color-ink)_0%,color-mix(in_oklab,var(--color-ink)_60%,transparent)_50%,var(--color-ink)_100%)]"
      />

      <div className="mx-auto w-full max-w-[1600px] px-5 py-24 md:px-10 md:py-32">
        <Reveal>
          <h2 className="display-hero max-w-[16ch]">
            Qual é o seu próximo passo no Fórmula Síndico?
          </h2>
        </Reveal>
        <Reveal delay={120} as="p" className="mt-8 max-w-2xl text-base leading-relaxed text-ink-foreground/70 md:text-lg">
          O Fórmula Síndico pode chegar até você de duas formas: diretamente,
          como profissional, ou através da administradora que você representa.
        </Reveal>
        <div className="mt-14 grid gap-px bg-ink-foreground/12 md:grid-cols-2">
          <Reveal as="div" delay={160} className="bg-ink p-8 md:p-12">
            <p className="rule-label text-gold">Sou síndico</p>
            <h3 className="display-lg mt-5">Quero participar</h3>
            <p className="mt-4 max-w-[40ch] text-sm leading-relaxed text-ink-foreground/70">
              Cursos, encontros, mentorias e materiais para evoluir sua atuação
              no mercado condominial.
            </p>
            <a
              href="#conversa"
              className="group mt-8 inline-flex items-center gap-3 bg-gold px-7 py-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-gold-soft"
            >
              Quero participar do Fórmula Síndico
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                &#8594;
              </span>
            </a>
          </Reveal>
          <Reveal as="div" delay={240} className="bg-ink p-8 md:p-12">
            <p className="rule-label text-gold">Represento uma administradora</p>
            <h3 className="display-lg mt-5">
              Quero levar o Fórmula para minha clientela
            </h3>
            <p className="mt-4 max-w-[40ch] text-sm leading-relaxed text-ink-foreground/70">
              Formação, experiências e novos pontos de relacionamento com os
              síndicos atendidos pela sua administradora.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#conversa"
                className="group inline-flex items-center gap-3 border border-ink-foreground/25 px-7 py-4 text-sm font-medium transition-colors hover:border-gold hover:text-gold"
              >
                {CTA_FINAL}
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  &#8594;
                </span>
              </a>
              <a
                href={WHATSAPP_EQUIPE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center border border-ink-foreground/25 px-7 py-4 text-sm font-medium transition-colors hover:border-gold hover:text-gold"
              >
                Falar pelo WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
