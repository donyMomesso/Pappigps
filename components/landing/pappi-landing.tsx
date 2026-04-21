import Link from "next/link"
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react"
import {
  automationPoints,
  benefits,
  differentiators,
  features,
  footerLinks,
} from "@/components/landing/data"
import { LandingFaq } from "@/components/landing/faq"
import { SectionHeading } from "@/components/landing/section-heading"
import { SocialProof } from "@/components/landing/social-proof"
import { SystemMockup } from "@/components/landing/system-mockup"

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
            <div className="max-w-2xl motion-safe:animate-[fade-up_0.8s_ease-out]">
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
                    className="rounded-2xl border border-[#E5E7EB] bg-white/90 p-4 shadow-sm transition-transform duration-300 hover:-translate-y-1"
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
                  className="rounded-[28px] border border-[#E5E7EB] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
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

      <SocialProof />

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
                  className="rounded-[28px] border border-[#E5E7EB] bg-[#FCFCFD] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-md"
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

      <LandingFaq />

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
