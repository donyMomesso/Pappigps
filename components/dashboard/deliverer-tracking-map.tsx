"use client"

import { MapContainer, Marker, Popup, Polyline, TileLayer } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { Entregador, Loja, Rota } from "@/types"

const storeIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
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

const customerIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const fallbackLoja: Loja = {
  id: "fallback",
  nome: "Loja",
  cnpj: "",
  telefone: "",
  email: "",
  endereco: { logradouro: "", numero: "", bairro: "", cidade: "", uf: "", cep: "" },
  coordenadas: { latitude: -23.5489, longitude: -46.6388 },
  horarioOperacao: {
    domingo: { abertura: "00:00", fechamento: "00:00", ativo: false },
    segunda: { abertura: "08:00", fechamento: "18:00", ativo: true },
    terca: { abertura: "08:00", fechamento: "18:00", ativo: true },
    quarta: { abertura: "08:00", fechamento: "18:00", ativo: true },
    quinta: { abertura: "08:00", fechamento: "18:00", ativo: true },
    sexta: { abertura: "08:00", fechamento: "18:00", ativo: true },
    sabado: { abertura: "08:00", fechamento: "12:00", ativo: false },
  },
  raioEntregaKm: 0,
  taxaEntregaBase: 0,
  taxaPorKm: 0,
  diariaEntregador: 0,
}

export function DelivererTrackingMap({
  loja,
  entregadores,
  rotas,
}: {
  loja?: Loja
  entregadores: Entregador[]
  rotas: Rota[]
}) {
  const store = loja ?? fallbackLoja
  const center: [number, number] = [store.coordenadas.latitude, store.coordenadas.longitude]

  return (
    <div className="h-[360px] overflow-hidden rounded-xl border">
      <MapContainer center={center} zoom={12} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={center} icon={storeIcon}>
          <Popup>
            <strong>{store.nome}</strong>
            <br />
            Ponto de origem
          </Popup>
        </Marker>

        {entregadores.map((entregador) => {
          const localizacao = entregador.localizacaoAtual
          if (!localizacao) return null

          return (
            <Marker
              key={entregador.id}
              position={[
                localizacao.coordenadas.latitude,
                localizacao.coordenadas.longitude,
              ]}
              icon={driverIcon}
            >
              <Popup>
                <strong>{entregador.nome}</strong>
                <br />
                {entregador.status === "em_rota" ? "Em rota" : "Disponível"}
              </Popup>
            </Marker>
          )
        })}

        {rotas.map((rota) => {
          const points: [number, number][] = []
          const entregadorCoords = rota.entregador?.localizacaoAtual?.coordenadas

          points.push(center)
          if (entregadorCoords) {
            points.push([entregadorCoords.latitude, entregadorCoords.longitude])
          }

          rota.pedidos.forEach((pedido) => {
            if (pedido.endereco.latitude && pedido.endereco.longitude && pedido.status !== "entregue") {
              points.push([pedido.endereco.latitude, pedido.endereco.longitude])
            }
          })

          return (
            <div key={rota.id}>
              {rota.pedidos.map((pedido) => {
                if (!pedido.endereco.latitude || !pedido.endereco.longitude || pedido.status === "entregue") {
                  return null
                }

                return (
                  <Marker
                    key={pedido.id}
                    position={[pedido.endereco.latitude, pedido.endereco.longitude]}
                    icon={customerIcon}
                  >
                    <Popup>
                      <strong>{pedido.numero}</strong>
                      <br />
                      {pedido.cliente.nome}
                      <br />
                      {pedido.status === "em_rota"
                        ? "A caminho"
                        : pedido.status === "em_preparo"
                          ? "Em preparo"
                          : "Aguardando saída"}
                    </Popup>
                  </Marker>
                )
              })}

              {points.length > 1 && (
                <Polyline
                  positions={points}
                  color={rota.status === "em_andamento" ? "#16A34A" : "#F97316"}
                  weight={3}
                  opacity={0.7}
                />
              )}
            </div>
          )
        })}
      </MapContainer>
    </div>
  )
}
