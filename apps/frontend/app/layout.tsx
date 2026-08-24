import type { Metadata } from 'next'
// react-big-calendar's own stylesheet must load BEFORE globals.css, which
// carries the dark-theme overrides for it (moved out of
// pages/admin/EventsManagement.css).
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: {
    default: 'OCH - Ocean Ceylon Holdings',
    template: '%s | Ocean Ceylon Holdings',
  },
  description:
    'OceanLK Holdings - A premier corporate holding company with diverse portfolio across multiple sectors',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        {/* Google Fonts - Saira Semi Condensed. Replaced by next/font/google in Phase 4. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Saira+Semi+Condensed:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0f1e3a',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
            },
          }}
        />
        {children}
      </body>
    </html>
  )
}
