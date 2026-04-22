import { NextRequest, NextResponse } from 'next/server'
import { getIntegrations, saveIntegrations } from '@/lib/server/repositories'
import type { IntegracaoPlataforma } from '@/types'

// GET - Listar integrações
export async function GET() {
  const integracoes = await getIntegrations()
  return NextResponse.json(integracoes)
}

// POST - Atualizar integração
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { id, storeId, apiKey, ativo } = data
    const integracoes = await getIntegrations()

    const integracao = integracoes.find(i => i.id === id)
    if (!integracao) {
      return NextResponse.json(
        { error: 'Integração não encontrada' },
        { status: 404 }
      )
    }

    // Atualizar dados mantendo exatamente o que foi digitado
    if (typeof storeId === 'string') {
      integracao.storeId = storeId.trim()
    }
    if (typeof apiKey === 'string') {
      integracao.apiKey = apiKey.trim()
    }
    if (typeof ativo === 'boolean') {
      integracao.ativo = ativo
    }

    // Simular teste de conexão
    if (integracao.ativo && integracao.storeId && integracao.apiKey) {
      integracao.status = 'conectado'
      integracao.ultimaSincronizacao = new Date()
    } else {
      integracao.status = 'desconectado'
    }

    await saveIntegrations(integracoes)

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
    const integracoes = await getIntegrations()

    const integracao = integracoes.find(i => i.id === id)
    if (!integracao) {
      return NextResponse.json(
        { error: 'Integração não encontrada' },
        { status: 404 }
      )
    }

    // Simular teste de conexão
    const testSuccess = Boolean(integracao.storeId?.trim() && integracao.apiKey?.trim())

    integracao.status = testSuccess ? 'conectado' : 'erro'
    integracao.ultimaSincronizacao = testSuccess ? new Date() : undefined
    await saveIntegrations(integracoes)

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
