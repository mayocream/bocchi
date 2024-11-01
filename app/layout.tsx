import type { Metadata, Viewport } from 'next'
import { Noto_Sans_JP } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { QueryProvider } from '@/providers/query'
import { Theme } from '@radix-ui/themes'
import '@radix-ui/themes/styles.css'
import './globals.css'

const notoSansJP = Noto_Sans_JP({ subsets: ['latin'] })

const title = 'Twitter -「いま」起きていることを見つけよう'
const description = 'Twitterで「いま」起きていることを見つけよう'
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
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <Theme accentColor='blue'>
            <QueryProvider>{children}</QueryProvider>
          </Theme>
        </ThemeProvider>
      </body>
    </html>
  )
}
