import { useState, useRef, useEffect } from "react";
import { Search, Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { functionsUrl, anonAuthHeader } from "@/lib/publicApi";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = functionsUrl("bible-chat");

const suggestions = [
  "Passagens sobre esperança",
  "Versículos sobre amor",
  "Passagens para momentos difíceis",
  "Versículos sobre família",
  "Passagens sobre perdão",
  "Versículos sobre fé",
];

const formatAssistantContent = (content: string) =>
  content
    .replace(/\\n/g, "\n")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    // Add separator before Bible references
    .replace(/\n(\*{0,2}\s*\d?\s?[A-Za-zÀ-ÿ]+(?:\s+[A-Za-zÀ-ÿ]+){0,4}\s+\d+:\d+(?:[-–]\d+)?\s*\*{0,2})/g, "\n\n---\n\n$1")
    .replace(/(---\s*\n\s*){2,}/g, "---\n\n");

async function streamChat({
  messages,
  onDelta,
  onDone,
  signal,
}: {
  messages: Msg[];
  onDelta: (text: string) => void;
  onDone: () => void;
  signal?: AbortSignal;
}) {
  try { (window as unknown as { track?: (n: string, p?: Record<string, unknown>) => void }).track?.("pergunta_biblia"); } catch { /* sem GTM */ }
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: anonAuthHeader,
    },
    body: JSON.stringify({ messages }),
    signal,
  });

  if (!resp.ok) {
    const data = await resp.json().catch(() => ({}));
    throw new Error(data.error || "Erro ao conectar com o assistente");
  }

  if (!resp.body) throw new Error("Stream não disponível");

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let done = false;

  while (!done) {
    const { done: readerDone, value } = await reader.read();
    if (readerDone) break;
    buffer += decoder.decode(value, { stream: true });

    let newlineIdx: number;
    while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
      let line = buffer.slice(0, newlineIdx);
      buffer = buffer.slice(newlineIdx + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;

      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") { done = true; break; }

      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) onDelta(content);
      } catch {
        buffer = line + "\n" + buffer;
        break;
      }
    }
  }

  // flush
  if (buffer.trim()) {
    for (let raw of buffer.split("\n")) {
      if (!raw) continue;
      if (raw.endsWith("\r")) raw = raw.slice(0, -1);
      if (!raw.startsWith("data: ")) continue;
      const jsonStr = raw.slice(6).trim();
      if (jsonStr === "[DONE]") continue;
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) onDelta(content);
      } catch { /* ignore */ }
    }
  }

  onDone();
}

export default function BibleChat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatScrollRef.current) chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
  }, [messages]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    setError("");
    const updated: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(updated);
    setInput("");
    setIsLoading(true);

    let soFar = "";
    const upsert = (chunk: string) => {
      soFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: soFar } : m));
        return [...prev, { role: "assistant", content: soFar }];
      });
    };

    try {
      await streamChat({ messages: updated, onDelta: upsert, onDone: () => setIsLoading(false) });
    } catch (e: unknown) {
      setIsLoading(false);
      setError(e instanceof Error ? e.message : "Erro ao buscar passagem");
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="overflow-hidden rounded-md border border-co-warm-sand-dark bg-co-warm-sand shadow-sm">
      <div ref={chatScrollRef} className="max-h-[500px] min-h-[400px] overflow-y-auto p-5 md:p-6" aria-live="polite">
        {isEmpty ? (
          <div className="flex h-full flex-col items-center justify-center py-8">
            <p className="mb-6 text-center text-sm text-co-warm-brown/75">Escolha um tema ou digite sua busca abaixo</p>
            <div className="grid w-full max-w-2xl grid-cols-1 gap-2 sm:grid-cols-2">
              {suggestions.map((s) => (
                <button key={s} type="button" onClick={() => send(s)} className="flex min-h-11 w-full items-center justify-center rounded-md border border-co-warm-terracotta/20 bg-white px-4 py-2 text-center text-[15px] text-co-warm-brown/85 transition-all hover:border-co-warm-terracotta/40 hover:bg-co-warm-terracotta/10 hover:text-co-warm-terracotta">
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[90%] rounded-md px-5 py-3.5 ${msg.role === "user" ? "rounded-br-md bg-co-warm-terracotta text-co-warm-sand" : "rounded-bl-md border border-co-warm-terracotta/10 bg-co-warm-sand"}`}>
                  {msg.role === "assistant" ? (
                    <div className="bible-chat-prose prose prose-sm max-w-none break-words text-co-warm-brown prose-headings:mt-4 prose-headings:text-co-warm-brown prose-headings:first:mt-0 prose-p:my-1.5 prose-blockquote:my-2 prose-blockquote:border-co-warm-terracotta/30 prose-blockquote:text-co-warm-brown/80 prose-strong:text-co-warm-brown prose-hr:my-3">
                      <ReactMarkdown remarkPlugins={[remarkBreaks]}>{formatAssistantContent(msg.content)}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm">{msg.content}</p>
                  )}
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start">
                <div className="rounded-md rounded-bl-md border border-co-warm-terracotta/10 bg-co-warm-sand px-5 py-3.5">
                  <Loader2 className="h-5 w-5 animate-spin text-co-warm-terracotta" aria-label="Carregando" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="border-t border-co-warm-terracotta/10 bg-red-50 px-4 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <div className="border-t border-co-warm-terracotta/10 bg-co-warm-sand/50 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-co-warm-brown/40" aria-hidden="true" />
            <label htmlFor="biblia-busca" className="sr-only">
              Buscar passagem na Bíblia
            </label>
            <input
              id="biblia-busca"
              type="text"
              placeholder="Ex: passagens sobre gratidão..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="w-full rounded-full border border-co-warm-terracotta/20 bg-co-warm-sand py-3 pl-10 pr-4 text-sm text-co-warm-brown placeholder:text-co-warm-brown/40 focus:border-co-warm-terracotta/40 focus:outline-none disabled:opacity-50"
            />
          </div>
          <button type="submit" disabled={isLoading || !input.trim()} aria-label="Enviar" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-co-warm-terracotta text-co-warm-sand hover:bg-co-warm-terracotta/90 disabled:opacity-50">
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
