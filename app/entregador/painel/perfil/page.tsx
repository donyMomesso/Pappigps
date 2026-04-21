"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { 
  User, 
  Phone, 
  Mail, 
  Car, 
  Star, 
  Package,
  Calendar,
  FileText,
  CreditCard,
  Edit2,
  Save,
  X,
  Shield,
  CheckCircle2
} from 'lucide-react'
import { mockEntregadores, TERMO_FREELANCER } from '@/mocks/data'
import type { Entregador } from '@/types'

const veiculoLabels: Record<string, string> = {
  moto: 'Motocicleta',
  carro: 'Carro',
  van: 'Van',
  caminhao: 'Caminhão',
  bicicleta: 'Bicicleta'
}

export default function PerfilPage() {
  const [entregador, setEntregador] = useState<Entregador | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    telefone: '',
    email: '',
    chavePix: '',
    banco: '',
    agencia: '',
    conta: ''
  })

  useEffect(() => {
    const entregadorId = localStorage.getItem('entregadorId')
    if (entregadorId) {
      const found = mockEntregadores.find(e => e.id === entregadorId)
      if (found) {
        setEntregador(found)
        setFormData({
          telefone: found.telefone,
          email: found.email || '',
          chavePix: found.chavePix || '',
          banco: found.banco || '',
          agencia: found.agencia || '',
          conta: found.conta || ''
        })
      }
    }
  }, [])

  const handleSave = () => {
    // Simular salvamento
    setEditMode(false)
  }

  if (!entregador) {
    return <div className="p-6">Carregando...</div>
  }

  return (
    <div className="p-4 lg:p-6 pb-24 lg:pb-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Meu Perfil</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações e configurações
        </p>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-emerald-600" />
            </div>
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-2xl font-bold text-foreground">{entregador.nome}</h2>
              <p className="text-muted-foreground">CPF: {entregador.cpf}</p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mt-3">
                <Badge className="bg-emerald-100 text-emerald-700">
                  <Shield className="w-3 h-3 mr-1" />
                  Freelancer
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {entregador.avaliacaoMedia?.toFixed(1)}
                </Badge>
                <Badge variant="outline">
                  <Package className="w-3 h-3 mr-1" />
                  {entregador.totalEntregas} entregas
                </Badge>
              </div>
            </div>
            <Button 
              variant={editMode ? "outline" : "default"}
              onClick={() => editMode ? setEditMode(false) : setEditMode(true)}
              className={editMode ? "" : "bg-emerald-600 hover:bg-emerald-700"}
            >
              {editMode ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Editar
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Cards */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Dados Pessoais */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" />
              Dados Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input value={entregador.nome} disabled />
            </div>
            <div className="space-y-2">
              <Label>CPF</Label>
              <Input value={entregador.cpf} disabled />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input 
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                disabled={!editMode}
              />
            </div>
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!editMode}
              />
            </div>
          </CardContent>
        </Card>

        {/* Veículo */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Car className="w-4 h-4 text-emerald-600" />
              Veículo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tipo de Veículo</Label>
              <Input value={veiculoLabels[entregador.veiculo]} disabled />
            </div>
            <div className="space-y-2">
              <Label>Placa</Label>
              <Input value={entregador.placaVeiculo || '-'} disabled />
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Cadastrado em</p>
                  <p className="text-sm text-muted-foreground">
                    {entregador.dataCadastro.toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dados Bancários */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              Dados para Pagamento
            </CardTitle>
            <CardDescription>
              Informe seus dados para receber os pagamentos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Chave PIX (preferencial)</Label>
              <Input 
                placeholder="CPF, E-mail, Telefone ou Chave Aleatória"
                value={formData.chavePix}
                onChange={(e) => setFormData({ ...formData, chavePix: e.target.value })}
                disabled={!editMode}
              />
            </div>

            <Separator />

            <p className="text-sm text-muted-foreground">Ou dados bancários tradicionais:</p>

            <div className="space-y-2">
              <Label>Banco</Label>
              <Input 
                placeholder="Nome do Banco"
                value={formData.banco}
                onChange={(e) => setFormData({ ...formData, banco: e.target.value })}
                disabled={!editMode}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Agência</Label>
                <Input 
                  placeholder="0000"
                  value={formData.agencia}
                  onChange={(e) => setFormData({ ...formData, agencia: e.target.value })}
                  disabled={!editMode}
                />
              </div>
              <div className="space-y-2">
                <Label>Conta</Label>
                <Input 
                  placeholder="00000-0"
                  value={formData.conta}
                  onChange={(e) => setFormData({ ...formData, conta: e.target.value })}
                  disabled={!editMode}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Termo de Aceite */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              Termo de Prestação de Serviços
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800">Termo Aceito</p>
                  <p className="text-sm text-green-700">
                    Você aceitou o termo de prestação de serviços autônomo em{' '}
                    {entregador.termoAceiteData?.toLocaleDateString('pt-BR') || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <Button variant="outline" className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                Visualizar Termo Completo
              </Button>
            </div>

            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Lembrete:</strong> Você atua como prestador de serviços autônomo, 
                sem vínculo empregatício. Tem total liberdade para escolher seus dias 
                e horários de trabalho.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      {editMode && (
        <div className="flex justify-end">
          <Button 
            onClick={handleSave}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      )}

      {/* Estatísticas */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Suas Estatísticas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-2xl font-bold text-foreground">{entregador.totalEntregas}</p>
              <p className="text-sm text-muted-foreground">Total Entregas</p>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-2xl font-bold text-foreground">{entregador.avaliacaoMedia?.toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">Avaliação Média</p>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-2xl font-bold text-foreground">98%</p>
              <p className="text-sm text-muted-foreground">Taxa de Conclusão</p>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-2xl font-bold text-foreground">25 min</p>
              <p className="text-sm text-muted-foreground">Tempo Médio</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
