import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { readyArticles as list, firstBatch, persistReadyCover } from '@/lib/readyArticles';
import { stripArticleMedia } from '@/lib/articleMedia';

const ImportReadyArticles = () => {
  const [existing, setExisting] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const load = async () => {
    const { data } = await supabase.from('articles').select('slug').in('slug', list.map((a) => a.slug));
    setExisting(new Set((data ?? []).map((r: { slug: string }) => r.slug)));
  };

  useEffect(() => { load(); }, []);

  const pending = list.filter((a) => !existing.has(a.slug));

  const importAll = async () => {
    setBusy(true);
    setMsg('');
    try {
    // Schedule one per day after the latest already-scheduled article
    const { data: last, error: scheduleError } = await supabase
      .from('articles')
      .select('scheduled_publish_at')
      .not('scheduled_publish_at', 'is', null)
      .order('scheduled_publish_at', { ascending: false })
      .limit(1);
    if (scheduleError) throw scheduleError;
    const base = new Date();
    const lastDate = last?.[0]?.scheduled_publish_at ? new Date(last[0].scheduled_publish_at) : null;
    const start = lastDate && lastDate > base ? lastDate : base;
    const rows = [];
    for (const [i, a] of pending.entries()) {
      setMsg(`Salvando artigo ${i + 1} de ${pending.length}…`);
      const image_url = await persistReadyCover(a);
      const d = new Date(start);
      d.setUTCDate(d.getUTCDate() + i + 1);
      d.setUTCHours(6, 0, 0, 0);
      rows.push({ ...a, image_url, content: stripArticleMedia(a.content), published: false, scheduled_publish_at: d.toISOString() });
    }
    const { error } = await supabase.from('articles').insert(rows);
    if (error) throw error;
    setMsg(`${rows.length} artigos salvos como rascunho, com publicação de 1 por dia.`);
    await load();
    } catch (error) {
      setMsg('Erro ao importar: ' + (error instanceof Error ? error.message : 'Não foi possível salvar os artigos.'));
    } finally {
      setBusy(false);
    }
  };

  const updateImages = async () => {
    setBusy(true);
    try {
      for (const a of list.filter((item) => existing.has(item.slug))) {
        setMsg(`Salvando imagem: ${a.title}…`);
        const image_url = await persistReadyCover(a);
        const { data, error: readError } = await supabase.from('articles').select('content').eq('slug', a.slug).single();
        if (readError || !data) throw readError ?? new Error('Artigo não encontrado.');
        const content = stripArticleMedia(data.content ?? '');
        const { error } = await supabase.from('articles').update({ image_url, image_alt: a.image_alt, content }).eq('slug', a.slug);
        if (error) throw error;
      }
      setMsg('Imagens adicionadas aos artigos já importados; datas de publicação preservadas.');
    } catch (error) {
      setMsg(error instanceof Error ? error.message : 'Não foi possível salvar as imagens.');
    } finally {
      setBusy(false);
    }
  };

  const publishFirstBatch = async () => {
    setBusy(true);
    try {
      for (const a of firstBatch) {
        setMsg(`Publicando: ${a.title}…`);
        const { data, error: readError } = await supabase.from('articles').select('id, content, image_url').eq('slug', a.slug).maybeSingle();
        if (readError) throw readError;
        if (data) {
          const { error } = await supabase.from('articles').update({ published: true, scheduled_publish_at: null, content: stripArticleMedia(data.content ?? a.content) }).eq('id', data.id);
          if (error) throw error;
        } else {
          const image_url = await persistReadyCover(a);
          const { error } = await supabase.from('articles').insert({ ...a, image_url, content: stripArticleMedia(a.content), published: true, scheduled_publish_at: null });
          if (error) throw error;
        }
      }
      setMsg('Os cinco artigos de batismo foram publicados, somente com imagens de capa.');
      await load();
    } catch (error) {
      setMsg('Não foi possível concluir a publicação: ' + (error instanceof Error ? error.message : 'Tente novamente.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-2xl font-semibold">Artigos prontos</h1>
      <p className="text-muted-foreground">
        Artigos já redigidos e revisados. Eles entram como rascunho e são publicados automaticamente, um por dia.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button onClick={publishFirstBatch} disabled={busy}>Publicar os 5 artigos de batismo</Button>
        <Button variant="outline" onClick={importAll} disabled={busy || pending.length === 0}>
          {busy ? 'Salvando…' : pending.length === 0 ? 'Todos já importados' : `Agendar ${pending.length} artigos restantes`}
        </Button>
      </div>
      {msg && <p className="text-sm" role="status">{msg}</p>}
      <ul className="space-y-6 text-sm">
        {list.map((a) => (
          <li key={a.slug}>
            {a.image_url && <img src={a.image_url} alt={a.image_alt} width={1280} height={768} loading="lazy" className="mb-2 aspect-[5/3] w-full rounded-md object-cover" />}
            <details>
              <summary className="cursor-pointer font-semibold">{existing.has(a.slug) ? '✓ ' : '• '}{a.title}</summary>
              <div className="article-prose mt-4" dangerouslySetInnerHTML={{ __html: stripArticleMedia(a.content) }} />
            </details>
          </li>
        ))}
      </ul>
      {existing.size > 0 && <Button variant="outline" onClick={updateImages} disabled={busy}>Adicionar imagens aos já importados</Button>}
      {msg && <p className="text-sm">{msg}</p>}
    </div>
  );
};

export default ImportReadyArticles;
