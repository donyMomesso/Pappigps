"use client"

import { GripVertical, MapPin, Package } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { cn, formatCurrency, getStatusPedidoLabel, getStatusPedidoColor } from "@/lib/utils"
import type { Pedido } from "@/types"

interface PedidosListProps {
  pedidos: Pedido[]
  selectedPedidos: string[]
  onTogglePedido: (id: string) => void
  onReorder: (pedidos: Pedido[]) => void
}

export function PedidosList({ pedidos, selectedPedidos, onTogglePedido, onReorder }: PedidosListProps) {
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString())
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    const dragIndex = parseInt(e.dataTransfer.getData("text/plain"))
    
    if (dragIndex === dropIndex) return

    const newPedidos = [...pedidos]
    const [removed] = newPedidos.splice(dragIndex, 1)
    newPedidos.splice(dropIndex, 0, removed)
    onReorder(newPedidos)
  }

  return (
    <div className="space-y-2">
      {pedidos.map((pedido, index) => {
        const isSelected = selectedPedidos.includes(pedido.id)
        return (
          <div
            key={pedido.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={cn(
              "bg-white border rounded-lg p-3 cursor-move transition-all",
              isSelected ? "border-emerald-500 bg-emerald-50" : "border-zinc-200 hover:border-zinc-300"
            )}
          >
            <div className="flex items-start gap-3">
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-zinc-400" />
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => onTogglePedido(pedido.id)}
                />
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
                
                <p className="text-sm text-zinc-900 font-medium">{pedido.cliente.nome}</p>
                
                <div className="flex items-center gap-1 text-sm text-zinc-500 mt-1">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">
                    {pedido.endereco.logradouro}, {pedido.endereco.numero} - {pedido.endereco.bairro}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1 text-sm text-zinc-500">
                    <Package className="w-3 h-3" />
                    <span>{pedido.volumes || 1} vol.</span>
                  </div>
                  <span className="font-medium text-emerald-600">{formatCurrency(pedido.valor)}</span>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
