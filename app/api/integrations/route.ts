import { NextRequest, NextResponse } from 'next/server'
import { getConfiguracoes, getIntegrations, saveIntegrations, upsertPedido } from '@/lib/server/repositories'
import type { IntegracaoPlataforma, Pedido } from '@/types'

function getBaseUrl(request: NextRequest) {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim()
  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, '')
  }

  const forwardedProto = request.headers.get('x-forwarded-proto')
  const forwardedHost = request.headers.get('x-forwarded-host')

  if (forwardedProto && forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`
  }

  return request.nextUrl.origin.replace(/\/$/, '')
}

function getWebhookPath(plataforma: IntegracaoPlataforma['plataforma'], id: string) {
  if (id === 'cardapioweb_001') return '/api/webhooks/cardapioweb'
  if (plataforma === 'ifood') return '/api/webhooks/ifood'
  if (plataforma === '99food') return '/api/webhooks/99food'
  return '/api/webhooks/cardapioweb'
}

function normalizeIntegration(integration: IntegracaoPlataforma, request: NextRequest): IntegracaoPlataforma {
  const hasCredentials = Boolean(integration.storeId?.trim() && integration.apiKey?.trim())
  const status = integration.ativo ? (hasCredentials ? 'conectado' : 'erro') : 'desconectado'

  return {
    ...integration,
    webhookUrl: `${getBaseUrl(request)}${getWebhookPath(integration.plataforma, integration.id)}`,
    webhookEvents: integration.webhookEvents || [],
    status,
    ultimaSincronizacao: integration.ativo && hasCredentials ? integration.ultimaSincronizacao : undefined,
  }
}

// GET - Listar integrações
export async function GET(request: NextRequest) {
  const integracoes = await getIntegrations()
  return NextResponse.json(integracoes.map((integration) => normalizeIntegration(integration, request)))
}

export async function PATCH(request: NextRequest) {
  try {
    const data = await request.json()
    const { id, action } = data
    const integracoes = await getIntegrations()
    const integracao = integracoes.find((item) => item.id === id)

    if (!integracao) {
      return NextResponse.json({ error: "Integração não encontrada" }, { status: 404 })
    }

    if (action === "clear-webhook-error") {
      integracao.ultimoErroWebhook = undefined
      integracao.webhookEvents = (integracao.webhookEvents || []).filter((event) => event.tipo !== "erro")
      await saveIntegrations(integracoes)
      return NextResponse.json({ success: true, integration: normalizeIntegration(integracao, request) })
    }

    if (action === "simulate-webhook") {
      const configuracoes = await getConfiguracoes()
      const now = new Date()
      const testOrderId = `SIM-${now.getTime().toString().slice(-6)}`
      const pedido: Pedido = {
        id: `simulado_${testOrderId}`,
        numero: testOrderId,
        cliente: {
          id: "cliente-simulado",
          nome: "Cliente de Teste",
          telefone: "(11) 99999-0000",
          email: "teste@pappi.local",
          endereco: configuracoes.loja.endereco,
        },
        endereco: configuracoes.loja.endereco,
        valor: 49.9,
        formaPagamento: "pix",
        status: "em_preparo",
        dataCriacao: now,
        observacoes: "Pedido de simulação da integração CardapioWeb.",
        volumes: 1,
        taxaEntrega: {
          id: `taxa_${testOrderId}`,
          pedidoId: `simulado_${testOrderId}`,
          valorBase: 8,
          valorPorKm: 0,
          distanciaKm: 0,
          valorTotal: 8,
          pago: false,
        },
      }

      await upsertPedido(pedido)

      integracao.ativo = true
      integracao.status = "conectado"
      integracao.ultimaSincronizacao = now
      integracao.ultimoPedidoRecebidoEm = now
      integracao.ultimoPedidoRecebidoId = pedido.numero
      integracao.ultimoErroWebhook = undefined
      integracao.ultimoWebhookRecebidoEm = now
      integracao.ultimoWebhookStatusCode = 200
      integracao.ultimoWebhookDiagnostico = "Webhook simulado com sucesso pela tela de integrações."
      integracao.ultimoWebhookContentType = "application/json"
      integracao.ultimoWebhookMetodoAutenticacao = "simulado_painel"
      integracao.ultimoWebhookStoreIdRecebido = integracao.storeId || configuracoes.loja.id
      integracao.ultimoWebhookOrderIdRecebido = pedido.numero
      integracao.ultimoWebhookPayloadResumo = "event=order.created; origem=simulacao_painel"
      integracao.webhookEvents = [
        {
          id: `${Date.now()}-simulado`,
          tipo: "pedido_recebido" as const,
          mensagem: `Webhook simulado com sucesso. Pedido ${pedido.numero} registrado.`,
          criadoEm: now,
        },
        ...(integracao.webhookEvents || []),
      ].slice(0, 5)

      await saveIntegrations(integracoes)

      return NextResponse.json({
        success: true,
        integration: normalizeIntegration(integracao, request),
        pedido,
      })
    }

    if (action === "simulate-webhook-token-error") {
      const now = new Date()

      integracao.status = "erro"
      integracao.ultimoErroWebhook = "Token inválido ou ausente no webhook."
      integracao.ultimoWebhookRecebidoEm = now
      integracao.ultimoWebhookStatusCode = 401
      integracao.ultimoWebhookDiagnostico = "Falha na autenticação do webhook."
      integracao.ultimoWebhookContentType = "application/json"
      integracao.ultimoWebhookMetodoAutenticacao = "authorization_invalido"
      integracao.ultimoWebhookStoreIdRecebido = integracao.storeId || undefined
      integracao.ultimoWebhookOrderIdRecebido = undefined
      integracao.ultimoWebhookPayloadResumo = "event=order.created; origem=simulacao_erro_token"
      integracao.webhookEvents = [
        {
          id: `${Date.now()}-simulado-erro-token`,
          tipo: "erro" as const,
          mensagem: "Simulação de erro: token inválido ou ausente no webhook.",
          criadoEm: now,
        },
        ...(integracao.webhookEvents || []),
      ].slice(0, 5)

      await saveIntegrations(integracoes)

      return NextResponse.json({
        success: true,
        integration: normalizeIntegration(integracao, request),
      })
    }

    return NextResponse.json({ error: "Ação inválida" }, { status: 400 })
  } catch (error) {
    console.error("Erro ao atualizar status da integração:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

// POST - Atualizar integração
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { id, storeId, apiKey, ativo } = data
    const integracoes = await getIntegrations()

    const integracao = integracoes.find(i => i.id === id)
    if (!integracao) {
      return NextResponse.json(
        { error: 'Integração não encontrada' },
        { status: 404 }
      )
    }

    // Atualizar dados mantendo exatamente o que foi digitado
    if (typeof storeId === 'string') {
      integracao.storeId = storeId.trim()
    }
    if (typeof apiKey === 'string') {
      integracao.apiKey = apiKey.trim()
    }
    if (typeof ativo === 'boolean') {
      integracao.ativo = ativo
    }

    // Atualizar status coerente com o estado salvo
    if (integracao.ativo && integracao.storeId && integracao.apiKey) {
      integracao.status = 'conectado'
      integracao.ultimaSincronizacao = new Date()
    } else {
      integracao.status = 'desconectado'
      integracao.ultimaSincronizacao = undefined
    }

    integracao.webhookUrl = `${getBaseUrl(request)}${getWebhookPath(integracao.plataforma, integracao.id)}`

    await saveIntegrations(integracoes)

    return NextResponse.json(normalizeIntegration(integracao, request))

  } catch (error) {
    console.error('Erro ao atualizar integração:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT - Testar integração
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { id } = data
    const integracoes = await getIntegrations()

    const integracao = integracoes.find(i => i.id === id)
    if (!integracao) {
      return NextResponse.json(
        { error: 'Integração não encontrada' },
        { status: 404 }
      )
    }

    const testSuccess = Boolean(integracao.ativo && integracao.storeId?.trim() && integracao.apiKey?.trim())

    integracao.status = testSuccess ? 'conectado' : 'erro'
    integracao.ultimaSincronizacao = testSuccess ? new Date() : undefined
    await saveIntegrations(integracoes)

    return NextResponse.json({
      success: testSuccess,
      readyForWebhook: testSuccess,
      message: testSuccess
        ? 'Configuração validada. A integração está pronta para receber webhooks reais.'
        : 'Configuração incompleta. Verifique Store ID, API Key e se a integração está ativa.'
    })

  } catch (error) {
    console.error('Erro ao testar integração:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
