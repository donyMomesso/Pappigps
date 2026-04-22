"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { StatusPedido } from "@/types"

interface PedidoFiltersProps {
  statusFilter: StatusPedido | "todos"
  onStatusChange: (status: StatusPedido | "todos") => void
  searchTerm: string
  onSearchChange: (value: string) => void
}

const statusOptions: { value: StatusPedido | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "pendente", label: "Pendentes" },
  { value: "em_preparo", label: "Em Preparo" },
  { value: "em_rota", label: "Em Rota" },
  { value: "entregue", label: "Entregues" },
  { value: "cancelado", label: "Cancelados" },
]

export function PedidoFilters({
  statusFilter,
  onStatusChange,
  searchTerm,
  onSearchChange,
}: PedidoFiltersProps) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-4 mb-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            placeholder="Buscar por número ou cliente..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:flex-wrap md:overflow-visible md:pb-0">
          {statusOptions.map((option) => (
            <Button
              key={option.value}
              variant="ghost"
              size="sm"
              onClick={() => onStatusChange(option.value)}
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
  )
}
