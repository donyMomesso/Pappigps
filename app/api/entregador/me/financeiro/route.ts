import { NextRequest, NextResponse } from "next/server"
import { getSessionFromRequest } from "@/lib/auth/session"
import { getConfiguracoes, getEntregadorById, updateEntregador } from "@/lib/server/repositories"
import type { SaqueEntregador } from "@/types"

export async function GET(request: NextRequest) {
  const session = getSessionFromRequest(request)

  if (!session || session.role !== "deliverer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const [entregador, configuracoes] = await Promise.all([
    getEntregadorById(session.userId),
    getConfiguracoes(),
  ])

  if (!entregador) {
    return NextResponse.json({ error: "Entregador não encontrado" }, { status: 404 })
  }

  return NextResponse.json({
    entregador,
    financeiro: entregador.financeiro || null,
    diariaEntregador: configuracoes.loja.diariaEntregador,
  })
}

export async function POST(request: NextRequest) {
  const session = getSessionFromRequest(request)

  if (!session || session.role !== "deliverer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const data = await request.json()
  const entregador = await updateEntregador(session.userId, (current) => {
    if (!current.financeiro) return current

    const novoSaque: SaqueEntregador = {
      id: `sq-${Date.now()}`,
      entregadorId: current.id,
      valor: data.valor,
      dataSolicitacao: new Date(),
      status: "pendente",
      chavePix: data.chavePix,
    }

    return {
      ...current,
      chavePix: data.chavePix || current.chavePix,
      financeiro: {
        ...current.financeiro,
        saldoDisponivel: Math.max(0, current.financeiro.saldoDisponivel - data.valor),
        historicoSaques: [novoSaque, ...(current.financeiro.historicoSaques || [])],
      },
    }
  })

  return NextResponse.json(entregador)
}
