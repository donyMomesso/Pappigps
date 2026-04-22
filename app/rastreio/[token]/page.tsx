"use client"

import useSWR from "swr"
import dynamic from "next/dynamic"
import { use } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock3, MapPin, Navigation, PackageCheck, Store } from "lucide-react"
import { formatDuration } from "@/lib/utils"

const TrackingMap = dynamic(
  () => import("@/components/tracking/tracking-map").then((mod) => mod.TrackingMap),
  {
    ssr: false,
    loading: () => <div className="h-[320px] animate-pulse rounded-xl bg-muted" />,
  }
)

const fetcher = async (url: string) => {
  const response = await fetch(url, { cache: "no-store" })
  if (!response.ok) {
    throw new Error("Rastreamento não encontrado")
  }
  return response.json()
}

export default function TrackingPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params)
  const { data, error } = useSWR(`/api/tracking/${token}`, fetcher, { refreshInterval: 15000 })

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB] p-4">
        <Card className="w-full max-w-xl">
          <CardHeader>
            <CardTitle>Rastreamento indisponível</CardTitle>
            <CardDescription>Este link não existe ou já não está mais ativo.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (!data) {
    return <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB]">Carregando rastreamento...</div>
  }

  const trackingLabel =
    data.pedido.status === "entregue"
      ? "Pedido entregue"
      : data.pedido.status === "em_rota"
        ? "A caminho"
        : "Preparando saída"

  return (
    <main className="min-h-screen bg-[#F9FAFB] p-4 sm:p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="space-y-2">
          <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
            {trackingLabel}
          </Badge>
          <h1 className="text-2xl font-semibold text-[#111827]">Rastreio do pedido {data.pedido.numero}</h1>
          <p className="text-sm text-[#4B5563]">
            Acompanhe a entrega em tempo real enquanto o pedido estiver ativo.
          </p>
        </div>

        <TrackingMap loja={data.loja} pedido={data.pedido} entregador={data.entregador} />

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="flex items-start gap-3 p-4">
              <Store className="mt-1 h-5 w-5 text-[#F97316]" />
              <div>
                <p className="text-sm font-medium text-[#111827]">{data.loja.nome}</p>
                <p className="text-sm text-[#6B7280]">
                  {data.loja.endereco.logradouro}, {data.loja.endereco.numero}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-start gap-3 p-4">
              <MapPin className="mt-1 h-5 w-5 text-[#F97316]" />
              <div>
                <p className="text-sm font-medium text-[#111827]">{data.pedido.cliente.nome}</p>
                <p className="text-sm text-[#6B7280]">
                  {data.pedido.endereco.logradouro}, {data.pedido.endereco.numero}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-start gap-3 p-4">
              <Clock3 className="mt-1 h-5 w-5 text-[#F97316]" />
              <div>
                <p className="text-sm font-medium text-[#111827]">Tempo estimado</p>
                <p className="text-sm text-[#6B7280]">{formatDuration(data.rota.tempoEstimado)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Status atual</CardTitle>
            <CardDescription>
              {data.active
                ? "O link continua válido enquanto o pedido estiver em andamento."
                : "O pedido já foi finalizado e este rastreio perde utilidade operacional."}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-zinc-50 p-4">
              <p className="flex items-center gap-2 text-sm font-medium text-[#111827]">
                <Navigation className="h-4 w-4 text-[#F97316]" />
                Entregador
              </p>
              <p className="mt-2 text-sm text-[#4B5563]">
                {data.entregador?.nome || "Aguardando associação do entregador"}
              </p>
            </div>
            <div className="rounded-xl bg-zinc-50 p-4">
              <p className="flex items-center gap-2 text-sm font-medium text-[#111827]">
                <PackageCheck className="h-4 w-4 text-[#F97316]" />
                Rota
              </p>
              <p className="mt-2 text-sm capitalize text-[#4B5563]">
                {String(data.rota.status).replace("_", " ")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
