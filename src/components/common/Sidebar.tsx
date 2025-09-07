'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { WalletConnect } from './WalletConnect'

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: '📊',
    description: 'Portfolio overview'
  },
  {
    name: 'Top Addresses',
    href: '/addresses',
    icon: '🏆',
    description: 'Profitable wallets'
  },
  {
    name: 'Copy Trading',
    href: '/copy-trade',
    icon: '📈',
    description: 'Manage positions'
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: '🔍',
    description: 'Advanced insights'
  },
  {
    name: 'Live Feed',
    href: '/feed',
    icon: '⚡',
    description: 'Real-time trades'
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: '⚙️',
    description: 'Preferences'
  }
]

const chains = [
  { name: 'Ethereum', symbol: 'ETH', active: true, color: 'bg-blue-500' },
  { name: 'BSC', symbol: 'BNB', active: true, color: 'bg-yellow-500' },
  { name: 'Polygon', symbol: 'MATIC', active: false, color: 'bg-purple-500' },
  { name: 'Arbitrum', symbol: 'ARB', active: true, color: 'bg-cyan-500' }
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className={cn(
      "flex flex-col bg-card border-r border-border transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                CopyTrade Pro
              </h1>
              <p className="text-xs text-muted-foreground">
                Blockchain Copy Trading
              </p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0"
          >
            {isCollapsed ? '→' : '←'}
          </Button>
        </div>
      </div>

      {/* Wallet Connection */}
      <div className="p-4">
        <WalletConnect collapsed={isCollapsed} />
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive && "bg-primary text-primary-foreground shadow-sm"
                )}
              >
                <span className="text-lg">{item.icon}</span>
                {!isCollapsed && (
                  <div className="flex-1">
                    <div className="text-sm font-medium">{item.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.description}
                    </div>
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </nav>

      <Separator />

      {/* Chain Status */}
      {!isCollapsed && (
        <div className="p-4">
          <div className="text-sm font-medium mb-3">Active Chains</div>
          <div className="grid grid-cols-2 gap-2">
            {chains.map((chain) => (
              <div
                key={chain.symbol}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg text-xs",
                  "border border-border",
                  chain.active ? "bg-accent/50" : "opacity-50"
                )}
              >
                <div className={cn("w-2 h-2 rounded-full", chain.color)} />
                <span className="font-medium">{chain.symbol}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Stats */}
      {!isCollapsed && (
        <div className="p-4 border-t border-border">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Active Copies</span>
              <Badge variant="secondary" className="h-5 px-2">
                12
              </Badge>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Total Profit</span>
              <span className="text-green-400 font-medium">+$2,847</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}