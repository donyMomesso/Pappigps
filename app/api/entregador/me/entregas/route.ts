import { NextRequest, NextResponse } from "next/server"
import { getSessionFromRequest } from "@/lib/auth/session"
import { getConfiguracoes, getRotas } from "@/lib/server/repositories"
import type { Pedido } from "@/types"

export async function GET(request: NextRequest) {
  const session = getSessionFromRequest(request)

  if (!session || session.role !== "deliverer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const [rotas, configuracoes] = await Promise.all([getRotas(), getConfiguracoes()])
  const pedidosDoEntregador: Pedido[] = rotas
    .filter((rota) => rota.entregador?.id === session.userId)
    .flatMap((rota) => rota.pedidos)

  return NextResponse.json({
    loja: configuracoes.loja,
    ativas: pedidosDoEntregador.filter((pedido) => pedido.status === "em_rota" || pedido.status === "pendente"),
    concluidas: pedidosDoEntregador.filter((pedido) => pedido.status === "entregue"),
  })
}
