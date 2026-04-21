"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockConfiguracoes } from "@/mocks/data"
import { Building2, Clock, Bell, Save, Loader2 } from "lucide-react"

export default function ConfiguracoesPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [config, setConfig] = useState(mockConfiguracoes)

  const handleSave = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  return (
    <>
      <Header title="Configurações" />
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-zinc-900">Configurações do Sistema</h2>
          <p className="text-sm text-zinc-500">Gerencie as configurações da sua empresa e operação</p>
        </div>

        <Tabs defaultValue="empresa" className="space-y-6">
          <TabsList className="bg-white border border-zinc-200">
            <TabsTrigger value="empresa" className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700">
              <Building2 className="w-4 h-4 mr-2" />
              Empresa
            </TabsTrigger>
            <TabsTrigger value="operacao" className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700">
              <Clock className="w-4 h-4 mr-2" />
              Operação
            </TabsTrigger>
            <TabsTrigger value="notificacoes" className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700">
              <Bell className="w-4 h-4 mr-2" />
              Notificações
            </TabsTrigger>
          </TabsList>

          {/* Empresa Tab */}
          <TabsContent value="empresa">
            <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <h3 className="font-semibold text-zinc-900 mb-6">Dados da Empresa</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome da Empresa</Label>
                  <Input 
                    id="nome" 
                    value={config.empresa.nome}
                    onChange={(e) => setConfig({
                      ...config,
                      empresa: { ...config.empresa, nome: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input 
                    id="cnpj" 
                    value={config.empresa.cnpj}
                    onChange={(e) => setConfig({
                      ...config,
                      empresa: { ...config.empresa, cnpj: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input 
                    id="telefone" 
                    value={config.empresa.telefone}
                    onChange={(e) => setConfig({
                      ...config,
                      empresa: { ...config.empresa, telefone: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={config.empresa.email}
                    onChange={(e) => setConfig({
                      ...config,
                      empresa: { ...config.empresa, email: e.target.value }
                    })}
                  />
                </div>
              </div>

              <h4 className="font-medium text-zinc-900 mt-8 mb-4">Endereço</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="logradouro">Logradouro</Label>
                  <Input 
                    id="logradouro" 
                    value={config.empresa.endereco.logradouro}
                    onChange={(e) => setConfig({
                      ...config,
                      empresa: { 
                        ...config.empresa, 
                        endereco: { ...config.empresa.endereco, logradouro: e.target.value }
                      }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numero">Número</Label>
                  <Input 
                    id="numero" 
                    value={config.empresa.endereco.numero}
                    onChange={(e) => setConfig({
                      ...config,
                      empresa: { 
                        ...config.empresa, 
                        endereco: { ...config.empresa.endereco, numero: e.target.value }
                      }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input 
                    id="bairro" 
                    value={config.empresa.endereco.bairro}
                    onChange={(e) => setConfig({
                      ...config,
                      empresa: { 
                        ...config.empresa, 
                        endereco: { ...config.empresa.endereco, bairro: e.target.value }
                      }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input 
                    id="cidade" 
                    value={config.empresa.endereco.cidade}
                    onChange={(e) => setConfig({
                      ...config,
                      empresa: { 
                        ...config.empresa, 
                        endereco: { ...config.empresa.endereco, cidade: e.target.value }
                      }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <Input 
                    id="cep" 
                    value={config.empresa.endereco.cep}
                    onChange={(e) => setConfig({
                      ...config,
                      empresa: { 
                        ...config.empresa, 
                        endereco: { ...config.empresa.endereco, cep: e.target.value }
                      }
                    })}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Operação Tab */}
          <TabsContent value="operacao">
            <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <h3 className="font-semibold text-zinc-900 mb-6">Configurações de Operação</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <Label htmlFor="horarioInicio">Horário de Início</Label>
                  <Input 
                    id="horarioInicio" 
                    type="time"
                    value={config.operacao.horarioInicio}
                    onChange={(e) => setConfig({
                      ...config,
                      operacao: { ...config.operacao, horarioInicio: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horarioFim">Horário de Término</Label>
                  <Input 
                    id="horarioFim" 
                    type="time"
                    value={config.operacao.horarioFim}
                    onChange={(e) => setConfig({
                      ...config,
                      operacao: { ...config.operacao, horarioFim: e.target.value }
                    })}
                  />
                </div>
              </div>

              <h4 className="font-medium text-zinc-900 mb-4">Taxas de Entrega</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="raio">Raio Máximo (km)</Label>
                  <Input 
                    id="raio" 
                    type="number"
                    value={config.operacao.raioMaximoKm}
                    onChange={(e) => setConfig({
                      ...config,
                      operacao: { ...config.operacao, raioMaximoKm: Number(e.target.value) }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxaBase">Taxa Base (R$)</Label>
                  <Input 
                    id="taxaBase" 
                    type="number"
                    step="0.01"
                    value={config.operacao.taxaEntregaBase}
                    onChange={(e) => setConfig({
                      ...config,
                      operacao: { ...config.operacao, taxaEntregaBase: Number(e.target.value) }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxaKm">Taxa por Km (R$)</Label>
                  <Input 
                    id="taxaKm" 
                    type="number"
                    step="0.01"
                    value={config.operacao.taxaPorKm}
                    onChange={(e) => setConfig({
                      ...config,
                      operacao: { ...config.operacao, taxaPorKm: Number(e.target.value) }
                    })}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Notificações Tab */}
          <TabsContent value="notificacoes">
            <div className="bg-white border border-zinc-200 rounded-xl p-6">
              <h3 className="font-semibold text-zinc-900 mb-6">Preferências de Notificação</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-lg">
                  <div>
                    <p className="font-medium text-zinc-900">E-mail para novos pedidos</p>
                    <p className="text-sm text-zinc-500">Receba um e-mail quando um novo pedido for criado</p>
                  </div>
                  <Switch 
                    checked={config.notificacoes.emailNovoPedido}
                    onCheckedChange={(checked) => setConfig({
                      ...config,
                      notificacoes: { ...config.notificacoes, emailNovoPedido: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-lg">
                  <div>
                    <p className="font-medium text-zinc-900">SMS para clientes</p>
                    <p className="text-sm text-zinc-500">Enviar SMS ao cliente quando o pedido sair para entrega</p>
                  </div>
                  <Switch 
                    checked={config.notificacoes.smsCliente}
                    onCheckedChange={(checked) => setConfig({
                      ...config,
                      notificacoes: { ...config.notificacoes, smsCliente: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-lg">
                  <div>
                    <p className="font-medium text-zinc-900">Push para entregadores</p>
                    <p className="text-sm text-zinc-500">Enviar notificação push quando uma nova rota for atribuída</p>
                  </div>
                  <Switch 
                    checked={config.notificacoes.pushEntregador}
                    onCheckedChange={(checked) => setConfig({
                      ...config,
                      notificacoes: { ...config.notificacoes, pushEntregador: checked }
                    })}
                  />
                </div>
              </div>
            </div>
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
