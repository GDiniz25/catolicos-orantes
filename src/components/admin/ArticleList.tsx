import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2, Eye, EyeOff, FileCheck } from 'lucide-react';
import type { Article } from '@/types/content';
import { toast } from 'sonner';

const ArticleList = () => {
  const queryClient = useQueryClient();

  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: ['admin-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const togglePublish = async (article: Article) => {
    const { error } = await supabase
      .from('articles')
      .update({ published: !article.published })
      .eq('id', article.id);
    if (error) {
      toast.error('Erro ao atualizar');
    } else {
      toast.success(article.published ? 'Despublicado' : 'Publicado');
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
    }
  };

  const deleteArticle = async (id: string) => {
    const { error } = await supabase.from('articles').delete().eq('id', id);
    if (error) {
      toast.error('Erro ao excluir');
    } else {
      toast.success('Artigo excluído');
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
    }
  };

  const categoryLabels: Record<string, string> = {
    'como-rezar-o-terco': 'Terço',
    'santos-e-oracoes': 'Santos',
    'milagres-eucaristicos': 'Milagres',
    'catecismo': 'Catecismo',
    'liturgia-das-horas': 'Liturgia',
    'novenas': 'Novenas',
    'sacramentos': 'Sacramentos',
    'devocoes-marianas': 'Devoções',
    'calendario-liturgico': 'Calendário',
    'exame-de-consciencia': 'Exame',
    'oracoes-do-dia-a-dia': 'Orações',
    'documentos-da-igreja': 'Documentos',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Artigos</h2>
          <p className="text-sm text-muted-foreground">
            {articles?.length ?? 0} artigo(s)
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
        <Button asChild variant="outline">
          <Link to="/admin/prontos">
            <FileCheck className="mr-2 h-4 w-4" /> Artigos prontos
          </Link>
        </Button>
        <Button asChild className="bg-co-warm-terracotta hover:bg-co-warm-terracotta-light">
          <Link to="/admin/novo">
            <Plus className="mr-2 h-4 w-4" /> Novo Artigo
          </Link>
        </Button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : articles && articles.length > 0 ? (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Atualizado</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">{article.title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {categoryLabels[article.category] ?? article.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={article.published ? 'default' : 'outline'}>
                      {article.published ? 'Publicado' : 'Rascunho'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(article.updated_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePublish(article)}
                        title={article.published ? 'Despublicar' : 'Publicar'}
                      >
                        {article.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/admin/editar/${article.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir artigo?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita. O artigo "{article.title}" será removido permanentemente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteArticle(article.id)} className="bg-destructive hover:bg-destructive/90">
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">Nenhum artigo criado ainda.</p>
          <Button asChild className="mt-4 bg-co-warm-terracotta hover:bg-co-warm-terracotta-light">
            <Link to="/admin/novo">
              <Plus className="mr-2 h-4 w-4" /> Criar primeiro artigo
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ArticleList;
