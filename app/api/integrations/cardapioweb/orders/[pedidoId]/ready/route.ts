import { NextRequest, NextResponse } from "next/server"
import { markCardapioWebPedidoReady } from "@/lib/integrations/cardapioweb"

export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ pedidoId: string }> }
) {
  try {
    const { pedidoId } = await context.params
    const result = await markCardapioWebPedidoReady(pedidoId)

    return NextResponse.json({
      success: true,
      orderId: result.orderId,
      payload: result.payload,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao marcar pedido como pronto.",
      },
      { status: 500 }
    )
  }
}
