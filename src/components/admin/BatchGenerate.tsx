import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { generateArticle, categoryTopics, categoryLabelsMap } from '@/lib/gemini';
import { uploadArticleImages } from '@/lib/storage';
import { generateSitemap, downloadSitemap, pingSitemapToSearchEngines } from '@/lib/sitemap';
import { regenerateAllImagesInCategory } from '@/lib/replaceImages';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowLeft, Sparkles, Check, X, Loader2, Download, RefreshCw, ChevronsUpDown } from 'lucide-react';
import { toast } from 'sonner';
import type { CategorySlug } from '@/types/content';
import { cn } from '@/lib/utils';

// Use categoryLabelsMap from gemini.ts

const generateSlug = (title: string) =>
  title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

// Extract core keywords from a topic/title for fuzzy matching
const extractKeywords = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .sort()
    .join(' ');

// Check if an existing title is too similar to the topic
const isSimilarTitle = (existingTitle: string, topic: string) => {
  const existingKw = extractKeywords(existingTitle);
  const topicKw = extractKeywords(topic);
  if (!topicKw) return false;
  const topicWords = topicKw.split(' ');
  const matchCount = topicWords.filter((w) => existingKw.includes(w)).length;
  return matchCount / topicWords.length >= 0.6;
};

type TopicStatus = 'pending' | 'generating' | 'done' | 'error' | 'published';

interface TopicState {
  topic: string;
  selected: boolean;
  status: TopicStatus;
  error?: string;
}

const BatchGenerate = () => {
  const [category, setCategory] = useState<string>('');
  const [topics, setTopics] = useState<TopicState[]>([]);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [publishAfter, setPublishAfter] = useState(false);
  const [replacingImages, setReplacingImages] = useState(false);
  const [replaceProgress, setReplaceProgress] = useState('');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [generatingAll, setGeneratingAll] = useState(false);
  const [allProgress, setAllProgress] = useState('');
  const [allCategoryIndex, setAllCategoryIndex] = useState(0);
  const [allTotalCategories, setAllTotalCategories] = useState(0);

  const handleCategoryChange = async (value: string) => {
    setCategory(value);
    const catTopics = categoryTopics[value] ?? [];

    // Fetch existing articles (slug + title) to detect already-published topics
    const { data: existingArticles } = await supabase
      .from('articles')
      .select('slug, title')
      .eq('category', value);

    const existingSlugs = new Set(
      (existingArticles ?? []).map((a) => a.slug)
    );
    const existingTitles = (existingArticles ?? []).map((a) => a.title);

    setTopics(
      catTopics.map((t) => {
        const predictedSlug = generateSlug(t);
        const slugExists = existingSlugs.has(predictedSlug);
        const titleExists = existingTitles.some((et) => isSimilarTitle(et, t));
        const alreadyExists = slugExists || titleExists;
        return {
          topic: t,
          selected: !alreadyExists,
          status: alreadyExists ? 'published' as TopicStatus : 'pending' as TopicStatus,
        };
      })
    );
  };

  const toggleTopic = (index: number) => {
    setTopics((prev) =>
      prev.map((t, i) => (i === index ? { ...t, selected: !t.selected } : t))
    );
  };

  const toggleAll = () => {
    const selectableTopics = topics.filter((t) => t.status !== 'published');
    const allSelected = selectableTopics.every((t) => t.selected);
    setTopics((prev) =>
      prev.map((t) =>
        t.status === 'published' ? t : { ...t, selected: !allSelected }
      )
    );
  };

  const selectedCount = topics.filter((t) => t.selected).length;

  const getNextScheduledDate = async (offset: number): Promise<string> => {
    // Get the latest scheduled_publish_at from existing articles
    const { data } = await supabase
      .from('articles')
      .select('scheduled_publish_at')
      .not('scheduled_publish_at', 'is', null)
      .eq('published', false)
      .order('scheduled_publish_at', { ascending: false })
      .limit(1);

    const lastDate = data?.[0]?.scheduled_publish_at
      ? new Date(data[0].scheduled_publish_at)
      : new Date();

    // Start from tomorrow or day after last scheduled
    const baseDate = new Date(Math.max(lastDate.getTime(), Date.now()));
    baseDate.setDate(baseDate.getDate() + 1 + offset);
    baseDate.setHours(6, 0, 0, 0); // 6am UTC
    return baseDate.toISOString();
  };

  const handleGenerate = async () => {
    const selected = topics.filter((t) => t.selected);
    if (selected.length === 0) {
      toast.error('Selecione pelo menos um tema');
      return;
    }

    setGenerating(true);
    setProgress(0);

    let completed = 0;
    let scheduledOffset = 0;

    for (let i = 0; i < topics.length; i++) {
      if (!topics[i].selected) continue;

      // Update status to generating
      setTopics((prev) =>
        prev.map((t, idx) => (idx === i ? { ...t, status: 'generating' } : t))
      );

      try {
        // Fetch existing articles from DB for internal linking
        const { data: existingArticles } = await supabase
          .from('articles')
          .select('title, slug, category')
          .eq('published', true);

        // Build allTopics context for internal linking
        const allTopics = Object.entries(categoryTopics).map(([slug, topicList]) => ({
          category: categoryLabelsMap[slug] ?? slug,
          categorySlug: slug,
          topics: topicList,
        }));

        const article = await generateArticle(
          categoryLabelsMap[category] ?? category,
          topics[i].topic,
          allTopics,
          existingArticles ?? []
        );

        // Upload images to Supabase Storage
        const storedImages = await uploadArticleImages(
          article.unsplashImages,
          article.slug
        );

        // Replace Unsplash URLs with Storage URLs in article content
        let finalContent = article.content;
        for (let j = 0; j < article.unsplashImages.length; j++) {
          const originalUrl = article.unsplashImages[j].url;
          const storedUrl = storedImages[j]?.url;
          if (storedUrl && storedUrl !== originalUrl) {
            finalContent = finalContent.split(originalUrl).join(storedUrl);
          }
        }

        // Use first stored image as cover
        const coverImage = storedImages[0]?.url || null;

        // Check if slug or similar title already exists before inserting
        const { data: existingSlug } = await supabase
          .from('articles')
          .select('id, title')
          .eq('category', category)
          .or(`slug.eq.${article.slug}`)
          .limit(10);

        const alreadyExists = existingSlug && existingSlug.length > 0 && (
          existingSlug.some((a) => a.id) && (
            existingSlug.some((a) => generateSlug(a.title) === article.slug) ||
            existingSlug.some((a) => isSimilarTitle(a.title, article.title))
          )
        );

        // Also do a broader title similarity check
        const { data: catArticles } = await supabase
          .from('articles')
          .select('title')
          .eq('category', category);

        const titleDuplicate = (catArticles ?? []).some((a) => isSimilarTitle(a.title, article.title));

        if (alreadyExists || titleDuplicate) {
          toast.info(`Artigo "${article.title}" já existe (similar), pulando...`);
          setTopics((prev) =>
            prev.map((t, idx) => (idx === i ? { ...t, status: 'published', selected: false } : t))
          );
          completed++;
          setProgress(Math.round((completed / selected.length) * 100));
          continue;
        }

        // Calculate scheduled date if publishing is enabled
        const scheduledDate = publishAfter ? await getNextScheduledDate(scheduledOffset) : null;
        if (publishAfter) scheduledOffset++;

        // Save to Supabase
        const { error } = await supabase.from('articles').insert({
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          meta_description: article.meta_description,
          image_alt: article.image_alt,
          image_url: coverImage,
          content: finalContent,
          category,
          published: false,
          scheduled_publish_at: scheduledDate,
        } as any);

        if (error) throw new Error(error.message);

        setTopics((prev) =>
          prev.map((t, idx) => (idx === i ? { ...t, status: 'done' } : t))
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro desconhecido';
        setTopics((prev) =>
          prev.map((t, idx) =>
            idx === i ? { ...t, status: 'error', error: message } : t
          )
        );
      }

      completed++;
      setProgress(Math.round((completed / selected.length) * 100));

      // Delay between articles to avoid Gemini & Unsplash rate limiting
      if (completed < selected.length) {
        await new Promise((r) => setTimeout(r, 8000));
      }
    }

    setGenerating(false);
    const doneCount = topics.filter((t) => t.status === 'done').length;
    if (publishAfter) {
      toast.success(`${doneCount} artigo(s) agendado(s) para publicação diária!`);
    } else {
      toast.success(`${doneCount} artigo(s) gerado(s) como rascunho!`);
    }
    
    // Ping search engines about sitemap update
    if (doneCount > 0 && !publishAfter) {
      pingSitemapToSearchEngines().then(() => {
        toast.info('Para colocar no ar, publique os artigos e clique em "Publicar alterações no site".');
      });
    }
  };

  const statusIcon = (status: TopicStatus) => {
    switch (status) {
      case 'generating':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'done':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'published':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'error':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const handleDownloadSitemap = async () => {
    try {
      const xml = await generateSitemap();
      downloadSitemap(xml);
      toast.success('Sitemap gerado e baixado!');
    } catch {
      toast.error('Erro ao gerar sitemap');
    }
  };

  const handleReplaceDuplicateImages = async () => {
    if (!category) {
      toast.error('Selecione uma categoria primeiro');
      return;
    }
    setReplacingImages(true);
    setReplaceProgress('Regenerando todas as imagens...');
    try {
      const result = await regenerateAllImagesInCategory(
        category,
        (current, total, title) => {
          setReplaceProgress(`Regenerando ${current}/${total}: ${title}`);
        }
      );
      if (result.updated > 0) {
        toast.success(`${result.updated} artigo(s) com imagens novas!`);
      } else {
        toast.info('Nenhum artigo atualizado.');
      }
      if (result.errors.length > 0) {
        result.errors.forEach((e) => toast.error(e));
      }
    } catch (err) {
      toast.error('Erro ao regenerar imagens');
    }
    setReplacingImages(false);
    setReplaceProgress('');
  };

  const handleGenerateAll = async () => {
    const allCategories = Object.keys(categoryTopics);
    setGeneratingAll(true);
    setAllTotalCategories(allCategories.length);
    let totalGenerated = 0;
    let globalScheduledOffset = 0;

    for (let catIdx = 0; catIdx < allCategories.length; catIdx++) {
      const cat = allCategories[catIdx];
      setAllCategoryIndex(catIdx + 1);
      setAllProgress(`Categoria ${catIdx + 1}/${allCategories.length}: ${categoryLabelsMap[cat] ?? cat}`);

      // Fetch existing articles (slug + title) for this category
      const { data: existingArticles } = await supabase
        .from('articles')
        .select('slug, title')
        .eq('category', cat);

      const existingSlugs = new Set(
        (existingArticles ?? []).map((a) => a.slug)
      );
      const existingTitles = (existingArticles ?? []).map((a) => a.title);

      const catTopics = categoryTopics[cat] ?? [];
      const pendingTopics = catTopics.filter((t) => {
        const predictedSlug = generateSlug(t);
        const slugExists = existingSlugs.has(predictedSlug);
        const titleExists = existingTitles.some((et) => isSimilarTitle(et, t));
        return !slugExists && !titleExists;
      });

      if (pendingTopics.length === 0) continue;

      for (let i = 0; i < pendingTopics.length; i++) {
        setAllProgress(`${categoryLabelsMap[cat] ?? cat}: ${i + 1}/${pendingTopics.length} - ${pendingTopics[i]}`);

        try {
          const { data: allExisting } = await supabase
            .from('articles')
            .select('title, slug, category')
            .eq('published', true);

          const allTopicsCtx = Object.entries(categoryTopics).map(([slug, topicList]) => ({
            category: categoryLabelsMap[slug] ?? slug,
            categorySlug: slug,
            topics: topicList,
          }));

          const article = await generateArticle(
            categoryLabelsMap[cat] ?? cat,
            pendingTopics[i],
            allTopicsCtx,
            allExisting ?? []
          );

          // Check slug + title similarity before insert
          const { data: catCheck } = await supabase
            .from('articles')
            .select('slug, title')
            .eq('category', cat);

          const slugDup = (catCheck ?? []).some((a) => a.slug === article.slug);
          const titleDup = (catCheck ?? []).some((a) => isSimilarTitle(a.title, article.title));

          if (slugDup || titleDup) {
            console.log(`Artigo "${article.title}" já existe (similar), pulando...`);
            continue;
          }

          const storedImages = await uploadArticleImages(article.unsplashImages, article.slug);

          let finalContent = article.content;
          for (let j = 0; j < article.unsplashImages.length; j++) {
            const originalUrl = article.unsplashImages[j].url;
            const storedUrl = storedImages[j]?.url;
            if (storedUrl && storedUrl !== originalUrl) {
              finalContent = finalContent.split(originalUrl).join(storedUrl);
            }
          }

          const coverImage = storedImages[0]?.url || null;

          // Calculate scheduled date if publishing is enabled
          const scheduledDate = publishAfter ? await getNextScheduledDate(globalScheduledOffset) : null;
          if (publishAfter) globalScheduledOffset++;

          const { error } = await supabase.from('articles').insert({
            title: article.title,
            slug: article.slug,
            excerpt: article.excerpt,
            meta_description: article.meta_description,
            image_alt: article.image_alt,
            image_url: coverImage,
            content: finalContent,
            category: cat,
            published: false,
            scheduled_publish_at: scheduledDate,
          } as any);

          if (error) throw new Error(error.message);
          totalGenerated++;
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Erro';
          toast.error(`Erro em "${pendingTopics[i]}": ${message}`);
        }

        // Rate limit delay
        if (i < pendingTopics.length - 1) {
          await new Promise((r) => setTimeout(r, 8000));
        }
      }
    }

    setGeneratingAll(false);
    setAllProgress('');
    if (publishAfter) {
      toast.success(`${totalGenerated} artigo(s) agendado(s) para publicação diária!`);
    } else {
      toast.success(`${totalGenerated} artigo(s) gerado(s) como rascunho!`);
    }

    if (totalGenerated > 0 && !publishAfter) {
      pingSitemapToSearchEngines().then(() => {
        toast.info('Para colocar no ar, publique os artigos e clique em "Publicar alterações no site".');
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownloadSitemap}>
            <Download className="mr-2 h-4 w-4" /> Baixar Sitemap
          </Button>
          <Button
            variant="outline"
            onClick={handleReplaceDuplicateImages}
            disabled={replacingImages}
          >
            {replacingImages ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {replaceProgress}</>
            ) : (
              <><RefreshCw className="mr-2 h-4 w-4" /> Regenerar todas as imagens</>
            )}
          </Button>
        </div>
      </div>

      <div>
        <h2 className="flex items-center gap-2 text-2xl font-bold">
          <Sparkles className="h-6 w-6 text-co-warm-terracotta" />
          Gerar Artigos com IA
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Selecione uma categoria e os temas para gerar artigos automaticamente com o Gemini.
        </p>
      </div>

      {/* Botão Gerar Todas as Categorias */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              Gere automaticamente todos os temas pendentes de todas as categorias em fila.
            </p>
            {generatingAll && (
              <div className="rounded-lg border bg-muted/50 p-3 text-sm">
                <p className="font-medium">Categoria {allCategoryIndex}/{allTotalCategories}</p>
                <p className="text-muted-foreground">{allProgress}</p>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Checkbox
                checked={publishAfter}
                onCheckedChange={(checked) => setPublishAfter(!!checked)}
                disabled={generating || generatingAll}
                id="publish-all"
              />
              <label htmlFor="publish-all" className="text-sm">
                Agendar publicação (1 artigo por dia, às 6h UTC)
              </label>
            </div>
            <Button
              onClick={handleGenerateAll}
              disabled={generating || generatingAll}
              className="bg-co-warm-terracotta hover:bg-co-warm-terracotta-light"
              size="lg"
            >
              {generatingAll ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {allProgress}
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Gerar Todas as Categorias (Fila Automática)
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>1. Selecione a categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={categoryOpen}
                className="max-w-md justify-between"
                disabled={generating}
              >
                {category ? categoryLabelsMap[category] : 'Escolha uma categoria...'}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="max-w-md p-0">
              <Command>
                <CommandInput placeholder="Buscar categoria..." />
                <CommandList>
                  <CommandEmpty>Nenhuma categoria encontrada.</CommandEmpty>
                  <CommandGroup>
                    {Object.entries(categoryLabelsMap).map(([value, label]) => (
                      <CommandItem
                        key={value}
                        value={label}
                        onSelect={() => {
                          handleCategoryChange(value);
                          setCategoryOpen(false);
                        }}
                      >
                        <Check className={cn("mr-2 h-4 w-4", category === value ? "opacity-100" : "opacity-0")} />
                        {label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>

      {topics.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>2. Selecione os temas</CardTitle>
                <CardDescription>
                  {selectedCount} de {topics.length} selecionado(s)
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={toggleAll} disabled={generating}>
                {topics.every((t) => t.selected) ? 'Desmarcar todos' : 'Selecionar todos'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topics.map((topic, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 rounded-lg border p-3 ${
                    topic.status === 'published' ? 'bg-muted/50 opacity-70' : ''
                  }`}
                >
                  <Checkbox
                    checked={topic.selected}
                    onCheckedChange={() => toggleTopic(i)}
                    disabled={generating || topic.status === 'published'}
                  />
                  <span className="flex-1 text-sm">{topic.topic}</span>
                  {statusIcon(topic.status)}
                  {topic.status === 'published' && (
                    <Badge variant="secondary" className="text-green-700">
                      Já publicado
                    </Badge>
                  )}
                  {topic.status === 'error' && (
                    <span className="text-xs text-red-500">{topic.error}</span>
                  )}
                  {topic.status === 'done' && (
                    <Badge variant="secondary" className="text-green-700">
                      Criado
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {topics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>3. Configurações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={publishAfter}
                onCheckedChange={(checked) => setPublishAfter(!!checked)}
                disabled={generating}
                id="publish"
              />
              <label htmlFor="publish" className="text-sm">
                Publicar artigos automaticamente após geração
              </label>
            </div>

            {generating && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Gerando artigos...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}

            <Button
              onClick={handleGenerate}
              disabled={generating || selectedCount === 0}
              className="bg-co-warm-terracotta hover:bg-co-warm-terracotta-light"
              size="lg"
            >
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando... ({progress}%)
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Gerar {selectedCount} artigo(s)
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BatchGenerate;
