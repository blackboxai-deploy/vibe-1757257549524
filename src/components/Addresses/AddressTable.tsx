'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BlockchainAddress } from '@/types'

interface AddressTableProps {
  addresses: BlockchainAddress[]
  isLoading: boolean
  onAddressSelect: (address: BlockchainAddress) => void
}

export function AddressTable({ addresses, isLoading, onAddressSelect }: AddressTableProps) {
  const [following, setFollowing] = useState<Set<string>>(new Set())

  const handleFollow = (addressId: string) => {
    setFollowing(prev => {
      const newSet = new Set(prev)
      if (newSet.has(addressId)) {
        newSet.delete(addressId)
      } else {
        newSet.add(addressId)
      }
      return newSet
    })
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  const getRiskBadgeVariant = (score: number) => {
    if (score <= 3) return 'default'
    if (score <= 6) return 'secondary'
    if (score <= 8) return 'outline'
    return 'destructive'
  }

  const getRiskLabel = (score: number) => {
    if (score <= 3) return 'Low'
    if (score <= 6) return 'Medium'
    if (score <= 8) return 'High'
    return 'Extreme'
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Address</TableHead>
              <TableHead>Chain</TableHead>
              <TableHead className="text-right">Total Profit</TableHead>
              <TableHead className="text-right">ROI</TableHead>
              <TableHead className="text-right">Win Rate</TableHead>
              <TableHead className="text-right">Trades</TableHead>
              <TableHead className="text-center">Risk</TableHead>
              <TableHead className="text-right">Followers</TableHead>
              <TableHead className="text-right">Last Active</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {addresses.map((address) => (
              <TableRow 
                key={address.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onAddressSelect(address)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={address.avatar} alt={address.name} />
                      <AvatarFallback>
                        {address.name?.charAt(0) || address.address.slice(2, 4).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {address.name || formatAddress(address.address)}
                        </span>
                        {address.isVerified && (
                          <Badge variant="secondary" className="h-4 px-1.5 text-xs">
                            ✓
                          </Badge>
                        )}
                      </div>
                      {address.name && (
                        <div className="text-xs text-muted-foreground">
                          {formatAddress(address.address)}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {address.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="h-4 px-1.5 text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {address.chain}
                  </Badge>
                </TableCell>
                
                <TableCell className="text-right">
                  <div className="font-medium text-green-400">
                    {formatCurrency(address.totalProfit)}
                  </div>
                </TableCell>
                
                <TableCell className="text-right">
                  <div className="font-medium text-green-400">
                    +{address.roi.toFixed(1)}%
                  </div>
                </TableCell>
                
                <TableCell className="text-right">
                  <div className="font-medium">
                    {address.winRate.toFixed(1)}%
                  </div>
                </TableCell>
                
                <TableCell className="text-right">
                  <div className="font-medium">
                    {address.totalTrades.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {address.avgHoldTime.toFixed(1)}d avg
                  </div>
                </TableCell>
                
                <TableCell className="text-center">
                  <Badge variant={getRiskBadgeVariant(address.riskScore)} className="h-6 px-2">
                    {getRiskLabel(address.riskScore)}
                  </Badge>
                  <div className="text-xs text-muted-foreground mt-1">
                    {address.riskScore.toFixed(1)}/10
                  </div>
                </TableCell>
                
                <TableCell className="text-right">
                  <div className="font-medium">
                    {address.followers.toLocaleString()}
                  </div>
                </TableCell>
                
                <TableCell className="text-right">
                  <div className="text-sm">
                    {formatTimeAgo(address.lastActive)}
                  </div>
                </TableCell>
                
                <TableCell className="text-center">
                  <Button
                    variant={following.has(address.id) ? "default" : "outline"}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleFollow(address.id)
                    }}
                    className="h-8 px-3"
                  >
                    {following.has(address.id) ? 'Following' : 'Follow'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {addresses.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No addresses found. Try adjusting your filters.
          </div>
        )}
      </CardContent>
    </Card>
  )
}