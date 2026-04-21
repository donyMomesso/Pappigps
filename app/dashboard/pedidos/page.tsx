"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { PedidosTable } from "@/components/pedidos/pedidos-table"
import { PedidoFilters } from "@/components/pedidos/pedido-filters"
import { NovoPedidoModal } from "@/components/pedidos/novo-pedido-modal"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { mockPedidos } from "@/mocks/data"
import type { StatusPedido } from "@/types"

export default function PedidosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<StatusPedido | "todos">("todos")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPedidos = mockPedidos.filter(pedido => {
    const matchesStatus = statusFilter === "todos" || pedido.status === statusFilter
    const matchesSearch = searchTerm === "" || 
      pedido.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <>
      <Header title="Pedidos" />
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Gerenciar Pedidos</h2>
            <p className="text-sm text-zinc-500">{mockPedidos.length} pedidos cadastrados</p>
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700"
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

        <PedidosTable pedidos={filteredPedidos} />

        <NovoPedidoModal 
          open={isModalOpen} 
          onOpenChange={setIsModalOpen}
        />
      </div>
    </>
  )
}
