"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Bike, AlertCircle } from 'lucide-react'
import { mockEntregadores } from '@/mocks/data'

export default function EntregadorLoginPage() {
  const router = useRouter()
  const [cpf, setCpf] = useState('')
  const [telefone, setTelefone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  }

  const formatTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simular verificação
    await new Promise(resolve => setTimeout(resolve, 1000))

    const entregador = mockEntregadores.find(
      e => e.cpf === cpf && e.telefone === telefone
    )

    if (!entregador) {
      setError('CPF ou telefone não encontrado. Verifique os dados informados.')
      setLoading(false)
      return
    }

    // Salvar no localStorage para simular sessão
    localStorage.setItem('entregadorId', entregador.id)
    localStorage.setItem('entregadorNome', entregador.nome)
    localStorage.setItem('termoAceito', entregador.termoAceito ? 'true' : 'false')

    // Redirecionar baseado no status do termo
    if (!entregador.termoAceito) {
      router.push('/entregador/termo')
    } else {
      router.push('/entregador/painel')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
            <Bike className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Portal do Entregador
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Acesse sua conta para gerenciar entregas e ganhos
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => setCpf(formatCPF(e.target.value))}
                maxLength={14}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                placeholder="(00) 00000-0000"
                value={telefone}
                onChange={(e) => setTelefone(formatTelefone(e.target.value))}
                maxLength={15}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              disabled={loading}
            >
              {loading ? 'Verificando...' : 'Acessar'}
            </Button>

            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                <strong>Teste:</strong> CPF: 123.456.789-00 | Tel: (11) 98888-1111
              </p>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>PappiGPS - Sistema de Entregas</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
