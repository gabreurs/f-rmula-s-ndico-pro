import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/site/Reveal";

const perguntas = [
  {
    q: "O Fórmula Síndico é um curso único?",
    a: "Não. É um ecossistema de formação: cursos presenciais e online, workshops, mentorias, lives, entrevistas, materiais e encontros construídos para o mercado condominial.",
  },
  {
    q: "Quais formatos são possíveis com a minha administradora?",
    a: "O formato é definido junto com a empresa: encontro presencial, turma online ao vivo, formato híbrido ou uma experiência sob medida, de acordo com o perfil dos participantes e o objetivo do encontro.",
  },
  {
    q: "Quantos síndicos participam de uma turma?",
    a: "Depende do formato escolhido. Definimos o tamanho ideal do grupo junto com a administradora durante o alinhamento.",
  },
  {
    q: "Quem conduz o conteúdo?",
    a: "Maicon Guedes, especialista em mercado condominial, professor, palestrante, empreendedor e ex-síndico profissional.",
  },
  {
    q: "Com quanta antecedência é preciso planejar?",
    a: "O ideal é de 30 a 45 dias, tempo suficiente para alinhar o formato, produzir a comunicação e organizar a participação dos síndicos.",
  },
  {
    q: "E depois do encontro?",
    a: "A atividade pode abrir novas jornadas de formação: novos encontros, materiais de apoio e conteúdos que dão continuidade ao aprendizado.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="bg-background text-foreground">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-5 py-20 md:px-10 md:py-32 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <div>
          <Reveal>
            <p className="rule-label text-gold">Perguntas frequentes</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="display-lg mt-6 max-w-[14ch]">Antes da nossa conversa</h2>
          </Reveal>
        </div>
        <Reveal delay={140}>
          <Accordion type="single" collapsible>
            {perguntas.map((p) => (
              <AccordionItem key={p.q} value={p.q}>
                <AccordionTrigger className="text-left text-base md:text-lg">
                  {p.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground md:text-base">
                  {p.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
