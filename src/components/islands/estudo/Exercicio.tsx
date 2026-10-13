import { useEffect, useMemo, useState } from "react";
import { Check, X } from "lucide-react";
import type { Questao } from "@/data/estudo/tipos";
import { embaralhar } from "./motor";

interface Props {
  questao: Questao;
  /** chamado quando a pessoa clica em Continuar depois de ver a correção */
  onNext: (acertou: boolean) => void;
}

const opcaoBase =
  "w-full rounded-md border-2 px-4 py-3.5 text-left text-[16px] leading-snug transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-co-warm-terracotta";

export default function Exercicio({ questao, onNext }: Props) {
  const [checado, setChecado] = useState(false);
  const [acertou, setAcertou] = useState(false);

  // escolha / vf
  const [sel, setSel] = useState<number | null>(null);
  const opcoes = useMemo(() => {
    if (questao.tipo === "escolha") return embaralhar(questao.opcoes.map((texto, i) => ({ texto, i })));
    if (questao.tipo === "vf") return [{ texto: "Verdadeiro", i: 1 }, { texto: "Falso", i: 0 }];
    return [];
  }, [questao]);

  // ordenar
  const banco = useMemo(() => (questao.tipo === "ordenar" ? embaralhar(questao.itens.map((t, i) => ({ t, i }))) : []), [questao]);
  const [montado, setMontado] = useState<number[]>([]);

  // pares
  const direita = useMemo(() => (questao.tipo === "pares" ? embaralhar(questao.pares.map((p, i) => ({ t: p[1], i }))) : []), [questao]);
  const [esq, setEsq] = useState<number | null>(null);
  const [feitos, setFeitos] = useState<number[]>([]); // índices da esquerda já pareados
  const [feitosDir, setFeitosDir] = useState<number[]>([]); // índices da direita já usados
  const [errouPar, setErrouPar] = useState(0);
  const [flash, setFlash] = useState<number | null>(null);

  useEffect(() => {
    setChecado(false);
    setAcertou(false);
    setSel(null);
    setMontado([]);
    setEsq(null);
    setFeitos([]);
    setFeitosDir([]);
    setErrouPar(0);
    setFlash(null);
  }, [questao]);

  const podeVerificar =
    (questao.tipo === "escolha" || questao.tipo === "vf") ? sel !== null : questao.tipo === "ordenar" ? montado.length === questao.itens.length : false;

  const verificar = () => {
    let ok = false;
    if (questao.tipo === "escolha") ok = sel === questao.correta;
    if (questao.tipo === "vf") ok = (sel === 1) === questao.correta;
    if (questao.tipo === "ordenar") ok = montado.every((v, i) => v === i);
    setAcertou(ok);
    setChecado(true);
  };

  // pares: ao completar, já mostra o resultado
  useEffect(() => {
    if (questao.tipo === "pares" && feitos.length === questao.pares.length && !checado) {
      setAcertou(errouPar === 0);
      setChecado(true);
    }
  }, [feitos, questao, errouPar, checado]);

  const escolherDireita = (i: number) => {
    if (esq === null || questao.tipo !== "pares") return;
    // aceita qualquer item da direita com o mesmo texto (ex.: duas virtudes "Teologal")
    if (questao.pares[esq][1] === questao.pares[i][1]) {
      setFeitos((f) => [...f, esq]);
      setFeitosDir((f) => [...f, i]);
      setEsq(null);
    } else {
      setErrouPar((n) => n + 1);
      setFlash(i);
      setTimeout(() => setFlash(null), 450);
    }
  };

  const respostaCorreta =
    questao.tipo === "escolha"
      ? questao.opcoes[questao.correta]
      : questao.tipo === "vf"
        ? questao.correta
          ? "Verdadeiro"
          : "Falso"
        : questao.tipo === "ordenar"
          ? questao.itens.join(" → ")
          : null;

  return (
    <div className="flex min-h-[60vh] flex-col">
      <div className="flex-1">
        <p className="mb-1 text-sm font-medium text-co-warm-brown/75">
          {questao.tipo === "vf" ? "Verdadeiro ou falso?" : questao.tipo === "ordenar" ? "Toque na ordem certa" : questao.tipo === "pares" ? "Forme os pares" : "Escolha a resposta"}
        </p>
        <h2 className="mb-6 font-display text-2xl font-semibold leading-snug md:text-[1.7rem]">{questao.enunciado}</h2>

        {(questao.tipo === "escolha" || questao.tipo === "vf") && (
          <div className={questao.tipo === "vf" ? "grid grid-cols-2 gap-3" : "space-y-3"} role="radiogroup">
            {opcoes.map((o) => {
              const escolhida = sel === o.i;
              const certa = checado && (questao.tipo === "escolha" ? o.i === questao.correta : (o.i === 1) === questao.correta);
              const errada = checado && escolhida && !certa;
              return (
                <button
                  key={o.texto}
                  type="button"
                  role="radio"
                  aria-checked={escolhida}
                  disabled={checado}
                  onClick={() => setSel(o.i)}
                  className={`${opcaoBase} ${
                    certa
                      ? "border-[hsl(140_40%_34%)] bg-[hsl(140_40%_95%)]"
                      : errada
                        ? "border-co-warm-terracotta bg-[hsl(14_60%_96%)]"
                        : escolhida
                          ? "border-co-warm-brown bg-co-warm-cream"
                          : "border-co-warm-sand-dark bg-white hover:border-co-warm-brown/40"
                  } ${questao.tipo === "vf" ? "py-5 text-center font-medium" : ""}`}
                >
                  {o.texto}
                </button>
              );
            })}
          </div>
        )}

        {questao.tipo === "ordenar" && (
          <div>
            <div className="mb-5 min-h-[7rem] rounded-md border-2 border-dashed border-co-warm-sand-dark p-3" aria-label="Sua resposta">
              {montado.length === 0 && <p className="p-2 text-sm text-co-warm-brown/75">Toque nos itens abaixo, na ordem.</p>}
              <ol className="space-y-2">
                {montado.map((idx, pos) => (
                  <li key={idx}>
                    <button
                      type="button"
                      disabled={checado}
                      onClick={() => setMontado((m) => m.filter((x) => x !== idx))}
                      className={`${opcaoBase} flex items-center gap-3 py-2.5 ${checado ? (idx === pos ? "border-[hsl(140_40%_34%)] bg-[hsl(140_40%_95%)]" : "border-co-warm-terracotta bg-[hsl(14_60%_96%)]") : "border-co-warm-brown/30 bg-white"}`}
                    >
                      <span className="w-5 text-sm text-co-warm-brown/75">{pos + 1}.</span>
                      {questao.itens[idx]}
                    </button>
                  </li>
                ))}
              </ol>
            </div>
            <div className="flex flex-wrap gap-2">
              {banco
                .filter((b) => !montado.includes(b.i))
                .map((b) => (
                  <button key={b.i} type="button" disabled={checado} onClick={() => setMontado((m) => [...m, b.i])} className="rounded-md border-2 border-co-warm-sand-dark bg-white px-3.5 py-2.5 text-[15px] hover:border-co-warm-brown/40">
                    {b.t}
                  </button>
                ))}
            </div>
          </div>
        )}

        {questao.tipo === "pares" && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2.5">
              {questao.pares.map((p, i) => {
                const feito = feitos.includes(i);
                return (
                  <button
                    key={p[0]}
                    type="button"
                    disabled={feito || checado}
                    aria-pressed={esq === i}
                    onClick={() => setEsq(i)}
                    className={`${opcaoBase} min-h-[3.5rem] text-[15px] ${feito ? "border-transparent bg-co-warm-cream text-co-warm-brown/40" : esq === i ? "border-co-warm-brown bg-co-warm-cream" : "border-co-warm-sand-dark bg-white"}`}
                  >
                    {p[0]}
                  </button>
                );
              })}
            </div>
            <div className="space-y-2.5">
              {direita.map((d) => {
                const feito = feitosDir.includes(d.i);
                return (
                  <button
                    key={d.i}
                    type="button"
                    disabled={feito || checado || esq === null}
                    onClick={() => escolherDireita(d.i)}
                    className={`${opcaoBase} min-h-[3.5rem] text-[15px] ${feito ? "border-transparent bg-co-warm-cream text-co-warm-brown/40" : flash === d.i ? "border-co-warm-terracotta bg-[hsl(14_60%_96%)]" : "border-co-warm-sand-dark bg-white"}`}
                  >
                    {d.t}
                  </button>
                );
              })}
            </div>
            {!checado && <p className="col-span-2 text-sm text-co-warm-brown/75">Toque num item da esquerda e depois no seu par à direita.</p>}
          </div>
        )}
      </div>

      {/* Barra inferior: verificar / correção */}
      <div
        className={`sticky bottom-0 -mx-4 mt-8 border-t px-4 py-4 md:-mx-6 md:px-6 ${checado ? (acertou ? "border-[hsl(140_40%_80%)] bg-[hsl(140_40%_95%)]" : "border-[hsl(14_60%_85%)] bg-[hsl(14_60%_96%)]") : "border-co-warm-sand-dark bg-co-warm-sand"}`}
        aria-live="polite"
      >
        {checado ? (
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-3">
              <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white ${acertou ? "bg-[hsl(140_40%_34%)]" : "bg-co-warm-terracotta"}`}>
                {acertou ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
              </span>
              <div>
                <p className="font-semibold">{acertou ? "Isso mesmo!" : questao.tipo === "pares" ? "Completo, com alguns erros." : "Não foi desta vez."}</p>
                {!acertou && respostaCorreta && (
                  <p className="text-[15px]">
                    Resposta: <strong>{respostaCorreta}</strong>
                  </p>
                )}
                <p className="mt-1 text-[15px] text-co-warm-brown/80">{questao.explica}</p>
              </div>
            </div>
            <button
              type="button"
              autoFocus
              onClick={() => onNext(acertou)}
              className={`h-12 shrink-0 rounded-md px-8 text-[16px] font-semibold text-white md:w-auto ${acertou ? "bg-[hsl(140_40%_34%)] hover:bg-[hsl(140_40%_28%)]" : "bg-co-warm-terracotta hover:bg-co-warm-terracotta-light"}`}
            >
              Continuar
            </button>
          </div>
        ) : questao.tipo === "pares" ? (
          <p className="text-center text-sm text-co-warm-brown/75">
            {feitos.length} de {questao.pares.length} pares
          </p>
        ) : (
          <button
            type="button"
            disabled={!podeVerificar}
            onClick={verificar}
            className="h-12 w-full rounded-md bg-co-warm-terracotta text-[16px] font-semibold text-white transition-colors hover:bg-co-warm-terracotta-light disabled:cursor-not-allowed disabled:bg-co-warm-sand-dark disabled:text-co-warm-brown/50"
          >
            Verificar
          </button>
        )}
      </div>
    </div>
  );
}
