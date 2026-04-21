"use client"

import { Header } from "@/components/layout/header"
import { StatCard } from "@/components/dashboard/stat-card"
import { mockFinanceiroData } from "@/mocks/data"
import { formatCurrency } from "@/lib/utils"
import { DollarSign, TrendingUp, TrendingDown, Package, Receipt, ArrowUpRight, ArrowDownRight } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function FinanceiroPage() {
  const { resumoMensal, faturamentoPorDia } = mockFinanceiroData
  const maxValue = Math.max(...faturamentoPorDia.map(d => d.valor))

  return (
    <>
      <Header title="Financeiro" />
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Visão Financeira</h2>
            <p className="text-sm text-zinc-500">Acompanhe o desempenho financeiro do seu negócio</p>
          </div>
          <Select defaultValue="janeiro">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="janeiro">Janeiro 2024</SelectItem>
              <SelectItem value="dezembro">Dezembro 2023</SelectItem>
              <SelectItem value="novembro">Novembro 2023</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Faturamento Bruto"
            value={formatCurrency(resumoMensal.faturamentoBruto)}
            icon={DollarSign}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Custo de Entregas"
            value={formatCurrency(resumoMensal.custoEntregas)}
            icon={TrendingDown}
          />
          <StatCard
            title="Lucro Líquido"
            value={formatCurrency(resumoMensal.lucroLiquido)}
            icon={TrendingUp}
            trend={{ value: 18, isPositive: true }}
          />
          <StatCard
            title="Total de Pedidos"
            value={resumoMensal.totalPedidos}
            icon={Package}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-xl p-6">
            <h3 className="font-semibold text-zinc-900 mb-6">Faturamento Diário</h3>
            <div className="h-[300px] flex items-end gap-2">
              {faturamentoPorDia.map((dia) => (
                <div key={dia.dia} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-emerald-500 rounded-t-sm hover:bg-emerald-600 transition-colors"
                    style={{ height: `${(dia.valor / maxValue) * 250}px` }}
                    title={formatCurrency(dia.valor)}
                  />
                  <span className="text-xs text-zinc-500">{dia.dia}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <h3 className="font-semibold text-zinc-900 mb-4">Métricas</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Ticket Médio</span>
                  <span className="font-semibold text-zinc-900">{formatCurrency(resumoMensal.ticketMedio)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Taxa Média de Entrega</span>
                  <span className="font-semibold text-zinc-900">{formatCurrency(resumoMensal.taxaEntrega)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Margem de Lucro</span>
                  <span className="font-semibold text-emerald-600">
                    {((resumoMensal.lucroLiquido / resumoMensal.faturamentoBruto) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <h3 className="font-semibold text-zinc-900 mb-4">Comparativo</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm text-zinc-700">Faturamento</span>
                  </div>
                  <span className="text-sm font-medium text-emerald-600">+12% vs mês anterior</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <ArrowDownRight className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-zinc-700">Custos</span>
                  </div>
                  <span className="text-sm font-medium text-red-600">+5% vs mês anterior</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm text-zinc-700">Pedidos</span>
                  </div>
                  <span className="text-sm font-medium text-emerald-600">+8% vs mês anterior</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
