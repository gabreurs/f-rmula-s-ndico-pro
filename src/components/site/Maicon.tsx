import { Reveal } from "@/components/site/Reveal";
import maiconFoto from "@/assets/maicon.png.asset.json";
import { CREDENCIAIS_MAICON } from "@/data/ecossistema";

export function Maicon() {
  return (
    <section id="maicon" className="scroll-mt-24 bg-paper text-paper-foreground">
      <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="relative isolate min-h-[55vh] overflow-hidden border-0 bg-ink leading-none lg:min-h-[85vh]">
          <img
            src={maiconFoto.url}
            alt="Maicon Guedes, especialista em mercado condominial"
            loading="lazy"
            decoding="async"
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="block h-full w-full border-0 object-cover object-top align-bottom"
          />
        </div>

        <div className="px-5 py-20 md:px-10 md:py-32 lg:pr-[max(2.5rem,calc((100vw-1600px)/2+2.5rem))]">
          <Reveal>
            <p className="rule-label text-paper-muted">Por trás do Fórmula</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="display-xl mt-7 max-w-[14ch]">
              Experiência de mercado transformada em conhecimento.
            </h2>
          </Reveal>
          <Reveal delay={140} as="p" className="mt-8 max-w-xl text-base leading-relaxed text-paper-muted md:text-lg">
            Maicon Guedes reúne experiência prática no mercado condominial,
            educação, empreendedorismo e desenvolvimento de profissionais do
            setor.
          </Reveal>

          <ul className="mt-12 grid gap-px border-t border-paper-border sm:grid-cols-2">
            {CREDENCIAIS_MAICON.map((c, i) => (
              <Reveal
                as="li"
                key={c}
                delay={i * 70}
                className="border-b border-paper-border py-5 pr-4 text-sm font-medium"
              >
                {c}
              </Reveal>
            ))}
          </ul>

          <Reveal delay={260}>
            <p className="mt-10 font-display text-2xl text-paper-foreground/70">
              Maicon Guedes
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
