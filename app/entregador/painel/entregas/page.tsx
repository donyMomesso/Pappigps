"use client"

import { useState } from 'react'
import useSWR from 'swr'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Package, 
  MapPin, 
  Navigation, 
  Phone, 
  Clock,
  CheckCircle2,
  XCircle,
  DollarSign,
  User
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { Loja, Pedido } from '@/types'
import dynamic from 'next/dynamic'

const EntregasMap = dynamic(() => import('@/components/entregador/entregas-map'), {
  ssr: false,
  loading: () => <div className="h-[300px] bg-muted animate-pulse rounded-lg" />
})

export default function EntregasPage() {
  const [selectedEntrega, setSelectedEntrega] = useState<Pedido | null>(null)
  const fetcher = async (url: string) => {
    const response = await fetch(url, { cache: 'no-store' })
    if (!response.ok) {
      throw new Error('Falha ao carregar entregas')
    }
    return response.json()
  }
  const { data, mutate } = useSWR('/api/entregador/me/entregas', fetcher)
  const entregasAtivas: Pedido[] = data?.ativas ?? []
  const entregasConcluidas: Pedido[] = data?.concluidas ?? []
  const loja: Loja | null = data?.loja ?? null

  const handleConfirmarEntrega = async (pedidoId: string) => {
    await fetch(`/api/entregador/me/entregas/${pedidoId}`, {
      method: 'PATCH',
    })
    await mutate()
  }

  const openNavigation = (endereco: Pedido['endereco']) => {
    const address = `${endereco.logradouro}, ${endereco.numero}, ${endereco.bairro}, ${endereco.cidade}`
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`, '_blank')
  }

  return (
    <div className="p-4 lg:p-6 pb-24 lg:pb-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Minhas Entregas</h1>
        <p className="text-muted-foreground">
          Gerencie suas entregas ativas e histórico
        </p>
      </div>

      {/* Mapa com Localização */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            Mapa de Entregas
          </CardTitle>
          <CardDescription>
            Sua localização e pontos de entrega
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EntregasMap 
            loja={loja || {
              id: 'fallback',
              nome: 'Loja',
              cnpj: '',
              telefone: '',
              email: '',
              endereco: { logradouro: '', numero: '', bairro: '', cidade: '', uf: '', cep: '' },
              coordenadas: { latitude: 0, longitude: 0 },
              horarioOperacao: {
                domingo: { abertura: '00:00', fechamento: '00:00', ativo: false },
                segunda: { abertura: '00:00', fechamento: '00:00', ativo: false },
                terca: { abertura: '00:00', fechamento: '00:00', ativo: false },
                quarta: { abertura: '00:00', fechamento: '00:00', ativo: false },
                quinta: { abertura: '00:00', fechamento: '00:00', ativo: false },
                sexta: { abertura: '00:00', fechamento: '00:00', ativo: false },
                sabado: { abertura: '00:00', fechamento: '00:00', ativo: false }
              },
              raioEntregaKm: 0,
              taxaEntregaBase: 0,
              taxaPorKm: 0,
              diariaEntregador: 0
            }}
            entregas={entregasAtivas}
            onSelectEntrega={setSelectedEntrega}
          />
        </CardContent>
      </Card>

      <Tabs defaultValue="ativas" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ativas" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Ativas ({entregasAtivas.length})
          </TabsTrigger>
          <TabsTrigger value="historico" className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Histórico ({entregasConcluidas.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ativas" className="space-y-4 mt-4">
          {entregasAtivas.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                <p className="text-muted-foreground">Nenhuma entrega ativa</p>
                <p className="text-sm text-muted-foreground">
                  Aguarde novas entregas serem atribuídas a você
                </p>
              </CardContent>
            </Card>
          ) : (
            entregasAtivas
              .sort((a, b) => (a.ordemEntrega || 0) - (b.ordemEntrega || 0))
              .map((pedido) => (
                <Card 
                  key={pedido.id}
                  className={`transition-all ${
                    selectedEntrega?.id === pedido.id ? 'ring-2 ring-emerald-500' : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                          <span className="text-lg font-bold text-emerald-600">
                            {pedido.ordemEntrega || 1}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{pedido.numero}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="w-3 h-3" />
                            {pedido.cliente.nome}
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-700">Em Rota</Badge>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                        <MapPin className="w-4 h-4 text-emerald-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium text-foreground">
                            {pedido.endereco.logradouro}, {pedido.endereco.numero}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {pedido.endereco.bairro} - {pedido.endereco.cidade}
                          </p>
                          {pedido.endereco.complemento && (
                            <p className="text-sm text-muted-foreground">
                              Complemento: {pedido.endereco.complemento}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-2 bg-muted rounded-lg text-center">
                          <p className="text-xs text-muted-foreground">Valor</p>
                          <p className="font-semibold text-foreground">{formatCurrency(pedido.valor)}</p>
                        </div>
                        <div className="p-2 bg-muted rounded-lg text-center">
                          <p className="text-xs text-muted-foreground">Taxa</p>
                          <p className="font-semibold text-emerald-600">
                            {formatCurrency(pedido.taxaEntrega?.valorTotal || 0)}
                          </p>
                        </div>
                        <div className="p-2 bg-muted rounded-lg text-center">
                          <p className="text-xs text-muted-foreground">Pagamento</p>
                          <p className="font-semibold text-foreground capitalize">
                            {pedido.formaPagamento}
                          </p>
                        </div>
                      </div>

                      {pedido.observacoes && (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <p className="text-sm text-amber-800">
                            <strong>Obs:</strong> {pedido.observacoes}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => window.open(`tel:${pedido.cliente.telefone}`, '_self')}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Ligar
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => openNavigation(pedido.endereco)}
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Navegar
                      </Button>
                      <Button 
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => handleConfirmarEntrega(pedido.id)}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Entregue
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </TabsContent>

        <TabsContent value="historico" className="space-y-4 mt-4">
          {entregasConcluidas.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                <p className="text-muted-foreground">Nenhuma entrega concluída hoje</p>
              </CardContent>
            </Card>
          ) : (
            entregasConcluidas.map((pedido) => (
              <Card key={pedido.id} className="opacity-80">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{pedido.numero}</p>
                        <p className="text-sm text-muted-foreground">{pedido.cliente.nome}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-emerald-600">
                        +{formatCurrency(pedido.taxaEntrega?.valorTotal || 0)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {pedido.dataEntrega?.toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
