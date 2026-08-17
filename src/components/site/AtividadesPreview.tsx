import { Reveal } from "@/components/site/Reveal";
import { ATIVIDADES, type Atividade } from "@/data/ecossistema";

const statusLabel: Record<Atividade["status"], string> = {
  inscricoes_abertas: "Inscrições abertas",
  em_preparacao: "Em preparação",
  encerrada: "Encerrada",
};

export function AtividadeCard({ a }: { a: Atividade }) {
  return (
    <article className="group flex flex-col border border-border bg-background transition-colors duration-500 hover:border-gold/50">
      {a.imagem && (
        <div className="overflow-hidden">
          <img
            src={a.imagem}
            alt={a.titulo}
            loading="lazy"
            className="h-56 w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-7">
        <p className="rule-label text-gold">{a.tipo}</p>
        <h3 className="mt-3 text-xl">{a.titulo}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.descricao}</p>
        <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <div>
            <dt className="sr-only">Modalidade</dt>
            <dd className="capitalize">{a.modalidade}</dd>
          </div>
          {a.cidade && (
            <div>
              <dt className="sr-only">Cidade</dt>
              <dd>{a.cidade}</dd>
            </div>
          )}
          {a.data && (
            <div>
              <dt className="sr-only">Data</dt>
              <dd>{a.data}</dd>
            </div>
          )}
          <div>
            <dt className="sr-only">Status</dt>
            <dd className="text-gold">{statusLabel[a.status]}</dd>
          </div>
        </dl>
        <a
          href="/#conversa"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gold"
        >
          Saber mais
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            &#8594;
          </span>
        </a>
      </div>
    </article>
  );
}

export function AtividadesVazio() {
  return (
    <div className="border border-dashed border-border px-7 py-16 text-center md:py-24">
      <p className="display-lg">Novas atividades estão sendo preparadas.</p>
      <a
        href="/#conversa"
        className="group mt-8 inline-flex items-center gap-3 bg-gold px-7 py-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-gold-soft"
      >
        Quero ser avisado
        <span className="transition-transform duration-300 group-hover:translate-x-1">
          &#8594;
        </span>
      </a>
    </div>
  );
}

export function AtividadesPreview() {
  return (
    <section id="atividades" className="scroll-mt-24 bg-background text-foreground">
      <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-32">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div>
            <Reveal>
              <p className="rule-label text-gold">Agenda</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="display-xl mt-7 max-w-[15ch]">
                O que está acontecendo no Fórmula.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={140}>
            <a
              href="/atividades"
              className="link-underline text-sm uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
            >
              Ver agenda completa
            </a>
          </Reveal>
        </div>

        <Reveal delay={180} className="mt-12">
          {ATIVIDADES.length === 0 ? (
            <AtividadesVazio />
          ) : (
            <div className="grid gap-px bg-border md:grid-cols-3">
              {ATIVIDADES.map((a) => (
                <AtividadeCard key={a.slug} a={a} />
              ))}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
