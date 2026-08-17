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
          <h2 className="display-hero max-w-[15ch]">
            Leve novas experiências para sua clientela de síndicos.
          </h2>
        </Reveal>
        <Reveal delay={120} as="p" className="mt-8 max-w-2xl text-base leading-relaxed text-ink-foreground/70 md:text-lg">
          Vamos construir um formato que faça sentido para sua administradora e
          para os profissionais que ela atende.
        </Reveal>
        <Reveal delay={200}>
          <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#conversa"
              className="group inline-flex items-center justify-center gap-3 bg-gold px-8 py-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-gold-soft"
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
              className="inline-flex items-center justify-center border border-ink-foreground/25 px-8 py-4 text-sm font-medium transition-colors hover:border-gold hover:text-gold"
            >
              Falar pelo WhatsApp
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
