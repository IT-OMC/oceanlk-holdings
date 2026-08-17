import type { Metadata, Viewport } from 'next'
import { Toaster } from 'react-hot-toast'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'OceanLK Holdings | Pioneering Global Excellence',
    template: '%s | OceanLK Holdings',
  },
  description: 'OceanLK Holdings is a diversified multinational conglomerate shaping the future across marine services, logistics, global trade, green energy, and technology.',
  keywords: ['OceanLK', 'Ocean Ceylon Holdings', 'Marine Services', 'Logistics', 'Maritime', 'Conglomerate', 'Global Trade'],
  authors: [{ name: 'OceanLK Holdings' }],
  metadataBase: new URL('https://ocean.lk'),
  openGraph: {
    title: 'OceanLK Holdings | Pioneering Global Excellence',
    description: 'A premier diversified global enterprise empowering industries worldwide.',
    url: 'https://ocean.lk',
    siteName: 'OceanLK Holdings',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OceanLK Holdings',
    description: 'Pioneering Global Excellence across maritime, logistics, and innovation.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#0056b3',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Saira+Semi+Condensed:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#F8F9FA] text-[#1a202c] font-sans antialiased selection:bg-secondary selection:text-white">
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        {children}
      </body>
    </html>
  )
}
