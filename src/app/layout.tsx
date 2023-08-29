import './globals.scss'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Prayas Jain',
  description: 'Prayas Jain - Full-Stack Software Developer crafting inclusive and high-performance web experiences. Building accessible products for seamless user interactions.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} style={{margin: 0}}>{children}</body>
    </html>
  )
}
