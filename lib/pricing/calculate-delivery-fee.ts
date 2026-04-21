import { calculateDistanceKm } from "@/lib/maps/distance"
import type { Coordenadas, Loja } from "@/types"

export function calculateDeliveryFee(loja: Loja, destino: Coordenadas) {
  const distanciaKm = calculateDistanceKm(loja.coordenadas, destino)
  const valorTotal = loja.taxaEntregaBase + distanciaKm * loja.taxaPorKm

  return {
    distanciaKm: Number(distanciaKm.toFixed(2)),
    valorBase: loja.taxaEntregaBase,
    valorPorKm: loja.taxaPorKm,
    valorTotal: Number(valorTotal.toFixed(2))
  }
}
