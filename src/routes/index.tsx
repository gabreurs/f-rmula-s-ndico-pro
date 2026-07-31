import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/landing/Hero";
import { Programa } from "@/components/landing/Programa";
import { SobreMaicon } from "@/components/landing/SobreMaicon";
import { Beneficios } from "@/components/landing/Beneficios";
import { ComoFunciona } from "@/components/landing/ComoFunciona";
import { Faq } from "@/components/landing/Faq";
import { FormularioLead } from "@/components/landing/FormularioLead";
import { CTA_TEXT } from "@/lib/formula-sindico";

const titulo = "Fórmula Síndico — curso gratuito para a sua carteira de síndicos";
const descricao =
  "Programa gratuito de capacitação de síndicos com Maicon Guedes, em parceria com administradoras de condomínio. Sem custo, turmas híbridas ou online.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: titulo },
      { name: "description", content: descricao },
      { property: "og:title", content: titulo },
      { property: "og:description", content: descricao },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main>
      <Hero />
      <Programa />
      <SobreMaicon />
      <Beneficios />
      <ComoFunciona />
      <Faq />

      <section id="conversa" className="scroll-mt-20 border-t border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Solicitar uma conversa</p>
            <h2 className="mt-4 text-3xl md:text-4xl">{CTA_TEXT}</h2>
            <p className="mt-5 text-muted-foreground">
              Preencha os dados abaixo. Nossa equipe entra em contato para
              agendar uma conversa com o Maicon e desenhar a turma da sua
              administradora.
            </p>
          </div>
          <div className="mt-12">
            <FormularioLead />
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 py-12 text-sm text-muted-foreground">
        <p>
          Fórmula Síndico — formação em Direito e Gestão Condominial com Maicon
          Guedes.
        </p>
      </footer>
    </main>
  );
}
