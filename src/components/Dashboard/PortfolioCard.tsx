'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Portfolio } from '@/types'

interface PortfolioCardProps {
  portfolio: Portfolio
}

export function PortfolioCard({ portfolio }: PortfolioCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const formatPercent = (percent: number) => {
    const sign = percent > 0 ? '+' : ''
    return `${sign}${percent.toFixed(2)}%`
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Portfolio Value */}
      <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
        <CardContent className="p-6">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Total Portfolio</div>
            <div className="text-2xl font-bold">
              {formatCurrency(portfolio.totalValue)}
            </div>
            <div className="flex items-center gap-2">
              <div className={`text-sm font-medium ${
                portfolio.totalProfitPercent > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {formatPercent(portfolio.totalProfitPercent)}
              </div>
              <Badge variant="secondary" className="h-5 px-2 text-xs">
                All Time
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Profit */}
      <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
        <CardContent className="p-6">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Total Profit</div>
            <div className="text-2xl font-bold text-green-400">
              {formatCurrency(portfolio.totalProfit)}
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                {portfolio.totalTrades} trades
              </div>
              <Badge variant="outline" className="h-5 px-2 text-xs border-green-500/20">
                {formatPercent(portfolio.winRate)} win rate
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily P&L */}
      <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
        <CardContent className="p-6">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Daily P&L</div>
            <div className={`text-2xl font-bold ${
              portfolio.dailyPnl > 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {portfolio.dailyPnl > 0 ? '+' : ''}{formatCurrency(portfolio.dailyPnl)}
            </div>
            <div className="flex items-center gap-2">
              <div className={`text-sm font-medium ${
                portfolio.dailyPnlPercent > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {formatPercent(portfolio.dailyPnlPercent)}
              </div>
              <Badge variant="secondary" className="h-5 px-2 text-xs">
                Today
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Positions */}
      <Card className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-orange-500/20">
        <CardContent className="p-6">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Active Positions</div>
            <div className="text-2xl font-bold">
              {portfolio.activePositions}
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                {portfolio.followedAddresses} addresses
              </div>
              <Badge variant="outline" className="h-5 px-2 text-xs border-orange-500/20">
                Following
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}