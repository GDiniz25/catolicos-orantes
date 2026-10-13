/**
 * Sincronização do Caminho da Fé com a tabela caminho_progresso.
 * As funções de login ficam em src/lib/conta.ts (usadas também pelas outras ferramentas).
 */
import { getClient } from '@/lib/conta';
import { mesclar, type Estado } from './motor';

export { getClient, talvezLogado, googleAtivo, entrarComEmail, entrarComGoogle, sair, sessaoAtual, aoMudarSessao } from '@/lib/conta';

/** Busca o progresso da nuvem, junta com o do aparelho e grava o resultado nos dois lados. */
export async function sincronizar(userId: string, local: Estado): Promise<Estado> {
  const sb = await getClient();
  const { data, error } = await sb.from('caminho_progresso').select('estado').eq('user_id', userId).maybeSingle();
  if (error) throw error;
  const nuvem = (data?.estado as Estado | undefined) ?? null;
  const final = nuvem ? mesclar(local, nuvem) : local;
  await enviar(userId, final);
  return final;
}

export async function enviar(userId: string, estado: Estado) {
  const sb = await getClient();
  const { error } = await sb.from('caminho_progresso').upsert({ user_id: userId, estado, updated_at: new Date().toISOString() });
  if (error) throw error;
}

/** Apaga a conta? Não: apaga só o progresso salvo na nuvem (o usuário pode pedir exclusão da conta pelo contato). */
export async function apagarProgressoNuvem(userId: string) {
  const sb = await getClient();
  await sb.from('caminho_progresso').delete().eq('user_id', userId);
}
