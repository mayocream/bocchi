import type { Metadata, Viewport } from 'next'
import { Noto_Sans_JP } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Theme } from '@radix-ui/themes'
import '@radix-ui/themes/styles.css'
import './globals.css'

const notoSansJP = Noto_Sans_JP({ subsets: ['latin'] })

const title = 'Twitter JP - クリエイターのためのキャンバス'
const description =
  'Twitter JP は、クリエイターの筆を自由に振るえる無料のキャンバス。ファンと共に新しい景色を描き、才能で彩る未来を創造しましょう。あなたの独創性が、この世界に鮮やかな変化をもたらします。'
const image = `${process.env.NEXT_PUBLIC_BASE_URL}/icon.svg`

export const metadata: Metadata = {
  title,
  description,
  icons: [image],
  openGraph: {
    title,
    description,
    images: [image],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [image],
    creator: '@mayo_irl',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL!),
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  userScalable: false,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='ja' suppressHydrationWarning>
      <body className={notoSansJP.className}>
        <ThemeProvider attribute='class'>
          <Theme>{children}</Theme>
        </ThemeProvider>
      </body>
    </html>
  )
}
