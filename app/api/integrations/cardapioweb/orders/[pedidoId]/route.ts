import { NextRequest, NextResponse } from "next/server"
import { fetchCardapioWebPedidoDetalhes } from "@/lib/integrations/cardapioweb"

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ pedidoId: string }> }
) {
  try {
    const { pedidoId } = await context.params
    const result = await fetchCardapioWebPedidoDetalhes(pedidoId)

    return NextResponse.json({
      success: true,
      pedido: result.pedido,
      payload: result.payload,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao consultar pedido.",
      },
      { status: 500 }
    )
  }
}
