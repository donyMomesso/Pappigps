"use client"

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { 
  Package, 
  DollarSign, 
  Clock, 
  MapPin, 
  Navigation,
  TrendingUp,
  AlertCircle,
  Locate
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Entregador, Pedido, Loja } from '@/types'

export default function EntregadorPainelPage() {
  const [localizacaoAtiva, setLocalizacaoAtiva] = useState(false)
  const fetcher = async (url: string) => {
    const response = await fetch(url, { cache: 'no-store' })
    if (!response.ok) {
      throw new Error('Falha ao carregar painel')
    }
    return response.json()
  }
  const { data: meData } = useSWR('/api/entregador/me', fetcher)
  const { data: entregasData } = useSWR('/api/entregador/me/entregas', fetcher)
  const entregador: Entregador | null = meData?.entregador ?? null
  const loja: Loja | null = meData?.loja ?? null
  const entregasAtivas: Pedido[] = entregasData?.ativas ?? []

  const handleLocationToggle = (checked: boolean) => {
    if (checked && !navigator.geolocation) {
      alert('Geolocalização não suportada neste navegador')
      return
    }

    setLocalizacaoAtiva(checked)
  }

  useEffect(() => {
    if (localizacaoAtiva && entregador) {
      if (navigator.geolocation) {
        const id = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            void fetch('/api/entregador/me/localizacao', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                latitude,
                longitude,
                accuracy: position.coords.accuracy,
              }),
            })
          },
          (error) => {
            console.error('Erro ao obter localização:', error)
            setLocalizacaoAtiva(false)
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }
        )
        return () => navigator.geolocation.clearWatch(id)
      } else {
        alert('Geolocalização não suportada neste navegador')
      }
    }

    return undefined
  }, [localizacaoAtiva, entregador])

  if (!entregador) {
    return <div className="p-6">Carregando...</div>
  }

  const ganhoHoje = entregador.financeiro?.ganhosTaxas || 0
  const entregasHoje = entregasAtivas.length
  const totalKmHoje = Number((entregador.financeiro?.totalKmRodados || 0).toFixed(1))

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
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

      {/* Localização em Tempo Real */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Locate className="w-4 h-4" />
            Localização em Tempo Real
          </CardTitle>
          <CardDescription>
            Ative para compartilhar sua localização durante as entregas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="localizacao-toggle" className="text-sm font-medium">
                Compartilhar localização
              </Label>
              <p className="text-xs text-muted-foreground">
                Permite rastreamento em tempo real para melhor gestão das rotas
              </p>
            </div>
            <Switch
              id="localizacao-toggle"
              checked={localizacaoAtiva}
              onCheckedChange={handleLocationToggle}
            />
          </div>
          {localizacaoAtiva && (
            <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-md">
              <p className="text-xs text-green-700 flex items-center gap-1">
                <Locate className="w-3 h-3" />
                Localização ativa - Compartilhando em tempo real
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
          <div className="flex flex-col gap-3 rounded-lg bg-muted p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="font-medium text-foreground">{loja?.nome}</p>
              <p className="truncate text-sm text-muted-foreground">{loja?.endereco.logradouro}, {loja?.endereco.numero}</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="font-medium text-emerald-600">{loja?.horarioOperacao.segunda.abertura} - {loja?.horarioOperacao.segunda.fechamento}</p>
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
                className="flex flex-col gap-3 rounded-lg bg-muted p-3 sm:flex-row sm:items-center sm:justify-between"
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
                <div className="text-left sm:text-right">
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
