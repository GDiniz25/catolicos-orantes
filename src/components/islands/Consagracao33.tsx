import { useEffect, useMemo, useState } from "react";
import dados from "@/data/conteudo/consagracao.json";
import { EVENTO, gravar, ler } from "@/lib/progresso";

type Dia = { dia: number; tema: string; leitura?: string; meditacao: string; proposito: string };
type Etapa = { id: string; nome: string; dias: number[]; oracoes: string[]; texto: string };
const FESTAS = [
  { nome: "Imaculada Conceição", mes: 12, dia: 8 },
  { nome: "Santa Maria, Mãe de Deus", mes: 1, dia: 1 },
  { nome: "Apresentação do Senhor", mes: 2, dia: 2 },
  { nome: "Anunciação do Senhor", mes: 3, dia: 25 },
  { nome: "Nossa Senhora de Fátima", mes: 5, dia: 13 },
  { nome: "Visitação de Nossa Senhora", mes: 5, dia: 31 },
  { nome: "Nossa Senhora do Carmo", mes: 7, dia: 16 },
  { nome: "Assunção de Nossa Senhora", mes: 8, dia: 15 },
  { nome: "Nossa Senhora Rainha", mes: 8, dia: 22 },
  { nome: "Natividade de Nossa Senhora", mes: 9, dia: 8 },
  { nome: "Nossa Senhora Aparecida", mes: 10, dia: 12 },
  { nome: "Apresentação de Nossa Senhora", mes: 11, dia: 21 },
];
const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
const hoje = () => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(new Date());
const parse = (s: string) => { const [y, m, d] = s.split("-").map(Number); return new Date(Date.UTC(y, m - 1, d)); };
const iso = (d: Date) => d.toISOString().slice(0, 10);
const add = (d: Date, n: number) => new Date(d.getTime() + n * 86400000);
const ext = (s: string) => { const d = parse(s); return `${d.getUTCDate() === 1 ? "1º" : d.getUTCDate()} de ${MESES[d.getUTCMonth()]}`; };
const KEY = "co-consagracao-v1";

export default function Consagracao33() {
  const dias = dados.dias as Dia[];
  const etapas = dados.etapas as Etapa[];
  const [festa, setFesta] = useState(0);
  const [feitos, setFeitos] = useState<number[]>([]);
  const [aberto, setAberto] = useState<number | null>(1);
  const [h, setH] = useState("2000-01-01");

  useEffect(() => {
    setH(hoje());
    const carregar = () => { const s = ler<{ festa?: number; feitos?: number[] } | null>(KEY, null); if (s) { setFesta(s.festa ?? 0); setFeitos(s.feitos ?? []); } };
    carregar();
    addEventListener(EVENTO, carregar);
    return () => removeEventListener(EVENTO, carregar);
  }, []);
  const salvar = (f: number, ft: number[]) => gravar(KEY, { festa: f, feitos: ft });

  const { consagracao, inicio } = useMemo(() => {
    const y = Number(h.slice(0, 4));
    const f = FESTAS[festa];
    let c = iso(new Date(Date.UTC(y, f.mes - 1, f.dia)));
    if (iso(add(parse(c), -33)) < h && c < h) c = iso(new Date(Date.UTC(y + 1, f.mes - 1, f.dia)));
    if (c < h) c = iso(new Date(Date.UTC(y + 1, f.mes - 1, f.dia)));
    return { consagracao: c, inicio: iso(add(parse(c), -33)) };
  }, [festa, h]);
  const diaHoje = Math.floor((parse(h).getTime() - parse(inicio).getTime()) / 86400000) + 1;

  useEffect(() => { if (diaHoje >= 1 && diaHoje <= 33) setAberto(diaHoje); }, [diaHoje]);

  const marcar = (n: number) => {
    const v = feitos.includes(n) ? feitos.filter((x) => x !== n) : [...feitos, n];
    setFeitos(v); salvar(festa, v);
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 rounded-2xl border border-co-warm-sand-dark bg-white p-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:p-8">
        <label className="flex min-w-0 flex-col gap-1.5 text-sm font-semibold">Em que festa você quer se consagrar?
          <select value={festa} onChange={(e) => { const f = Number(e.target.value); setFesta(f); salvar(f, feitos); }} className="h-12 w-full min-w-0 rounded-md border border-co-warm-sand-dark bg-white px-3 text-[16px] font-normal">
            {FESTAS.map((f, i) => <option key={f.nome} value={i}>{f.nome} ({f.dia === 1 ? "1º" : f.dia} de {MESES[f.mes - 1]})</option>)}
          </select>
        </label>
        <div className="rounded-xl bg-[#E2EBF4] p-4 text-[#1F3E5A]">
          <p className="text-[15px]">Comece a preparação em</p>
          <p className="font-display text-2xl font-semibold">{ext(inicio)}</p>
          <p className="mt-1 text-[15px]">Consagração: <strong>{ext(consagracao)} de {consagracao.slice(0, 4)}</strong></p>
        </div>
        <div className="md:col-span-2">
          <div className="flex justify-between text-[15px]"><span>{diaHoje >= 1 && diaHoje <= 33 ? `Hoje é o ${diaHoje}º dia da preparação.` : diaHoje < 1 ? `Faltam ${1 - diaHoje} dias para começar.` : "Período concluído."}</span><span>{feitos.length} de 33 dias feitos</span></div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-co-warm-cream"><div className="h-full rounded-full bg-[#2C5679]" style={{ width: `${(feitos.length / 33) * 100}%` }} /></div>
        </div>
      </div>

      {etapas.map((et) => (
        <section key={et.id} aria-labelledby={`et-${et.id}`} className="space-y-3">
          <div className="rounded-2xl bg-[#E2EBF4] p-5 md:p-7">
            <p className="text-sm font-semibold text-[#2C5679]">Dias {et.dias[0]} a {et.dias[1]}</p>
            <h2 id={`et-${et.id}`} className="mt-1 font-display text-2xl font-semibold">{et.nome}</h2>
            <div className="intro-prose mt-3 text-[16px]" dangerouslySetInnerHTML={{ __html: et.texto }} />
            <p className="mt-3 text-[15px]"><strong>Orações de cada dia:</strong> {et.oracoes.join(", ")}.</p>
          </div>
          <ol className="space-y-2">
            {dias.filter((d) => d.dia >= et.dias[0] && d.dia <= et.dias[1]).map((d) => {
              const data = iso(add(parse(inicio), d.dia - 1));
              const ok = feitos.includes(d.dia);
              const ab = aberto === d.dia;
              return (
                <li key={d.dia} className={`overflow-hidden rounded-xl border bg-white ${d.dia === diaHoje ? "border-[#2C5679]" : "border-co-warm-sand-dark"}`}>
                  <button type="button" aria-expanded={ab} onClick={() => setAberto(ab ? null : d.dia)} className="flex w-full items-center gap-4 p-4 text-left">
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-semibold ${ok ? "bg-[#36613F] text-white" : "bg-co-warm-cream"}`}>{ok ? "✓" : d.dia}</span>
                    <span className="min-w-0 flex-1"><span className="block font-semibold">{d.tema}</span><span className="text-sm text-co-warm-brown/75">{ext(data)}{d.dia === diaHoje ? " (hoje)" : ""}</span></span>
                  </button>
                  {ab && (
                    <div className="space-y-3 border-t border-co-warm-sand-dark p-5">
                      {d.leitura && <p className="text-sm font-semibold text-[#2C5679]">Leitura: {d.leitura}</p>}
                      <div className="intro-prose text-[17px]" dangerouslySetInnerHTML={{ __html: d.meditacao }} />
                      <p className="rounded-lg bg-co-warm-cream px-4 py-3 text-[15px]"><strong>Propósito:</strong> {d.proposito}</p>
                      <button type="button" onClick={() => marcar(d.dia)} className={`min-h-[2.75rem] rounded-md px-5 font-semibold ${ok ? "border-2 border-co-warm-sand-dark bg-white" : "bg-[#36613F] text-white"}`}>{ok ? "Desmarcar" : "Marcar este dia como feito"}</button>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      ))}

      <section className="rounded-2xl border-2 border-[#D9BE78] bg-[#F7F0DC] p-5 md:p-8" aria-labelledby="dia-consagracao">
        <p className="text-sm font-semibold text-[#7A5820]">{ext(consagracao)}</p>
        <h2 id="dia-consagracao" className="mt-1 font-display text-2xl font-semibold">O dia da consagração</h2>
        <div className="intro-prose mt-3 text-[17px]" dangerouslySetInnerHTML={{ __html: (dados.dia_consagracao as { texto: string }).texto }} />
      </section>
      <div className="text-[14px] text-co-warm-brown/80" dangerouslySetInnerHTML={{ __html: dados.aviso as string }} />
    </div>
  );
}
