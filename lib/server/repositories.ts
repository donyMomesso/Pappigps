import "server-only"

import { mockConfiguracoes, mockEntregadores, mockLoja, mockRotas } from "@/mocks/data"
import type { Configuracoes, Entregador, IntegracaoPlataforma, Loja, Rota } from "@/types"
import { getDefaultIntegrations } from "@/lib/integrations/default-integrations"
import { readOrCreateStore, updateStore, writeStore } from "@/lib/server/store"

const ENTREGADORES_FILE = "entregadores.json"
const ROTAS_FILE = "rotas.json"
const CONFIG_FILE = "configuracoes.json"
const INTEGRATIONS_FILE = "integrations.json"

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

export function getDefaultLoja(): Loja {
  return mockLoja
}
