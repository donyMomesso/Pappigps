import type { Pedido, Entregador, Rota, DashboardStats, Cliente } from '@/types'

export const mockClientes: Cliente[] = [
  {
    id: '1',
    nome: 'Maria Silva',
    telefone: '(11) 99999-1111',
    email: 'maria@email.com',
    endereco: {
      logradouro: 'Rua das Flores',
      numero: '123',
      bairro: 'Centro',
      cidade: 'São Paulo',
      uf: 'SP',
      cep: '01310-100',
      latitude: -23.5505,
      longitude: -46.6333
    }
  },
  {
    id: '2',
    nome: 'João Santos',
    telefone: '(11) 99999-2222',
    email: 'joao@email.com',
    endereco: {
      logradouro: 'Av. Paulista',
      numero: '1000',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      uf: 'SP',
      cep: '01310-200',
      latitude: -23.5629,
      longitude: -46.6544
    }
  },
  {
    id: '3',
    nome: 'Ana Oliveira',
    telefone: '(11) 99999-3333',
    endereco: {
      logradouro: 'Rua Augusta',
      numero: '500',
      bairro: 'Consolação',
      cidade: 'São Paulo',
      uf: 'SP',
      cep: '01305-000',
      latitude: -23.5536,
      longitude: -46.6583
    }
  }
]

export const mockPedidos: Pedido[] = [
  {
    id: '1',
    numero: 'PED-001',
    cliente: mockClientes[0],
    endereco: mockClientes[0].endereco,
    valor: 150.00,
    formaPagamento: 'pix',
    status: 'pendente',
    dataCriacao: new Date('2024-01-15T10:30:00'),
    volumes: 2,
    peso: 3.5
  },
  {
    id: '2',
    numero: 'PED-002',
    cliente: mockClientes[1],
    endereco: mockClientes[1].endereco,
    valor: 89.90,
    formaPagamento: 'cartao',
    status: 'em_rota',
    dataCriacao: new Date('2024-01-15T11:00:00'),
    rotaId: '1',
    entregadorId: '1',
    ordemEntrega: 1,
    volumes: 1
  },
  {
    id: '3',
    numero: 'PED-003',
    cliente: mockClientes[2],
    endereco: mockClientes[2].endereco,
    valor: 220.00,
    formaPagamento: 'dinheiro',
    status: 'em_rota',
    dataCriacao: new Date('2024-01-15T09:15:00'),
    rotaId: '1',
    entregadorId: '1',
    ordemEntrega: 2,
    volumes: 3,
    peso: 8.2
  },
  {
    id: '4',
    numero: 'PED-004',
    cliente: mockClientes[0],
    endereco: {
      ...mockClientes[0].endereco,
      logradouro: 'Rua Oscar Freire',
      numero: '800',
      bairro: 'Jardins',
      latitude: -23.5617,
      longitude: -46.6691
    },
    valor: 175.50,
    formaPagamento: 'pix',
    status: 'entregue',
    dataCriacao: new Date('2024-01-15T08:00:00'),
    dataEntrega: new Date('2024-01-15T10:30:00'),
    volumes: 2
  },
  {
    id: '5',
    numero: 'PED-005',
    cliente: mockClientes[1],
    endereco: mockClientes[1].endereco,
    valor: 340.00,
    formaPagamento: 'boleto',
    status: 'pendente',
    dataCriacao: new Date('2024-01-15T12:00:00'),
    observacoes: 'Entregar após as 14h',
    volumes: 5,
    peso: 12.0
  },
  {
    id: '6',
    numero: 'PED-006',
    cliente: mockClientes[2],
    endereco: mockClientes[2].endereco,
    valor: 67.90,
    formaPagamento: 'cartao',
    status: 'cancelado',
    dataCriacao: new Date('2024-01-14T16:00:00'),
    volumes: 1
  }
]

export const mockEntregadores: Entregador[] = [
  {
    id: '1',
    nome: 'Carlos Ferreira',
    telefone: '(11) 98888-1111',
    email: 'carlos@email.com',
    cpf: '123.456.789-00',
    veiculo: 'moto',
    placaVeiculo: 'ABC-1234',
    status: 'em_rota',
    avaliacaoMedia: 4.8,
    totalEntregas: 342,
    dataCadastro: new Date('2023-06-10')
  },
  {
    id: '2',
    nome: 'Pedro Almeida',
    telefone: '(11) 98888-2222',
    email: 'pedro@email.com',
    cpf: '987.654.321-00',
    veiculo: 'carro',
    placaVeiculo: 'XYZ-5678',
    status: 'disponivel',
    avaliacaoMedia: 4.5,
    totalEntregas: 156,
    dataCadastro: new Date('2023-09-20')
  },
  {
    id: '3',
    nome: 'Lucas Mendes',
    telefone: '(11) 98888-3333',
    cpf: '456.789.123-00',
    veiculo: 'van',
    placaVeiculo: 'VAN-9012',
    status: 'disponivel',
    avaliacaoMedia: 4.9,
    totalEntregas: 89,
    dataCadastro: new Date('2023-11-05')
  },
  {
    id: '4',
    nome: 'Roberto Costa',
    telefone: '(11) 98888-4444',
    cpf: '789.123.456-00',
    veiculo: 'moto',
    placaVeiculo: 'MOT-3456',
    status: 'offline',
    avaliacaoMedia: 4.2,
    totalEntregas: 67,
    dataCadastro: new Date('2023-12-01')
  }
]

export const mockRotas: Rota[] = [
  {
    id: '1',
    nome: 'Rota Centro - Manhã',
    entregador: mockEntregadores[0],
    pedidos: [mockPedidos[1], mockPedidos[2]],
    distanciaTotal: 12.5,
    tempoEstimado: 45,
    status: 'em_andamento',
    dataCriacao: new Date('2024-01-15T08:00:00'),
    dataInicio: new Date('2024-01-15T09:00:00')
  },
  {
    id: '2',
    nome: 'Rota Jardins - Tarde',
    pedidos: [mockPedidos[0], mockPedidos[4]],
    distanciaTotal: 8.3,
    tempoEstimado: 35,
    status: 'planejada',
    dataCriacao: new Date('2024-01-15T11:00:00')
  }
]

export const mockDashboardStats: DashboardStats = {
  pedidosHoje: 24,
  pedidosPendentes: 8,
  pedidosEmRota: 10,
  pedidosEntregues: 6,
  entregadoresAtivos: 3,
  rotasAtivas: 2,
  faturamentoHoje: 4580.50,
  ticketMedio: 190.85
}

export const mockFinanceiroData = {
  resumoMensal: {
    periodo: 'Janeiro 2024',
    faturamentoBruto: 45800.00,
    custoEntregas: 12500.00,
    lucroLiquido: 33300.00,
    totalPedidos: 240,
    ticketMedio: 190.83,
    taxaEntrega: 8.50
  },
  faturamentoPorDia: [
    { dia: '01', valor: 1250 },
    { dia: '02', valor: 1480 },
    { dia: '03', valor: 1120 },
    { dia: '04', valor: 1890 },
    { dia: '05', valor: 2100 },
    { dia: '06', valor: 1650 },
    { dia: '07', valor: 980 },
    { dia: '08', valor: 1340 },
    { dia: '09', valor: 1560 },
    { dia: '10', valor: 1780 },
    { dia: '11', valor: 2050 },
    { dia: '12', valor: 1920 },
    { dia: '13', valor: 1100 },
    { dia: '14', valor: 1450 },
    { dia: '15', valor: 1580 }
  ]
}

export const mockConfiguracoes = {
  empresa: {
    nome: 'PappiGPS Entregas',
    cnpj: '12.345.678/0001-90',
    telefone: '(11) 3333-4444',
    email: 'contato@pappigps.com.br',
    endereco: {
      logradouro: 'Av. Brasil',
      numero: '1500',
      bairro: 'Centro',
      cidade: 'São Paulo',
      uf: 'SP',
      cep: '01430-001'
    }
  },
  operacao: {
    horarioInicio: '08:00',
    horarioFim: '20:00',
    diasFuncionamento: [1, 2, 3, 4, 5, 6],
    raioMaximoKm: 30,
    taxaEntregaBase: 8.00,
    taxaPorKm: 1.50
  },
  notificacoes: {
    emailNovoPedido: true,
    smsCliente: true,
    pushEntregador: true
  }
}
