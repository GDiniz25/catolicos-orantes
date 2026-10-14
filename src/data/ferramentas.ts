import { Sunrise, CircleDot, HeartHandshake, Cross, CalendarClock, Heart, BookOpenCheck, BookHeart, Search, Brain, Sparkles, Cake, Baby, Shield, CalendarDays, BookA, GraduationCap, MessageCircle, BookOpen } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface Ferramenta { href: string; titulo: string; descricao: string; icon: LucideIcon; grupo: 'rezar' | 'conhecer' | 'aprender' }
export const FERRAMENTAS: Ferramenta[] = [
  { href: '/terco-guiado', titulo: 'Terço guiado', descricao: 'Reze passo a passo, com os mistérios do dia.', icon: CircleDot, grupo: 'rezar' },
  { href: '/terco-da-misericordia', titulo: 'Terço da Misericórdia', descricao: 'A oração da Divina Misericórdia nas contas do terço.', icon: HeartHandshake, grupo: 'rezar' },
  { href: '/via-sacra', titulo: 'Via Sacra', descricao: 'As 14 estações com leitura, meditação e oração.', icon: Cross, grupo: 'rezar' },
  { href: '/laudes-de-hoje', titulo: 'Laudes de hoje', descricao: 'Semana do saltério e salmos de Laudes, Vésperas e Completas.', icon: Sunrise, grupo: 'rezar' },
  { href: '/lectio-divina', titulo: 'Lectio Divina', descricao: 'Reze o Evangelho do dia em quatro passos.', icon: BookHeart, grupo: 'rezar' },
  { href: '/planejador-de-novena', titulo: 'Planejador de novena', descricao: 'Quando começar, lembretes e os 9 dias marcados.', icon: CalendarClock, grupo: 'rezar' },
  { href: '/consagracao-a-nossa-senhora', titulo: 'Consagração em 33 dias', descricao: 'Preparação diária segundo São Luís de Montfort.', icon: Heart, grupo: 'rezar' },
  { href: '/exame-de-consciencia', titulo: 'Exame de consciência', descricao: 'Para adultos, casados, jovens, crianças e primeira confissão.', icon: Search, grupo: 'conhecer' },
  { href: '/descubra-seu-santo', titulo: 'Descubra seu santo', descricao: 'Teste de afinidade com 52 santos.', icon: Sparkles, grupo: 'conhecer' },
  { href: '/teste-de-temperamento', titulo: 'Teste de temperamento', descricao: 'Os quatro temperamentos e as virtudes a cultivar.', icon: Brain, grupo: 'conhecer' },
  { href: '/santo-do-aniversario', titulo: 'Santo do aniversário', descricao: 'Os santos do dia em que você nasceu.', icon: Cake, grupo: 'conhecer' },
  { href: '/nomes-de-santos', titulo: 'Nomes de santos', descricao: 'Significado, origem e dia do santo de 80 nomes.', icon: Baby, grupo: 'conhecer' },
  { href: '/padroeiros', titulo: 'Santos padroeiros', descricao: 'O protetor de cada profissão, causa e lugar.', icon: Shield, grupo: 'conhecer' },
  { href: '/aprender', titulo: 'Caminho da Fé', descricao: 'Teste de nível e lições curtas sobre a doutrina.', icon: GraduationCap, grupo: 'aprender' },
  { href: '/plano-de-leitura-da-biblia', titulo: 'Plano de leitura da Bíblia', descricao: 'Evangelhos, Novo Testamento, Salmos ou a Bíblia em 1 ano.', icon: BookOpenCheck, grupo: 'aprender' },
  { href: '/datas-liturgicas', titulo: 'Datas litúrgicas', descricao: 'Páscoa, Cinzas e Corpus Christi de cada ano.', icon: CalendarDays, grupo: 'aprender' },
  { href: '/glossario', titulo: 'Glossário católico', descricao: 'As palavras da fé explicadas em poucas linhas.', icon: BookA, grupo: 'aprender' },
  { href: '/versiculo-do-dia', titulo: 'Versículo do dia', descricao: 'Uma palavra da Escritura para hoje.', icon: BookOpen, grupo: 'aprender' },
  { href: '/encontre-na-biblia', titulo: 'Encontre na Bíblia', descricao: 'Versículos por tema ou situação de vida.', icon: MessageCircle, grupo: 'aprender' },
];
export const GRUPOS_FERRAMENTAS = [
  { id: 'rezar', nome: 'Para rezar' },
  { id: 'conhecer', nome: 'Para se conhecer e conhecer os santos' },
  { id: 'aprender', nome: 'Para aprender' },
] as const;
