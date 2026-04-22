import { NextRequest, NextResponse } from "next/server"
import { getConfiguracoes, getEntregadorById, getRotas } from "@/lib/server/repositories"

export async function GET(_request: NextRequest, context: { params: Promise<{ token: string }> }) {
  const { token } = await context.params
  const [rotas, configuracoes] = await Promise.all([getRotas(), getConfiguracoes()])

  for (const rota of rotas) {
    const pedido = rota.pedidos.find((item) => item.trackingToken === token)

    if (!pedido) {
      continue
    }

    const entregadorAtual = rota.entregador?.id ? await getEntregadorById(rota.entregador.id) : null

    return NextResponse.json({
      active: pedido.status !== "entregue" && pedido.status !== "cancelado",
      loja: configuracoes.loja,
      rota: {
        id: rota.id,
        nome: rota.nome,
        status: rota.status,
        tempoEstimado: rota.tempoEstimado,
        distanciaTotal: rota.distanciaTotal,
      },
      pedido,
      entregador: entregadorAtual
        ? {
            id: entregadorAtual.id,
            nome: entregadorAtual.nome,
            telefone: entregadorAtual.telefone,
            veiculo: entregadorAtual.veiculo,
            status: entregadorAtual.status,
            localizacaoAtual: entregadorAtual.localizacaoAtual,
          }
        : null,
    })
  }

  return NextResponse.json({ error: "Rastreamento não encontrado" }, { status: 404 })
}
