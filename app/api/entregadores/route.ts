import { NextResponse } from "next/server"
import { generateAccessCode } from "@/lib/delivery/identifiers"
import { addEntregador, getEntregadores } from "@/lib/server/repositories"
import { entregadorSchema } from "@/lib/validation/schemas"
import type { Entregador } from "@/types"

export async function GET() {
  const entregadores = await getEntregadores()
  return NextResponse.json(entregadores)
}

export async function POST(request: Request) {
  try {
    const data = entregadorSchema.parse(await request.json())
    const novoEntregador: Entregador = {
      id: `ent_${Date.now()}`,
      nome: data.nome,
      telefone: data.telefone,
      email: data.email || undefined,
      cpf: data.cpf,
      codigoAcesso: data.codigoAcesso || generateAccessCode(),
      veiculo: data.veiculo,
      placaVeiculo: data.placaVeiculo || undefined,
      status: "offline",
      dataCadastro: new Date(),
      tipoContrato: "freelancer",
      termoAceito: false
    }

    await addEntregador(novoEntregador)
    return NextResponse.json(novoEntregador, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Dados do entregador inválidos" }, { status: 400 })
  }
}
