"use client"

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { 
  Home, 
  MapPin, 
  Calendar, 
  DollarSign, 
  User, 
  LogOut, 
  Menu, 
  X,
  Navigation
} from 'lucide-react'

const menuItems = [
  { href: '/entregador/painel', label: 'Início', icon: Home },
  { href: '/entregador/painel/entregas', label: 'Entregas', icon: MapPin },
  { href: '/entregador/painel/agenda', label: 'Agenda', icon: Calendar },
  { href: '/entregador/painel/financeiro', label: 'Financeiro', icon: DollarSign },
  { href: '/entregador/painel/perfil', label: 'Perfil', icon: User },
]

export default function EntregadorPainelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [locationEnabled, setLocationEnabled] = useState(false)
  const fetcher = async (url: string) => {
    const response = await fetch(url, { cache: 'no-store' })
    if (!response.ok) {
      throw new Error('Falha ao carregar entregador')
    }
    return response.json()
  }
  const { data } = useSWR('/api/entregador/me', fetcher)
  const entregadorNome = data?.entregador?.nome || ''

  useEffect(() => {
    if (data && !data.entregador?.termoAceito) {
      router.push('/entregador/termo')
    }
  }, [data, router])

  const handleLogout = () => {
    void fetch('/api/auth/logout', { method: 'POST' }).finally(() => {
      router.push('/entregador')
      router.refresh()
    })
  }

  const toggleLocation = () => {
    if (!locationEnabled) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          () => setLocationEnabled(true),
          () => alert('Permita o acesso à localização para continuar.')
        )
      }
    } else {
      setLocationEnabled(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Mobile */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-emerald-600 text-white p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-emerald-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
          <span className="font-semibold">PappiGPS</span>
        </div>
        <Button
          variant={locationEnabled ? "default" : "outline"}
          size="sm"
          onClick={toggleLocation}
          className={locationEnabled 
            ? "bg-green-500 hover:bg-green-600 text-white" 
            : "bg-white/10 border-white/30 text-white hover:bg-white/20"
          }
        >
          <Navigation className={`w-4 h-4 mr-2 ${locationEnabled ? 'animate-pulse' : ''}`} />
          {locationEnabled ? 'Online' : 'Offline'}
        </Button>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="w-64 bg-white h-full pt-20 shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b">
              <p className="font-medium text-foreground">{entregadorNome}</p>
              <p className="text-sm text-muted-foreground">Entregador</p>
            </div>
            <nav className="p-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                      isActive 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-white border-r shadow-sm">
        <div className="p-4 border-b bg-emerald-600 text-white">
          <h1 className="text-xl font-bold">PappiGPS</h1>
          <p className="text-sm text-emerald-100">Portal do Entregador</p>
        </div>
        
        <div className="p-4 border-b">
          <p className="font-medium text-foreground">{entregadorNome}</p>
          <p className="text-sm text-muted-foreground">Entregador Freelancer</p>
          <Button
            variant={locationEnabled ? "default" : "outline"}
            size="sm"
            onClick={toggleLocation}
            className={`w-full mt-3 ${locationEnabled 
              ? "bg-green-500 hover:bg-green-600" 
              : ""
            }`}
          >
            <Navigation className={`w-4 h-4 mr-2 ${locationEnabled ? 'animate-pulse' : ''}`} />
            {locationEnabled ? 'Localização Ativa' : 'Ativar Localização'}
          </Button>
        </div>

        <nav className="flex-1 p-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                  isActive 
                    ? 'bg-emerald-100 text-emerald-700 font-medium' 
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sair da Conta
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        {children}
      </main>

      {/* Bottom Navigation Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-30">
        <div className="flex justify-around py-2">
          {menuItems.slice(0, 5).map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center py-2 px-3 ${
                  isActive ? 'text-emerald-600' : 'text-muted-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
