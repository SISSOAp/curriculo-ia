'use client'

import { useState } from 'react'

/* ─── Types ─── */
interface Exp { cargo: string; empresa: string; periodo: string; descricao: string }
interface Edu { curso: string; instituicao: string; periodo: string }
interface Hab { nome: string; nivel: number }
interface Lang { nome: string; nivel: string; porcentagem: number }

interface CurrData {
  resumo: string
  objetivo: string
  experiencias: Exp[]
  formacao: Edu[]
  habilidades: Hab[] | string[]
  idiomas?: Lang[]
  diferenciais: string[]
  certificacoes?: string[]
  softskills?: string[]
}

interface DadosProps {
  nome: string
  email: string
  telefone: string
  cidade: string
  curriculo: CurrData
  linkedin?: string
  instagram?: string
  outraRede?: string
  semExperiencia?: boolean
  disponibilidade?: string
  modalidade?: string
  cnh?: string
  viagens?: boolean
  pretensao?: string
}

interface Props {
  dados: DadosProps
  foto?: string | null
  modelo?: 'free' | 'premium'
}

/* ─── Constants ─── */
const SIDEBAR_BG = '#1e1b4b'
const FREE_ACCENT = '#7c3aed'

const TEMAS = ['#7c3aed', '#0891b2', '#059669', '#dc2626', '#ea580c']
const TEMA_NOMES = ['Roxo', 'Azul', 'Verde', 'Vermelho', 'Laranja']

/* ─── Helpers ─── */
function norm(raw: Hab[] | string[]): Hab[] {
  return (raw || []).map((h: any) =>
    typeof h === 'string' ? { nome: h, nivel: 70 } : h
  )
}

function initials(nome: string) {
  return nome.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

/* ─── SVG Icons ─── */
function EmailIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
    </svg>
  )
}

function LocationIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/>
    </svg>
  )
}

/* ─── Shared sub-components ─── */

function SectionHeader({ children, acento }: { children: string; acento: string }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <h2 style={{
          fontSize: '9px',
          fontWeight: 800,
          color: acento,
          textTransform: 'uppercase',
          letterSpacing: '2.5px',
          whiteSpace: 'nowrap',
          margin: 0,
        }}>
          {children}
        </h2>
        <div style={{ flex: 1, height: '1.5px', background: `linear-gradient(to right, ${acento}55, transparent)` }} />
      </div>
    </div>
  )
}

function SidebarLabel({ children }: { children: string }) {
  return (
    <p style={{
      fontSize: '8px',
      fontWeight: 800,
      color: 'rgba(255,255,255,0.38)',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      margin: '0 0 8px',
    }}>
      {children}
    </p>
  )
}

function ContactItem({ icon, text, href, isLink = false }: {
  icon: React.ReactNode; text: string; href?: string; isLink?: boolean
}) {
  const inner = (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '7px', marginBottom: '7px', color: 'rgba(255,255,255,0.72)' }}>
      <span style={{ color: 'rgba(255,255,255,0.35)', marginTop: '1px' }}>{icon}</span>
      <span style={{ fontSize: '9.5px', lineHeight: 1.4, wordBreak: 'break-all' }}>{text}</span>
    </div>
  )
  if (isLink && href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        {inner}
      </a>
    )
  }
  return <>{inner}</>
}

function SkillBarSidebar({ nome, nivel, acento }: { nome: string; nivel: number; acento: string }) {
  return (
    <div style={{ marginBottom: '9px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
        <span style={{ fontSize: '9.5px', color: 'rgba(255,255,255,0.82)', fontWeight: 500, lineHeight: 1.3 }}>{nome}</span>
        <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.38)', fontWeight: 700 }}>{nivel}%</span>
      </div>
      <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: 0,
          background: acento,
          borderRadius: '2px',
          animation: 'bar-grow 1s ease forwards',
          '--target-width': `${nivel}%`,
        } as React.CSSProperties} />
      </div>
    </div>
  )
}

function ExpCard({ exp, acento }: { exp: Exp; acento: string }) {
  return (
    <div style={{ marginBottom: '16px', paddingLeft: '14px', borderLeft: `2px solid ${acento}33`, position: 'relative' }}>
      <div style={{
        position: 'absolute', left: '-5px', top: '5px',
        width: '8px', height: '8px', borderRadius: '50%',
        background: acento, boxShadow: `0 0 0 2px #FAFAFA`,
      }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', flexWrap: 'wrap', marginBottom: '2px' }}>
        <span style={{ fontSize: '12px', fontWeight: 800, color: '#111827' }}>{exp.cargo}</span>
        <span style={{ fontSize: '9px', color: acento, background: `${acento}12`, padding: '2px 8px', borderRadius: '4px', fontWeight: 700, whiteSpace: 'nowrap' }}>{exp.periodo}</span>
      </div>
      <p style={{ fontSize: '10.5px', color: acento, fontWeight: 600, marginBottom: '4px' }}>{exp.empresa}</p>
      <p style={{ fontSize: '11px', color: '#6b7280', lineHeight: 1.7, margin: 0 }}>{exp.descricao}</p>
    </div>
  )
}

function EduCard({ edu, acento }: { edu: Edu; acento: string }) {
  return (
    <div style={{ marginBottom: '12px', paddingLeft: '14px', borderLeft: `2px solid ${acento}22`, position: 'relative' }}>
      <div style={{
        position: 'absolute', left: '-5px', top: '5px',
        width: '8px', height: '8px', borderRadius: '50%',
        background: '#FAFAFA', border: `2px solid ${acento}`,
      }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#111827' }}>{edu.curso}</span>
        <span style={{ fontSize: '9px', color: '#9ca3af', background: '#f3f4f6', padding: '2px 8px', borderRadius: '4px', fontWeight: 600, whiteSpace: 'nowrap' }}>{edu.periodo}</span>
      </div>
      <p style={{ fontSize: '10.5px', color: '#6b7280', marginTop: '2px', margin: '2px 0 0' }}>{edu.instituicao}</p>
    </div>
  )
}

function DiferencialItem({ text, acento }: { text: string; acento: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '8px',
      marginBottom: '9px', padding: '9px 13px',
      background: `${acento}08`, borderRadius: '6px',
      borderLeft: `3px solid ${acento}`,
    }}>
      <span style={{ color: acento, fontWeight: 800, fontSize: '9px', marginTop: '2px', flexShrink: 0 }}>✦</span>
      <p style={{ fontSize: '11px', color: '#374151', lineHeight: 1.6, margin: 0 }}>{text}</p>
    </div>
  )
}

function Sidebar({
  nome, foto, email, telefone, cidade, linkedin, instagram, outraRede,
  todasHabs, softSkills, maxSoftSkills, acento, isPremium = false, isLink = false,
  disponibilidade, modalidade, cnh, viagens, pretensao,
}: {
  nome: string; foto?: string | null; email: string; telefone: string; cidade: string;
  linkedin?: string; instagram?: string; outraRede?: string;
  todasHabs: Hab[]; softSkills?: string[]; maxSoftSkills?: number;
  acento: string; isPremium?: boolean; isLink?: boolean;
  disponibilidade?: string; modalidade?: string; cnh?: string; viagens?: boolean; pretensao?: string;
}) {
  function socialHref(url: string, platform: 'linkedin' | 'instagram' | 'other') {
    if (!url) return ''
    if (url.startsWith('http')) return url
    if (platform === 'instagram') return `https://instagram.com/${url.replace('@', '')}`
    if (platform === 'linkedin') return `https://linkedin.com/in/${url.replace(/.*linkedin\.com\/in\//, '')}`
    return url
  }

  const visibleSoftSkills = (softSkills || []).slice(0, maxSoftSkills ?? 5)
  const hasAnyInfo = !!(disponibilidade || modalidade || cnh || viagens || pretensao)

  return (
    <div style={{
      background: SIDEBAR_BG,
      padding: '0 20px 28px',
      display: 'flex',
      flexDirection: 'column',
      color: 'white',
      minHeight: '100%',
    }}>
      {/* Accent top bar */}
      <div style={{ height: '4px', background: acento, marginBottom: '24px', marginLeft: '-20px', marginRight: '-20px' }} />

      {/* Photo */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '22px' }}>
        {foto ? (
          <img src={foto} alt={nome} style={{
            width: '86px', height: '86px', borderRadius: '50%', objectFit: 'cover',
            border: `3px solid ${acento}`, boxShadow: `0 0 0 4px ${acento}22`, display: 'block',
          }} />
        ) : (
          <div style={{
            width: '86px', height: '86px', borderRadius: '50%', background: acento,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px', fontWeight: 900, color: 'white',
            border: '3px solid rgba(255,255,255,0.15)', boxShadow: `0 0 0 4px ${acento}22`,
          }}>
            {initials(nome)}
          </div>
        )}
      </div>

      {/* Contact */}
      <div style={{ marginBottom: '18px' }}>
        <SidebarLabel>Contato</SidebarLabel>
        {email && <ContactItem icon={<EmailIcon />} text={email} />}
        {telefone && <ContactItem icon={<PhoneIcon />} text={telefone} />}
        {cidade && <ContactItem icon={<LocationIcon />} text={cidade} />}
        {linkedin && (
          <ContactItem icon={<LinkedInIcon />} text={linkedin}
            href={isLink ? socialHref(linkedin, 'linkedin') : undefined} isLink={isLink} />
        )}
        {instagram && (
          <ContactItem icon={<InstagramIcon />} text={instagram}
            href={isLink ? socialHref(instagram, 'instagram') : undefined} isLink={isLink} />
        )}
        {outraRede && (
          <ContactItem icon={<GlobeIcon />} text={outraRede}
            href={isLink ? socialHref(outraRede, 'other') : undefined} isLink={isLink} />
        )}
      </div>

      <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', marginBottom: '18px' }} />

      {/* Skills + Languages integrated */}
      {todasHabs.length > 0 && (
        <div style={{ marginBottom: '18px' }}>
          <SidebarLabel>Habilidades</SidebarLabel>
          {todasHabs.map((h, i) => (
            <SkillBarSidebar key={i} nome={h.nome} nivel={h.nivel} acento={acento} />
          ))}
        </div>
      )}

      {/* Soft Skills */}
      {visibleSoftSkills.length > 0 && (
        <>
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', marginBottom: '18px' }} />
          <div style={{ marginBottom: '18px' }}>
            <SidebarLabel>Soft Skills</SidebarLabel>
            {visibleSoftSkills.map((skill, i) => {
              const parts = skill.split(' ')
              const emoji = parts[0]
              const texto = parts.slice(1).join(' ')
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '7px' }}>
                  <span style={{ fontSize: '13px', flexShrink: 0 }}>{emoji}</span>
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.3 }}>{texto}</span>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* Informações Adicionais */}
      {hasAnyInfo && (
        <>
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', marginBottom: '18px' }} />
          <div style={{ marginBottom: '18px' }}>
            <SidebarLabel>Informações</SidebarLabel>

            {/* Disponibilidade — sempre visível em free e premium */}
            {disponibilidade && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '7px' }}>
                <span style={{ fontSize: '11px', flexShrink: 0 }}>📅</span>
                <span style={{ fontSize: '9.5px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.3 }}>{disponibilidade}</span>
              </div>
            )}

            {/* Modalidade — sempre visível em free e premium */}
            {modalidade && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '7px' }}>
                <span style={{ fontSize: '11px', flexShrink: 0 }}>💻</span>
                <span style={{ fontSize: '9.5px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.3 }}>{modalidade}</span>
              </div>
            )}

            {/* CNH — premium ou trancado */}
            {isPremium ? (
              cnh && cnh !== 'Não possui' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '7px' }}>
                  <span style={{ fontSize: '11px', flexShrink: 0 }}>🚗</span>
                  <span style={{ fontSize: '9.5px', color: 'rgba(255,255,255,0.75)' }}>{cnh}</span>
                </div>
              )
            ) : (
              cnh && cnh !== 'Não possui' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '7px', opacity: 0.4 }}>
                  <span style={{ fontSize: '11px', flexShrink: 0 }}>🔒</span>
                  <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.55)', fontStyle: 'italic' }}>CNH — Premium</span>
                </div>
              )
            )}

            {/* Viagens — premium ou trancado */}
            {isPremium ? (
              viagens && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '7px' }}>
                  <span style={{ fontSize: '11px', flexShrink: 0 }}>✈️</span>
                  <span style={{ fontSize: '9.5px', color: 'rgba(255,255,255,0.75)' }}>Disponível p/ viagens</span>
                </div>
              )
            ) : (
              viagens && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '7px', opacity: 0.4 }}>
                  <span style={{ fontSize: '11px', flexShrink: 0 }}>🔒</span>
                  <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.55)', fontStyle: 'italic' }}>Viagens — Premium</span>
                </div>
              )
            )}

            {/* Pretensão — premium ou trancado */}
            {isPremium ? (
              pretensao && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '7px' }}>
                  <span style={{ fontSize: '11px', flexShrink: 0 }}>💰</span>
                  <span style={{ fontSize: '9.5px', color: 'rgba(255,255,255,0.75)' }}>{pretensao}</span>
                </div>
              )
            ) : (
              pretensao && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '7px', opacity: 0.4 }}>
                  <span style={{ fontSize: '11px', flexShrink: 0 }}>🔒</span>
                  <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.55)', fontStyle: 'italic' }}>Pretensão — Premium</span>
                </div>
              )
            )}
          </div>
        </>
      )}

      <div style={{ marginTop: 'auto', paddingTop: '16px', textAlign: 'center' }}>
        <p style={{ fontSize: '7.5px', color: 'rgba(255,255,255,0.15)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
          trampaí.com.br · {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   FREE MODEL
═══════════════════════════════════════════ */
function ModeloFree({ dados, foto }: { dados: DadosProps; foto?: string | null }) {
  const { nome, email, telefone, cidade, curriculo, linkedin, instagram, outraRede, semExperiencia } = dados
  const acento = FREE_ACCENT
  const habs = norm(curriculo.habilidades)
  const temExp = !semExperiencia && (curriculo.experiencias?.length ?? 0) > 0

  const todasHabs = [
    ...habs,
    ...(curriculo.idiomas?.map(l => ({ nome: `${l.nome} · ${l.nivel}`, nivel: l.porcentagem })) ?? [])
  ]

  return (
    <div id="curriculo-print" style={{
      width: '794px',
      minHeight: '1122px',
      display: 'grid',
      gridTemplateColumns: '1fr 230px',
      fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
      background: '#FAFAFA',
      boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      borderRadius: '8px',
      overflow: 'hidden',
    }}>

      {/* ──── LEFT MAIN ──── */}
      <div style={{ background: '#FAFAFA', padding: '42px 34px', color: '#1a1a1a', display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Name + Objective */}
        <div style={{ marginBottom: '26px' }}>
          <h1 style={{
            fontSize: '34px', fontWeight: 900, color: '#111827',
            lineHeight: 1.05, letterSpacing: '-1px', margin: '0 0 10px',
          }}>
            {nome}
          </h1>
          <span style={{
            display: 'inline-block', background: acento, color: 'white',
            padding: '4px 13px', borderRadius: '4px',
            fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.3px',
          }}>
            {curriculo.objetivo}
          </span>
          <div style={{
            height: '3px',
            background: `linear-gradient(to right, ${acento}, ${acento}44, transparent)`,
            borderRadius: '2px', marginTop: '18px',
          }} />
        </div>

        {/* Sobre Mim */}
        {curriculo.resumo && (
          <div style={{ marginBottom: '22px' }}>
            <SectionHeader acento={acento}>Sobre Mim</SectionHeader>
            <p style={{ fontSize: '11.5px', color: '#374151', lineHeight: 1.8, margin: 0 }}>{curriculo.resumo}</p>
          </div>
        )}

        {/* Experiência — only if has experience */}
        {temExp && (
          <div style={{ marginBottom: '22px' }}>
            <SectionHeader acento={acento}>Experiência Profissional</SectionHeader>
            {curriculo.experiencias.map((exp, i) => (
              <ExpCard key={i} exp={exp} acento={acento} />
            ))}
          </div>
        )}

        {/* Diferenciais — only if NO experience */}
        {!temExp && (curriculo.diferenciais?.length ?? 0) > 0 && (
          <div style={{ marginBottom: '22px' }}>
            <SectionHeader acento={acento}>Diferenciais e Projetos</SectionHeader>
            {curriculo.diferenciais.map((d, i) => (
              <DiferencialItem key={i} text={d} acento={acento} />
            ))}
          </div>
        )}

        {/* Formação */}
        {(curriculo.formacao?.length ?? 0) > 0 && (
          <div style={{ marginBottom: '22px' }}>
            <SectionHeader acento={acento}>Formação Acadêmica</SectionHeader>
            {curriculo.formacao.map((edu, i) => (
              <EduCard key={i} edu={edu} acento={acento} />
            ))}
          </div>
        )}

        {/* Cursos e Certificações — FREE: máx 2 */}
        {(curriculo.certificacoes?.length ?? 0) > 0 && (
          <div style={{ marginBottom: '22px' }}>
            <SectionHeader acento={acento}>Cursos e Certificações</SectionHeader>
            {curriculo.certificacoes!.slice(0, 2).map((cert, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: acento, flexShrink: 0, marginTop: '5px' }} />
                <p style={{ fontSize: '11.5px', color: '#374151', margin: 0, lineHeight: 1.5 }}>{cert}</p>
              </div>
            ))}
            {curriculo.certificacoes!.length > 2 && (
              <p style={{
                fontSize: '10px', color: acento, fontWeight: 600, marginTop: '6px',
                background: `${acento}10`, padding: '4px 10px', borderRadius: '4px',
                display: 'inline-block',
              }}>
                + {curriculo.certificacoes!.length - 2} curso(s) disponível(is) no Premium 👑
              </p>
            )}
          </div>
        )}

        {/* Footer accent */}
        <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
          <div style={{ height: '3px', background: `linear-gradient(to right, ${acento}, ${acento}44, transparent)`, borderRadius: '2px' }} />
        </div>
      </div>

      {/* ──── RIGHT SIDEBAR ──── */}
      <Sidebar
        nome={nome} foto={foto} email={email} telefone={telefone} cidade={cidade}
        linkedin={linkedin} instagram={instagram} outraRede={outraRede}
        todasHabs={todasHabs} softSkills={curriculo.softskills} maxSoftSkills={3}
        acento={acento} isPremium={false} isLink={false}
        disponibilidade={dados.disponibilidade} modalidade={dados.modalidade}
        cnh={dados.cnh} viagens={dados.viagens} pretensao={dados.pretensao}
      />
    </div>
  )
}

/* ═══════════════════════════════════════════
   PREMIUM MODEL
═══════════════════════════════════════════ */
function ModeloPremium({ dados, foto }: { dados: DadosProps; foto?: string | null }) {
  const [temaIdx, setTemaIdx] = useState(0)
  const acento = TEMAS[temaIdx]
  const { nome, email, telefone, cidade, curriculo, linkedin, instagram, outraRede, semExperiencia } = dados
  const habs = norm(curriculo.habilidades)
  const temExp = !semExperiencia && (curriculo.experiencias?.length ?? 0) > 0

  const todasHabs = [
    ...habs,
    ...(curriculo.idiomas?.map(l => ({ nome: `${l.nome} · ${l.nivel}`, nivel: l.porcentagem })) ?? [])
  ]

  const cartaHabs = habs.slice(0, 3).map(h => h.nome).join(', ')
  const dataHoje = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div>
      {/* Theme picker — hidden on print */}
      <div className="no-print" style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        marginBottom: '14px', padding: '10px 16px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)',
        width: 'fit-content',
      }}>
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>Tema:</span>
        {TEMAS.map((cor, i) => (
          <button
            key={i}
            onClick={() => setTemaIdx(i)}
            title={TEMA_NOMES[i]}
            style={{
              width: '22px', height: '22px', borderRadius: '50%', background: cor,
              border: temaIdx === i ? '2.5px solid white' : '2px solid transparent',
              cursor: 'pointer',
              outline: temaIdx === i ? `2.5px solid ${cor}` : 'none',
              outlineOffset: '2px', padding: 0, transition: 'all 0.15s',
            }}
          />
        ))}
      </div>

      {/* PRINTABLE AREA */}
      <div id="curriculo-print" style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>

        {/* PAGE 1 — Resume */}
        <div style={{
          width: '794px', minHeight: '1122px',
          display: 'grid', gridTemplateColumns: '1fr 230px',
          background: '#FAFAFA',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          borderRadius: '8px', overflow: 'hidden',
          pageBreakAfter: 'always', breakAfter: 'page',
        }}>

          {/* LEFT MAIN */}
          <div style={{ background: '#FAFAFA', color: '#1a1a1a', display: 'flex', flexDirection: 'column', minWidth: 0 }}>

            {/* Gradient header */}
            <div style={{
              background: `linear-gradient(135deg, ${acento}ee 0%, ${acento}99 100%)`,
              padding: '34px 34px 26px', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: '-24px', right: '20px', width: '110px', height: '110px', borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
              <div style={{ position: 'absolute', bottom: '-20px', right: '80px', width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
              <h1 style={{
                fontSize: '32px', fontWeight: 900, color: 'white',
                lineHeight: 1.05, letterSpacing: '-0.5px',
                margin: '0 0 8px', position: 'relative', zIndex: 1,
              }}>
                {nome}
              </h1>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.88)', fontWeight: 500, position: 'relative', zIndex: 1, margin: 0 }}>
                {curriculo.objetivo}
              </p>
            </div>

            {/* Content */}
            <div style={{ padding: '28px 34px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              {curriculo.resumo && (
                <div style={{ marginBottom: '22px' }}>
                  <SectionHeader acento={acento}>Sobre Mim</SectionHeader>
                  <p style={{ fontSize: '11.5px', color: '#374151', lineHeight: 1.8, margin: 0 }}>{curriculo.resumo}</p>
                </div>
              )}

              {temExp && (
                <div style={{ marginBottom: '22px' }}>
                  <SectionHeader acento={acento}>Experiência Profissional</SectionHeader>
                  {curriculo.experiencias.map((exp, i) => (
                    <ExpCard key={i} exp={exp} acento={acento} />
                  ))}
                </div>
              )}

              {!temExp && (curriculo.diferenciais?.length ?? 0) > 0 && (
                <div style={{ marginBottom: '22px' }}>
                  <SectionHeader acento={acento}>Diferenciais e Projetos</SectionHeader>
                  {curriculo.diferenciais.map((d, i) => (
                    <DiferencialItem key={i} text={d} acento={acento} />
                  ))}
                </div>
              )}

              {(curriculo.formacao?.length ?? 0) > 0 && (
                <div style={{ marginBottom: '22px' }}>
                  <SectionHeader acento={acento}>Formação Acadêmica</SectionHeader>
                  {curriculo.formacao.map((edu, i) => (
                    <EduCard key={i} edu={edu} acento={acento} />
                  ))}
                </div>
              )}

              {/* Cursos e Certificações — PREMIUM: todos */}
              {(curriculo.certificacoes?.length ?? 0) > 0 && (
                <div style={{ marginBottom: '22px' }}>
                  <SectionHeader acento={acento}>Cursos e Certificações</SectionHeader>
                  {curriculo.certificacoes!.map((cert, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: acento, flexShrink: 0, marginTop: '5px' }} />
                      <p style={{ fontSize: '11.5px', color: '#374151', margin: 0, lineHeight: 1.5 }}>{cert}</p>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
                <div style={{ height: '3px', background: `linear-gradient(to right, ${acento}, ${acento}44, transparent)`, borderRadius: '2px' }} />
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <Sidebar
            nome={nome} foto={foto} email={email} telefone={telefone} cidade={cidade}
            linkedin={linkedin} instagram={instagram} outraRede={outraRede}
            todasHabs={todasHabs} softSkills={curriculo.softskills} maxSoftSkills={5}
            acento={acento} isPremium={true} isLink={true}
            disponibilidade={dados.disponibilidade} modalidade={dados.modalidade}
            cnh={dados.cnh} viagens={dados.viagens} pretensao={dados.pretensao}
          />
        </div>

        {/* PAGE 2 — Carta de Apresentação */}
        <div style={{
          width: '794px', minHeight: '1122px', background: '#fff',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          borderRadius: '8px', overflow: 'hidden', marginTop: '20px',
          pageBreakBefore: 'always', breakBefore: 'page',
        }}>
          <div style={{ height: '5px', background: `linear-gradient(to right, ${acento}, ${acento}66)` }} />
          <div style={{ padding: '50px 58px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '36px' }}>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#111827', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
                  Carta de Apresentação
                </h2>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: `${acento}12`, border: `1px solid ${acento}33`, borderRadius: '99px', padding: '3px 10px' }}>
                  <span style={{ color: acento, fontSize: '10px' }}>✓</span>
                  <span style={{ fontSize: '9px', color: acento, fontWeight: 700 }}>Gerada por IA · Verificada</span>
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '11px', color: '#9ca3af', lineHeight: 1.7 }}>
                <div style={{ fontWeight: 700, color: '#374151' }}>{nome}</div>
                {email && <div>{email}</div>}
                <div>{dataHoje}</div>
              </div>
            </div>

            <div style={{ fontSize: '12.5px', color: '#374151', lineHeight: 2 }}>
              <p style={{ marginBottom: '16px' }}>Prezado(a) Recrutador(a),</p>
              <p style={{ marginBottom: '16px', textAlign: 'justify' }}>
                Venho por meio desta carta expressar meu interesse em contribuir com a sua equipe na posição de <strong style={{ color: '#111827' }}>{curriculo.objetivo}</strong>. Minha trajetória é marcada pela busca constante de crescimento profissional e pela entrega de resultados concretos.
              </p>
              <p style={{ marginBottom: '16px', textAlign: 'justify' }}>{curriculo.resumo}</p>
              {cartaHabs && (
                <p style={{ marginBottom: '16px', textAlign: 'justify' }}>
                  Entre minhas principais competências, destaco: <strong style={{ color: '#111827' }}>{cartaHabs}</strong>. Acredito que essas habilidades me capacitam a agregar valor imediato à organização, contribuindo tanto para o ambiente de trabalho quanto para os objetivos estratégicos da empresa.
                </p>
              )}
              {temExp && curriculo.experiencias.length > 0 && (
                <p style={{ marginBottom: '16px', textAlign: 'justify' }}>
                  Destaco minha experiência como <strong style={{ color: '#111827' }}>{curriculo.experiencias[0].cargo}</strong> na empresa <strong style={{ color: '#111827' }}>{curriculo.experiencias[0].empresa}</strong>, onde {curriculo.experiencias[0].descricao}
                </p>
              )}
              {!temExp && (curriculo.diferenciais?.length ?? 0) > 0 && (
                <p style={{ marginBottom: '16px', textAlign: 'justify' }}>
                  Embora esteja no início da minha trajetória profissional, trago como diferenciais importantes: {curriculo.diferenciais.slice(0, 2).join('; ')}. Estou comprometido(a) a aprender rapidamente e a contribuir com dedicação e entusiasmo.
                </p>
              )}
              <p style={{ marginBottom: '36px', textAlign: 'justify' }}>
                Estou à disposição para uma conversa e ansioso(a) para demonstrar como minhas competências podem se alinhar às necessidades da sua organização. Agradeço pela atenção e pelo tempo dedicado à análise do meu perfil.
              </p>
              <p style={{ marginBottom: '4px' }}>Atenciosamente,</p>
              <p style={{ fontWeight: 800, fontSize: '14px', color: '#111827', marginBottom: '4px' }}>{nome}</p>
              {email && <p style={{ fontSize: '11px', color: '#9ca3af', margin: '2px 0' }}>{email}</p>}
              {telefone && <p style={{ fontSize: '11px', color: '#9ca3af', margin: '2px 0' }}>{telefone}</p>}
              {linkedin && <p style={{ fontSize: '11px', color: acento, margin: '2px 0' }}>{linkedin}</p>}
            </div>
          </div>
          <div style={{ height: '5px', background: `linear-gradient(to right, ${acento}, ${acento}44)`, marginTop: 'auto' }} />
        </div>
      </div>
    </div>
  )
}

/* ─── Export ─── */
export default function CurriculoVisual({ dados, foto = null, modelo = 'free' }: Props) {
  if (modelo === 'premium') return <ModeloPremium dados={dados} foto={foto} />
  return <ModeloFree dados={dados} foto={foto} />
}
