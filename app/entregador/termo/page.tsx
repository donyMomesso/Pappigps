"use client"

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, AlertTriangle, CheckCircle2 } from 'lucide-react'

export default function TermoAceitePage() {
  const router = useRouter()
  const [aceito, setAceito] = useState(false)
  const [leuTermo, setLeuTermo] = useState(false)
  const [loading, setLoading] = useState(false)
  const fetcher = async (url: string) => {
    const response = await fetch(url, { cache: 'no-store' })
    if (!response.ok) {
      throw new Error('Falha ao carregar termo')
    }
    return response.json()
  }
  const { data } = useSWR('/api/entregador/me', fetcher)
  const entregadorNome = data?.entregador?.nome || ''

  useEffect(() => {
    if (data?.entregador?.termoAceito) {
      router.push('/entregador/painel')
    }
  }, [data, router])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget
    const isAtBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 50
    if (isAtBottom) {
      setLeuTermo(true)
    }
  }

  const handleAceitar = async () => {
    if (!aceito) return
    
    setLoading(true)
    await fetch('/api/entregador/me/termo', { method: 'POST' })
    router.push('/entregador/painel')
  }

  const handleRecusar = () => {
    void fetch('/api/auth/logout', { method: 'POST' }).finally(() => {
      router.push('/entregador')
    })
  }

  return (
    <div className="min-h-screen bg-muted p-4 flex items-center justify-center">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Termo de Prestação de Serviços</CardTitle>
              <CardDescription>
                Olá, {entregadorNome}! Leia atentamente o termo abaixo.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="p-4 bg-amber-50 border-b flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <strong>Importante:</strong> Este termo estabelece que você atuará como prestador de serviços 
              autônomo (freelancer), sem vínculo empregatício. Você terá total liberdade para escolher 
              seus dias e horários de trabalho.
            </div>
          </div>

          <ScrollArea 
            className="h-[400px] p-6"
            onScrollCapture={handleScroll}
          >
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-sm text-foreground leading-relaxed">
                {data?.termoFreelancer}
              </pre>
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 border-t bg-muted/50 p-6">
          {!leuTermo && (
            <p className="text-sm text-muted-foreground text-center w-full">
              Role até o final do termo para habilitar a aceitação.
            </p>
          )}

          <div className="flex items-start gap-3 w-full">
            <Checkbox 
              id="aceito" 
              checked={aceito}
              onCheckedChange={(checked) => setAceito(checked as boolean)}
              disabled={!leuTermo}
            />
            <label 
              htmlFor="aceito" 
              className={`text-sm leading-relaxed cursor-pointer ${!leuTermo ? 'text-muted-foreground' : 'text-foreground'}`}
            >
              Li, compreendi e aceito todos os termos acima. Declaro estar ciente de que não haverá 
              vínculo empregatício e que atuo por livre escolha como prestador de serviços autônomo.
            </label>
          </div>

          <div className="flex gap-3 w-full">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleRecusar}
            >
              Recusar e Sair
            </Button>
            <Button 
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              onClick={handleAceitar}
              disabled={!aceito || loading}
            >
              {loading ? (
                'Processando...'
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Aceitar Termo
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Ao aceitar, você poderá começar a realizar entregas imediatamente.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
