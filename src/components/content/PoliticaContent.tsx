// Conteúdo estático renderizado no build (sem JavaScript no navegador)
export default function PoliticaContent() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
          <article className="rounded-md border border-co-warm-sand-dark bg-co-warm-cream p-6 md:p-10 space-y-6">
            <p className="text-sm text-co-warm-brown/75">Última atualização: 11 de outubro de 2026</p>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-bold text-co-warm-brown">1. Introdução</h2>
              <p className="text-co-warm-brown/80 leading-relaxed">
                O Católicos Orantes (catolicosorantes.com.br) respeita a privacidade dos seus usuários. Esta política descreve como coletamos, usamos e protegemos as informações fornecidas ao utilizar nosso site, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-bold text-co-warm-brown">2. Dados Coletados</h2>
              <p className="text-co-warm-brown/80 leading-relaxed">Coletamos apenas os dados que você nos fornece voluntariamente:</p>
              <ul className="list-disc pl-6 space-y-1 text-co-warm-brown/80">
                <li><strong>Pedidos de Oração:</strong> nome, e-mail (opcional), WhatsApp (opcional) e o texto do pedido.</li>
                <li><strong>Sugestões e Correções:</strong> nome, e-mail (opcional), WhatsApp (opcional), categoria, conteúdo relacionado e mensagem.</li>
                <li><strong>Conta do site (opcional):</strong> e-mail usado para entrar e o seu progresso: no Caminho da Fé (nivelamento, lições concluídas, pontos e dias seguidos), no plano de leitura da Bíblia, na consagração a Nossa Senhora, nas novenas, as anotações da Lectio Divina, o resultado dos testes de santo de devoção e de temperamento e a lista de artigos lidos. Quem usa sem conta tem o progresso salvo só no próprio navegador. O exame de consciência nunca é salvo, com ou sem conta.</li>
              </ul>
              <p className="text-co-warm-brown/80 leading-relaxed">
                Usamos o Google Analytics para estatísticas agregadas de visitas (páginas mais lidas, origem do acesso), o que envolve cookies do Google. Esses dados não identificam você pessoalmente para nós.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-bold text-co-warm-brown">3. Finalidade dos Dados</h2>
              <p className="text-co-warm-brown/80 leading-relaxed">Os dados fornecidos são utilizados exclusivamente para:</p>
              <ul className="list-disc pl-6 space-y-1 text-co-warm-brown/80">
                <li>Receber e tratar pedidos de oração com respeito e confidencialidade.</li>
                <li>Receber sugestões, correções e solicitações para melhoria do conteúdo.</li>
                <li>Eventualmente entrar em contato para esclarecimentos, se o usuário fornecer dados de contato.</li>
                <li>Guardar o seu progresso e permitir continuar em outro aparelho. Você pode apagar todo o progresso salvo na conta a qualquer momento na página <a href="/minha-conta" className="underline">Minha conta</a> e pedir a exclusão da conta pela página de Sugestões.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-bold text-co-warm-brown">4. Compartilhamento de Dados</h2>
              <p className="text-co-warm-brown/80 leading-relaxed">
                Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros. Os dados são acessados apenas pela equipe responsável pelo Católicos Orantes.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-bold text-co-warm-brown">5. Armazenamento e Segurança</h2>
              <p className="text-co-warm-brown/80 leading-relaxed">
                Os dados são armazenados em servidores seguros fornecidos por Supabase (infraestrutura em nuvem). Adotamos medidas técnicas razoáveis para proteger suas informações contra acesso não autorizado.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-bold text-co-warm-brown">6. Seus Direitos (LGPD)</h2>
              <p className="text-co-warm-brown/80 leading-relaxed">Você tem direito a:</p>
              <ul className="list-disc pl-6 space-y-1 text-co-warm-brown/80">
                <li>Saber quais dados pessoais possuímos sobre você.</li>
                <li>Solicitar a correção de dados incorretos.</li>
                <li>Solicitar a exclusão dos seus dados pessoais.</li>
                <li>Revogar o consentimento dado anteriormente.</li>
              </ul>
              <p className="text-co-warm-brown/80 leading-relaxed">
                Para exercer esses direitos, entre em contato pela página de <a href="/sugestoes" className="text-co-warm-terracotta hover:underline">Sugestões e Correções</a>.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-bold text-co-warm-brown">7. Menores de Idade</h2>
              <p className="text-co-warm-brown/80 leading-relaxed">
                O site é voltado para público geral. Menores de 18 anos devem utilizar o site com supervisão de um responsável. Não coletamos intencionalmente dados de menores de 13 anos.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-bold text-co-warm-brown">8. Alterações nesta Política</h2>
              <p className="text-co-warm-brown/80 leading-relaxed">
                Esta política pode ser atualizada periodicamente. A data da última atualização será sempre indicada no topo desta página.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-bold text-co-warm-brown">9. Contato</h2>
              <p className="text-co-warm-brown/80 leading-relaxed">
                Para dúvidas sobre esta política ou sobre o tratamento dos seus dados, entre em contato pela página de <a href="/sugestoes" className="text-co-warm-terracotta hover:underline">Sugestões e Correções</a>.
              </p>
            </section>
          </article>
        </div>
  );
}
