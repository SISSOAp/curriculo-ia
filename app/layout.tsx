import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Trampaí — Seu trampo começa aqui',
  description: 'Crie seu currículo profissional com IA em 2 minutos e simule entrevistas reais. 100% grátis.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}