"use client"

import { useEffect, useRef } from "react"
import type { Loja, Pedido } from "@/types"

interface RouteMapProps {
  loja: Loja
  pedidos: Pedido[]
  selectedPedidos: string[]
}

export function RouteMap({ loja, pedidos, selectedPedidos }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return
    const mapElement = mapRef.current

    // Dynamically import Leaflet to avoid SSR issues
    const initMap = async () => {
      const L = (await import("leaflet")).default
      await import("leaflet/dist/leaflet.css")

      // Clean up existing map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
      }

      // Initialize map centered on the store location
      const map = L.map(mapElement, {
        center: [loja.coordenadas.latitude, loja.coordenadas.longitude],
        zoom: 13,
      })

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map)

      // Add store marker as origin point
      const storeIcon = L.divIcon({
        className: "store-marker",
        html: `<div style="width: 40px; height: 40px; border-radius: 50%; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 16px; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">🏪</div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      })

      L.marker([loja.coordenadas.latitude, loja.coordenadas.longitude], { icon: storeIcon })
        .addTo(map)
        .bindPopup(`<div style="font-family: system-ui; min-width: 150px;"><strong>${loja.nome}</strong><br/><small>PONTO DE ORIGEM</small><br/><small>${loja.endereco.logradouro}, ${loja.endereco.numero}</small></div>`)

      // Add markers for pedidos
      pedidos.forEach((pedido, index) => {
        if (pedido.endereco.latitude && pedido.endereco.longitude) {
          const isSelected = selectedPedidos.includes(pedido.id)

const markerHtml = `<div style="width: 32px; height: 32px; border-radius: 50%; background: ${isSelected ? "var(--success)" : "var(--border)"}; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">${index + 1}</div>`

          const icon = L.divIcon({
            className: "custom-marker",
            html: markerHtml,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          })

          L.marker([pedido.endereco.latitude, pedido.endereco.longitude], { icon })
            .addTo(map)
            .bindPopup(`<div style="font-family: system-ui; min-width: 150px;"><strong>${pedido.numero}</strong><br/>${pedido.cliente.nome}<br/><small>${pedido.endereco.logradouro}, ${pedido.endereco.numero}</small></div>`)
        }
      })

      // Draw route line if we have selected pedidos
      if (selectedPedidos.length > 0) {
        // Start route from store location
        const routeCoords: [number, number][] = [
          [loja.coordenadas.latitude, loja.coordenadas.longitude]
        ]

        // Add selected delivery points
        selectedPedidos.forEach(id => {
          const pedido = pedidos.find(p => p.id === id)
          if (pedido?.endereco.latitude && pedido?.endereco.longitude) {
            routeCoords.push([pedido.endereco.latitude, pedido.endereco.longitude])
          }
        })

        if (routeCoords.length > 1) {
          L.polyline(routeCoords, {
              color: "var(--primary)",
          }).addTo(map)

          // Fit map to show entire route
          const bounds = L.latLngBounds(routeCoords)
          map.fitBounds(bounds, { padding: [20, 20] })
        }
      }

      mapInstanceRef.current = map
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [loja, pedidos, selectedPedidos])

  return (
    <div
      ref={mapRef}
      className="w-full h-full min-h-[400px] rounded-lg"
      style={{ background: "var(--background)" }}
    />
  )
}
