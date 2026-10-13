import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Check, Copy, Printer, RotateCcw, ShieldCheck } from "lucide-react";

type Perfil = "todos" | "casado" | "pais" | "jovem";
interface Pergunta { id: string; texto: string; confessar: string; perfil?: Perfil[] }
interface Bloco { titulo: string; base: string; perguntas: Pergunta[] }

const blocos: Bloco[] = [
  { titulo: "1º Mandamento", base: "Amar a Deus sobre todas as coisas", perguntas: [
    { id: "1a", texto: "Deixei de rezar por longo tempo ou rezei sem nenhuma atenção por descuido?", confessar: "Descuidei da oração" },
    { id: "1b", texto: "Pratiquei ou consultei superstição, horóscopo, cartomancia, simpatias ou espiritismo?", confessar: "Recorri a superstição ou práticas ocultistas" },
    { id: "1c", texto: "Duvidei voluntariamente da fé ou neguei-a diante dos outros?", confessar: "Duvidei voluntariamente da fé ou a neguei" },
    { id: "1d", texto: "Comunguei em pecado grave, sem antes me confessar?", confessar: "Recebi a Comunhão em estado de pecado grave" },
    { id: "1e", texto: "Escondi conscientemente um pecado grave em confissões anteriores?", confessar: "Ocultei um pecado grave numa confissão anterior" },
  ]},
  { titulo: "2º Mandamento", base: "Não tomar seu santo nome em vão", perguntas: [
    { id: "2a", texto: "Usei o nome de Deus, de Nossa Senhora ou dos santos com desrespeito?", confessar: "Usei o nome de Deus ou dos santos com desrespeito" },
    { id: "2b", texto: "Jurei falsamente ou sem necessidade?", confessar: "Jurei em falso ou sem necessidade" },
    { id: "2c", texto: "Deixei de cumprir uma promessa feita a Deus?", confessar: "Não cumpri promessa feita a Deus" },
  ]},
  { titulo: "3º Mandamento", base: "Guardar domingos e festas", perguntas: [
    { id: "3a", texto: "Faltei à Missa de domingo ou dia santo de guarda sem motivo grave?", confessar: "Faltei à Missa dominical ou de preceito sem motivo grave" },
    { id: "3b", texto: "Cheguei atrasado ou participei da Missa com desatenção voluntária?", confessar: "Participei da Missa com descaso" },
    { id: "3c", texto: "Trabalhei ou fiz outros trabalhar no domingo sem necessidade?", confessar: "Não santifiquei o domingo com trabalho desnecessário" },
  ]},
  { titulo: "4º Mandamento", base: "Honrar pai e mãe", perguntas: [
    { id: "4a", texto: "Desobedeci ou faltei com respeito aos meus pais?", confessar: "Desrespeitei ou desobedeci meus pais", perfil: ["jovem", "todos"] },
    { id: "4b", texto: "Abandonei ou deixei de ajudar meus pais idosos ou doentes?", confessar: "Descuidei dos meus pais em suas necessidades" },
    { id: "4c", texto: "Descuidei da educação na fé e do bom exemplo aos meus filhos?", confessar: "Descuidei da educação cristã dos meus filhos", perfil: ["pais"] },
  ]},
  { titulo: "5º Mandamento", base: "Não matar", perguntas: [
    { id: "5a", texto: "Guardei ódio, rancor ou desejo de vingança?", confessar: "Guardei ódio ou rancor" },
    { id: "5b", texto: "Agredi alguém, física ou verbalmente?", confessar: "Agredi alguém com palavras ou atos" },
    { id: "5c", texto: "Pratiquei, aconselhei ou colaborei com um aborto?", confessar: "Participei de um aborto" },
    { id: "5d", texto: "Abusei de álcool, drogas ou coloquei minha vida em risco sem necessidade?", confessar: "Abusei de bebida, drogas ou arrisquei a vida" },
    { id: "5e", texto: "Levei outra pessoa a pecar com meu mau exemplo?", confessar: "Dei mau exemplo levando outros a pecar" },
  ]},
  { titulo: "6º e 9º Mandamentos", base: "Castidade e pureza do coração", perguntas: [
    { id: "6a", texto: "Consenti em pensamentos ou desejos impuros de forma deliberada?", confessar: "Consenti em pensamentos ou desejos impuros" },
    { id: "6b", texto: "Vi pornografia ou conteúdos impuros?", confessar: "Vi conteúdos pornográficos" },
    { id: "6c", texto: "Pratiquei atos impuros sozinho ou com outra pessoa?", confessar: "Cometi atos contra a castidade" },
    { id: "6d", texto: "Fui infiel ao meu cônjuge, em atos ou relacionamentos?", confessar: "Fui infiel ao meu cônjuge", perfil: ["casado"] },
    { id: "6e", texto: "Usei métodos contraceptivos contrários ao ensinamento da Igreja?", confessar: "Usei contracepção contrária ao ensinamento da Igreja", perfil: ["casado"] },
  ]},
  { titulo: "7º e 10º Mandamentos", base: "Não furtar nem cobiçar", perguntas: [
    { id: "7a", texto: "Roubei, fiquei com algo alheio ou não devolvi o que devia?", confessar: "Furtei ou retive bens alheios" },
    { id: "7b", texto: "Enganei em negócios, trabalho, impostos ou provas?", confessar: "Fui desonesto no trabalho, nos negócios ou nos estudos" },
    { id: "7c", texto: "Fui avarento ou deixei de ajudar quem passava necessidade?", confessar: "Fui avarento e negligente com os necessitados" },
    { id: "7d", texto: "Invejei os bens ou o sucesso dos outros?", confessar: "Tive inveja dos bens dos outros" },
  ]},
  { titulo: "8º Mandamento", base: "Não levantar falso testemunho", perguntas: [
    { id: "8a", texto: "Menti?", confessar: "Menti" },
    { id: "8b", texto: "Falei mal dos outros, revelando defeitos sem necessidade?", confessar: "Falei mal dos outros (maledicência)" },
    { id: "8c", texto: "Caluniei alguém, atribuindo-lhe algo falso?", confessar: "Caluniei alguém" },
    { id: "8d", texto: "Julguei temerariamente ou espalhei fofocas?", confessar: "Julguei os outros e fiz fofocas" },
  ]},
  { titulo: "Mandamentos da Igreja e vida cristã", base: "Preceitos e virtudes", perguntas: [
    { id: "ia", texto: "Deixei de me confessar ao menos uma vez por ano?", confessar: "Fiquei mais de um ano sem me confessar" },
    { id: "ib", texto: "Não guardei jejum e abstinência nos dias prescritos?", confessar: "Não guardei jejum ou abstinência prescritos" },
    { id: "ic", texto: "Deixei-me levar pela soberba, preguiça, gula ou ira?", confessar: "Cedi à soberba, preguiça, gula ou ira" },
    { id: "id", texto: "Desperdicei tempo de forma desordenada em celular, redes ou jogos?", confessar: "Desperdicei o tempo de forma desordenada" },
  ]},
];

const perfis: { v: Perfil; l: string }[] = [
  { v: "todos", l: "Geral" }, { v: "jovem", l: "Jovem / filho" }, { v: "casado", l: "Casado(a)" }, { v: "pais", l: "Pai / mãe" },
];

const ExameInterativo = () => {
  const [perfil, setPerfil] = useState<Perfil[]>(["todos"]);
  const [ultima, setUltima] = useState("");
  const [marcados, setMarcados] = useState<Record<string, boolean>>({});
  const [vezes, setVezes] = useState<Record<string, string>>({});
  const [notas, setNotas] = useState("");
  const [passo, setPasso] = useState(0);
  const [gerado, setGerado] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const visiveis = useMemo(() => blocos.map((b) => ({ ...b, perguntas: b.perguntas.filter((p) => !p.perfil || p.perfil.some((x) => perfil.includes(x))) })), [perfil]);
  const lista = visiveis.flatMap((b) => b.perguntas).filter((p) => marcados[p.id]);

  const texto = [
    ultima ? `Minha última confissão foi há ${ultima}.` : "",
    ...lista.map((p) => `• ${p.confessar}${vezes[p.id] ? ` (${vezes[p.id]})` : ""}`),
    ...notas.split("\n").filter((n) => n.trim()).map((n) => `• ${n.trim()}`),
  ].filter(Boolean).join("\n");

  const togglePerfil = (v: Perfil) => setPerfil((p) => p.includes(v) ? (p.length > 1 ? p.filter((x) => x !== v) : p) : [...p, v]);
  const limpar = () => { setMarcados({}); setVezes({}); setNotas(""); setUltima(""); setPasso(0); setGerado(false); };
  const copiar = async () => { await navigator.clipboard.writeText(texto); setCopiado(true); setTimeout(() => setCopiado(false), 2000); };
  const bloco = visiveis[passo];

  return (
    <section aria-labelledby="exame-titulo" className="mb-10 rounded-md border border-co-warm-sand-dark bg-co-warm-sand p-5 md:p-8 print:border-0">
      <h2 id="exame-titulo" className="font-display text-2xl font-semibold text-co-warm-brown">Exame de consciência interativo</h2>
      <p className="mt-2 flex items-start gap-2 text-sm text-co-warm-brown/80">
        <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0" />
        Nada é salvo nem enviado: suas respostas ficam apenas neste aparelho e somem ao fechar a página.
      </p>

      {!gerado ? (
        <>
          {passo === 0 && (
            <div className="mt-6 space-y-4">
              <p className="text-co-warm-brown">Antes de começar, peça a luz do Espírito Santo: <em>“Vinde, Espírito Santo, iluminai minha consciência para que eu reconheça meus pecados com sinceridade.”</em></p>
              <fieldset>
                <legend className="mb-2 text-sm font-medium text-co-warm-brown">Mostrar perguntas para:</legend>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {perfis.map((p) => (
                    <Button key={p.v} type="button" size="sm" className="h-11 w-full" variant={perfil.includes(p.v) ? "default" : "outline"} aria-pressed={perfil.includes(p.v)} onClick={() => togglePerfil(p.v)}>{p.l}</Button>
                  ))}
                </div>
              </fieldset>
              <label className="block text-sm font-medium text-co-warm-brown">
                Há quanto tempo foi sua última confissão? (opcional)
                <input value={ultima} onChange={(e) => setUltima(e.target.value)} placeholder="Ex.: 3 meses" className="mt-1 block w-full rounded-md border border-co-warm-sand-dark bg-background px-3 py-2" />
              </label>
            </div>
          )}

          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between text-sm text-co-warm-brown/75">
              <span>Etapa {passo + 1} de {visiveis.length}</span>
              <span>{lista.length} marcado(s)</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-co-warm-sand-dark">
              <div className="h-full bg-co-warm-terracotta transition-all" style={{ width: `${((passo + 1) / visiveis.length) * 100}%` }} />
            </div>
            <h3 className="mt-5 font-display text-lg font-semibold text-co-warm-brown">{bloco.titulo}</h3>
            <p className="text-sm text-co-warm-brown/75">{bloco.base}</p>
            <ul className="mt-4 space-y-3">
              {bloco.perguntas.map((p) => (
                <li key={p.id} className="rounded-xl border border-co-warm-sand-dark bg-background/60 p-3">
                  <label className="flex cursor-pointer items-start gap-3">
                    <Checkbox checked={!!marcados[p.id]} onCheckedChange={(c) => setMarcados((m) => ({ ...m, [p.id]: !!c }))} className="mt-0.5" />
                    <span className="text-co-warm-brown">{p.texto}</span>
                  </label>
                  {marcados[p.id] && (
                    <input value={vezes[p.id] ?? ""} onChange={(e) => setVezes((v) => ({ ...v, [p.id]: e.target.value }))} placeholder="Quantas vezes, aproximadamente? (opcional)" aria-label="Quantas vezes" className="ml-7 mt-2 block w-[calc(100%-1.75rem)] rounded-md border border-co-warm-sand-dark bg-background px-3 py-1.5 text-sm" />
                  )}
                </li>
              ))}
            </ul>
            {passo === visiveis.length - 1 && (
              <label className="mt-5 block text-sm font-medium text-co-warm-brown">
                Outros pecados que deseja lembrar (um por linha)
                <Textarea value={notas} onChange={(e) => setNotas(e.target.value)} className="mt-1 bg-background" rows={3} />
              </label>
            )}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-12 w-full" onClick={() => setPasso((p) => p - 1)} disabled={passo === 0}>Voltar</Button>
              {passo < visiveis.length - 1
                ? <Button className="h-12 w-full" onClick={() => { setPasso((p) => p + 1); document.getElementById("exame-titulo")?.scrollIntoView({ behavior: "smooth" }); }}>Próximo</Button>
                : <Button className="h-12 w-full" onClick={() => setGerado(true)}>Gerar minha lista</Button>}
            </div>
          </div>
        </>
      ) : (
        <div className="mt-6 space-y-5">
          <div className="rounded-xl border border-co-warm-sand-dark bg-background p-5">
            <h3 className="font-display text-lg font-semibold text-co-warm-brown">O que levar à confissão</h3>
            <p className="mt-3 text-co-warm-brown"><strong>Ao começar:</strong> “Abençoe-me, padre, porque pequei.”</p>
            {texto ? <pre className="mt-3 whitespace-pre-wrap font-sans text-co-warm-brown">{texto}</pre> : <p className="mt-3 text-co-warm-brown/80">Nenhum item marcado. Se tiver dúvidas, converse com o sacerdote.</p>}
            <p className="mt-3 text-co-warm-brown"><strong>Ao terminar:</strong> “Desses e de todos os pecados da minha vida, peço perdão a Deus.”</p>
            <h4 className="mt-5 font-semibold text-co-warm-brown">Ato de contrição</h4>
            <p className="mt-1 text-co-warm-brown/80">Meu Deus, eu me arrependo de todo o coração de vos ter ofendido, porque sois infinitamente bom e digno de ser amado. Proponho firmemente, com a ajuda da vossa graça, não mais pecar e fugir das ocasiões de pecado. Amém.</p>
          </div>
          <p className="text-sm text-co-warm-brown/80">Este roteiro é só uma ajuda. É preciso confessar todos os pecados graves, com sua espécie e número aproximado (CIC 1456). Na dúvida sobre a gravidade, pergunte ao sacerdote. Após a confissão, cumpra a penitência.</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 print:hidden">
            <Button className="h-11 w-full" onClick={copiar}>{copiado ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}{copiado ? "Copiado" : "Copiar"}</Button>
            <Button variant="outline" className="h-11 w-full" onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" />Imprimir</Button>
            <Button variant="outline" className="h-11 w-full" onClick={() => setGerado(false)}>Revisar</Button>
            <Button variant="outline" className="h-11 w-full" onClick={limpar}><RotateCcw className="mr-2 h-4 w-4" />Apagar tudo</Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ExameInterativo;
