import { useState } from "react";
import { Send, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { insertRow } from "@/lib/publicApi";
import { isEmail, formatWhatsapp, whatsappOk, shareInvite, WhatsappIcon } from "./formUtils";

interface Props {
  /** prefixo dos ids (o formulário pode aparecer na página e no modal) */
  idPrefix?: string;
  rows?: number;
  onSent?: () => void;
}

const fieldClass = "border-co-warm-terracotta/20 bg-co-warm-sand focus-visible:ring-co-warm-terracotta";

export default function PrayerRequestForm({ idPrefix = "po", rows = 5, onSent }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const reset = () => {
    setName("");
    setEmail("");
    setWhatsapp("");
    setMessage("");
    setSent(false);
    setError("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) return setError("Nome é obrigatório");
    if (email.trim() && !isEmail(email)) return setError("E-mail inválido");
    if (!whatsappOk(whatsapp)) return setError("WhatsApp incompleto. Preencha o número completo.");
    if (!message.trim()) return setError("Escreva seu pedido");

    setSending(true);
    try {
      await insertRow("prayer_requests", {
        name: name.trim().slice(0, 100),
        email: email.trim() || null,
        whatsapp: whatsapp.trim() || null,
        message: message.trim().slice(0, 2000),
      });
      setSent(true);
      onSent?.();
      try {
        // Evento de conversão no GA4
        (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "generate_lead", { form: "pedido_de_oracao" });
      } catch {
        /* sem GA */
      }
    } catch {
      setError("Erro ao enviar pedido. Tente novamente.");
    }
    setSending(false);
  };

  if (sent) {
    return (
      <div className="py-6 text-center" role="status">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-co-warm-terracotta/10">
          <Heart className="h-8 w-8 text-co-warm-terracotta" />
        </div>
        <p className="mb-2 font-display text-2xl font-bold text-co-warm-brown">Pedido Enviado!</p>
        <p className="mb-6 text-co-warm-brown/80">Seu pedido de oração foi recebido. Que Deus abençoe você e sua família.</p>
        <div className="flex flex-col gap-3">
          <Button type="button" onClick={shareInvite} className="h-11 w-full bg-[#25D366] text-white hover:bg-[#20bd5a]">
            <WhatsappIcon /> Compartilhar no WhatsApp
          </Button>
          <Button type="button" onClick={reset} variant="outline" className="w-full border-co-warm-terracotta/30 text-co-warm-terracotta hover:bg-co-warm-terracotta/5">
            Enviar outro pedido
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <div className="space-y-2">
        <label htmlFor={`${idPrefix}-name`} className="text-sm font-medium text-co-warm-brown">
          Oração para: <span className="text-co-warm-terracotta">*</span>
        </label>
        <Input id={`${idPrefix}-name`} placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} required autoComplete="name" className={fieldClass} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor={`${idPrefix}-email`} className="text-sm font-medium text-co-warm-brown">
            E-mail <span className="text-xs text-co-warm-brown/75">(opcional)</span>
          </label>
          <Input id={`${idPrefix}-email`} type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} autoComplete="email" className={fieldClass} />
        </div>
        <div className="space-y-2">
          <label htmlFor={`${idPrefix}-whatsapp`} className="text-sm font-medium text-co-warm-brown">
            WhatsApp <span className="text-xs text-co-warm-brown/75">(opcional)</span>
          </label>
          <Input id={`${idPrefix}-whatsapp`} type="tel" inputMode="tel" placeholder="(11) 99999-9999" value={whatsapp} onChange={(e) => setWhatsapp(formatWhatsapp(e.target.value))} maxLength={15} autoComplete="tel" className={fieldClass} />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor={`${idPrefix}-message`} className="text-sm font-medium text-co-warm-brown">
          Pedido de Oração <span className="text-co-warm-terracotta">*</span>
        </label>
        <Textarea id={`${idPrefix}-message`} placeholder="Escreva aqui seu pedido de oração" value={message} onChange={(e) => setMessage(e.target.value)} maxLength={2000} required rows={rows} className={`${fieldClass} resize-none`} />
        <p className="text-right text-xs text-co-warm-brown/75">{message.length}/2000</p>
      </div>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" disabled={sending} className="h-11 w-full bg-co-warm-terracotta text-co-warm-sand hover:bg-co-warm-terracotta-light">
        {sending ? "Enviando..." : (<><Send className="mr-2 h-4 w-4" /> Enviar Pedido de Oração</>)}
      </Button>
    </form>
  );
}
