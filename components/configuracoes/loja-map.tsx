"use client"

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Circle, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Coordenadas } from '@/types'

const lojaIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

interface MapClickHandlerProps {
  onCoordenadasChange: (lat: number, lng: number) => void
}

function MapClickHandler({ onCoordenadasChange }: MapClickHandlerProps) {
  useMapEvents({
    click: (e) => {
      onCoordenadasChange(e.latlng.lat, e.latlng.lng)
    }
  })
  return null
}

function RecenterMap({ coordenadas }: { coordenadas: Coordenadas }) {
  const map = useMap()

  useEffect(() => {
    map.setView([coordenadas.latitude, coordenadas.longitude], map.getZoom())
  }, [coordenadas.latitude, coordenadas.longitude, map])

  return null
}

interface LojaMapProps {
  coordenadas: Coordenadas
  raioKm: number
  onCoordenadasChange: (lat: number, lng: number) => void
}

export default function LojaMap({ coordenadas, raioKm, onCoordenadasChange }: LojaMapProps) {
  const position: [number, number] = [coordenadas.latitude, coordenadas.longitude]
  const raioMetros = raioKm * 1000

  return (
    <div className="h-[400px] rounded-lg overflow-hidden border">
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <RecenterMap coordenadas={coordenadas} />
        <MapClickHandler onCoordenadasChange={onCoordenadasChange} />

        <Marker position={position} icon={lojaIcon} />

        <Circle
          center={position}
          radius={raioMetros}
          pathOptions={{
            color: '#10b981',
            fillColor: '#10b981',
            fillOpacity: 0.1,
            weight: 2
          }}
        />
      </MapContainer>
    </div>
  )
}
