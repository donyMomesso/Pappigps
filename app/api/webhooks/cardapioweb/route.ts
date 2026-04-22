import { NextRequest, NextResponse } from 'next/server'
import { getIntegrations, saveIntegrations, upsertPedido } from '@/lib/server/repositories'
import type { IntegracaoPlataforma, Pedido } from '@/types'

async function getCardapioWebCredentials() {
  const integrations = await getIntegrations()
  const integration = integrations.find((item) => item.id === 'cardapioweb_001')

  return {
    token: integration?.apiKey?.trim() || process.env.CARDAPIO_WEB_TOKEN || 'cardapioweb_token_dev',
    storeId: integration?.storeId?.trim() || process.env.CARDAPIO_WEB_STORE_ID || '5371',
    integrations,
    integration,
  }
}

function appendWebhookEvent(
  integration: IntegracaoPlataforma,
  tipo: "pedido_recebido" | "erro" | "validacao",
  mensagem: string
) {
  const nextEvents = [
    {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      tipo,
      mensagem,
      criadoEm: new Date(),
    },
    ...(integration.webhookEvents || []),
  ]

  integration.webhookEvents = nextEvents.slice(0, 5)
}

function validateCardapioWebWebhook(request: NextRequest, expectedToken: string): boolean {
  const authHeader = request.headers.get('authorization')

  // CardapioWeb pode usar diferentes formatos de autenticação
  return authHeader === `Bearer ${expectedToken}` ||
         authHeader === `Token ${expectedToken}` ||
         request.headers.get('x-api-key') === expectedToken
}

function extractOrderPayload(payload: any) {
  return payload?.pedido || payload?.order || payload?.data?.pedido || payload?.data?.order || payload
}

function parseNumber(value: unknown, fallback = 0) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const normalized = value.replace(/[^\d,.-]/g, '').replace(',', '.')
    const parsed = Number(normalized)
    return Number.isFinite(parsed) ? parsed : fallback
  }
  return fallback
}

function mapFormaPagamento(value: unknown): Pedido["formaPagamento"] {
  const normalized = String(value ?? '').toLowerCase()

  if (normalized.includes('pix')) return 'pix'
  if (normalized.includes('boleto')) return 'boleto'
  if (normalized.includes('cart')) return 'cartao'
  return 'dinheiro'
}

function mapStatus(value: unknown): Pedido["status"] {
  const normalized = String(value ?? '').toLowerCase()

  if (
    normalized.includes('preparo') ||
    normalized.includes('prepar') ||
    normalized.includes('kitchen') ||
    normalized.includes('readying')
  ) {
    return 'em_preparo'
  }
  if (normalized.includes('rota') || normalized.includes('dispatch') || normalized.includes('delivery')) {
    return 'em_rota'
  }
  if (normalized.includes('cancel')) return 'cancelado'
  if (normalized.includes('entreg') || normalized.includes('delivered') || normalized.includes('final')) {
    return 'entregue'
  }
  return 'pendente'
}

function processCardapioWebOrder(orderPayload: any): Pedido {
  const orderData = extractOrderPayload(orderPayload)

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

  const orderId = orderData.id || orderData.orderId || orderData.numero || orderData.number || orderData.orderNumber
  const pedidoNumero = orderData.number || orderData.orderNumber || orderData.id?.toString() || orderData.orderId?.toString() || orderData.numero || ''

  return {
    id: `cardapioweb_${orderId}`,
    numero: pedidoNumero,
    cliente: {
      id: orderData.customer?.id?.toString() || orderData.cliente?.id?.toString() || '',
      nome: orderData.customer?.name || orderData.cliente?.nome || '',
      telefone: orderData.customer?.phone || orderData.cliente?.telefone || '',
      email: orderData.customer?.email || orderData.cliente?.email || '',
      endereco: enderecoEntrega
    },
    endereco: enderecoEntrega,
    valor: parseNumber(orderData.total || orderData.totalValue || orderData.valor || 0),
    formaPagamento: mapFormaPagamento(orderData.payment?.method || orderData.formaPagamento),
    status: mapStatus(
      orderData.status ||
      orderData.situacao ||
      orderData.preparationStatus ||
      orderData.orderStatus ||
      orderPayload?.event
    ),
    dataCriacao: orderData.createdAt ? new Date(orderData.createdAt) : new Date(),
    dataEntrega: orderData.deliveryTime ? new Date(orderData.deliveryTime) : undefined,
    observacoes: orderData.notes || orderData.observacoes || '',
    peso: orderData.weight || orderData.peso ? parseNumber(orderData.weight || orderData.peso) : undefined,
    volumes: orderData.items?.length || 1,
    rotaId: undefined,
    entregadorId: undefined,
    ordemEntrega: undefined,
    taxaEntrega: {
      id: `taxa_${orderId}`,
      pedidoId: `cardapioweb_${orderId}`,
      valorBase: parseNumber(orderData.deliveryFee || orderData.taxaEntrega || 0),
      valorPorKm: 0,
      distanciaKm: 0,
      valorTotal: parseNumber(orderData.deliveryFee || orderData.taxaEntrega || 0),
      pago: false
    }
  }
}

async function parseWebhookBody(request: NextRequest) {
  const contentType = request.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    return request.json()
  }

  if (contentType.includes('application/x-www-form-urlencoded')) {
    const text = await request.text()
    return Object.fromEntries(new URLSearchParams(text).entries())
  }

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData()
    const data: Record<string, undefined | string> = {}
    formData.forEach((value, key) => {
      data[key] = typeof value === 'string' ? value : undefined
    })
    return data
  }

  const text = await request.text()
  if (text.trim().startsWith('{')) {
    try {
      return JSON.parse(text)
    } catch {
      return { raw: text }
    }
  }

  return Object.fromEntries(new URLSearchParams(text).entries())
}

export async function POST(request: NextRequest) {
  try {
    const credentials = await getCardapioWebCredentials()

    // Validar webhook
    if (!validateCardapioWebWebhook(request, credentials.token)) {
      if (credentials.integration) {
        credentials.integration.status = 'erro'
        credentials.integration.ultimoErroWebhook = 'Token inválido recebido no webhook.'
        appendWebhookEvent(credentials.integration, "erro", "Token inválido recebido no webhook.")
        await saveIntegrations(credentials.integrations)
      }
      return NextResponse.json(
        { error: 'Unauthorized - Token inválido para CardapioWeb' },
        { status: 401 }
      )
    }

    // Parse do corpo da requisição
    const orderData = await parseWebhookBody(request)
    const orderPayload = extractOrderPayload(orderData)
    const orderId =
      orderPayload.id ||
      orderPayload.orderId ||
      orderPayload.numero ||
      orderPayload.number ||
      orderPayload.orderNumber
    const storeId =
      orderPayload.storeId ||
      orderPayload.lojaId ||
      orderPayload.restaurantId ||
      orderPayload.store_id ||
      orderPayload.restaurant_id

    // Validar dados obrigatórios
    if (!orderId) {
      if (credentials.integration) {
        credentials.integration.status = 'erro'
        credentials.integration.ultimoErroWebhook = 'Pedido recebido sem ID obrigatório.'
        appendWebhookEvent(credentials.integration, "erro", "Pedido recebido sem ID obrigatório.")
        await saveIntegrations(credentials.integrations)
      }
      return NextResponse.json(
        { error: 'Dados do pedido inválidos - ID do pedido obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se é da loja correta (5371)
    const expectedStoreId = credentials.storeId

    if (storeId && storeId.toString() !== expectedStoreId) {
      if (credentials.integration) {
        credentials.integration.status = 'erro'
        credentials.integration.ultimoErroWebhook = `Store ID divergente. Esperado ${expectedStoreId} e recebido ${storeId}.`
        appendWebhookEvent(
          credentials.integration,
          "erro",
          `Store ID divergente. Esperado ${expectedStoreId} e recebido ${storeId}.`
        )
        await saveIntegrations(credentials.integrations)
      }
      return NextResponse.json(
        { error: `Pedido não é desta loja. Esperado: ${expectedStoreId}, Recebido: ${storeId}` },
        { status: 400 }
      )
    }

    // Processar pedido
    const pedido = processCardapioWebOrder(orderData)
    await upsertPedido(pedido)

    const cardapioWebIntegration = credentials.integration

    if (cardapioWebIntegration) {
      cardapioWebIntegration.ativo = true
      cardapioWebIntegration.status = 'conectado'
      cardapioWebIntegration.storeId = cardapioWebIntegration.storeId || expectedStoreId
      cardapioWebIntegration.apiKey = cardapioWebIntegration.apiKey || credentials.token
      cardapioWebIntegration.ultimaSincronizacao = new Date()
      cardapioWebIntegration.ultimoPedidoRecebidoEm = new Date()
      cardapioWebIntegration.ultimoPedidoRecebidoId = pedido.numero || pedido.id
      cardapioWebIntegration.ultimoErroWebhook = undefined
      appendWebhookEvent(
        cardapioWebIntegration,
        "pedido_recebido",
        `Pedido ${pedido.numero || pedido.id} recebido com sucesso.`
      )
      await saveIntegrations(credentials.integrations)
    }

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
    try {
      const credentials = await getCardapioWebCredentials()
      if (credentials.integration) {
        credentials.integration.status = 'erro'
        credentials.integration.ultimoErroWebhook =
          error instanceof Error ? error.message : 'Erro interno desconhecido no webhook.'
        appendWebhookEvent(
          credentials.integration,
          "erro",
          error instanceof Error ? error.message : 'Erro interno desconhecido no webhook.'
        )
        await saveIntegrations(credentials.integrations)
      }
    } catch (integrationError) {
      console.error('Erro ao salvar status da integração:', integrationError)
    }
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: errorMessage },
      { status: 500 }
    )
  }
}

// Endpoint para verificar status do webhook
export async function GET() {
  const credentials = await getCardapioWebCredentials()

  return NextResponse.json({
    status: 'active',
    platform: 'CardapioWeb',
    storeId: credentials.storeId,
    version: '1.0',
    supportedEvents: ['order.created', 'order.updated', 'order.cancelled']
  })
}
