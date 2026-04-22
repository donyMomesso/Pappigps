import "server-only"

import { mockConfiguracoes, mockEntregadores, mockLoja, mockPedidos, mockRotas } from "@/mocks/data"
import type { Configuracoes, Entregador, IntegracaoPlataforma, Loja, Pedido, Rota } from "@/types"
import { getDefaultIntegrations } from "@/lib/integrations/default-integrations"
import { readOrCreateStore, updateStore, writeStore } from "@/lib/server/store"

const ENTREGADORES_FILE = "entregadores.json"
const ROTAS_FILE = "rotas.json"
const CONFIG_FILE = "configuracoes.json"
const INTEGRATIONS_FILE = "integrations.json"
const PEDIDOS_FILE = "pedidos.json"

export async function getEntregadores() {
  return readOrCreateStore<Entregador[]>(ENTREGADORES_FILE, mockEntregadores)
}

export async function saveEntregadores(entregadores: Entregador[]) {
  await writeStore(ENTREGADORES_FILE, entregadores)
}

export async function getEntregadorById(id: string) {
  const entregadores = await getEntregadores()
  return entregadores.find((entregador) => entregador.id === id) || null
}

export async function updateEntregador(id: string, updater: (entregador: Entregador) => Entregador) {
  let updated: Entregador | null = null

  const entregadores = await updateStore<Entregador[]>(ENTREGADORES_FILE, mockEntregadores, (current) =>
    current.map((entregador) => {
      if (entregador.id !== id) return entregador
      updated = updater(entregador)
      return updated
    })
  )

  return updated || entregadores.find((entregador) => entregador.id === id) || null
}

export async function addEntregador(entregador: Entregador) {
  return updateStore<Entregador[]>(ENTREGADORES_FILE, mockEntregadores, (current) => [entregador, ...current])
}

export async function getRotas() {
  return readOrCreateStore<Rota[]>(ROTAS_FILE, mockRotas)
}

export async function saveRotas(rotas: Rota[]) {
  await writeStore(ROTAS_FILE, rotas)
}

export async function updateRotas(updater: (rotas: Rota[]) => Rota[] | Promise<Rota[]>) {
  return updateStore<Rota[]>(ROTAS_FILE, mockRotas, updater)
}

export async function addRota(rota: Rota) {
  return updateStore<Rota[]>(ROTAS_FILE, mockRotas, (current) => [rota, ...current])
}

export async function getConfiguracoes() {
  return readOrCreateStore<Configuracoes>(CONFIG_FILE, mockConfiguracoes)
}

export async function saveConfiguracoes(configuracoes: Configuracoes) {
  await writeStore(CONFIG_FILE, configuracoes)
}

export async function getLoja() {
  const configuracoes = await getConfiguracoes()
  return configuracoes.loja
}

export async function getIntegrations() {
  return readOrCreateStore<IntegracaoPlataforma[]>(INTEGRATIONS_FILE, getDefaultIntegrations())
}

export async function saveIntegrations(integrations: IntegracaoPlataforma[]) {
  await writeStore(INTEGRATIONS_FILE, integrations)
}

export async function getPedidosStore() {
  return readOrCreateStore<Pedido[]>(PEDIDOS_FILE, [])
}

export async function savePedidosStore(pedidos: Pedido[]) {
  await writeStore(PEDIDOS_FILE, pedidos)
}

export async function upsertPedido(pedido: Pedido) {
  return updateStore<Pedido[]>(PEDIDOS_FILE, [], (current) => {
    const existingIndex = current.findIndex(
      (item) => item.id === pedido.id || item.numero === pedido.numero
    )

    if (existingIndex >= 0) {
      const next = [...current]
      next[existingIndex] = {
        ...next[existingIndex],
        ...pedido,
      }
      return next
    }

    return [pedido, ...current]
  })
}

export async function getPedidosSeed() {
  return mockPedidos
}

export function getDefaultLoja(): Loja {
  return mockLoja
}
