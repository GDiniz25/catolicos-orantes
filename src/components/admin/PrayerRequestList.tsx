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

interface PrayerRequest {
  id: string;
  name: string;
  email: string | null;
  whatsapp: string | null;
  message: string;
  read: boolean;
  created_at: string;
}

const PrayerRequestList = () => {
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery<PrayerRequest[]>({
    queryKey: ['admin-prayer-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prayer_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const toggleRead = async (req: PrayerRequest) => {
    const { error } = await supabase
      .from('prayer_requests')
      .update({ read: !req.read })
      .eq('id', req.id);
    if (error) {
      toast.error('Erro ao atualizar');
    } else {
      queryClient.invalidateQueries({ queryKey: ['admin-prayer-requests'] });
    }
  };

  const deleteRequest = async (id: string) => {
    const { error } = await supabase.from('prayer_requests').delete().eq('id', id);
    if (error) {
      toast.error('Erro ao excluir');
    } else {
      toast.success('Pedido excluído');
      queryClient.invalidateQueries({ queryKey: ['admin-prayer-requests'] });
    }
  };

  const unreadCount = requests?.filter(r => !r.read).length ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Pedidos de Oração</h2>
        <p className="text-sm text-muted-foreground">
          {requests?.length ?? 0} pedido(s) · {unreadCount} não lido(s)
        </p>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : requests && requests.length > 0 ? (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead className="max-w-xs">Pedido</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req) => (
                <TableRow key={req.id} className={!req.read ? 'bg-muted/50' : ''}>
                  <TableCell className="font-medium">{req.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                      {req.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {req.email}
                        </span>
                      )}
                      {req.whatsapp && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {req.whatsapp}
                        </span>
                      )}
                      {!req.email && !req.whatsapp && <span>—</span>}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="line-clamp-2 text-sm">{req.message}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={req.read ? 'secondary' : 'default'}>
                      {req.read ? 'Lido' : 'Novo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {new Date(req.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRead(req)}
                        title={req.read ? 'Marcar como não lido' : 'Marcar como lido'}
                      >
                        {req.read ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir pedido?</AlertDialogTitle>
                            <AlertDialogDescription>
                              O pedido de "{req.name}" será removido permanentemente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteRequest(req.id)} className="bg-destructive hover:bg-destructive/90">
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
          <p className="text-muted-foreground">Nenhum pedido de oração recebido ainda.</p>
        </div>
      )}
    </div>
  );
};

export default PrayerRequestList;
