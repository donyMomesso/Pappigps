import { NextRequest, NextResponse } from 'next/server'
import type { Pedido } from '@/types'

// Simulação de validação de webhook CardapioWeb
function validateCardapioWebWebhook(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const expectedToken = process.env.CARDAPIO_WEB_TOKEN || 'cardapioweb_token_dev'

  // CardapioWeb pode usar diferentes formatos de autenticação
  return authHeader === `Bearer ${expectedToken}` ||
         authHeader === `Token ${expectedToken}` ||
         request.headers.get('x-api-key') === expectedToken
}

// Simulação de processamento de pedido CardapioWeb
function processCardapioWebOrder(orderData: any): Pedido {
  // Estrutura típica do CardapioWeb
  const enderecoEntrega = {
    logradouro: orderData.delivery?.address?.street || orderData.endereco?.rua || '',
    numero: orderData.delivery?.address?.number || orderData.endereco?.numero || '',
    bairro: orderData.delivery?.address?.neighborhood || orderData.endereco?.bairro || '',
    cidade: orderData.delivery?.address?.city || orderData.endereco?.cidade || '',
    uf: orderData.delivery?.address?.state || orderData.endereco?.uf || '',
    cep: orderData.delivery?.address?.zipcode || orderData.endereco?.cep || '',
    latitude: orderData.delivery?.address?.latitude,
    longitude: orderData.delivery?.address?.longitude
  }

  return {
    id: `cardapioweb_${orderData.id || orderData.orderId || orderData.numero}`,
    numero: orderData.number || orderData.orderNumber || orderData.id?.toString() || '',
    cliente: {
      id: orderData.customer?.id?.toString() || orderData.cliente?.id?.toString() || '',
      nome: orderData.customer?.name || orderData.cliente?.nome || '',
      telefone: orderData.customer?.phone || orderData.cliente?.telefone || '',
      email: orderData.customer?.email || orderData.cliente?.email || '',
      endereco: enderecoEntrega
    },
    endereco: enderecoEntrega,
    valor: orderData.total || orderData.totalValue || orderData.valor || 0,
    formaPagamento: orderData.payment?.method || orderData.formaPagamento || 'dinheiro',
    status: 'pendente',
    dataCriacao: orderData.createdAt ? new Date(orderData.createdAt) : new Date(),
    dataEntrega: orderData.deliveryTime ? new Date(orderData.deliveryTime) : undefined,
    observacoes: orderData.notes || orderData.observacoes || '',
    peso: orderData.weight || orderData.peso,
    volumes: orderData.items?.length || 1,
    rotaId: undefined,
    entregadorId: undefined,
    ordemEntrega: undefined,
    taxaEntrega: {
      id: `taxa_${orderData.id || orderData.orderId}`,
      pedidoId: `cardapioweb_${orderData.id || orderData.orderId}`,
      valorBase: orderData.deliveryFee || orderData.taxaEntrega || 0,
      valorPorKm: 0,
      distanciaKm: 0,
      valorTotal: orderData.deliveryFee || orderData.taxaEntrega || 0,
      pago: false
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    // Validar webhook
    if (!validateCardapioWebWebhook(request)) {
      return NextResponse.json(
        { error: 'Unauthorized - Token inválido para CardapioWeb' },
        { status: 401 }
      )
    }

    // Parse do corpo da requisição
    const orderData = await request.json()

    // Validar dados obrigatórios
    if (!orderData.id && !orderData.orderId && !orderData.numero) {
      return NextResponse.json(
        { error: 'Dados do pedido inválidos - ID do pedido obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se é da loja correta (5371)
    const storeId = orderData.storeId || orderData.lojaId || orderData.restaurantId
    const expectedStoreId = process.env.CARDAPIO_WEB_STORE_ID || '5371'

    if (storeId && storeId.toString() !== expectedStoreId) {
      return NextResponse.json(
        { error: `Pedido não é desta loja. Esperado: ${expectedStoreId}, Recebido: ${storeId}` },
        { status: 400 }
      )
    }

    // Processar pedido
    const pedido = processCardapioWebOrder(orderData)

    // Em ambiente de servidor, não há localStorage.
    // Aqui apenas registramos o pedido para debug.
    console.log('Pedido CardapioWeb recebido:', {
      pedido: pedido.numero,
      cliente: pedido.cliente.nome,
      valor: pedido.valor,
      storeId: expectedStoreId
    })

    // Responder sucesso no formato esperado pelo CardapioWeb
    return NextResponse.json({
      success: true,
      message: 'Pedido recebido com sucesso',
      orderId: pedido.id,
      status: 'accepted',
      estimatedDeliveryTime: '45-60 min'
    })

  } catch (error) {
    console.error('Erro no webhook CardapioWeb:', error)
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: errorMessage },
      { status: 500 }
    )
  }
}

// Endpoint para verificar status do webhook
export async function GET() {
  return NextResponse.json({
    status: 'active',
    platform: 'CardapioWeb',
    storeId: process.env.CARDAPIO_WEB_STORE_ID || '5371',
    version: '1.0',
    supportedEvents: ['order.created', 'order.updated', 'order.cancelled']
  })
}