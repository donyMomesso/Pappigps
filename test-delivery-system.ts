import { getPedidosStore } from '@/lib/server/repositories'
import { estimateRoute } from '@/lib/routing/estimate-route'
import { getConfiguracoes } from '@/lib/server/repositories'

async function testDeliverySystem() {
  console.log('Testing PappiGPS delivery system with 100 orders...')

  // Get orders
  const pedidos = await getPedidosStore()
  console.log(`Loaded ${pedidos.length} orders`)

  // Get configurations
  const config = await getConfiguracoes()
  console.log(`Pizzeria location: ${config.loja.endereco.cidade}, Lat: ${config.loja.coordenadas.latitude}, Lng: ${config.loja.coordenadas.longitude}`)

  // Filter orders within 7km
  const ordersWithinRadius = pedidos.filter(pedido => {
    const distance = calculateDistance(
      config.loja.coordenadas.latitude,
      config.loja.coordenadas.longitude,
      pedido.endereco.latitude || 0,
      pedido.endereco.longitude || 0
    )
    return distance <= 7 // 7km
  })

  console.log(`${ordersWithinRadius.length} orders within 7km radius`)

  // Test routing estimation
  const estimativa = estimateRoute(config.loja, ordersWithinRadius)
  console.log(`Route estimation:`)
  console.log(`- Total distance: ${estimativa.distanciaTotal.toFixed(2)} km`)
  console.log(`- Estimated time: ${estimativa.tempoEstimado.toFixed(0)} minutes`)
  console.log(`- Average speed: ${((estimativa.distanciaTotal / estimativa.tempoEstimado) * 60).toFixed(2)} km/h`)

  // Simulate delivery capacity (assuming 10 deliveries per day per deliverer)
  const entregadores = await import('@/lib/server/repositories').then(m => m.getEntregadores())
  const totalCapacity = entregadores.length * 10 // 10 deliveries per day
  console.log(`\nDelivery capacity:`)
  console.log(`- Available deliverers: ${entregadores.length}`)
  console.log(`- Daily capacity: ${totalCapacity} deliveries`)
  console.log(`- Orders to deliver: ${ordersWithinRadius.length}`)
  console.log(`- Capacity utilization: ${((ordersWithinRadius.length / totalCapacity) * 100).toFixed(1)}%`)

  if (ordersWithinRadius.length > totalCapacity) {
    console.log('⚠️  Warning: Order volume exceeds daily capacity!')
  } else {
    console.log('✅ Order volume within daily capacity')
  }

  // Revenue calculation
  const totalRevenue = ordersWithinRadius.reduce((sum, order) => sum + order.valor, 0)
  const totalDeliveryFees = ordersWithinRadius.reduce((sum, order) => sum + (order.taxaEntrega?.valorTotal || 0), 0)
  console.log(`\nFinancial summary:`)
  console.log(`- Total order value: R$ ${totalRevenue.toFixed(2)}`)
  console.log(`- Total delivery fees: R$ ${totalDeliveryFees.toFixed(2)}`)
  console.log(`- Average order value: R$ ${(totalRevenue / ordersWithinRadius.length).toFixed(2)}`)

  console.log('\n✅ System test completed successfully!')
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

testDeliverySystem().catch(console.error)