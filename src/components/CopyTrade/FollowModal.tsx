'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { BlockchainAddress, CopyTradeConfig } from '@/types'

interface FollowModalProps {
  address: BlockchainAddress | null
  onClose: () => void
  onFollow: (config: Partial<CopyTradeConfig>) => void
}

export function FollowModal({ address, onClose, onFollow }: FollowModalProps) {
  const [config, setConfig] = useState({
    copyMethod: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED_AMOUNT' | 'PROPORTIONAL',
    copyAmount: 5.0,
    maxPositionSize: 1000,
    stopLossPercent: 15,
    takeProfitPercent: 25,
    delaySeconds: 30,
    slippageTolerance: 2.5,
    minLiquidity: 100000,
    allowedTokens: [] as string[],
    excludedTokens: [] as string[],
    useStopLoss: true,
    useTakeProfit: true,
    autoRebalance: false
  })

  const [tokenInput, setTokenInput] = useState('')
  const [excludeTokenInput, setExcludeTokenInput] = useState('')

  const handleConfigChange = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  const addAllowedToken = () => {
    if (tokenInput && !config.allowedTokens.includes(tokenInput.toUpperCase())) {
      setConfig(prev => ({
        ...prev,
        allowedTokens: [...prev.allowedTokens, tokenInput.toUpperCase()]
      }))
      setTokenInput('')
    }
  }

  const removeAllowedToken = (token: string) => {
    setConfig(prev => ({
      ...prev,
      allowedTokens: prev.allowedTokens.filter(t => t !== token)
    }))
  }

  const addExcludedToken = () => {
    if (excludeTokenInput && !config.excludedTokens.includes(excludeTokenInput.toUpperCase())) {
      setConfig(prev => ({
        ...prev,
        excludedTokens: [...prev.excludedTokens, excludeTokenInput.toUpperCase()]
      }))
      setExcludeTokenInput('')
    }
  }

  const removeExcludedToken = (token: string) => {
    setConfig(prev => ({
      ...prev,
      excludedTokens: prev.excludedTokens.filter(t => t !== token)
    }))
  }

  const handleSubmit = () => {
    const copyTradeConfig: Partial<CopyTradeConfig> = {
      targetAddress: address?.address || '',
      copyMethod: config.copyMethod,
      copyAmount: config.copyAmount,
      maxPositionSize: config.maxPositionSize,
      stopLossPercent: config.useStopLoss ? config.stopLossPercent : undefined,
      takeProfitPercent: config.useTakeProfit ? config.takeProfitPercent : undefined,
      delaySeconds: config.delaySeconds,
      slippageTolerance: config.slippageTolerance,
      minLiquidity: config.minLiquidity,
      allowedTokens: config.allowedTokens.length > 0 ? config.allowedTokens : undefined,
      excludedTokens: config.excludedTokens.length > 0 ? config.excludedTokens : undefined
    }
    
    onFollow(copyTradeConfig)
  }

  const calculateRiskLevel = () => {
    let riskScore = 0
    
    // Higher copy amount = higher risk
    if (config.copyAmount > 10) riskScore += 2
    else if (config.copyAmount > 5) riskScore += 1
    
    // No stop loss = higher risk
    if (!config.useStopLoss) riskScore += 3
    else if (config.stopLossPercent > 20) riskScore += 1
    
    // High slippage tolerance = higher risk
    if (config.slippageTolerance > 3) riskScore += 2
    else if (config.slippageTolerance > 1) riskScore += 1
    
    // Low min liquidity = higher risk
    if (config.minLiquidity < 50000) riskScore += 2
    
    if (riskScore >= 5) return 'High'
    if (riskScore >= 3) return 'Medium'
    return 'Low'
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-red-400'
      case 'Medium': return 'text-yellow-400'
      case 'Low': return 'text-green-400'
      default: return 'text-muted-foreground'
    }
  }

  if (!address) return null

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configure Copy Trading</DialogTitle>
          <DialogDescription>
            Set up automated copy trading for {address.name || address.address}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Address Info */}
          <div className="flex items-center gap-4 p-4 bg-accent/20 rounded-lg">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center font-bold text-white">
              {address.name?.charAt(0) || address.address.slice(2, 4).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="font-semibold flex items-center gap-2">
                {address.name}
                {address.isVerified && <span className="text-blue-400">✓</span>}
              </div>
              <div className="text-sm text-muted-foreground">
                {address.winRate.toFixed(1)}% win rate • {address.roi.toFixed(1)}% ROI
              </div>
            </div>
            <Badge variant="outline" className={getRiskColor(calculateRiskLevel())}>
              {calculateRiskLevel()} Risk
            </Badge>
          </div>

          {/* Copy Method */}
          <div className="space-y-2">
            <Label>Copy Method</Label>
            <Select 
              value={config.copyMethod} 
              onValueChange={(value: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'PROPORTIONAL') => 
                handleConfigChange('copyMethod', value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PERCENTAGE">Percentage of Portfolio</SelectItem>
                <SelectItem value="FIXED_AMOUNT">Fixed USD Amount</SelectItem>
                <SelectItem value="PROPORTIONAL">Proportional to Target</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Copy Amount */}
          <div className="space-y-2">
            <Label>
              Copy Amount 
              {config.copyMethod === 'PERCENTAGE' && ' (% of portfolio)'}
              {config.copyMethod === 'FIXED_AMOUNT' && ' (USD)'}
              {config.copyMethod === 'PROPORTIONAL' && ' (multiplier)'}
            </Label>
            <Input
              type="number"
              value={config.copyAmount}
              onChange={(e) => handleConfigChange('copyAmount', parseFloat(e.target.value))}
              step="0.1"
              min="0.1"
            />
          </div>

          {/* Position Limits */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Max Position Size (USD)</Label>
              <Input
                type="number"
                value={config.maxPositionSize}
                onChange={(e) => handleConfigChange('maxPositionSize', parseFloat(e.target.value))}
                min="100"
              />
            </div>

            <div className="space-y-2">
              <Label>Execution Delay (seconds)</Label>
              <Input
                type="number"
                value={config.delaySeconds}
                onChange={(e) => handleConfigChange('delaySeconds', parseInt(e.target.value))}
                min="0"
                max="300"
              />
              <div className="text-xs text-muted-foreground">
                Delay helps avoid frontrunning but may miss fast moves
              </div>
            </div>
          </div>

          <Separator />

          {/* Risk Management */}
          <div className="space-y-4">
            <h3 className="font-semibold">Risk Management</h3>
            
            {/* Stop Loss */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Enable Stop Loss</Label>
                <div className="text-sm text-muted-foreground">
                  Automatically close losing positions
                </div>
              </div>
              <Switch
                checked={config.useStopLoss}
                onCheckedChange={(checked) => handleConfigChange('useStopLoss', checked)}
              />
            </div>

            {config.useStopLoss && (
              <div className="space-y-2">
                <Label>Stop Loss Percentage</Label>
                <Input
                  type="number"
                  value={config.stopLossPercent}
                  onChange={(e) => handleConfigChange('stopLossPercent', parseFloat(e.target.value))}
                  min="1"
                  max="50"
                />
              </div>
            )}

            {/* Take Profit */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Enable Take Profit</Label>
                <div className="text-sm text-muted-foreground">
                  Automatically close winning positions
                </div>
              </div>
              <Switch
                checked={config.useTakeProfit}
                onCheckedChange={(checked) => handleConfigChange('useTakeProfit', checked)}
              />
            </div>

            {config.useTakeProfit && (
              <div className="space-y-2">
                <Label>Take Profit Percentage</Label>
                <Input
                  type="number"
                  value={config.takeProfitPercent}
                  onChange={(e) => handleConfigChange('takeProfitPercent', parseFloat(e.target.value))}
                  min="1"
                  max="200"
                />
              </div>
            )}
          </div>

          <Separator />

          {/* Trading Parameters */}
          <div className="space-y-4">
            <h3 className="font-semibold">Trading Parameters</h3>
            
            <div className="space-y-2">
              <Label>Slippage Tolerance (%)</Label>
              <Input
                type="number"
                value={config.slippageTolerance}
                onChange={(e) => handleConfigChange('slippageTolerance', parseFloat(e.target.value))}
                min="0.1"
                max="10"
                step="0.1"
              />
            </div>

            <div className="space-y-2">
              <Label>Minimum Liquidity (USD)</Label>
              <Input
                type="number"
                value={config.minLiquidity}
                onChange={(e) => handleConfigChange('minLiquidity', parseFloat(e.target.value))}
                min="1000"
              />
            </div>
          </div>

          <Separator />

          {/* Token Filters */}
          <div className="space-y-4">
            <h3 className="font-semibold">Token Filters</h3>
            
            {/* Allowed Tokens */}
            <div className="space-y-2">
              <Label>Allowed Tokens (optional)</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., PEPE, SHIB"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addAllowedToken()}
                />
                <Button variant="outline" onClick={addAllowedToken}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {config.allowedTokens.map((token) => (
                  <Badge key={token} variant="secondary" className="cursor-pointer">
                    {token}
                    <button
                      onClick={() => removeAllowedToken(token)}
                      className="ml-1 hover:text-red-400"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="text-xs text-muted-foreground">
                Leave empty to copy all tokens
              </div>
            </div>

            {/* Excluded Tokens */}
            <div className="space-y-2">
              <Label>Excluded Tokens (optional)</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., SCAM, RUG"
                  value={excludeTokenInput}
                  onChange={(e) => setExcludeTokenInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addExcludedToken()}
                />
                <Button variant="outline" onClick={addExcludedToken}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {config.excludedTokens.map((token) => (
                  <Badge key={token} variant="destructive" className="cursor-pointer">
                    {token}
                    <button
                      onClick={() => removeExcludedToken(token)}
                      className="ml-1 hover:text-white"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              Start Copy Trading
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}