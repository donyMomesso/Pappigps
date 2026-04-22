import { getPedidosStore, getEntregadores, addRota } from '@/lib/server/repositories'
import { getConfiguracoes } from '@/lib/server/repositories'
import { estimateRoute } from '@/lib/routing/estimate-route'
import { generateTrackingToken } from '@/lib/delivery/identifiers'
import type { Rota } from '@/types'

async function testCreateRoute() {
  console.log('🧪 Testing route creation...')

  try {
    // Get data
    console.log('Loading orders...')
    const pedidos = await getPedidosStore()
    console.log(`✅ Loaded ${pedidos.length} orders`)

    console.log('Loading deliverers...')
    const entregadores = await getEntregadores()
    console.log(`✅ Loaded ${entregadores.length} deliverers`)

    console.log('Loading configurations...')
    const config = await getConfiguracoes()
    console.log(`✅ Loaded configurations`)

    if (!entregadores || entregadores.length === 0) {
      console.log('❌ No deliverers available!')
      return
    }

    if (!pedidos || pedidos.length === 0) {
      console.log('❌ No orders available!')
      return
    }

    // Create route
    const entregador = entregadores[0]
    const selectedOrders = pedidos.slice(0, 5) // Use first 5 orders

    console.log(`\nCreating route for deliverer: ${entregador.nome}`)
    console.log(`Orders: ${selectedOrders.length}`)

    const estimativa = estimateRoute(config.loja, selectedOrders)

    const rota: Rota = {
      id: `rota_${Date.now()}`,
      nome: `Test Route ${new Date().toLocaleDateString('pt-BR')}`,
      entregador,
      pedidos: selectedOrders.map((pedido, index) => ({
        ...pedido,
        entregadorId: entregador.id,
        ordemEntrega: index + 1,
        rotaId: `rota_${Date.now()}`,
        trackingToken: pedido.trackingToken || generateTrackingToken(),
      })),
      distanciaTotal: estimativa.distanciaTotal,
      tempoEstimado: estimativa.tempoEstimado,
      status: "planejada",
      dataCriacao: new Date(),
      valorTotalTaxas: selectedOrders.reduce((acc, pedido) => acc + (pedido.taxaEntrega?.valorTotal || 0), 0)
    }

    console.log('Saving route...')
    await addRota(rota)
    console.log('✅ Route created successfully!')
    console.log(`Route ID: ${rota.id}`)
    console.log(`Distance: ${rota.distanciaTotal.toFixed(2)} km`)
    console.log(`Time: ${rota.tempoEstimado.toFixed(0)} minutes`)

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

testCreateRoute()
