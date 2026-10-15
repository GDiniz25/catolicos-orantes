/**
 * Imagem para compartilhar as páginas diárias (prévia do WhatsApp e redes):
 * a pintura do evangelista do dia, tirada dos artigos do site. Sem ela, fica a imagem padrão.
 */
import { getAllArticles } from '@/lib/data';

const ARTIGO_DO_EVANGELISTA: Record<string, string> = {
  Mt: 'santos-e-oracoes/sao-mateus-de-cobrador-de-impostos-a-evangelista',
  Mc: 'santos-e-oracoes/sao-marcos-evangelista-vida-e-legado',
  Lc: 'santos-e-oracoes/sao-lucas-evangelista-medico-escritor',
  Jo: 'santos-e-oracoes/sao-joao-evangelista-o-discipulo-amado',
};

export async function imagemDoEvangelista(referencia: string | null | undefined): Promise<string | null> {
  const chave = ARTIGO_DO_EVANGELISTA[(referencia || '').trim().slice(0, 2)];
  if (!chave) return null;
  const artigo = (await getAllArticles()).find((a) => `${a.category}/${a.slug}` === chave);
  return artigo?.image_url || null;
}
