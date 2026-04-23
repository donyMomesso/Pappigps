"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import dynamic from "next/dynamic"
import { Header } from "@/components/layout/header"
import { PedidosList } from "@/components/roteirizacao/pedidos-list"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Activity, Clock3, MapPin, Package2, Zap } from "lucide-react"
import { formatCurrency, formatDistance, formatDuration, getTipoVeiculoLabel } from "@/lib/utils"
import type { Configuracoes, Entregador, Loja, Pedido } from "@/types"

// Dynamic import for map to avoid SSR issues
const RouteMap = dynamic(
  () => import("@/components/roteirizacao/route-map").then(mod => mod.RouteMap),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[400px] bg-zinc-100 rounded-lg flex items-center justify-center">
        <p className="text-zinc-500">Carregando mapa...</p>
      </div>
    )
  }
)

const fetcher = async (url: string) => {
  const response = await fetch(url, { cache: "no-store" })
  if (!response.ok) {
    throw new Error("Falha ao carregar pedidos")
  }
  return response.json()
}

export default function RoteirizacaoPage() {
  const [syncing, setSyncing] = useState(false)
  const { data, mutate } = useSWR("/api/pedidos", fetcher)
  const { data: entregadoresData } = useSWR<Entregador[]>("/api/entregadores", fetcher)
  const { data: configuracoes } = useSWR<Configuracoes>("/api/configuracoes", fetcher)
  const pedidosDisponiveis: Pedido[] = (data?.pedidos ?? []).filter(
    (pedido: Pedido) => pedido.status === "pendente" || pedido.status === "em_preparo"
  )
  const entregadores = entregadoresData ?? []
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [selectedPedidos, setSelectedPedidos] = useState<string[]>([])
  const [selectedEntregador, setSelectedEntregador] = useState<string | null>(null)
  const pedidosSource = data?.source as string | undefined

  const fallbackLoja: Loja = {
    id: "fallback",
    nome: "Loja",
    cnpj: "",
    telefone: "",
    email: "",
    endereco: {
      logradouro: "",
      numero: "",
      bairro: "",
      cidade: "",
      uf: "",
      cep: "",
      latitude: -23.5489,
      longitude: -46.6388,
    },
    coordenadas: { latitude: -23.5489, longitude: -46.6388 },
    horarioOperacao: {
      domingo: { abertura: "00:00", fechamento: "00:00", ativo: false },
      segunda: { abertura: "08:00", fechamento: "18:00", ativo: true },
      terca: { abertura: "08:00", fechamento: "18:00", ativo: true },
      quarta: { abertura: "08:00", fechamento: "18:00", ativo: true },
      quinta: { abertura: "08:00", fechamento: "18:00", ativo: true },
      sexta: { abertura: "08:00", fechamento: "18:00", ativo: true },
      sabado: { abertura: "08:00", fechamento: "12:00", ativo: false },
    },
    raioEntregaKm: 10,
    taxaEntregaBase: 0,
    taxaPorKm: 0,
    diariaEntregador: 0,
  }

  const pedidosData = pedidos.length > 0 ? pedidos : pedidosDisponiveis

  const selectedPedidosData = useMemo(() => 
    selectedPedidos.map(id => pedidosData.find(p => p.id === id)!).filter(Boolean),
    [selectedPedidos, pedidosData]
  )
  const availableEntregadores = entregadores.filter((entregador) => entregador.status === "disponivel")
  const totalSelecionado = selectedPedidosData.reduce((sum, pedido) => sum + pedido.valor, 0)
  const distanciaEstimada = selectedPedidosData.length * 2.5
  const tempoEstimado = selectedPedidosData.length * 12

  const handleTogglePedido = (id: string) => {
    setSelectedPedidos(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id)
        : [...prev, id]
    )
  }

  const handleReorder = (newPedidos: Pedido[]) => {
    setPedidos(newPedidos)
    // Update selected order based on new order
    const newSelectedOrder = newPedidos
      .filter(p => selectedPedidos.includes(p.id))
      .map(p => p.id)
    setSelectedPedidos(newSelectedOrder)
  }

  const handleOptimize = () => {
    // In a real app, this would call a routing API
    // For now, just reverse the order as a demo
    setSelectedPedidos(prev => [...prev].reverse())
  }

  const handleCreateRoute = () => {
    if (!selectedEntregador || selectedPedidos.length === 0) {
      return
    }

    void fetch("/api/rotas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pedidoIds: selectedPedidos,
        entregadorId: selectedEntregador,
        nome: `Rota ${new Date().toLocaleDateString("pt-BR")}`
      })
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Falha ao criar rota")
        }

        setSelectedPedidos([])
        setSelectedEntregador(null)
        setPedidos([])
        alert("Rota criada com sucesso.")
      })
      .catch(() => {
        alert("Não foi possível criar a rota.")
      })
  }

  const handleSyncPedidos = async () => {
    setSyncing(true)
    try {
      const response = await fetch("/api/integrations/cardapioweb/sync", {
        method: "POST",
      })
      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Falha ao sincronizar pedidos.")
      }

      await mutate()
      toast({
        title: "Pedidos sincronizados",
        description: result.message,
      })
    } catch (error) {
      toast({
        title: "Erro na sincronização",
        description: error instanceof Error ? error.message : "Não foi possível sincronizar.",
        variant: "destructive",
      })
    } finally {
      setSyncing(false)
    }
  }

  return (
    <>
      <Header title="Roteirização" />
      <div className="p-4 sm:p-6">
        <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Criar Nova Rota</h2>
            <p className="text-sm text-zinc-500">
              Simples e potente: selecione os pedidos e acompanhe tudo pelo mapa.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <p className="text-sm text-zinc-500">
              {pedidosData.length > 0
                ? `${pedidosData.length} pedidos disponíveis para roteirização`
                : `Nenhum pedido disponível${pedidosSource ? ` (${pedidosSource})` : ""}`}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void handleSyncPedidos()}
              disabled={syncing}
            >
              <Activity className="mr-2 h-4 w-4" />
              Sincronizar pedidos
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-4">
            <div className="rounded-2xl border border-zinc-200 bg-white p-4">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
                <Package2 className="h-4 w-4 text-[#F97316]" />
                Selecionados
              </div>
              <p className="mt-2 text-2xl font-semibold text-zinc-900">{selectedPedidosData.length}</p>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-4">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
                <MapPin className="h-4 w-4 text-[#F97316]" />
                Distância
              </div>
              <p className="mt-2 text-2xl font-semibold text-zinc-900">{formatDistance(distanciaEstimada)}</p>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-4">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
                <Clock3 className="h-4 w-4 text-[#F97316]" />
                Tempo
              </div>
              <p className="mt-2 text-2xl font-semibold text-zinc-900">{formatDuration(tempoEstimado)}</p>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-4">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
                <Activity className="h-4 w-4 text-[#F97316]" />
                Valor
              </div>
              <p className="mt-2 text-2xl font-semibold text-zinc-900">{formatCurrency(totalSelecionado)}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex flex-col gap-1">
              <h3 className="font-semibold text-zinc-900">Mapa da Operação</h3>
              <p className="text-sm text-zinc-500">
                Os pins mostram o número real do pedido. Toque na lista abaixo para exibir ou ocultar no mapa.
              </p>
            </div>
            <div className="h-[460px] md:h-[620px] xl:h-[72vh]">
              <RouteMap 
                loja={configuracoes?.loja ?? fallbackLoja}
                pedidos={pedidosData} 
                selectedPedidos={selectedPedidos} 
              />
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.35fr,0.65fr]">
            <div className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-zinc-900">Selecionar pedidos</h3>
                  <p className="text-sm text-zinc-500">Lista enxuta, só o necessário para montar a rota.</p>
                </div>
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                  {pedidosData.length} pedidos
                </span>
              </div>
              <PedidosList
                pedidos={pedidosData}
                selectedPedidos={selectedPedidos}
                onTogglePedido={handleTogglePedido}
                onReorder={handleReorder}
              />
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="mb-4">
                <h3 className="font-semibold text-zinc-900">Fechar rota</h3>
                <p className="text-sm text-zinc-500">Escolha o entregador e confirme a sequência mostrada no mapa.</p>
              </div>

              <div className="mb-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Sequência escolhida
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedPedidosData.length === 0 ? (
                    <span className="text-sm text-zinc-500">Nenhum pedido selecionado.</span>
                  ) : (
                    selectedPedidosData.map((pedido, index) => (
                      <span
                        key={pedido.id}
                        className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-700"
                      >
                        {index + 1}. #{pedido.numero}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Entregador
                </label>
                <Select value={selectedEntregador || ""} onValueChange={setSelectedEntregador}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um entregador" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableEntregadores.length === 0 ? (
                      <SelectItem value="none" disabled>
                        Nenhum entregador disponível
                      </SelectItem>
                    ) : (
                      availableEntregadores.map((entregador) => (
                        <SelectItem key={entregador.id} value={entregador.id}>
                          {entregador.nome} ({getTipoVeiculoLabel(entregador.veiculo)})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleOptimize}
                  disabled={selectedPedidos.length < 2}
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Inverter sequência
                </Button>
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  onClick={handleCreateRoute}
                  disabled={selectedPedidos.length === 0 || !selectedEntregador}
                >
                  Criar rota
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
