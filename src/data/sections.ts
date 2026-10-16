import { BookOpen, Cross, Heart, Church, Calendar, Star, HandHeart, ScrollText, Sun, Moon, FileText, Search, ListOrdered, HelpCircle, Flame, Footprints, HeartHandshake } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Section {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

export const sections: Section[] = [
  { title: "Como Rezar o Terço", description: "Guia completo com os Mistérios Gozosos, Dolorosos, Gloriosos e Luminosos.", icon: Cross, href: "/como-rezar-o-terco" },
  { title: "Santos e Orações", description: "Catálogo de santos, suas histórias, dias litúrgicos e orações específicas.", icon: Star, href: "/santos-e-oracoes" },
  { title: "Milagres Eucarísticos", description: "Relatos históricos de milagres eucarísticos reconhecidos pela Igreja.", icon: Sun, href: "/milagres-eucaristicos" },
  { title: "Catecismo", description: "Resumos organizados por tema da doutrina católica.", icon: BookOpen, href: "/catecismo" },
  { title: "Liturgia das Horas", description: "Guia de como rezar as horas canônicas ao longo do dia.", icon: Moon, href: "/liturgia-das-horas" },
  { title: "Novenas", description: "Coleção de novenas populares organizadas por intenção e devoção.", icon: HandHeart, href: "/novenas" },
  { title: "Sacramentos", description: "Explicação dos 7 sacramentos com fundamentação bíblica e doutrinária.", icon: Church, href: "/sacramentos" },
  { title: "Devoções Marianas", description: "Consagração, Escapulário, Medalha Milagrosa, aparições e outras devoções a Nossa Senhora.", icon: Heart, href: "/devocoes-marianas" },
  { title: "Calendário Litúrgico", description: "Santo do dia, tempos litúrgicos e festas da Igreja Católica.", icon: Calendar, href: "/calendario-liturgico" },
  { title: "Exame de Consciência", description: "Guia para preparação para o Sacramento da Confissão.", icon: Search, href: "/exame-de-consciencia" },
  { title: "Orações do Dia a Dia", description: "Pai Nosso, Ave Maria, Salve Rainha, Angelus e outras orações essenciais.", icon: ScrollText, href: "/oracoes-do-dia-a-dia" },
  { title: "Documentos da Igreja", description: "Encíclicas e documentos importantes do Magistério resumidos.", icon: FileText, href: "/documentos-da-igreja" },
  { title: "Ladainhas", description: "Coleção completa de ladainhas católicas: de santos, de Nossa Senhora, do Sagrado Coração e mais.", icon: ListOrdered, href: "/ladainhas" },
  { title: "Dúvidas da Fé", description: "Respostas claras para as principais dúvidas sobre a fé católica, liturgia, tradições e costumes da Igreja.", icon: HelpCircle, href: "/duvidas-da-fe" },
  { title: "Vida Espiritual", description: "Como rezar de verdade, aridez, distrações, discernimento e a presença de Deus no dia a dia.", icon: Flame, href: "/vida-espiritual" },
  { title: "Primeiros Passos na Fé", description: "Para quem está chegando ou voltando à Igreja: conversão, sacramentos, Missa e as primeiras dúvidas.", icon: Footprints, href: "/primeiros-passos" },
  { title: "Casamento Católico", description: "Rito do matrimônio, leituras, músicas por momento, símbolos, documentos e padrinhos para casar na Igreja.", icon: HeartHandshake, href: "/casamento" },
];

export const sectionIconByHref = (href: string): LucideIcon =>
  sections.find((s) => s.href === href)?.icon ?? BookOpen;

export const navLinks = [
  { label: "Caminho da Fé", href: "/aprender" },
  { label: "Descubra seu santo", href: "/descubra-seu-santo" },
  { label: "Santo do Dia", href: "/santo-do-dia" },
  { label: "Liturgia Diária", href: "/liturgia-diaria" },
  { label: "Terço guiado", href: "/terco-guiado" },
  { label: "Ferramentas", href: "/ferramentas" },
  { label: "Pedido de Oração", href: "/pedido-de-oracao" },
];
