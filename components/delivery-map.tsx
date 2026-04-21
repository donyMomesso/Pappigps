"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Search, MapPin, Navigation, X } from "lucide-react"

const LAT_ORIGEM = -22.955
const LNG_ORIGEM = -47.095
const ORIGEM_LATLNG = L.latLng(LAT_ORIGEM, LNG_ORIGEM)

const CONFIG_RAIOS = [
  { km: 1, taxa: "R$ 5,00", cor: "#2ecc71" },
  { km: 2, taxa: "R$ 7,00", cor: "#27ae60" },
  { km: 3, taxa: "R$ 10,00", cor: "#f1c40f" },
  { km: 4, taxa: "R$ 15,00", cor: "#f39c12" },
  { km: 5, taxa: "R$ 17,00", cor: "#e67e22" },
  { km: 6, taxa: "R$ 18,00", cor: "#d35400" },
  { km: 7, taxa: "R$ 20,00", cor: "#e74c3c" },
  { km: 8, taxa: "R$ 22,00", cor: "#c0392b" },
  { km: 9, taxa: "R$ 24,00", cor: "#9b59b6" },
  { km: 10, taxa: "R$ 26,00", cor: "#8e44ad" },
]

const LISTA_BAIRROS = [
  { bairro: "Núcleo Residencial Jardim Santa Lucia", apelido: "Santa Lucia", taxa: "R$12,00" },
  { bairro: "JARDIM DAS BANDEIRAS", taxa: "R$5,00" },
  { bairro: "Parque São Paulo", taxa: "R$7,00" },
  { bairro: "Jardim Santa Eudóxia", taxa: "R$15,00" },
  { bairro: "JARDIM DAS BANDEIRAS II", taxa: "R$5,00" },
  { bairro: "Jardim Capivari", taxa: "R$7,00" },
  { bairro: "Guanabara II", taxa: "R$15,00" },
  { bairro: "Vila Mimosa", taxa: "R$5,00" },
  { bairro: "Jardim Nova Banderantes", taxa: "R$7,00" },
  { bairro: "Jd Aeroporto", taxa: "R$15,00" },
  { bairro: "Santa Marta", taxa: "R$5,00" },
  { bairro: "Jardim Novo Campos Eliseo", taxa: "R$8,00" },
  { bairro: "Jardim Ipausurama", taxa: "R$15,00" },
  { bairro: "Jardim Conceição", taxa: "R$5,00" },
  { bairro: "Parque Industrial", taxa: "R$8,00" },
  { bairro: "Bonfim", taxa: "R$15,00" },
  { bairro: "Jd Santa Amalia", taxa: "R$5,00" },
  { bairro: "Jardim do Trevo", taxa: "R$8,00" },
  { bairro: "Jardim Aurélia", taxa: "R$15,00" },
  { bairro: "Chacara Campos Eliseo", taxa: "R$5,00" },
  { bairro: "Jd marcia", taxa: "R$10,00" },
  { bairro: "Vila Ipê", taxa: "R$15,00" },
  { bairro: "Jardim do Lago II", taxa: "R$5,00" },
  { bairro: "Parque Italia", taxa: "R$10,00" },
  { bairro: "Jardim IV Centenário", taxa: "R$15,00" },
  { bairro: "Country Ville", taxa: "R$5,00" },
  { bairro: "São Bernardo", taxa: "R$10,00" },
  { bairro: "Jardim Interlagos", taxa: "R$15,00" },
  { bairro: "Lourdes", taxa: "R$5,00" },
  { bairro: "Guanabara", taxa: "R$10,00" },
  { bairro: "Jardim Amazonas", taxa: "R$15,00" },
  { bairro: "Jardim Nossa Senhora de loudes", taxa: "R$5,00" },
  { bairro: "Vila Lemos", taxa: "R$10,00" },
  { bairro: "jd londres", taxa: "R$15,00" },
  { bairro: "Jardim Tancredão", taxa: "R$5,00" },
  { bairro: "Vila Santana", taxa: "R$10,00" },
  { bairro: "Vila União", taxa: "R$15,00" },
  { bairro: "Vila Loudes", taxa: "R$5,00" },
  { bairro: "Jd ieda", taxa: "R$10,00" },
  { bairro: "Bosque", taxa: "R$15,00" },
  { bairro: "Jardim Santa Cruz", taxa: "R$5,00" },
  { bairro: "Vila Campos Sales", taxa: "R$10,00" },
  { bairro: "Vila Maria", taxa: "R$15,00" },
  { bairro: "Jardim Aero Continental", taxa: "R$5,00" },
  { bairro: "Parque da Figueira", taxa: "R$10,00" },
  { bairro: "Jardim Magnólia", taxa: "R$15,00" },
  { bairro: "Parque Camboriu", taxa: "R$5,00" },
  { bairro: "Vila Industrial", taxa: "R$10,00" },
  { bairro: "Jardim Santa Odila", taxa: "R$15,00" },
  { bairro: "Jardim do Lago Continuação", taxa: "R$5,00" },
  { bairro: "Cidade Jardim", taxa: "R$10,00" },
  { bairro: "Vila Castelo Branco", taxa: "R$15,00" },
  { bairro: "Jardim Icaraí", taxa: "R$5,00" },
  { bairro: "Jardim Miranda", taxa: "R$10,00" },
  { bairro: "Cambuí", taxa: "R$15,00" },
  { bairro: "santa rita de cassia", taxa: "R$5,00" },
  { bairro: "Vila Itapura", taxa: "R$10,00" },
  { bairro: "Vila Teixeira", taxa: "R$15,00" },
  { bairro: "Jardim São José", taxa: "R$5,00" },
  { bairro: "Parque Prado", taxa: "R$10,00" },
  { bairro: "Vila Padre manoel da Nobrega", taxa: "R$15,00" },
  { bairro: "Jardim Iraja", taxa: "R$5,00" },
  { bairro: "Swiss Park", taxa: "R$10,00" },
  { bairro: "Jardim Bandeirantes", taxa: "R$15,00" },
  { bairro: "Jardim noemia", taxa: "R$5,00" },
  { bairro: "Jardim Nova Europa", taxa: "R$10,00" },
  { bairro: "Jardim Pacaembu", taxa: "R$15,00" },
  { bairro: "Jardim stela", taxa: "R$5,00" },
  { bairro: "Jardim Leonor", taxa: "R$10,00" },
  { bairro: "Botafogo", taxa: "R$15,00" },
  { bairro: "Parque Oziel", taxa: "R$7,00" },
  { bairro: "Jardim Anchieta", taxa: "R$10,00" },
  { bairro: "Vila Progresso", taxa: "R$15,00" },
  { bairro: "Santa Terezinha", taxa: "R$7,00" },
  { bairro: "Vila Joaquim Inácio", taxa: "R$10,00" },
  { bairro: "Jardim Santa Judith", taxa: "R$15,00" },
  { bairro: "Vila São Paulo", taxa: "R$7,00" },
  { bairro: "Fundação da Casa Popular", taxa: "R$10,00" },
  { bairro: "Jardim Nova America", taxa: "R$15,00" },
  { bairro: "Jd Paraiso de viracopos", taxa: "R$7,00" },
  { bairro: "Vila Marieta", taxa: "R$10,00" },
  { bairro: "Vila Proost de Sousa", taxa: "R$15,00" },
  { bairro: "Vila Pompeia", taxa: "R$7,00" },
  { bairro: "Jardim Paulistano", taxa: "R$10,00" },
  { bairro: "Jd São Gabriel", taxa: "R$17,00" },
  { bairro: "Jardim Campos Eliseo", taxa: "R$7,00" },
  { bairro: "Parque São Martinho", taxa: "R$10,00" },
  { bairro: "Nova Campinas", taxa: "R$17,00" },
  { bairro: "Vila Rica", taxa: "R$7,00" },
  { bairro: "JD itatinga", taxa: "R$7,00" },
  { bairro: "JD Pauliceia", taxa: "R$12,00" },
  { bairro: "Jardim San Diego", taxa: "R$7,00" },
  { bairro: "Centro", taxa: "R$13,00" },
  { bairro: "Jd Morumbi", taxa: "R$7,00" },
  { bairro: "Jd Dom Vieira", taxa: "R$13,00" },
  { bairro: "Jd Gleba", taxa: "R$7,00" },
  { bairro: "Ponte Preta", taxa: "R$15,00" },
  { bairro: "Jd Telesp", taxa: "R$7,00" },
  { bairro: "vl perceu de barros", taxa: "R$15,00" },
  { bairro: "Monte Cristo", taxa: "R$7,00" },
  { bairro: "Jardim Planalto", taxa: "R$15,00" },
  { bairro: "Jardim Nova Mercedes", taxa: "R$7,00" },
  { bairro: "Jardim Primavera", taxa: "R$15,00" },
  { bairro: "Casinha Bradesco", taxa: "R$7,00" },
  { bairro: "Jardim do Vovô", taxa: "R$15,00" },
  { bairro: "Jd Nova California", taxa: "R$7,00" },
  { bairro: "Vila IAPI", taxa: "R$15,00" },
  { bairro: "Parque das Camelias", taxa: "R$7,00" },
  { bairro: "Jardim Petropolis", taxa: "R$15,00" },
  { bairro: "Mingone", taxa: "R$7,00" },
  { bairro: "Vila Aurocan", taxa: "R$15,00" },
  { bairro: "Indianópolis", taxa: "R$7,00" },
  { bairro: "Jardim das Oliveiras", taxa: "R$15,00" },
  { bairro: "Jardim do Lago", taxa: "R$7,00" },
  { bairro: "Parque Jambeiro", taxa: "R$15,00" },
  { bairro: "Jardim do Lago 1", taxa: "R$7,00" },
  { bairro: "Jardim Proença", taxa: "R$15,00" },
]

interface TaxaCalculada {
  km: string
  taxa: string
  status: "dentro" | "fora"
}

interface Bairro {
  bairro: string
  apelido?: string
  taxa: string
}

function calcularTaxaNova(map: L.Map, lat: number, lng: number): TaxaCalculada {
  const distanciaKm = map.distance(ORIGEM_LATLNG, L.latLng(lat, lng)) / 1000
  const anelIndex = Math.ceil(distanciaKm) - 1

  if (distanciaKm > 10) {
    return { km: distanciaKm.toFixed(1), taxa: "Fora de Área", status: "fora" }
  }
  const taxaCalculada = anelIndex >= 0 ? CONFIG_RAIOS[anelIndex].taxa : CONFIG_RAIOS[0].taxa
  return { km: distanciaKm.toFixed(1), taxa: taxaCalculada, status: "dentro" }
}

function normalizarBusca(str: string): string {
  if (!str) return ""
  let limpo = str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
  limpo = limpo.replace(/\bjd\b/g, "jardim")
  limpo = limpo.replace(/\bsta\b/g, "santa")
  limpo = limpo.replace(/\bsto\b/g, "santo")
  limpo = limpo.replace(/\bvl\b/g, "vila")
  limpo = limpo.replace(/\bpq\b/g, "parque")
  limpo = limpo.replace(/\bch\b/g, "chacara")
  limpo = limpo.replace(/\bres\b/g, "residencial")
  return limpo
}

export function DeliveryMap() {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const marcadorRef = useRef<L.Marker | null>(null)
  const [termoBusca, setTermoBusca] = useState("")
  const [resultados, setResultados] = useState<Bairro[]>([])
  const [mostrarResultados, setMostrarResultados] = useState(false)
  const [status, setStatus] = useState("")
  const [carregando, setCarregando] = useState(false)

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    const map = L.map(mapContainerRef.current, { zoomControl: false }).setView([LAT_ORIGEM, LNG_ORIGEM], 12)
    L.control.zoom({ position: "bottomright" }).addTo(map)
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(map)

    CONFIG_RAIOS.forEach((raio) => {
      L.circle([LAT_ORIGEM, LNG_ORIGEM], {
        color: raio.cor,
        weight: 1.5,
        fillOpacity: 0,
        radius: raio.km * 1000,
        dashArray: "5, 5",
        opacity: 0.6,
      }).addTo(map)
    })

    const iconePizzaria = L.icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/3595/3595458.png",
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    })
    L.marker([LAT_ORIGEM, LNG_ORIGEM], { icon: iconePizzaria }).addTo(map).bindPopup("<b>Pappi Pizza</b>")

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  const exibirPino = useCallback(
    (lat: number, lng: number, titulo: string, taxaAntiga: string | null, calc: TaxaCalculada, isGPS = false) => {
      if (!mapRef.current) return

      if (marcadorRef.current) {
        mapRef.current.removeLayer(marcadorRef.current)
      }

      const iconeUrl = isGPS
        ? "https://cdn-icons-png.flaticon.com/512/3203/3203061.png"
        : calc.status === "dentro"
          ? "https://cdn-icons-png.flaticon.com/512/447/447031.png"
          : "https://cdn-icons-png.flaticon.com/512/684/684908.png"

      const iconeDestino = L.icon({
        iconUrl: iconeUrl,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36],
      })

      const taxaAntigaHTML = taxaAntiga ? `<p style="color: #e74c3c; font-weight: bold;">Antiga: ${taxaAntiga}</p>` : ""

      const taxaNovaHTML =
        calc.status === "dentro"
          ? `<span style="color: #27ae60; font-weight: bold; font-size: 18px; background: #eafaf1; padding: 5px; border-radius: 5px; display: inline-block;">Taxa: ${calc.taxa}</span>`
          : `<span style="color: #fff; font-weight: bold; font-size: 16px; background: #c0392b; padding: 5px; border-radius: 5px; display: inline-block;">Fora de Área (+10km)</span>`

      const popupContent = `
        <div style="text-align: center; min-width: 180px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #333; border-bottom: 2px solid #eee; padding-bottom: 5px;">${titulo}</h3>
          <p style="margin: 5px 0; font-size: 14px;">Distância: <b>${calc.km} km</b></p>
          ${taxaAntigaHTML}
          ${taxaNovaHTML}
          <div style="margin-top: 10px; display: flex; gap: 5px; justify-content: center;">
            <a href="https://waze.com/ul?ll=${lat},${lng}&navigate=yes" target="_blank" style="flex: 1; padding: 6px; border-radius: 5px; text-decoration: none; font-size: 12px; font-weight: bold; color: #000; background: #33ccff; display: flex; align-items: center; justify-content: center;">Waze</a>
            <a href="https://maps.google.com/?daddr=${lat},${lng}" target="_blank" style="flex: 1; padding: 6px; border-radius: 5px; text-decoration: none; font-size: 12px; font-weight: bold; color: white; background: #ea4335; display: flex; align-items: center; justify-content: center;">Maps</a>
          </div>
        </div>
      `

      const marcador = L.marker([lat, lng], { icon: iconeDestino }).addTo(mapRef.current).bindPopup(popupContent)

      marcadorRef.current = marcador
      mapRef.current.setView([lat, lng], 15)
      marcador.openPopup()
      setStatus("")
    },
    []
  )

  const handleBusca = (termo: string) => {
    setTermoBusca(termo)
    const termoTraduzido = normalizarBusca(termo)

    if (termoTraduzido.length < 2) {
      setResultados([])
      setMostrarResultados(false)
      return
    }

    setMostrarResultados(true)
    const palavrasDigitadas = termoTraduzido.split(/\s+/)

    const filtrados = LISTA_BAIRROS.filter((b) => {
      const nomeBairroBase = normalizarBusca(b.bairro)
      const nomeApelido = b.apelido ? normalizarBusca(b.apelido) : ""
      return palavrasDigitadas.every((palavra) => nomeBairroBase.includes(palavra) || nomeApelido.includes(palavra))
    })

    setResultados(filtrados)
  }

  const focarNoBairro = async (nomeBairro: string, taxaAntiga: string) => {
    if (!mapRef.current) return

    setTermoBusca(nomeBairro)
    setMostrarResultados(false)
    setStatus("A carregar local...")
    setCarregando(true)

    try {
      const query = encodeURIComponent(`${nomeBairro}, Campinas, SP`)
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`)
      const data = await res.json()

      if (data && data[0]) {
        const lat = parseFloat(data[0].lat)
        const lng = parseFloat(data[0].lon)
        const calc = calcularTaxaNova(mapRef.current, lat, lng)
        exibirPino(lat, lng, nomeBairro, taxaAntiga, calc)
      } else {
        setStatus("Local não encontrado no mapa.")
      }
    } catch {
      setStatus("Erro ao buscar localização.")
    } finally {
      setCarregando(false)
    }
  }

  const buscarSatelite = async () => {
    if (!mapRef.current || !termoBusca) return

    setMostrarResultados(false)
    setStatus("Procurando no mapa...")
    setCarregando(true)

    try {
      const enderecoTraduzido = normalizarBusca(termoBusca)
      const query = encodeURIComponent(`${enderecoTraduzido}, Campinas, SP, Brasil`)
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`)
      const data = await res.json()

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat)
        const lng = parseFloat(data[0].lon)
        const calc = calcularTaxaNova(mapRef.current, lat, lng)
        const nomeFormatado = data[0].display_name.split(",")[0]
        exibirPino(lat, lng, nomeFormatado, null, calc)
      } else {
        setStatus("Endereço não encontrado em Campinas.")
      }
    } catch {
      setStatus("Verifique a sua ligação à internet.")
    } finally {
      setCarregando(false)
    }
  }

  const obterLocalizacao = () => {
    if (!mapRef.current) return

    setStatus("A ligar o GPS...")
    setCarregando(true)

    if (!navigator.geolocation) {
      setStatus("O seu dispositivo não suporta GPS.")
      setCarregando(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!mapRef.current) return
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        const calc = calcularTaxaNova(mapRef.current, lat, lng)
        exibirPino(lat, lng, "A minha posição atual", null, calc, true)
        setCarregando(false)
      },
      () => {
        setStatus("Não foi possível aceder ao GPS. Verifique se a localização está ligada.")
        setCarregando(false)
      },
      { enableHighAccuracy: true }
    )
  }

  const limparBusca = () => {
    setTermoBusca("")
    setResultados([])
    setMostrarResultados(false)
  }

  return (
    <div className="relative h-screen w-full">
      {/* Mapa */}
      <div ref={mapContainerRef} className="h-full w-full" />

      {/* Painel de busca */}
      <div className="absolute top-3 left-1/2 z-[1000] w-[90%] max-w-[400px] -translate-x-1/2 rounded-xl border-t-4 border-t-orange-500 bg-white p-4 shadow-xl">
        <h2 className="mb-3 text-center text-lg font-bold text-orange-500">
          GPS <span className="text-blue-600">Pappi</span> <span className="text-orange-500">Pizza</span>
        </h2>

        {/* Campo de busca */}
        <div className="relative">
          <Search className="absolute top-1/2 left-3 z-10 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={termoBusca}
            onChange={(e) => handleBusca(e.target.value)}
            placeholder="Ex: jd bandeira, sta lucia..."
            className="relative z-0 w-full rounded-lg border-2 border-gray-200 bg-white py-3 pr-10 pl-10 text-base outline-none transition-colors focus:border-orange-500"
          />
          {termoBusca && (
            <button
              onClick={limparBusca}
              className="absolute top-1/2 right-3 z-10 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Lista de resultados */}
        {mostrarResultados && (
          <ul className="mt-1 max-h-[200px] w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
            {resultados.map((b, i) => (
              <li
                key={i}
                onClick={() => focarNoBairro(b.bairro, b.taxa)}
                className="cursor-pointer border-b border-gray-100 px-3 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500"
              >
                <span className="font-semibold">{b.bairro}</span>
                {b.apelido && <span className="mt-0.5 block text-xs text-gray-500">(Popular: {b.apelido})</span>}
              </li>
            ))}
            {termoBusca.length >= 2 && (
              <li
                onClick={buscarSatelite}
                className="cursor-pointer border-t-2 border-gray-100 bg-orange-50 px-3 py-3 text-sm font-bold text-orange-500"
              >
                <Navigation className="mr-1 inline h-4 w-4" />
                Buscar &quot;{termoBusca}&quot; no mapa...
              </li>
            )}
          </ul>
        )}

        {/* Botão GPS */}
        <button
          onClick={obterLocalizacao}
          disabled={carregando}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-green-500 bg-green-50 py-2.5 text-sm font-bold text-green-600 transition-colors hover:bg-green-500 hover:text-white active:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <MapPin className="h-5 w-5" />
          {carregando ? "Carregando..." : "Onde eu estou agora?"}
        </button>

        {/* Status */}
        {status && <p className="mt-2 text-center text-xs font-bold text-orange-500">{status}</p>}
      </div>
    </div>
  )
}
