import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { AtividadeCard, AtividadesVazio } from "@/components/site/AtividadesPreview";
import { ATIVIDADES } from "@/data/ecossistema";

const titulo = "Agenda Fórmula Síndico | Cursos, encontros e experiências";
const descricao =
  "Cursos, workshops, mentorias, lives e encontros do Fórmula Síndico para síndicos e administradoras do mercado condominial.";

export const Route = createFileRoute("/atividades")({
  head: () => ({
    meta: [
      { title: titulo },
      { name: "description", content: descricao },
      { property: "og:title", content: titulo },
      { property: "og:description", content: descricao },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/atividades" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: titulo },
      { name: "twitter:description", content: descricao },
    ],
    links: [{ rel: "canonical", href: "/atividades" }],
  }),
  component: AtividadesPage,
});

const filtros = [
  { chave: "todas", label: "Todas" },
  { chave: "presencial", label: "Presenciais" },
  { chave: "online", label: "Online" },
  { chave: "Workshop", label: "Workshops" },
  { chave: "Mentoria", label: "Mentorias" },
  { chave: "Live", label: "Lives" },
];

function AtividadesPage() {
  const [filtro, setFiltro] = useState("todas");

  const lista = useMemo(() => {
    if (filtro === "todas") return ATIVIDADES;
    return ATIVIDADES.filter((a) => a.modalidade === filtro || a.tipo === filtro);
  }, [filtro]);

  return (
    <>
      <Header />
      <main className="bg-background text-foreground">
        <section className="bg-ink text-ink-foreground">
          <div className="mx-auto max-w-[1600px] px-5 pb-16 pt-36 md:px-10 md:pb-24 md:pt-44">
            <p className="rise-in rule-label text-gold">Agenda Fórmula Síndico</p>
            <h1 className="rise-in display-hero mt-6 max-w-[14ch]" style={{ animationDelay: "140ms" }}>
              Cursos, encontros e experiências em movimento.
            </h1>
          </div>
        </section>

        <div className="mx-auto max-w-[1600px] px-5 py-16 md:px-10 md:py-24">
          <ul className="flex flex-wrap gap-x-8 gap-y-3 border-b border-border pb-5">
            {filtros.map((f) => (
              <li key={f.chave}>
                <button
                  type="button"
                  onClick={() => setFiltro(f.chave)}
                  aria-pressed={filtro === f.chave}
                  className={`rule-label transition-colors ${
                    filtro === f.chave
                      ? "text-gold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f.label}
                </button>
              </li>
            ))}
          </ul>

          <Reveal className="mt-12">
            {lista.length === 0 ? (
              <AtividadesVazio />
            ) : (
              <div className="grid gap-px bg-border md:grid-cols-3">
                {lista.map((a) => (
                  <AtividadeCard key={a.slug} a={a} />
                ))}
              </div>
            )}
          </Reveal>
        </div>
      </main>
      <Footer />
    </>
  );
}
