import { NextRequest, NextResponse } from "next/server"
import { getSessionFromRequest } from "@/lib/auth/session"
import { getConfiguracoes, getEntregadorById } from "@/lib/server/repositories"

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
    loja: configuracoes.loja,
    termoFreelancer: configuracoes.termoFreelancer,
  })
}
