import artigos from '@/data/artigosProntos.json';
import novosArtigos from '@/data/artigosProntosLote2.json';
import lote3 from '@/data/artigosProntosLote3.json';
import padrinhos from '@/assets/artigos/padrinhos-batismo.jpg?url';
import documentos from '@/assets/artigos/documentos-batismo.jpg?url';
import simbolos from '@/assets/artigos/simbolos-batismo.jpg?url';
import adultos from '@/assets/artigos/batismo-adultos.jpg?url';
import curso from '@/assets/artigos/curso-batismo.jpg?url';
import { uploadImageFromUrl } from './storage';

const covers = [
  { url: padrinhos, alt: 'Pia batismal diante dos bancos e do crucifixo de uma igreja' },
  { url: documentos, alt: 'Pasta, folhas e caneta sobre mesa com crucifixo na secretaria paroquial' },
  { url: simbolos, alt: 'Água na pia batismal, vela branca, óleo e tecido branco' },
  { url: adultos, alt: 'Pia batismal próxima à entrada de uma igreja com crucifixo' },
  { url: curso, alt: 'Caderno, livro e crucifixo em sala de preparação para o batismo' },
];

export const firstBatch = artigos.map((article, index) => ({
  ...article,
  image_url: covers[index]?.url ?? '',
  image_alt: covers[index]?.alt ?? article.image_alt,
}));

export const readyArticles = [...firstBatch, ...[...novosArtigos, ...lote3].map((article) => ({ ...article, image_url: '', image_alt: '' }))];

export async function persistReadyCover(article: typeof readyArticles[number]) {
  if (!article.image_url) return '';
  const imageUrl = await uploadImageFromUrl(article.image_url, `${article.slug}/capa-pronta`);
  if (!imageUrl) throw new Error(`Não foi possível salvar a imagem de “${article.title}”. Tente novamente.`);
  return imageUrl;
}