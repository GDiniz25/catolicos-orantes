import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { renderToStaticMarkup } from "react-dom/server";

/** Renderiza markdown no build (sem JavaScript no navegador). O corpo nunca gera um segundo h1. */
export default function Markdown({ content, className }: { content: string; className?: string }) {
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkBreaks]} components={{ h1: "h2" }}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

/**
 * Mesma coisa, mas como texto HTML pronto, para usar com set:html no Astro.
 * Evita o caminho de streaming do React no build, que às vezes inseria um byte nulo
 * (\u0000) antes de letras acentuadas.
 */
export function markdownParaHtml(content: string, className?: string): string {
  return renderToStaticMarkup(<Markdown content={content} className={className} />).replace(/\u0000/g, "");
}
