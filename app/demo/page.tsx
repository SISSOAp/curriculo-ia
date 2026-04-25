'use client'

import { useState } from 'react'
import CurriculoVisual from '../components/CurriculoVisual'

const EXEMPLO = {
  nome: 'Marina Costa Silva',
  email: 'marina.silva@gmail.com',
  telefone: '(51) 99847-3021',
  cidade: 'Porto Alegre, RS',
  linkedin: 'linkedin.com/in/marina-costa-silva',
  instagram: '@marina.marketing',
  outraRede: 'marinasilva.com.br',
  semExperiencia: false,
  disponibilidade: 'Imediata',
  modalidade: 'Híbrido',
  cnh: 'CNH Categoria B',
  viagens: true,
  pretensao: 'R$ 8.000 — R$ 10.000',
  curriculo: {
    resumo:
      'Profissional de Marketing Digital com 6 anos de experiência em gestão de campanhas, growth hacking e análise de dados. Especialista em SEO, tráfego pago e automação de marketing, com histórico comprovado de aumento de ROI acima de 180% em campanhas B2B e B2C. Certificada pelo Google e Meta, com forte capacidade analítica e visão estratégica para negócios em crescimento.',
    objetivo: 'Analista de Marketing Digital Sênior',
    experiencias: [
      {
        cargo: 'Analista de Marketing Digital Sênior',
        empresa: 'TOTVS S.A.',
        periodo: '2022 — atual',
        descricao:
          'Liderou estratégia de conteúdo e tráfego pago, gerenciando budget mensal de R$ 120k. Reduziu custo por lead em 42% e aumentou conversão do funil em 67% através de testes A/B e otimização de landing pages. Coordenou equipe de 4 analistas júnior.',
      },
      {
        cargo: 'Analista de Marketing',
        empresa: 'RD Station (Resultados Digitais)',
        periodo: '2020 — 2022',
        descricao:
          'Responsável pela gestão de campanhas Google Ads, Meta Ads e LinkedIn Ads. Implementou automações de e-mail marketing no HubSpot, aumentando a taxa de abertura de 18% para 34%. Produziu relatórios executivos mensais com foco em métricas de ROI.',
      },
      {
        cargo: 'Assistente de Marketing',
        empresa: 'Agência Pixel Creative',
        periodo: '2018 — 2020',
        descricao:
          'Apoio na criação de conteúdo para redes sociais, monitoramento de métricas e suporte na gestão de campanhas de clientes do varejo e e-commerce. Atuou na criação de relatórios de desempenho e apresentações executivas.',
      },
    ],
    formacao: [
      {
        curso: 'MBA em Marketing Digital e Analytics',
        instituicao: 'FGV — Fundação Getulio Vargas',
        periodo: '2021 — 2023',
      },
      {
        curso: 'Bacharelado em Publicidade e Propaganda',
        instituicao: 'PUCRS — Pontifícia Universidade Católica do RS',
        periodo: '2014 — 2018',
      },
    ],
    habilidades: [
      { nome: 'Google Ads', nivel: 92 },
      { nome: 'Meta Ads', nivel: 90 },
      { nome: 'SEO / SEM', nivel: 85 },
      { nome: 'HubSpot CRM', nivel: 82 },
      { nome: 'Google Analytics 4', nivel: 88 },
      { nome: 'Power BI', nivel: 75 },
      { nome: 'Copywriting', nivel: 80 },
    ],
    idiomas: [
      { nome: 'Português', nivel: 'Nativo', porcentagem: 100 },
      { nome: 'Inglês', nivel: 'Avançado', porcentagem: 85 },
      { nome: 'Espanhol', nivel: 'Intermediário', porcentagem: 60 },
    ],
    diferenciais: [
      'Certificação Google Ads Search e Display',
      'Experiência com gestão de times multidisciplinares',
      'Forte perfil analítico com foco em dados',
      'Implementação de cultura data-driven em duas empresas',
    ],
    certificacoes: [
      'Google Ads Search — Google (2023)',
      'Google Analytics Certification — Google (2023)',
      'Meta Blueprint — Meta (2022)',
      'Inbound Marketing — HubSpot Academy (2022)',
      'Growth Hacking — Rock Content (2021)',
      'Power BI para Negócios — Alura (2021)',
    ],
    softskills: [
      '📊 Orientada a dados',
      '🚀 Proatividade e iniciativa',
      '🤝 Liderança colaborativa',
      '🔍 Pensamento analítico',
      '💬 Comunicação executiva',
    ],
  },
}

function handlePrint() {
  const el = document.getElementById('curriculo-print')
  if (!el) { window.print(); return }
  const parent = el.parentElement!
  const nextSibling = el.nextSibling
  document.body.appendChild(el)
  const restore = () => {
    if (nextSibling) parent.insertBefore(el, nextSibling)
    else parent.appendChild(el)
    window.removeEventListener('afterprint', restore)
  }
  window.addEventListener('afterprint', restore)
  window.print()
}

export default function DemoPage() {
  const [modelo, setModelo] = useState<'free' | 'premium'>('free')

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #050714 0%, #0c0a1e 50%, #07101f 100%)',
      padding: '32px 24px',
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.03em' }}>
              <img src="/Logo.png" alt="Trampaí" style={{ height: 32, objectFit: 'contain' }} />
            </h1>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>Exemplo com dados fictícios — Marina Costa Silva</p>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            {(['free', 'premium'] as const).map(m => (
              <button key={m} onClick={() => setModelo(m)}
                style={{
                  padding: '8px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  border: 'none', transition: 'all 0.2s',
                  background: modelo === m ? 'linear-gradient(135deg,#7c3aed,#0891b2)' : 'rgba(255,255,255,0.07)',
                  color: modelo === m ? '#fff' : 'rgba(255,255,255,0.45)',
                  boxShadow: modelo === m ? '0 4px 20px rgba(124,58,237,0.4)' : 'none',
                }}>
                {m === 'free' ? '⚡ Free' : '👑 Premium'}
              </button>
            ))}
            <button
              onClick={handlePrint}
              style={{
                padding: '8px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)',
                color: 'rgba(255,255,255,0.7)',
              }}>
              ↓ PDF
            </button>
          </div>
        </div>

        {/* Resume */}
        <div style={{ zoom: 0.88 }}>
          <CurriculoVisual dados={EXEMPLO} foto={null} modelo={modelo} />
        </div>
      </div>
    </div>
  )
}
