'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AddressTable } from '@/components/Addresses/AddressTable'
import { AddressDetails } from '@/components/Addresses/AddressDetails'
import { BlockchainAddress, AddressFilters } from '@/types'

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<BlockchainAddress[]>([])
  const [selectedAddress, setSelectedAddress] = useState<BlockchainAddress | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<AddressFilters>({
    sortBy: 'roi',
    sortOrder: 'desc',
    page: 1,
    limit: 20
  })

  useEffect(() => {
    loadAddresses()
  }, [filters])

  const loadAddresses = async () => {
    try {
      setIsLoading(true)
      
      // Mock data - in real app, this would fetch from API
      const mockAddresses: BlockchainAddress[] = [
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
        },
        {
          id: '3',
          address: '0x9e8f7a6b5c4d3e2f1g0h9i8j7k6l5m4n3o2p1q0r',
          name: 'MemeGod',
          avatar: 'https://placehold.co/40x40?text=MG',
          isVerified: false,
          followers: 2156,
          totalProfit: 89234,
          roi: 145.6,
          winRate: 65.4,
          totalTrades: 578,
          avgHoldTime: 1.8,
          riskScore: 8.9,
          chain: 'ethereum',
          tags: ['Meme', 'High Risk', 'Scalping'],
          createdAt: '2023-06-22T09:15:00Z',
          lastActive: new Date(Date.now() - 300000).toISOString()
        },
        {
          id: '4',
          address: '0x5f4e3d2c1b0a9e8d7c6b5a4f3e2d1c0b9a8f7e6d',
          name: 'ArbitrageBot',
          avatar: 'https://placehold.co/40x40?text=AB',
          isVerified: true,
          followers: 445,
          totalProfit: 45678,
          roi: 34.2,
          winRate: 91.7,
          totalTrades: 1456,
          avgHoldTime: 0.3,
          riskScore: 2.1,
          chain: 'ethereum',
          tags: ['Arbitrage', 'Bot', 'Consistent'],
          createdAt: '2023-03-10T16:45:00Z',
          lastActive: new Date(Date.now() - 60000).toISOString()
        }
      ]
      
      setAddresses(mockAddresses)
    } catch (error) {
      console.error('Failed to load addresses:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (key: keyof AddressFilters, value: string | number | string[]) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filtering
    }))
  }

  const handleAddressSelect = (address: BlockchainAddress) => {
    setSelectedAddress(address)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Top Addresses</h1>
          <p className="text-muted-foreground">
            Discover and follow the most profitable blockchain addresses
          </p>
        </div>
        <Button variant="default">
          Suggest Address
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">1,247</div>
            <div className="text-sm text-muted-foreground">Total Addresses</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">89.4%</div>
            <div className="text-sm text-muted-foreground">Avg ROI</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">73.2%</div>
            <div className="text-sm text-muted-foreground">Avg Win Rate</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">$2.4M</div>
            <div className="text-sm text-muted-foreground">Total Profits</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Refine your search for profitable addresses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <Input 
                placeholder="Address or name..."
                onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Chain</label>
              <Select onValueChange={(value) => handleFilterChange('chains', [value])}>
                <SelectTrigger>
                  <SelectValue placeholder="All chains" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ethereum">Ethereum</SelectItem>
                  <SelectItem value="bsc">BSC</SelectItem>
                  <SelectItem value="polygon">Polygon</SelectItem>
                  <SelectItem value="arbitrum">Arbitrum</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Min ROI</label>
              <Select onValueChange={(value) => handleFilterChange('minRoi', parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Any ROI" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10%+</SelectItem>
                  <SelectItem value="25">25%+</SelectItem>
                  <SelectItem value="50">50%+</SelectItem>
                  <SelectItem value="100">100%+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Min Win Rate</label>
              <Select onValueChange={(value) => handleFilterChange('minWinRate', parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Any rate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="60">60%+</SelectItem>
                  <SelectItem value="70">70%+</SelectItem>
                  <SelectItem value="80">80%+</SelectItem>
                  <SelectItem value="90">90%+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Risk Score</label>
              <Select onValueChange={(value) => handleFilterChange('maxRiskScore', parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Any risk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">Low (1-3)</SelectItem>
                  <SelectItem value="6">Medium (4-6)</SelectItem>
                  <SelectItem value="8">High (7-8)</SelectItem>
                  <SelectItem value="10">Extreme (9-10)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sort By</label>
              <Select onValueChange={(value) => handleFilterChange('sortBy', value)} defaultValue="roi">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="roi">ROI</SelectItem>
                  <SelectItem value="totalProfit">Total Profit</SelectItem>
                  <SelectItem value="winRate">Win Rate</SelectItem>
                  <SelectItem value="followers">Followers</SelectItem>
                  <SelectItem value="lastActive">Last Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="table" className="space-y-6">
        <TabsList>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="cards">Card View</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-6">
          <AddressTable
            addresses={addresses}
            isLoading={isLoading}
            onAddressSelect={handleAddressSelect}
          />
        </TabsContent>

        <TabsContent value="cards" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addresses.map((address) => (
              <Card key={address.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center font-bold text-white">
                          {address.name?.charAt(0) || address.address.slice(2, 4).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold flex items-center gap-2">
                            {address.name || `${address.address.slice(0, 8)}...`}
                            {address.isVerified && <span className="text-blue-400">✓</span>}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {address.followers.toLocaleString()} followers
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-lg font-bold text-green-400">
                          +{address.roi.toFixed(1)}%
                        </div>
                        <div className="text-xs text-muted-foreground">ROI</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold">
                          {address.winRate.toFixed(1)}%
                        </div>
                        <div className="text-xs text-muted-foreground">Win Rate</div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {address.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {address.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{address.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Address Details Modal */}
      {selectedAddress && (
        <AddressDetails
          address={selectedAddress}
          onClose={() => setSelectedAddress(null)}
        />
      )}
    </div>
  )
}