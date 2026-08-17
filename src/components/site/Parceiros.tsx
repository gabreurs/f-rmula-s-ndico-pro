import { Reveal } from "@/components/site/Reveal";
import { PARCEIROS } from "@/data/ecossistema";

export function Parceiros() {
  if (PARCEIROS.length === 0) return null;

  return (
    <section className="bg-surface text-foreground">
      <div className="mx-auto max-w-[1600px] px-5 py-16 md:px-10 md:py-24">
        <Reveal>
          <p className="rule-label text-gold">Quem constrói junto</p>
        </Reveal>
        <ul className="mt-10 flex flex-wrap items-center gap-x-14 gap-y-8">
          {PARCEIROS.map((p) => (
            <li key={p.nome}>
              <img
                src={p.logo}
                alt={p.nome}
                loading="lazy"
                className="h-9 w-auto opacity-70 transition-opacity hover:opacity-100"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
