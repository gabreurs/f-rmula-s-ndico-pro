import { Reveal } from "@/components/site/Reveal";
import { FORMATOS_ECOSSISTEMA } from "@/data/ecossistema";

export function Formatos() {
  return (
    <section id="formatos" className="scroll-mt-24 bg-background text-foreground">
      <div className="gutter mx-auto max-w-[1600px] py-20 md:py-32">
        <Reveal>
          <p className="rule-label text-gold">Formatos</p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="display-xl mt-7 max-w-[16ch]">
            Um ecossistema. Diferentes formas de aprender.
          </h2>
        </Reveal>

        {/* Grid uniforme 2×2 — mesma largura, altura e respiro para todos os blocos. */}
        <div className="mt-14 grid gap-px bg-border sm:grid-cols-2">
          {FORMATOS_ECOSSISTEMA.map((f, i) => (
            <Reveal
              as="article"
              key={f.chave}
              delay={Math.min(i, 3) * 60}
              className="group flex min-h-[clamp(280px,28vw,420px)] flex-col justify-between bg-background p-7 transition-colors duration-500 hover:bg-surface md:p-12"
            >
              <span className="rule-label text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="display-lg">{f.titulo}</h3>
                <p className="mt-4 max-w-[46ch] text-sm leading-relaxed text-muted-foreground">
                  {f.texto}
                </p>
                <span className="mt-7 block h-px w-12 origin-left bg-gold transition-transform duration-700 group-hover:scale-x-[3]" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
