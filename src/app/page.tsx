'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PortfolioCard } from '@/components/Dashboard/PortfolioCard'
import { PerformanceChart } from '@/components/Dashboard/PerformanceChart'
import { LiveFeed } from '@/components/Dashboard/LiveFeed'
import { Portfolio, Transaction, Position } from '@/types'

export default function DashboardPage() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [, setRecentTransactions] = useState<Transaction[]>([])
  const [activePositions, setActivePositions] = useState<Position[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Mock data - in real app, this would fetch from API
      setPortfolio({
        id: '1',
        userId: 'user-1',
        totalValue: 25847.32,
        totalProfit: 4231.18,
        totalProfitPercent: 19.6,
        dailyPnl: 452.67,
        dailyPnlPercent: 1.8,
        activePositions: 8,
        totalTrades: 156,
        winRate: 73.2,
        followedAddresses: 12,
        bestPerformer: '0x742d35cc',
        worstPerformer: '0x1a2b3c4d',
        updatedAt: new Date().toISOString()
      })

      setActivePositions([
        {
          id: '1',
          userId: 'user-1',
          targetAddress: '0x742d35cc6b25cc8f2f3b1b5d0d2e0e5c9e1d2c3a4b',
          tokenAddress: '0xa0b86a33e6bf67d4f3efab06f5a7f8b7e7c6d5e4',
          tokenSymbol: 'PEPE',
          tokenName: 'Pepe Token',
          entryPrice: 0.000001234,
          currentPrice: 0.000001456,
          amount: 1000000,
          value: 1456,
          profit: 222,
          profitPercent: 18.0,
          openedAt: new Date(Date.now() - 3600000).toISOString(),
          isOpen: true,
          copyTradeId: 'ct-1',
          originalTxHash: '0xabcdef123456',
          chain: 'ethereum'
        },
        {
          id: '2',
          userId: 'user-1',
          targetAddress: '0x742d35cc6b25cc8f2f3b1b5d0d2e0e5c9e1d2c3a4b',
          tokenAddress: '0xb1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0',
          tokenSymbol: 'SHIB',
          tokenName: 'Shiba Inu',
          entryPrice: 0.00000842,
          currentPrice: 0.00000791,
          amount: 50000000,
          value: 395.5,
          profit: -25.5,
          profitPercent: -6.0,
          openedAt: new Date(Date.now() - 7200000).toISOString(),
          isOpen: true,
          copyTradeId: 'ct-2',
          originalTxHash: '0xdef456789abc',
          chain: 'ethereum'
        }
      ])

    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Your copy trading portfolio overview
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="h-8 px-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
            Live
          </Badge>
          <Button variant="default">
            New Copy Trade
          </Button>
        </div>
      </div>

      {/* Portfolio Overview */}
      {portfolio && <PortfolioCard portfolio={portfolio} />}

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Chart */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Portfolio Performance</CardTitle>
                <CardDescription>
                  Last 30 days profit/loss tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PerformanceChart />
              </CardContent>
            </Card>

            {/* Top Performers */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>
                  Your most profitable followed addresses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { address: '0x742d35cc', profit: '+$1,234', roi: '+23.4%', trades: 8 },
                    { address: '0x1a2b3c4d', profit: '+$892', roi: '+18.7%', trades: 12 },
                    { address: '0x9e8f7a6b', profit: '+$654', roi: '+15.2%', trades: 6 }
                  ].map((performer, index) => (
                    <div key={performer.address} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-sm font-bold">
                          #{index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{performer.address}</div>
                          <div className="text-xs text-muted-foreground">{performer.trades} trades</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-medium">{performer.profit}</div>
                        <div className="text-xs text-green-400">{performer.roi}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live Feed */}
          <Card>
            <CardHeader>
              <CardTitle>Live Trading Feed</CardTitle>
              <CardDescription>
                Real-time trades from your followed addresses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LiveFeed />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="positions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Positions</CardTitle>
              <CardDescription>
                Your current open trades from copy trading
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activePositions.map((position) => (
                  <div key={position.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center font-bold">
                        {position.tokenSymbol.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{position.tokenSymbol}</div>
                        <div className="text-sm text-muted-foreground">
                          {position.amount.toLocaleString()} tokens
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Entry</div>
                      <div className="font-medium">${position.entryPrice}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Current</div>
                      <div className="font-medium">${position.currentPrice}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Value</div>
                      <div className="font-medium">${position.value.toFixed(2)}</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${position.profit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {position.profit > 0 ? '+' : ''}${position.profit.toFixed(2)}
                      </div>
                      <div className={`text-sm ${position.profitPercent > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {position.profitPercent > 0 ? '+' : ''}{position.profitPercent.toFixed(1)}%
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Close
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest copy trading transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Activity feed will be loaded here with real-time transaction data
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics & Insights</CardTitle>
              <CardDescription>
                Advanced performance metrics and AI-powered insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Advanced analytics will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}