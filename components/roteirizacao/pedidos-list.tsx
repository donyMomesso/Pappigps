"use client"

import { MapPin } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import type { Pedido } from "@/types"

interface PedidosListProps {
  pedidos: Pedido[]
  selectedPedidos: string[]
  onTogglePedido: (id: string) => void
  onReorder: (pedidos: Pedido[]) => void
}

export function PedidosList({ pedidos, selectedPedidos, onTogglePedido, onReorder }: PedidosListProps) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
      {pedidos.map((pedido) => {
        const isSelected = selectedPedidos.includes(pedido.id)
        return (
          <div
            key={pedido.id}
            className={cn(
              "rounded-xl border p-3 transition-all",
              isSelected ? "border-emerald-500 bg-emerald-50" : "border-zinc-200 hover:border-zinc-300"
            )}
          >
            <label className="flex cursor-pointer items-start gap-3">
              <div className="pt-0.5">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => onTogglePedido(pedido.id)}
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-base font-semibold tracking-tight text-zinc-900">#{pedido.numero}</span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[11px] font-medium",
                      isSelected ? "bg-emerald-600 text-white" : "bg-zinc-100 text-zinc-600"
                    )}
                  >
                    {isSelected ? "No mapa" : "Oculto"}
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-1 text-sm text-zinc-500">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">
                    {pedido.endereco.bairro || pedido.endereco.cidade || `${pedido.endereco.logradouro}, ${pedido.endereco.numero}`}
                  </span>
                </div>
              </div>
            </label>
          </div>
        )
      })}
    </div>
  )
}
