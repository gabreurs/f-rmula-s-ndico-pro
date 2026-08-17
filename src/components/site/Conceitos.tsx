import { Reveal } from "@/components/site/Reveal";
import { CONCEITOS } from "@/data/ecossistema";

export function Conceitos() {
  return (
    <section className="relative isolate overflow-hidden bg-graphite text-ink-foreground">
      <span
        aria-hidden="true"
        className="watermark absolute -bottom-10 -right-6 -z-10 text-ink-foreground/[0.04]"
      >
        FÓRMULA
      </span>

      <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-28">
        <ul>
          {CONCEITOS.map((c, i) => (
            <Reveal
              as="li"
              key={c.numero}
              delay={i * 90}
              className="group grid gap-6 border-t border-ink-foreground/12 py-10 md:grid-cols-[auto_minmax(0,0.9fr)_minmax(0,1.4fr)] md:items-baseline md:gap-12 md:py-16 last:border-b"
            >
              <span className="font-display text-4xl text-gold/70 transition-colors duration-500 group-hover:text-gold md:text-6xl">
                {c.numero}
              </span>
              <h3 className="display-lg">{c.titulo}</h3>
              <p className="max-w-xl text-base leading-relaxed text-ink-foreground/65">
                {c.texto}
              </p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
