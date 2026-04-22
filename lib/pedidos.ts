import { mockPedidos } from "@/mocks/data"
import { getPedidosStore } from "@/lib/server/repositories"
import type { Endereco, FormaPagamento, Pedido, StatusPedido } from "@/types"

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

function mapFormaPagamento(value: unknown): FormaPagamento {
  const normalized = String(value ?? "").toLowerCase()

  if (normalized.includes("pix")) return "pix"
  if (normalized.includes("boleto")) return "boleto"
  if (normalized.includes("cart")) return "cartao"
  return "dinheiro"
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

function extractAddress(raw: UnknownRecord): Endereco {
  const address = raw.endereco || raw.enderecoEntrega || raw.deliveryAddress || raw.address || {}

  return {
    logradouro: address.logradouro || address.street || address.streetName || raw.logradouro || "",
    numero: address.numero || address.number || address.streetNumber || raw.numero || "S/N",
    bairro: address.bairro || address.neighborhood || raw.bairro || "",
    cidade: address.cidade || address.city || raw.cidade || "",
    uf: address.uf || address.state || raw.uf || "",
    cep: address.cep || address.postalCode || raw.cep || "",
    complemento: address.complemento || address.complement || raw.complemento || "",
    latitude: address.latitude ?? address.lat ?? address.coordinates?.latitude,
    longitude: address.longitude ?? address.lng ?? address.lon ?? address.coordinates?.longitude
  }
}

function normalizePedido(raw: UnknownRecord, index: number): Pedido {
  const clienteData = raw.cliente || raw.customer || raw.usuario || {}
  const endereco = extractAddress(raw)
  const id = String(raw.id || raw.orderId || raw.codigo || raw.numero || `pedido-${index + 1}`)
  const numero = String(raw.numero || raw.displayId || raw.orderNumber || raw.codigo || id)

  return {
    id,
    numero,
    cliente: {
      id: String(clienteData.id || clienteData.codigo || `cliente-${id}`),
      nome: clienteData.nome || clienteData.name || raw.nomeCliente || raw.customerName || "Cliente",
      telefone: clienteData.telefone || clienteData.phone || raw.telefone || raw.customerPhone || "",
      email: clienteData.email || raw.email || "",
      endereco
    },
    endereco,
    valor: parseNumber(raw.valor ?? raw.total ?? raw.valorTotal ?? raw.amount),
    formaPagamento: mapFormaPagamento(raw.formaPagamento ?? raw.paymentMethod ?? raw.pagamento),
    status: mapStatus(raw.status ?? raw.situacao),
    dataCriacao: parseDate(raw.dataCriacao ?? raw.createdAt ?? raw.data ?? raw.created_at),
    dataEntrega: raw.dataEntrega || raw.deliveredAt ? parseDate(raw.dataEntrega ?? raw.deliveredAt) : undefined,
    observacoes: raw.observacoes || raw.observacao || raw.notes || "",
    peso: raw.peso ? parseNumber(raw.peso) : undefined,
    volumes: raw.volumes ?? raw.items?.length ?? raw.itens?.length ?? 1,
    rotaId: raw.rotaId,
    entregadorId: raw.entregadorId,
    ordemEntrega: raw.ordemEntrega
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
    source.content
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

export async function fetchPedidosExternos() {
  const sourceUrl =
    process.env.CARDAPIO_WEB_PEDIDOS_URL ||
    process.env.CARDAPIO_WEB_URL ||
    "https://acesso.pickngo.online/api/cardapioWeb"

  const token = process.env.CARDAPIO_WEB_TOKEN
  const response = await fetch(sourceUrl, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  })

  if (!response.ok) {
    throw new Error(`Falha ao consultar origem externa: ${response.status}`)
  }

  const text = await response.text()
  if (!text.trim()) {
    return []
  }

  const payload = JSON.parse(text)
  const pedidosRaw = extractPedidosArray(payload)

  return pedidosRaw.map((pedido, index) => normalizePedido(pedido, index))
}

export async function getPedidos() {
  try {
    const pedidos = await fetchPedidosExternos()
    if (pedidos.length > 0) {
      return { pedidos, source: "cardapio-web" as const }
    }
  } catch (error) {
    console.error("Erro ao carregar pedidos externos:", error)
  }

  try {
    const pedidosPersistidos = await getPedidosStore()
    if (pedidosPersistidos.length > 0) {
      return { pedidos: pedidosPersistidos, source: "webhook" as const }
    }
  } catch (error) {
    console.error("Erro ao carregar pedidos persistidos:", error)
  }

  return { pedidos: mockPedidos, source: "mock" as const }
}

export function buildDashboardStatsFromPedidos(pedidos: Pedido[]) {
  const pedidosHoje = pedidos.length
  const pedidosPendentes = pedidos.filter(
    (pedido) => pedido.status === "pendente" || pedido.status === "em_preparo"
  ).length
  const pedidosEmRota = pedidos.filter((pedido) => pedido.status === "em_rota").length
  const pedidosEntregues = pedidos.filter((pedido) => pedido.status === "entregue").length
  const faturamentoHoje = pedidos.reduce((acc, pedido) => acc + pedido.valor, 0)
  const ticketMedio = pedidosHoje > 0 ? faturamentoHoje / pedidosHoje : 0

  return {
    pedidosHoje,
    pedidosPendentes,
    pedidosEmRota,
    pedidosEntregues,
    faturamentoHoje,
    ticketMedio
  }
}
