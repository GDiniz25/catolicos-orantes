import { useState } from "react";
import { Send, MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { insertRow } from "@/lib/publicApi";
import { isEmail, formatWhatsapp, whatsappOk } from "./formUtils";

const CATEGORIES = [
  { value: "correcao", label: "Correção de texto" },
  { value: "sugestao-conteudo", label: "Sugestão de conteúdo" },
  { value: "solicitacao", label: "Solicitação de tema" },
  { value: "erro-informacao", label: "Erro de informação" },
  { value: "melhoria", label: "Melhoria no site" },
  { value: "elogio", label: "Elogio / Agradecimento" },
  { value: "outro", label: "Outro" },
];

const field = "border-co-warm-terracotta/20 bg-co-warm-sand focus-visible:ring-co-warm-terracotta";

export default function SugestoesForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [category, setCategory] = useState("");
  const [contentRef, setContentRef] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const reset = () => {
    setSent(false);
    setName("");
    setEmail("");
    setWhatsapp("");
    setCategory("");
    setContentRef("");
    setMessage("");
    setError("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) return setError("Nome é obrigatório");
    if (email.trim() && !isEmail(email)) return setError("E-mail inválido");
    if (!whatsappOk(whatsapp)) return setError("WhatsApp incompleto. Preencha o número completo.");
    if (!category) return setError("Selecione uma categoria");
    if (!message.trim()) return setError("Escreva sua mensagem");

    setSending(true);
    try {
      await insertRow("user_suggestions", {
        name: name.trim().slice(0, 100),
        email: email.trim() || null,
        whatsapp: whatsapp.trim() || null,
        category,
        content_reference: contentRef.trim().slice(0, 500) || null,
        message: message.trim().slice(0, 3000),
      });
      setSent(true);
    } catch {
      setError("Erro ao enviar. Tente novamente.");
    }
    setSending(false);
  };

  if (sent) {
    return (
      <div className="rounded-md border border-co-warm-terracotta/20 bg-co-warm-sand p-8 text-center" role="status">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-co-warm-terracotta/10">
          <MessageSquarePlus className="h-8 w-8 text-co-warm-terracotta" />
        </div>
        <p className="mb-2 font-display text-2xl font-bold">Mensagem Enviada!</p>
        <p className="mb-6 text-co-warm-brown/80">Agradecemos sua contribuição. Vamos analisar sua mensagem com atenção.</p>
        <Button type="button" onClick={reset} variant="outline" className="border-co-warm-terracotta/30 text-co-warm-terracotta hover:bg-co-warm-terracotta/5">
          Enviar outra mensagem
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-6 rounded-md border border-co-warm-sand-dark bg-co-warm-sand p-6 md:p-10">
      <div className="space-y-2">
        <label htmlFor="sg-name" className="font-medium text-co-warm-brown">
          Nome <span className="text-co-warm-terracotta">*</span>
        </label>
        <Input id="sg-name" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} required autoComplete="name" className={field} />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="sg-email" className="font-medium text-co-warm-brown">
            E-mail <span className="text-xs text-co-warm-brown/75">(opcional)</span>
          </label>
          <Input id="sg-email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} autoComplete="email" className={field} />
        </div>
        <div className="space-y-2">
          <label htmlFor="sg-whatsapp" className="font-medium text-co-warm-brown">
            WhatsApp <span className="text-xs text-co-warm-brown/75">(opcional)</span>
          </label>
          <Input id="sg-whatsapp" type="tel" placeholder="(11) 99999-9999" value={whatsapp} onChange={(e) => setWhatsapp(formatWhatsapp(e.target.value))} maxLength={15} autoComplete="tel" className={field} />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="sg-category" className="font-medium text-co-warm-brown">
          Categoria <span className="text-co-warm-terracotta">*</span>
        </label>
        <select id="sg-category" value={category} onChange={(e) => setCategory(e.target.value)} required className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 ${field}`}>
          <option value="" disabled>
            Selecione uma categoria
          </option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <label htmlFor="sg-ref" className="font-medium text-co-warm-brown">
          Conteúdo relacionado <span className="text-xs text-co-warm-brown/75">(opcional)</span>
        </label>
        <Input id="sg-ref" placeholder="Ex: nome do artigo, página ou link" value={contentRef} onChange={(e) => setContentRef(e.target.value)} maxLength={500} className={field} />
      </div>
      <div className="space-y-2">
        <label htmlFor="sg-message" className="font-medium text-co-warm-brown">
          Mensagem <span className="text-co-warm-terracotta">*</span>
        </label>
        <Textarea id="sg-message" placeholder="Descreva sua sugestão, correção ou solicitação" value={message} onChange={(e) => setMessage(e.target.value)} maxLength={3000} rows={6} required className={`${field} resize-none`} />
        <p className="text-right text-xs text-co-warm-brown/75">{message.length}/3000</p>
      </div>
      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" disabled={sending} className="h-11 w-full bg-co-warm-terracotta text-co-warm-sand hover:bg-co-warm-terracotta-light">
        {sending ? "Enviando..." : (<><Send className="mr-2 h-4 w-4" /> Enviar Mensagem</>)}
      </Button>
    </form>
  );
}
