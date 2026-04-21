import { NextResponse } from "next/server"
import { buildDashboardStatsFromPedidos, getPedidos } from "@/lib/pedidos"

export async function GET() {
  const { pedidos, source } = await getPedidos()

  return NextResponse.json({
    pedidos,
    stats: buildDashboardStatsFromPedidos(pedidos),
    source
  })
}
