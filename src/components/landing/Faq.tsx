import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const perguntas = [
  {
    q: "O curso tem algum custo para a administradora ou para os síndicos?",
    a: "Não. O programa é gratuito para os dois lados. No formato híbrido, a administradora fornece apenas o espaço para a abertura presencial e o coffee break.",
  },
  {
    q: "Quantos síndicos são necessários para abrir uma turma?",
    a: "A turma mínima é de 20 síndicos inscritos. Não há limite máximo fixo — isso é definido junto com a administradora.",
  },
  {
    q: "Quanto tempo dura o curso?",
    a: "9h30 no formato híbrido (abertura presencial de 3h30 + duas aulas online somando 6h) e 9h no formato totalmente online (três aulas ao vivo).",
  },
  {
    q: "Pode ser só online?",
    a: "Sim. O formato online acontece integralmente via Zoom, em três aulas ao vivo, sem necessidade de estrutura física.",
  },
  {
    q: "Quem ministra o conteúdo?",
    a: "Maicon Guedes: advogado, especialista e mestre em Direito, professor de Direito e Gestão Condominial e ex-síndico profissional.",
  },
  {
    q: "Com quanto tempo de antecedência preciso agendar?",
    a: "O ideal é planejar com pelo menos 30 a 45 dias, tempo suficiente para divulgar internamente e garantir a turma mínima.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-6 py-20 md:py-28">
      <p className="eyebrow">Perguntas frequentes</p>
      <h2 className="mt-4 text-3xl md:text-4xl">Antes da nossa conversa</h2>

      <Accordion type="single" collapsible className="mt-10">
        {perguntas.map((p) => (
          <AccordionItem key={p.q} value={p.q}>
            <AccordionTrigger className="text-left text-base">{p.q}</AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
              {p.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
