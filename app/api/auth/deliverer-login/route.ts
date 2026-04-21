import { NextResponse } from "next/server"
import { setSessionCookie } from "@/lib/auth/session"
import { getEntregadores } from "@/lib/server/repositories"
import { delivererLoginSchema } from "@/lib/validation/schemas"

function clean(value: string) {
  return value.replace(/\D/g, "")
}

export async function POST(request: Request) {
  try {
    const data = delivererLoginSchema.parse(await request.json())
    const entregadores = await getEntregadores()
    const entregador = entregadores.find(
      (item) => clean(item.cpf) === clean(data.cpf) && clean(item.telefone) === clean(data.telefone)
    )

    if (!entregador) {
      return NextResponse.json(
        { error: "CPF ou telefone não encontrado. Verifique os dados informados." },
        { status: 401 }
      )
    }

    const response = NextResponse.json({
      success: true,
      redirectTo: entregador.termoAceito ? "/entregador/painel" : "/entregador/termo",
      entregador: {
        id: entregador.id,
        nome: entregador.nome,
        termoAceito: entregador.termoAceito
      }
    })

    setSessionCookie(response, {
      role: "deliverer",
      userId: entregador.id,
      name: entregador.nome,
      createdAt: new Date().toISOString()
    })

    return response
  } catch {
    return NextResponse.json({ error: "Dados de acesso inválidos" }, { status: 400 })
  }
}
