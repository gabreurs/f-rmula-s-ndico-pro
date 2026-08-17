import { Reveal } from "@/components/site/Reveal";
import maiconFoto from "@/assets/maicon.png.asset.json";

export function Manifesto() {
  return (
    <section id="o-formula" className="scroll-mt-24 bg-paper text-paper-foreground">
      <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="order-2 px-5 py-20 md:px-10 md:py-32 lg:order-1 lg:pl-[max(2.5rem,calc((100vw-1600px)/2+2.5rem))]">
          <Reveal>
            <p className="rule-label text-paper-muted">O Fórmula</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="display-xl mt-8 max-w-[14ch]">
              O mercado evoluiu. A formação também precisa evoluir.
            </h2>
          </Reveal>
          <div className="mt-10 max-w-xl space-y-6 text-base leading-relaxed text-paper-muted md:text-lg">
            <Reveal delay={140} as="p">
              Ser síndico hoje exige mais do que conhecer rotinas. Exige
              repertório, visão de mercado, capacidade de decisão e entendimento
              de um setor cada vez mais profissional.
            </Reveal>
            <Reveal delay={200} as="p">
              O Fórmula Síndico transforma experiência prática em conhecimento
              aplicável para quem quer acompanhar essa evolução.
            </Reveal>
          </div>
        </div>

        <div className="order-1 min-h-[46vh] overflow-hidden lg:order-2 lg:min-h-full">
          <img
            src={maiconFoto.url}
            alt="Maicon Guedes, responsável pela condução do Fórmula Síndico"
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-[1400ms] ease-out hover:scale-[1.03]"
          />
        </div>
      </div>
    </section>
  );
}
