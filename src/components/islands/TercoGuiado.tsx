import { useEffect, useMemo, useState } from "react";
import { ORACOES } from "@/data/oracoes";
import { MISTERIOS, MISTERIO_DA_SEMANA, hojeBrasilia, type Misterio } from "@/lib/anoLiturgico";

interface Passo { titulo: string; texto: string; dezena?: number; conta?: number; total?: number; aviso?: string }

function passosTerco(m: Misterio): Passo[] {
  const ms = MISTERIOS[m];
  const p: Passo[] = [
    { titulo: "Sinal da cruz", texto: ORACOES.sinal },
    { titulo: "Creio", texto: ORACOES.credo },
    { titulo: "Pai-Nosso", texto: ORACOES.paiNosso },
    ...["fé", "esperança", "caridade"].map((v, i) => ({ titulo: `Ave-Maria pela ${v}`, texto: ORACOES.aveMaria, conta: i + 1, total: 3 })),
    { titulo: "Glória ao Pai", texto: ORACOES.gloria },
  ];
  ms.itens.forEach((mist, d) => {
    const sing = { gozosos: "gozoso", dolorosos: "doloroso", gloriosos: "glorioso", luminosos: "luminoso" }[m];
    p.push({ titulo: `${d + 1}º mistério`, texto: mist, dezena: d + 1, aviso: `No ${d + 1}º mistério ${sing}, contemplamos: ${mist}.` });
    p.push({ titulo: "Pai-Nosso", texto: ORACOES.paiNosso, dezena: d + 1 });
    for (let i = 1; i <= 10; i++) p.push({ titulo: "Ave-Maria", texto: ORACOES.aveMaria, dezena: d + 1, conta: i, total: 10 });
    p.push({ titulo: "Glória ao Pai", texto: ORACOES.gloria, dezena: d + 1 });
    p.push({ titulo: "Ó meu Jesus", texto: ORACOES.fatima, dezena: d + 1 });
  });
  p.push({ titulo: "Salve Rainha", texto: ORACOES.salveRainha });
  p.push({ titulo: "Sinal da cruz", texto: "Em nome do Pai, e do Filho e do Espírito Santo. Amém." });
  return p;
}

function passosMisericordia(): Passo[] {
  const p: Passo[] = [
    { titulo: "Sinal da cruz", texto: "Em nome do Pai, e do Filho e do Espírito Santo. Amém." },
    { titulo: "Pai-Nosso", texto: ORACOES.paiNosso },
    { titulo: "Ave-Maria", texto: ORACOES.aveMaria },
    { titulo: "Creio", texto: ORACOES.credo },
  ];
  for (let d = 1; d <= 5; d++) {
    p.push({ titulo: "Nas contas grandes", texto: ORACOES.eternoPai, dezena: d });
    for (let i = 1; i <= 10; i++) p.push({ titulo: "Nas contas pequenas", texto: ORACOES.dolorosaPaixao, dezena: d, conta: i, total: 10 });
  }
  for (let i = 1; i <= 3; i++) p.push({ titulo: "Para terminar (três vezes)", texto: ORACOES.deusSanto, conta: i, total: 3 });
  p.push({ titulo: "Sinal da cruz", texto: "Em nome do Pai, e do Filho e do Espírito Santo. Amém." });
  return p;
}

const DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function TercoGuiado({ modo = "terco" }: { modo?: "terco" | "misericordia" }) {
  const [misterio, setMisterio] = useState<Misterio>("gloriosos");
  const [i, setI] = useState(0);
  useEffect(() => {
    const [y, m, d] = hojeBrasilia().split("-").map(Number);
    setMisterio(MISTERIO_DA_SEMANA[new Date(y, m - 1, d).getDay()]);
  }, []);
  const passos = useMemo(() => (modo === "terco" ? passosTerco(misterio) : passosMisericordia()), [modo, misterio]);
  const p = passos[i];
  const ir = (n: number) => setI((x) => Math.max(0, Math.min(passos.length - 1, x + n)));

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const alvo = e.target as HTMLElement;
      if (alvo.closest("input, select, textarea")) return;
      if (e.key === "ArrowRight") { e.preventDefault(); ir(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); ir(-1); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [passos.length]);

  const fim = i === passos.length - 1;
  return (
    <div className="space-y-5">
      {modo === "terco" && (
        <div className="rounded-2xl border border-co-warm-sand-dark bg-white p-4 md:p-6">
          <p className="text-sm font-semibold text-co-warm-brown/80">Mistérios de hoje: <span className="text-co-warm-brown">{MISTERIOS[misterio].nome}</span></p>
          <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4" role="group" aria-label="Escolher os mistérios">
            {(Object.keys(MISTERIOS) as Misterio[]).map((k) => (
              <button key={k} type="button" aria-pressed={k === misterio} onClick={() => { setMisterio(k); setI(0); }}
                className={`flex min-h-12 w-full flex-col items-center justify-center rounded-md border px-2 py-1.5 text-[15px] font-semibold leading-tight ${k === misterio ? "border-co-warm-brown bg-co-warm-brown text-white" : "border-co-warm-sand-dark bg-white hover:border-co-warm-brown/40"}`}>
                {MISTERIOS[k].nome.replace("Mistérios ", "")}
                <span className="text-[13px] font-normal opacity-70">({DIAS.filter((_, d) => MISTERIO_DA_SEMANA[d] === k).join(", ")})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-co-warm-sand-dark bg-white">
        <div className="h-1.5 bg-co-warm-cream"><div className="h-full bg-co-warm-terracotta transition-[width] duration-200" style={{ width: `${((i + 1) / passos.length) * 100}%` }} /></div>
        <div className="p-5 md:p-9" aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-co-warm-brown/75">
            <span>{p.dezena ? `${p.dezena}ª dezena` : i < 7 ? "Início" : "Final"}</span>
            <span>Passo {i + 1} de {passos.length}</span>
          </div>
          {p.dezena && (
            <div className="mt-3 flex gap-1.5" aria-hidden="true">
              {[1, 2, 3, 4, 5].map((d) => <span key={d} className={`h-2 flex-1 rounded-full ${d < p.dezena! ? "bg-co-warm-terracotta" : d === p.dezena ? "bg-co-warm-terracotta/60" : "bg-co-warm-cream"}`} />)}
            </div>
          )}
          <h2 className="mt-5 font-display text-2xl font-semibold md:text-3xl">{p.titulo}{p.total ? <span className="ml-2 text-co-warm-brown/75">{p.conta} de {p.total}</span> : null}</h2>
          {p.aviso && <p className="mt-3 rounded-lg bg-[#F7F0DC] px-4 py-3 text-[16px] font-semibold text-[#7A5820]">{p.aviso}</p>}
          {!p.aviso && <p className="mt-4 max-w-2xl font-display text-[19px] leading-relaxed md:text-[21px]">{p.texto}</p>}
          {p.total && (
            <div className="mt-6 flex flex-wrap gap-2" aria-hidden="true">
              {Array.from({ length: p.total }, (_, k) => <span key={k} className={`h-4 w-4 rounded-full border-2 ${k < p.conta! ? "border-co-warm-terracotta bg-co-warm-terracotta" : "border-co-warm-sand-dark"}`} />)}
            </div>
          )}
        </div>
        <div className="sticky bottom-0 grid grid-cols-2 gap-3 border-t border-co-warm-sand-dark bg-white p-4">
          <button type="button" onClick={() => ir(-1)} disabled={i === 0} className="btn btn-secundario h-14 w-full">Voltar</button>
          {fim ? (
            <button type="button" onClick={() => setI(0)} className="btn h-14 w-full bg-[#36613F] text-white hover:bg-[#2B4E32]">Recomeçar</button>
          ) : (
            <button type="button" onClick={() => ir(1)} className="btn btn-primario h-14 w-full">Próxima</button>
          )}
        </div>
      </div>
      <p className="text-[13px] text-co-warm-brown/75">Dica: no computador, use as setas do teclado para avançar e voltar.</p>
    </div>
  );
}
