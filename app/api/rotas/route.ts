import { NextResponse } from "next/server"
import { generateTrackingToken } from "@/lib/delivery/identifiers"
import { estimateRoute } from "@/lib/routing/estimate-route"
import { addRota, getConfiguracoes, getEntregadores, getRotas } from "@/lib/server/repositories"
import { getPedidos } from "@/lib/pedidos"
import type { Rota } from "@/types"

export async function GET() {
  const rotas = await getRotas()
  return NextResponse.json(rotas)
}

export async function POST(request: Request) {
  try {
    const { pedidoIds, entregadorId, nome } = await request.json()
    console.log("POST /api/rotas - Body:", { pedidoIds, entregadorId, nome })
    
    const { pedidos } = await getPedidos()
    console.log(`Loaded ${pedidos.length} orders`)
    
    const entregadores = await getEntregadores()
    console.log(`Loaded ${entregadores.length} deliverers`)
    
    const configuracoes = await getConfiguracoes()
    const rotaId = `rota_${Date.now()}`

    const pedidosSelecionados = pedidos.filter((pedido) => pedidoIds.includes(pedido.id))
    console.log(`Selected ${pedidosSelecionados.length} orders for route`)
    
    const entregador = entregadores.find((item) => item.id === entregadorId)
    console.log(`Found deliverer:`, entregador)

    if (!entregador || pedidosSelecionados.length === 0) {
      console.log("❌ Route creation failed - invalid data")
      return NextResponse.json({ error: "Dados da rota inválidos" }, { status: 400 })
    }

    const estimativa = estimateRoute(configuracoes.loja, pedidosSelecionados)
    const rota: Rota = {
      id: rotaId,
      nome: nome || `Rota ${new Date().toLocaleDateString("pt-BR")}`,
      entregador,
      pedidos: pedidosSelecionados.map((pedido, index) => ({
        ...pedido,
        entregadorId: entregador.id,
        ordemEntrega: index + 1,
        rotaId,
        trackingToken: pedido.trackingToken || generateTrackingToken(),
      })),
      distanciaTotal: estimativa.distanciaTotal,
      tempoEstimado: estimativa.tempoEstimado,
      status: "planejada",
      dataCriacao: new Date(),
      valorTotalTaxas: pedidosSelecionados.reduce((acc, pedido) => acc + (pedido.taxaEntrega?.valorTotal || 0), 0)
    }

    await addRota(rota)
    console.log("✅ Route created successfully:", rota.id)
    return NextResponse.json(rota, { status: 201 })
  } catch (error) {
    console.error("❌ Route creation error:", error)
    return NextResponse.json({ error: "Não foi possível criar a rota" }, { status: 500 })
  }
}
