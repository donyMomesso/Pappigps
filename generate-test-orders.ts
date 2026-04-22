import { mockLoja } from '@/mocks/data'
import { upsertPedido } from '@/lib/server/repositories'
import type { Pedido } from '@/types'

// Function to generate random coordinates within radius
function generateRandomLocation(centerLat: number, centerLng: number, radiusKm: number) {
  const radiusInDegrees = radiusKm / 111.32 // approximate km to degrees
  const u = Math.random()
  const v = Math.random()
  const w = radiusInDegrees * Math.sqrt(u)
  const t = 2 * Math.PI * v
  const x = w * Math.cos(t)
  const y = w * Math.sin(t)

  return {
    latitude: centerLat + y,
    longitude: centerLng + x
  }
}

// Generate 100 test orders
async function generateTestOrders() {
  const centerLat = mockLoja.coordenadas.latitude
  const centerLng = mockLoja.coordenadas.longitude
  const radiusKm = 7

  const orders: Pedido[] = []

  for (let i = 0; i < 100; i++) {
    const location = generateRandomLocation(centerLat, centerLng, radiusKm)

    const order: Pedido = {
      id: `test-order-${i + 1}`,
      numero: `PED${String(i + 1).padStart(3, '0')}`,
      cliente: {
        id: `cliente-${i + 1}`,
        nome: `Cliente Teste ${i + 1}`,
        telefone: `(11) 9${String(Math.floor(Math.random() * 900000000) + 100000000).slice(0, 8)}`,
        email: `cliente${i + 1}@teste.com`,
        endereco: {
          logradouro: `Rua Teste ${i + 1}`,
          numero: String(Math.floor(Math.random() * 1000) + 1),
          bairro: 'Centro',
          cidade: 'São Paulo',
          uf: 'SP',
          cep: '01310-100',
          latitude: location.latitude,
          longitude: location.longitude
        }
      },
      endereco: {
        logradouro: `Rua Teste ${i + 1}`,
        numero: String(Math.floor(Math.random() * 1000) + 1),
        bairro: 'Centro',
        cidade: 'São Paulo',
        uf: 'SP',
        cep: '01310-100',
        latitude: location.latitude,
        longitude: location.longitude
      },
      valor: Math.floor(Math.random() * 50) + 10, // 10-60 reais
      formaPagamento: ['dinheiro', 'pix', 'cartao'][Math.floor(Math.random() * 3)] as any,
      status: 'pendente',
      dataCriacao: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000), // last 24h
      observacoes: `Pedido de teste ${i + 1}`,
      volumes: 1
    }

    orders.push(order)
  }

  // Save orders
  for (const order of orders) {
    await upsertPedido(order)
  }

  console.log(`Generated and saved ${orders.length} test orders within ${radiusKm}km radius`)
  return orders
}

generateTestOrders().catch(console.error)