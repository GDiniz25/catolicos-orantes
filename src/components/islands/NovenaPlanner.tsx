import { useEffect, useMemo, useState } from "react";
import { EVENTO, gravar, ler } from "@/lib/progresso";
import { NOVENAS, type NovenaPlano } from "@/data/novenasPlanner";
import { pascoa } from "@/lib/anoLiturgico";

const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
const SEM = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
const hoje = () => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(new Date());
const parse = (s: string) => { const [y, m, d] = s.split("-").map(Number); return new Date(Date.UTC(y, m - 1, d)); };
const iso = (d: Date) => d.toISOString().slice(0, 10);
const add = (d: Date, n: number) => new Date(d.getTime() + n * 86400000);
const ext = (s: string, ano = false) => { const d = parse(s); return `${SEM[d.getUTCDay()]}, ${d.getUTCDate()} de ${MESES[d.getUTCMonth()]}${ano ? ` de ${d.getUTCFullYear()}` : ""}`; };

function festaNoAno(n: NovenaPlano, y: number): string | null {
  if (n.festa.tipo === "fixa") return iso(new Date(Date.UTC(y, n.festa.mes - 1, n.festa.dia)));
  if (n.festa.tipo === "pascoa") return iso(add(pascoa(y), n.festa.dias));
  if (n.festa.tipo === "cristoRei") {
    // último domingo do Tempo Comum: o domingo antes do 1º Domingo do Advento (4 domingos antes do Natal)
    const natal = new Date(Date.UTC(y, 11, 25));
    const domingoAntesDoNatal = add(natal, -(natal.getUTCDay() || 7));
    return iso(add(domingoAntesDoNatal, -28));
  }
  return null;
}
/** Próxima festa a partir de hoje (este ano ou o próximo) */
function proximaFesta(n: NovenaPlano): string | null {
  const h = hoje();
  const y = Number(h.slice(0, 4));
  const f = festaNoAno(n, y);
  if (!f) return null;
  return f > h ? f : festaNoAno(n, y + 1);
}

const btn = "btn";

export default function NovenaPlanner() {
  const [id, setId] = useState(NOVENAS[0].id);
  const [inicioLivre, setInicioLivre] = useState(hoje());
  const [hora, setHora] = useState("20:00");
  const [feitos, setFeitos] = useState<boolean[]>(Array(9).fill(false));
  const n = NOVENAS.find((x) => x.id === id)!;
  const festa = useMemo(() => proximaFesta(n), [id]);
  const inicio = festa ? iso(add(parse(festa), -9)) : inicioLivre;
  const dias = Array.from({ length: 9 }, (_, i) => iso(add(parse(inicio), i)));
  const chave = `co-novena-${id}-${inicio}`;

  useEffect(() => {
    const carregar = () => { const v = ler<unknown>(chave, null); setFeitos(Array.isArray(v) ? v : Array(9).fill(false)); };
    carregar();
    addEventListener(EVENTO, carregar);
    return () => removeEventListener(EVENTO, carregar);
  }, [chave]);
  const marcar = (i: number) => {
    const v = feitos.map((x, k) => (k === i ? !x : x));
    setFeitos(v);
    gravar(chave, v);
  };

  const baixarIcs = () => {
    const [hh, mm] = hora.split(":");
    const pad = (s: string) => s.replace(/-/g, "");
    const url = `https://catolicosorantes.com.br${n.artigo}`;
    const eventos = dias.map((d, i) => [
      "BEGIN:VEVENT",
      `UID:novena-${id}-${d}@catolicosorantes.com.br`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`,
      `DTSTART:${pad(d)}T${hh}${mm}00`,
      "DURATION:PT15M",
      `SUMMARY:${n.nome}: ${i + 1}º dia`,
      `DESCRIPTION:Rezar o ${i + 1}º dia da ${n.nome}. ${url}`,
      `URL:${url}`,
      "BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${n.nome}`, "TRIGGER:PT0M", "END:VALARM",
      "END:VEVENT",
    ].join("\r\n"));
    const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Catolicos Orantes//Novena//PT", "CALSCALE:GREGORIAN", ...eventos, "END:VCALENDAR"].join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = `${id}.ics`;
    a.click();
    try { (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "novena_lembrete", { novena: id }); } catch { /* sem GA */ }
  };

  const h = hoje();
  const feitosN = feitos.filter(Boolean).length;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 rounded-2xl border border-co-warm-sand-dark bg-white p-5 md:grid-cols-2 md:p-8">
        <label className="flex min-w-0 flex-col gap-1.5 text-sm font-semibold md:col-span-2">Escolha a novena
          <select value={id} onChange={(e) => setId(e.target.value)} className="h-12 w-full min-w-0 rounded-md border border-co-warm-sand-dark bg-white px-3 text-[16px] font-normal">
            {NOVENAS.map((x) => <option key={x.id} value={x.id}>{x.nome}</option>)}
          </select>
        </label>
        {festa ? (
          <div className="rounded-xl bg-co-warm-cream p-4 md:col-span-2">
            <p className="text-[15px]">A próxima festa de <strong>{n.festaNome}</strong> é {ext(festa, true)}.</p>
            <p className="mt-1 font-display text-xl font-semibold leading-snug md:text-2xl">Comece no {ext(inicio)} e termine no {ext(dias[8])}.</p>
          </div>
        ) : (
          <label className="flex min-w-0 flex-col gap-1.5 text-sm font-semibold">Esta novena não tem data fixa. Quando quer começar?
            <input type="date" value={inicioLivre} onChange={(e) => e.target.value && setInicioLivre(e.target.value)} className="h-12 w-full min-w-0 rounded-md border border-co-warm-sand-dark bg-white px-3 text-[16px] font-normal" />
          </label>
        )}
        <label className={`flex min-w-0 flex-col gap-1.5 text-sm font-semibold ${festa ? "md:col-span-2" : ""}`}>Horário do lembrete
          <input type="time" value={hora} onChange={(e) => setHora(e.target.value || "20:00")} className="h-12 w-full min-w-0 rounded-md border border-co-warm-sand-dark bg-white px-3 text-[16px] font-normal" />
        </label>
        <div className="acoes md:col-span-2">
          <button type="button" onClick={baixarIcs} className="btn btn-primario">Adicionar ao calendário do celular</button>
          <a href={n.artigo} className="btn btn-secundario">Abrir as orações da novena</a>
        </div>
        <p className="text-[13px] text-co-warm-brown/75 md:col-span-2">O arquivo de calendário (.ics) cria 9 lembretes e funciona no Google Agenda, no iPhone e no Outlook.</p>
      </div>

      <section aria-labelledby="meus-dias" className="rounded-2xl border border-co-warm-sand-dark bg-white p-5 md:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="meus-dias" className="font-display text-2xl font-semibold">Meus 9 dias</h2>
          <span className="text-[15px] text-co-warm-brown/80">{feitosN} de 9 rezados</span>
        </div>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-co-warm-cream"><div className="h-full rounded-full bg-[#36613F] transition-[width]" style={{ width: `${(feitosN / 9) * 100}%` }} /></div>
        <ol className="mt-5 grid gap-2 sm:grid-cols-3">
          {dias.map((d, i) => (
            <li key={d}>
              <button type="button" aria-pressed={feitos[i]} onClick={() => marcar(i)}
                className={`flex h-full w-full items-center gap-3 rounded-xl border-2 p-3 text-left transition-colors ${feitos[i] ? "border-[#36613F] bg-[#E4EEE6]" : d === h ? "border-co-warm-terracotta bg-white" : "border-co-warm-sand-dark bg-white hover:border-co-warm-brown/40"}`}>
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${feitos[i] ? "bg-[#36613F] text-white" : "bg-co-warm-cream"}`}>{feitos[i] ? "✓" : i + 1}</span>
                <span className="text-[15px] leading-tight"><span className="block font-semibold">{i + 1}º dia{d === h ? " (hoje)" : ""}</span><span className="text-co-warm-brown/80">{ext(d)}</span></span>
              </button>
            </li>
          ))}
        </ol>
        {feitosN === 9 && <p className="mt-4 rounded-lg bg-[#E4EEE6] px-4 py-3 font-semibold text-[#36613F]">Novena concluída. Que Deus abençoe a sua intenção.</p>}
      </section>
    </div>
  );
}
