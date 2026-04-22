import { NextRequest, NextResponse } from "next/server"
import { getSessionFromRequest } from "@/lib/auth/session"
import { getRotas, updateEntregador, updateRotas } from "@/lib/server/repositories"

export async function POST(request: NextRequest) {
  const session = getSessionFromRequest(request)

  if (!session || session.role !== "deliverer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const data = await request.json()
  const rotas = await getRotas()
  const rotaAtiva = rotas.find(
    (rota) =>
      rota.entregador?.id === session.userId &&
      rota.pedidos.some((pedido) => pedido.status !== "entregue" && pedido.status !== "cancelado")
  )

  if (rotaAtiva) {
    await updateRotas((current) =>
      current.map((rota) => {
        if (rota.id !== rotaAtiva.id) return rota

        return {
          ...rota,
          status: "em_andamento",
          dataInicio: rota.dataInicio || new Date(),
          entregador: rota.entregador
            ? {
                ...rota.entregador,
                status: "em_rota",
                localizacaoAtual: {
                  entregadorId: rota.entregador.id,
                  coordenadas: {
                    latitude: data.latitude,
                    longitude: data.longitude,
                  },
                  timestamp: new Date(),
                  precisao: data.accuracy,
                },
              }
            : rota.entregador,
          pedidos: rota.pedidos.map((pedido) =>
            pedido.status === "pendente" ? { ...pedido, status: "em_rota" as const } : pedido
          ),
        }
      })
    )
  }

  const entregador = await updateEntregador(session.userId, (current) => ({
    ...current,
    status: rotaAtiva ? "em_rota" : "disponivel",
    localizacaoAtual: {
      entregadorId: current.id,
      coordenadas: {
        latitude: data.latitude,
        longitude: data.longitude,
      },
      timestamp: new Date(),
      precisao: data.accuracy,
    },
  }))

  return NextResponse.json(entregador)
}
