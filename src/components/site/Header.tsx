import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CTA_HEADER } from "@/lib/formula-sindico";

const links = [
  { label: "O Fórmula", href: "/#o-formula" },
  { label: "Atividades", href: "/atividades" },
  { label: "Materiais", href: "/#materiais" },
  { label: "Para administradoras", href: "/#administradoras" },
  { label: "Maicon Guedes", href: "/#maicon" },
];

export function Header() {
  const [solido, setSolido] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolido(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        solido ? "bg-ink/85 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto grid max-w-[1600px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 text-ink-foreground md:px-10">
        <Link to="/" className="min-w-0 font-display text-base tracking-tight md:text-lg">
          Fórmula <span className="text-gold">Síndico</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="link-underline text-[0.8rem] uppercase tracking-[0.14em] text-ink-foreground/70 transition-colors hover:text-ink-foreground"
            >
              {l.label}
            </a>
          ))}
          <a
            href="/#conversa"
            className="group inline-flex shrink-0 items-center gap-2 border border-gold/60 px-5 py-2.5 text-[0.75rem] uppercase tracking-[0.14em] text-gold transition-colors hover:bg-gold hover:text-primary-foreground"
          >
            {CTA_HEADER}
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              &#8594;
            </span>
          </a>
        </nav>

        <a
          href="/#conversa"
          className="shrink-0 border border-gold/60 px-4 py-2 text-[0.7rem] uppercase tracking-[0.14em] text-gold lg:hidden"
        >
          Falar com a equipe
        </a>
      </div>
    </header>
  );
}
