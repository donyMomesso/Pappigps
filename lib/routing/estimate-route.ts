import { calculateDistanceKm } from "@/lib/maps/distance"
import type { Loja, Pedido } from "@/types"

const AVG_SPEED_KMH = 28
const STOP_TIME_MINUTES = 6

export function estimateRoute(loja: Loja, pedidos: Pedido[]) {
  let totalDistance = 0
  let previous = loja.coordenadas

  for (const pedido of pedidos) {
    if (pedido.endereco.latitude && pedido.endereco.longitude) {
      const current = {
        latitude: pedido.endereco.latitude,
        longitude: pedido.endereco.longitude
      }
      totalDistance += calculateDistanceKm(previous, current)
      previous = current
    }
  }

  const drivingTime = totalDistance > 0 ? (totalDistance / AVG_SPEED_KMH) * 60 : 0
  const totalTime = drivingTime + pedidos.length * STOP_TIME_MINUTES

  return {
    distanciaTotal: Number(totalDistance.toFixed(2)),
    tempoEstimado: Math.max(Math.round(totalTime), pedidos.length * STOP_TIME_MINUTES)
  }
}
