import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2, Globe, CheckCircle, Sparkles, RefreshCw } from "lucide-react";

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const SaintsScraper = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState<{ month: number; day: number; saints: number }[]>([]);
  const [genResults, setGenResults] = useState<{ generated: number; errors: number; total: number } | null>(null);
  const [genLog, setGenLog] = useState<{ name: string; date: string; success: boolean }[]>([]);

  const handleScrape = async (scrapeAll = false) => {
    setLoading(true);
    setResults([]);

    try {
      const body: Record<string, unknown> = {};
      if (scrapeAll) {
        body.scrapeAll = true;
      } else if (selectedMonth) {
        body.month = parseInt(selectedMonth);
      } else {
        toast.error("Selecione um mês");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke("scrape-saints", { body });

      if (error) throw error;

      setResults(data.results || []);
      const totalSaints = (data.results || []).reduce((sum: number, r: { saints: number }) => sum + r.saints, 0);
      toast.success(`Scraping concluído! ${totalSaints} santos encontrados.`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      toast.error(`Erro no scraping: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateContent = async (options: { regenerateAll?: boolean; onlyEmpty?: boolean }) => {
    if (!selectedMonth && !options.regenerateAll) {
      toast.error("Selecione um mês ou use 'Gerar ano inteiro'");
      return;
    }

    setGenerating(true);
    setGenResults(null);
    setGenLog([]);

    try {
      const body: Record<string, unknown> = {
        onlyEmpty: options.onlyEmpty ?? true,
      };

      if (options.regenerateAll) {
        body.regenerateAll = true;
      } else if (selectedMonth) {
        body.month = parseInt(selectedMonth);
      }

      // Process in batches to avoid timeout
      let totalGenerated = 0;
      let totalErrors = 0;
      let totalProcessed = 0;
      let batchCount = 0;

      // eslint-disable-next-line no-constant-condition
      while (true) {
        batchCount++;
        toast.info(`Processando lote ${batchCount}...`);

        const { data, error } = await supabase.functions.invoke("generate-saint-content", { 
          body: { ...body, maxBatchSize: 5 }
        });

        if (error) throw error;

        totalGenerated += data.generated || 0;
        totalErrors += data.errors || 0;
        totalProcessed += data.total || 0;

        // Append saints from this batch to the log
        if (data.generatedSaints && Array.isArray(data.generatedSaints)) {
          setGenLog((prev) => [...prev, ...data.generatedSaints]);
        }

        // If this batch generated nothing, we're done
        if (!data.generated || data.generated === 0) {
          break;
        }

        // Small delay between batches
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      setGenResults({ generated: totalGenerated, errors: totalErrors, total: totalProcessed });
      toast.success(`Geração concluída! ${totalGenerated} conteúdos gerados em ${batchCount} lotes, ${totalErrors} erros.`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      toast.error(`Erro na geração: ${message}`);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Santos do Dia — Scraper do Vaticano</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Importa os santos do dia direto do site Vatican News (vaticannews.va).
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="space-y-1.5">
          <label htmlFor="saints-month" className="text-sm font-medium">Mês</label>
          <select
            id="saints-month"
            value={selectedMonth}
            onChange={(event) => setSelectedMonth(event.target.value)}
            className="flex h-10 w-48 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
          >
            <option value="">Selecione o mês</option>
            {MONTH_NAMES.map((name, i) => (
              <option key={i + 1} value={String(i + 1)}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <Button onClick={() => handleScrape(false)} disabled={loading || generating || !selectedMonth}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Globe className="mr-2 h-4 w-4" />}
          Importar mês
        </Button>

        <Button variant="outline" onClick={() => handleScrape(true)} disabled={loading || generating}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Globe className="mr-2 h-4 w-4" />}
          Importar ano inteiro
        </Button>
      </div>

      {/* AI Content Generation Section */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Gerar Conteúdo Original com IA
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            A IA reescreve o conteúdo do Vaticano de forma original, evitando penalização SEO por conteúdo duplicado.
            Gera artigos completos com biografia, espiritualidade, reflexão e oração.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => handleGenerateContent({ onlyEmpty: true })}
            disabled={loading || generating || !selectedMonth}
            className="bg-primary"
          >
            {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Gerar mês (só vazios)
          </Button>

          <Button
            variant="outline"
            onClick={() => handleGenerateContent({ onlyEmpty: false })}
            disabled={loading || generating || !selectedMonth}
          >
            {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Regenerar mês inteiro
          </Button>

          <Button
            variant="outline"
            onClick={() => handleGenerateContent({ regenerateAll: true, onlyEmpty: true })}
            disabled={loading || generating}
          >
            {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Gerar ano inteiro (só vazios)
          </Button>
        </div>
      </div>

      {loading && (
        <p className="text-sm text-muted-foreground">
          Importando santos do Vaticano… Isso pode levar alguns minutos.
        </p>
      )}

      {generating && (
        <p className="text-sm text-muted-foreground">
          Gerando conteúdo original com IA… Cada santo leva ~3 segundos. Isso pode levar vários minutos.
        </p>
      )}

      {genLog.length > 0 && (
        <div className="rounded-lg border p-4 space-y-2 max-h-64 overflow-y-auto">
          <h3 className="font-semibold text-sm">Log de geração</h3>
          <div className="space-y-1 text-sm">
            {genLog.map((entry, i) => (
              <div key={i} className="flex items-center gap-2">
                <span>{entry.success ? "✅" : "❌"}</span>
                <span className="text-muted-foreground">{entry.date}</span>
                <span>{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {genResults && (
        <div className="rounded-lg border p-4 bg-green-50 dark:bg-green-950/20">
          <h3 className="mb-2 font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-green-600" />
            Resultado da Geração IA
          </h3>
          <div className="text-sm space-y-1">
            <p>✅ <strong>{genResults.generated}</strong> conteúdos gerados com sucesso</p>
            {genResults.errors > 0 && (
              <p>❌ <strong>{genResults.errors}</strong> erros</p>
            )}
            <p className="text-muted-foreground">Total de santos processados: {genResults.total}</p>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="rounded-lg border p-4">
          <h3 className="mb-2 font-semibold">Resultados do Scraping</h3>
          <div className="grid grid-cols-2 gap-1 text-sm sm:grid-cols-4 md:grid-cols-6">
            {results.map((r) => (
              <div key={`${r.month}-${r.day}`} className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>
                  {String(r.day).padStart(2, "0")}/{String(r.month).padStart(2, "0")} — {r.saints} santo{r.saints !== 1 ? "s" : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SaintsScraper;
