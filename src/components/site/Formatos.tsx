import { Reveal } from "@/components/site/Reveal";
import { FORMATOS_ECOSSISTEMA } from "@/data/ecossistema";

const span: Record<string, string> = {
  grande: "md:col-span-4 md:row-span-2",
  medio: "md:col-span-2",
  vertical: "md:col-span-2 md:row-span-2",
  horizontal: "md:col-span-4",
};

export function Formatos() {
  return (
    <section id="formatos" className="scroll-mt-24 bg-background text-foreground">
      <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-32">
        <Reveal>
          <p className="rule-label text-gold">Formatos</p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="display-xl mt-7 max-w-[16ch]">
            Um ecossistema. Diferentes formas de aprender.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-px bg-border md:grid-cols-6">
          {FORMATOS_ECOSSISTEMA.map((f, i) => (
            <Reveal
              as="article"
              key={f.chave}
              delay={i * 60}
              className={`group relative flex min-h-[220px] flex-col justify-between overflow-hidden bg-background p-7 transition-colors duration-500 hover:bg-surface md:p-10 ${span[f.escala]}`}
            >
              <span className="rule-label text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="mt-10">
                <h3 className="display-lg transition-transform duration-500 group-hover:translate-x-1">
                  {f.titulo}
                </h3>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                  {f.texto}
                </p>
                <span className="mt-6 block h-px w-10 origin-left bg-gold transition-transform duration-500 group-hover:scale-x-[4]" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
