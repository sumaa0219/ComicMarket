import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'C102委託管理',
  description: 'C102で委託を管理するためのページ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
