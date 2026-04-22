"use client"

import { useState } from "react"
import useSWR from "swr"
import { Header } from "@/components/layout/header"
import { EntregadoresGrid } from "@/components/entregadores/entregadores-grid"
import { NovoEntregadorModal } from "@/components/entregadores/novo-entregador-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import type { Entregador, StatusEntregador } from "@/types"
import { cn } from "@/lib/utils"

const fetcher = async (url: string) => {
  const response = await fetch(url, { cache: "no-store" })
  if (!response.ok) {
    throw new Error("Falha ao carregar entregadores")
  }
  return response.json()
}

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
  const { data, mutate } = useSWR("/api/entregadores", fetcher)
  const entregadores: Entregador[] = data ?? []

  const filteredEntregadores = entregadores.filter(entregador => {
    const matchesStatus = statusFilter === "todos" || entregador.status === statusFilter
    const matchesSearch = searchTerm === "" || 
      entregador.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entregador.telefone.includes(searchTerm)
    return matchesStatus && matchesSearch
  })

  return (
    <>
      <Header title="Entregadores" />
      <div className="p-4 sm:p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Gerenciar Entregadores</h2>
            <p className="text-sm text-zinc-500">{entregadores.length} entregadores cadastrados</p>
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Entregador
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-zinc-200 p-4 mb-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input
                placeholder="Buscar por nome ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
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
          onCreated={() => void mutate()}
        />
      </div>
    </>
  )
}
