import './globals.css'
import { Providers } from '@/components/providers'

export const metadata = {
  title: 'HereTaHelp - Automotive Services On Demand',
  description: 'Get instant help with towing, repairs, and automotive services. Connect with verified technicians in your area.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
