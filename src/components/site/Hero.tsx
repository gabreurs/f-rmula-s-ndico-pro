import heroBuilding from "@/assets/hero-building.jpg";
import { BADGES_HERO } from "@/data/ecossistema";
import { CTA_PRINCIPAL } from "@/lib/formula-sindico";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[92vh] items-end overflow-hidden bg-ink text-ink-foreground md:min-h-screen">
      <div aria-hidden="true" className="absolute inset-0 -z-30 overflow-hidden">
        <img
          src={heroBuilding}
          alt=""
          className="hero-zoom h-full w-full object-cover object-center opacity-45"
          fetchPriority="high"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(120%_90%_at_10%_0%,color-mix(in_oklab,var(--color-gold)_14%,transparent),transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-ink)_88%,transparent)_0%,color-mix(in_oklab,var(--color-ink)_40%,transparent)_40%,var(--color-ink)_100%)]"
      />

      <div className="mx-auto w-full max-w-[1600px] px-5 pb-16 pt-36 md:px-10 md:pb-24 md:pt-44">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:items-end">
          <div>
            <p className="rise-in eyebrow" style={{ animationDelay: "60ms" }}>
              Formação para o mercado condominial
            </p>
            <h1
              className="rise-in display-hero mt-6 max-w-[16ch]"
              style={{ animationDelay: "160ms" }}
            >
              Conhecimento para quem vive a{" "}
              <span className="text-gradient-gold">gestão de verdade.</span>
            </h1>
            <p
              className="rise-in mt-8 max-w-xl text-base leading-relaxed text-ink-foreground/75 md:text-lg"
              style={{ animationDelay: "280ms" }}
            >
              Cursos, encontros e experiências que conectam síndicos,
              administradoras e especialistas a uma visão mais profissional do
              mercado condominial.
            </p>
            <div
              className="rise-in mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
              style={{ animationDelay: "380ms" }}
            >
              <a
                href="#conversa"
                className="group inline-flex items-center justify-center gap-3 bg-gold px-7 py-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-gold-soft"
              >
                {CTA_PRINCIPAL}
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  &#8594;
                </span>
              </a>
              <a
                href="#formatos"
                className="group inline-flex items-center justify-center gap-3 border border-ink-foreground/25 px-7 py-4 text-sm font-medium text-ink-foreground transition-colors hover:border-gold hover:text-gold"
              >
                Conheça as atividades
                <span className="transition-transform duration-300 group-hover:translate-y-0.5">
                  &#8595;
                </span>
              </a>
            </div>
          </div>

          <ul
            className="rise-in grid grid-cols-2 gap-3 lg:grid-cols-1 lg:gap-4"
            style={{ animationDelay: "480ms" }}
          >
            {BADGES_HERO.map((b, i) => (
              <li
                key={b.titulo}
                className={`${b.animacao} ${i > 2 ? "hidden lg:block" : ""} group border border-ink-foreground/15 bg-ink/45 px-4 py-4 backdrop-blur-sm transition-colors duration-500 hover:border-gold/70 hover:bg-ink/70`}
              >
                <p className="rule-label text-gold">{b.titulo}</p>
                <p className="mt-2 text-xs leading-relaxed text-ink-foreground/70">
                  {b.texto}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
