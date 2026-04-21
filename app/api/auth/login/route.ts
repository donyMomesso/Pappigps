import { NextResponse } from "next/server"
import { setSessionCookie } from "@/lib/auth/session"
import { adminLoginSchema } from "@/lib/validation/schemas"

const DEFAULT_ADMIN_EMAIL = "admin@pappigps.com"
const DEFAULT_ADMIN_PASSWORD = "123456"

export async function POST(request: Request) {
  try {
    const data = adminLoginSchema.parse(await request.json())
    const validEmail = process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL
    const validPassword = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD

    if (data.email !== validEmail || data.password !== validPassword) {
      return NextResponse.json({ error: "E-mail ou senha inválidos" }, { status: 401 })
    }

    const response = NextResponse.json({ success: true, redirectTo: "/dashboard" })
    setSessionCookie(response, {
      role: "admin",
      userId: "admin",
      name: "Administrador",
      createdAt: new Date().toISOString()
    })
    return response
  } catch {
    return NextResponse.json({ error: "Dados de login inválidos" }, { status: 400 })
  }
}
