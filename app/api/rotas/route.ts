import { NextResponse } from "next/server"
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
    const { pedidos } = await getPedidos()
    const entregadores = await getEntregadores()
    const configuracoes = await getConfiguracoes()
    const rotaId = `rota_${Date.now()}`

    const pedidosSelecionados = pedidos.filter((pedido) => pedidoIds.includes(pedido.id))
    const entregador = entregadores.find((item) => item.id === entregadorId)

    if (!entregador || pedidosSelecionados.length === 0) {
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
        rotaId
      })),
      distanciaTotal: estimativa.distanciaTotal,
      tempoEstimado: estimativa.tempoEstimado,
      status: "planejada",
      dataCriacao: new Date(),
      valorTotalTaxas: pedidosSelecionados.reduce((acc, pedido) => acc + (pedido.taxaEntrega?.valorTotal || 0), 0)
    }

    await addRota(rota)
    return NextResponse.json(rota, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Não foi possível criar a rota" }, { status: 500 })
  }
}
