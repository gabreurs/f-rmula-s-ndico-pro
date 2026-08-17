import { Reveal } from "@/components/site/Reveal";
import { MATERIAIS } from "@/data/ecossistema";

const tipos = ["E-books", "Guias", "Checklists", "Estudos", "Materiais"];

export function MateriaisPreview() {
  return (
    <section id="materiais" className="scroll-mt-24 bg-surface text-foreground">
      <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-32">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            <Reveal>
              <p className="rule-label text-gold">Materiais</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="display-xl mt-7 max-w-[14ch]">
                Conhecimento que continua depois do encontro.
              </h2>
            </Reveal>
          </div>

          <div className="self-end">
            <Reveal delay={140}>
              <ul className="flex flex-wrap gap-x-8 gap-y-3">
                {tipos.map((t) => (
                  <li
                    key={t}
                    className="rule-label border-b border-border pb-2 text-muted-foreground"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={200} className="mt-10">
              {MATERIAIS.length === 0 ? (
                <div className="border border-dashed border-border px-6 py-10">
                  <p className="text-base text-muted-foreground">
                    Os primeiros materiais do Fórmula Síndico estão sendo
                    produzidos e serão publicados aqui.
                  </p>
                  <a
                    href="#conversa"
                    className="link-underline mt-5 inline-block text-sm font-medium text-gold"
                  >
                    Quero ser avisado
                  </a>
                </div>
              ) : (
                <ul className="grid gap-px bg-border sm:grid-cols-2">
                  {MATERIAIS.map((m) => (
                    <li key={m.slug} className="bg-surface p-6">
                      <p className="rule-label text-gold">{m.tipo}</p>
                      <h3 className="mt-2 text-lg">{m.titulo}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{m.descricao}</p>
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
