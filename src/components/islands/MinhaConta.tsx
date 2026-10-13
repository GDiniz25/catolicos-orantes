import { useEffect, useState } from "react";
import { BookOpenCheck, BookHeart, Brain, CalendarClock, Cloud, GraduationCap, Heart, HeartHandshake, Newspaper, ShieldCheck, Trash2 } from "lucide-react";
import ContaBox, { type Usuario } from "./estudo/ContaBox";
import { aoMudarSessao, sessaoAtual, talvezLogado } from "@/lib/conta";
import { apagarTudo, EVENTO, EVENTO_STATUS, ler, sincronizarTudo } from "@/lib/progresso";
import { PLANOS } from "@/data/biblia";
import { NOVENAS } from "@/data/novenasPlanner";
import { calcular } from "@/data/santoAfinidade";
import temperamento from "@/data/conteudo/temperamento.json";

type Item = { icone: typeof Cloud; titulo: string; texto: string; href: string; cta: string };

const TEMPS = ["colerico", "sanguineo", "melancolico", "fleumatico"] as const;

function resumo(): Item[] {
  const itens: Item[] = [];

  const caminho = ler<{ concluidas?: Record<string, unknown> } | null>("co-caminho-v1", null);
  const licoes = caminho ? Object.keys(caminho.concluidas ?? {}).length : 0;
  itens.push({ icone: GraduationCap, titulo: "Caminho da Fé", texto: licoes ? `${licoes} ${licoes === 1 ? "lição concluída" : "lições concluídas"}` : "Ainda não começou", href: "/aprender", cta: licoes ? "Continuar" : "Começar" });

  const plano = ler<{ plano?: string; feitos?: number[] } | null>("co-leitura-biblia-v1", null);
  const p = PLANOS.find((x) => x.id === plano?.plano);
  const lidos = plano?.feitos?.length ?? 0;
  itens.push({ icone: BookOpenCheck, titulo: "Plano de leitura da Bíblia", texto: p && lidos ? `${p.nome}: ${lidos} de ${p.dias} dias lidos` : "Nenhum dia marcado", href: "/plano-de-leitura-da-biblia", cta: lidos ? "Continuar" : "Escolher um plano" });

  const cons = ler<{ feitos?: number[] } | null>("co-consagracao-v1", null);
  const dc = cons?.feitos?.length ?? 0;
  itens.push({ icone: Heart, titulo: "Consagração a Nossa Senhora", texto: dc ? `${dc} de 33 dias rezados` : "Ainda não começou", href: "/consagracao-a-nossa-senhora", cta: dc ? "Continuar" : "Conhecer" });

  const novenas: string[] = [];
  let lectio = 0;
  try {
    for (const k of Object.keys(localStorage)) {
      if (k.startsWith("co-novena-")) {
        const v = ler<unknown>(k, null);
        const feitos = Array.isArray(v) ? v.filter(Boolean).length : 0;
        if (!feitos) continue;
        const resto = k.slice("co-novena-".length);
        const id = resto.slice(0, -11);
        const n = NOVENAS.find((x) => x.id === id);
        novenas.push(`${n ? n.nome.replace(/^Novena (a|ao|à|de) /, "") : "Novena"}: ${feitos} de 9 dias`);
      } else if (k.startsWith("co-lectio-") && localStorage.getItem(k)) lectio++;
    }
  } catch {
    /* sem armazenamento */
  }
  itens.push({ icone: CalendarClock, titulo: "Novenas", texto: novenas.length ? novenas.slice(0, 3).join(" · ") + (novenas.length > 3 ? ` e mais ${novenas.length - 3}` : "") : "Nenhuma novena marcada", href: "/planejador-de-novena", cta: novenas.length ? "Abrir" : "Planejar uma novena" });

  itens.push({ icone: BookHeart, titulo: "Lectio Divina", texto: lectio ? `Anotações em ${lectio} ${lectio === 1 ? "dia" : "dias"}` : "Nenhuma anotação", href: "/lectio-divina", cta: "Rezar hoje" });

  const santo = ler<unknown>("co-santo-afinidade-v1", null);
  let nomeSanto = "";
  if (Array.isArray(santo)) {
    try {
      nomeSanto = calcular(santo as number[])[0]?.santo.nome ?? "";
    } catch {
      nomeSanto = "";
    }
  }
  itens.push({ icone: HeartHandshake, titulo: "Santo de devoção", texto: nomeSanto ? `Seu resultado: ${nomeSanto}` : "Teste ainda não feito", href: "/descubra-seu-santo", cta: nomeSanto ? "Ver resultado" : "Fazer o teste" });

  const temp = ler<unknown>("co-temperamento-v1", null);
  let nomeTemp = "";
  if (Array.isArray(temp)) {
    const soma: Record<string, number> = {};
    (temperamento.afirmacoes as { temperamento: string }[]).forEach((a, i) => {
      soma[a.temperamento] = (soma[a.temperamento] ?? 0) + (Number(temp[i]) || 0);
    });
    const top = [...TEMPS].sort((a, b) => (soma[b] ?? 0) - (soma[a] ?? 0))[0];
    nomeTemp = (temperamento.resultados as Record<string, { nome: string }>)[top]?.nome ?? "";
  }
  itens.push({ icone: Brain, titulo: "Temperamento", texto: nomeTemp ? `Seu resultado: ${nomeTemp}` : "Teste ainda não feito", href: "/teste-de-temperamento", cta: nomeTemp ? "Ver resultado" : "Fazer o teste" });

  const artigos = ler<unknown>("co-lidos-v1", []);
  const na = Array.isArray(artigos) ? artigos.length : 0;
  itens.push({ icone: Newspaper, titulo: "Artigos lidos", texto: na ? `${na} ${na === 1 ? "artigo lido" : "artigos lidos"}` : "Nenhum artigo marcado como lido", href: "/ferramentas", cta: "Explorar" });

  return itens;
}

export default function MinhaConta() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [pronto, setPronto] = useState(false);
  const [sinc, setSinc] = useState(false);
  const [itens, setItens] = useState<Item[]>([]);
  const [confirmar, setConfirmar] = useState(false);
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    const atualizar = () => setItens(resumo());
    const onStatus = (e: Event) => setSinc((e as CustomEvent).detail === "sincronizando");
    atualizar();
    addEventListener(EVENTO, atualizar);
    addEventListener(EVENTO_STATUS, onStatus);
    let parar: (() => void) | undefined;
    if (!talvezLogado()) setPronto(true);
    else {
      sessaoAtual()
        .then((s) => s?.user && setUsuario({ id: s.user.id, email: s.user.email ?? "" }))
        .catch(() => undefined)
        .finally(() => setPronto(true));
      aoMudarSessao((s) => {
        setUsuario(s?.user ? { id: s.user.id, email: s.user.email ?? "" } : null);
        if (s?.user) sincronizarTudo();
      }).then((f) => (parar = f));
    }
    return () => {
      removeEventListener(EVENTO, atualizar);
      removeEventListener(EVENTO_STATUS, onStatus);
      parar?.();
    };
  }, []);

  const apagar = async () => {
    setConfirmar(false);
    const ok = await apagarTudo();
    setAviso(ok ? "Pronto. Seu progresso foi apagado da conta e deste aparelho." : "Não foi possível apagar agora. Tente de novo em instantes.");
  };

  return (
    <div className="space-y-8">
      {pronto && (
        <ContaBox
          usuario={usuario}
          sincronizando={sinc}
          variante="mapa"
          origem="minha-conta"
          destino="/minha-conta"
          titulo="Entre na sua conta"
          texto="Com a conta, seu progresso nas ferramentas fica guardado e você continua de onde parou no celular ou no computador. Sem senha: enviamos um link de acesso para o seu e-mail."
          onEntrou={(u) => setUsuario(u)}
          onSaiu={() => setUsuario(null)}
        />
      )}

      <section aria-labelledby="meu-progresso">
        <h2 id="meu-progresso" className="font-display text-2xl font-semibold">{usuario ? "Seu progresso" : "Seu progresso neste aparelho"}</h2>
        <p className="mt-1 text-[15px] text-co-warm-brown/80">
          {usuario ? "Juntamos o que você fez neste aparelho com o que está salvo na conta." : "Sem conta, o progresso fica só neste navegador. Se limpar os dados do navegador ou trocar de aparelho, ele se perde."}
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {itens.map((it) => {
            const Icone = it.icone;
            return (
              <li key={it.titulo} className="flex min-w-0 items-start gap-3 rounded-xl border border-co-warm-sand-dark bg-white p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-co-warm-cream text-co-warm-terracotta">
                  <Icone className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{it.titulo}</p>
                  <p className="mt-0.5 text-[15px] text-co-warm-brown/75">{it.texto}</p>
                  <a href={it.href} className="mt-2 inline-block text-[15px] font-medium text-co-warm-terracotta underline-offset-4 hover:underline">{it.cta}</a>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="flex items-start gap-3 rounded-xl bg-co-warm-cream p-4 text-[15px]">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#36613F]" aria-hidden="true" />
        <p>
          <strong>O exame de consciência nunca é salvo</strong>, nem neste aparelho nem na conta. As anotações da Lectio Divina ficam visíveis só para você.
        </p>
      </section>

      {usuario && (
        <section className="rounded-xl border border-co-warm-sand-dark p-5">
          <h2 className="font-semibold">Apagar meu progresso</h2>
          <p className="mt-1 text-[15px] text-co-warm-brown/75">Apaga tudo o que está guardado na sua conta e neste aparelho, inclusive o Caminho da Fé. Os outros aparelhos em que você entrou também apagam na próxima visita.</p>
          {!confirmar ? (
            <button type="button" onClick={() => setConfirmar(true)} className="btn btn-secundario mt-3 w-full sm:w-auto">
              <Trash2 className="h-4 w-4" aria-hidden="true" /> Apagar meu progresso
            </button>
          ) : (
            <div className="mt-3">
              <p className="text-[15px] font-medium">Tem certeza? Não dá para desfazer.</p>
              <div className="acoes-2 mt-3">
              <button type="button" onClick={apagar} className="btn btn-primario">Sim, apagar</button>
              <button type="button" onClick={() => setConfirmar(false)} className="btn btn-secundario">Cancelar</button>
              </div>
            </div>
          )}
          {aviso && <p className="mt-3 text-[15px]" role="status">{aviso}</p>}
          <p className="mt-3 text-sm text-co-warm-brown/75">Para excluir a conta inteira, peça pela página de <a href="/sugestoes" className="underline">Sugestões</a>.</p>
        </section>
      )}
    </div>
  );
}
