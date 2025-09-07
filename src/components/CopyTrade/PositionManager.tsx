'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Position } from '@/types'

interface PositionManagerProps {
  positions: Position[]
}

interface PositionAction {
  type: 'CLOSE' | 'PARTIAL_CLOSE' | 'STOP_LOSS' | 'TAKE_PROFIT'
  percentage?: number
  price?: number
}

export function PositionManager({ positions }: PositionManagerProps) {
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null)
  const [actionType, setActionType] = useState<PositionAction['type'] | null>(null)
  const [actionPercentage, setActionPercentage] = useState(50)
  const [actionPrice, setActionPrice] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const handlePositionAction = async (position: Position, action: PositionAction) => {
    setIsLoading(true)
    try {
      // Mock API call - in real app would execute actual trades
      console.log('Executing position action:', { position: position.id, action })
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In real app, would update position state
      console.log('Position action completed')
      
      setSelectedPosition(null)
      setActionType(null)
    } catch (error) {
      console.error('Failed to execute position action:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
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



  const openActionModal = (position: Position, action: PositionAction['type']) => {
    setSelectedPosition(position)
    setActionType(action)
    setActionPrice(position.currentPrice)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Open Positions</CardTitle>
          <CardDescription>
            Manage your active copy trading positions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {positions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No open positions. Your copy trades will appear here once executed.
            </div>
          ) : (
            <div className="space-y-4">
              {positions.map((position) => (
                <div key={position.id} className="border border-border rounded-lg p-4">
                  {/* Position Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center font-bold text-white">
                        {position.tokenSymbol.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold">{position.tokenSymbol}</div>
                        <div className="text-sm text-muted-foreground">
                          {position.tokenName}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant={position.profit > 0 ? "default" : "destructive"}>
                        {position.profit > 0 ? 'Profitable' : 'Loss'}
                      </Badge>
                      <Badge variant="outline">
                        {position.chain}
                      </Badge>
                    </div>
                  </div>

                  {/* Position Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Amount</div>
                      <div className="font-medium">
                        {position.amount.toLocaleString()} {position.tokenSymbol}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-muted-foreground">Entry Price</div>
                      <div className="font-medium">
                        ${position.entryPrice.toFixed(8)}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-muted-foreground">Current Price</div>
                      <div className="font-medium">
                        ${position.currentPrice.toFixed(8)}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-muted-foreground">Market Value</div>
                      <div className="font-medium">
                        {formatCurrency(position.value)}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-muted-foreground">Unrealized P&L</div>
                      <div className={`font-medium ${position.profit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {position.profit > 0 ? '+' : ''}{formatCurrency(position.profit)}
                      </div>
                      <div className={`text-xs ${position.profitPercent > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {position.profitPercent > 0 ? '+' : ''}{position.profitPercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>

                  {/* Position Details */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div>
                      Copied from {formatAddress(position.targetAddress)}
                    </div>
                    <div>
                      Opened {formatTimeAgo(position.openedAt)}
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openActionModal(position, 'PARTIAL_CLOSE')}
                    >
                      Partial Close
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openActionModal(position, 'STOP_LOSS')}
                    >
                      Set Stop Loss
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openActionModal(position, 'TAKE_PROFIT')}
                    >
                      Set Take Profit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => openActionModal(position, 'CLOSE')}
                    >
                      Close Position
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Modal */}
      {selectedPosition && actionType && (
        <Dialog open={true} onOpenChange={() => {
          setSelectedPosition(null)
          setActionType(null)
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {actionType === 'CLOSE' && 'Close Position'}
                {actionType === 'PARTIAL_CLOSE' && 'Partial Close Position'}
                {actionType === 'STOP_LOSS' && 'Set Stop Loss'}
                {actionType === 'TAKE_PROFIT' && 'Set Take Profit'}
              </DialogTitle>
              <DialogDescription>
                {selectedPosition.tokenSymbol} position from {formatAddress(selectedPosition.targetAddress)}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Position Summary */}
              <div className="p-4 bg-accent/20 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Value:</span>
                  <span className="font-medium">{formatCurrency(selectedPosition.value)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Unrealized P&L:</span>
                  <span className={`font-medium ${selectedPosition.profit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {selectedPosition.profit > 0 ? '+' : ''}{formatCurrency(selectedPosition.profit)}
                  </span>
                </div>
              </div>

              {/* Action-specific inputs */}
              {actionType === 'PARTIAL_CLOSE' && (
                <div className="space-y-2">
                  <Label>Percentage to Close (%)</Label>
                  <Input
                    type="number"
                    value={actionPercentage}
                    onChange={(e) => setActionPercentage(parseInt(e.target.value))}
                    min="1"
                    max="100"
                  />
                  <div className="text-sm text-muted-foreground">
                    Will close {actionPercentage}% of position ({formatCurrency(selectedPosition.value * actionPercentage / 100)})
                  </div>
                </div>
              )}

              {(actionType === 'STOP_LOSS' || actionType === 'TAKE_PROFIT') && (
                <div className="space-y-2">
                  <Label>Trigger Price ($)</Label>
                  <Input
                    type="number"
                    value={actionPrice}
                    onChange={(e) => setActionPrice(parseFloat(e.target.value))}
                    step="0.00000001"
                  />
                  <div className="text-sm text-muted-foreground">
                    Current price: ${selectedPosition.currentPrice.toFixed(8)}
                  </div>
                </div>
              )}

              {actionType === 'CLOSE' && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="text-sm">
                    You are about to close your entire {selectedPosition.tokenSymbol} position.
                    This action cannot be undone.
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedPosition(null)
                    setActionType(null)
                  }}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (selectedPosition) {
                      const action: PositionAction = {
                        type: actionType,
                        ...(actionType === 'PARTIAL_CLOSE' && { percentage: actionPercentage }),
                        ...((['STOP_LOSS', 'TAKE_PROFIT'].includes(actionType)) && { price: actionPrice })
                      }
                      handlePositionAction(selectedPosition, action)
                    }
                  }}
                  className="flex-1"
                  disabled={isLoading}
                  variant={actionType === 'CLOSE' ? 'destructive' : 'default'}
                >
                  {isLoading ? 'Processing...' : 'Confirm'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}