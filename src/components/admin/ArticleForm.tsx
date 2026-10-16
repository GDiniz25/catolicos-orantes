import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import RichTextEditor from '@/components/admin/RichTextEditor';
import type { Article, CategorySlug } from '@/types/content';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories: { value: CategorySlug; label: string }[] = [
  { value: 'como-rezar-o-terco', label: 'Como Rezar o Terço' },
  { value: 'santos-e-oracoes', label: 'Santos e Orações' },
  { value: 'milagres-eucaristicos', label: 'Milagres Eucarísticos' },
  { value: 'catecismo', label: 'Catecismo' },
  { value: 'liturgia-das-horas', label: 'Liturgia das Horas' },
  { value: 'novenas', label: 'Novenas' },
  { value: 'sacramentos', label: 'Sacramentos' },
  { value: 'devocoes-marianas', label: 'Devoções Marianas' },
  { value: 'calendario-liturgico', label: 'Calendário Litúrgico' },
  { value: 'exame-de-consciencia', label: 'Exame de Consciência' },
  { value: 'oracoes-do-dia-a-dia', label: 'Orações do Dia a Dia' },
  { value: 'documentos-da-igreja', label: 'Documentos da Igreja' },
  { value: 'ladainhas', label: 'Ladainhas' },
  { value: 'duvidas-da-fe', label: 'Dúvidas da Fé' },
  { value: 'vida-espiritual', label: 'Vida Espiritual' },
  { value: 'primeiros-passos', label: 'Primeiros Passos na Fé' },
  { value: 'casamento', label: 'Casamento Católico' },
];

interface ArticleFormProps {
  article?: Article | null;
}

const generateSlug = (title: string) =>
  title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const ArticleForm = ({ article }: ArticleFormProps) => {
  const navigate = useNavigate();
  const isEditing = !!article;

  const [title, setTitle] = useState(article?.title ?? '');
  const [slug, setSlug] = useState(article?.slug ?? '');
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? '');
  const [content, setContent] = useState(article?.content ?? '');
  const [category, setCategory] = useState<string>(article?.category ?? '');
  const [imageUrl, setImageUrl] = useState(article?.image_url ?? '');
  const [published, setPublished] = useState(article?.published ?? false);
  const [saving, setSaving] = useState(false);
  const [autoSlug, setAutoSlug] = useState(!isEditing);

  useEffect(() => {
    if (autoSlug && title) {
      setSlug(generateSlug(title));
    }
  }, [title, autoSlug]);

  const handleSave = async () => {
    if (!title.trim()) { toast.error('Título é obrigatório'); return; }
    if (!slug.trim()) { toast.error('Slug é obrigatório'); return; }
    if (!category) { toast.error('Categoria é obrigatória'); return; }

    setSaving(true);

    const data = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim(),
      content,
      category,
      image_url: imageUrl.trim() || null,
      published,
    };

    let error;
    if (isEditing) {
      ({ error } = await supabase.from('articles').update(data).eq('id', article.id));
    } else {
      ({ error } = await supabase.from('articles').insert(data));
    }

    setSaving(false);

    if (error) {
      toast.error(`Erro ao salvar: ${error.message}`);
    } else {
      toast.success(isEditing ? 'Artigo atualizado!' : 'Artigo criado!');
      navigate('/admin');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch checked={published} onCheckedChange={setPublished} id="published" />
            <Label htmlFor="published" className="text-sm">
              {published ? 'Publicado' : 'Rascunho'}
            </Label>
          </div>
          <Button onClick={handleSave} disabled={saving} className="bg-co-warm-terracotta hover:bg-co-warm-terracotta-light">
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título do artigo"
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL)</Label>
            <div className="flex gap-2">
              <Input
                id="slug"
                value={slug}
                onChange={(e) => { setSlug(e.target.value); setAutoSlug(false); }}
                placeholder="titulo-do-artigo"
                maxLength={200}
              />
              {!autoSlug && (
                <Button type="button" variant="outline" size="sm" onClick={() => { setAutoSlug(true); setSlug(generateSlug(title)); }}>
                  Auto
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Resumo</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Breve descrição do artigo para listagens e SEO"
              rows={3}
              maxLength={500}
            />
          </div>

          <div className="space-y-2">
            <Label>Conteúdo</Label>
            <RichTextEditor content={content} onChange={setContent} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">URL da imagem de capa</Label>
            <Input
              id="image_url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              maxLength={500}
            />
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Preview"
                className="mt-2 h-32 w-full rounded-lg object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleForm;
