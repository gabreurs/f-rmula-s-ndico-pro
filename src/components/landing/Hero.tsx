import { CTA_TEXT } from "@/lib/formula-sindico";
import heroBuilding from "@/assets/hero-building.jpg";

export function Hero() {
  return (
    <header className="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-30 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: `url(${heroBuilding})` }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(120%_80%_at_15%_0%,color-mix(in_oklab,var(--color-gold)_12%,transparent),transparent_65%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,var(--color-background)_0%,transparent_25%,var(--color-background)_100%)]"
      />


      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-7">
        <span className="font-display text-lg font-semibold tracking-tight">
          Fórmula <span className="text-gold">Síndico</span>
        </span>
        <div className="hidden gap-7 text-sm text-muted-foreground md:flex">
          <a href="#programa" className="hover:text-foreground">O programa</a>
          <a href="#maicon" className="hover:text-foreground">Maicon Guedes</a>
          <a href="#como-funciona" className="hover:text-foreground">Como funciona</a>
          <a href="#faq" className="hover:text-foreground">FAQ</a>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 pb-28 pt-16 md:pb-40 md:pt-24">
        <p className="eyebrow">Curso gratuito para síndicos</p>
        <h1 className="mt-5 max-w-3xl text-4xl leading-[1.08] md:text-6xl">
          Capacite os síndicos da sua carteira{" "}
          <span className="text-gradient-gold">sem custo nenhum</span> para a
          administradora.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground">
          O Fórmula Síndico é um programa de formação conduzido pelo advogado
          Maicon Guedes em parceria com administradoras de condomínio de todo o
          Brasil. Menos risco jurídico para os seus síndicos, mais autoridade
          para a sua marca.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href="#conversa"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3.5 text-center text-sm font-semibold text-primary-foreground transition-colors hover:bg-gold-soft"
          >
            {CTA_TEXT}
          </a>
          <span className="text-sm text-muted-foreground">
            Investimento da administradora: <strong className="text-foreground">R$ 0</strong>
          </span>
        </div>
      </div>
    </header>
  );
}
