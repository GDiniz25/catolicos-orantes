import { useEffect, useRef, useState } from "react";
import { EVENTO, gravar, remover } from "@/lib/progresso";

const PASSOS = [
  { nome: "Preparação", min: 2, pergunta: "Faça silêncio e peça a luz do Espírito Santo.", texto: "Escolha um lugar tranquilo, desligue as notificações e coloque-se na presença de Deus. Reze: “Vinde, Espírito Santo, enchei os corações dos vossos fiéis e acendei neles o fogo do vosso amor.”" },
  { nome: "Leitura (lectio)", min: 5, pergunta: "O que o texto diz?", texto: "Leia o Evangelho devagar, se possível duas vezes, uma delas em voz baixa. Repare nas pessoas, nos lugares, nos gestos e nas palavras de Jesus. Não tenha pressa de tirar conclusões." },
  { nome: "Meditação (meditatio)", min: 5, pergunta: "O que o texto diz para mim?", texto: "Guarde uma palavra ou frase que tocou o coração e repita-a por dentro. Pergunte: o que Deus quer me dizer hoje com isso? Em que ponto da minha vida esta Palavra toca?" },
  { nome: "Oração (oratio)", min: 5, pergunta: "O que eu digo a Deus?", texto: "Responda a Deus com suas palavras: agradeça, peça perdão, peça ajuda, louve. Pode ser uma frase só, dita com sinceridade." },
  { nome: "Contemplação (contemplatio)", min: 3, pergunta: "Permaneço com Deus.", texto: "Fique em silêncio diante de Deus, sem muitas palavras, apenas acolhendo o seu amor. Se a mente se distrair, volte com calma à palavra que guardou." },
  { nome: "Ação (actio)", min: 1, pergunta: "O que vou viver hoje?", texto: "Escolha um gesto concreto e pequeno para viver hoje a partir da Palavra rezada. Termine com um Pai-Nosso." },
];
const hoje = () => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(new Date());
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export default function LectioGuiada({ evangelho }: { evangelho?: string | null }) {
  const [i, setI] = useState(0);
  const [seg, setSeg] = useState(PASSOS[0].min * 60);
  const [rodando, setRodando] = useState(false);
  const [nota, setNota] = useState("");
  const timer = useRef<ReturnType<typeof setInterval>>();
  const chave = `co-lectio-${hoje()}`;

  useEffect(() => {
    const carregar = () => { try { setNota(localStorage.getItem(chave) || ""); } catch { /* nada */ } };
    carregar();
    addEventListener(EVENTO, carregar);
    return () => removeEventListener(EVENTO, carregar);
  }, []);
  useEffect(() => { setSeg(PASSOS[i].min * 60); setRodando(false); }, [i]);
  useEffect(() => {
    clearInterval(timer.current);
    if (rodando) timer.current = setInterval(() => setSeg((s) => { if (s <= 1) { setRodando(false); return 0; } return s - 1; }), 1000);
    return () => clearInterval(timer.current);
  }, [rodando]);

  const p = PASSOS[i];
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-co-warm-sand-dark bg-white p-5 md:p-7">
        <p className="text-sm font-semibold text-co-warm-brown/80">Texto para rezar hoje</p>
        {evangelho ? (
          <p className="mt-1 text-[17px]">Evangelho da Missa de hoje: <strong>{evangelho}</strong>. <a href="/liturgia-diaria" className="font-semibold text-co-warm-terracotta underline-offset-4 hover:underline">Abrir o texto</a></p>
        ) : (
          <p className="mt-1 text-[17px]">Use o Evangelho do dia. <a href="/liturgia-diaria" className="font-semibold text-co-warm-terracotta underline-offset-4 hover:underline">Abrir a liturgia de hoje</a></p>
        )}
      </div>
      <ol className="flex gap-1.5" aria-label="Passos">
        {PASSOS.map((x, k) => (
          <li key={x.nome} className="flex-1">
            <button type="button" onClick={() => setI(k)} aria-current={k === i ? "step" : undefined} aria-label={x.nome} className={`h-2.5 w-full rounded-full ${k < i ? "bg-[#2E4A66]" : k === i ? "bg-[#2E4A66]/60" : "bg-co-warm-cream"}`} />
          </li>
        ))}
      </ol>
      <div className="overflow-hidden rounded-2xl border border-co-warm-sand-dark bg-white">
        <div className="p-5 md:p-9" aria-live="polite">
          <p className="text-sm font-semibold text-[#2E4A66]">Passo {i + 1} de {PASSOS.length}</p>
          <h2 className="mt-1 font-display text-3xl font-semibold">{p.nome}</h2>
          <p className="mt-2 font-display text-xl italic text-co-warm-brown/85">{p.pergunta}</p>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed">{p.texto}</p>
          <div className="mt-6 grid grid-cols-2 items-center gap-3 sm:flex">
            <span className="col-span-2 font-display text-4xl font-semibold tabular-nums sm:mr-2" aria-label="Tempo restante">{fmt(seg)}</span>
            <button type="button" onClick={() => setRodando((r) => !r)} className="btn btn-secundario btn-sm w-full sm:w-40">{rodando ? "Pausar" : seg === 0 ? "Tempo concluído" : "Iniciar tempo"}</button>
            <button type="button" onClick={() => setSeg((s) => s + 60)} className="btn btn-secundario btn-sm w-full sm:w-40">+1 min</button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 border-t border-co-warm-sand-dark p-4">
          <button type="button" disabled={i === 0} onClick={() => setI(i - 1)} className="btn btn-secundario h-14 w-full">Voltar</button>
          <button type="button" onClick={() => setI(i < PASSOS.length - 1 ? i + 1 : 0)} className="btn h-14 w-full bg-[#2E4A66] text-white hover:bg-[#25405A]">{i < PASSOS.length - 1 ? "Próximo passo" : "Recomeçar"}</button>
        </div>
      </div>
      <label className="block rounded-2xl border border-co-warm-sand-dark bg-white p-5">
        <span className="font-semibold">Minhas anotações de hoje</span>
        <span className="mt-1 block text-sm text-co-warm-brown/75">A palavra que guardei, o que Deus me disse, meu propósito. Fica salvo neste aparelho e, se você entrar com seu e-mail, também na sua conta, visível só para você.</span>
        <textarea value={nota} onChange={(e) => { setNota(e.target.value); if (e.target.value) gravar(chave, e.target.value); else remover(chave); }} rows={5} className="mt-3 w-full rounded-md border border-co-warm-sand-dark p-3 text-[16px]" />
      </label>
    </div>
  );
}
