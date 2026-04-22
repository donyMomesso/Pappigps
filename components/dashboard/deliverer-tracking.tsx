"use client"

import useSWR from 'swr'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Clock } from "lucide-react"
import type { Entregador } from "@/types"

const fetcher = async (url: string) => {
  const response = await fetch(url, { cache: "no-store" })
  if (!response.ok) {
    throw new Error("Falha ao carregar entregadores")
  }
  return response.json()
}

export function DelivererTracking() {
  const { data } = useSWR("/api/entregadores", fetcher, { refreshInterval: 30000 })
  const entregadoresOnline: Entregador[] = (data ?? []).filter((entregador: Entregador) => entregador.status !== "offline")

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="w-5 h-5" />
          Rastreamento de Entregadores
        </CardTitle>
        <CardDescription>
          Localização em tempo real dos entregadores ativos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {entregadoresOnline.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhum entregador online no momento
            </p>
          ) : (
            entregadoresOnline.map((entregador) => {
              const localizacao = entregador.localizacaoAtual

              return (
                <div key={entregador.id} className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{entregador.nome}</p>
                      <p className="text-xs text-muted-foreground">
                        {entregador.veiculo} • {entregador.status === 'em_rota' ? 'Em rota' : 'Disponível'}
                      </p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <Badge variant={localizacao ? "default" : "secondary"} className="text-xs">
                      {localizacao ? "Online" : "Localização indisponível"}
                    </Badge>
                    {localizacao && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Última: {new Date(localizacao.timestamp).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-700 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Atualização automática a cada 30 segundos
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
