'use client'
import { useState, useEffect } from 'react'
import CurriculoVisual from './components/CurriculoVisual'
import Entrevista from './components/Entrevista'
import MapaMental from './components/MapaMental'

type Etapa = 'form' | 'gerando' | 'resultado'
type Modelo = 'free' | 'premium'

const LOADING_STEPS = [
  'Analisando seus dados...',
  'Processando com IA...',
  'Gerando perfil profissional...',
  'Estimando níveis de habilidades...',
  'Finalizando currículo...',
]

function Background() {
  return (
    <>
      <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(135deg, #050714 0%, #0c0a1e 50%, #07101f 100%)', zIndex: 0 }} />
      <div style={{ position: 'fixed', top: -200, right: -200, width: 700, height: 700, background: 'radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 70%)', borderRadius: '50%', animation: 'float 12s ease-in-out infinite', zIndex: 0, filter: 'blur(40px)' }} />
      <div style={{ position: 'fixed', bottom: -150, left: -150, width: 600, height: 600, background: 'radial-gradient(circle, rgba(6,182,212,0.16) 0%, transparent 70%)', borderRadius: '50%', animation: 'float2 15s ease-in-out infinite', zIndex: 0, filter: 'blur(40px)' }} />
      <div style={{ position: 'fixed', top: '40%', left: '30%', width: 450, height: 450, background: 'radial-gradient(circle, rgba(244,114,182,0.07) 0%, transparent 70%)', borderRadius: '50%', animation: 'float3 18s ease-in-out infinite', zIndex: 0, filter: 'blur(60px)' }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.013) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.013) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
    </>
  )
}

function LoadingScreen() {
  const [step, setStep] = useState(0)
  const [dots, setDots] = useState(0)
  useEffect(() => {
    const s = setInterval(() => setStep(p => p < LOADING_STEPS.length - 1 ? p + 1 : p), 2200)
    const d = setInterval(() => setDots(p => (p + 1) % 4), 380)
    return () => { clearInterval(s); clearInterval(d) }
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <Background />
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: 40 }}>
        <div style={{ position: 'relative', width: 160, height: 160, margin: '0 auto 44px' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid transparent', borderTopColor: '#7c3aed', borderRightColor: '#7c3aed', animation: 'ring-spin 1.2s linear infinite' }} />
          <div style={{ position: 'absolute', inset: 16, borderRadius: '50%', border: '2px solid transparent', borderTopColor: '#06b6d4', borderLeftColor: '#06b6d4', animation: 'ring-spin-reverse 1.8s linear infinite' }} />
          <div style={{ position: 'absolute', inset: 32, borderRadius: '50%', border: '1.5px solid transparent', borderTopColor: '#f472b6', animation: 'ring-spin 0.9s linear infinite' }} />
          <div style={{ position: 'absolute', inset: 48, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.7) 0%, rgba(6,182,212,0.4) 100%)', boxShadow: '0 0 30px rgba(124,58,237,0.8), 0 0 60px rgba(124,58,237,0.3)', animation: 'pulse-orb 2s ease-in-out infinite' }} />
        </div>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Gerando seu currículo</h2>
        <p className="gradient-text" style={{ fontSize: 15, fontWeight: 600, marginBottom: 36 }}>com inteligência artificial</p>
        <div style={{ maxWidth: 280, margin: '0 auto', textAlign: 'left' }}>
          {LOADING_STEPS.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', opacity: i <= step ? 1 : 0.18, transition: 'opacity 0.5s ease, transform 0.4s ease', transform: i === step ? 'translateX(4px)' : 'translateX(0)' }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, background: i < step ? 'linear-gradient(135deg, #7c3aed, #06b6d4)' : i === step ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.06)', border: i === step ? '1.5px solid rgba(167,139,250,0.7)' : '1.5px solid transparent', animation: i === step ? 'glow-pulse 1.5s ease-in-out infinite' : 'none', color: i < step ? '#fff' : '#a78bfa' }}>
                {i < step ? '✓' : i === step ? '◎' : ''}
              </div>
              <span style={{ fontSize: 13, color: i === step ? '#fff' : i < step ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.18)', fontWeight: i === step ? 600 : 400 }}>
                {s}{i === step ? '.'.repeat(dots) : ''}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [etapa, setEtapa] = useState<Etapa>('form')
  const [semExperiencia, setSemExperiencia] = useState(false)
  const [viagens, setViagens] = useState(false)
  const [resultado, setResultado] = useState<any>(null)
  const [foto, setFoto] = useState<string | null>(null)
  const [modelo, setModelo] = useState<Modelo>('free')
  const [form, setForm] = useState({
    nome: '', email: '', telefone: '', cidade: '',
    objetivo: '', experiencias: '', formacao: '', habilidades: '',
    cursos: '', linkedin: '', instagram: '', outraRede: '',
    disponibilidade: '', modalidade: '', cnh: '', pretensao: '',
  })

  function setField(field: string, val: string) {
    setForm(prev => ({ ...prev, [field]: val }))
  }

  function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setFoto(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  function handlePrint() {
    const el = document.getElementById('curriculo-print')
    if (!el) { window.print(); return }

    // Salva referência da posição original
    const parent = el.parentElement!
    const nextSibling = el.nextSibling

    // Move direto para o body — elimina qualquer ancestral position:relative
    document.body.appendChild(el)

    // Restaura após o print
    const restore = () => {
      if (nextSibling) parent.insertBefore(el, nextSibling)
      else parent.appendChild(el)
      window.removeEventListener('afterprint', restore)
    }
    window.addEventListener('afterprint', restore)

    window.print()
  }

  async function gerar() {
    if (!form.nome || !form.objetivo) return alert('Preencha pelo menos nome e objetivo.')
    setEtapa('gerando')
    try {
      const res = await fetch('/api/gerar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, semExperiencia, viagens }),
      })
      const data = await res.json()
      if (data.success) { setResultado(data); setEtapa('resultado') }
      else { alert('Erro ao gerar. Tente novamente.'); setEtapa('form') }
    } catch { alert('Erro de conexão.'); setEtapa('form') }
  }

  if (etapa === 'gerando') return <LoadingScreen />

  /* ─── Tela de resultado ─── */
  if (etapa === 'resultado' && resultado) {
    return (
      <div className="result-root" style={{ minHeight: '100vh', position: 'relative' }}>
        <Background />

        {/* Top bar */}
        <div className="no-print" style={{ position: 'relative', zIndex: 10, background: 'rgba(5,7,20,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '14px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="gradient-text-static" style={{ fontWeight: 900, fontSize: 22, letterSpacing: '-0.03em' }}>Trampaí ✦</span>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setEtapa('form')} className="glass" style={{ padding: '8px 18px', borderRadius: 10, color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
              ← Editar
            </button>
            <button onClick={handlePrint} className="btn-glow" style={{ padding: '8px 20px', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 600 }}>
              ↓ Baixar PDF
            </button>
          </div>
        </div>

        <div className="result-content" style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '28px 20px' }}>

          {/* Grid principal */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 24, marginBottom: 28 }}>

            {/* Coluna currículo */}
            <div style={{ animation: 'fade-up 0.6s ease forwards' }}>
              {/* Seletor de modelo */}
              <div className="no-print" style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {(['free', 'premium'] as Modelo[]).map(m => (
                  <button key={m} onClick={() => setModelo(m)}
                    className={m === modelo ? 'btn-glow' : 'glass'}
                    style={{ padding: '6px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700, color: m === modelo ? '#fff' : 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'all 0.2s' }}>
                    {m === 'free' ? '⚡ Free' : '👑 Premium'}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'linear-gradient(135deg,#a78bfa,#22d3ee)', boxShadow: '0 0 7px rgba(167,139,250,0.8)', display: 'block' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Seu currículo</span>
              </div>
              <div className="resume-preview">
                <CurriculoVisual
                  dados={{
                    ...resultado,
                    linkedin: form.linkedin,
                    instagram: form.instagram,
                    outraRede: form.outraRede,
                    semExperiencia,
                    disponibilidade: form.disponibilidade,
                    modalidade: form.modalidade,
                    cnh: form.cnh,
                    viagens,
                    pretensao: form.pretensao,
                  }}
                  foto={foto}
                  modelo={modelo}
                />
              </div>
            </div>

            {/* Coluna entrevista */}
            <div style={{ animation: 'fade-up 0.6s ease 0.15s both' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, marginTop: 46 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'linear-gradient(135deg,#f472b6,#7c3aed)', boxShadow: '0 0 7px rgba(244,114,182,0.8)', display: 'block' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Simulação de entrevista</span>
              </div>
              <Entrevista curriculo={resultado.curriculo} />
            </div>
          </div>

          {/* Mapa mental */}
          <div style={{ animation: 'fade-up 0.6s ease 0.3s both' }}>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 28 }} />
            <MapaMental curriculo={resultado.curriculo} nome={resultado.nome} />
          </div>
        </div>
      </div>
    )
  }

  /* ─── Formulário ─── */
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px', borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.04)',
    fontSize: 14, color: '#fff', fontFamily: 'inherit', outline: 'none',
  }
  const labelStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)',
    display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.08em',
  }

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <Background />
      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="gradient-text-static" style={{ fontWeight: 900, fontSize: 24, letterSpacing: '-0.03em' }}>Trampaí ✦</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.08)', padding: '5px 14px', borderRadius: 99, background: 'rgba(255,255,255,0.03)' }}>🔒 100% grátis</span>
        </div>

        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '44px 24px 36px', maxWidth: 700, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(124,58,237,0.14)', border: '1px solid rgba(167,139,250,0.22)', borderRadius: 99, padding: '6px 16px', fontSize: 13, color: '#a78bfa', marginBottom: 24, animation: 'fade-up 0.5s ease forwards' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#a78bfa', boxShadow: '0 0 6px #a78bfa', animation: 'pulse-orb 2s ease-in-out infinite', display: 'block' }} />
            Powered by IA · Grátis para sempre
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 66px)', fontWeight: 900, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 18, animation: 'fade-up 0.5s ease 0.1s both' }}>
            Seu trampo<br />
            <span className="gradient-text">começa aqui</span>
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 500, margin: '0 auto 32px', animation: 'fade-up 0.5s ease 0.2s both' }}>
            A IA cria seu currículo profissional em 2 minutos e ainda simula uma entrevista real com feedback em cada resposta.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 36, marginBottom: 44, animation: 'fade-up 0.5s ease 0.3s both' }}>
            {[{ n: '12k+', l: 'currículos criados' }, { n: '⭐ 4.9', l: 'avaliação média' }, { n: '< 15s', l: 'tempo de geração' }].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>{s.n}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.32)', marginTop: 2 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 20px 64px', animation: 'fade-up 0.6s ease 0.3s both' }}>
          <div className="glass-card" style={{ padding: 32 }}>

            {/* Toggle primeiro emprego */}
            <div onClick={() => setSemExperiencia(v => !v)} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 24, cursor: 'pointer', padding: '14px 16px', borderRadius: 14, background: semExperiencia ? 'rgba(124,58,237,0.14)' : 'rgba(255,255,255,0.03)', border: semExperiencia ? '1px solid rgba(167,139,250,0.28)' : '1px solid rgba(255,255,255,0.06)', transition: 'all 0.3s ease', userSelect: 'none' }}>
              <div style={{ position: 'relative', width: 42, height: 22, flexShrink: 0, marginTop: 2 }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: 99, background: semExperiencia ? 'linear-gradient(90deg, #7c3aed, #06b6d4)' : 'rgba(255,255,255,0.1)', transition: 'all 0.3s ease', boxShadow: semExperiencia ? '0 0 12px rgba(124,58,237,0.5)' : 'none' }} />
                <div style={{ position: 'absolute', top: 3, left: semExperiencia ? 22 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.3s ease', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
              </div>
              <div>
                <span style={{ fontWeight: 600, fontSize: 14, color: semExperiencia ? '#a78bfa' : 'rgba(255,255,255,0.8)' }}>É meu primeiro emprego</span>
                <span style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>A IA vai destacar suas habilidades e potencial</span>
              </div>
            </div>

            {/* Upload de foto */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Foto (opcional)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: foto ? 'transparent' : 'rgba(124,58,237,0.15)', border: `2px solid ${foto ? 'rgba(167,139,250,0.5)' : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: foto ? '0 0 15px rgba(124,58,237,0.35)' : 'none', transition: 'all 0.3s ease' }}>
                  {foto
                    ? <img src={foto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontSize: 22 }}>👤</span>
                  }
                </div>
                <label style={{ flex: 1, cursor: 'pointer' }}>
                  <div className="glass" style={{ padding: '10px 14px', borderRadius: 12, fontSize: 13, color: foto ? '#a78bfa' : 'rgba(255,255,255,0.45)', textAlign: 'center', transition: 'all 0.2s ease' }}>
                    {foto ? '✓ Foto adicionada — clique para trocar' : '📷 Adicionar foto'}
                  </div>
                  <input type="file" accept="image/*" onChange={handleFoto} style={{ display: 'none' }} />
                </label>
              </div>
            </div>

            {/* Grid campos */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              {([
                { label: 'Nome completo *', field: 'nome', placeholder: 'João da Silva' },
                { label: 'Email', field: 'email', placeholder: 'joao@email.com' },
                { label: 'Telefone', field: 'telefone', placeholder: '(54) 99999-9999' },
                { label: 'Cidade', field: 'cidade', placeholder: 'Passo Fundo, RS' },
              ] as const).map(({ label, field, placeholder }) => (
                <div key={field}>
                  <label style={labelStyle}>{label}</label>
                  <input type="text" placeholder={placeholder} value={form[field]} onChange={e => setField(field, e.target.value)} className="input-glow" style={inputStyle} />
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Objetivo profissional *</label>
              <input type="text" placeholder="Ex: Trabalhar como assistente administrativo" value={form.objetivo} onChange={e => setField('objetivo', e.target.value)} className="input-glow" style={inputStyle} />
            </div>

            {!semExperiencia && (
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Experiências profissionais</label>
                <textarea rows={3} placeholder="Ex: Trabalhei 1 ano como atendente no Mercado X." value={form.experiencias} onChange={e => setField('experiencias', e.target.value)} className="input-glow" style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
            )}

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Formação</label>
              <input type="text" placeholder="Ex: Ensino médio completo — Escola Estadual (2023)" value={form.formacao} onChange={e => setField('formacao', e.target.value)} className="input-glow" style={inputStyle} />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Habilidades</label>
              <input type="text" placeholder="Ex: Excel avançado, atendimento ao cliente, inglês intermediário" value={form.habilidades} onChange={e => setField('habilidades', e.target.value)} className="input-glow" style={inputStyle} />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Cursos e certificações (opcional)</label>
              <textarea rows={2} placeholder="Ex: Excel Avançado — Udemy (2024), Power BI — Alura, Técnico em Informática — Senac" value={form.cursos} onChange={e => setField('cursos', e.target.value)} className="input-glow" style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div>
                <label style={labelStyle}>LinkedIn (opcional)</label>
                <input type="text" placeholder="linkedin.com/in/seu-perfil" value={form.linkedin} onChange={e => setField('linkedin', e.target.value)} className="input-glow" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Instagram (opcional)</label>
                <input type="text" placeholder="@seu.perfil" value={form.instagram} onChange={e => setField('instagram', e.target.value)} className="input-glow" style={inputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Outro link / portfólio (opcional)</label>
              <input type="text" placeholder="github.com/seu-usuario ou seu-site.com" value={form.outraRede} onChange={e => setField('outraRede', e.target.value)} className="input-glow" style={inputStyle} />
            </div>

            {/* ── Informações adicionais ── */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 18, marginBottom: 18 }}>
              <p style={{ ...labelStyle, marginBottom: 14, color: 'rgba(255,255,255,0.5)' }}>Informações adicionais (opcional)</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={labelStyle}>Disponibilidade</label>
                  <select value={form.disponibilidade} onChange={e => setField('disponibilidade', e.target.value)} className="input-glow" style={{ ...inputStyle, appearance: 'auto' as any }}>
                    <option value="" style={{ background: '#0c0a1e' }}>Selecionar...</option>
                    <option value="Imediata" style={{ background: '#0c0a1e' }}>Imediata</option>
                    <option value="15 dias" style={{ background: '#0c0a1e' }}>15 dias</option>
                    <option value="30 dias" style={{ background: '#0c0a1e' }}>30 dias</option>
                    <option value="A combinar" style={{ background: '#0c0a1e' }}>A combinar</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Modalidade</label>
                  <select value={form.modalidade} onChange={e => setField('modalidade', e.target.value)} className="input-glow" style={{ ...inputStyle, appearance: 'auto' as any }}>
                    <option value="" style={{ background: '#0c0a1e' }}>Selecionar...</option>
                    <option value="Presencial" style={{ background: '#0c0a1e' }}>Presencial</option>
                    <option value="Remoto" style={{ background: '#0c0a1e' }}>Remoto</option>
                    <option value="Híbrido" style={{ background: '#0c0a1e' }}>Híbrido</option>
                    <option value="Qualquer" style={{ background: '#0c0a1e' }}>Qualquer</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={labelStyle}>Possui CNH?</label>
                  <select value={form.cnh} onChange={e => setField('cnh', e.target.value)} className="input-glow" style={{ ...inputStyle, appearance: 'auto' as any }}>
                    <option value="" style={{ background: '#0c0a1e' }}>Selecionar...</option>
                    <option value="Não possui" style={{ background: '#0c0a1e' }}>Não possui</option>
                    <option value="CNH Categoria A" style={{ background: '#0c0a1e' }}>Sim — Categoria A</option>
                    <option value="CNH Categoria B" style={{ background: '#0c0a1e' }}>Sim — Categoria B</option>
                    <option value="CNH Categoria AB" style={{ background: '#0c0a1e' }}>Sim — Categoria AB</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Pretensão salarial</label>
                  <input type="text" placeholder="Ex: R$ 3.000 / A combinar" value={form.pretensao} onChange={e => setField('pretensao', e.target.value)} className="input-glow" style={inputStyle} />
                </div>
              </div>

              <div onClick={() => setViagens(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', padding: '10px 14px', borderRadius: 10, background: viagens ? 'rgba(124,58,237,0.1)' : 'rgba(255,255,255,0.03)', border: viagens ? '1px solid rgba(167,139,250,0.25)' : '1px solid rgba(255,255,255,0.06)', transition: 'all 0.2s', userSelect: 'none' }}>
                <div style={{ position: 'relative', width: 36, height: 20, flexShrink: 0 }}>
                  <div style={{ position: 'absolute', inset: 0, borderRadius: 99, background: viagens ? 'linear-gradient(90deg,#7c3aed,#06b6d4)' : 'rgba(255,255,255,0.1)', transition: 'all 0.3s' }} />
                  <div style={{ position: 'absolute', top: 2, left: viagens ? 18 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.3s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
                </div>
                <span style={{ fontSize: 13, color: viagens ? '#a78bfa' : 'rgba(255,255,255,0.6)', fontWeight: 500 }}>✈️ Disponível para viagens</span>
              </div>
            </div>

            <button onClick={gerar} className="btn-glow" style={{ width: '100%', padding: 15, borderRadius: 14, fontSize: 16, fontWeight: 700, color: '#fff', letterSpacing: '0.01em' }}>
              ✨ Gerar meu currículo grátis
            </button>
            <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.2)', marginTop: 14 }}>
              Sem cadastro · Sem cartão · Resultado em 15 segundos
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
