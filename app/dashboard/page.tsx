"use client"

import { Header } from "@/components/layout/header"
import { StatCard } from "@/components/dashboard/stat-card"
import { RecentOrders } from "@/components/dashboard/recent-orders"
import { ActiveRoutes } from "@/components/dashboard/active-routes"
import { mockDashboardStats, mockPedidos, mockRotas } from "@/mocks/data"
import { formatCurrency } from "@/lib/utils"
import { Package, Truck, Users, DollarSign, Clock, CheckCircle } from "lucide-react"

export default function DashboardPage() {
  const stats = mockDashboardStats

  return (
    <>
      <Header title="Dashboard" />
      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Pedidos Hoje"
            value={stats.pedidosHoje}
            icon={Package}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Pendentes"
            value={stats.pedidosPendentes}
            icon={Clock}
          />
          <StatCard
            title="Entregues"
            value={stats.pedidosEntregues}
            icon={CheckCircle}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Faturamento"
            value={formatCurrency(stats.faturamentoHoje)}
            icon={DollarSign}
            trend={{ value: 15, isPositive: true }}
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard
            title="Entregadores Ativos"
            value={stats.entregadoresAtivos}
            icon={Users}
          />
          <StatCard
            title="Rotas Ativas"
            value={stats.rotasAtivas}
            icon={Truck}
          />
          <StatCard
            title="Ticket Médio"
            value={formatCurrency(stats.ticketMedio)}
            icon={DollarSign}
          />
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentOrders pedidos={mockPedidos} />
          <ActiveRoutes rotas={mockRotas} />
        </div>
      </div>
    </>
  )
}
