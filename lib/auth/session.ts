import type { NextRequest, NextResponse } from "next/server"

export type SessionRole = "admin" | "deliverer"

export interface AppSession {
  role: SessionRole
  userId: string
  name: string
  createdAt: string
}

export const SESSION_COOKIE_NAME = "pappigps_session"

export function encodeSession(session: AppSession) {
  return encodeURIComponent(JSON.stringify(session))
}

export function decodeSession(value?: string | null): AppSession | null {
  if (!value) return null

  try {
    return JSON.parse(decodeURIComponent(value)) as AppSession
  } catch {
    return null
  }
}

export function getSessionFromRequest(request: NextRequest) {
  return decodeSession(request.cookies.get(SESSION_COOKIE_NAME)?.value)
}

export function setSessionCookie(response: NextResponse, session: AppSession) {
  response.cookies.set(SESSION_COOKIE_NAME, encodeSession(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12
  })
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  })
}
