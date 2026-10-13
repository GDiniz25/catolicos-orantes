/**
 * Utilitários de data centralizados
 * Usa UTC-3 (horário de Brasília) como padrão
 */

export const WEEKDAYS_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
export const WEEKDAYS_FULL = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
export const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
export const MONTHS_LOWER = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

const BRASILIA_FMT = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Sao_Paulo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Retorna string YYYY-MM-DD de uma data usando os componentes locais
 * (sem conversão para UTC, que trocava o dia depois das 21h no Brasil).
 */
export const getDateStr = (date: Date = getBrasiliaDate()): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

/**
 * Data de hoje (YYYY-MM-DD) no horário de Brasília, em qualquer fuso
 * (servidor de build em UTC ou visitante em outro país).
 */
export const getTodayStr = (): string => BRASILIA_FMT.format(new Date());

/**
 * Retorna uma Date (meia-noite local) correspondente ao dia de hoje em Brasília.
 * Use getDate()/getMonth()/getFullYear() normalmente.
 */
export const getBrasiliaDate = (): Date => {
  const [y, m, d] = getTodayStr().split('-').map(Number);
  return new Date(y, m - 1, d);
};

/**
 * Cria uma Date a partir de string YYYY-MM-DD (sem problemas de timezone)
 */
export const parseDate = (dateStr: string): Date => {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
};

/**
 * Adiciona/subtrai dias de uma data string, retorna nova string
 */
export const offsetDate = (dateStr: string, offset: number): string => {
  const d = new Date(dateStr + 'T12:00:00');
  d.setDate(d.getDate() + offset);
  return getDateStr(d);
};

/**
 * Formata data como "Segunda-feira, 9 de Março de 2026"
 */
export const formatDateFull = (dateStr: string): string => {
  const date = parseDate(dateStr);
  const [, m, d] = dateStr.split('-').map(Number);
  return `${WEEKDAYS_FULL[date.getDay()]}, ${d} de ${MONTHS[m - 1]} de ${date.getFullYear()}`;
};

/**
 * Formata data como "9 de março de 2026"
 */
export const formatDateSimple = (dateStr: string): string => {
  const [y, m, d] = dateStr.split('-').map(Number);
  return `${d} de ${MONTHS_LOWER[m - 1]} de ${y}`;
};

/**
 * Formata data curta para picker { weekday: 'Seg', day: 9 }
 */
export const formatShortDate = (dateStr: string): { weekday: string; day: number } => {
  const date = parseDate(dateStr);
  const [, , d] = dateStr.split('-').map(Number);
  return { weekday: WEEKDAYS_SHORT[date.getDay()], day: d };
};

/**
 * Retorna o dia do ano (1-366)
 */
export const getDayOfYear = (date: Date): number => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24)) - 1;
};

const semAcento = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');

/** "12-de-outubro" (usado nas páginas fixas do santo do dia) */
export const diaMesSlug = (month: number, day: number) => `${day}-de-${semAcento(MONTHS_LOWER[month - 1])}`;

/** "12 de outubro" */
export const diaMesTexto = (month: number, day: number) => `${day} de ${MONTHS_LOWER[month - 1]}`;

/** Os 366 dias do ano (inclui 29 de fevereiro), em ordem */
export const todosOsDias = (): { month: number; day: number }[] => {
  const dias = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const out: { month: number; day: number }[] = [];
  dias.forEach((n, i) => {
    for (let d = 1; d <= n; d++) out.push({ month: i + 1, day: d });
  });
  return out;
};

/** "12-de-outubro-de-2026" a partir de "2026-10-12" (páginas da liturgia por data) */
export const dataSlug = (dateStr: string) => {
  const [y, m, d] = dateStr.split('-').map(Number);
  return `${d}-de-${semAcento(MONTHS_LOWER[m - 1])}-de-${y}`;
};
