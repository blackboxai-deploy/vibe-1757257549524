'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { BlockchainAddress } from '@/types'

interface AddressDetailsProps {
  address: BlockchainAddress
  onClose: () => void
}

const mockPerformanceData = [
  { date: '2024-01', profit: 12000, roi: 15.2 },
  { date: '2024-02', profit: 18500, roi: 28.7 },
  { date: '2024-03', profit: 25000, roi: 42.1 },
  { date: '2024-04', profit: 19800, roi: 38.9 },
  { date: '2024-05', profit: 34200, roi: 65.3 },
  { date: '2024-06', profit: 28900, roi: 56.8 }
]

const mockTokenDistribution = [
  { name: 'PEPE', value: 35, profit: 45000 },
  { name: 'SHIB', value: 25, profit: 32000 },
  { name: 'DOGE', value: 20, profit: 28000 },
  { name: 'FLOKI', value: 12, profit: 15000 },
  { name: 'Others', value: 8, profit: 12000 }
]

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']

export function AddressDetails({ address, onClose }: AddressDetailsProps) {
  const [isFollowing, setIsFollowing] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 8)}...${addr.slice(-8)}`
  }

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <div className="text-sm font-medium mb-1">{label}</div>
          <div className="space-y-1">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Profit:</span>
              <span className="font-medium text-green-400">
                {formatCurrency(payload[0].value)}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">ROI:</span>
              <span className="font-medium">
                {payload[1]?.value?.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={address.avatar} alt={address.name} />
              <AvatarFallback className="text-xl">
                {address.name?.charAt(0) || address.address.slice(2, 4).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="flex items-center gap-3 text-xl">
                {address.name || formatAddress(address.address)}
                {address.isVerified && (
                  <Badge variant="secondary" className="h-6 px-2">
                    ✓ Verified
                  </Badge>
                )}
              </DialogTitle>
              <DialogDescription className="text-base mt-1">
                {formatAddress(address.address)} • {address.followers.toLocaleString()} followers
              </DialogDescription>
              <div className="flex flex-wrap gap-2 mt-2">
                {address.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="h-5 px-2">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="text-right">
              <Button
                onClick={handleFollow}
                variant={isFollowing ? "default" : "outline"}
                className="mb-2"
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
              <div className="text-sm text-muted-foreground">
                Active {Math.floor(Math.random() * 60)} minutes ago
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="trades">Recent Trades</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {formatCurrency(address.totalProfit)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Profit</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">
                    {address.roi.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">ROI</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">
                    {address.winRate.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Win Rate</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">
                    {address.totalTrades}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Trades</div>
                </CardContent>
              </Card>
            </div>

            {/* Trading Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Trading Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Average Hold Time</span>
                    <span className="font-medium">{address.avgHoldTime.toFixed(1)} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Risk Score</span>
                    <Badge variant="outline">
                      {address.riskScore.toFixed(1)}/10
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Best Trade</span>
                    <span className="font-medium text-green-400">+$12,450</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Worst Trade</span>
                    <span className="font-medium text-red-400">-$2,180</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg Position Size</span>
                    <span className="font-medium">$3,250</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Token Distribution</CardTitle>
                  <CardDescription>Top tokens by profit allocation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={mockTokenDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {mockTokenDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {mockTokenDistribution.slice(0, 4).map((token, index) => (
                      <div key={token.name} className="flex items-center gap-2 text-sm">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index] }}
                        />
                        <span className="font-medium">{token.name}</span>
                        <span className="text-muted-foreground ml-auto">
                          {token.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Chart</CardTitle>
                <CardDescription>Profit and ROI over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false}
                        tickLine={false}
                        className="text-xs fill-muted-foreground"
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        className="text-xs fill-muted-foreground"
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="profit"
                        stroke="#22c55e"
                        strokeWidth={2}
                        dot={{ fill: '#22c55e', r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="roi"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trades" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Trades</CardTitle>
                <CardDescription>Latest transactions from this address</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Recent trades data will be loaded here
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Analytics</CardTitle>
                <CardDescription>Advanced insights and predictions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  AI-powered analytics will be displayed here
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}