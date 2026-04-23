"use client"

import { useState } from "react"
import useSWR from "swr"
import { Header } from "@/components/layout/header"
import { PedidosTable } from "@/components/pedidos/pedidos-table"
import { PedidoFilters } from "@/components/pedidos/pedido-filters"
import { NovoPedidoModal } from "@/components/pedidos/novo-pedido-modal"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { isCardapioWebPedido } from "@/lib/utils"
import type { Pedido, StatusPedido } from "@/types"

const fetcher = async (url: string) => {
  const response = await fetch(url, { cache: "no-store" })
  if (!response.ok) {
    throw new Error("Falha ao carregar pedidos")
  }
  return response.json()
}

export default function PedidosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<StatusPedido | "todos">("todos")
  const [searchTerm, setSearchTerm] = useState("")
  const [actionPedidoId, setActionPedidoId] = useState<string | null>(null)
  const { data, isLoading, mutate } = useSWR("/api/pedidos", fetcher)
  const pedidos: Pedido[] = data?.pedidos ?? []

  const filteredPedidos = pedidos.filter(pedido => {
    const matchesStatus = statusFilter === "todos" || pedido.status === statusFilter
    const matchesSearch = searchTerm === "" || 
      pedido.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const handleViewDetails = async (pedido: Pedido) => {
    setActionPedidoId(pedido.id)
    try {
      const response = await fetch(`/api/integrations/cardapioweb/orders/${pedido.id}`)
      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Falha ao consultar detalhes do pedido")
      }

      const detalhe = result.pedido as Pedido
      toast({
        title: `Pedido ${detalhe.numero}`,
        description: `${detalhe.cliente.nome} • ${isCardapioWebPedido(detalhe) ? "Cardápio Web" : "Pedido interno"} • ${detalhe.status} • ${new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(detalhe.valor)}`,
      })
      await mutate()
    } catch (error) {
      toast({
        title: "Erro ao consultar pedido",
        description: error instanceof Error ? error.message : "Não foi possível consultar os detalhes.",
        variant: "destructive",
      })
    } finally {
      setActionPedidoId(null)
    }
  }

  const handleAcceptOrder = async (pedido: Pedido) => {
    setActionPedidoId(pedido.id)
    try {
      const response = await fetch(`/api/integrations/cardapioweb/orders/${pedido.id}/accept`, {
        method: "POST",
      })
      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Falha ao aceitar pedido")
      }

      toast({
        title: "Pedido aceito",
        description: `O pedido ${pedido.numero} foi aceito no Cardápio Web.`,
      })
      await mutate()
    } catch (error) {
      toast({
        title: "Erro ao aceitar pedido",
        description: error instanceof Error ? error.message : "Não foi possível aceitar o pedido.",
        variant: "destructive",
      })
    } finally {
      setActionPedidoId(null)
    }
  }

  const handleReadyOrder = async (pedido: Pedido) => {
    setActionPedidoId(pedido.id)
    try {
      const response = await fetch(`/api/integrations/cardapioweb/orders/${pedido.id}/ready`, {
        method: "POST",
      })
      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Falha ao marcar pedido como pronto")
      }

      toast({
        title: "Pedido pronto",
        description: `O pedido ${pedido.numero} foi marcado como pronto no Cardápio Web.`,
      })
      await mutate()
    } catch (error) {
      toast({
        title: "Erro ao marcar pedido",
        description: error instanceof Error ? error.message : "Não foi possível marcar o pedido como pronto.",
        variant: "destructive",
      })
    } finally {
      setActionPedidoId(null)
    }
  }

  return (
    <>
      <Header title="Pedidos" />
      <div className="p-4 sm:p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Gerenciar Pedidos</h2>
            <p className="text-sm text-zinc-500">
              {isLoading ? "Carregando pedidos..." : `${pedidos.length} pedidos carregados`}
            </p>
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Pedido
          </Button>
        </div>

        <PedidoFilters
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <PedidosTable
          pedidos={filteredPedidos}
          actionPedidoId={actionPedidoId}
          onViewDetails={handleViewDetails}
          onAcceptOrder={handleAcceptOrder}
          onReadyOrder={handleReadyOrder}
        />

        <NovoPedidoModal 
          open={isModalOpen} 
          onOpenChange={setIsModalOpen}
        />
      </div>
    </>
  )
}
