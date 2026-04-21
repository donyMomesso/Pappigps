"use client"

import { use } from "react"
import useSWR from "swr"
import dynamic from "next/dynamic"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MapPin, Clock, Package, User, Phone, CheckCircle, Circle } from "lucide-react"
import type { Rota } from "@/types"
import { cn, formatCurrency, formatDistance, formatDuration, formatDateTime, getTipoVeiculoLabel, getStatusPedidoLabel, getStatusPedidoColor } from "@/lib/utils"

const RouteMap = dynamic(
  () => import("@/components/roteirizacao/route-map").then(mod => mod.RouteMap),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[300px] bg-zinc-100 rounded-lg flex items-center justify-center">
        <p className="text-zinc-500">Carregando mapa...</p>
      </div>
    )
  }
)

const fetcher = async (url: string) => {
  const response = await fetch(url, { cache: "no-store" })
  if (!response.ok) {
    throw new Error("Falha ao carregar rotas")
  }
  return response.json()
}

export default function RotaDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data } = useSWR("/api/rotas", fetcher)
  const rota = (data as Rota[] | undefined)?.find(r => r.id === id)

  if (!rota) {
    return (
      <>
        <Header title="Rota não encontrada" />
        <div className="p-6">
          <p className="text-zinc-500">A rota solicitada não foi encontrada.</p>
          <Link href="/dashboard/roteirizacao">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
        </div>
      </>
    )
  }

  const totalValue = rota.pedidos.reduce((sum, p) => sum + p.valor, 0)
  const deliveredCount = rota.pedidos.filter(p => p.status === "entregue").length

  return (
    <>
      <Header title="Detalhes da Rota" />
      <div className="p-6">
        {/* Back button and title */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard/roteirizacao">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">{rota.nome}</h2>
            <p className="text-sm text-zinc-500">
              Criada em {formatDateTime(rota.dataCriacao)}
            </p>
          </div>
          <span className={cn(
            "ml-auto px-3 py-1 rounded-full text-sm font-medium",
            rota.status === "em_andamento" ? "bg-blue-100 text-blue-800" :
            rota.status === "finalizada" ? "bg-emerald-100 text-emerald-800" :
            "bg-amber-100 text-amber-800"
          )}>
            {rota.status === "em_andamento" ? "Em Andamento" :
             rota.status === "finalizada" ? "Finalizada" : "Planejada"}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Info and Deliveries */}
          <div className="space-y-6">
            {/* Route Stats */}
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <h3 className="font-semibold text-zinc-900 mb-4">Resumo</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-zinc-500 text-sm mb-1">
                    <Package className="w-4 h-4" />
                    Pedidos
                  </div>
                  <p className="text-xl font-bold text-zinc-900">
                    {deliveredCount}/{rota.pedidos.length}
                  </p>
                </div>
                <div className="bg-zinc-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-zinc-500 text-sm mb-1">
                    <MapPin className="w-4 h-4" />
                    Distância
                  </div>
                  <p className="text-xl font-bold text-zinc-900">{formatDistance(rota.distanciaTotal)}</p>
                </div>
                <div className="bg-zinc-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-zinc-500 text-sm mb-1">
                    <Clock className="w-4 h-4" />
                    Tempo Est.
                  </div>
                  <p className="text-xl font-bold text-zinc-900">{formatDuration(rota.tempoEstimado)}</p>
                </div>
                <div className="bg-zinc-50 rounded-lg p-3">
                  <div className="text-zinc-500 text-sm mb-1">Valor Total</div>
                  <p className="text-xl font-bold text-emerald-600">{formatCurrency(totalValue)}</p>
                </div>
              </div>
            </div>

            {/* Entregador Info */}
            {rota.entregador && (
              <div className="bg-white border border-zinc-200 rounded-xl p-4">
                <h3 className="font-semibold text-zinc-900 mb-4">Entregador</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-semibold text-lg">
                    {rota.entregador.nome.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-zinc-900">{rota.entregador.nome}</p>
                    <p className="text-sm text-zinc-500">{getTipoVeiculoLabel(rota.entregador.veiculo)} - {rota.entregador.placaVeiculo}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Phone className="w-4 h-4 mr-2" />
                    Ligar
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <MapPin className="w-4 h-4 mr-2" />
                    Localizar
                  </Button>
                </div>
              </div>
            )}

            {/* Delivery List */}
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <h3 className="font-semibold text-zinc-900 mb-4">Sequência de Entregas</h3>
              <div className="space-y-3">
                {rota.pedidos.map((pedido, index) => (
                  <div 
                    key={pedido.id} 
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg border",
                      pedido.status === "entregue" ? "bg-emerald-50 border-emerald-200" : "bg-white border-zinc-200"
                    )}
                  >
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                        pedido.status === "entregue" 
                          ? "bg-emerald-600 text-white" 
                          : "bg-zinc-200 text-zinc-600"
                      )}>
                        {pedido.status === "entregue" ? <CheckCircle className="w-4 h-4" /> : index + 1}
                      </div>
                      {index < rota.pedidos.length - 1 && (
                        <div className="w-0.5 h-8 bg-zinc-200 mt-1" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-zinc-900">{pedido.numero}</span>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-medium",
                          getStatusPedidoColor(pedido.status)
                        )}>
                          {getStatusPedidoLabel(pedido.status)}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-900">{pedido.cliente.nome}</p>
                      <p className="text-sm text-zinc-500 truncate">
                        {pedido.endereco.logradouro}, {pedido.endereco.numero}
                      </p>
                      <p className="text-sm font-medium text-emerald-600 mt-1">
                        {formatCurrency(pedido.valor)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column - Map */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-zinc-200 rounded-xl p-4 h-full">
              <h3 className="font-semibold text-zinc-900 mb-4">Mapa da Rota</h3>
              <div className="h-[600px]">
                <RouteMap 
                  pedidos={rota.pedidos} 
                  selectedPedidos={rota.pedidos.map(p => p.id)} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
