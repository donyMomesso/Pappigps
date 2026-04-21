import "server-only"

import { mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"

const DATA_DIR = join(process.cwd(), ".data")

function cloneSeed<T>(seed: T): T {
  return JSON.parse(JSON.stringify(seed)) as T
}

async function ensureDir(filePath: string) {
  await mkdir(dirname(filePath), { recursive: true })
}

export async function readOrCreateStore<T>(name: string, seed: T): Promise<T> {
  const filePath = join(DATA_DIR, name)

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
  const filePath = join(DATA_DIR, name)
  await ensureDir(filePath)
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8")
}

export async function updateStore<T>(name: string, seed: T, updater: (data: T) => T | Promise<T>) {
  const current = await readOrCreateStore(name, seed)
  const next = await updater(current)
  await writeStore(name, next)
  return next
}
