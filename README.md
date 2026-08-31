# Fórmula Síndico Pro

Quero construir uma landing page de apresentação e qualificação para o "Fórmula Síndico", um curso gratuito para síndicos, ministrado por Maicon Guedes (advogado, especialista e mestre em Direito, professor de Direito e Gestão Condominial, ex-síndico profissional) em parceria com administradoras de condomínio no Brasil.




CONTEXTO DO PRODUTO
A administradora convida seus próprios síndicos para participar do curso. Não há custo para a administradora nem para os síndicos. A administradora só precisa fornecer estrutura e coffee break quando o formato for híbrido/presencial. O objetivo desta página é fazer a administradora entender o programa sozinha, antes de uma conversa comercial com o Maicon — a página não substitui essa conversa, ela prepara o terreno para que a reunião seja mais qualificada.




OBJETIVO DO MVP
Apresentar o programa, captar administradoras interessadas através de um formulário curto, qualificar o porte e o interesse de cada uma, armazenar esses dados de forma estruturada, e direcionar tudo para uma conversa de fechamento com o Maicon. Não é uma plataforma de cursos, não é um marketplace, não tem login público nem área logada para administradoras nesta versão. Este é um protótipo funcional interno, para demonstração, ainda não uma publicação definitiva.




CTA PRINCIPAL (usar este texto exato nos botões e títulos de chamada)
"Quero levar o Fórmula Síndico para minha administradora"




USUÁRIOS




Administradoras de condomínio (o público que preenche o formulário): gerentes gerais, diretores, donos, responsáveis pelo relacionamento com síndicos.

Maicon Guedes (quem recebe os leads qualificados e fecha as parcerias).

Equipe que opera o projeto (acessa os leads pelo painel interno protegido descrito abaixo).




PROPOSTA DE VALOR
Para a administradora: um curso gratuito, sem custo e sem contrapartida financeira, que capacita os síndicos, reduz risco jurídico e reputacional para eles, e fortalece o vínculo entre a administradora e sua base de síndicos.
Para o Maicon: geração de autoridade, relacionamento direto com administradoras e síndicos, e abertura de portas para outras oportunidades futuras.




PÁGINAS E SEÇÕES (uma única landing page com seções em âncora, sem múltiplas rotas nesta versão)




Hero — headline de impacto + subtítulo curto + CTA que rola até o formulário.

O que é o Fórmula Síndico — explicação curta do programa.

Sobre Maicon Guedes — bio curta: advogado, especialista e mestre em Direito, MBA em Gestão Estratégica e Inovação, professor de Direito e Gestão Condominial, palestrante em eventos condominiais, ex-síndico profissional com centenas de condomínios administrados, colunista de portais de gestão condominial.

Para quem é / benefícios para a administradora — retenção de síndicos, menos risco e demanda, fortalecimento do relacionamento, pipeline de novos síndicos alinhados.

Como funciona — dois eixos de conteúdo (riscos e responsabilidades do síndico; sindicatura profissional) e dois formatos: híbrido (abertura presencial de 3h30 com coffee break + duas aulas online de 6h, total 9h30) e online (três aulas ao vivo via Zoom, total 9h). Investimento da administradora: R$0. Turma mínima de 20 síndicos inscritos.

Perguntas frequentes — cobrir pelo menos: tem custo? quantos síndicos são necessários? quanto tempo dura? pode ser só online? quem ministra? com quanto tempo de antecedência preciso agendar?

Solicitar uma conversa — formulário de qualificação (ver campos abaixo).

Estado de confirmação — mensagem de recebimento, sem navegar para outra página.




JORNADA
A administradora chega à landing (por indicação, SDR, Instagram, evento ou busca), rola a página entendendo o programa nas seções acima, chega ao formulário já com contexto suficiente, envia seus dados, recebe confirmação imediata na tela, e a equipe do projeto entra em contato para agendar a conversa com o Maicon.




FORMULÁRIO DE QUALIFICAÇÃO
Campos obrigatórios: nome do responsável, nome da administradora, cidade e UF, WhatsApp, quantidade aproximada de condomínios administrados.
Campos opcionais: e-mail, cargo, quantidade aproximada de síndicos que a administradora poderia reunir, formato de preferência (presencial / híbrido / online), período desejado, observações.
Validação: campos obrigatórios não podem ficar vazios; WhatsApp e e-mail (quando preenchido) devem ter formato válido; mensagens de erro claras e específicas por campo, nunca genéricas.
Ao enviar com sucesso: salvar o registro no banco de dados com status inicial "novo_lead" e origem "landing", e mostrar a tela de confirmação.




MODELO DE DADOS (Supabase)
Criar uma tabela leads com as colunas: id (uuid, gerado automaticamente), created_at (timestamp automático), nome_responsavel (texto, obrigatório — nome de quem preencheu o formulário, do lado da administradora), administradora (texto, obrigatório), cidade (texto, obrigatório), uf (texto, obrigatório), whatsapp (texto, obrigatório), email (texto, opcional), cargo (texto, opcional), qtd_condominios (número, opcional), qtd_sindicos (número, opcional), formato_preferido (texto, opcional, um de: presencial / híbrido / online), periodo_desejado (texto, opcional), observacoes_lead (texto longo, opcional — preenchido pela administradora no formulário), origem (texto, default "landing"), status (texto, default "novo_lead"), responsavel_interno (texto, opcional — quem do time está tocando esse lead, editável só pelo painel), proximo_followup (data, opcional, editável só pelo painel), observacoes_internas (texto longo, opcional — anotações do time, editável só pelo painel).




FUNCIONALIDADES A CONSTRUIR AGORA




Landing responsiva com todas as seções acima.

Formulário funcional, validado, conectado à tabela leads no Supabase.

Tela/estado de confirmação após envio bem-sucedido.

Mensagens de erro amigáveis e específicas em caso de falha de envio ou validação.

SEO básico: title, meta description, tags Open Graph para compartilhamento.

Acessibilidade básica: labels em todos os campos, contraste adequado, navegação por teclado, foco visível.

Boas práticas de performance: imagens otimizadas, carregamento rápido, sem bibliotecas pesadas desnecessárias.

Painel interno mínimo, protegido por uma senha simples (não precisa ser um sistema de login completo), acessível em uma rota separada (ex: /painel), mostrando os leads da tabela leads em formato de lista/tabela, permitindo: visualizar todos os dados de cada lead, alterar o campo status, adicionar/editar uma observação em texto livre, definir um responsável, e registrar a data do próximo follow-up. Sem gráficos, sem métricas, sem dashboard analítico — só uma tabela funcional de edição.




ESTRUTURA PREPARADA PARA O FUTURO (não construir agora, só não impedir depois)




A coluna status já existe na tabela para suportar um pipeline mais completo no futuro (em análise, primeiro contato, reunião agendada, reunião realizada, proposta, curso confirmado, curso realizado, sem interesse, follow-up futuro).

A coluna origem já existe para diferenciar leads vindos da landing de leads gerados por prospecção ativa.

Estrutura de código organizada de forma que novas seções/páginas (outros cursos, palestras, mentorias, páginas por turma ou parceria específica) possam ser adicionadas sem refatorar o que já existe.




NÃO IMPLEMENTAR NESTA VERSÃO




Login público ou área logada para administradoras (o painel interno da equipe usa apenas senha simples, não um sistema de contas).

Dashboard analítico, gráficos ou métricas dentro do painel interno.

Agenda ou calendário de datas disponíveis.

Inscrição de síndicos, lista de presença, certificados, pesquisa de satisfação.

Múltiplos cursos, múltiplos especialistas ou qualquer estrutura de marketplace/white label.

Pagamento online de qualquer tipo.




DIREÇÃO VISUAL
Fundo escuro, sofisticado e profissional, com dourado ou tons quentes como cor de destaque — a mesma linguagem visual já usada na apresentação em PDF do Fórmula Síndico. Comunicação voltada ao mercado corporativo e condominial: autoridade sem parecer excessivamente luxuoso. Boa legibilidade, experiência moderna, foco em clareza e conversão. Use a apresentação em PDF como referência de conteúdo e tom, mas não replique o layout de slide — transforme em uma experiência web contínua, responsiva e navegável por rolagem, não em uma sequência de telas estáticas.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2c40a4f7-8d94-4a39-9758-9dda47b5286d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
