// Conteúdo estático renderizado no build (sem JavaScript no navegador)
export default function TermosContent() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
          <article className="rounded-md border border-co-warm-sand-dark bg-co-warm-cream p-6 md:p-10 space-y-6">
            <p className="text-sm text-co-warm-brown/75">Última atualização: 9 de março de 2026</p>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-bold text-co-warm-brown">1. Aceitação dos Termos</h2>
              <p className="text-co-warm-brown/80 leading-relaxed">
                Ao acessar e utilizar o site Católicos Orantes (catolicosorantes.com.br), você concorda com estes Termos de Uso. Caso não concorde com qualquer parte, recomendamos que não utilize o site.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-bold text-co-warm-brown">2. Descrição do Serviço</h2>
              <p className="text-co-warm-brown/80 leading-relaxed">
                O Católicos Orantes é um portal de conteúdo católico que oferece reflexões, orações, liturgia diária, vidas de santos, artigos formativos e outros recursos para a vida espiritual. O site é de acesso gratuito e não possui fins lucrativos diretos.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-bold text-co-warm-brown">3. Conteúdo do Site</h2>
              <p className="text-co-warm-brown/80 leading-relaxed">
                Parte do conteúdo publicado é gerado com auxílio de inteligência artificial e revisado por nossa equipe. Embora nos esforcemos para manter a fidelidade ao Magistério da Igreja Católica, podem ocorrer imprecisões. Encorajamos os usuários a consultar fontes oficiais da Igreja e a nos informar sobre possíveis erros pela página de <a href="/sugestoes" className="text-co-warm-terracotta hover:underline">Sugestões e Correções</a>.
              </p>
              <p className="text-co-warm-brown/80 leading-relaxed">
                A liturgia diária é obtida de fontes da Conferência Nacional dos Bispos do Brasil (CNBB), com os devidos créditos.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-bold text-co-warm-brown">4. Uso Permitido</h2>
              <p className="text-co-warm-brown/80 leading-relaxed">
                Você pode utilizar o conteúdo do site para fins pessoais, educacionais e pastorais. É permitido compartilhar links do site. A reprodução integral de artigos em outros sites requer autorização prévia.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-bold text-co-warm-brown">5. Pedidos de Oração e Sugestões</h2>
              <p className="text-co-warm-brown/80 leading-relaxed">
                Ao enviar pedidos de oração ou sugestões, você declara que as informações fornecidas são verdadeiras. Os pedidos de oração são tratados com respeito e confidencialidade por nossa equipe. Não publicamos pedidos de oração sem consentimento.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-bold text-co-warm-brown">6. Propriedade Intelectual</h2>
              <p className="text-co-warm-brown/80 leading-relaxed">
                O design, logotipo e conteúdos originais do Católicos Orantes são de propriedade do projeto. Orações tradicionais, textos litúrgicos e citações bíblicas pertencem a seus respectivos detentores de direitos.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-bold text-co-warm-brown">7. Isenção de Responsabilidade</h2>
              <p className="text-co-warm-brown/80 leading-relaxed">
                O conteúdo do site é oferecido "como está" e não substitui orientação espiritual, pastoral ou teológica presencial. O Católicos Orantes não se responsabiliza por decisões tomadas com base exclusiva no conteúdo do site.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-bold text-co-warm-brown">8. Alterações nos Termos</h2>
              <p className="text-co-warm-brown/80 leading-relaxed">
                Reservamo-nos o direito de atualizar estes termos a qualquer momento. A data de atualização será sempre indicada no topo desta página.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl font-bold text-co-warm-brown">9. Contato</h2>
              <p className="text-co-warm-brown/80 leading-relaxed">
                Em caso de dúvidas sobre estes termos, entre em contato pela página de <a href="/sugestoes" className="text-co-warm-terracotta hover:underline">Sugestões e Correções</a>.
              </p>
            </section>
          </article>
        </div>
  );
}
