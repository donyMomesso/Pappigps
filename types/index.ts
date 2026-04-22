// Enums
export type StatusPedido = 'pendente' | 'em_preparo' | 'em_rota' | 'entregue' | 'cancelado'
export type StatusEntregador = 'disponivel' | 'em_rota' | 'offline' | 'pausado'
export type TipoVeiculo = 'moto' | 'carro' | 'van' | 'caminhao' | 'bicicleta'
export type FormaPagamento = 'dinheiro' | 'pix' | 'cartao' | 'boleto'
export type TipoContrato = 'freelancer' | 'fixo'

// Interfaces
export interface Coordenadas {
  latitude: number
  longitude: number
}

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

export interface TaxaEntrega {
  id: string
  pedidoId: string
  valorBase: number
  valorPorKm: number
  distanciaKm: number
  valorTotal: number
  dataPagamento?: Date
  pago: boolean
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
  trackingToken?: string
  taxaEntrega?: TaxaEntrega
}

export interface LocalizacaoEntregador {
  entregadorId: string
  coordenadas: Coordenadas
  timestamp: Date
  velocidade?: number
  direcao?: number
  precisao?: number
}

export interface AgendamentoDisponibilidade {
  id: string
  entregadorId: string
  data: Date
  horaInicio: string
  horaFim: string
  tipo: 'dia_completo' | 'periodo' | 'entrega_avulsa'
  confirmado: boolean
}

export interface TermoAceite {
  id: string
  entregadorId: string
  versao: string
  dataAceite: Date
  ipAceite: string
  textoTermo: string
}

export interface FinanceiroEntregador {
  entregadorId: string
  periodo: string
  totalEntregas: number
  totalKmRodados: number
  ganhosTaxas: number
  bonificacoes: number
  descontos: number
  diaria: number
  totalLiquido: number
  saldoDisponivel: number
  historicoSaques: SaqueEntregador[]
}

export interface SaqueEntregador {
  id: string
  entregadorId: string
  valor: number
  dataSolicitacao: Date
  dataPagamento?: Date
  status: 'pendente' | 'aprovado' | 'pago' | 'cancelado'
  chavePix?: string
  banco?: string
  agencia?: string
  conta?: string
}

export interface Entregador {
  id: string
  nome: string
  telefone: string
  email?: string
  cpf: string
  codigoAcesso?: string
  veiculo: TipoVeiculo
  placaVeiculo?: string
  status: StatusEntregador
  avatar?: string
  avaliacaoMedia?: number
  totalEntregas?: number
  dataCadastro: Date
  tipoContrato: TipoContrato
  termoAceito: boolean
  termoAceiteData?: Date
  localizacaoAtual?: LocalizacaoEntregador
  agendamentos?: AgendamentoDisponibilidade[]
  financeiro?: FinanceiroEntregador
  chavePix?: string
  banco?: string
  agencia?: string
  conta?: string
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
  valorTotalTaxas?: number
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

export interface HorarioOperacao {
  abertura: string
  fechamento: string
  ativo: boolean
}

export interface Loja {
  id: string
  nome: string
  cnpj: string
  telefone: string
  email: string
  endereco: Endereco
  coordenadas: Coordenadas
  horarioOperacao: {
    domingo: HorarioOperacao
    segunda: HorarioOperacao
    terca: HorarioOperacao
    quarta: HorarioOperacao
    quinta: HorarioOperacao
    sexta: HorarioOperacao
    sabado: HorarioOperacao
  }
  raioEntregaKm: number
  taxaEntregaBase: number
  taxaPorKm: number
  diariaEntregador: number
}

export interface Configuracoes {
  loja: Loja
  notificacoes: {
    emailNovoPedido: boolean
    smsCliente: boolean
    pushEntregador: boolean
  }
  termoFreelancer: string
}

export interface IntegracaoPlataforma {
  id: string
  nome: string
  plataforma: 'ifood' | '99food' | 'ubereats' | 'rappi' | 'outro'
  ativo: boolean
  storeId: string
  apiKey: string
  webhookUrl: string
  ultimaSincronizacao?: Date
  ultimoPedidoRecebidoEm?: Date
  ultimoPedidoRecebidoId?: string
  ultimoErroWebhook?: string
  webhookEvents?: {
    id: string
    tipo: "pedido_recebido" | "erro" | "validacao"
    mensagem: string
    criadoEm: Date
  }[]
  status: 'conectado' | 'desconectado' | 'erro'
}

export interface PedidoPlataforma {
  plataforma: string
  orderId: string
  pedido: Pedido
  recebidoEm: Date
  processado: boolean
}
