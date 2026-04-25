import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { nome, email, telefone, cidade, objetivo, experiencias, formacao, habilidades, cursos, disponibilidade, modalidade, semExperiencia } = await req.json()

    const prompt = `Voce e um especialista em RH brasileiro. Gere um curriculo profissional completo em portugues para a seguinte pessoa.

DADOS:
- Nome: ${nome}
- Email: ${email}
- Telefone: ${telefone}
- Cidade: ${cidade}
- Objetivo profissional: ${objetivo}
- Experiencias: ${semExperiencia ? 'Nenhuma ainda (primeiro emprego)' : experiencias}
- Formacao: ${formacao}
- Habilidades: ${habilidades}
- Cursos e certificacoes: ${cursos || 'Nenhum informado'}
- Disponibilidade para inicio: ${disponibilidade || 'Nao informado'}
- Modalidade preferida: ${modalidade || 'Nao informado'}

INSTRUCOES:
- Se nao tiver experiencia, destaque habilidades, cursos, trabalhos voluntarios, projetos pessoais
- Seja profissional mas acessivel
- Use verbos de acao (desenvolveu, criou, gerenciou, etc.)
- Retorne APENAS o JSON abaixo, sem markdown, sem explicacoes:

{
  "resumo": "2-3 frases de apresentacao profissional forte",
  "objetivo": "frase clara de objetivo",
  "experiencias": [
    { "cargo": "", "empresa": "", "periodo": "", "descricao": "" }
  ],
  "formacao": [
    { "curso": "", "instituicao": "", "periodo": "" }
  ],
  "habilidades": [
    { "nome": "Nome da habilidade", "nivel": 75 }
  ],
  "idiomas": [
    { "nome": "Portugues", "nivel": "Nativo", "porcentagem": 100 }
  ],
  "diferenciais": ["diferencial1", "diferencial2"],
  "certificacoes": ["Nome do curso ou certificado — Plataforma/Instituicao"],
  "softskills": ["🤝 Trabalho em equipe", "💡 Proatividade", "🎯 Foco em resultados", "🧠 Pensamento analítico", "🗣️ Comunicação clara"]
}

INSTRUCOES PARA HABILIDADES (nivel 0-100):
- Mencionar que usa muito / trabalha com = 70-80
- Curso basico ou iniciante = 35-55
- Curso intermediario = 55-70
- Avancado / especialista / certificado = 80-92
- Incluir ao menos 4 habilidades relevantes para a vaga

INSTRUCOES PARA IDIOMAS:
- Sempre incluir Portugues como Nativo (porcentagem: 100)
- Se o usuario mencionar outro idioma, incluir com nivel e porcentagem adequados
- Basico=30, Intermediario=60, Avancado=80, Fluente=93, Nativo=100

INSTRUCOES PARA CERTIFICACOES:
- Extrair TODOS os cursos, certificados, treinamentos mencionados em qualquer campo
- Formato: "Nome do Curso — Instituicao/Plataforma" ou so o nome se nao tiver instituicao
- Se nenhum curso/certificado foi mencionado, retornar array vazio []
- Nao incluir formacao academica formal aqui (so cursos extras)

INSTRUCOES PARA SOFTSKILLS (MUITO IMPORTANTE):
- Gerar EXATAMENTE 5 soft skills altamente relevantes para a area profissional da pessoa
- Cada item: emoji unicode + espaco + texto (ex: "🤝 Trabalho em equipe")
- Escolher emojis e textos especificos para a area (ex: dados = 📊 Orientado a dados; vendas = 🏆 Orientado a resultados)
- Nao repetir; variar entre interpessoais, cognitivas e comportamentais
- Opcoes de emojis: 🤝 💡 🎯 🧠 📊 🗣️ 🏆 ⚡ 🔍 📈 🤔 💬 🌟 🔧 📝 🚀 ⏰ 🎨 🤖 💻 🌐 🧩 📌 🔄

${semExperiencia ? 'IMPORTANTE: Como nao tem experiencia, coloque array vazio em experiencias e destaque muito os diferenciais.' : ''}`

    const chat = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
    })

    const text = (chat.choices[0]?.message?.content || '').replace(/```json|```/g, '').trim()
    const curriculo = JSON.parse(text)

    return NextResponse.json({ success: true, curriculo, nome, email, telefone, cidade })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, error: 'Erro ao gerar curriculo' }, { status: 500 })
  }
}
