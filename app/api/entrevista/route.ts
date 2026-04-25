import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { curriculo, historico, resposta } = await req.json()

    const isInicio = !historico || historico.length === 0

    const prompt = isInicio
      ? `Voce e um recrutador RIGOROSO e experiente brasileiro. Voce avalia candidatos de forma justa mas EXIGENTE.

Analise este curriculo e inicie uma simulacao de entrevista de emprego:

CURRICULO:
${JSON.stringify(curriculo, null, 2)}

REGRAS DE AVALIACAO:
- Faca perguntas especificas para a area/profissao do candidato
- Suas perguntas devem testar conhecimento real, nao apenas opiniao
- Adapte a dificuldade ao nivel do candidato (junior, pleno, senior)

Faca a PRIMEIRA pergunta da entrevista. Seja profissional mas direto.
Retorne SOMENTE JSON sem markdown:
{
  "pergunta": "sua pergunta aqui - deve ser especifica para a area do candidato",
  "dica": "dica curta para o candidato responder bem (max 15 palavras)"
}`
      : `Voce e um recrutador RIGOROSO e experiente brasileiro.

CURRICULO DO CANDIDATO:
${JSON.stringify(curriculo, null, 2)}

HISTORICO DA ENTREVISTA:
${historico.map((h: any) => `Recrutador: ${h.pergunta}\nCandidato: ${h.resposta}\nFeedback: ${h.feedback}`).join('\n\n')}

ULTIMA RESPOSTA DO CANDIDATO: "${resposta}"

REGRAS DE AVALIACAO RIGOROSAS:
- Se a resposta for vaga, generica, sem exemplos concretos ou sem sentido (tipo "blablabla", "nao sei", "qualquer coisa"): nota 1 a 3
- Se a resposta mostrar algum conhecimento mas for superficial: nota 4 a 5
- Se a resposta for boa com exemplos mas incompleta: nota 6 a 7
- Se a resposta for excelente com exemplos concretos e conhecimento tecnico: nota 8 a 10
- NUNCA de nota acima de 5 para respostas vagas ou sem conteudo real
- Avalie se a resposta demonstra conhecimento REAL da area profissional do candidato
- Seja honesto e construtivo - o objetivo e ajudar o candidato a melhorar
- Cada feedback deve ser UNICO e especifico para aquela resposta, nunca repita o mesmo feedback

Avalie a resposta e faca a proxima pergunta. Retorne SOMENTE JSON sem markdown:
{
  "feedback": "feedback ESPECIFICO e UNICO sobre esta resposta exata - diga exatamente o que faltou e o que deveria ter dito (2-3 frases)",
  "nota": 0,
  "pergunta": "proxima pergunta diferente das anteriores, especifica para a area",
  "encerrada": false,
  "resumoFinal": null
}

Se ja foram 5 perguntas ou mais, encerre:
{
  "feedback": "feedback da ultima resposta",
  "nota": 0,
  "pergunta": null,
  "encerrada": true,
  "resumoFinal": "Resumo honesto: pontos fortes REAIS demonstrados, pontos fracos claros, e 3 dicas praticas para melhorar nas proximas entrevistas. Seja motivador mas realista."
}

IMPORTANTE: A nota DEVE refletir a qualidade REAL da resposta. Resposta ruim = nota ruim. Nunca infle notas.`

    const chat = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.4,
    })

    const text = (chat.choices[0]?.message?.content || '').replace(/```json|```/g, '').trim()
    const data = JSON.parse(text)

    return NextResponse.json({ success: true, ...data })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, error: 'Erro na entrevista' }, { status: 500 })
  }
}