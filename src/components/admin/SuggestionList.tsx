import { supabase } from '@/lib/supabase';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2, Mail, Phone, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORY_LABELS: Record<string, string> = {
  'correcao': 'Correção',
  'sugestao-conteudo': 'Sugestão',
  'solicitacao': 'Solicitação',
  'erro-informacao': 'Erro',
  'melhoria': 'Melhoria',
  'elogio': 'Elogio',
  'outro': 'Outro',
};

interface Suggestion {
  id: string;
  name: string;
  email: string | null;
  whatsapp: string | null;
  category: string;
  content_reference: string | null;
  message: string;
  read: boolean;
  created_at: string;
}

const SuggestionList = () => {
  const queryClient = useQueryClient();

  const { data: suggestions, isLoading } = useQuery<Suggestion[]>({
    queryKey: ['admin-suggestions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_suggestions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const toggleRead = async (s: Suggestion) => {
    const { error } = await supabase
      .from('user_suggestions')
      .update({ read: !s.read })
      .eq('id', s.id);
    if (error) {
      toast.error('Erro ao atualizar');
    } else {
      queryClient.invalidateQueries({ queryKey: ['admin-suggestions'] });
    }
  };

  const deleteSuggestion = async (id: string) => {
    const { error } = await supabase.from('user_suggestions').delete().eq('id', id);
    if (error) {
      toast.error('Erro ao excluir');
    } else {
      toast.success('Sugestão excluída');
      queryClient.invalidateQueries({ queryKey: ['admin-suggestions'] });
    }
  };

  const unreadCount = suggestions?.filter(s => !s.read).length ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Sugestões e Correções</h2>
        <p className="text-sm text-muted-foreground">
          {suggestions?.length ?? 0} mensagem(ns) · {unreadCount} não lida(s)
        </p>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : suggestions && suggestions.length > 0 ? (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="max-w-xs">Mensagem</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suggestions.map((s) => (
                <TableRow key={s.id} className={!s.read ? 'bg-muted/50' : ''}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                      {s.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {s.email}
                        </span>
                      )}
                      {s.whatsapp && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {s.whatsapp}
                        </span>
                      )}
                      {!s.email && !s.whatsapp && <span>—</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {CATEGORY_LABELS[s.category] || s.category}
                    </Badge>
                    {s.content_reference && (
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{s.content_reference}</p>
                    )}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="line-clamp-2 text-sm">{s.message}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={s.read ? 'secondary' : 'default'}>
                      {s.read ? 'Lido' : 'Novo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {new Date(s.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRead(s)}
                        title={s.read ? 'Marcar como não lido' : 'Marcar como lido'}
                      >
                        {s.read ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir sugestão?</AlertDialogTitle>
                            <AlertDialogDescription>
                              A mensagem de "{s.name}" será removida permanentemente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteSuggestion(s.id)} className="bg-destructive hover:bg-destructive/90">
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
          <p className="text-muted-foreground">Nenhuma sugestão recebida ainda.</p>
        </div>
      )}
    </div>
  );
};

export default SuggestionList;
