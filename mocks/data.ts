import type { Pedido, Entregador, Rota, DashboardStats, Cliente, Loja, FinanceiroEntregador, AgendamentoDisponibilidade, LocalizacaoEntregador } from '@/types'

export const TERMO_FREELANCER = `
TERMO DE PRESTAÇÃO DE SERVIÇOS AUTÔNOMO

Pelo presente instrumento, o PRESTADOR DE SERVIÇOS declara estar ciente e de acordo com os seguintes termos:

1. DA NATUREZA DA RELAÇÃO
1.1. O presente termo estabelece uma relação de prestação de serviços autônoma, sem qualquer vínculo empregatício com a CONTRATANTE.
1.2. O PRESTADOR atua como profissional autônomo/freelancer, tendo total liberdade para:
   - Escolher os dias e horários de trabalho
   - Aceitar ou recusar entregas oferecidas
   - Prestar serviços para outras empresas simultaneamente
   - Definir sua disponibilidade através do sistema de agendamento

2. DA AUTONOMIA E LIBERDADE
2.1. Não há obrigatoriedade de cumprimento de carga horária mínima ou máxima.
2.2. O PRESTADOR pode interromper suas atividades a qualquer momento, sem necessidade de justificativa.
2.3. A aceitação de cada entrega é opcional e fica a critério exclusivo do PRESTADOR.

3. DA REMUNERAÇÃO
3.1. O pagamento será realizado por entrega efetuada, conforme tabela de taxas vigente.
3.2. O PRESTADOR é responsável por seus próprios encargos fiscais e previdenciários.
3.3. Não há salário fixo, férias, 13º salário ou quaisquer benefícios trabalhistas.

4. DAS RESPONSABILIDADES
4.1. O PRESTADOR é responsável por:
   - Manter veículo próprio em condições adequadas
   - Possuir habilitação válida (quando aplicável)
   - Manter documentação regularizada
   - Zelar pela integridade das entregas

5. DO AGENDAMENTO
5.1. O sistema permite agendamento prévio de disponibilidade.
5.2. O agendamento não gera obrigação de exclusividade.
5.3. Cancelamentos devem ser feitos com antecedência mínima de 2 horas.

6. DA RESCISÃO
6.1. Qualquer das partes pode encerrar a relação a qualquer momento, sem ônus.

Declaro ter lido, compreendido e estar de acordo com todos os termos acima.
`

export const mockLoja: Loja = {
  id: '1',
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
    cep: '01430-001',
    latitude: -23.5489,
    longitude: -46.6388
  },
  coordenadas: {
    latitude: -23.5489,
    longitude: -46.6388
  },
  horarioOperacao: {
    domingo: { abertura: '00:00', fechamento: '00:00', ativo: false },
    segunda: { abertura: '08:00', fechamento: '22:00', ativo: true },
    terca: { abertura: '08:00', fechamento: '22:00', ativo: true },
    quarta: { abertura: '08:00', fechamento: '22:00', ativo: true },
    quinta: { abertura: '08:00', fechamento: '22:00', ativo: true },
    sexta: { abertura: '08:00', fechamento: '23:00', ativo: true },
    sabado: { abertura: '10:00', fechamento: '23:00', ativo: true }
  },
  raioEntregaKm: 30,
  taxaEntregaBase: 8.00,
  taxaPorKm: 1.50,
  diariaEntregador: 50.00
}

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
    peso: 3.5,
    taxaEntrega: {
      id: 'tx-1',
      pedidoId: '1',
      valorBase: 8.00,
      valorPorKm: 1.50,
      distanciaKm: 5.2,
      valorTotal: 15.80,
      pago: false
    }
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
    volumes: 1,
    taxaEntrega: {
      id: 'tx-2',
      pedidoId: '2',
      valorBase: 8.00,
      valorPorKm: 1.50,
      distanciaKm: 3.8,
      valorTotal: 13.70,
      pago: false
    }
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
    peso: 8.2,
    taxaEntrega: {
      id: 'tx-3',
      pedidoId: '3',
      valorBase: 8.00,
      valorPorKm: 1.50,
      distanciaKm: 4.5,
      valorTotal: 14.75,
      pago: false
    }
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
    volumes: 2,
    taxaEntrega: {
      id: 'tx-4',
      pedidoId: '4',
      valorBase: 8.00,
      valorPorKm: 1.50,
      distanciaKm: 6.1,
      valorTotal: 17.15,
      pago: true,
      dataPagamento: new Date('2024-01-15T12:00:00')
    }
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
    peso: 12.0,
    taxaEntrega: {
      id: 'tx-5',
      pedidoId: '5',
      valorBase: 8.00,
      valorPorKm: 1.50,
      distanciaKm: 3.8,
      valorTotal: 13.70,
      pago: false
    }
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

export const mockLocalizacoesEntregadores: LocalizacaoEntregador[] = [
  {
    entregadorId: '1',
    coordenadas: { latitude: -23.5550, longitude: -46.6450 },
    timestamp: new Date(),
    velocidade: 35,
    direcao: 180,
    precisao: 10
  },
  {
    entregadorId: '2',
    coordenadas: { latitude: -23.5600, longitude: -46.6500 },
    timestamp: new Date(),
    velocidade: 0,
    precisao: 5
  }
]

export const mockAgendamentos: AgendamentoDisponibilidade[] = [
  {
    id: 'ag-1',
    entregadorId: '1',
    data: new Date('2024-01-16'),
    horaInicio: '08:00',
    horaFim: '18:00',
    tipo: 'dia_completo',
    confirmado: true
  },
  {
    id: 'ag-2',
    entregadorId: '1',
    data: new Date('2024-01-17'),
    horaInicio: '14:00',
    horaFim: '22:00',
    tipo: 'periodo',
    confirmado: true
  },
  {
    id: 'ag-3',
    entregadorId: '2',
    data: new Date('2024-01-16'),
    horaInicio: '10:00',
    horaFim: '16:00',
    tipo: 'periodo',
    confirmado: false
  }
]

export const mockFinanceiroEntregador: FinanceiroEntregador = {
  entregadorId: '1',
  periodo: 'Janeiro 2024',
  totalEntregas: 87,
  totalKmRodados: 342.5,
  ganhosTaxas: 1250.80,
  bonificacoes: 150.00,
  descontos: 25.00,
  diaria: 750.00,
  totalLiquido: 2125.80,
  saldoDisponivel: 875.30,
  historicoSaques: [
    {
      id: 'sq-1',
      entregadorId: '1',
      valor: 500.00,
      dataSolicitacao: new Date('2024-01-10'),
      dataPagamento: new Date('2024-01-11'),
      status: 'pago',
      chavePix: 'carlos@email.com'
    },
    {
      id: 'sq-2',
      entregadorId: '1',
      valor: 750.50,
      dataSolicitacao: new Date('2024-01-14'),
      dataPagamento: new Date('2024-01-15'),
      status: 'pago',
      chavePix: 'carlos@email.com'
    }
  ]
}

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
    dataCadastro: new Date('2023-06-10'),
    tipoContrato: 'freelancer',
    termoAceito: true,
    termoAceiteData: new Date('2023-06-10'),
    localizacaoAtual: mockLocalizacoesEntregadores[0],
    agendamentos: mockAgendamentos.filter(a => a.entregadorId === '1'),
    financeiro: mockFinanceiroEntregador,
    chavePix: 'carlos@email.com'
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
    dataCadastro: new Date('2023-09-20'),
    tipoContrato: 'freelancer',
    termoAceito: true,
    termoAceiteData: new Date('2023-09-20'),
    localizacaoAtual: mockLocalizacoesEntregadores[1],
    agendamentos: mockAgendamentos.filter(a => a.entregadorId === '2'),
    chavePix: '98765432100'
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
    dataCadastro: new Date('2023-11-05'),
    tipoContrato: 'freelancer',
    termoAceito: true,
    termoAceiteData: new Date('2023-11-05'),
    banco: 'Nubank',
    agencia: '0001',
    conta: '12345678-9'
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
    dataCadastro: new Date('2023-12-01'),
    tipoContrato: 'freelancer',
    termoAceito: false
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
    dataInicio: new Date('2024-01-15T09:00:00'),
    valorTotalTaxas: 28.45
  },
  {
    id: '2',
    nome: 'Rota Jardins - Tarde',
    pedidos: [mockPedidos[0], mockPedidos[4]],
    distanciaTotal: 8.3,
    tempoEstimado: 35,
    status: 'planejada',
    dataCriacao: new Date('2024-01-15T11:00:00'),
    valorTotalTaxas: 29.50
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
  ],
  pagamentosEntregadores: [
    { entregadorId: '1', nome: 'Carlos Ferreira', totalPago: 2125.80, entregas: 87 },
    { entregadorId: '2', nome: 'Pedro Almeida', totalPago: 1450.30, entregas: 62 },
    { entregadorId: '3', nome: 'Lucas Mendes', totalPago: 980.00, entregas: 45 },
    { entregadorId: '4', nome: 'Roberto Costa', totalPago: 650.20, entregas: 28 }
  ]
}

export const mockConfiguracoes = {
  loja: mockLoja,
  notificacoes: {
    emailNovoPedido: true,
    smsCliente: true,
    pushEntregador: true
  },
  termoFreelancer: TERMO_FREELANCER
}
