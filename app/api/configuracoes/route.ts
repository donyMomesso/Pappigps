import { NextResponse } from "next/server"
import { getConfiguracoes, saveConfiguracoes } from "@/lib/server/repositories"
import { configuracoesLojaSchema } from "@/lib/validation/schemas"

export async function GET() {
  const configuracoes = await getConfiguracoes()
  return NextResponse.json(configuracoes)
}

export async function PUT(request: Request) {
  try {
    const data = configuracoesLojaSchema.parse(await request.json())
    await saveConfiguracoes(data)
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Configurações inválidas" }, { status: 400 })
  }
}

