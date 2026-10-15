import type { APIRoute } from 'astro';
import { getLiturgia, getSaintsByDate } from '@/lib/data';
import { extractLeituras } from '@/lib/liturgy';
import { CORES, corDaLiturgia, celebracaoDaLiturgia, infoDoDia } from '@/lib/anoLiturgico';
import { getShortName } from '@/lib/saints';
import { getTodayStr } from '@/lib/dateUtils';
import { referenciaDoEvangelho, dataComSemana } from '@/lib/hoje';
import { absUrl } from '@/lib/seo';

/**
 * Dados do quadro "Liturgia de hoje" que paróquias e blogs colam no próprio site (public/widget/liturgia.js).
 * Gerado no build diário (00:05). Só referências: o texto das leituras fica na página /liturgia-diaria.
 * O .htaccess libera este arquivo para outros sites (Access-Control-Allow-Origin: *) com cache curto.
 */
export const GET: APIRoute = async () => {
  const today = getTodayStr();
  const [, month, day] = today.split('-').map(Number);
  const raw = await getLiturgia(today);
  const info = infoDoDia(today);
  const cor = CORES[corDaLiturgia(raw) ?? info.tempo.cor];
  const leituras = raw ? extractLeituras(raw.leituras) : [];
  const santo = (await getSaintsByDate(month, day))[0];

  const data = {
    data: today,
    dataExtenso: dataComSemana(today),
    celebracao: celebracaoDaLiturgia(raw) ?? info.rotulo,
    cor: { nome: cor.nome, hex: cor.forte },
    leituras,
    evangelho: referenciaDoEvangelho(leituras),
    santo: santo ? { nome: getShortName(santo.saint_name), url: absUrl(`/santos/${santo.slug}`) } : null,
    url: absUrl('/liturgia-diaria'),
  };
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
