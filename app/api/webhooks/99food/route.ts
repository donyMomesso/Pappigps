import { NextRequest, NextResponse } from 'next/server'
import type { Pedido } from '@/types'

// Simulação de validação de webhook
function validate99FoodWebhook(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const expectedToken = process.env.NOVENTAENOVEFOOD_WEBHOOK_TOKEN || '99food_token_dev'

  return authHeader === `Bearer ${expectedToken}`
}

// Simulação de processamento de pedido 99Food
function process99FoodOrder(orderData: any): Pedido {
  const enderecoEntrega = {
    logradouro: orderData.deliveryAddress?.street || '',
    numero: orderData.deliveryAddress?.number || '',
    bairro: orderData.deliveryAddress?.neighborhood || '',
    cidade: orderData.deliveryAddress?.city || '',
    uf: orderData.deliveryAddress?.state || '',
    cep: orderData.deliveryAddress?.zipCode || '',
    latitude: orderData.deliveryAddress?.latitude,
    longitude: orderData.deliveryAddress?.longitude
  }

  return {
    id: `99food_${orderData.orderId}`,
    numero: orderData.orderNumber || orderData.orderId,
    cliente: {
      id: orderData.customer.id,
      nome: orderData.customer.name,
      telefone: orderData.customer.phone || '',
      email: orderData.customer.email || '',
      endereco: enderecoEntrega
    },
    endereco: enderecoEntrega,
    valor: orderData.totalValue || 0,
    formaPagamento: orderData.paymentMethod || 'dinheiro',
    status: 'pendente',
    dataCriacao: new Date(orderData.createdAt),
    dataEntrega: orderData.deliveryTime ? new Date(orderData.deliveryTime) : undefined,
    observacoes: orderData.notes || '',
    peso: orderData.totalWeight,
    volumes: orderData.items?.length || 1,
    rotaId: undefined,
    entregadorId: undefined,
    ordemEntrega: undefined,
    taxaEntrega: {
      id: `taxa_${orderData.orderId}`,
      pedidoId: `99food_${orderData.orderId}`,
      valorBase: orderData.deliveryFee || 0,
      valorPorKm: 0,
      distanciaKm: 0,
      valorTotal: orderData.deliveryFee || 0,
      pago: false
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    // Validar webhook
    if (!validate99FoodWebhook(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse do corpo da requisição
    const orderData = await request.json()

    // Validar dados obrigatórios
    if (!orderData.orderId || !orderData.customer) {
      return NextResponse.json(
        { error: 'Invalid order data' },
        { status: 400 }
      )
    }

    // Processar pedido
    const pedido = process99FoodOrder(orderData)

    // Em ambiente de servidor, não há localStorage.
    // Aqui apenas registramos o pedido para debug.
    console.log('Pedido 99Food recebido:', pedido)

    // Responder sucesso
    return NextResponse.json({
      success: true,
      orderId: orderData.orderId,
      message: 'Order received successfully'
    })

  } catch (error) {
    console.error('Erro no webhook 99Food:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Endpoint para verificar status do webhook
export async function GET() {
  return NextResponse.json({
    status: 'active',
    platform: '99Food',
    version: '1.0'
  })
}