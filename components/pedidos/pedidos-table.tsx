"use client"

import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn, formatCurrency, formatDateTime, getStatusPedidoLabel, getStatusPedidoColor, getFormaPagamentoLabel } from "@/lib/utils"
import type { Pedido } from "@/types"

interface PedidosTableProps {
  pedidos: Pedido[]
}

export function PedidosTable({ pedidos }: PedidosTableProps) {
  if (pedidos.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
        <p className="text-zinc-500">Nenhum pedido encontrado</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
      <div className="hidden xl:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50">
              <TableHead className="font-semibold">Pedido</TableHead>
              <TableHead className="font-semibold">Cliente</TableHead>
              <TableHead className="font-semibold">Endereço</TableHead>
              <TableHead className="font-semibold">Valor</TableHead>
              <TableHead className="font-semibold">Pagamento</TableHead>
              <TableHead className="font-semibold">Data</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pedidos.map((pedido) => (
              <TableRow key={pedido.id} className="hover:bg-zinc-50">
                <TableCell className="font-medium">{pedido.numero}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-zinc-900">{pedido.cliente.nome}</p>
                    <p className="text-sm text-zinc-500">{pedido.cliente.telefone}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-[200px]">
                    <p className="text-zinc-900 truncate">
                      {pedido.endereco.logradouro}, {pedido.endereco.numero}
                    </p>
                    <p className="text-sm text-zinc-500">{pedido.endereco.bairro}</p>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{formatCurrency(pedido.valor)}</TableCell>
                <TableCell>{getFormaPagamentoLabel(pedido.formaPagamento)}</TableCell>
                <TableCell className="text-zinc-500">{formatDateTime(pedido.dataCriacao)}</TableCell>
                <TableCell>
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-medium",
                    getStatusPedidoColor(pedido.status)
                  )}>
                    {getStatusPedidoLabel(pedido.status)}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        Ver detalhes
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Cancelar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="space-y-3 p-4 xl:hidden">
        {pedidos.map((pedido) => (
          <div key={pedido.id} className="rounded-xl border border-zinc-200 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-zinc-900">{pedido.numero}</p>
                <p className="text-sm text-zinc-500">{formatDateTime(pedido.dataCriacao)}</p>
              </div>
              <span className={cn(
                "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
                getStatusPedidoColor(pedido.status)
              )}>
                {getStatusPedidoLabel(pedido.status)}
              </span>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <p className="font-medium text-zinc-900">{pedido.cliente.nome}</p>
                <p className="text-sm text-zinc-500">{pedido.cliente.telefone}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-900">
                  {pedido.endereco.logradouro}, {pedido.endereco.numero}
                </p>
                <p className="text-sm text-zinc-500">{pedido.endereco.bairro}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-zinc-50 p-3">
                  <p className="text-xs text-zinc-500">Valor</p>
                  <p className="font-medium text-zinc-900">{formatCurrency(pedido.valor)}</p>
                </div>
                <div className="rounded-lg bg-zinc-50 p-3">
                  <p className="text-xs text-zinc-500">Pagamento</p>
                  <p className="font-medium text-zinc-900">{getFormaPagamentoLabel(pedido.formaPagamento)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
