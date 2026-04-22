"use client"

import { MapContainer, Marker, Popup, TileLayer, Polyline } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { Entregador, Loja, Pedido } from "@/types"

const storeIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const customerIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const driverIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

export function TrackingMap({
  loja,
  pedido,
  entregador,
}: {
  loja: Loja
  pedido: Pedido
  entregador: Pick<Entregador, "nome" | "localizacaoAtual"> | null
}) {
  const lojaPosition: [number, number] = [loja.coordenadas.latitude, loja.coordenadas.longitude]
  const customerPosition: [number, number] | null =
    pedido.endereco.latitude && pedido.endereco.longitude
      ? [pedido.endereco.latitude, pedido.endereco.longitude]
      : null
  const driverPosition: [number, number] | null = entregador?.localizacaoAtual
    ? [
        entregador.localizacaoAtual.coordenadas.latitude,
        entregador.localizacaoAtual.coordenadas.longitude,
      ]
    : null

  const routePoints = [lojaPosition, driverPosition, customerPosition].filter(Boolean) as [number, number][]
  const center = driverPosition || customerPosition || lojaPosition

  return (
    <div className="h-[320px] overflow-hidden rounded-xl border">
      <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={lojaPosition} icon={storeIcon}>
          <Popup>{loja.nome}</Popup>
        </Marker>
        {customerPosition && (
          <Marker position={customerPosition} icon={customerIcon}>
            <Popup>
              {pedido.cliente.nome}
              <br />
              Destino da entrega
            </Popup>
          </Marker>
        )}
        {driverPosition && (
          <Marker position={driverPosition} icon={driverIcon}>
            <Popup>
              {entregador?.nome}
              <br />
              Entregador em rota
            </Popup>
          </Marker>
        )}
        {routePoints.length > 1 && <Polyline positions={routePoints} color="#16A34A" weight={3} />}
      </MapContainer>
    </div>
  )
}
