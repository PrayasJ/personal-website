import './globals.scss'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Prayas Jain',
  description: 'Senior Software Developer With Experience in React, React-Native, Django, Node.js and other technologies.',
  openGraph: {
    title: 'Prayas Jain',
    description: 'Senior Full Stack Developer With Experience in React, React-Native, Django, Node.js and other technologies.',
    url: 'https://www.prayas.dev/',
    siteName: 'Prayas Jain - SDE',
    images: [
      {
        url: 'https://www.prayas.dev/images/site-preview.png',
        width: 1726,
        height: 971,
      },
      {
        url: 'https://www.prayas.dev/images/site-preview-square.png',
        width: 1019,
        height: 1019,
      }
    ],
    type: 'website'
  },
  twitter: {
    title: 'Prayas Jain',
    description: 'Senior Full Stack Developer With Experience in React, React-Native, Django, Node.js and other technologies.',
    images: [
      {
        url: 'https://www.prayas.dev/images/site-preview.png',
        width: 1726,
        height: 971,
      },
      {
        url: 'https://www.prayas.dev/images/site-preview-square.png',
        width: 1019,
        height: 1019,
      }
    ],
    card: 'summary_large_image'
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
