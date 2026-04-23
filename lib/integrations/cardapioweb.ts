import { getIntegrations, saveIntegrations, upsertPedido } from "@/lib/server/repositories"
import type { IntegracaoPlataforma, Pedido, StatusPedido } from "@/types"

type UnknownRecord = Record<string, any>

function parseNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string") {
    const normalized = value.replace(/[^\d,.-]/g, "").replace(",", ".")
    const parsed = Number(normalized)
    return Number.isFinite(parsed) ? parsed : fallback
  }
  return fallback
}

function parseDate(value: unknown, fallback: Date = new Date()) {
  if (value instanceof Date) return value
  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value)
    if (!Number.isNaN(parsed.getTime())) {
      return parsed
    }
  }
  return fallback
}

function mapStatus(value: unknown): StatusPedido {
  const normalized = String(value ?? "").toLowerCase()

  if (
    normalized.includes("preparo") ||
    normalized.includes("prepar") ||
    normalized.includes("kitchen") ||
    normalized.includes("readying")
  ) {
    return "em_preparo"
  }
  if (normalized.includes("rota") || normalized.includes("dispatch") || normalized.includes("delivery")) {
    return "em_rota"
  }
  if (normalized.includes("cancel")) return "cancelado"
  if (normalized.includes("entreg") || normalized.includes("delivered") || normalized.includes("final")) {
    return "entregue"
  }
  return "pendente"
}

function mapFormaPagamento(value: unknown): Pedido["formaPagamento"] {
  const normalized = String(value ?? "").toLowerCase()

  if (normalized.includes("pix")) return "pix"
  if (normalized.includes("boleto")) return "boleto"
  if (normalized.includes("cart")) return "cartao"
  return "dinheiro"
}

function extractAddress(raw: UnknownRecord) {
  const address = raw.endereco || raw.enderecoEntrega || raw.deliveryAddress || raw.address || raw.delivery?.address || {}

  return {
    logradouro: address.logradouro || address.street || address.streetName || raw.logradouro || "",
    numero: address.numero || address.number || address.streetNumber || raw.numero || "S/N",
    bairro: address.bairro || address.neighborhood || raw.bairro || "",
    cidade: address.cidade || address.city || raw.cidade || "",
    uf: address.uf || address.state || raw.uf || "",
    cep: address.cep || address.postalCode || address.zipcode || raw.cep || "",
    complemento: address.complemento || address.complement || raw.complemento || "",
    latitude: address.latitude ?? address.lat ?? address.coordinates?.latitude,
    longitude: address.longitude ?? address.lng ?? address.lon ?? address.coordinates?.longitude,
  }
}

function normalizePedido(raw: UnknownRecord, index: number): Pedido {
  const clienteData = raw.cliente || raw.customer || raw.usuario || {}
  const endereco = extractAddress(raw)
  const id = String(raw.id || raw.orderId || raw.codigo || raw.numero || `pedido-${index + 1}`)
  const numero = String(raw.numero || raw.displayId || raw.orderNumber || raw.codigo || id)

  return {
    id: `cardapioweb_${id}`,
    numero,
    cliente: {
      id: String(clienteData.id || clienteData.codigo || `cliente-${id}`),
      nome: clienteData.nome || clienteData.name || raw.nomeCliente || raw.customerName || "Cliente",
      telefone: clienteData.telefone || clienteData.phone || raw.telefone || raw.customerPhone || "",
      email: clienteData.email || raw.email || "",
      endereco,
    },
    endereco,
    valor: parseNumber(raw.valor ?? raw.total ?? raw.valorTotal ?? raw.amount),
    formaPagamento: mapFormaPagamento(raw.formaPagamento ?? raw.paymentMethod ?? raw.pagamento ?? raw.payment?.method),
    status: mapStatus(raw.status ?? raw.situacao ?? raw.preparationStatus ?? raw.orderStatus),
    dataCriacao: parseDate(raw.dataCriacao ?? raw.createdAt ?? raw.data ?? raw.created_at),
    dataEntrega: raw.dataEntrega || raw.deliveredAt ? parseDate(raw.dataEntrega ?? raw.deliveredAt) : undefined,
    observacoes: raw.observacoes || raw.observacao || raw.notes || "",
    peso: raw.peso ? parseNumber(raw.peso) : undefined,
    volumes: raw.volumes ?? raw.items?.length ?? raw.itens?.length ?? 1,
    rotaId: raw.rotaId,
    entregadorId: raw.entregadorId,
    ordemEntrega: raw.ordemEntrega,
  }
}

function extractPedidosArray(payload: unknown): UnknownRecord[] {
  if (Array.isArray(payload)) return payload as UnknownRecord[]
  if (!payload || typeof payload !== "object") return []

  const source = payload as UnknownRecord
  const candidates = [
    source.pedidos,
    source.orders,
    source.data,
    source.items,
    source.result,
    source.resultado,
    source.content,
  ]

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate as UnknownRecord[]
    if (candidate && typeof candidate === "object") {
      const nested = extractPedidosArray(candidate)
      if (nested.length) return nested
    }
  }

  return []
}

export async function getCardapioWebIntegration() {
  const integrations = await getIntegrations()
  const integration = integrations.find((item) => item.id === "cardapioweb_001") || null

  return {
    integrations,
    integration,
    token: integration?.apiKey?.trim() || process.env.CARDAPIO_WEB_TOKEN || "",
    storeId: integration?.storeId?.trim() || process.env.CARDAPIO_WEB_STORE_ID || "",
  }
}

function isAbsoluteUrl(value: string) {
  return value.startsWith("http://") || value.startsWith("https://")
}

function resolveOrderId(pedidoId: string) {
  return pedidoId.replace(/^cardapioweb_/, "")
}

function buildCardapioWebUrl(baseUrl: string, orderId: string, storeId: string) {
  const resolvedOrderId = resolveOrderId(orderId)

  if (baseUrl.includes(":orderId")) {
    return baseUrl.replace(":orderId", encodeURIComponent(resolvedOrderId))
  }

  const url = new URL(baseUrl)

  if (!url.searchParams.has("orderId") && !url.searchParams.has("pedidoId") && !url.searchParams.has("id")) {
    url.searchParams.set("orderId", resolvedOrderId)
  }

  if (storeId && !url.searchParams.has("storeId") && !url.searchParams.has("lojaId")) {
    url.searchParams.set("storeId", storeId)
  }

  return url.toString()
}

function getAuthHeaders(token: string) {
  return {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
    "x-api-key": token,
    "Content-Type": "application/json",
  }
}

function buildPollingUrl(baseUrl: string, storeId: string) {
  const url = new URL(baseUrl)
  if (storeId && !url.searchParams.has("storeId") && !url.searchParams.has("lojaId")) {
    url.searchParams.set("storeId", storeId)
  }
  return url.toString()
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

export async function fetchCardapioWebPedidosByPolling() {
  const { token, storeId, integration, integrations } = await getCardapioWebIntegration()
  const pollingUrl =
    process.env.CARDAPIO_WEB_POLLING_URL ||
    process.env.CARDAPIO_WEB_PEDIDOS_URL ||
    process.env.CARDAPIO_WEB_URL

  if (!pollingUrl) {
    throw new Error("CARDAPIO_WEB_POLLING_URL não configurada.")
  }

  if (!token) {
    throw new Error("API Key do Cardápio Web não configurada.")
  }

  const response = await fetch(buildPollingUrl(pollingUrl, storeId), {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "x-api-key": token,
    },
  })

  if (!response.ok) {
    if (integration) {
      integration.status = "erro"
      integration.ultimoErroWebhook = `Polling do Cardápio Web falhou com status ${response.status}.`
      integration.ultimoWebhookRecebidoEm = new Date()
      integration.ultimoWebhookStatusCode = response.status
      integration.ultimoWebhookDiagnostico = "Falha ao sincronizar pedidos via polling."
      integration.ultimoWebhookContentType = response.headers.get("content-type") || "não informado"
      integration.ultimoWebhookMetodoAutenticacao = "polling_authorization_bearer"
      appendWebhookEvent(integration, "erro", `Polling do Cardápio Web falhou com status ${response.status}.`)
      await saveIntegrations(integrations)
    }
    throw new Error(`Falha ao consultar polling do Cardápio Web: ${response.status}`)
  }

  const payload = await response.json()
  const pedidosRaw = extractPedidosArray(payload)
  const pedidos = pedidosRaw.map((pedido, index) => normalizePedido(pedido, index))

  if (integration) {
    integration.status = "conectado"
    integration.ativo = true
    integration.ultimaSincronizacao = new Date()
    integration.ultimoErroWebhook = undefined
    integration.ultimoWebhookRecebidoEm = new Date()
    integration.ultimoWebhookStatusCode = 200
    integration.ultimoWebhookDiagnostico = "Pedidos sincronizados com sucesso via polling."
    integration.ultimoWebhookContentType = "application/json"
    integration.ultimoWebhookMetodoAutenticacao = "polling_authorization_bearer"
    integration.ultimoWebhookStoreIdRecebido = storeId || undefined
    integration.ultimoWebhookPayloadResumo = `polling; pedidos=${pedidos.length}`

    if (pedidos[0]) {
      integration.ultimoPedidoRecebidoId = pedidos[0].numero
      integration.ultimoPedidoRecebidoEm = new Date()
      integration.ultimoWebhookOrderIdRecebido = pedidos[0].numero
    }

    appendWebhookEvent(integration, "validacao", `Polling executado com sucesso. ${pedidos.length} pedidos encontrados.`)
    await saveIntegrations(integrations)
  }

  return pedidos
}

export async function syncCardapioWebPedidos() {
  const pedidos = await fetchCardapioWebPedidosByPolling()

  for (const pedido of pedidos) {
    await upsertPedido(pedido)
  }

  return {
    total: pedidos.length,
    pedidos,
  }
}

async function updateIntegrationAfterOrderAction(
  integration: IntegracaoPlataforma | null,
  integrations: IntegracaoPlataforma[],
  details: {
    diagnostico: string
    eventMessage: string
    orderId?: string
  }
) {
  if (!integration) return

  integration.status = "conectado"
  integration.ativo = true
  integration.ultimaSincronizacao = new Date()
  integration.ultimoErroWebhook = undefined
  integration.ultimoWebhookRecebidoEm = new Date()
  integration.ultimoWebhookStatusCode = 200
  integration.ultimoWebhookDiagnostico = details.diagnostico
  integration.ultimoWebhookContentType = "application/json"
  integration.ultimoWebhookMetodoAutenticacao = "api_action_bearer"
  integration.ultimoWebhookOrderIdRecebido = details.orderId || undefined
  appendWebhookEvent(integration, "validacao", details.eventMessage)
  await saveIntegrations(integrations)
}

export async function fetchCardapioWebPedidoDetalhes(pedidoId: string) {
  const { token, storeId, integration, integrations } = await getCardapioWebIntegration()
  const detailsUrl = process.env.CARDAPIO_WEB_ORDER_DETAILS_URL

  if (!detailsUrl) {
    throw new Error("CARDAPIO_WEB_ORDER_DETAILS_URL não configurada.")
  }

  if (!token) {
    throw new Error("API Key do Cardápio Web não configurada.")
  }

  const response = await fetch(buildCardapioWebUrl(detailsUrl, pedidoId, storeId), {
    method: "GET",
    cache: "no-store",
    headers: getAuthHeaders(token),
  })

  if (!response.ok) {
    throw new Error(`Falha ao consultar detalhes do pedido: ${response.status}`)
  }

  const payload = await response.json()
  const rawPedido = payload?.pedido || payload?.order || payload?.data?.pedido || payload?.data?.order || payload
  const pedido = normalizePedido(rawPedido, 0)

  await upsertPedido(pedido)
  await updateIntegrationAfterOrderAction(integration, integrations, {
    diagnostico: "Detalhes do pedido consultados com sucesso na API do Cardápio Web.",
    eventMessage: `Detalhes do pedido ${pedido.numero} consultados com sucesso.`,
    orderId: pedido.numero,
  })

  return { pedido, payload }
}

export async function acceptCardapioWebPedido(pedidoId: string) {
  const { token, storeId, integration, integrations } = await getCardapioWebIntegration()
  const acceptUrl = process.env.CARDAPIO_WEB_ACCEPT_ORDER_URL

  if (!acceptUrl) {
    throw new Error("CARDAPIO_WEB_ACCEPT_ORDER_URL não configurada.")
  }

  if (!token) {
    throw new Error("API Key do Cardápio Web não configurada.")
  }

  const orderId = resolveOrderId(pedidoId)
  const requestUrl = isAbsoluteUrl(acceptUrl) ? buildCardapioWebUrl(acceptUrl, orderId, storeId) : acceptUrl
  const response = await fetch(requestUrl, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify({
      orderId,
      pedidoId: orderId,
      id: orderId,
      storeId,
    }),
  })

  if (!response.ok) {
    throw new Error(`Falha ao aceitar pedido: ${response.status}`)
  }

  const payload = await response.json().catch(() => ({}))
  const fallbackPedido: Pedido = {
    id: `cardapioweb_${orderId}`,
    numero: orderId,
    cliente: {
      id: `cliente-${orderId}`,
      nome: "Cliente",
      telefone: "",
      endereco: {
        logradouro: "",
        numero: "",
        bairro: "",
        cidade: "",
        uf: "",
        cep: "",
      },
    },
    endereco: {
      logradouro: "",
      numero: "",
      bairro: "",
      cidade: "",
      uf: "",
      cep: "",
    },
    valor: 0,
    formaPagamento: "dinheiro",
    status: "em_preparo",
    dataCriacao: new Date(),
  }

  await upsertPedido({
    ...(payload?.pedido || payload?.order ? normalizePedido(payload.pedido || payload.order, 0) : fallbackPedido),
    status: "em_preparo",
  })

  await updateIntegrationAfterOrderAction(integration, integrations, {
    diagnostico: "Pedido aceito com sucesso na API do Cardápio Web.",
    eventMessage: `Pedido ${orderId} aceito com sucesso.`,
    orderId,
  })

  return { success: true, payload, orderId }
}

export async function markCardapioWebPedidoReady(pedidoId: string) {
  const { token, storeId, integration, integrations } = await getCardapioWebIntegration()
  const readyUrl = process.env.CARDAPIO_WEB_READY_ORDER_URL

  if (!readyUrl) {
    throw new Error("CARDAPIO_WEB_READY_ORDER_URL não configurada.")
  }

  if (!token) {
    throw new Error("API Key do Cardápio Web não configurada.")
  }

  const orderId = resolveOrderId(pedidoId)
  const requestUrl = isAbsoluteUrl(readyUrl) ? buildCardapioWebUrl(readyUrl, orderId, storeId) : readyUrl
  const response = await fetch(requestUrl, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify({
      orderId,
      pedidoId: orderId,
      id: orderId,
      storeId,
    }),
  })

  if (!response.ok) {
    throw new Error(`Falha ao marcar pedido como pronto: ${response.status}`)
  }

  const payload = await response.json().catch(() => ({}))
  const fallbackPedido: Pedido = {
    id: `cardapioweb_${orderId}`,
    numero: orderId,
    cliente: {
      id: `cliente-${orderId}`,
      nome: "Cliente",
      telefone: "",
      endereco: {
        logradouro: "",
        numero: "",
        bairro: "",
        cidade: "",
        uf: "",
        cep: "",
      },
    },
    endereco: {
      logradouro: "",
      numero: "",
      bairro: "",
      cidade: "",
      uf: "",
      cep: "",
    },
    valor: 0,
    formaPagamento: "dinheiro",
    status: "pendente",
    dataCriacao: new Date(),
  }

  await upsertPedido({
    ...(payload?.pedido || payload?.order ? normalizePedido(payload.pedido || payload.order, 0) : fallbackPedido),
    status: "pendente",
  })

  await updateIntegrationAfterOrderAction(integration, integrations, {
    diagnostico: "Pedido marcado como pronto com sucesso na API do Cardápio Web.",
    eventMessage: `Pedido ${orderId} marcado como pronto.`,
    orderId,
  })

  return { success: true, payload, orderId }
}
