"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin, Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate authentication
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (email === "admin@pappigps.com" && password === "123456") {
      router.push("/dashboard")
    } else {
      setError("E-mail ou senha inválidos")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-800" />
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <MapPin className="w-10 h-10" />
            </div>
            <span className="text-4xl font-bold">PappiGPS</span>
          </div>
          <h1 className="text-3xl font-semibold text-center mb-4 text-balance">
            Sistema de Roteirização Inteligente
          </h1>
          <p className="text-emerald-100 text-center text-lg max-w-md text-pretty">
            Otimize suas entregas, reduza custos e acompanhe em tempo real todas as suas operações logísticas.
          </p>
          
          <div className="mt-12 grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold">98%</div>
              <div className="text-emerald-200 text-sm">Taxa de Entrega</div>
            </div>
            <div>
              <div className="text-4xl font-bold">-30%</div>
              <div className="text-emerald-200 text-sm">Custos Operacionais</div>
            </div>
            <div>
              <div className="text-4xl font-bold">2x</div>
              <div className="text-emerald-200 text-sm">Mais Eficiência</div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl" />
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
              <MapPin className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-zinc-900">PappiGPS</span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-zinc-900">Bem-vindo de volta</h2>
            <p className="text-zinc-500 mt-2">Entre com suas credenciais para acessar o sistema</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                  Lembrar de mim
                </Label>
              </div>
              <a href="#" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                Esqueceu a senha?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-zinc-500">
              Credenciais de teste: <span className="font-medium text-zinc-700">admin@pappigps.com</span> / <span className="font-medium text-zinc-700">123456</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
