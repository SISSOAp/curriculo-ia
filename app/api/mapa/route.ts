import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { curriculo, nome } = await req.json()

    const prompt = `Voce e um consultor de carreira brasileiro especializado. Analise o curriculo abaixo e crie um plano de emprego detalhado e personalizado.

CURRICULO:
${JSON.stringify(curriculo, null, 2)}

NOME: ${nome}

Retorne APENAS o JSON abaixo sem markdown:
{
  "vagas": ["cargo1", "cargo2", "cargo3", "cargo4"],
  "habilidades": [
    { "nome": "Nome da habilidade", "prioridade": "alta", "motivo": "Por que e importante para esta area" }
  ],
  "cursos": [
    { "nome": "Nome do curso especifico", "plataforma": "Plataforma (ex: YouTube Gratuito, Alura, Coursera, Senac)", "prazo": "30 dias" }
  ],
  "linkedin": [
    "Dica especifica para o perfil desta pessoa"
  ],
  "networking": [
    "Estrategia especifica de networking para esta area"
  ],
  "plano": {
    "dias30": ["acao concreta 1", "acao concreta 2", "acao concreta 3"],
    "dias60": ["acao concreta 1", "acao concreta 2", "acao concreta 3"],
    "dias90": ["acao concreta 1", "acao concreta 2", "acao concreta 3"]
  }
}

REGRAS OBRIGATORIAS:
- Seja especifico para a area do candidato — NUNCA generico
- vagas: exatamente 4 cargos realistas e alcancaveis para este perfil
- habilidades: 4 habilidades prioritarias para desenvolver (prioridade: "alta" ou "media")
- cursos: 3-4 cursos com nomes reais e plataformas reais (Youtube, Alura, Coursera, Udemy, Senac, etc)
- linkedin: 4 dicas praticas e especificas
- networking: 3 estrategias especificas para a area desta pessoa
- plano: acoes concretas, alcancaveis e medidas para cada periodo`

    const chat = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.6,
    })

    const text = (chat.choices[0]?.message?.content || '').replace(/```json|```/g, '').trim()
    const data = JSON.parse(text)

    return NextResponse.json({ success: true, ...data })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, error: 'Erro ao gerar mapa' }, { status: 500 })
  }
}
