"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import dynamic from "next/dynamic"
import { Header } from "@/components/layout/header"
import { PedidosList } from "@/components/roteirizacao/pedidos-list"
import { RouteSummary } from "@/components/roteirizacao/route-summary"
import type { Configuracoes, Entregador, Loja, Pedido } from "@/types"

// Dynamic import for map to avoid SSR issues
const RouteMap = dynamic(
  () => import("@/components/roteirizacao/route-map").then(mod => mod.RouteMap),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[400px] bg-zinc-100 rounded-lg flex items-center justify-center">
        <p className="text-zinc-500">Carregando mapa...</p>
      </div>
    )
  }
)

const fetcher = async (url: string) => {
  const response = await fetch(url, { cache: "no-store" })
  if (!response.ok) {
    throw new Error("Falha ao carregar pedidos")
  }
  return response.json()
}

export default function RoteirizacaoPage() {
  const { data } = useSWR("/api/pedidos", fetcher)
  const { data: entregadoresData } = useSWR<Entregador[]>("/api/entregadores", fetcher)
  const { data: configuracoes } = useSWR<Configuracoes>("/api/configuracoes", fetcher)
  const pedidosPendentes: Pedido[] = (data?.pedidos ?? []).filter((pedido: Pedido) => pedido.status === "pendente")
  const entregadores = entregadoresData ?? []
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [selectedPedidos, setSelectedPedidos] = useState<string[]>([])
  const [selectedEntregador, setSelectedEntregador] = useState<string | null>(null)

  const fallbackLoja: Loja = {
    id: "fallback",
    nome: "Loja",
    cnpj: "",
    telefone: "",
    email: "",
    endereco: {
      logradouro: "",
      numero: "",
      bairro: "",
      cidade: "",
      uf: "",
      cep: "",
      latitude: -23.5489,
      longitude: -46.6388,
    },
    coordenadas: { latitude: -23.5489, longitude: -46.6388 },
    horarioOperacao: {
      domingo: { abertura: "00:00", fechamento: "00:00", ativo: false },
      segunda: { abertura: "08:00", fechamento: "18:00", ativo: true },
      terca: { abertura: "08:00", fechamento: "18:00", ativo: true },
      quarta: { abertura: "08:00", fechamento: "18:00", ativo: true },
      quinta: { abertura: "08:00", fechamento: "18:00", ativo: true },
      sexta: { abertura: "08:00", fechamento: "18:00", ativo: true },
      sabado: { abertura: "08:00", fechamento: "12:00", ativo: false },
    },
    raioEntregaKm: 10,
    taxaEntregaBase: 0,
    taxaPorKm: 0,
    diariaEntregador: 0,
  }

  const pedidosData = pedidos.length > 0 ? pedidos : pedidosPendentes

  const selectedPedidosData = useMemo(() => 
    selectedPedidos.map(id => pedidosData.find(p => p.id === id)!).filter(Boolean),
    [selectedPedidos, pedidosData]
  )

  const handleTogglePedido = (id: string) => {
    setSelectedPedidos(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id)
        : [...prev, id]
    )
  }

  const handleReorder = (newPedidos: Pedido[]) => {
    setPedidos(newPedidos)
    // Update selected order based on new order
    const newSelectedOrder = newPedidos
      .filter(p => selectedPedidos.includes(p.id))
      .map(p => p.id)
    setSelectedPedidos(newSelectedOrder)
  }

  const handleOptimize = () => {
    // In a real app, this would call a routing API
    // For now, just reverse the order as a demo
    setSelectedPedidos(prev => [...prev].reverse())
  }

  const handleCreateRoute = () => {
    if (!selectedEntregador || selectedPedidos.length === 0) {
      return
    }

    void fetch("/api/rotas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pedidoIds: selectedPedidos,
        entregadorId: selectedEntregador,
        nome: `Rota ${new Date().toLocaleDateString("pt-BR")}`
      })
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Falha ao criar rota")
        }

        setSelectedPedidos([])
        setSelectedEntregador(null)
        setPedidos([])
        alert("Rota criada com sucesso.")
      })
      .catch(() => {
        alert("Não foi possível criar a rota.")
      })
  }

  return (
    <>
      <Header title="Roteirização" />
      <div className="p-4 sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-zinc-900">Criar Nova Rota</h2>
          <p className="text-sm text-zinc-500">
            Selecione os pedidos e arraste para definir a ordem de entrega
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pedidos List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-semibold text-zinc-900">Pedidos Pendentes</h3>
                <span className="text-sm text-zinc-500">{pedidosData.length} pedidos</span>
              </div>
              <div className="max-h-[500px] overflow-y-auto pr-2">
                <PedidosList
                  pedidos={pedidosData}
                  selectedPedidos={selectedPedidos}
                  onTogglePedido={handleTogglePedido}
                  onReorder={handleReorder}
                />
              </div>
            </div>

            <RouteSummary
              selectedPedidos={selectedPedidosData}
              entregadores={entregadores}
              selectedEntregador={selectedEntregador}
              onEntregadorChange={setSelectedEntregador}
              onOptimize={handleOptimize}
              onCreateRoute={handleCreateRoute}
            />
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-zinc-200 rounded-xl p-4 h-full">
              <h3 className="font-semibold text-zinc-900 mb-4">Mapa da Rota</h3>
              <div className="h-[420px] md:h-[520px] xl:h-[600px]">
                <RouteMap 
                  loja={configuracoes?.loja ?? fallbackLoja}
                  pedidos={pedidosData} 
                  selectedPedidos={selectedPedidos} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
