import { NextResponse } from "next/server"
import { buildDashboardStatsFromPedidos, getPedidos } from "@/lib/pedidos"

export async function GET() {
  console.log("API /pedidos called")
  const { pedidos, source } = await getPedidos()
  console.log(`Returning ${pedidos.length} pedidos from ${source}`)

  return NextResponse.json({
    pedidos,
    stats: buildDashboardStatsFromPedidos(pedidos),
    source
  })
}
