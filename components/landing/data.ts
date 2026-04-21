import type { LucideIcon } from "lucide-react"
import {
  Bot,
  Boxes,
  BrainCircuit,
  ChartColumnIncreasing,
  Clock3,
  CreditCard,
  Gauge,
  LayoutDashboard,
  Package,
  ReceiptText,
  Store,
  TrendingUp,
  Zap,
} from "lucide-react"

export interface LandingItem {
  icon: LucideIcon
  title: string
  description: string
}

export const benefits: LandingItem[] = [
  {
    icon: Gauge,
    title: "Mais controle na rotina",
    description:
      "Acompanhe pedidos, equipe, estoque e caixa em uma visão única da operação.",
  },
  {
    icon: Package,
    title: "Menos desperdício",
    description:
      "Receba alertas de estoque crítico, gargalos de produção e perdas antes que virem prejuízo.",
  },
  {
    icon: Clock3,
    title: "Mais agilidade no dia a dia",
    description:
      "Reduza retrabalho com automações que organizam tarefas e priorizam o que precisa acontecer agora.",
  },
  {
    icon: BrainCircuit,
    title: "Gestão mais inteligente",
    description:
      "Use dados operacionais para decidir com rapidez sem depender de planilhas espalhadas.",
  },
  {
    icon: ChartColumnIncreasing,
    title: "Operação em tempo real",
    description:
      "Veja o que está entrando, saindo e travando a operação com leitura clara e acionável.",
  },
]

export const features: LandingItem[] = [
  {
    icon: ReceiptText,
    title: "Pedidos",
    description:
      "Centralize canais, acompanhe status e evite perda de informação entre atendimento, cozinha e entrega.",
  },
  {
    icon: Boxes,
    title: "Estoque",
    description:
      "Monitore níveis, giro e itens críticos para agir antes de faltar produto no pico.",
  },
  {
    icon: CreditCard,
    title: "Financeiro",
    description:
      "Organize entradas, saídas, taxas e visão de caixa com leitura simples para quem opera.",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboards",
    description:
      "Visualize os números certos para cada etapa da operação sem depender de relatórios manuais.",
  },
  {
    icon: TrendingUp,
    title: "Relatórios",
    description:
      "Entenda tendências, horários fortes, produtos sensíveis e desempenho por período.",
  },
  {
    icon: Zap,
    title: "Automações",
    description:
      "Dispare rotinas operacionais automaticamente para reduzir atrasos e tarefas repetitivas.",
  },
  {
    icon: Bot,
    title: "Inteligência operacional",
    description:
      "Transforme sinais da operação em sugestões práticas para melhorar margem, ritmo e atendimento.",
  },
  {
    icon: Store,
    title: "Gestão centralizada",
    description:
      "Conecte frente de venda, bastidor, entregas e visão do dono em uma única plataforma.",
  },
]

export const differentiators = [
  "Mais prático para quem vive a operação e não quer perder tempo configurando tudo do zero.",
  "Mais inteligente na leitura do dia a dia, com alertas e automações úteis de verdade.",
  "Mais próximo da rotina real de delivery, food service e operação comercial brasileira.",
  "Mais fácil de usar por equipes pequenas, médias ou em expansão.",
  "Mais preparado para crescer com controle, sem virar um sistema pesado para a equipe.",
]

export const automationPoints = [
  "Aprende padrões da rotina e evidencia onde a operação está perdendo ritmo.",
  "Sugere melhorias de fluxo, prioridade e atenção antes que o problema cresça.",
  "Automatiza tarefas repetitivas que hoje tomam tempo de quem precisa vender e operar.",
  "Ajuda a tomar decisão com contexto claro, em vez de só despejar número na tela.",
]

export const footerLinks = [
  { label: "Produto", href: "#funcionalidades" },
  { label: "Inteligência", href: "#inteligencia" },
  { label: "Demonstração", href: "#demonstracao" },
  { label: "Entrar", href: "/login" },
]
