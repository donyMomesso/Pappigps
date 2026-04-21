"use client"

import Link from "next/link"
import { ArrowRight, MapPin, Clock, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDistance, formatDuration, getTipoVeiculoLabel } from "@/lib/utils"
import type { Rota } from "@/types"

interface ActiveRoutesProps {
  rotas: Rota[]
}

export function ActiveRoutes({ rotas }: ActiveRoutesProps) {
  const rotasAtivas = rotas.filter(r => r.status === 'em_andamento' || r.status === 'planejada')

  return (
    <div className="bg-white rounded-xl border border-zinc-200">
      <div className="flex items-center justify-between p-6 border-b border-zinc-100">
        <h3 className="font-semibold text-zinc-900">Rotas Ativas</h3>
        <Link href="/dashboard/roteirizacao">
          <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700">
            Ver todas
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>
      <div className="divide-y divide-zinc-100">
        {rotasAtivas.length === 0 ? (
          <div className="p-8 text-center text-zinc-500">
            Nenhuma rota ativa no momento
          </div>
        ) : (
          rotasAtivas.map((rota) => (
            <Link 
              key={rota.id} 
              href={`/dashboard/roteirizacao/${rota.id}`}
              className="block p-4 hover:bg-zinc-50"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium text-zinc-900">{rota.nome}</p>
                  {rota.entregador && (
                    <p className="text-sm text-zinc-500">
                      {rota.entregador.nome} - {getTipoVeiculoLabel(rota.entregador.veiculo)}
                    </p>
                  )}
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  rota.status === 'em_andamento' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {rota.status === 'em_andamento' ? 'Em Andamento' : 'Planejada'}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-zinc-500">
                <span className="flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  {rota.pedidos.length} pedidos
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {formatDistance(rota.distanciaTotal)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatDuration(rota.tempoEstimado)}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
