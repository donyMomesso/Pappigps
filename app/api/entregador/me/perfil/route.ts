import { NextRequest, NextResponse } from "next/server"
import { getSessionFromRequest } from "@/lib/auth/session"
import { updateEntregador } from "@/lib/server/repositories"

export async function PUT(request: NextRequest) {
  const session = getSessionFromRequest(request)

  if (!session || session.role !== "deliverer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const data = await request.json()
  const entregador = await updateEntregador(session.userId, (current) => ({
    ...current,
    telefone: data.telefone || current.telefone,
    email: data.email || current.email,
    chavePix: data.chavePix || current.chavePix,
    banco: data.banco || current.banco,
    agencia: data.agencia || current.agencia,
    conta: data.conta || current.conta,
  }))

  return NextResponse.json(entregador)
}
