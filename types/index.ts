// Enums
export type StatusPedido = 'pendente' | 'em_rota' | 'entregue' | 'cancelado'
export type StatusEntregador = 'disponivel' | 'em_rota' | 'offline'
export type TipoVeiculo = 'moto' | 'carro' | 'van' | 'caminhao'
export type FormaPagamento = 'dinheiro' | 'pix' | 'cartao' | 'boleto'

// Interfaces
export interface Endereco {
  logradouro: string
  numero: string
  bairro: string
  cidade: string
  uf: string
  cep: string
  complemento?: string
  latitude?: number
  longitude?: number
}

export interface Cliente {
  id: string
  nome: string
  telefone: string
  email?: string
  endereco: Endereco
}

export interface Pedido {
  id: string
  numero: string
  cliente: Cliente
  endereco: Endereco
  valor: number
  formaPagamento: FormaPagamento
  status: StatusPedido
  dataCriacao: Date
  dataEntrega?: Date
  observacoes?: string
  peso?: number
  volumes?: number
  rotaId?: string
  entregadorId?: string
  ordemEntrega?: number
}

export interface Entregador {
  id: string
  nome: string
  telefone: string
  email?: string
  cpf: string
  veiculo: TipoVeiculo
  placaVeiculo?: string
  status: StatusEntregador
  avatar?: string
  avaliacaoMedia?: number
  totalEntregas?: number
  dataCadastro: Date
}

export interface Rota {
  id: string
  nome: string
  entregador?: Entregador
  pedidos: Pedido[]
  distanciaTotal: number
  tempoEstimado: number
  status: 'planejada' | 'em_andamento' | 'finalizada'
  dataCriacao: Date
  dataInicio?: Date
  dataFim?: Date
}

export interface DashboardStats {
  pedidosHoje: number
  pedidosPendentes: number
  pedidosEmRota: number
  pedidosEntregues: number
  entregadoresAtivos: number
  rotasAtivas: number
  faturamentoHoje: number
  ticketMedio: number
}

export interface FinanceiroResumo {
  periodo: string
  faturamentoBruto: number
  custoEntregas: number
  lucroLiquido: number
  totalPedidos: number
  ticketMedio: number
  taxaEntrega: number
}

export interface Configuracoes {
  empresa: {
    nome: string
    cnpj: string
    telefone: string
    email: string
    endereco: Endereco
  }
  operacao: {
    horarioInicio: string
    horarioFim: string
    diasFuncionamento: number[]
    raioMaximoKm: number
    taxaEntregaBase: number
    taxaPorKm: number
  }
  notificacoes: {
    emailNovoPedido: boolean
    smsCliente: boolean
    pushEntregador: boolean
  }
}
