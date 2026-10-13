/** Keep editorial text and links, removing only inline media and its old credit. */
export function stripArticleMedia(content: string): string {
  return content
    .replace(/<figure\b[^>]*>[\s\S]*?<\/figure>/gi, '')
    .replace(/<img\b[^>]*>/gi, '')
    .replace(/<figcaption\b[^>]*>[\s\S]*?<\/figcaption>/gi, '')
    .replace(/<p>\s*<small>Imagem ilustrativa gerada por inteligência artificial; não retrata uma celebração ou paróquia real\.<\/small>\s*<\/p>/gi, '');
}