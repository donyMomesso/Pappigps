import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { StatusPedido, StatusEntregador, TipoVeiculo, FormaPagamento } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(d)
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d)
}

export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(d)
}

export function getStatusPedidoLabel(status: StatusPedido): string {
  const labels: Record<StatusPedido, string> = {
    pendente: 'Pendente',
    em_rota: 'Em Rota',
    entregue: 'Entregue',
    cancelado: 'Cancelado'
  }
  return labels[status]
}

export function getStatusPedidoColor(status: StatusPedido): string {
  const colors: Record<StatusPedido, string> = {
    pendente: 'bg-amber-100 text-amber-800',
    em_rota: 'bg-blue-100 text-blue-800',
    entregue: 'bg-emerald-100 text-emerald-800',
    cancelado: 'bg-red-100 text-red-800'
  }
  return colors[status]
}

export function getStatusEntregadorLabel(status: StatusEntregador): string {
  const labels: Record<StatusEntregador, string> = {
    disponivel: 'Disponível',
    em_rota: 'Em Rota',
    offline: 'Offline',
    pausado: 'Pausado'
  }
  return labels[status]
}

export function getStatusEntregadorColor(status: StatusEntregador): string {
  const colors: Record<StatusEntregador, string> = {
    disponivel: 'bg-emerald-100 text-emerald-800',
    em_rota: 'bg-blue-100 text-blue-800',
    offline: 'bg-zinc-100 text-zinc-600',
    pausado: 'bg-amber-100 text-amber-800'
  }
  return colors[status]
}

export function getTipoVeiculoLabel(tipo: TipoVeiculo): string {
  const labels: Record<TipoVeiculo, string> = {
    moto: 'Moto',
    carro: 'Carro',
    van: 'Van',
    caminhao: 'Caminhão',
    bicicleta: 'Bicicleta'
  }
  return labels[tipo]
}

export function getFormaPagamentoLabel(forma: FormaPagamento): string {
  const labels: Record<FormaPagamento, string> = {
    dinheiro: 'Dinheiro',
    pix: 'PIX',
    cartao: 'Cartão',
    boleto: 'Boleto'
  }
  return labels[forma]
}

export function formatDistance(km: number): string {
  return `${km.toFixed(1)} km`
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
}
