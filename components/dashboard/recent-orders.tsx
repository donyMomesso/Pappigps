"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn, formatCurrency, formatTime, getStatusPedidoLabel, getStatusPedidoColor } from "@/lib/utils"
import type { Pedido } from "@/types"

interface RecentOrdersProps {
  pedidos: Pedido[]
}

export function RecentOrders({ pedidos }: RecentOrdersProps) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200">
      <div className="flex items-center justify-between p-6 border-b border-zinc-100">
        <h3 className="font-semibold text-zinc-900">Pedidos Recentes</h3>
        <Link href="/dashboard/pedidos">
          <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700">
            Ver todos
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>
      <div className="divide-y divide-zinc-100">
        {pedidos.slice(0, 5).map((pedido) => (
          <div key={pedido.id} className="p-4 flex items-center justify-between hover:bg-zinc-50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center text-sm font-medium text-zinc-600">
                {pedido.numero.split('-')[1]}
              </div>
              <div>
                <p className="font-medium text-zinc-900">{pedido.cliente.nome}</p>
                <p className="text-sm text-zinc-500">{pedido.endereco.bairro}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-medium text-zinc-900">{formatCurrency(pedido.valor)}</p>
                <p className="text-sm text-zinc-500">{formatTime(pedido.dataCriacao)}</p>
              </div>
              <span className={cn(
                "px-2.5 py-1 rounded-full text-xs font-medium",
                getStatusPedidoColor(pedido.status)
              )}>
                {getStatusPedidoLabel(pedido.status)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
