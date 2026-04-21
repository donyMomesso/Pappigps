"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Calendar, 
  Plus, 
  Clock, 
  Check, 
  X,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { mockAgendamentos, mockLoja } from '@/mocks/data'
import type { AgendamentoDisponibilidade } from '@/types'

const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

export default function AgendaPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [agendamentos, setAgendamentos] = useState<AgendamentoDisponibilidade[]>(mockAgendamentos)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [novoAgendamento, setNovoAgendamento] = useState({
    tipo: 'dia_completo' as 'dia_completo' | 'periodo' | 'entrega_avulsa',
    horaInicio: '08:00',
    horaFim: '18:00'
  })

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    
    const days: (Date | null)[] = []
    
    for (let i = 0; i < startingDay; i++) {
      days.push(null)
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    
    return days
  }

  const getAgendamentosForDate = (date: Date) => {
    return agendamentos.filter(a => {
      const agDate = new Date(a.data)
      return agDate.toDateString() === date.toDateString()
    })
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleAddAgendamento = () => {
    if (!selectedDate) return

    const newAgendamento: AgendamentoDisponibilidade = {
      id: `ag-${Date.now()}`,
      entregadorId: localStorage.getItem('entregadorId') || '1',
      data: selectedDate,
      horaInicio: novoAgendamento.tipo === 'dia_completo' ? '08:00' : novoAgendamento.horaInicio,
      horaFim: novoAgendamento.tipo === 'dia_completo' ? '22:00' : novoAgendamento.horaFim,
      tipo: novoAgendamento.tipo,
      confirmado: false
    }

    setAgendamentos([...agendamentos, newAgendamento])
    setDialogOpen(false)
    setNovoAgendamento({
      tipo: 'dia_completo',
      horaInicio: '08:00',
      horaFim: '18:00'
    })
  }

  const handleRemoveAgendamento = (id: string) => {
    setAgendamentos(agendamentos.filter(a => a.id !== id))
  }

  const days = getDaysInMonth(currentDate)
  const today = new Date()

  return (
    <div className="p-4 lg:p-6 pb-24 lg:pb-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Minha Agenda</h1>
        <p className="text-muted-foreground">
          Gerencie sua disponibilidade de forma livre e flexível
        </p>
      </div>

      {/* Aviso */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-800">Agendamento Livre</p>
              <p className="text-blue-700">
                O agendamento é opcional e não gera obrigatoriedade. Você pode cancelar 
                com até 2 horas de antecedência sem penalidades.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendário */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              {meses[currentDate.getMonth()]} {currentDate.getFullYear()}
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Dias da semana */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {diasSemana.map(dia => (
              <div key={dia} className="text-center text-xs font-medium text-muted-foreground py-2">
                {dia}
              </div>
            ))}
          </div>

          {/* Dias do mês */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              if (!day) {
                return <div key={index} className="aspect-square" />
              }

              const isToday = day.toDateString() === today.toDateString()
              const isPast = day < today && !isToday
              const isSelected = selectedDate?.toDateString() === day.toDateString()
              const dayAgendamentos = getAgendamentosForDate(day)
              const hasAgendamento = dayAgendamentos.length > 0

              return (
                <button
                  key={index}
                  onClick={() => !isPast && setSelectedDate(day)}
                  disabled={isPast}
                  className={`
                    aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-colors relative
                    ${isPast ? 'text-muted-foreground/50 cursor-not-allowed' : 'hover:bg-muted cursor-pointer'}
                    ${isToday ? 'bg-emerald-100 text-emerald-700 font-bold' : ''}
                    ${isSelected ? 'ring-2 ring-emerald-500 bg-emerald-50' : ''}
                  `}
                >
                  {day.getDate()}
                  {hasAgendamento && (
                    <div className="absolute bottom-1 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  )}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detalhes do Dia Selecionado */}
      {selectedDate && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">
                  {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </CardTitle>
                <CardDescription>
                  Horário de operação: {mockLoja.horarioOperacao.segunda.abertura} - {mockLoja.horarioOperacao.segunda.fechamento}
                </CardDescription>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Agendar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Agendar Disponibilidade</DialogTitle>
                    <DialogDescription>
                      Selecione o tipo e horário de disponibilidade para {selectedDate.toLocaleDateString('pt-BR')}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Tipo de Agendamento</Label>
                      <Select 
                        value={novoAgendamento.tipo}
                        onValueChange={(value: 'dia_completo' | 'periodo' | 'entrega_avulsa') => 
                          setNovoAgendamento({ ...novoAgendamento, tipo: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dia_completo">Dia Completo</SelectItem>
                          <SelectItem value="periodo">Período Específico</SelectItem>
                          <SelectItem value="entrega_avulsa">Entrega Avulsa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {novoAgendamento.tipo !== 'dia_completo' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Hora Início</Label>
                          <Select 
                            value={novoAgendamento.horaInicio}
                            onValueChange={(value) => setNovoAgendamento({ ...novoAgendamento, horaInicio: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 15 }, (_, i) => i + 8).map(h => (
                                <SelectItem key={h} value={`${h.toString().padStart(2, '0')}:00`}>
                                  {`${h.toString().padStart(2, '0')}:00`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Hora Fim</Label>
                          <Select 
                            value={novoAgendamento.horaFim}
                            onValueChange={(value) => setNovoAgendamento({ ...novoAgendamento, horaFim: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 15 }, (_, i) => i + 8).map(h => (
                                <SelectItem key={h} value={`${h.toString().padStart(2, '0')}:00`}>
                                  {`${h.toString().padStart(2, '0')}:00`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAddAgendamento} className="bg-emerald-600 hover:bg-emerald-700">
                      Confirmar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {getAgendamentosForDate(selectedDate).length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Nenhum agendamento para este dia</p>
                <p className="text-sm">Clique em Agendar para registrar sua disponibilidade</p>
              </div>
            ) : (
              <div className="space-y-3">
                {getAgendamentosForDate(selectedDate).map(ag => (
                  <div 
                    key={ag.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        ag.confirmado ? 'bg-green-100' : 'bg-amber-100'
                      }`}>
                        {ag.confirmado ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-amber-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {ag.tipo === 'dia_completo' ? 'Dia Completo' : 
                           ag.tipo === 'periodo' ? 'Período' : 'Entrega Avulsa'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {ag.horaInicio} - {ag.horaFim}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={ag.confirmado ? 'default' : 'secondary'}>
                        {ag.confirmado ? 'Confirmado' : 'Pendente'}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleRemoveAgendamento(ag.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Próximos Agendamentos */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Próximos Agendamentos</CardTitle>
          <CardDescription>Sua disponibilidade agendada</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {agendamentos
              .filter(a => new Date(a.data) >= today)
              .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
              .slice(0, 5)
              .map(ag => (
                <div 
                  key={ag.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex flex-col items-center justify-center">
                      <span className="text-xs text-emerald-600">
                        {new Date(ag.data).toLocaleDateString('pt-BR', { weekday: 'short' })}
                      </span>
                      <span className="text-lg font-bold text-emerald-700">
                        {new Date(ag.data).getDate()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {ag.tipo === 'dia_completo' ? 'Dia Completo' : 
                         ag.tipo === 'periodo' ? 'Período' : 'Entrega Avulsa'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {ag.horaInicio} - {ag.horaFim}
                      </p>
                    </div>
                  </div>
                  <Badge variant={ag.confirmado ? 'default' : 'secondary'}>
                    {ag.confirmado ? 'Confirmado' : 'Pendente'}
                  </Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
