import { useEffect, useMemo, useState } from "react";
import { PLANOS } from "@/data/biblia";
import { EVENTO, gravar, ler } from "@/lib/progresso";

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const hoje = () => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(new Date());
const parse = (s: string) => { const [y, m, d] = s.split("-").map(Number); return new Date(Date.UTC(y, m - 1, d)); };
const add = (d: Date, n: number) => new Date(d.getTime() + n * 86400000);
const curta = (d: Date) => `${d.getUTCDate()} ${MESES[d.getUTCMonth()]}`;
const KEY = "co-leitura-biblia-v1";
type Estado = { plano: string; inicio: string; feitos: number[] };

export default function PlanoLeitura() {
  const [e, setE] = useState<Estado>({ plano: PLANOS[0].id, inicio: "2000-01-01", feitos: [] });
  const [h, setH] = useState("2000-01-01");
  const [bloco, setBloco] = useState(0);
  useEffect(() => {
    const t = hoje(); setH(t);
    const carregar = () => { const s = ler<Estado | null>(KEY, null); setE(s && s.plano ? s : { plano: PLANOS[0].id, inicio: t, feitos: [] }); };
    carregar();
    addEventListener(EVENTO, carregar);
    return () => removeEventListener(EVENTO, carregar);
  }, []);
  const salvar = (n: Estado) => { setE(n); gravar(KEY, n); };
  const plano = PLANOS.find((p) => p.id === e.plano) ?? PLANOS[0];
  const leituras = useMemo(() => plano.leituras(), [plano.id]);
  const diaHoje = Math.floor((parse(h).getTime() - parse(e.inicio).getTime()) / 86400000) + 1;
  const proximo = leituras.findIndex((_, i) => !e.feitos.includes(i + 1)) + 1;
  // Períodos: até 90 dias, blocos de 30; acima disso, 12 blocos (um por mês, em média). Sempre um número que divide bem a grade.
  const blocos = leituras.length <= 90 ? Math.ceil(leituras.length / 30) : 12;
  const tam = Math.ceil(leituras.length / blocos);
  useEffect(() => { setBloco(Math.max(0, Math.floor(((proximo || 1) - 1) / tam))); }, [plano.id, e.inicio]);
  const marcar = (n: number) => salvar({ ...e, feitos: e.feitos.includes(n) ? e.feitos.filter((x) => x !== n) : [...e.feitos, n] });
  const pct = Math.round((e.feitos.length / leituras.length) * 100);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 rounded-2xl border border-co-warm-sand-dark bg-white p-5 md:grid-cols-2 md:p-8">
        <label className="flex min-w-0 flex-col gap-1.5 text-sm font-semibold">Plano
          <select value={e.plano} onChange={(ev) => salvar({ plano: ev.target.value, inicio: h, feitos: [] })} className="h-12 w-full min-w-0 rounded-md border border-co-warm-sand-dark bg-white px-3 text-[16px] font-normal">
            {PLANOS.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
          </select>
          <span className="font-normal text-co-warm-brown/80">{plano.descricao}</span>
        </label>
        <label className="flex min-w-0 flex-col gap-1.5 text-sm font-semibold">Comecei em
          <input type="date" value={e.inicio} onChange={(ev) => ev.target.value && salvar({ ...e, inicio: ev.target.value })} className="h-12 w-full min-w-0 rounded-md border border-co-warm-sand-dark bg-white px-3 text-[16px] font-normal" />
        </label>
        <div className="md:col-span-2">
          <div className="flex justify-between text-[15px]"><span>{e.feitos.length} de {leituras.length} dias lidos</span><span>{pct}%</span></div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-co-warm-cream"><div className="h-full rounded-full bg-[#36613F]" style={{ width: `${pct}%` }} /></div>
        </div>
      </div>

      {proximo > 0 && (
        <div className="rounded-2xl border-2 border-co-warm-terracotta bg-white p-5 md:p-8">
          <p className="text-sm font-semibold text-co-warm-terracotta">Próxima leitura: dia {proximo}{diaHoje === proximo ? " (hoje)" : diaHoje > proximo ? ` (você está ${diaHoje - proximo} ${diaHoje - proximo === 1 ? "dia" : "dias"} atrasado, sem problema)` : ""}</p>
          <p className="mt-2 font-display text-2xl font-semibold leading-snug md:text-3xl">{leituras[proximo - 1].split(" | ").join(" e ")}</p>
          <button type="button" onClick={() => marcar(proximo)} className="mt-5 min-h-[3rem] rounded-md bg-[#36613F] px-6 font-semibold text-white">Marcar como lido</button>
        </div>
      )}
      {proximo === 0 && <p className="rounded-xl bg-[#E4EEE6] p-5 font-semibold text-[#36613F]">Plano concluído. Que a Palavra continue a iluminar seus dias.</p>}

      <section aria-labelledby="calendario-leitura" className="rounded-2xl border border-co-warm-sand-dark bg-white p-5 md:p-8">
        <h2 id="calendario-leitura" className="font-display text-2xl font-semibold">Todos os dias do plano</h2>
        {blocos > 1 && (
          <div className={`mt-4 grid gap-1.5 ${blocos === 12 ? "grid-cols-3 sm:grid-cols-4 lg:grid-cols-6" : "grid-cols-3"}`} role="group" aria-label="Período">
            {Array.from({ length: blocos }, (_, b) => (
              <button key={b} type="button" aria-pressed={b === bloco} onClick={() => setBloco(b)} className={`h-10 w-full rounded-md border px-2 text-sm font-semibold ${b === bloco ? "border-co-warm-brown bg-co-warm-brown text-white" : "border-co-warm-sand-dark bg-white"}`}>
                {b * tam + 1} a {Math.min(leituras.length, (b + 1) * tam)}
              </button>
            ))}
          </div>
        )}
        <ol className="mt-4 divide-y divide-co-warm-sand-dark">
          {leituras.slice(bloco * tam, bloco * tam + tam).map((l, k) => {
            const n = bloco * tam + k + 1;
            const ok = e.feitos.includes(n);
            return (
              <li key={n}>
                <label className="flex cursor-pointer items-start gap-3 py-3">
                  <input type="checkbox" checked={ok} onChange={() => marcar(n)} className="mt-1 h-5 w-5 accent-[#36613F]" />
                  <span className="min-w-0 flex-1">
                    <span className="text-sm text-co-warm-brown/75">Dia {n}, {curta(add(parse(e.inicio), n - 1))}{n === diaHoje ? " (hoje)" : ""}</span>
                    <span className={`block text-[16px] ${ok ? "text-co-warm-brown/75 line-through" : ""}`}>{l.split(" | ").join(" e ")}</span>
                  </span>
                </label>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
