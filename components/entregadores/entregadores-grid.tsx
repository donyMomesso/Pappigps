"use client"

import { Phone, Mail, Star, Package, MoreHorizontal, Edit, Trash2, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn, getStatusEntregadorLabel, getStatusEntregadorColor, getTipoVeiculoLabel, formatDate } from "@/lib/utils"
import type { Entregador } from "@/types"

interface EntregadoresGridProps {
  entregadores: Entregador[]
}

export function EntregadoresGrid({ entregadores }: EntregadoresGridProps) {
  if (entregadores.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-zinc-200 p-12 text-center">
        <p className="text-zinc-500">Nenhum entregador encontrado</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
      {entregadores.map((entregador) => (
        <div 
          key={entregador.id} 
          className="bg-white border border-zinc-200 rounded-xl p-5 hover:shadow-md transition-shadow"
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-semibold text-lg">
                {entregador.nome.charAt(0)}
              </div>
              <div className="min-w-0">
                <h3 className="truncate font-semibold text-zinc-900">{entregador.nome}</h3>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-xs font-medium",
                  getStatusEntregadorColor(entregador.status)
                )}>
                  {getStatusEntregadorLabel(entregador.status)}
                </span>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <MapPin className="w-4 h-4 mr-2" />
                  Ver localização
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remover
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-zinc-600">
              <Phone className="w-4 h-4 text-zinc-400" />
              {entregador.telefone}
            </div>
            {entregador.codigoAcesso && (
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <MapPin className="w-4 h-4 text-zinc-400" />
                Código app: <span className="font-medium text-zinc-900">{entregador.codigoAcesso}</span>
              </div>
            )}
            {entregador.email && (
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <Mail className="w-4 h-4 text-zinc-400" />
                <span className="truncate">{entregador.email}</span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-zinc-100">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xs text-zinc-500 mb-1">Veículo</p>
                <p className="font-medium text-zinc-900 text-sm">{getTipoVeiculoLabel(entregador.veiculo)}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">Entregas</p>
                <div className="flex items-center justify-center gap-1">
                  <Package className="w-3 h-3 text-zinc-400" />
                  <span className="font-medium text-zinc-900 text-sm">{entregador.totalEntregas || 0}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">Avaliação</p>
                <div className="flex items-center justify-center gap-1">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span className="font-medium text-zinc-900 text-sm">{entregador.avaliacaoMedia?.toFixed(1) || "-"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-zinc-100">
            <p className="text-xs text-zinc-400">
              Cadastrado em {formatDate(entregador.dataCadastro)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
