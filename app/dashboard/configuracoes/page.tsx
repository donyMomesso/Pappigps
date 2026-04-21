"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockConfiguracoes, mockLoja } from "@/mocks/data"
import { Building2, Clock, Bell, Save, Loader2, MapPin, DollarSign, FileText, Users } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import dynamic from 'next/dynamic'

const LojaMap = dynamic(() => import('@/components/configuracoes/loja-map'), {
  ssr: false,
  loading: () => <div className="h-[300px] bg-muted animate-pulse rounded-lg" />
})

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
  const [isLoading, setIsLoading] = useState(false)
  const [loja, setLoja] = useState(mockLoja)
  const [notificacoes, setNotificacoes] = useState(mockConfiguracoes.notificacoes)
  const [termoFreelancer, setTermoFreelancer] = useState(mockConfiguracoes.termoFreelancer)

  const handleSave = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const handleCoordenadasChange = (lat: number, lng: number) => {
    setLoja({
      ...loja,
      coordenadas: { latitude: lat, longitude: lng },
      endereco: { ...loja.endereco, latitude: lat, longitude: lng }
    })
  }

  return (
    <>
      <Header title="Configurações" />
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground">Configurações do Sistema</h2>
          <p className="text-sm text-muted-foreground">Gerencie as configurações da sua empresa, operação e entregadores</p>
        </div>

        <Tabs defaultValue="empresa" className="space-y-6">
          <TabsList className="bg-background border">
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
                    <Input 
                      id="cnpj" 
                      value={loja.cnpj}
                      onChange={(e) => setLoja({ ...loja, cnpj: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
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
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="logradouro">Logradouro</Label>
                      <Input 
                        id="logradouro" 
                        value={loja.endereco.logradouro}
                        onChange={(e) => setLoja({
                          ...loja,
                          endereco: { ...loja.endereco, logradouro: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numero">Número</Label>
                      <Input 
                        id="numero" 
                        value={loja.endereco.numero}
                        onChange={(e) => setLoja({
                          ...loja,
                          endereco: { ...loja.endereco, numero: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bairro">Bairro</Label>
                      <Input 
                        id="bairro" 
                        value={loja.endereco.bairro}
                        onChange={(e) => setLoja({
                          ...loja,
                          endereco: { ...loja.endereco, bairro: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cidade">Cidade</Label>
                      <Input 
                        id="cidade" 
                        value={loja.endereco.cidade}
                        onChange={(e) => setLoja({
                          ...loja,
                          endereco: { ...loja.endereco, cidade: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cep">CEP</Label>
                      <Input 
                        id="cep" 
                        value={loja.endereco.cep}
                        onChange={(e) => setLoja({
                          ...loja,
                          endereco: { ...loja.endereco, cep: e.target.value }
                        })}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-3">
                      <Label className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                        Coordenadas GPS
                      </Label>
                      <Badge variant="outline" className="text-emerald-600">
                        Ponto de partida das rotas
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="latitude">Latitude</Label>
                        <Input 
                          id="latitude" 
                          type="number"
                          step="0.0001"
                          value={loja.coordenadas.latitude}
                          onChange={(e) => handleCoordenadasChange(
                            Number(e.target.value),
                            loja.coordenadas.longitude
                          )}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="longitude">Longitude</Label>
                        <Input 
                          id="longitude" 
                          type="number"
                          step="0.0001"
                          value={loja.coordenadas.longitude}
                          onChange={(e) => handleCoordenadasChange(
                            loja.coordenadas.latitude,
                            Number(e.target.value)
                          )}
                        />
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
                      <div key={key} className="flex items-center justify-between p-4 bg-muted rounded-lg">
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
                          <div className="flex items-center gap-2">
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
            <div className="grid lg:grid-cols-2 gap-6">
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
