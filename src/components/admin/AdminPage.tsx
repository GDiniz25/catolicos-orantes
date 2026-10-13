import { useState, useEffect } from 'react';
import { Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';
import AdminLogin from '@/components/admin/AdminLogin';
import ArticleList from '@/components/admin/ArticleList';
import BatchGenerate from '@/components/admin/BatchGenerate';
import SaintsScraper from '@/components/admin/SaintsScraper';
import ImportReadyArticles from '@/components/admin/ImportReadyArticles';
import ArticleForm from '@/components/admin/ArticleForm';
import PrayerRequestList from '@/components/admin/PrayerRequestList';
import SuggestionList from '@/components/admin/SuggestionList';
import { Button } from '@/components/ui/button';
import { Cross, LogOut, Rocket } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import type { Article } from '@/types/content';
import { useQuery } from '@tanstack/react-query';

const EditArticleWrapper = () => {
  const { id } = useParams<{ id: string }>();
  const { data: article, isLoading } = useQuery<Article | null>({
    queryKey: ['admin-article', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();
      if (error) return null;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) return <Skeleton className="h-96 w-full" />;
  if (!article) return <p>Artigo não encontrado.</p>;
  return <ArticleForm article={article} />;
};

/**
 * O site público é estático: artigos novos/editados só aparecem depois de um novo build.
 * Este botão dispara o build + deploy (GitHub Actions) via Edge Function "trigger-deploy".
 */
const DeployButton = () => {
  const [busy, setBusy] = useState(false);
  const run = async () => {
    setBusy(true);
    const { data, error } = await supabase.functions.invoke('trigger-deploy', { body: { reason: 'painel' } });
    setBusy(false);
    if (error || data?.error) {
      toast.error(`Não foi possível iniciar a atualização: ${data?.error || error?.message}`);
      return;
    }
    toast.success('Atualização do site iniciada. As mudanças ficam no ar em poucos minutos.');
  };
  return (
    <Button size="sm" onClick={run} disabled={busy} className="bg-co-warm-terracotta text-co-warm-sand hover:bg-co-warm-terracotta/90">
      <Rocket className="mr-2 h-4 w-4" /> {busy ? 'Iniciando...' : 'Publicar alterações no site'}
    </Button>
  );
};

const AdminPage = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  // Desde o login público do Caminho da Fé, estar logado não basta: é preciso estar na tabela "admins"
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!session) {
      setIsAdmin(null);
      return;
    }
    supabase.rpc('is_admin').then(({ data, error }) => setIsAdmin(!error && data === true));
  }, [session]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Skeleton className="h-8 w-32" />
      </div>
    );
  }

  if (!session) {
    return <AdminLogin />;
  }

  if (isAdmin === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Skeleton className="h-8 w-32" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-lg font-semibold">Esta conta não tem acesso ao painel.</p>
        <p className="max-w-md text-sm text-muted-foreground">
          Você entrou como {session.user.email}. Se você é administrador, peça para incluir este e-mail na tabela "admins" do Supabase.
        </p>
        <Button variant="outline" onClick={() => supabase.auth.signOut()}>Sair</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 flex-wrap items-center gap-4">
            <Link to="/admin" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-co-warm-terracotta">
                <Cross className="h-4 w-4 text-co-warm-sand" />
              </div>
              <span className="font-inter text-lg font-semibold">Admin</span>
            </Link>
            <nav aria-label="Navegação do painel" className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground">
                Artigos
              </Link>
              <Link to="/admin/gerar" className="text-sm text-muted-foreground hover:text-foreground">
                Gerar com IA
              </Link>
              <Link to="/admin/prontos" className="text-sm text-muted-foreground hover:text-foreground">
                Artigos prontos
              </Link>
              <Link to="/admin/pedidos" className="text-sm text-muted-foreground hover:text-foreground">
                Pedidos de Oração
              </Link>
              <Link to="/admin/santos" className="text-sm text-muted-foreground hover:text-foreground">
                Santos (Vaticano)
              </Link>
              <Link to="/admin/sugestoes" className="text-sm text-muted-foreground hover:text-foreground">
                Sugestões
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <DeployButton />
            <span className="hidden text-sm text-muted-foreground xl:inline">{session.user.email}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => supabase.auth.signOut()}
            >
              <LogOut className="mr-2 h-4 w-4" /> Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route index element={<ArticleList />} />
          <Route path="novo" element={<ArticleForm />} />
          <Route path="editar/:id" element={<EditArticleWrapper />} />
          <Route path="gerar" element={<BatchGenerate />} />
          <Route path="prontos" element={<ImportReadyArticles />} />
          <Route path="pedidos" element={<PrayerRequestList />} />
          <Route path="santos" element={<SaintsScraper />} />
          <Route path="sugestoes" element={<SuggestionList />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminPage;
