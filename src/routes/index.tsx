import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Manifesto } from "@/components/site/Manifesto";
import { Conceitos } from "@/components/site/Conceitos";
import { Formatos } from "@/components/site/Formatos";
import { ParaAdministradoras } from "@/components/site/ParaAdministradoras";
import { ParaSindicos } from "@/components/site/ParaSindicos";
import { CaptacaoSindicos } from "@/components/site/CaptacaoSindicos";
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
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: titulo },
      { name: "twitter:description", content: descricao },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          name: "Fórmula Síndico",
          description: descricao,
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
        <CaptacaoSindicos />
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
                  <h2 className="display-lg mt-6 max-w-[16ch]">
                    Vamos conversar sobre sua próxima experiência com a clientela
                    de síndicos.
                  </h2>
                </Reveal>
                <Reveal delay={140} as="p" className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
                  Conte um pouco sobre a administradora. Nossa equipe analisa as
                  informações, entende o objetivo e organiza uma conversa com
                  Maicon Guedes para definir formato, viabilidade e próximos
                  passos.
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
