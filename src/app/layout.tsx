import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Here Ta Help - Mobile Repair Services',
  description: 'Professional mobile repair services for cars, boats, trucks, tires, locksmith services, and towing. Get help when and where you need it.',
  keywords: 'mobile repair, car repair, boat repair, truck repair, tire repair, locksmith, towing, emergency services',
  authors: [{ name: 'Here Ta Help' }],
  creator: 'Here Ta Help',
  publisher: 'Here Ta Help',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Here Ta Help - Mobile Repair Services',
    description: 'Professional mobile repair services for cars, boats, trucks, tires, locksmith services, and towing.',
    url: '/',
    siteName: 'Here Ta Help',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Here Ta Help - Mobile Repair Services',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Here Ta Help - Mobile Repair Services',
    description: 'Professional mobile repair services for cars, boats, trucks, tires, locksmith services, and towing.',
    images: ['/og-image.png'],
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
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
