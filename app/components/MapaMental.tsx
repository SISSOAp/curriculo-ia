'use client'
import { useState } from 'react'

interface MapaData {
  vagas: string[]
  habilidades: { nome: string; prioridade: string; motivo: string }[]
  cursos: { nome: string; plataforma: string; prazo: string }[]
  linkedin: string[]
  networking: string[]
  plano: { dias30: string[]; dias60: string[]; dias90: string[] }
}

interface Props {
  curriculo: any
  nome: string
}

function Card({ emoji, title, accent, children }: {
  emoji: string; title: string; accent: string; children: React.ReactNode
}) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: `1px solid ${accent}22`,
      borderTop: `3px solid ${accent}`,
      borderRadius: 16, padding: 20,
      animation: 'fade-up 0.5s ease forwards',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 18 }}>{emoji}</span>
        <span style={{ fontSize: 11, fontWeight: 800, color: accent, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{title}</span>
      </div>
      {children}
    </div>
  )
}

export default function MapaMental({ curriculo, nome }: Props) {
  const [dados, setDados] = useState<MapaData | null>(null)
  const [loading, setLoading] = useState(false)

  async function gerar() {
    setLoading(true)
    try {
      const res = await fetch('/api/mapa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ curriculo, nome }),
      })
      const data = await res.json()
      if (data.success) setDados(data)
    } catch {}
    setLoading(false)
  }

  if (!dados && !loading) {
    return (
      <div style={{ padding: '28px 20px', textAlign: 'center' }}>
        <div style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20, padding: '28px 24px', display: 'inline-flex',
          flexDirection: 'column', alignItems: 'center', maxWidth: 420,
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🗺️</div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
            Plano de Emprego Personalizado
          </h3>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 20, maxWidth: 320 }}>
            A IA analisa seu perfil e cria um plano completo: vagas certas, cursos, dicas de LinkedIn e estratégia 30/60/90 dias.
          </p>
          <button onClick={gerar} className="btn-glow"
            style={{ padding: '12px 28px', borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 700 }}>
            ✨ Gerar meu plano grátis
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ padding: '56px 20px', textAlign: 'center' }}>
        <div style={{
          width: 52, height: 52, margin: '0 auto 16px', borderRadius: '50%',
          border: '3px solid rgba(167,139,250,0.15)', borderTopColor: '#a78bfa',
          animation: 'ring-spin 1s linear infinite',
        }} />
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Gerando seu plano personalizado...</p>
      </div>
    )
  }

  return (
    <div style={{ animation: 'fade-up 0.5s ease forwards' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <span style={{ fontSize: 22 }}>🗺️</span>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', lineHeight: 1 }}>
            Plano de Emprego
          </h3>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>
            Personalizado para {nome.split(' ')[0]}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>

        {/* Vagas */}
        <Card emoji="🎯" title="Vagas Ideais" accent="#7c3aed">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {dados!.vagas.map((v, i) => (
              <span key={i} style={{
                background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.28)',
                borderRadius: 99, padding: '4px 12px', fontSize: 12, color: '#c4b5fd',
              }}>{v}</span>
            ))}
          </div>
        </Card>

        {/* Habilidades */}
        <Card emoji="📈" title="Desenvolver" accent="#06b6d4">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {dados!.habilidades.map((h, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                <span style={{
                  padding: '2px 7px', borderRadius: 4, fontSize: 9, fontWeight: 800, flexShrink: 0, marginTop: 1,
                  background: h.prioridade === 'alta' ? 'rgba(239,68,68,0.18)' : 'rgba(245,158,11,0.18)',
                  color: h.prioridade === 'alta' ? '#f87171' : '#fbbf24',
                  textTransform: 'uppercase',
                }}>
                  {h.prioridade}
                </span>
                <div>
                  <span style={{ fontSize: 12, color: '#fff', fontWeight: 600 }}>{h.nome}</span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', display: 'block', marginTop: 1, lineHeight: 1.4 }}>
                    {h.motivo}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Cursos */}
        <Card emoji="🎓" title="Cursos Recomendados" accent="#22c55e">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {dados!.cursos.map((c, i) => (
              <div key={i} style={{ padding: '8px 10px', background: 'rgba(34,197,94,0.07)', borderRadius: 8, border: '1px solid rgba(34,197,94,0.12)' }}>
                <span style={{ fontSize: 12, color: '#fff', fontWeight: 600, display: 'block' }}>{c.nome}</span>
                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>📍 {c.plataforma}</span>
                  <span style={{ fontSize: 10, color: '#86efac', fontWeight: 600 }}>⏱ {c.prazo}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* LinkedIn */}
        <Card emoji="💼" title="Dicas de LinkedIn" accent="#f59e0b">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {dados!.linkedin.map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ color: '#fbbf24', fontSize: 11, flexShrink: 0, marginTop: 1 }}>→</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.55 }}>{tip}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Networking */}
        <Card emoji="🤝" title="Networking" accent="#f472b6">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {dados!.networking.map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ color: '#f9a8d4', fontSize: 11, flexShrink: 0, marginTop: 1 }}>→</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.55 }}>{tip}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Plano 30/60/90 */}
        <Card emoji="📅" title="Plano 30 / 60 / 90 dias" accent="#a78bfa">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: '30 dias', items: dados!.plano.dias30, color: '#22c55e' },
              { label: '60 dias', items: dados!.plano.dias60, color: '#f59e0b' },
              { label: '90 dias', items: dados!.plano.dias90, color: '#a78bfa' },
            ].map(({ label, items, color }) => (
              <div key={label}>
                <span style={{ fontSize: 10, fontWeight: 800, color, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</span>
                <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {items.map((item, j) => (
                    <div key={j} style={{ display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                      <div style={{ width: 4, height: 4, borderRadius: '50%', background: color, flexShrink: 0, marginTop: 5 }} />
                      <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  )
}
