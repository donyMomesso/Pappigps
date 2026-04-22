import { getPedidosStore, getEntregadores, getConfiguracoes } from '@/lib/server/repositories'
import { estimateRoute } from '@/lib/routing/estimate-route'

async function testRoutingAPI() {
  console.log('Testing routing system...')

  // Get data
  const pedidos = await getPedidosStore()
  const entregadores = await getEntregadores()
  const config = await getConfiguracoes()

  console.log(`Available deliverers: ${entregadores.length}`)
  console.log(`Orders to route: ${pedidos.length}`)

  if (entregadores.length === 0) {
    console.log('❌ No deliverers available')
    return
  }

  // Select first deliverer and first 10 orders for testing
  const entregador = entregadores[0]
  const ordersToRoute = pedidos.slice(0, 10)

  console.log(`Testing route creation for deliverer: ${entregador.nome}`)
  console.log(`Orders selected: ${ordersToRoute.length}`)

  // Estimate route
  const estimativa = estimateRoute(config.loja, ordersToRoute)
  console.log(`Route estimation:`)
  console.log(`- Distance: ${estimativa.distanciaTotal.toFixed(2)} km`)
  console.log(`- Time: ${estimativa.tempoEstimado.toFixed(0)} minutes`)

  // Simulate route creation (similar to API)
  const rotaId = `test-rota-${Date.now()}`
  const rota = {
    id: rotaId,
    nome: `Test Route ${new Date().toLocaleDateString('pt-BR')}`,
    entregador,
    pedidos: ordersToRoute.map((pedido, index) => ({
      ...pedido,
      entregadorId: entregador.id,
      ordemEntrega: index + 1,
      rotaId,
      trackingToken: `track-${pedido.id}`,
    })),
    distanciaTotal: estimativa.distanciaTotal,
    tempoEstimado: estimativa.tempoEstimado,
    status: "planejada",
    dataCriacao: new Date(),
    valorTotalTaxas: ordersToRoute.reduce((acc, pedido) => acc + (pedido.taxaEntrega?.valorTotal || 0), 0)
  }

  console.log(`✅ Route created successfully:`)
  console.log(`- Route ID: ${rota.id}`)
  console.log(`- Deliveries: ${rota.pedidos.length}`)
  console.log(`- Total distance: ${rota.distanciaTotal.toFixed(2)} km`)
  console.log(`- Estimated time: ${rota.tempoEstimado.toFixed(0)} minutes`)

  console.log('\n🎯 Routing system test passed!')
}

testRoutingAPI().catch(console.error)