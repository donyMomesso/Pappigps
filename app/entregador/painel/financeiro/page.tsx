"use client"

import { useState } from 'react'
import useSWR from 'swr'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  DollarSign, 
  TrendingUp, 
  Package, 
  MapPin, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Wallet,
  CreditCard,
  AlertCircle,
  CheckCircle2
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { Entregador, SaqueEntregador } from '@/types'

export default function FinanceiroEntregadorPage() {
  const fetcher = async (url: string) => {
    const response = await fetch(url, { cache: 'no-store' })
    if (!response.ok) {
      throw new Error('Falha ao carregar financeiro')
    }
    return response.json()
  }
  const { data, mutate } = useSWR('/api/entregador/me/financeiro', fetcher)
  const entregador: Entregador | null = data?.entregador ?? null
  const diariaEntregador = data?.diariaEntregador || 0

  if (!entregador || !entregador.financeiro) {
    return <div className="p-6">Carregando...</div>
  }

  return (
    <FinanceiroEditor
      entregador={entregador}
      diariaEntregador={diariaEntregador}
      onUpdated={() => void mutate()}
    />
  )
}

function FinanceiroEditor({
  entregador,
  diariaEntregador,
  onUpdated,
}: {
  entregador: Entregador
  diariaEntregador: number
  onUpdated: () => void
}) {
  const financeiro = entregador.financeiro!
  const saques: SaqueEntregador[] = financeiro.historicoSaques || []
  const [dialogOpen, setDialogOpen] = useState(false)
  const [valorSaque, setValorSaque] = useState('')
  const [chavePix, setChavePix] = useState(entregador.chavePix || '')

  const handleSolicitarSaque = async () => {
    const valor = parseFloat(valorSaque.replace(',', '.'))
    if (isNaN(valor) || valor <= 0 || valor > financeiro.saldoDisponivel) {
      return
    }

    await fetch('/api/entregador/me/financeiro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ valor, chavePix })
    })
    onUpdated()
    setDialogOpen(false)
    setValorSaque('')
  }

  // Dados fictícios para o gráfico simplificado
  const ganhosPorDia = [
    { dia: 'Seg', valor: 85 },
    { dia: 'Ter', valor: 120 },
    { dia: 'Qua', valor: 95 },
    { dia: 'Qui', valor: 150 },
    { dia: 'Sex', valor: 180 },
    { dia: 'Sáb', valor: 210 },
    { dia: 'Dom', valor: 0 }
  ]

  const maxGanho = Math.max(...ganhosPorDia.map(d => d.valor))

  return (
    <div className="p-4 lg:p-6 pb-24 lg:pb-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Meu Financeiro</h1>
        <p className="text-muted-foreground">
          Acompanhe seus ganhos e solicite saques
        </p>
      </div>

      {/* Saldo Card */}
      <Card className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <p className="text-emerald-100 flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                Saldo Disponível
              </p>
              <p className="text-4xl font-bold mt-2">
                {formatCurrency(financeiro.saldoDisponivel)}
              </p>
              <p className="text-sm text-emerald-100 mt-1">
                Diária: {formatCurrency(diariaEntregador)}/dia trabalhado
              </p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="secondary" 
                  className="bg-white text-emerald-700 hover:bg-emerald-50"
                  disabled={financeiro.saldoDisponivel <= 0}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Solicitar Saque
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Solicitar Saque</DialogTitle>
                  <DialogDescription>
                    Informe o valor e a chave PIX para transferência
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="p-3 bg-emerald-50 rounded-lg">
                    <p className="text-sm text-emerald-700">
                      Saldo disponível: <strong>{formatCurrency(financeiro.saldoDisponivel)}</strong>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="valor">Valor do Saque</Label>
                    <Input
                      id="valor"
                      placeholder="0,00"
                      value={valorSaque}
                      onChange={(e) => setValorSaque(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pix">Chave PIX</Label>
                    <Input
                      id="pix"
                      placeholder="CPF, E-mail, Telefone ou Chave Aleatória"
                      value={chavePix}
                      onChange={(e) => setChavePix(e.target.value)}
                    />
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
                      <p className="text-sm text-amber-800">
                        O pagamento será processado em até 24 horas úteis.
                      </p>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleSolicitarSaque}
                    className="bg-emerald-600 hover:bg-emerald-700"
                    disabled={!valorSaque || !chavePix}
                  >
                    Confirmar Saque
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Ganhos Taxas</p>
                <p className="text-lg font-bold text-foreground">{formatCurrency(financeiro.ganhosTaxas)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Diárias</p>
                <p className="text-lg font-bold text-foreground">{formatCurrency(financeiro.diaria)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Entregas</p>
                <p className="text-lg font-bold text-foreground">{financeiro.totalEntregas}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Km Rodados</p>
                <p className="text-lg font-bold text-foreground">{financeiro.totalKmRodados} km</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico Simplificado */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Ganhos da Semana</CardTitle>
          <CardDescription>Seus ganhos dos últimos 7 dias</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-2 h-40">
            {ganhosPorDia.map((dia, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col items-center justify-end h-32">
                  <p className="text-xs font-medium text-emerald-600 mb-1">
                    {dia.valor > 0 ? formatCurrency(dia.valor) : '-'}
                  </p>
                  <div 
                    className="w-full bg-emerald-500 rounded-t-sm transition-all"
                    style={{ 
                      height: `${maxGanho > 0 ? (dia.valor / maxGanho) * 100 : 0}%`,
                      minHeight: dia.valor > 0 ? '8px' : '0'
                    }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{dia.dia}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resumo do Período */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Resumo do Período</CardTitle>
          <CardDescription>{financeiro.periodo}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <ArrowUpRight className="w-5 h-5 text-green-600" />
                <span className="text-foreground">Ganhos com Taxas</span>
              </div>
              <span className="font-semibold text-green-600">+{formatCurrency(financeiro.ganhosTaxas)}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <ArrowUpRight className="w-5 h-5 text-green-600" />
                <span className="text-foreground">Diárias</span>
              </div>
              <span className="font-semibold text-green-600">+{formatCurrency(financeiro.diaria)}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <ArrowUpRight className="w-5 h-5 text-green-600" />
                <span className="text-foreground">Bonificações</span>
              </div>
              <span className="font-semibold text-green-600">+{formatCurrency(financeiro.bonificacoes)}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <ArrowDownRight className="w-5 h-5 text-red-600" />
                <span className="text-foreground">Descontos</span>
              </div>
              <span className="font-semibold text-red-600">-{formatCurrency(financeiro.descontos)}</span>
            </div>

            <div className="border-t pt-3 mt-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">Total Líquido</span>
                <span className="text-xl font-bold text-emerald-600">{formatCurrency(financeiro.totalLiquido)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Histórico de Saques */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Histórico de Saques</CardTitle>
          <CardDescription>Suas solicitações de saque</CardDescription>
        </CardHeader>
        <CardContent>
          {saques.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Wallet className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Nenhum saque solicitado</p>
            </div>
          ) : (
            <div className="space-y-3">
              {saques.map((saque) => (
                <div 
                  key={saque.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      saque.status === 'pago' ? 'bg-green-100' :
                      saque.status === 'pendente' ? 'bg-amber-100' :
                      saque.status === 'aprovado' ? 'bg-blue-100' : 'bg-red-100'
                    }`}>
                      {saque.status === 'pago' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : saque.status === 'pendente' ? (
                        <Clock className="w-5 h-5 text-amber-600" />
                      ) : (
                        <DollarSign className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{formatCurrency(saque.valor)}</p>
                      <p className="text-sm text-muted-foreground">
                        {saque.dataSolicitacao.toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <Badge variant={
                    saque.status === 'pago' ? 'default' :
                    saque.status === 'pendente' ? 'secondary' :
                    saque.status === 'aprovado' ? 'outline' : 'destructive'
                  }>
                    {saque.status === 'pago' ? 'Pago' :
                     saque.status === 'pendente' ? 'Pendente' :
                     saque.status === 'aprovado' ? 'Aprovado' : 'Cancelado'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-800">Como funciona o pagamento?</p>
              <ul className="text-blue-700 mt-2 space-y-1">
                <li>- Taxa por entrega: calculada por km rodado</li>
                <li>- Diária: {formatCurrency(diariaEntregador)} por dia trabalhado</li>
                <li>- Saques disponíveis a qualquer momento</li>
                <li>- Pagamento via PIX em até 24h úteis</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
