export function generateAccessCode() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export function generateTrackingToken() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`
}
