import { NextRequest, NextResponse } from "next/server"
import { getSessionFromRequest } from "@/lib/auth/session"
import { getRotas, updateEntregador, updateRotas } from "@/lib/server/repositories"
import type { Rota } from "@/types"

export async function PATCH(request: NextRequest, context: { params: Promise<{ pedidoId: string }> }) {
  const session = getSessionFromRequest(request)
  const { pedidoId } = await context.params

  if (!session || session.role !== "deliverer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let updatedRoute: Rota | null = null
  let updatedEntregadorId: string | null = null
  let updatedRouteStatus: Rota["status"] | null = null

  await updateRotas((rotas) =>
    rotas.map((rota) => {
      if (rota.entregador?.id !== session.userId) return rota

      const hasPedido = rota.pedidos.some((pedido) => pedido.id === pedidoId)
      if (!hasPedido) return rota

      const pedidos = rota.pedidos.map((pedido) =>
        pedido.id === pedidoId
          ? { ...pedido, status: "entregue" as const, dataEntrega: new Date() }
          : pedido
      )

      const allDelivered = pedidos.every((pedido) => pedido.status === "entregue")
      updatedRoute = {
        ...rota,
        entregador: rota.entregador
          ? {
              ...rota.entregador,
              status: allDelivered ? "disponivel" : "em_rota",
            }
          : rota.entregador,
        pedidos,
        status: allDelivered ? "finalizada" : "em_andamento",
        dataFim: allDelivered ? new Date() : rota.dataFim,
      }
      updatedEntregadorId = rota.entregador?.id || null
      updatedRouteStatus = allDelivered ? "finalizada" : "em_andamento"

      return updatedRoute
    })
  )

  if (updatedEntregadorId) {
    await updateEntregador(updatedEntregadorId, (current) => ({
      ...current,
      status: updatedRouteStatus === "finalizada" ? "disponivel" : "em_rota",
      totalEntregas: (current.totalEntregas || 0) + 1,
    }))
  }

  return NextResponse.json({ success: true, route: updatedRoute })
}
