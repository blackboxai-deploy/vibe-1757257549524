'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'

import { FollowModal } from '@/components/CopyTrade/FollowModal'
import { PositionManager } from '@/components/CopyTrade/PositionManager'
import { CopyTradeConfig, Position, BlockchainAddress } from '@/types'

export default function CopyTradePage() {
  const [copyTrades, setCopyTrades] = useState<CopyTradeConfig[]>([])
  const [activePositions, setActivePositions] = useState<Position[]>([])
  const [followedAddresses, setFollowedAddresses] = useState<BlockchainAddress[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showFollowModal, setShowFollowModal] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState<BlockchainAddress | null>(null)

  useEffect(() => {
    loadCopyTradeData()
  }, [])

  const loadCopyTradeData = async () => {
    try {
      // Mock data - in real app, would fetch from API
      const mockCopyTrades: CopyTradeConfig[] = [
        {
          id: '1',
          userId: 'user-1',
          targetAddress: '0x742d35cc6b25cc8f2f3b1b5d0d2e0e5c9e1d2c3a4b',
          isActive: true,
          copyMethod: 'PERCENTAGE',
          copyAmount: 5.0,
          maxPositionSize: 1000,
          stopLossPercent: 15,
          takeProfitPercent: 25,
          delaySeconds: 30,
          allowedTokens: ['PEPE', 'SHIB', 'DOGE'],
          minLiquidity: 100000,
          slippageTolerance: 2.5,
          createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          userId: 'user-1',
          targetAddress: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
          isActive: true,
          copyMethod: 'FIXED_AMOUNT',
          copyAmount: 500,
          maxPositionSize: 2000,
          stopLossPercent: 10,
          takeProfitPercent: 20,
          delaySeconds: 15,
          minLiquidity: 250000,
          slippageTolerance: 1.5,
          createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]

      const mockPositions: Position[] = [
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
          copyTradeId: '1',
          originalTxHash: '0xabcdef123456',
          chain: 'ethereum'
        },
        {
          id: '2',
          userId: 'user-1',
          targetAddress: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
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
          copyTradeId: '2',
          originalTxHash: '0xdef456789abc',
          chain: 'ethereum'
        }
      ]

      const mockFollowedAddresses: BlockchainAddress[] = [
        {
          id: '1',
          address: '0x742d35cc6b25cc8f2f3b1b5d0d2e0e5c9e1d2c3a4b',
          name: 'DegenKing',
          avatar: 'https://placehold.co/40x40?text=DK',
          isVerified: true,
          followers: 1247,
          totalProfit: 156780,
          roi: 89.4,
          winRate: 78.5,
          totalTrades: 342,
          avgHoldTime: 4.2,
          riskScore: 6.8,
          chain: 'ethereum',
          tags: ['MEV', 'DeFi', 'Alpha'],
          createdAt: '2023-01-15T10:30:00Z',
          lastActive: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: '2',
          address: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
          name: 'CryptoWhale',
          avatar: 'https://placehold.co/40x40?text=CW',
          isVerified: true,
          followers: 892,
          totalProfit: 234567,
          roi: 67.2,
          winRate: 82.1,
          totalTrades: 198,
          avgHoldTime: 8.7,
          riskScore: 4.3,
          chain: 'ethereum',
          tags: ['Blue Chip', 'Long Term'],
          createdAt: '2022-11-08T14:20:00Z',
          lastActive: new Date(Date.now() - 1800000).toISOString()
        }
      ]

      setCopyTrades(mockCopyTrades)
      setActivePositions(mockPositions)
      setFollowedAddresses(mockFollowedAddresses)
    } catch (error) {
      console.error('Failed to load copy trade data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleCopyTrade = (copyTradeId: string) => {
    setCopyTrades(prev => prev.map(ct => 
      ct.id === copyTradeId ? { ...ct, isActive: !ct.isActive } : ct
    ))
  }

  const handleAddressFollow = (address: BlockchainAddress) => {
    setSelectedAddress(address)
    setShowFollowModal(true)
  }

  const calculateTotalValue = () => {
    return activePositions.reduce((sum, pos) => sum + pos.value, 0)
  }

  const calculateTotalProfit = () => {
    return activePositions.reduce((sum, pos) => sum + pos.profit, 0)
  }

  const calculateWinRate = () => {
    if (activePositions.length === 0) return 0
    const profitablePositions = activePositions.filter(pos => pos.profit > 0).length
    return (profitablePositions / activePositions.length) * 100
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
          <h1 className="text-3xl font-bold">Copy Trading</h1>
          <p className="text-muted-foreground">
            Manage your automated copy trading strategies
          </p>
        </div>
        <Button 
          variant="default"
          onClick={() => setShowFollowModal(true)}
        >
          Follow New Address
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{copyTrades.filter(ct => ct.isActive).length}</div>
            <div className="text-sm text-muted-foreground">Active Strategies</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">${calculateTotalValue().toFixed(2)}</div>
            <div className="text-sm text-muted-foreground">Total Position Value</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className={`text-2xl font-bold ${calculateTotalProfit() > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {calculateTotalProfit() > 0 ? '+' : ''}${calculateTotalProfit().toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">Total P&L</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{calculateWinRate().toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Win Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="strategies" className="space-y-6">
        <TabsList>
          <TabsTrigger value="strategies">Active Strategies</TabsTrigger>
          <TabsTrigger value="positions">Open Positions</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="strategies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Copy Trading Strategies</CardTitle>
              <CardDescription>
                Manage your automated trading configurations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {copyTrades.map((copyTrade) => {
                  const address = followedAddresses.find(addr => addr.address === copyTrade.targetAddress)
                  return (
                    <div key={copyTrade.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center font-bold text-white">
                            {address?.name?.charAt(0) || 'T'}
                          </div>
                          <div>
                            <div className="font-semibold">
                              {address?.name || `${copyTrade.targetAddress.slice(0, 8)}...`}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {copyTrade.targetAddress.slice(0, 12)}...{copyTrade.targetAddress.slice(-4)}
                            </div>
                          </div>
                          <Badge variant={copyTrade.isActive ? "default" : "secondary"}>
                            {copyTrade.isActive ? 'Active' : 'Paused'}
                          </Badge>
                        </div>
                        <Switch 
                          checked={copyTrade.isActive}
                          onCheckedChange={() => handleToggleCopyTrade(copyTrade.id)}
                        />
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Copy Method</div>
                          <div className="font-medium">
                            {copyTrade.copyMethod === 'PERCENTAGE' ? 'Percentage' : 'Fixed Amount'}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Copy Amount</div>
                          <div className="font-medium">
                            {copyTrade.copyMethod === 'PERCENTAGE' 
                              ? `${copyTrade.copyAmount}%` 
                              : `$${copyTrade.copyAmount}`}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Stop Loss</div>
                          <div className="font-medium text-red-400">
                            -{copyTrade.stopLossPercent}%
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Take Profit</div>
                          <div className="font-medium text-green-400">
                            +{copyTrade.takeProfitPercent}%
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {copyTrade.allowedTokens?.slice(0, 3).map(token => (
                            <Badge key={token} variant="outline" className="text-xs">
                              {token}
                            </Badge>
                          ))}
                          {(copyTrade.allowedTokens?.length || 0) > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{(copyTrade.allowedTokens?.length || 0) - 3}
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {copyTrades.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No copy trading strategies configured yet. Start by following a profitable address.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="positions" className="space-y-6">
          <PositionManager positions={activePositions} />
        </TabsContent>

        <TabsContent value="following" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Followed Addresses</CardTitle>
              <CardDescription>
                Addresses you're currently following for copy trading
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {followedAddresses.map((address) => (
                  <div key={address.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center font-bold text-white">
                        {address.name?.charAt(0) || address.address.slice(2, 4).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold flex items-center gap-2">
                          {address.name}
                          {address.isVerified && <span className="text-blue-400">✓</span>}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {address.followers.toLocaleString()} followers • {address.winRate.toFixed(1)}% win rate
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-green-400 font-medium">
                          +{address.roi.toFixed(1)}%
                        </div>
                        <div className="text-xs text-muted-foreground">ROI</div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAddressFollow(address)}
                        >
                          Configure
                        </Button>
                        <Button variant="outline" size="sm">
                          Unfollow
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trading History</CardTitle>
              <CardDescription>
                Your past copy trading transactions and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Trading history will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Follow Modal */}
      {showFollowModal && (
        <FollowModal
          address={selectedAddress}
          onClose={() => {
            setShowFollowModal(false)
            setSelectedAddress(null)
          }}
          onFollow={(config) => {
            console.log('New follow configuration:', config)
            setShowFollowModal(false)
            setSelectedAddress(null)
          }}
        />
      )}
    </div>
  )
}