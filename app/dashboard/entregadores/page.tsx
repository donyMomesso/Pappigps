"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { EntregadoresGrid } from "@/components/entregadores/entregadores-grid"
import { NovoEntregadorModal } from "@/components/entregadores/novo-entregador-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import { mockEntregadores } from "@/mocks/data"
import type { StatusEntregador } from "@/types"
import { cn } from "@/lib/utils"

const statusOptions: { value: StatusEntregador | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "disponivel", label: "Disponíveis" },
  { value: "em_rota", label: "Em Rota" },
  { value: "offline", label: "Offline" },
]

export default function EntregadoresPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<StatusEntregador | "todos">("todos")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredEntregadores = mockEntregadores.filter(entregador => {
    const matchesStatus = statusFilter === "todos" || entregador.status === statusFilter
    const matchesSearch = searchTerm === "" || 
      entregador.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entregador.telefone.includes(searchTerm)
    return matchesStatus && matchesSearch
  })

  return (
    <>
      <Header title="Entregadores" />
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Gerenciar Entregadores</h2>
            <p className="text-sm text-zinc-500">{mockEntregadores.length} entregadores cadastrados</p>
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Entregador
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-zinc-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input
                placeholder="Buscar por nome ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              {statusOptions.map((option) => (
                <Button
                  key={option.value}
                  variant="ghost"
                  size="sm"
                  onClick={() => setStatusFilter(option.value)}
                  className={cn(
                    "whitespace-nowrap",
                    statusFilter === option.value
                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                      : "text-zinc-600 hover:text-zinc-900"
                  )}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <EntregadoresGrid entregadores={filteredEntregadores} />

        <NovoEntregadorModal 
          open={isModalOpen} 
          onOpenChange={setIsModalOpen}
        />
      </div>
    </>
  )
}
