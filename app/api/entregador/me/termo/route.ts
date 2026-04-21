import { NextRequest, NextResponse } from "next/server"
import { getSessionFromRequest } from "@/lib/auth/session"
import { updateEntregador } from "@/lib/server/repositories"

export async function POST(request: NextRequest) {
  const session = getSessionFromRequest(request)

  if (!session || session.role !== "deliverer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const entregador = await updateEntregador(session.userId, (current) => ({
    ...current,
    termoAceito: true,
    termoAceiteData: new Date(),
  }))

  return NextResponse.json(entregador)
}
