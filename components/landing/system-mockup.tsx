import {
  ChartColumnIncreasing,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react"

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

export function SystemMockup() {
  return (
    <div className="relative overflow-hidden rounded-[32px] border border-[#E5E7EB] bg-white p-4 shadow-[0_30px_80px_-45px_rgba(17,24,39,0.45)] md:p-6 motion-safe:animate-[float_8s_ease-in-out_infinite]">
      <div className="absolute inset-x-10 top-0 h-32 rounded-full bg-[#FDBA74]/25 blur-3xl motion-safe:animate-[pulse_6s_ease-in-out_infinite]" />
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
                  className="rounded-2xl border border-[#E5E7EB] bg-white p-4 transition-transform duration-300 hover:-translate-y-1"
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
                    <div key={`${height}-${index}`} className="flex flex-1 flex-col items-center gap-2">
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
