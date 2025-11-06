import type { Metadata, Viewport } from 'next'
import { Inter, Geist, Geist_Mono, Roboto, Fira_Code, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import FloatingChat from '@/components/custom/floating-chat'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
})

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
})

export const metadata: Metadata = {
  title: 'Fittar - App de Fitness com IA',
  description: 'Transforme seu corpo com inteligência artificial. Cardápios personalizados, treinos sob medida e acompanhamento completo.',
  keywords: 'fitness, academia, dieta, treino, inteligência artificial, emagrecimento, hipertrofia, nutrição',
  authors: [{ name: 'Fittar Team' }],
  creator: 'Fittar',
  publisher: 'Fittar',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://fittar.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Fittar - App de Fitness com IA',
    description: 'Transforme seu corpo com inteligência artificial. Cardápios personalizados, treinos sob medida e acompanhamento completo.',
    url: 'https://fittar.app',
    siteName: 'Fittar',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Fittar - App de Fitness com IA',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fittar - App de Fitness com IA',
    description: 'Transforme seu corpo com inteligência artificial. Cardápios personalizados, treinos sob medida e acompanhamento completo.',
    images: ['/og-image.png'],
    creator: '@fittar_oficial',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-verification-code',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#10b981' },
    { media: '(prefers-color-scheme: dark)', color: '#059669' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${geist.variable} ${geistMono.variable} ${roboto.variable} ${firaCode.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#10b981" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Fittar" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#10b981" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* PWA iOS Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-startup-image" href="/apple-splash-2048-2732.png" sizes="2048x2732" />
        <link rel="apple-touch-startup-image" href="/apple-splash-1668-2224.png" sizes="1668x2224" />
        <link rel="apple-touch-startup-image" href="/apple-splash-1536-2048.png" sizes="1536x2048" />
        <link rel="apple-touch-startup-image" href="/apple-splash-1125-2436.png" sizes="1125x2436" />
        <link rel="apple-touch-startup-image" href="/apple-splash-1242-2208.png" sizes="1242x2208" />
        <link rel="apple-touch-startup-image" href="/apple-splash-750-1334.png" sizes="750x1334" />
        <link rel="apple-touch-startup-image" href="/apple-splash-828-1792.png" sizes="828x1792" />
      </head>
      <body className="font-inter antialiased bg-white text-gray-900 overflow-x-hidden">
        <div className="min-h-screen">
          {children}
        </div>
        
        {/* Chat Flutuante com IA Especializada */}
        <FloatingChat />
        
        {/* PWA Install Script */}
        <script src="/pwa-installer.js" defer></script>
      </body>
    </html>
  )
}