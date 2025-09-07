'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Transaction } from '@/types'

export function LiveFeed() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLive, setIsLive] = useState(true)

  useEffect(() => {
    loadInitialTransactions()
    if (isLive) {
      const interval = setInterval(addNewTransaction, 3000)
      return () => clearInterval(interval)
    }
    return undefined
  }, [isLive])

  const loadInitialTransactions = () => {
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        hash: '0xabcdef123456789',
        fromAddress: '0x742d35cc6b25cc8f2f3b1b5d0d2e0e5c9e1d2c3a4b',
        tokenAddress: '0xa0b86a33e6bf67d4f3efab06f5a7f8b7e7c6d5e4',
        tokenSymbol: 'PEPE',
        tokenName: 'Pepe Token',
        amount: 1000000,
        usdValue: 1234,
        type: 'BUY',
        profit: 156,
        profitPercent: 12.6,
        timestamp: new Date().toISOString(),
        blockNumber: 18742563,
        gasUsed: 120000,
        gasPrice: 25,
        chain: 'ethereum',
        dexName: 'Uniswap V3'
      },
      {
        id: '2',
        hash: '0xdef456789abc123',
        fromAddress: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
        tokenAddress: '0xb1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0',
        tokenSymbol: 'SHIB',
        tokenName: 'Shiba Inu',
        amount: 50000000,
        usdValue: 892,
        type: 'SELL',
        profit: 73,
        profitPercent: 8.9,
        timestamp: new Date(Date.now() - 60000).toISOString(),
        blockNumber: 18742558,
        gasUsed: 95000,
        gasPrice: 22,
        chain: 'ethereum',
        dexName: 'SushiSwap'
      },
      {
        id: '3',
        hash: '0x123456789abcdef',
        fromAddress: '0x9e8f7a6b5c4d3e2f1g0h9i8j7k6l5m4n3o2p1q0r',
        tokenAddress: '0xc3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2',
        tokenSymbol: 'DOGE',
        tokenName: 'Dogecoin',
        amount: 75000,
        usdValue: 654,
        type: 'BUY',
        profit: -12,
        profitPercent: -1.8,
        timestamp: new Date(Date.now() - 120000).toISOString(),
        blockNumber: 18742552,
        gasUsed: 85000,
        gasPrice: 28,
        chain: 'ethereum',
        dexName: 'Uniswap V2'
      }
    ]
    setTransactions(mockTransactions)
  }

  const addNewTransaction = () => {
    const tokens = ['PEPE', 'SHIB', 'FLOKI', 'BONK', 'WOJAK', 'MEME']
    const types: ('BUY' | 'SELL')[] = ['BUY', 'SELL']
    const addresses = [
      '0x742d35cc6b25cc8f2f3b1b5d0d2e0e5c9e1d2c3a4b',
      '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
      '0x9e8f7a6b5c4d3e2f1g0h9i8j7k6l5m4n3o2p1q0r'
    ]
    
    const randomToken = tokens[Math.floor(Math.random() * tokens.length)]
    const randomType = types[Math.floor(Math.random() * types.length)]
    const randomAddress = addresses[Math.floor(Math.random() * addresses.length)]
    
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      hash: `0x${Math.random().toString(16).substr(2, 15)}`,
      fromAddress: randomAddress,
      tokenAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
      tokenSymbol: randomToken,
      tokenName: `${randomToken} Token`,
      amount: Math.floor(Math.random() * 10000000) + 100000,
      usdValue: Math.floor(Math.random() * 5000) + 100,
      type: randomType,
      profit: Math.floor(Math.random() * 500) - 100,
      profitPercent: (Math.random() * 40) - 10,
      timestamp: new Date().toISOString(),
      blockNumber: 18742563 + Math.floor(Math.random() * 100),
      gasUsed: Math.floor(Math.random() * 100000) + 50000,
      gasPrice: Math.floor(Math.random() * 50) + 15,
      chain: 'ethereum',
      dexName: ['Uniswap V3', 'SushiSwap', 'Uniswap V2'][Math.floor(Math.random() * 3)]
    }

    setTransactions(prev => [newTransaction, ...prev.slice(0, 9)]) // Keep only 10 latest
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    return `${Math.floor(seconds / 3600)}h ago`
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant={isLive ? "default" : "outline"} className="h-6 px-3">
            <div className={`w-2 h-2 rounded-full mr-2 ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
            {isLive ? 'Live' : 'Paused'}
          </Badge>
          <div className="text-sm text-muted-foreground">
            {transactions.length} recent trades
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsLive(!isLive)}
        >
          {isLive ? 'Pause' : 'Resume'}
        </Button>
      </div>

      {/* Feed */}
      <ScrollArea className="h-80">
        <div className="space-y-3">
          {transactions.map((tx, index) => (
            <div
              key={tx.id}
              className={`flex items-center justify-between p-3 border border-border rounded-lg transition-all ${
                index === 0 && isLive ? 'border-green-500/50 bg-green-500/5' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  tx.type === 'BUY' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {tx.type === 'BUY' ? '↗' : '↘'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{tx.tokenSymbol}</span>
                    <Badge variant="outline" className="h-4 px-1.5 text-xs">
                      {tx.dexName}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatAddress(tx.fromAddress)} • {formatTime(tx.timestamp)}
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm font-medium">
                  {formatNumber(tx.amount)} {tx.tokenSymbol}
                </div>
                <div className="text-xs text-muted-foreground">
                  ${tx.usdValue.toLocaleString()}
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-sm font-medium ${
                  (tx.profit || 0) > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {(tx.profit || 0) > 0 ? '+' : ''}${tx.profit || 0}
                </div>
                <div className={`text-xs ${
                  (tx.profitPercent || 0) > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {(tx.profitPercent || 0) > 0 ? '+' : ''}{(tx.profitPercent || 0).toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}