import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL, urlAbsoluta } from "@/lib/site";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Manifesto } from "@/components/site/Manifesto";
import { Conceitos } from "@/components/site/Conceitos";
import { Formatos } from "@/components/site/Formatos";
import { ParaAdministradoras } from "@/components/site/ParaAdministradoras";
import { ParaSindicos } from "@/components/site/ParaSindicos";
import { AtividadesPreview } from "@/components/site/AtividadesPreview";
import { MateriaisPreview } from "@/components/site/MateriaisPreview";
import { Maicon } from "@/components/site/Maicon";
import { Futuro } from "@/components/site/Futuro";
import { Parceiros } from "@/components/site/Parceiros";
import { Faq } from "@/components/site/Faq";
import { CtaFinal } from "@/components/site/CtaFinal";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { FormularioLead } from "@/components/landing/FormularioLead";

const titulo = "Fórmula Síndico | Formação e desenvolvimento para síndicos";
const descricao =
  "Cursos, encontros, conteúdos e experiências para síndicos profissionais e administradoras que buscam desenvolvimento e profissionalização no mercado condominial.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: titulo },
      { name: "description", content: descricao },
      { property: "og:title", content: titulo },
      { property: "og:description", content: descricao },
      { property: "og:type", content: "website" },
      { property: "og:url", content: urlAbsoluta("/") },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: titulo },
      { name: "twitter:description", content: descricao },
    ],
    links: [{ rel: "canonical", href: urlAbsoluta("/") }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          name: "Fórmula Síndico",
          description: descricao,
          url: SITE_URL,
          founder: { "@type": "Person", name: "Maicon Guedes" },
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Manifesto />
        <Conceitos />
        <Formatos />
        <ParaAdministradoras />
        <ParaSindicos />
        <AtividadesPreview />
        <MateriaisPreview />
        <Maicon />
        <Futuro />
        <Parceiros />
        <Faq />
        <CtaFinal />

        <section id="conversa" className="scroll-mt-24 bg-surface text-foreground">
          <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-32">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
              <div>
                <Reveal>
                  <p className="rule-label text-gold">Vamos conversar</p>
                </Reveal>
                <Reveal delay={80}>
                  <h2 className="display-lg mt-6 max-w-[18ch]">
                    Um único formulário para entrar no Fórmula Síndico.
                  </h2>
                </Reveal>
                <Reveal delay={140} as="p" className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
                  Seja você um síndico profissional, uma administradora ou
                  outro profissional do mercado condominial: conte seu interesse
                  e nossa equipe retorna com os próximos passos — atividades,
                  mentorias, materiais ou uma conversa com Maicon Guedes.
                </Reveal>
              </div>
              <Reveal delay={180}>
                <FormularioLead />
              </Reveal>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
