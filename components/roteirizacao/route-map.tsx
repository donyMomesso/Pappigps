"use client"

import { useEffect, useRef } from "react"
import type { Pedido } from "@/types"

interface RouteMapProps {
  pedidos: Pedido[]
  selectedPedidos: string[]
}

export function RouteMap({ pedidos, selectedPedidos }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return

    // Dynamically import Leaflet to avoid SSR issues
    const initMap = async () => {
      const L = (await import("leaflet")).default
      await import("leaflet/dist/leaflet.css")

      // Clean up existing map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
      }

      // Initialize map centered on São Paulo
      const map = L.map(mapRef.current!, {
        center: [-23.5505, -46.6333],
        zoom: 13,
      })

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map)

      // Add markers for pedidos
      pedidos.forEach((pedido, index) => {
        if (pedido.endereco.latitude && pedido.endereco.longitude) {
          const isSelected = selectedPedidos.includes(pedido.id)
          
          const icon = L.divIcon({
            className: "custom-marker",
            html: `
              <div style="
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: ${isSelected ? "#059669" : "#71717a"};
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 14px;
                border: 3px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              ">
                ${index + 1}
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          })

          L.marker([pedido.endereco.latitude, pedido.endereco.longitude], { icon })
            .addTo(map)
            .bindPopup(`
              <div style="font-family: system-ui; min-width: 150px;">
                <strong>${pedido.numero}</strong><br/>
                ${pedido.cliente.nome}<br/>
                <small>${pedido.endereco.logradouro}, ${pedido.endereco.numero}</small>
              </div>
            `)
        }
      })

      // Draw route line if we have selected pedidos
      if (selectedPedidos.length > 1) {
        const routeCoords = selectedPedidos
          .map(id => pedidos.find(p => p.id === id))
          .filter(p => p?.endereco.latitude && p?.endereco.longitude)
          .map(p => [p!.endereco.latitude!, p!.endereco.longitude!] as [number, number])

        if (routeCoords.length > 1) {
          L.polyline(routeCoords, {
            color: "#059669",
            weight: 4,
            opacity: 0.8,
          }).addTo(map)
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
  }, [pedidos, selectedPedidos])

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full min-h-[400px] rounded-lg"
      style={{ background: "#e5e7eb" }}
    />
  )
}
