"use client"

import { MapPin, Clock, Package, DollarSign, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatCurrency, formatDistance, formatDuration, getTipoVeiculoLabel } from "@/lib/utils"
import type { Pedido, Entregador } from "@/types"

interface RouteSummaryProps {
  selectedPedidos: Pedido[]
  entregadores: Entregador[]
  selectedEntregador: string | null
  onEntregadorChange: (id: string) => void
  onOptimize: () => void
  onCreateRoute: () => void
}

export function RouteSummary({
  selectedPedidos,
  entregadores,
  selectedEntregador,
  onEntregadorChange,
  onOptimize,
  onCreateRoute,
}: RouteSummaryProps) {
  const totalValue = selectedPedidos.reduce((sum, p) => sum + p.valor, 0)
  
  // Mock calculation - would be real distance calculation with routing API
  const estimatedDistance = selectedPedidos.length * 2.5
  const estimatedTime = selectedPedidos.length * 12

  const availableEntregadores = entregadores.filter(e => e.status === "disponivel")

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-4">
      <h3 className="font-semibold text-zinc-900 mb-4">Fechar Rota</h3>

      {/* Stats */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="bg-zinc-50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-zinc-500 text-sm mb-1">
            <Package className="w-4 h-4" />
            Pedidos
          </div>
          <p className="text-xl font-bold text-zinc-900">{selectedPedidos.length}</p>
        </div>
        <div className="bg-zinc-50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-zinc-500 text-sm mb-1">
            <DollarSign className="w-4 h-4" />
            Valor Total
          </div>
          <p className="text-xl font-bold text-zinc-900">{formatCurrency(totalValue)}</p>
        </div>
        <div className="bg-zinc-50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-zinc-500 text-sm mb-1">
            <MapPin className="w-4 h-4" />
            Distância
          </div>
          <p className="text-xl font-bold text-zinc-900">{formatDistance(estimatedDistance)}</p>
        </div>
        <div className="bg-zinc-50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-zinc-500 text-sm mb-1">
            <Clock className="w-4 h-4" />
            Tempo Est.
          </div>
          <p className="text-xl font-bold text-zinc-900">{formatDuration(estimatedTime)}</p>
        </div>
      </div>

      {selectedPedidos.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
            Sequência no mapa
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedPedidos.map((pedido, index) => (
              <span
                key={pedido.id}
                className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700"
              >
                {index + 1}. #{pedido.numero}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Entregador Selection */}
      <div className="mb-4">
        <label className="text-sm font-medium text-zinc-700 mb-2 block">
          Entregador
        </label>
        <Select value={selectedEntregador || ""} onValueChange={onEntregadorChange}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione um entregador" />
          </SelectTrigger>
          <SelectContent>
            {availableEntregadores.length === 0 ? (
              <SelectItem value="none" disabled>
                Nenhum entregador disponível
              </SelectItem>
            ) : (
              availableEntregadores.map((entregador) => (
                <SelectItem key={entregador.id} value={entregador.id}>
                  <div className="flex items-center gap-2">
                    <span>{entregador.nome}</span>
                    <span className="text-zinc-500 text-xs">
                      ({getTipoVeiculoLabel(entregador.veiculo)})
                    </span>
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full"
          onClick={onOptimize}
          disabled={selectedPedidos.length < 2}
        >
          <Zap className="w-4 h-4 mr-2" />
          Otimizar Rota
        </Button>
        <Button
          className="w-full bg-emerald-600 hover:bg-emerald-700"
          onClick={onCreateRoute}
          disabled={selectedPedidos.length === 0 || !selectedEntregador}
        >
          Criar Rota
        </Button>
      </div>
    </div>
  )
}
