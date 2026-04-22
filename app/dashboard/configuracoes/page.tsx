"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { Building2, Clock, Bell, Save, Loader2, MapPin, DollarSign, FileText, Users, Search } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import type { Configuracoes, IntegracaoPlataforma, Loja } from "@/types"
import dynamic from 'next/dynamic'

const LojaMap = dynamic(() => import('@/components/configuracoes/loja-map'), {
  ssr: false,
  loading: () => <div className="h-[300px] bg-muted animate-pulse rounded-lg" />
})

const fetcher = async (url: string) => {
  const response = await fetch(url, { cache: "no-store" })
  if (!response.ok) {
    throw new Error("Falha ao carregar dados")
  }
  return response.json()
}

function IntegrationsTab() {
  const [integrations, setIntegrations] = useState<IntegracaoPlataforma[]>([])
  const [loading, setLoading] = useState(false)

  const fetchIntegrations = async () => {
    try {
      const response = await fetch('/api/integrations')
      const data: IntegracaoPlataforma[] = await response.json()
      setIntegrations(data)
    } catch (error) {
      console.error('Erro ao carregar integrações:', error)
    }
  }

  useEffect(() => {
    const loadIntegrations = async () => {
      await fetchIntegrations()
    }

    void loadIntegrations()
  }, [])

  const handleUpdateIntegration = async (integration: IntegracaoPlataforma) => {
    setLoading(true)
    try {
      const response = await fetch('/api/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(integration)
      })
      if (!response.ok) {
        throw new Error('Falha ao salvar integração')
      }
      const updated: IntegracaoPlataforma = await response.json()
      setIntegrations(prev => prev.map(i => i.id === updated.id ? updated : i))
      toast({
        title: "Integração salva",
        description: `${updated.nome} foi atualizada com sucesso.`,
      })
    } catch (error) {
      console.error('Erro ao atualizar integração:', error)
      toast({
        title: "Erro ao salvar integração",
        description: "Não foi possível salvar os dados da integração.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTestConnection = async (id: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/integrations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      if (!response.ok) {
        throw new Error('Falha ao testar conexão')
      }
      const result = await response.json()
      toast({
        title: result.success ? "Conexão validada" : "Conexão com erro",
        description: result.message,
        variant: result.success ? "default" : "destructive"
      })
      await fetchIntegrations()
    } catch (error) {
      console.error('Erro ao testar conexão:', error)
      toast({
        title: "Erro no teste",
        description: "Não foi possível testar a integração agora.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Integrações com Plataformas</CardTitle>
          <CardDescription>
            Conecte com iFood, 99Food e outras plataformas para receber pedidos automaticamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {integrations.map((integration) => (
            <Card key={integration.id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-medium">{integration.nome}</h3>
                      <p className="break-all text-sm text-muted-foreground">
                        Webhook: {integration.webhookUrl}
                      </p>
                    </div>
                  </div>
                  <Badge variant={integration.status === 'conectado' ? 'default' : 'secondary'}>
                    {integration.status}
                  </Badge>
                </div>

                <div className="mb-4 grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Store ID</Label>
                    <Input
                      value={integration.storeId}
                      onChange={(e) => setIntegrations(prev => prev.map(i =>
                        i.id === integration.id ? { ...i, storeId: e.target.value } : i
                      ))}
                      placeholder="ID da loja na plataforma"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <Input
                      type="password"
                      value={integration.apiKey}
                      onChange={(e) => setIntegrations(prev => prev.map(i =>
                        i.id === integration.id ? { ...i, apiKey: e.target.value } : i
                      ))}
                      placeholder="Chave de API da plataforma"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={integration.ativo}
                      onCheckedChange={(checked) => setIntegrations(prev => prev.map(i =>
                        i.id === integration.id ? { ...i, ativo: checked } : i
                      ))}
                    />
                    <Label>Ativo</Label>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestConnection(integration.id)}
                      disabled={loading}
                    >
                      Testar Conexão
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleUpdateIntegration(integration)}
                      disabled={loading}
                    >
                      Salvar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Como Configurar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">1. Obter credenciais da plataforma</h4>
            <p className="text-sm text-muted-foreground">
              Acesse o painel do parceiro (iFood, 99Food) e gere uma API Key e obtenha o Store ID.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">2. Configurar webhook</h4>
            <p className="text-sm text-muted-foreground">
              No painel da plataforma, configure o webhook para enviar pedidos para a URL mostrada acima.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">3. Testar conexão</h4>
            <p className="text-sm text-muted-foreground">
              Use o botao de Testar Conexao para verificar se a integracao esta funcionando.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const diasSemana = [
  { key: 'domingo', label: 'Domingo' },
  { key: 'segunda', label: 'Segunda' },
  { key: 'terca', label: 'Terça' },
  { key: 'quarta', label: 'Quarta' },
  { key: 'quinta', label: 'Quinta' },
  { key: 'sexta', label: 'Sexta' },
  { key: 'sabado', label: 'Sábado' }
]

export default function ConfiguracoesPage() {
  const { data, error, mutate } = useSWR<Configuracoes>("/api/configuracoes", fetcher)

  if (error) {
    return (
      <>
        <Header title="Configurações" />
        <div className="p-6 text-sm text-destructive">
          Erro ao carregar configurações. Atualize a página ou tente novamente mais tarde.
        </div>
      </>
    )
  }

  if (!data) {
    return (
      <>
        <Header title="Configurações" />
        <div className="p-6 text-sm text-muted-foreground">Carregando configurações...</div>
      </>
    )
  }

  return (
    <ConfiguracoesEditor
      key={JSON.stringify(data)}
      initialData={data}
      mutate={mutate}
    />
  )
}

function ConfiguracoesEditor({
  initialData,
  mutate,
}: {
  initialData: Configuracoes
  mutate: (data?: Configuracoes, opts?: { revalidate?: boolean }) => Promise<Configuracoes | undefined>
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSearchingAddress, setIsSearchingAddress] = useState(false)
  const [isSearchingCnpj, setIsSearchingCnpj] = useState(false)
  const [loja, setLoja] = useState<Loja>(initialData.loja)
  const [notificacoes, setNotificacoes] = useState<Configuracoes["notificacoes"]>(initialData.notificacoes)
  const [termoFreelancer, setTermoFreelancer] = useState(initialData.termoFreelancer)
  const [latitudeInput, setLatitudeInput] = useState(initialData.loja.coordenadas.latitude.toFixed(6).replace(".", ","))
  const [longitudeInput, setLongitudeInput] = useState(initialData.loja.coordenadas.longitude.toFixed(6).replace(".", ","))

  const persistirConfiguracoes = async (proximaLoja = loja) => {
    const payload: Configuracoes = {
      loja: proximaLoja,
      notificacoes,
      termoFreelancer
    }

    const response = await fetch("/api/configuracoes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error("Falha ao salvar configurações")
    }

    await mutate(payload, { revalidate: false })
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await persistirConfiguracoes()

      toast({
        title: "Configurações salvas",
        description: "Os dados da loja foram atualizados com sucesso."
      })
    } catch {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações agora.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCoordenadasChange = (lat: number, lng: number) => {
    setLatitudeInput(formatarCoordenada(lat))
    setLongitudeInput(formatarCoordenada(lng))
    setLoja((prev) => ({
      ...prev,
      coordenadas: { latitude: lat, longitude: lng },
      endereco: { ...prev.endereco, latitude: lat, longitude: lng }
    }))
  }

  const formatarCnpj = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 14)

    if (digits.length <= 2) return digits
    if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`
    if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`
    if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`
  }

  const formatarCoordenada = (value: number) => value.toFixed(6).replace(".", ",")

  const parseCoordenada = (value: string) => {
    const normalized = value.replace(",", ".").trim()
    if (!normalized) return null
    const parsed = Number(normalized)
    return Number.isFinite(parsed) ? parsed : null
  }

  const handleEnderecoFieldChange = (field: keyof typeof loja.endereco, value: string) => {
    setLoja((prev) => ({
      ...prev,
      endereco: { ...prev.endereco, [field]: value }
    }))
  }

  const buscarCoordenadasDoEndereco = async (
    enderecoBase: typeof loja.endereco,
    lojaBase = loja
  ) => {
    const enderecoCompleto = [
      enderecoBase.logradouro,
      enderecoBase.numero,
      enderecoBase.bairro,
      enderecoBase.cidade,
      enderecoBase.uf,
      enderecoBase.cep,
      "Brasil"
    ]
      .filter(Boolean)
      .join(", ")

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(enderecoCompleto)}&format=json&addressdetails=1&limit=1`
    )

    if (!response.ok) {
      throw new Error("Falha ao buscar endereço")
    }

    const data = await response.json()

    if (!data?.length) {
      throw new Error("Endereço não encontrado")
    }

    const resultado = data[0]
    const latitude = Number(resultado.lat)
    const longitude = Number(resultado.lon)
    const address = resultado.address ?? {}

    return {
      ...lojaBase,
      coordenadas: { latitude, longitude },
      endereco: {
        ...enderecoBase,
        logradouro: address.road || address.pedestrian || enderecoBase.logradouro,
        bairro: address.suburb || address.neighbourhood || enderecoBase.bairro,
        cidade: address.city || address.town || address.village || enderecoBase.cidade,
        uf: address.state_code || enderecoBase.uf,
        cep: address.postcode || enderecoBase.cep,
        latitude,
        longitude
      }
    }
  }

  const handleBuscarEndereco = async () => {
    const cepLimpo = loja.endereco.cep.replace(/\D/g, "")
    const buscarPorCep = cepLimpo.length === 8

    if (!buscarPorCep && !loja.endereco.logradouro.trim()) {
      toast({
        title: "Informe o endereço",
        description: "Preencha o CEP ou o endereço da loja antes de buscar a localização.",
        variant: "destructive"
      })
      return
    }

    setIsSearchingAddress(true)

    try {
      let dadosEndereco = { ...loja.endereco, cep: cepLimpo || loja.endereco.cep }

      if (buscarPorCep) {
        const cepResponse = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)

        if (!cepResponse.ok) {
          throw new Error("Falha ao consultar CEP")
        }

        const cepData = await cepResponse.json()

        if (cepData.erro) {
          toast({
            title: "CEP não encontrado",
            description: "Revise o CEP informado e tente novamente.",
            variant: "destructive"
          })
          return
        }

        dadosEndereco = {
          ...dadosEndereco,
          logradouro: cepData.logradouro || dadosEndereco.logradouro,
          bairro: cepData.bairro || dadosEndereco.bairro,
          cidade: cepData.localidade || dadosEndereco.cidade,
          uf: cepData.uf || dadosEndereco.uf,
          cep: cepData.cep || dadosEndereco.cep
        }
      }
      const proximaLoja = await buscarCoordenadasDoEndereco(
        {
          ...dadosEndereco,
          numero: loja.endereco.numero
        },
        loja
      )

      setLoja(proximaLoja)
      await persistirConfiguracoes(proximaLoja)

      toast({
        title: "Localização salva",
        description: buscarPorCep
          ? "CEP consultado, coordenadas encontradas e loja salva com sucesso."
          : "As coordenadas da loja foram atualizadas e salvas."
      })
    } catch {
      toast({
        title: "Erro na busca",
        description: "Não foi possível consultar o CEP/endereço agora.",
        variant: "destructive"
      })
    } finally {
      setIsSearchingAddress(false)
    }
  }

  const handleCepChange = (value: string) => {
    const cepLimpo = value.replace(/\D/g, "").slice(0, 8)
    const cepFormatado = cepLimpo.length > 5 ? `${cepLimpo.slice(0, 5)}-${cepLimpo.slice(5)}` : cepLimpo

    handleEnderecoFieldChange("cep", cepFormatado)
  }

  const handleCnpjChange = (value: string) => {
    setLoja((prev) => ({
      ...prev,
      cnpj: formatarCnpj(value)
    }))
  }

  const handleBuscarCnpj = async () => {
    const cnpjLimpo = loja.cnpj.replace(/\D/g, "")

    if (cnpjLimpo.length !== 14) {
      toast({
        title: "CNPJ inválido",
        description: "Informe um CNPJ com 14 dígitos para buscar os dados da empresa.",
        variant: "destructive"
      })
      return
    }

    setIsSearchingCnpj(true)

    try {
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`)

      if (!response.ok) {
        throw new Error("Falha ao consultar CNPJ")
      }

      const empresa = await response.json()
      const telefone = empresa.ddd_telefone_1 || empresa.ddd_telefone_2 || loja.telefone
      const email = empresa.email || loja.email
      const enderecoBase = {
        ...loja.endereco,
        logradouro: empresa.logradouro || loja.endereco.logradouro,
        numero: empresa.numero || loja.endereco.numero,
        bairro: empresa.bairro || loja.endereco.bairro,
        cidade: empresa.municipio || loja.endereco.cidade,
        uf: empresa.uf || loja.endereco.uf,
        cep: empresa.cep || loja.endereco.cep
      }

      const lojaAtualizada = {
        ...loja,
        nome: empresa.nome_fantasia || empresa.razao_social || loja.nome,
        cnpj: formatarCnpj(cnpjLimpo),
        telefone,
        email,
        endereco: enderecoBase
      }

      const proximaLoja = await buscarCoordenadasDoEndereco(enderecoBase, lojaAtualizada)

      setLoja(proximaLoja)
      await persistirConfiguracoes(proximaLoja)

      toast({
        title: "Empresa encontrada",
        description: "Os dados do CNPJ, endereço e coordenadas foram atualizados e salvos."
      })
    } catch {
      toast({
        title: "Erro ao buscar CNPJ",
        description: "Não foi possível consultar a empresa agora.",
        variant: "destructive"
      })
    } finally {
      setIsSearchingCnpj(false)
    }
  }

  const handleBuscarPorCep = async () => {
    await handleBuscarEndereco()
  }

  const handleLatitudeChange = (value: string) => {
    setLatitudeInput(value)
    const latitude = parseCoordenada(value)

    if (latitude !== null) {
      handleCoordenadasChange(latitude, loja.coordenadas.longitude)
    }
  }

  const handleLongitudeChange = (value: string) => {
    setLongitudeInput(value)
    const longitude = parseCoordenada(value)

    if (longitude !== null) {
      handleCoordenadasChange(loja.coordenadas.latitude, longitude)
    }
  }

  return (
    <>
      <Header title="Configurações" />
      <div className="p-4 sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground">Configurações do Sistema</h2>
          <p className="text-sm text-muted-foreground">Gerencie as configurações da sua empresa, operação e entregadores</p>
        </div>

        <Tabs defaultValue="empresa" className="space-y-6">
          <TabsList className="h-auto w-full justify-start gap-2 overflow-x-auto border bg-background p-1">
            <TabsTrigger value="empresa" className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700">
              <Building2 className="w-4 h-4 mr-2" />
              Empresa
            </TabsTrigger>
            <TabsTrigger value="operacao" className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700">
              <Clock className="w-4 h-4 mr-2" />
              Operação
            </TabsTrigger>
            <TabsTrigger value="taxas" className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700">
              <DollarSign className="w-4 h-4 mr-2" />
              Taxas
            </TabsTrigger>
            <TabsTrigger value="entregadores" className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700">
              <Users className="w-4 h-4 mr-2" />
              Entregadores
            </TabsTrigger>
            <TabsTrigger value="notificacoes" className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700">
              <Bell className="w-4 h-4 mr-2" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="integracoes" className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700">
              <FileText className="w-4 h-4 mr-2" />
              Integrações
            </TabsTrigger>
          </TabsList>

          {/* Empresa Tab */}
          <TabsContent value="empresa">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Dados da Empresa</CardTitle>
                  <CardDescription>Informações básicas da sua empresa</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome da Empresa</Label>
                    <Input 
                      id="nome" 
                      value={loja.nome}
                      onChange={(e) => setLoja({ ...loja, nome: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Input 
                        id="cnpj" 
                        value={loja.cnpj}
                        inputMode="numeric"
                        placeholder="00.000.000/0000-00"
                        onChange={(e) => handleCnpjChange(e.target.value)}
                        onBlur={() => {
                          if (loja.cnpj.replace(/\D/g, "").length === 14) {
                            void handleBuscarCnpj()
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleBuscarCnpj}
                        disabled={isSearchingCnpj}
                      >
                        {isSearchingCnpj ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Buscando...
                          </>
                        ) : (
                          <>
                            <Search className="w-4 h-4 mr-2" />
                            Buscar CNPJ
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input 
                        id="telefone" 
                        value={loja.telefone}
                        onChange={(e) => setLoja({ ...loja, telefone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={loja.email}
                        onChange={(e) => setLoja({ ...loja, email: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Endereço e Localização</CardTitle>
                  <CardDescription>Endereço físico e coordenadas GPS da loja</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="logradouro">Logradouro</Label>
                      <Input 
                        id="logradouro" 
                        value={loja.endereco.logradouro}
                        onChange={(e) => handleEnderecoFieldChange("logradouro", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numero">Número</Label>
                      <Input 
                        id="numero" 
                        value={loja.endereco.numero}
                        onChange={(e) => handleEnderecoFieldChange("numero", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="space-y-2">
                      <Label htmlFor="bairro">Bairro</Label>
                      <Input 
                        id="bairro" 
                        value={loja.endereco.bairro}
                        onChange={(e) => handleEnderecoFieldChange("bairro", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cidade">Cidade</Label>
                      <Input 
                        id="cidade" 
                        value={loja.endereco.cidade}
                        onChange={(e) => handleEnderecoFieldChange("cidade", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="uf">UF</Label>
                      <Input 
                        id="uf" 
                        value={loja.endereco.uf}
                        maxLength={2}
                        onChange={(e) => handleEnderecoFieldChange("uf", e.target.value.toUpperCase())}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cep">CEP</Label>
                      <Input 
                        id="cep" 
                        value={loja.endereco.cep}
                        inputMode="numeric"
                        placeholder="00000-000"
                        onChange={(e) => handleCepChange(e.target.value)}
                        onBlur={() => {
                          if (loja.endereco.cep.replace(/\D/g, "").length === 8) {
                            void handleBuscarPorCep()
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBuscarEndereco}
                      disabled={isSearchingAddress}
                    >
                      {isSearchingAddress ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Buscando...
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4 mr-2" />
                          Buscar Endereço
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBuscarPorCep}
                      disabled={isSearchingAddress}
                    >
                      {isSearchingAddress ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Buscando CEP...
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4 mr-2" />
                          Buscar pelo CEP
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      onClick={handleSave}
                      className="bg-emerald-600 hover:bg-emerald-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Salvar Loja
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <Label className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                        Coordenadas GPS
                      </Label>
                      <Badge variant="outline" className="text-emerald-600">
                        Ponto de partida das rotas
                      </Badge>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="latitude">Latitude</Label>
                        <Input 
                          id="latitude" 
                          type="text"
                          inputMode="decimal"
                          value={latitudeInput}
                          onChange={(e) => handleLatitudeChange(e.target.value)}
                          onBlur={() => setLatitudeInput(formatarCoordenada(loja.coordenadas.latitude))}
                        />
                        <p className="text-xs text-muted-foreground">
                          Valor salvo: {formatarCoordenada(loja.coordenadas.latitude)}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="longitude">Longitude</Label>
                        <Input 
                          id="longitude" 
                          type="text"
                          inputMode="decimal"
                          value={longitudeInput}
                          onChange={(e) => handleLongitudeChange(e.target.value)}
                          onBlur={() => setLongitudeInput(formatarCoordenada(loja.coordenadas.longitude))}
                        />
                        <p className="text-xs text-muted-foreground">
                          Valor salvo: {formatarCoordenada(loja.coordenadas.longitude)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base">Localização no Mapa</CardTitle>
                  <CardDescription>Clique no mapa para ajustar a localização da loja</CardDescription>
                </CardHeader>
                <CardContent>
                  <LojaMap 
                    coordenadas={loja.coordenadas}
                    raioKm={loja.raioEntregaKm}
                    onCoordenadasChange={handleCoordenadasChange}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Operação Tab */}
          <TabsContent value="operacao">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Horários de Funcionamento</CardTitle>
                <CardDescription>Configure os dias e horários de operação da loja</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {diasSemana.map(({ key, label }) => {
                    const horario = loja.horarioOperacao[key as keyof typeof loja.horarioOperacao]
                    return (
                      <div key={key} className="flex flex-col gap-4 rounded-lg bg-muted p-4 xl:flex-row xl:items-center xl:justify-between">
                        <div className="flex items-center gap-4">
                          <Switch 
                            checked={horario.ativo}
                            onCheckedChange={(checked) => setLoja({
                              ...loja,
                              horarioOperacao: {
                                ...loja.horarioOperacao,
                                [key]: { ...horario, ativo: checked }
                              }
                            })}
                          />
                          <span className={`font-medium w-24 ${horario.ativo ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {label}
                          </span>
                        </div>
                        {horario.ativo ? (
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <Input 
                              type="time"
                              className="w-32"
                              value={horario.abertura}
                              onChange={(e) => setLoja({
                                ...loja,
                                horarioOperacao: {
                                  ...loja.horarioOperacao,
                                  [key]: { ...horario, abertura: e.target.value }
                                }
                              })}
                            />
                            <span className="text-muted-foreground">até</span>
                            <Input 
                              type="time"
                              className="w-32"
                              value={horario.fechamento}
                              onChange={(e) => setLoja({
                                ...loja,
                                horarioOperacao: {
                                  ...loja.horarioOperacao,
                                  [key]: { ...horario, fechamento: e.target.value }
                                }
                              })}
                            />
                          </div>
                        ) : (
                          <Badge variant="secondary">Fechado</Badge>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Taxas Tab */}
          <TabsContent value="taxas">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Taxas de Entrega</CardTitle>
                  <CardDescription>Configure as taxas cobradas nas entregas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="raio">Raio Máximo de Entrega (km)</Label>
                    <Input 
                      id="raio" 
                      type="number"
                      value={loja.raioEntregaKm}
                      onChange={(e) => setLoja({ ...loja, raioEntregaKm: Number(e.target.value) })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Entregas fora deste raio não serão aceitas
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxaBase">Taxa Base (R$)</Label>
                    <Input 
                      id="taxaBase" 
                      type="number"
                      step="0.01"
                      value={loja.taxaEntregaBase}
                      onChange={(e) => setLoja({ ...loja, taxaEntregaBase: Number(e.target.value) })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Valor fixo cobrado em todas as entregas
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxaKm">Taxa por Km (R$)</Label>
                    <Input 
                      id="taxaKm" 
                      type="number"
                      step="0.01"
                      value={loja.taxaPorKm}
                      onChange={(e) => setLoja({ ...loja, taxaPorKm: Number(e.target.value) })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Valor adicional por quilômetro rodado
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Pagamento aos Entregadores</CardTitle>
                  <CardDescription>Configure os valores pagos aos entregadores</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="diaria">Valor da Diária (R$)</Label>
                    <Input 
                      id="diaria" 
                      type="number"
                      step="0.01"
                      value={loja.diariaEntregador}
                      onChange={(e) => setLoja({ ...loja, diariaEntregador: Number(e.target.value) })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Valor fixo pago por dia trabalhado
                    </p>
                  </div>

                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <h4 className="font-medium text-emerald-800 mb-2">Exemplo de Cálculo</h4>
                    <div className="text-sm text-emerald-700 space-y-1">
                      <p>Entrega de 5km:</p>
                      <p>Taxa Base: {formatCurrency(loja.taxaEntregaBase)}</p>
                      <p>+ Taxa Km: 5 x {formatCurrency(loja.taxaPorKm)} = {formatCurrency(5 * loja.taxaPorKm)}</p>
                      <p className="font-semibold pt-1 border-t border-emerald-300">
                        Total: {formatCurrency(loja.taxaEntregaBase + (5 * loja.taxaPorKm))}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Entregadores Tab */}
          <TabsContent value="entregadores">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  Termo de Prestação de Serviços
                </CardTitle>
                <CardDescription>
                  Termo que os entregadores devem aceitar para trabalhar como freelancer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    <strong>Importante:</strong> Este termo isenta a empresa de vínculo empregatício 
                    com os entregadores, que atuam como prestadores de serviço autônomo por livre escolha.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Texto do Termo</Label>
                  <Textarea 
                    className="min-h-[400px] font-mono text-sm"
                    value={termoFreelancer}
                    onChange={(e) => setTermoFreelancer(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Versão do Termo</p>
                    <p className="text-sm text-muted-foreground">v1.0 - Última atualização: 15/01/2024</p>
                  </div>
                  <Badge>Ativo</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notificações Tab */}
          <TabsContent value="notificacoes">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Preferências de Notificação</CardTitle>
                <CardDescription>Configure como e quando enviar notificações</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">E-mail para novos pedidos</p>
                      <p className="text-sm text-muted-foreground">Receba um e-mail quando um novo pedido for criado</p>
                    </div>
                    <Switch 
                      checked={notificacoes.emailNovoPedido}
                      onCheckedChange={(checked) => setNotificacoes({ ...notificacoes, emailNovoPedido: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">SMS para clientes</p>
                      <p className="text-sm text-muted-foreground">Enviar SMS ao cliente quando o pedido sair para entrega</p>
                    </div>
                    <Switch 
                      checked={notificacoes.smsCliente}
                      onCheckedChange={(checked) => setNotificacoes({ ...notificacoes, smsCliente: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">Push para entregadores</p>
                      <p className="text-sm text-muted-foreground">Enviar notificação push quando uma nova rota for atribuída</p>
                    </div>
                    <Switch 
                      checked={notificacoes.pushEntregador}
                      onCheckedChange={(checked) => setNotificacoes({ ...notificacoes, pushEntregador: checked })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrações Tab */}
          <TabsContent value="integracoes">
            <IntegrationsTab />
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <Button 
            onClick={handleSave}
            className="bg-emerald-600 hover:bg-emerald-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  )
}
