import { NextRequest, NextResponse } from 'next/server'
import type { IntegracaoPlataforma } from '@/types'

// Mock de integrações (em produção, seria banco de dados)
let integracoes: IntegracaoPlataforma[] = [
  {
    id: 'ifood_001',
    nome: 'iFood',
    plataforma: 'ifood',
    ativo: false,
    storeId: '',
    apiKey: '',
    webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/webhooks/ifood`,
    status: 'desconectado'
  },
  {
    id: '99food_001',
    nome: '99Food',
    plataforma: '99food',
    ativo: false,
    storeId: '',
    apiKey: '',
    webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/webhooks/99food`,
    status: 'desconectado'
  }
]

// GET - Listar integrações
export async function GET() {
  return NextResponse.json(integracoes)
}

// POST - Atualizar integração
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { id, storeId, apiKey, ativo } = data

    const integracao = integracoes.find(i => i.id === id)
    if (!integracao) {
      return NextResponse.json(
        { error: 'Integração não encontrada' },
        { status: 404 }
      )
    }

    // Atualizar dados
    integracao.storeId = storeId || integracao.storeId
    integracao.apiKey = apiKey || integracao.apiKey
    integracao.ativo = ativo !== undefined ? ativo : integracao.ativo

    // Simular teste de conexão
    if (integracao.ativo && integracao.storeId && integracao.apiKey) {
      integracao.status = 'conectado'
      integracao.ultimaSincronizacao = new Date()
    } else {
      integracao.status = 'desconectado'
    }

    return NextResponse.json(integracao)

  } catch (error) {
    console.error('Erro ao atualizar integração:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT - Testar integração
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { id } = data

    const integracao = integracoes.find(i => i.id === id)
    if (!integracao) {
      return NextResponse.json(
        { error: 'Integração não encontrada' },
        { status: 404 }
      )
    }

    // Simular teste de conexão
    const testSuccess = integracao.storeId && integracao.apiKey

    integracao.status = testSuccess ? 'conectado' : 'erro'
    integracao.ultimaSincronizacao = testSuccess ? new Date() : undefined

    return NextResponse.json({
      success: testSuccess,
      message: testSuccess ? 'Conexão estabelecida com sucesso' : 'Falha na conexão. Verifique Store ID e API Key'
    })

  } catch (error) {
    console.error('Erro ao testar integração:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}