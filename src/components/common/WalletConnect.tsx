'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface WalletConnectProps {
  collapsed?: boolean
}

const wallets = [
  {
    name: 'MetaMask',
    icon: '🦊',
    description: 'Connect with MetaMask wallet',
    installed: true
  },
  {
    name: 'WalletConnect',
    icon: '🔗',
    description: 'Scan QR with mobile wallet',
    installed: true
  },
  {
    name: 'Coinbase Wallet',
    icon: '💙',
    description: 'Connect with Coinbase Wallet',
    installed: false
  }
]

export function WalletConnect({ collapsed = false }: WalletConnectProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState('')
  const [balance, setBalance] = useState('0')
  const [isConnecting, setIsConnecting] = useState(false)
  const [open, setOpen] = useState(false)

  const handleConnect = async (walletName: string) => {
    setIsConnecting(true)
    
    try {
      // Simulate wallet connection
      console.log(`Connecting to ${walletName}...`)
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock wallet connection
      setAddress('0x742d35cc6b25cc8f2f3b1b5d0d2e0e5c9e1d2c3a4b')
      setBalance('2.45')
      setIsConnected(true)
      setOpen(false)
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setAddress('')
    setBalance('0')
  }

  const formatAddress = (addr: string) => {
    if (!addr) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (collapsed) {
    if (isConnected) {
      return (
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
            <span className="text-xs">✓</span>
          </div>
          <div className="text-xs text-center text-muted-foreground">
            Connected
          </div>
        </div>
      )
    }

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="w-full h-8 p-2">
            🔌
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect Wallet</DialogTitle>
          </DialogHeader>
          <WalletList onConnect={handleConnect} isConnecting={isConnecting} />
        </DialogContent>
      </Dialog>
    )
  }

  if (isConnected) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-accent/20 rounded-lg border border-border">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
            <span className="text-sm">✓</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium">Connected</div>
            <div className="text-xs text-muted-foreground truncate">
              {formatAddress(address)}
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">ETH Balance</span>
            <span className="font-medium">{balance}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Network</span>
            <Badge variant="outline" className="h-5 px-2">
              Ethereum
            </Badge>
          </div>
        </div>

        <Separator />

        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDisconnect}
          className="w-full text-xs"
        >
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="w-full">
          <span className="mr-2">🔌</span>
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
        </DialogHeader>
        <WalletList onConnect={handleConnect} isConnecting={isConnecting} />
      </DialogContent>
    </Dialog>
  )
}

function WalletList({ 
  onConnect, 
  isConnecting 
}: { 
  onConnect: (wallet: string) => void
  isConnecting: boolean 
}) {
  return (
    <div className="space-y-3">
      <div className="text-sm text-muted-foreground">
        Choose your preferred wallet to connect to CopyTrade Pro
      </div>
      
      <div className="space-y-2">
        {wallets.map((wallet) => (
          <Button
            key={wallet.name}
            variant="outline"
            className={cn(
              "w-full h-auto p-4 justify-start",
              !wallet.installed && "opacity-50"
            )}
            onClick={() => onConnect(wallet.name)}
            disabled={!wallet.installed || isConnecting}
          >
            <div className="flex items-center gap-3 w-full">
              <span className="text-2xl">{wallet.icon}</span>
              <div className="flex-1 text-left">
                <div className="font-medium">{wallet.name}</div>
                <div className="text-xs text-muted-foreground">
                  {wallet.description}
                </div>
              </div>
              {!wallet.installed && (
                <Badge variant="secondary" className="ml-auto">
                  Install
                </Badge>
              )}
              {isConnecting && (
                <div className="ml-auto">
                  <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
                </div>
              )}
            </div>
          </Button>
        ))}
      </div>
      
      <div className="pt-3 border-t border-border">
        <div className="text-xs text-muted-foreground">
          By connecting, you agree to our Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  )
}