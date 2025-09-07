import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'
import { Sidebar } from '@/components/common/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CopyTrade Pro - Blockchain Copy Trading Platform',
  description: 'Track profitable blockchain addresses and copy their trades automatically with real-time analytics and risk management.',
  keywords: 'blockchain, copy trading, crypto, DeFi, trading bot, crypto trading',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-screen bg-background">
            <Sidebar />
            <main className="flex-1 overflow-hidden">
              <div className="h-full overflow-auto">
                {children}
              </div>
            </main>
          </div>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 5000,
              style: {
                background: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}