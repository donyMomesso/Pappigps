import { z } from "zod"

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

export const delivererLoginSchema = z.object({
  codigoAcesso: z.string().optional().or(z.literal("")),
  cpf: z.string().optional().or(z.literal("")),
  telefone: z.string().optional().or(z.literal("")),
}).refine(
  (data) => {
    const hasCode = Boolean(data.codigoAcesso?.trim())
    const hasCpfAndPhone = Boolean(data.cpf?.trim() && data.telefone?.trim())
    return hasCode || hasCpfAndPhone
  },
  {
    message: "Informe o código de acesso ou CPF e telefone",
  }
)

export const entregadorSchema = z.object({
  nome: z.string().min(3),
  telefone: z.string().min(10),
  cpf: z.string().min(11),
  codigoAcesso: z.string().optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  veiculo: z.enum(["moto", "carro", "van", "caminhao", "bicicleta"]),
  placaVeiculo: z.string().optional().or(z.literal(""))
})

export const configuracoesLojaSchema = z.object({
  loja: z.object({
    id: z.string(),
    nome: z.string().min(2),
    cnpj: z.string().min(14),
    telefone: z.string().min(8),
    email: z.string().email(),
    endereco: z.object({
      logradouro: z.string(),
      numero: z.string(),
      bairro: z.string(),
      cidade: z.string(),
      uf: z.string(),
      cep: z.string(),
      complemento: z.string().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional()
    }),
    coordenadas: z.object({
      latitude: z.number(),
      longitude: z.number()
    }),
    horarioOperacao: z.object({
      domingo: z.object({ abertura: z.string(), fechamento: z.string(), ativo: z.boolean() }),
      segunda: z.object({ abertura: z.string(), fechamento: z.string(), ativo: z.boolean() }),
      terca: z.object({ abertura: z.string(), fechamento: z.string(), ativo: z.boolean() }),
      quarta: z.object({ abertura: z.string(), fechamento: z.string(), ativo: z.boolean() }),
      quinta: z.object({ abertura: z.string(), fechamento: z.string(), ativo: z.boolean() }),
      sexta: z.object({ abertura: z.string(), fechamento: z.string(), ativo: z.boolean() }),
      sabado: z.object({ abertura: z.string(), fechamento: z.string(), ativo: z.boolean() })
    }),
    raioEntregaKm: z.number().nonnegative(),
    taxaEntregaBase: z.number().nonnegative(),
    taxaPorKm: z.number().nonnegative(),
    diariaEntregador: z.number().nonnegative()
  }),
  notificacoes: z.object({
    emailNovoPedido: z.boolean(),
    smsCliente: z.boolean(),
    pushEntregador: z.boolean()
  }),
  termoFreelancer: z.string().min(10)
})
