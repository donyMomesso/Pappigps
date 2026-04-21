import type { IntegracaoPlataforma } from "@/types"

export function getDefaultIntegrations(): IntegracaoPlataforma[] {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  return [
    {
      id: "ifood_001",
      nome: "iFood",
      plataforma: "ifood",
      ativo: false,
      storeId: "",
      apiKey: "",
      webhookUrl: `${baseUrl}/api/webhooks/ifood`,
      status: "desconectado"
    },
    {
      id: "99food_001",
      nome: "99Food",
      plataforma: "99food",
      ativo: false,
      storeId: "",
      apiKey: "",
      webhookUrl: `${baseUrl}/api/webhooks/99food`,
      status: "desconectado"
    },
    {
      id: "cardapio_web_001",
      nome: "Cardápio Web",
      plataforma: "outro",
      ativo: false,
      storeId: process.env.CARDAPIO_WEB_PEDIDOS_URL || process.env.CARDAPIO_WEB_URL || "",
      apiKey: process.env.CARDAPIO_WEB_TOKEN || "",
      webhookUrl: `${baseUrl}/api/pedidos`,
      status: "desconectado"
    }
  ]
}
