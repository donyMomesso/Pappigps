"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Package, 
  DollarSign, 
  Clock, 
  MapPin, 
  Navigation,
  TrendingUp,
  AlertCircle
} from 'lucide-react'
import { mockEntregadores, mockPedidos, mockLoja } from '@/mocks/data'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Entregador, Pedido } from '@/types'

export default function EntregadorPainelPage() {
  const [entregador, setEntregador] = useState<Entregador | null>(null)
  const [entregasAtivas, setEntregasAtivas] = useState<Pedido[]>([])

  useEffect(() => {
    const entregadorId = localStorage.getItem('entregadorId')
    if (entregadorId) {
      const found = mockEntregadores.find(e => e.id === entregadorId)
      if (found) {
        setEntregador(found)
        setEntregasAtivas(mockPedidos.filter(
          p => p.entregadorId === entregadorId && p.status === 'em_rota'
        ))
      }
    }
  }, [])

  if (!entregador) {
    return <div className="p-6">Carregando...</div>
  }

  const ganhoHoje = entregador.financeiro?.ganhosTaxas || 0
  const entregasHoje = entregasAtivas.length
  const totalKmHoje = 12.5 // Mock

  return (
    <div className="p-4 lg:p-6 pb-24 lg:pb-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Olá, {entregador.nome.split(' ')[0]}!
        </h1>
        <p className="text-muted-foreground">
          {formatDate(new Date())}
        </p>
      </div>

      {/* Status Card */}
      <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-100">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-700">Status atual</p>
              <p className="text-lg font-semibold text-emerald-800 capitalize">
                {entregador.status === 'em_rota' ? 'Em Rota' : 
                 entregador.status === 'disponivel' ? 'Disponível' : 'Offline'}
              </p>
            </div>
            <Badge 
              variant={entregador.status === 'em_rota' ? 'default' : 'secondary'}
              className={entregador.status === 'em_rota' ? 'bg-emerald-600' : ''}
            >
              <Navigation className="w-3 h-3 mr-1" />
              {entregasAtivas.length} entrega(s) ativa(s)
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Ganhos Hoje</p>
                <p className="text-lg font-bold text-foreground">{formatCurrency(ganhoHoje)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Entregas Hoje</p>
                <p className="text-lg font-bold text-foreground">{entregasHoje}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Km Rodados</p>
                <p className="text-lg font-bold text-foreground">{totalKmHoje} km</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avaliação</p>
                <p className="text-lg font-bold text-foreground">{entregador.avaliacaoMedia?.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Horário de Operação */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            Horário de Operação Hoje
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <p className="font-medium text-foreground">{mockLoja.nome}</p>
              <p className="text-sm text-muted-foreground">{mockLoja.endereco.logradouro}, {mockLoja.endereco.numero}</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-emerald-600">08:00 - 22:00</p>
              <Badge variant="outline" className="text-green-600 border-green-600">Aberto</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Entregas Ativas */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Entregas em Andamento</CardTitle>
          <CardDescription>Suas entregas ativas no momento</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {entregasAtivas.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Nenhuma entrega ativa no momento</p>
            </div>
          ) : (
            entregasAtivas.map((pedido) => (
              <div 
                key={pedido.id}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="font-bold text-emerald-600">{pedido.ordemEntrega}</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{pedido.cliente.nome}</p>
                    <p className="text-sm text-muted-foreground">
                      {pedido.endereco.logradouro}, {pedido.endereco.numero}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-emerald-600">
                    {formatCurrency(pedido.taxaEntrega?.valorTotal || 0)}
                  </p>
                  <Button size="sm" variant="outline" className="mt-1">
                    <Navigation className="w-3 h-3 mr-1" />
                    Navegar
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Saldo Disponível */}
      <Card className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100">Saldo Disponível para Saque</p>
              <p className="text-3xl font-bold mt-1">
                {formatCurrency(entregador.financeiro?.saldoDisponivel || 0)}
              </p>
            </div>
            <Button variant="secondary" className="bg-white text-emerald-700 hover:bg-emerald-50">
              Solicitar Saque
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Aviso Freelancer */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-800">Lembrete de Autonomia</p>
              <p className="text-amber-700">
                Você atua como prestador de serviços autônomo. Não há obrigatoriedade de 
                horário ou exclusividade. Gerencie sua agenda conforme sua disponibilidade.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
