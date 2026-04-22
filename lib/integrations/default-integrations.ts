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
      webhookEvents: [],
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
      webhookEvents: [],
      status: "desconectado"
    },
    {
      id: "cardapioweb_001",
      nome: "CardapioWeb",
      plataforma: "outro",
      ativo: false,
      storeId: process.env.CARDAPIO_WEB_STORE_ID || "5371",
      apiKey: process.env.CARDAPIO_WEB_TOKEN || "",
      webhookUrl: `${baseUrl}/api/webhooks/cardapioweb`,
      webhookEvents: [],
      status: "desconectado"
    }
  ]
}
