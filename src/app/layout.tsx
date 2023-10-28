import './globals.scss'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Prayas Jain',
  description: 'Senior full stack developer with experience in react, react native, django, nodejs and other technologies.',
  openGraph: {

  },
  keywords: ['react', 'react-native', 'django', 'python', 'nodejs', 'wordpress', 'nextjs', 'express', 'docker', 'SDE', 'fullstack', 'developer']
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} style={{margin: 0}}>{children}<Analytics /></body>
    </html>
  )
}
