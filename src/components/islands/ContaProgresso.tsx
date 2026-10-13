import { useEffect, useState } from "react";
import ContaBox, { type Usuario } from "./estudo/ContaBox";
import { aoMudarSessao, sessaoAtual, talvezLogado } from "@/lib/conta";
import { EVENTO_STATUS, sincronizarTudo } from "@/lib/progresso";

interface Props {
  /** nome curto da ferramenta, para medir de onde vêm os logins */
  origem: string;
  titulo?: string;
  texto?: string;
}

/** Caixa "Salve seu progresso" das ferramentas. Logado: mostra a conta e o botão Sair. */
export default function ContaProgresso({ origem, titulo, texto }: Props) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [pronto, setPronto] = useState(false);
  const [sinc, setSinc] = useState(false);

  useEffect(() => {
    const onStatus = (e: Event) => setSinc((e as CustomEvent).detail === "sincronizando");
    addEventListener(EVENTO_STATUS, onStatus);
    let parar: (() => void) | undefined;
    if (!talvezLogado()) setPronto(true);
    else {
      sessaoAtual()
        .then((s) => {
          if (s?.user) setUsuario({ id: s.user.id, email: s.user.email ?? "" });
        })
        .catch(() => undefined)
        .finally(() => setPronto(true));
      aoMudarSessao((s) => {
        setUsuario(s?.user ? { id: s.user.id, email: s.user.email ?? "" } : null);
        if (s?.user) sincronizarTudo();
      }).then((f) => (parar = f));
    }
    return () => {
      removeEventListener(EVENTO_STATUS, onStatus);
      parar?.();
    };
  }, []);

  if (!pronto) return null;
  return (
    <ContaBox
      usuario={usuario}
      sincronizando={sinc}
      variante="mapa"
      origem={origem}
      destino={typeof location !== "undefined" ? location.pathname : undefined}
      titulo={titulo ?? "Salve seu progresso"}
      texto={texto ?? "Entre com seu e-mail e continue de onde parou em qualquer aparelho. Sem senha: enviamos um link de acesso."}
      onEntrou={(u) => setUsuario(u)}
      onSaiu={() => setUsuario(null)}
    />
  );
}
