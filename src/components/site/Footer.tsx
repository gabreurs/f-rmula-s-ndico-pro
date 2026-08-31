import { WHATSAPP_EQUIPE_URL } from "@/lib/formula-sindico";

export function Footer() {
  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-[1600px] gap-8 border-t border-ink-foreground/12 px-5 py-12 md:grid-cols-[minmax(0,1fr)_auto] md:px-10">
        <div>
          <p className="font-display text-lg">
            Fórmula <span className="text-gold">Síndico</span>
          </p>
          <p className="mt-3 max-w-md text-sm text-ink-foreground/60">
            Formação e desenvolvimento para profissionais do mercado
            condominial, com Maicon Guedes.
          </p>
        </div>
        <nav className="flex flex-wrap items-end gap-x-8 gap-y-3 text-sm text-ink-foreground/60">
          <a href="/#o-formula" className="link-underline">O Fórmula</a>
          <a href="/atividades" className="link-underline">Atividades</a>
          <a href="/#materiais" className="link-underline">Materiais</a>
          <a href="/#sindicos" className="link-underline">Para síndicos</a>
          <a href="/#administradoras" className="link-underline">Para administradoras</a>
          <a href="/#conversa" className="link-underline">Quero participar</a>
          <a href="/#maicon" className="link-underline">Maicon Guedes</a>
        </nav>
      </div>
      <div className="gutter mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 border-t border-ink-foreground/12 py-8">
        <p className="text-sm text-ink-foreground/60">
          Quer apoiar uma atividade do Fórmula Síndico?
        </p>
        <a
          href={WHATSAPP_EQUIPE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-ink-foreground/25 px-5 py-3 text-sm transition-colors hover:border-gold hover:text-gold"
        >
          Conversar sobre parceria
        </a>
      </div>
    </footer>
  );
}
