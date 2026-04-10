import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ET AI Academy — Bringing AI Down to Earth',
  description: 'Free ELI5 guides, AI tools, and a community that speaks plain English. Learn anything. Understand everything.',
  keywords: ['AI', 'learning', 'ELI5', 'health', 'wellness', 'language learning', 'ET AI', 'Academy'],
  authors: [{ name: 'ET AI, LLC' }],
  openGraph: {
    title: 'ET AI Academy',
    description: 'Bringing AI Down to Earth — one lesson at a time.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1B2A4A',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.1)',
            },
          }}
        />
      </body>
    </html>
  )
}
