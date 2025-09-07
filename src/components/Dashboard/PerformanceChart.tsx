'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ChartData } from '@/types'

export function PerformanceChart() {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadChartData()
  }, [])

  const loadChartData = async () => {
    try {
      // Mock performance data for the last 30 days
      const mockData: ChartData[] = []
      const now = new Date()
      let portfolioValue = 21000
      
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        
        // Simulate realistic portfolio growth with some volatility
        const randomChange = (Math.random() - 0.5) * 0.08 // ±4% daily change
        const trendChange = i < 15 ? 0.003 : 0.001 // Higher growth in recent days
        portfolioValue *= (1 + randomChange + trendChange)
        
        mockData.push({
          timestamp: date.toISOString().split('T')[0],
          value: Math.round(portfolioValue),
          profit: Math.round(portfolioValue - 21000),
          volume: Math.round(Math.random() * 50000 + 10000)
        })
      }
      
      setChartData(mockData)
    } catch (error) {
      console.error('Failed to load chart data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <div className="text-sm font-medium mb-2">
            {formatDate(label)}
          </div>
          <div className="space-y-1">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Portfolio Value:</span>
              <span className="font-medium">{formatCurrency(data.value)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Profit:</span>
              <span className={`font-medium ${data.profit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {data.profit > 0 ? '+' : ''}{formatCurrency(data.profit)}
              </span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-4">
      {/* Chart Stats */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="text-2xl font-bold">
            {formatCurrency(chartData[chartData.length - 1]?.value || 0)}
          </div>
          <div className="flex items-center gap-2">
            <div className="text-green-400 text-sm font-medium">
              +{formatCurrency(chartData[chartData.length - 1]?.profit || 0)}
            </div>
            <div className="text-xs text-muted-foreground">
              Last 30 days
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-muted-foreground">ROI</div>
          <div className="text-lg font-bold text-green-400">
            +{(((chartData[chartData.length - 1]?.profit || 0) / 21000) * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatDate}
              axisLine={false}
              tickLine={false}
              className="text-xs fill-muted-foreground"
            />
            <YAxis 
              tickFormatter={formatCurrency}
              axisLine={false}
              tickLine={false}
              className="text-xs fill-muted-foreground"
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, className: "fill-green-400" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Indicators */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
        <div className="text-center">
          <div className="text-lg font-bold text-green-400">↗ 8.4%</div>
          <div className="text-xs text-muted-foreground">Best Day</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-red-400">↘ 3.2%</div>
          <div className="text-xs text-muted-foreground">Worst Day</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold">1.8%</div>
          <div className="text-xs text-muted-foreground">Avg Daily</div>
        </div>
      </div>
    </div>
  )
}