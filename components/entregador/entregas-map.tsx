"use client"

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Pedido, Loja } from '@/types'
import { formatCurrency } from '@/lib/utils'

// Custom icons
const lojaIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const entregaIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const motoIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

interface LocationUpdaterProps {
  onLocationUpdate: (lat: number, lng: number) => void
}

function LocationUpdater({ onLocationUpdate }: LocationUpdaterProps) {
  const map = useMap()

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          onLocationUpdate(latitude, longitude)
        },
        (error) => {
          console.log('[v0] Geolocation error:', error.message)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5000
        }
      )

      return () => navigator.geolocation.clearWatch(watchId)
    }
  }, [map, onLocationUpdate])

  return null
}

interface EntregasMapProps {
  loja: Loja
  entregas: Pedido[]
  onSelectEntrega?: (entrega: Pedido) => void
}

export default function EntregasMap({ loja, entregas, onSelectEntrega }: EntregasMapProps) {
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null)

  const lojaPosition: [number, number] = [
    loja.coordenadas.latitude,
    loja.coordenadas.longitude
  ]

  const entregaPositions = entregas
    .filter(e => e.endereco.latitude && e.endereco.longitude)
    .map(e => ({
      pedido: e,
      position: [e.endereco.latitude!, e.endereco.longitude!] as [number, number]
    }))

  // Create route polyline points
  const routePoints: [number, number][] = [
    lojaPosition,
    ...(currentLocation ? [currentLocation] : []),
    ...entregaPositions.map(e => e.position)
  ]

  return (
    <div className="h-[300px] rounded-lg overflow-hidden border">
      <MapContainer
        center={currentLocation || lojaPosition}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationUpdater onLocationUpdate={(lat, lng) => setCurrentLocation([lat, lng])} />

        {/* Loja marker */}
        <Marker position={lojaPosition} icon={lojaIcon}>
          <Popup>
            <div className="text-sm">
              <strong className="text-[var(--success)]">{loja.nome}</strong>
              <p className="text-muted-foreground">{loja.endereco.logradouro}, {loja.endereco.numero}</p>
              <p className="text-xs">Ponto de partida</p>
            </div>
          </Popup>
        </Marker>

        {/* Current location marker */}
        {currentLocation && (
          <Marker position={currentLocation} icon={motoIcon}>
            <Popup>
              <div className="text-sm">
                <strong className="text-[var(--primary)]">Sua Localização</strong>
                <p className="text-xs text-muted-foreground">Atualizada em tempo real</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Entregas markers */}
        {entregaPositions.map(({ pedido, position }) => (
          <Marker 
            key={pedido.id} 
            position={position} 
            icon={entregaIcon}
            eventHandlers={{
              click: () => onSelectEntrega?.(pedido)
            }}
          >
            <Popup>
              <div className="text-sm">
                <strong className="text-[var(--destructive)]">Entrega #{pedido.ordemEntrega}</strong>
                <p className="font-medium">{pedido.cliente.nome}</p>
                <p className="text-muted-foreground">
                  {pedido.endereco.logradouro}, {pedido.endereco.numero}
                </p>
                <p className="text-[var(--success)] font-medium mt-1">
                  Taxa: {formatCurrency(pedido.taxaEntrega?.valorTotal || 0)}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Route polyline */}
        {routePoints.length > 1 && (
          <Polyline 
            positions={routePoints}
            color="var(--success)"
            weight={3}
            opacity={0.7}
            dashArray="10, 10"
          />
        )}
      </MapContainer>
    </div>
  )
}
