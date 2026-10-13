import { useState } from "react";
import { Cloud, LogOut, Mail } from "lucide-react";
import { entrarComEmail, entrarComGoogle, googleAtivo, sair } from "@/lib/conta";

const registrarEvento = (nome: string, params: Record<string, unknown>) => {
  try {
    (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", nome, params);
  } catch {
    /* sem GA */
  }
};

export interface Usuario {
  id: string;
  email: string;
}

interface Props {
  usuario: Usuario | null;
  sincronizando: boolean;
  variante: "inicio" | "mapa" | "fim";
  onEntrou: (u: Usuario) => void;
  onSaiu: () => void;
  /** página para onde o link de acesso leva (padrão: /aprender) */
  destino?: string;
  titulo?: string;
  texto?: string;
  /** nome da ferramenta, para medir de onde vêm os logins */
  origem?: string;
}

const TEXTOS = {
  inicio: { titulo: "Já começou em outro aparelho?", texto: "Entre com seu e-mail para continuar de onde parou." },
  mapa: { titulo: "Salve seu progresso", texto: "Entre com seu e-mail e continue em qualquer aparelho. Sem senha: enviamos um link de acesso." },
  fim: { titulo: "Não perca este progresso", texto: "Entre com seu e-mail e continue em qualquer aparelho. Sem senha." },
};

export default function ContaBox({ usuario, sincronizando, variante, onSaiu, destino, titulo, texto, origem }: Props) {
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");
  const [aberto, setAberto] = useState(variante !== "inicio");

  if (usuario) {
    if (variante !== "mapa") return null;
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-co-warm-cream px-4 py-3 text-[15px]">
        <span className="inline-flex items-center gap-2">
          <Cloud className="h-4 w-4 text-co-warm-gold" aria-hidden="true" />
          {sincronizando ? "Sincronizando..." : <>Progresso salvo na conta <strong className="font-medium">{usuario.email}</strong></>}
        </span>
        <button
          type="button"
          onClick={async () => {
            await sair();
            onSaiu();
          }}
          className="inline-flex items-center gap-1.5 text-sm text-co-warm-brown/80 underline-offset-4 hover:text-co-warm-terracotta hover:underline"
        >
          <LogOut className="h-4 w-4" /> Sair
        </button>
      </div>
    );
  }

  const t = { titulo: titulo ?? TEXTOS[variante].titulo, texto: texto ?? TEXTOS[variante].texto };

  if (!aberto) {
    return (
      <button type="button" onClick={() => setAberto(true)} className="text-[15px] font-medium text-co-warm-terracotta underline underline-offset-4">
        {t.titulo} Entrar
      </button>
    );
  }

  const enviar = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setErro("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return setErro("Digite um e-mail válido.");
    setEnviando(true);
    const falha = await entrarComEmail(email, destino);
    setEnviando(false);
    if (falha) return setErro(falha);
    setEnviado(true);
    registrarEvento("caminho_login_link_enviado", { origem: origem ?? variante });
  };

  return (
    <div className="rounded-md border-2 border-co-warm-sand-dark p-5">
      {enviado ? (
        <div role="status">
          <p className="flex items-center gap-2 font-semibold">
            <Mail className="h-5 w-5 text-co-warm-gold" aria-hidden="true" /> Confira seu e-mail
          </p>
          <p className="mt-2 text-[15px] text-co-warm-brown/80">
            Enviamos um link de acesso para <strong>{email}</strong>. Abra o e-mail neste aparelho e toque no link. Se não aparecer em alguns minutos, olhe a caixa de spam.
          </p>
          <button type="button" onClick={() => setEnviado(false)} className="mt-3 text-sm underline underline-offset-4 hover:text-co-warm-terracotta">
            Usar outro e-mail
          </button>
        </div>
      ) : (
        <>
          <p className="font-display text-lg font-semibold">{t.titulo}</p>
          <p className="mt-1 text-[15px] text-co-warm-brown/80">{t.texto}</p>
          <form onSubmit={enviar} className="mt-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]" noValidate>
            <label htmlFor={`conta-email-${variante}`} className="sr-only">
              Seu e-mail
            </label>
            <input
              id={`conta-email-${variante}`}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 w-full min-w-0 rounded-md border-2 border-co-warm-sand-dark bg-white px-3 text-[16px] focus:border-co-warm-brown/50 focus:outline-none"
            />
            <button type="submit" disabled={enviando} className="btn btn-primario">
              {enviando ? "Enviando..." : "Receber link de acesso"}
            </button>
          </form>
          {erro && (
            <p className="mt-2 text-sm text-co-warm-terracotta" role="alert">
              {erro}
            </p>
          )}
          {googleAtivo && (
            <button
              type="button"
              onClick={() => {
                registrarEvento("caminho_login_google", { origem: origem ?? variante });
                entrarComGoogle(destino);
              }}
              className="btn btn-secundario mt-3 w-full"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.6 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h6c-.3 1.4-1 2.5-2.2 3.3v2.7h3.6c2-1.9 3.2-4.7 3.2-8z" /><path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.7c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.8C3.9 20.6 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.8 14.2c-.2-.7-.4-1.4-.4-2.2s.1-1.5.4-2.2V7H2.1C1.4 8.5 1 10.2 1 12s.4 3.5 1.1 5l3.7-2.8z" /><path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2C17.5 2.1 15 1 12 1 7.7 1 3.9 3.4 2.1 7l3.7 2.8c.9-2.6 3.3-4.4 6.2-4.4z" /></svg>
              Entrar com Google
            </button>
          )}
          <p className="mt-3 text-xs text-co-warm-brown/75">
            Usamos o e-mail só para guardar seu progresso. Veja a <a href="/politica-de-privacidade" className="underline">política de privacidade</a>.
          </p>
        </>
      )}
    </div>
  );
}
