import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LeadMap - Prospecção Inteligente com Google Maps & IA',
  description:
    'Encontre, qualifique e converta leads locais sem site e com alto potencial usando IA e dados em tempo real do Google Maps.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#007AFF',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} min-h-screen bg-[var(--background)] antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
