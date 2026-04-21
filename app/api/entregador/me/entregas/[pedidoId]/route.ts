import { NextRequest, NextResponse } from "next/server"
import { getSessionFromRequest } from "@/lib/auth/session"
import { getRotas, updateRotas } from "@/lib/server/repositories"
import type { Rota } from "@/types"

export async function PATCH(request: NextRequest, context: { params: Promise<{ pedidoId: string }> }) {
  const session = getSessionFromRequest(request)
  const { pedidoId } = await context.params

  if (!session || session.role !== "deliverer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let updatedRoute: Rota | null = null

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
        pedidos,
        status: allDelivered ? "finalizada" : rota.status,
        dataFim: allDelivered ? new Date() : rota.dataFim,
      }

      return updatedRoute
    })
  )

  return NextResponse.json({ success: true, route: updatedRoute })
}
