"use client"

import dynamic from "next/dynamic"

const DeliveryMap = dynamic(() => import("@/components/delivery-map").then((mod) => mod.DeliveryMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
        <p className="font-medium text-gray-600">Carregando mapa...</p>
      </div>
    </div>
  ),
})

export default function Home() {
  return (
    <main className="h-screen w-full overflow-hidden">
      <DeliveryMap />
    </main>
  )
}
