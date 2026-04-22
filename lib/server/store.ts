import "server-only"

import { mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import os from "node:os"

const LOCAL_DATA_DIR = join(process.cwd(), ".data")
const KV_REST_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
const KV_REST_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
const KV_NAMESPACE = process.env.PAPPI_STORE_NAMESPACE || "pappi"

function cloneSeed<T>(seed: T): T {
  return JSON.parse(JSON.stringify(seed)) as T
}

function hasRemoteStore() {
  return Boolean(KV_REST_URL && KV_REST_TOKEN)
}

function getRemoteKey(name: string) {
  return `${KV_NAMESPACE}:${name}`
}

async function runRemoteCommand(command: unknown[]) {
  if (!KV_REST_URL || !KV_REST_TOKEN) {
    throw new Error("Remote store não configurada")
  }

  const response = await fetch(KV_REST_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KV_REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Falha ao acessar KV remota: ${response.status}`)
  }

  const payload = (await response.json()) as { result?: unknown; error?: string }

  if (payload.error) {
    throw new Error(payload.error)
  }

  return payload.result
}

async function readRemoteStore<T>(name: string) {
  const result = await runRemoteCommand(["GET", getRemoteKey(name)])

  if (typeof result !== "string" || !result.trim()) {
    return null
  }

  return JSON.parse(result) as T
}

async function writeRemoteStore<T>(name: string, data: T) {
  await runRemoteCommand(["SET", getRemoteKey(name), JSON.stringify(data)])
}

async function ensureDir(filePath: string) {
  await mkdir(dirname(filePath), { recursive: true })
}

async function getDataDir() {
  try {
    await mkdir(LOCAL_DATA_DIR, { recursive: true })
    return LOCAL_DATA_DIR
  } catch {
    const tmpDataDir = join(os.tmpdir(), "pappigps-data")
    await mkdir(tmpDataDir, { recursive: true })
    return tmpDataDir
  }
}

export async function readOrCreateStore<T>(name: string, seed: T): Promise<T> {
  if (hasRemoteStore()) {
    const remoteData = await readRemoteStore<T>(name)

    if (remoteData !== null) {
      return remoteData
    }

    const initial = cloneSeed(seed)
    await writeRemoteStore(name, initial)
    return initial
  }

  const dataDir = await getDataDir()
  const filePath = join(dataDir, name)

  try {
    const content = await readFile(filePath, "utf-8")
    return JSON.parse(content) as T
  } catch {
    const initial = cloneSeed(seed)
    await ensureDir(filePath)
    await writeFile(filePath, JSON.stringify(initial, null, 2), "utf-8")
    return initial
  }
}

export async function writeStore<T>(name: string, data: T) {
  if (hasRemoteStore()) {
    await writeRemoteStore(name, data)
    return
  }

  const dataDir = await getDataDir()
  const filePath = join(dataDir, name)
  await ensureDir(filePath)
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8")
}

export async function updateStore<T>(name: string, seed: T, updater: (data: T) => T | Promise<T>) {
  const current = await readOrCreateStore(name, seed)
  const next = await updater(current)
  await writeStore(name, next)
  return next
}
