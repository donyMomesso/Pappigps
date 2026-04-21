"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Clock } from "lucide-react"
import { mockEntregadores } from "@/mocks/data"
import type { Entregador } from "@/types"

export function DelivererTracking() {
  const [entregadoresOnline, setEntregadoresOnline] = useState<Entregador[]>([])

  useEffect(() => {
    // Filtrar entregadores online/disponíveis
    const online = mockEntregadores.filter(e => e.status !== 'offline')
    setEntregadoresOnline(online)

    // Simular atualização de localizações (em produção, seria via WebSocket ou polling)
    const interval = setInterval(() => {
      online.forEach(entregador => {
        const localStorageKey = `localizacao_${entregador.id}`
        const localizacaoStr = localStorage.getItem(localStorageKey)
        if (localizacaoStr) {
          const localizacao = JSON.parse(localizacaoStr)
          // Atualizar mock ou estado se necessário
        }
      })
    }, 30000) // Atualizar a cada 30 segundos

    return () => clearInterval(interval)
  }, [])

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
              const localStorageKey = `localizacao_${entregador.id}`
              const localizacaoStr = localStorage.getItem(localStorageKey)
              const localizacao = localizacaoStr ? JSON.parse(localizacaoStr) : null

              return (
                <div key={entregador.id} className="flex items-center justify-between p-3 border rounded-lg">
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
                  <div className="text-right">
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