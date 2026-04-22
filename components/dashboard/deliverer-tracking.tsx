"use client"

import dynamic from "next/dynamic"
import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Navigation, Route, Truck } from "lucide-react"
import type { Configuracoes, Entregador, Rota } from "@/types"

const DashboardTrackingMap = dynamic(
  () => import("@/components/dashboard/deliverer-tracking-map").then((mod) => mod.DelivererTrackingMap),
  {
    ssr: false,
    loading: () => <div className="h-[360px] animate-pulse rounded-xl bg-muted" />,
  }
)

const fetcher = async (url: string) => {
  const response = await fetch(url, { cache: "no-store" })
  if (!response.ok) {
    throw new Error("Falha ao carregar dados de rastreamento")
  }
  return response.json()
}

export function DelivererTracking() {
  const { data: entregadoresData } = useSWR<Entregador[]>("/api/entregadores", fetcher, {
    refreshInterval: 15000,
  })
  const { data: rotasData } = useSWR<Rota[]>("/api/rotas", fetcher, {
    refreshInterval: 15000,
  })
  const { data: configuracoes } = useSWR<Configuracoes>("/api/configuracoes", fetcher)

  const entregadores = entregadoresData ?? []
  const rotas = rotasData ?? []
  const loja = configuracoes?.loja

  const entregadoresOnline = entregadores.filter((entregador) => entregador.status !== "offline")
  const entregadoresComLocalizacao = entregadoresOnline.filter((entregador) => entregador.localizacaoAtual)
  const rotasAtivas = rotas.filter((rota) => rota.status !== "finalizada")
  const pedidosEmRota = rotasAtivas.flatMap((rota) => rota.pedidos).filter((pedido) => pedido.status === "em_rota")

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="h-5 w-5" />
          Operação em Tempo Real
        </CardTitle>
        <CardDescription>
          Acompanhe entregadores online, rotas ativas e movimentação no mapa.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Entregadores online</p>
            <p className="mt-2 text-2xl font-semibold text-zinc-900">{entregadoresOnline.length}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Com localização</p>
            <p className="mt-2 text-2xl font-semibold text-zinc-900">{entregadoresComLocalizacao.length}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Rotas ativas</p>
            <p className="mt-2 text-2xl font-semibold text-zinc-900">{rotasAtivas.length}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Pedidos em rota</p>
            <p className="mt-2 text-2xl font-semibold text-zinc-900">{pedidosEmRota.length}</p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-3">
            <DashboardTrackingMap loja={loja} entregadores={entregadoresOnline} rotas={rotasAtivas} />
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-3">
              <p className="flex items-center gap-2 text-xs text-blue-700">
                <Clock className="h-3.5 w-3.5" />
                Atualização automática a cada 15 segundos
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="mb-3 text-sm font-semibold text-zinc-900">Entregadores em operação</p>
              <div className="space-y-3">
                {entregadoresOnline.length === 0 ? (
                  <div className="rounded-xl border border-zinc-200 p-4 text-sm text-muted-foreground">
                    Nenhum entregador online no momento.
                  </div>
                ) : (
                  entregadoresOnline.map((entregador) => (
                    <div
                      key={entregador.id}
                      className="rounded-xl border border-zinc-200 p-4"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-medium text-zinc-900">{entregador.nome}</p>
                          <p className="text-xs text-muted-foreground">
                            {entregador.veiculo} • {entregador.status === "em_rota" ? "Em rota" : "Disponível"}
                          </p>
                        </div>
                        <Badge variant={entregador.localizacaoAtual ? "default" : "secondary"}>
                          {entregador.localizacaoAtual ? "Localização ativa" : "Sem localização"}
                        </Badge>
                      </div>
                      {entregador.localizacaoAtual && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          Última posição: {new Date(entregador.localizacaoAtual.timestamp).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-zinc-900">Rotas em andamento</p>
              <div className="space-y-3">
                {rotasAtivas.length === 0 ? (
                  <div className="rounded-xl border border-zinc-200 p-4 text-sm text-muted-foreground">
                    Nenhuma rota ativa no momento.
                  </div>
                ) : (
                  rotasAtivas.map((rota) => (
                    <div key={rota.id} className="rounded-xl border border-zinc-200 p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-medium text-zinc-900">{rota.nome}</p>
                          <p className="text-xs text-muted-foreground">
                            {rota.entregador?.nome || "Sem entregador"} • {rota.pedidos.length} pedidos
                          </p>
                        </div>
                        <Badge variant="outline">
                          {rota.status === "em_andamento" ? "Em andamento" : "Planejada"}
                        </Badge>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Truck className="h-3.5 w-3.5" />
                          {rota.pedidos.filter((pedido) => pedido.status === "em_rota").length} em rota
                        </span>
                        <span className="flex items-center gap-1">
                          <Route className="h-3.5 w-3.5" />
                          {rota.distanciaTotal.toFixed(1)} km
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {rota.tempoEstimado} min estimados
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
