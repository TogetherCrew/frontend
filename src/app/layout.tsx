import { Inter, Roboto_Mono } from 'next/font/google'

import "@/styles/globals.css";

import { AuthProvider } from '@/context/AuthProvider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
})


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <body className={`${inter.variable} ${roboto_mono.variable} antialiased`}>
        <AuthProvider>
          <div className="flex min-h-screen bg-gray-100 overflow-y-hidden">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}