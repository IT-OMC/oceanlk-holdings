import type { Metadata } from 'next'
import { Saira_Semi_Condensed } from 'next/font/google'
// react-big-calendar's own stylesheet must load BEFORE globals.css, which
// carries the dark-theme overrides for it (moved out of
// pages/admin/EventsManagement.css).
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './globals.css'
import { Toaster } from 'react-hot-toast'

import { I18nProvider } from '@/components/I18nProvider'

const saira = Saira_Semi_Condensed({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-saira',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {
    default: 'OCH - Ocean Ceylon Holdings',
    template: '%s | Ocean Ceylon Holdings',
  },
  description:
    'OceanLK Holdings - A premier corporate holding company with diverse portfolio across multiple sectors',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={saira.variable}>
      <body>
        <I18nProvider>
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
        </I18nProvider>
      </body>
    </html>
  )
}
