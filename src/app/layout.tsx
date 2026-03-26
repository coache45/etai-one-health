import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ET AI - Bringing AI Down to Earth',
  description: 'AI for real people. Health tools, education, community, and wearables from ET AI.',
  keywords: ['health', 'wellness', 'AI coach', 'couples health', 'sleep tracking'],
  authors: [{ name: 'ET AI, LLC' }],
  openGraph: {
    title: 'ET AI - Bringing AI Down to Earth',
    description: 'Bringing AI Down to Earth.',
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




