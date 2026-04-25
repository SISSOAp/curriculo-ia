'use client'
import { useState } from 'react'

interface HistoricoItem {
  pergunta: string
  resposta: string
  feedback: string
  nota: number
}

interface Props {
  curriculo: any
}

function ScoreRing({ nota, size = 56 }: { nota: number; size?: number }) {
  const r = (size - 8) / 2
  const circ = r * 2 * Math.PI
  const offset = circ - (nota / 10) * circ
  const color = nota >= 8 ? '#22c55e' : nota >= 6 ? '#f59e0b' : '#ef4444'
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={4} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={4}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease', filter: `drop-shadow(0 0 4px ${color})` }} />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size > 50 ? 13 : 10, fontWeight: 800, color,
      }}>
        {nota}
      </div>
    </div>
  )
}

const cardBase: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 20,
  padding: 24,
}

export default function Entrevista({ curriculo }: Props) {
  const [iniciada, setIniciada] = useState(false)
  const [perguntaAtual, setPerguntaAtual] = useState('')
  const [dica, setDica] = useState('')
  const [resposta, setResposta] = useState('')
  const [historico, setHistorico] = useState<HistoricoItem[]>([])
  const [loading, setLoading] = useState(false)
  const [encerrada, setEncerrada] = useState(false)
  const [resumoFinal, setResumoFinal] = useState('')

  async function iniciar() {
    setLoading(true)
    const res = await fetch('/api/entrevista', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ curriculo, historico: [], resposta: '' }),
    })
    const data = await res.json()
    setPerguntaAtual(data.pergunta)
    setDica(data.dica || '')
    setIniciada(true)
    setLoading(false)
  }

  async function responder() {
    if (!resposta.trim()) return
    setLoading(true)
    const res = await fetch('/api/entrevista', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ curriculo, historico, resposta }),
    })
    const data = await res.json()
    setHistorico(prev => [...prev, { pergunta: perguntaAtual, resposta, feedback: data.feedback, nota: data.nota }])
    setResposta('')
    if (data.encerrada) { setEncerrada(true); setResumoFinal(data.resumoFinal) }
    else { setPerguntaAtual(data.pergunta); setDica(data.dica || '') }
    setLoading(false)
  }

  const media = historico.length > 0
    ? Math.round(historico.reduce((s, h) => s + h.nota, 0) / historico.length)
    : 0

  /* ── Tela inicial ── */
  if (!iniciada) {
    return (
      <div style={{ ...cardBase, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -50, right: -50, width: 180, height: 180, background: 'radial-gradient(circle, rgba(244,114,182,0.12), transparent)', borderRadius: '50%' }} />
        <div style={{
          width: 72, height: 72, borderRadius: '50%', margin: '0 auto 18px',
          background: 'linear-gradient(135deg, rgba(124,58,237,0.28), rgba(244,114,182,0.28))',
          border: '1px solid rgba(167,139,250,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 32, boxShadow: '0 0 32px rgba(124,58,237,0.2)',
          position: 'relative',
        }}>🎯</div>

        <h3 style={{ fontSize: 19, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
          Simulação de Entrevista
        </h3>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.48)', marginBottom: 22, lineHeight: 1.65, maxWidth: 260, margin: '0 auto 22px' }}>
          Nossa IA fará 5 perguntas reais baseadas no seu currículo com feedback profissional.
        </p>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 26 }}>
          {[['🎤', '5 perguntas'], ['💬', 'Feedback'], ['⭐', 'Nota 1–10']].map(([icon, text], i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 10, padding: '8px 10px', fontSize: 11, color: 'rgba(255,255,255,0.55)', textAlign: 'center',
            }}>
              <div style={{ fontSize: 18, marginBottom: 3 }}>{icon}</div>
              {text}
            </div>
          ))}
        </div>

        <button onClick={iniciar} disabled={loading} className="btn-glow"
          style={{ padding: '12px 32px', borderRadius: 12, fontSize: 14, fontWeight: 700, color: '#fff' }}>
          {loading ? '⏳ Preparando...' : '🚀 Começar entrevista'}
        </button>
      </div>
    )
  }

  /* ── Tela encerrada ── */
  if (encerrada) {
    const medalha = media >= 8 ? '🏆' : media >= 6 ? '🥈' : '💪'
    const cor = media >= 8 ? '#22c55e' : media >= 6 ? '#f59e0b' : '#ef4444'
    return (
      <div style={{ ...cardBase, maxHeight: '82vh', overflowY: 'auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <div style={{ fontSize: 44, marginBottom: 10 }}>{medalha}</div>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 12 }}>Entrevista concluída!</h3>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14, padding: '10px 18px' }}>
            <ScoreRing nota={media} size={72} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)' }}>Nota média</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: cor }}>{media}/10</div>
            </div>
          </div>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 12, padding: 16, marginBottom: 18,
          fontSize: 12.5, color: 'rgba(255,255,255,0.65)', lineHeight: 1.8,
        }}>
          {resumoFinal}
        </div>

        {historico.map((h, i) => (
          <div key={i} style={{
            marginBottom: 12, padding: 14,
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${h.nota >= 7 ? 'rgba(34,197,94,0.18)' : 'rgba(245,158,11,0.18)'}`,
            borderRadius: 12,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#a78bfa', flex: 1, lineHeight: 1.5 }}>P{i + 1}: {h.pergunta}</p>
              <ScoreRing nota={h.nota} size={36} />
            </div>
            <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.55)', marginBottom: 7 }}>
              <strong style={{ color: 'rgba(255,255,255,0.35)' }}>Você: </strong>{h.resposta}
            </p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.42)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 7, lineHeight: 1.6 }}>
              💬 {h.feedback}
            </p>
          </div>
        ))}
      </div>
    )
  }

  /* ── Entrevista em andamento ── */
  return (
    <div style={{ ...cardBase, display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0 }}>Entrevista ao vivo</h3>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>Com avaliador IA</p>
        </div>
        <div style={{
          background: 'rgba(167,139,250,0.13)', border: '1px solid rgba(167,139,250,0.2)',
          borderRadius: 99, padding: '4px 12px', fontSize: 12, color: '#a78bfa',
        }}>
          {historico.length + 1}/5
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 99,
          background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
          width: `${(historico.length / 5) * 100}%`,
          transition: 'width 0.5s ease',
          boxShadow: '0 0 8px rgba(124,58,237,0.6)',
        }} />
      </div>

      {/* Histórico */}
      {historico.length > 0 && (
        <div style={{ maxHeight: 200, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {historico.map((h, i) => (
            <div key={i} style={{ padding: 11, background: 'rgba(255,255,255,0.03)', borderRadius: 10, fontSize: 12 }}>
              <p style={{ color: '#a78bfa', marginBottom: 4, fontWeight: 600, lineHeight: 1.4 }}>🎤 {h.pergunta}</p>
              <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: 6, lineHeight: 1.4 }}>Você: {h.resposta}</p>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                <span style={{
                  padding: '2px 7px', borderRadius: 4, fontWeight: 700, fontSize: 10, flexShrink: 0,
                  background: h.nota >= 7 ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)',
                  color: h.nota >= 7 ? '#22c55e' : '#f59e0b',
                }}>
                  {h.nota}/10
                </span>
                <span style={{ color: 'rgba(255,255,255,0.38)', lineHeight: 1.5 }}>💬 {h.feedback}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pergunta atual */}
      <div style={{
        background: 'rgba(124,58,237,0.09)', border: '1px solid rgba(124,58,237,0.22)',
        borderRadius: 14, padding: 14,
      }}>
        <div style={{ display: 'flex', gap: 9 }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>🎤</span>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#e2d9ff', lineHeight: 1.55 }}>
            {loading && !perguntaAtual ? 'Preparando pergunta...' : perguntaAtual}
          </p>
        </div>
        {dica && (
          <p style={{ fontSize: 11, color: 'rgba(167,139,250,0.65)', marginTop: 7, paddingLeft: 25, lineHeight: 1.5 }}>
            💡 {dica}
          </p>
        )}
      </div>

      {/* Textarea + botão */}
      <div>
        <textarea
          value={resposta}
          onChange={e => setResposta(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) responder() }}
          placeholder="Digite sua resposta... (Ctrl+Enter para enviar)"
          rows={3}
          className="input-glow"
          style={{
            width: '100%', padding: '11px 14px', borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.04)',
            fontSize: 13, color: '#fff', fontFamily: 'inherit',
            outline: 'none', resize: 'vertical', marginBottom: 10,
          }}
        />
        <button onClick={responder} disabled={loading || !resposta.trim()} className="btn-glow"
          style={{ width: '100%', padding: 12, borderRadius: 12, fontSize: 14, fontWeight: 700, color: '#fff' }}>
          {loading ? '⏳ Avaliando...' : 'Enviar resposta →'}
        </button>
      </div>
    </div>
  )
}
