import Link from "next/link"
import {
  ArrowRight,
  Bot,
  Boxes,
  BrainCircuit,
  ChartColumnIncreasing,
  CheckCircle2,
  Clock3,
  CreditCard,
  Gauge,
  LayoutDashboard,
  Package,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Store,
  TrendingUp,
  Truck,
  Zap,
} from "lucide-react"

const benefits = [
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

const features = [
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

const differentiators = [
  "Mais prático para quem vive a operação e não quer perder tempo configurando tudo do zero.",
  "Mais inteligente na leitura do dia a dia, com alertas e automações úteis de verdade.",
  "Mais próximo da rotina real de delivery, food service e operação comercial brasileira.",
  "Mais fácil de usar por equipes pequenas, médias ou em expansão.",
  "Mais preparado para crescer com controle, sem virar um sistema pesado para a equipe.",
]

const automationPoints = [
  "Aprende padrões da rotina e evidencia onde a operação está perdendo ritmo.",
  "Sugere melhorias de fluxo, prioridade e atenção antes que o problema cresça.",
  "Automatiza tarefas repetitivas que hoje tomam tempo de quem precisa vender e operar.",
  "Ajuda a tomar decisão com contexto claro, em vez de só despejar número na tela.",
]

const topMetrics = [
  { label: "Pedidos hoje", value: "284", trend: "+12%" },
  { label: "Faturamento", value: "R$ 18.430", trend: "+8,4%" },
  { label: "Tempo médio", value: "27 min", trend: "-4 min" },
]

const activityFeed = [
  {
    title: "Estoque crítico",
    detail: "Molho especial e embalagem G com giro acima da média.",
    tone: "alert",
  },
  {
    title: "Pico de pedidos previsto",
    detail: "Entre 19h e 20h. Reforce produção e entregas.",
    tone: "neutral",
  },
  {
    title: "Margem recuperada",
    detail: "Ajuste de taxa elevou a rentabilidade da operação hoje.",
    tone: "success",
  },
]

const footerLinks = [
  { label: "Produto", href: "#funcionalidades" },
  { label: "Inteligência", href: "#inteligencia" },
  { label: "Demonstração", href: "#demonstracao" },
  { label: "Entrar", href: "/login" },
]

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <span className="inline-flex items-center rounded-full border border-[#FED7AA] bg-white px-4 py-1 text-sm font-medium text-[#C2410C] shadow-sm">
        {eyebrow}
      </span>
      <h2 className="mt-5 text-3xl font-semibold tracking-tight text-[#111827] md:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-[#374151] md:text-lg">
        {description}
      </p>
    </div>
  )
}

function SystemMockup() {
  return (
    <div className="relative overflow-hidden rounded-[32px] border border-[#E5E7EB] bg-white p-4 shadow-[0_30px_80px_-45px_rgba(17,24,39,0.45)] md:p-6">
      <div className="absolute inset-x-10 top-0 h-32 rounded-full bg-[#FDBA74]/25 blur-3xl" />
      <div className="relative rounded-[26px] border border-[#E5E7EB] bg-[#FCFCFD] p-4 md:p-5">
        <div className="flex flex-col gap-3 border-b border-[#E5E7EB] pb-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-[#6B7280]">Painel operacional</p>
            <h3 className="mt-1 text-xl font-semibold text-[#111827]">Visão geral da unidade</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-[#FFF7ED] px-3 py-1 text-xs font-medium text-[#C2410C]">
              Operação estável
            </span>
            <span className="rounded-full bg-[#F3F4F6] px-3 py-1 text-xs font-medium text-[#374151]">
              Atualizado há 2 min
            </span>
          </div>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[1.4fr_0.95fr]">
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              {topMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-[#E5E7EB] bg-white p-4"
                >
                  <p className="text-sm text-[#6B7280]">{metric.label}</p>
                  <div className="mt-3 flex items-end justify-between gap-3">
                    <span className="text-2xl font-semibold text-[#111827]">{metric.value}</span>
                    <span className="rounded-full bg-[#ECFDF5] px-2.5 py-1 text-xs font-medium text-[#15803D]">
                      {metric.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.25fr_0.85fr]">
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#6B7280]">Fluxo da operação</p>
                    <h4 className="mt-1 text-lg font-semibold text-[#111827]">
                      Ritmo por etapa do dia
                    </h4>
                  </div>
                  <ChartColumnIncreasing className="h-5 w-5 text-[#F97316]" />
                </div>
                <div className="mt-5 flex h-52 items-end gap-3 rounded-2xl bg-[#F9FAFB] px-4 pb-4 pt-6">
                  {[38, 55, 46, 72, 60, 82, 68].map((height, index) => (
                    <div key={height} className="flex flex-1 flex-col items-center gap-2">
                      <div
                        className={`w-full rounded-t-xl ${
                          index === 5 ? "bg-[#F97316]" : "bg-[#FDBA74]"
                        }`}
                        style={{ height: `${height * 1.6}px` }}
                      />
                      <span className="text-xs text-[#6B7280]">
                        {["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"][index]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[#E5E7EB] bg-[#111827] p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-300">Inteligência Pappi</p>
                    <h4 className="mt-1 text-lg font-semibold">Ações sugeridas</h4>
                  </div>
                  <Sparkles className="h-5 w-5 text-[#FDBA74]" />
                </div>
                <div className="mt-5 space-y-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <p className="text-sm font-medium">Aumentar equipe no jantar</p>
                    <p className="mt-1 text-sm text-slate-300">
                      A demanda das 19h está 14% acima da média semanal.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <p className="text-sm font-medium">Priorizar item com maior margem</p>
                    <p className="mt-1 text-sm text-slate-300">
                      Campanha rápida pode elevar ticket sem afetar o tempo de produção.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <p className="text-sm font-medium">Reforçar reposição</p>
                    <p className="mt-1 text-sm text-slate-300">
                      Estoque projetado abaixo do ideal para as próximas 3 horas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#6B7280]">Fila operacional</p>
                  <h4 className="mt-1 text-lg font-semibold text-[#111827]">
                    Pedidos em andamento
                  </h4>
                </div>
                <Truck className="h-5 w-5 text-[#F97316]" />
              </div>
              <div className="mt-4 space-y-3">
                {[
                  ["#4218", "Produção", "14 min"],
                  ["#4219", "Expedição", "8 min"],
                  ["#4221", "Entrega", "21 min"],
                  ["#4224", "Aguardando aceite", "3 min"],
                ].map(([id, status, time]) => (
                  <div
                    key={id}
                    className="flex items-center justify-between rounded-2xl bg-[#F9FAFB] px-4 py-3"
                  >
                    <div>
                      <p className="font-medium text-[#111827]">{id}</p>
                      <p className="text-sm text-[#6B7280]">{status}</p>
                    </div>
                    <span className="text-sm font-medium text-[#374151]">{time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#6B7280]">Alertas inteligentes</p>
                  <h4 className="mt-1 text-lg font-semibold text-[#111827]">
                    Pontos de atenção
                  </h4>
                </div>
                <ShieldCheck className="h-5 w-5 text-[#F97316]" />
              </div>
              <div className="mt-4 space-y-3">
                {activityFeed.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-[#E5E7EB] px-4 py-3"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          item.tone === "success"
                            ? "bg-[#16A34A]"
                            : item.tone === "alert"
                              ? "bg-[#DC2626]"
                              : "bg-[#F97316]"
                        }`}
                      />
                      <p className="font-medium text-[#111827]">{item.title}</p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#4B5563]">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function PappiLanding() {
  return (
    <main className="min-h-screen bg-[#F9FAFB] text-[#111827]">
      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[620px] bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.16),_transparent_42%)]" />
        <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
          <header className="rounded-full border border-white/70 bg-white/85 px-5 py-4 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#111827] text-lg font-semibold text-white">
                  P
                </div>
                <div>
                  <p className="text-lg font-semibold tracking-tight text-[#111827]">Pappi</p>
                  <p className="text-sm text-[#6B7280]">Gestão inteligente para operação real</p>
                </div>
              </div>
              <nav className="flex flex-wrap items-center gap-3 text-sm text-[#4B5563]">
                <Link className="transition hover:text-[#111827]" href="#beneficios">
                  Benefícios
                </Link>
                <Link className="transition hover:text-[#111827]" href="#funcionalidades">
                  Funcionalidades
                </Link>
                <Link className="transition hover:text-[#111827]" href="#inteligencia">
                  Inteligência
                </Link>
                <Link className="transition hover:text-[#111827]" href="#demonstracao">
                  Demonstração
                </Link>
                <Link
                  className="inline-flex items-center justify-center rounded-full border border-[#E5E7EB] px-4 py-2 font-medium text-[#111827] transition hover:border-[#F97316] hover:text-[#F97316]"
                  href="/login"
                >
                  Entrar
                </Link>
              </nav>
            </div>
          </header>

          <div className="grid items-center gap-14 py-16 lg:grid-cols-[1.02fr_0.98fr] lg:py-24">
            <div className="max-w-2xl">
              <span className="inline-flex items-center rounded-full border border-[#FED7AA] bg-white px-4 py-1.5 text-sm font-medium text-[#C2410C] shadow-sm">
                Plataforma de gestão para delivery, food service e operação comercial
              </span>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-[#111827] md:text-6xl md:leading-[1.02]">
                O sistema que pensa a operação com você.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-[#374151]">
                O Pappi centraliza pedidos, estoque, financeiro, dashboards e automações em uma
                plataforma clara, prática e preparada para o ritmo de quem precisa operar bem todos
                os dias.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  className="inline-flex items-center justify-center rounded-full bg-[#F97316] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_35px_-20px_rgba(249,115,22,0.95)] transition hover:bg-[#EA580C]"
                  href="/login"
                >
                  Pedir demonstração
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  className="inline-flex items-center justify-center rounded-full border border-[#E5E7EB] bg-white px-6 py-3.5 text-sm font-semibold text-[#111827] transition hover:border-[#F97316] hover:text-[#F97316]"
                  href="#demonstracao"
                >
                  Conhecer a plataforma
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  ["+ controle", "Operação visível em tempo real"],
                  ["- retrabalho", "Rotinas mais fluídas e previsíveis"],
                  ["+ margem", "Decisões com base no que acontece hoje"],
                ].map(([title, text]) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-[#E5E7EB] bg-white/90 p-4 shadow-sm"
                  >
                    <p className="text-sm font-semibold text-[#111827]">{title}</p>
                    <p className="mt-2 text-sm leading-6 text-[#6B7280]">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <SystemMockup />
          </div>
        </div>
      </section>

      <section id="beneficios" className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Benefícios reais"
            title="Menos improviso. Mais clareza para crescer com controle."
            description="O Pappi foi pensado para a operação brasileira que precisa vender, produzir, entregar e manter margem sem perder o ritmo."
          />
          <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {benefits.map((benefit) => {
              const Icon = benefit.icon

              return (
                <div
                  key={benefit.title}
                  className="rounded-[28px] border border-[#E5E7EB] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF7ED] text-[#F97316]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-[#111827]">{benefit.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#4B5563]">{benefit.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section id="funcionalidades" className="border-y border-[#E5E7EB] bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Funcionalidades"
            title="Tudo o que a operação precisa, sem virar um sistema pesado."
            description="Uma base robusta para acompanhar pedidos, abastecimento, resultados e rotinas com a clareza que o time realmente usa."
          />
          <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon

              return (
                <div
                  key={feature.title}
                  className="rounded-[28px] border border-[#E5E7EB] bg-[#FCFCFD] p-6"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111827] text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-[#111827]">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#4B5563]">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section id="demonstracao" className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div>
              <span className="inline-flex items-center rounded-full border border-[#FED7AA] bg-white px-4 py-1 text-sm font-medium text-[#C2410C] shadow-sm">
                Visual do sistema
              </span>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-[#111827] md:text-4xl">
                Um painel com cara de produto real e foco no que move a operação.
              </h2>
              <p className="mt-5 text-base leading-8 text-[#374151] md:text-lg">
                Em vez de esconder a rotina em menus confusos, o Pappi prioriza visão prática:
                vendas do dia, pedidos em andamento, estoque crítico, fluxo financeiro, alertas e
                métricas que ajudam a agir rápido.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  "Indicadores fáceis de ler para o dono, gerente e equipe.",
                  "Alertas úteis para antecipar gargalos e perda de margem.",
                  "Estrutura pronta para conectar automações e inteligência operacional.",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#16A34A]" />
                    <p className="text-sm leading-7 text-[#4B5563] md:text-base">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <SystemMockup />
          </div>
        </div>
      </section>

      <section id="inteligencia" className="border-y border-[#E5E7EB] bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="rounded-[32px] bg-[#111827] p-8 text-white shadow-[0_35px_70px_-40px_rgba(17,24,39,0.8)] md:p-10">
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm font-medium text-[#FDBA74]">
                IA e automações
              </span>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight md:text-4xl">
                Inteligência prática para ajudar a operação a decidir melhor.
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-300 md:text-lg">
                O Pappi não usa tecnologia como enfeite. A inteligência entra para reduzir ruído,
                ganhar tempo e apoiar quem está tomando decisão com a operação rodando.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  ["Tarefas automatizadas", "Menos rotina manual e mais foco no que importa."],
                  ["Leitura de padrão", "O sistema encontra sinais que o olho perde no corre-corre."],
                  ["Sugestões úteis", "Ações simples com impacto real na margem e no fluxo."],
                  ["Mais previsibilidade", "Antecipe gargalos e picos com contexto operacional."],
                ].map(([title, text]) => (
                  <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="font-medium">{title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {automationPoints.map((point) => (
                <div
                  key={point}
                  className="rounded-[28px] border border-[#E5E7EB] bg-[#F9FAFB] p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFF7ED] text-[#F97316]">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <p className="text-sm leading-7 text-[#374151] md:text-base">{point}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Diferenciais"
            title="Feito para negócio real, não para parecer complexo."
            description="O Pappi combina estrutura de software premium com linguagem de operação. A ideia é dar poder de gestão, sem criar atrito desnecessário no uso."
          />
          <div className="mt-14 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[32px] border border-[#E5E7EB] bg-white p-8">
              <div className="grid gap-4 md:grid-cols-2">
                {differentiators.map((item) => (
                  <div key={item} className="rounded-2xl bg-[#F9FAFB] p-5">
                    <p className="text-sm leading-7 text-[#374151]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[32px] bg-[#FFF7ED] p-8">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#C2410C]">
                Por que o Pappi?
              </p>
              <h3 className="mt-4 text-3xl font-semibold tracking-tight text-[#111827]">
                Porque crescer sem controle custa caro.
              </h3>
              <p className="mt-5 text-base leading-8 text-[#374151]">
                O Pappi foi pensado para ser próximo da rotina de quem vende, atende, produz,
                entrega e fecha caixa. Ele organiza a casa, traz visibilidade e prepara a operação
                para crescer com mais confiança.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  "Visão integrada de operação, pedidos e resultado.",
                  "Base pronta para automações e evolução futura.",
                  "Experiência clara para time operacional e liderança.",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#F97316]" />
                    <p className="text-sm leading-7 text-[#374151]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="rounded-[36px] bg-[#111827] px-8 py-12 text-white shadow-[0_35px_70px_-45px_rgba(17,24,39,0.8)] md:px-12 md:py-14">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="max-w-2xl">
                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm font-medium text-[#FDBA74]">
                  CTA final
                </span>
                <h2 className="mt-5 text-3xl font-semibold tracking-tight md:text-4xl">
                  Conheça o Pappi e veja como a operação pode ganhar ritmo com mais controle.
                </h2>
                <p className="mt-5 text-base leading-8 text-slate-300 md:text-lg">
                  Uma plataforma pensada para transformar rotina operacional em gestão clara,
                  automação útil e crescimento sustentável.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  className="inline-flex items-center justify-center rounded-full bg-[#F97316] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#EA580C]"
                  href="/login"
                >
                  Testar plataforma
                </Link>
                <Link
                  className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-[#FDBA74] hover:text-[#FDBA74]"
                  href="#beneficios"
                >
                  Revisar benefícios
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#E5E7EB] bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1.15fr_0.85fr_0.85fr] lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#111827] text-lg font-semibold text-white">
                P
              </div>
              <div>
                <p className="text-lg font-semibold tracking-tight text-[#111827]">Pappi</p>
                <p className="text-sm text-[#6B7280]">Software para operação que precisa acontecer.</p>
              </div>
            </div>
            <p className="mt-5 max-w-md text-sm leading-7 text-[#4B5563]">
              Plataforma de gestão inteligente para delivery, food service e operações comerciais
              que querem mais clareza, automação e controle no dia a dia.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#111827]">
              Navegação
            </p>
            <div className="mt-4 space-y-3">
              {footerLinks.map((link) => (
                <Link
                  key={link.label}
                  className="block text-sm text-[#4B5563] transition hover:text-[#F97316]"
                  href={link.href}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#111827]">
              Contato
            </p>
            <div className="mt-4 space-y-3 text-sm text-[#4B5563]">
              <p>comercial@pappi.com.br</p>
              <p>(11) 4000-2211</p>
              <p>Av. Paulista, 1471, Sao Paulo - SP</p>
            </div>
          </div>
        </div>
        <div className="border-t border-[#E5E7EB] px-6 py-5 text-center text-sm text-[#6B7280]">
          © 2026 Pappi. Todos os direitos reservados.
        </div>
      </footer>
    </main>
  )
}
