import { NextRequest, NextResponse } from 'next/server'
import type { Pedido } from '@/types'

// Simulação de validação de webhook
function validateIfoodWebhook(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const expectedToken = process.env.IFOOD_WEBHOOK_TOKEN || 'ifood_token_dev'

  return authHeader === `Bearer ${expectedToken}`
}

// Simulação de processamento de pedido iFood
function processIfoodOrder(orderData: any): Pedido {
  const enderecoEntrega = {
    logradouro: orderData.deliveryAddress?.streetName || '',
    numero: orderData.deliveryAddress?.streetNumber || '',
    bairro: orderData.deliveryAddress?.neighborhood || '',
    cidade: orderData.deliveryAddress?.city || '',
    uf: orderData.deliveryAddress?.state || '',
    cep: orderData.deliveryAddress?.postalCode || '',
    latitude: orderData.deliveryAddress?.coordinates?.latitude,
    longitude: orderData.deliveryAddress?.coordinates?.longitude
  }

  return {
    id: `ifood_${orderData.id}`,
    numero: orderData.displayId || orderData.id,
    cliente: {
      id: orderData.customer.id,
      nome: orderData.customer.name,
      telefone: orderData.customer.phone?.number || '',
      email: orderData.customer.phone?.number ? `${orderData.customer.phone.number}@temp.com` : '',
      endereco: enderecoEntrega
    },
    endereco: enderecoEntrega,
    valor: orderData.total?.value || 0,
    formaPagamento: 'dinheiro', // iFood geralmente cobra do restaurante
    status: 'pendente',
    dataCriacao: new Date(orderData.createdAt),
    dataEntrega: orderData.deliveryDateTime ? new Date(orderData.deliveryDateTime) : undefined,
    observacoes: orderData.observations || '',
    peso: orderData.totalWeight,
    volumes: orderData.items?.length || 1,
    rotaId: undefined,
    entregadorId: undefined,
    ordemEntrega: undefined,
    taxaEntrega: {
      id: `taxa_${orderData.id}`,
      pedidoId: `ifood_${orderData.id}`,
      valorBase: 0, // iFood geralmente cobra taxa separada
      valorPorKm: 0,
      distanciaKm: 0,
      valorTotal: 0,
      pago: false
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    // Validar webhook
    if (!validateIfoodWebhook(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse do corpo da requisição
    const orderData = await request.json()

    // Validar dados obrigatórios
    if (!orderData.id || !orderData.customer) {
      return NextResponse.json(
        { error: 'Invalid order data' },
        { status: 400 }
      )
    }

    // Processar pedido
    const pedido = processIfoodOrder(orderData)

    // Em ambiente de servidor, não há localStorage.
    // Aqui apenas registramos o pedido para debug.
    console.log('Pedido iFood recebido:', pedido)

    // Responder sucesso
    return NextResponse.json({
      success: true,
      orderId: pedido.id,
      message: 'Order received successfully'
    })

  } catch (error) {
    console.error('Erro no webhook iFood:', error)
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
    platform: 'iFood',
    version: '1.0'
  })
}