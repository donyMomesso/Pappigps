import { NextResponse } from "next/server"
import { syncCardapioWebPedidos } from "@/lib/integrations/cardapioweb"

export async function POST() {
  try {
    const result = await syncCardapioWebPedidos()

    return NextResponse.json({
      success: true,
      total: result.total,
      message: `${result.total} pedido(s) sincronizado(s) via polling do Cardápio Web.`,
    })
  } catch (error) {
    console.error("Erro ao sincronizar Cardápio Web:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro interno ao sincronizar Cardápio Web.",
      },
      { status: 500 }
    )
  }
}
