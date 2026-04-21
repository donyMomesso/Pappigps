import "server-only"

import { mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import os from "node:os"

const LOCAL_DATA_DIR = join(process.cwd(), ".data")

function cloneSeed<T>(seed: T): T {
  return JSON.parse(JSON.stringify(seed)) as T
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
