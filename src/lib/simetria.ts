/**
 * Quantos itens por linha para que as linhas fiquem equilibradas
 * (ex.: 22 letras com no máximo 7 por linha = 6, 6, 6, 4 em vez de 7, 7, 7, 1).
 */
export function porLinha(total: number, maximo: number): number {
  if (total <= maximo) return total;
  const linhas = Math.ceil(total / maximo);
  return Math.ceil(total / linhas);
}

/** Variáveis CSS para a classe .letras (celular, tablet e computador) */
export function estiloLetras(total: number, maxComputador = 18): string {
  return `--l1:${porLinha(total, 7)};--l2:${porLinha(total, 12)};--l3:${porLinha(total, maxComputador)}`;
}

/** Maior número de colunas (até o máximo) que divide os itens sem sobrar linha incompleta */
export function colunasExatas(total: number, maximo: number): number {
  for (let c = Math.min(total, maximo); c > 1; c--) if (total % c === 0) return c;
  return total <= maximo ? total : 1;
}

/** Variáveis CSS para a classe .grade-n (celular e tablet em diante) */
export function estiloGrade(total: number, maxCelular = 2, maxTablet = 4): string {
  return `--c1:${colunasExatas(total, maxCelular)};--c2:${colunasExatas(total, maxTablet)}`;
}
