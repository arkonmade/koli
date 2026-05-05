// src/app/layout.tsx
import type { Metadata } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'KOLI — Rwanda\'s Influencer Platform',
  description: 'Find and connect with top influencers in Rwanda. Fast, direct, no middlemen.',
  keywords: 'influencers Rwanda, Kigali creators, brand collaboration Rwanda',
  openGraph: {
    title: 'KOLI — Rwanda\'s Influencer Platform',
    description: 'Find and connect with top influencers in Rwanda. Fast, direct, no middlemen.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
