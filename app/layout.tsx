import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CurrículoIA — Crie seu currículo em 2 minutos',
  description: 'Gere um currículo profissional com IA e simule entrevistas reais. Grátis para começar.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}