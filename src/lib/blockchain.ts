// Blockchain interaction utilities
import { Transaction, MarketData } from '@/types'

export interface BlockchainConfig {
  rpcUrl: string
  chainId: number
  name: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  blockExplorer: string
}

export const SUPPORTED_CHAINS: Record<string, BlockchainConfig> = {
  ethereum: {
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2',
    chainId: 1,
    name: 'Ethereum',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    blockExplorer: 'https://etherscan.io'
  },
  bsc: {
    rpcUrl: 'https://bsc-dataseed.binance.org',
    chainId: 56,
    name: 'BSC',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18
    },
    blockExplorer: 'https://bscscan.com'
  },
  polygon: {
    rpcUrl: 'https://polygon-rpc.com',
    chainId: 137,
    name: 'Polygon',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    },
    blockExplorer: 'https://polygonscan.com'
  },
  arbitrum: {
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    chainId: 42161,
    name: 'Arbitrum',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18
    },
    blockExplorer: 'https://arbiscan.io'
  }
}

export class BlockchainService {
  private apiKey: string

  constructor(apiKey: string = '') {
    this.apiKey = apiKey || process.env.BLOCKCHAIN_API_KEY || ''
  }

  /**
   * Fetches transaction history for a given address
   */
  async getAddressTransactions(
    address: string, 
    chain: string = 'ethereum',
    limit: number = 100
  ): Promise<Transaction[]> {
    try {
      // Mock implementation - replace with real API calls
      const mockTransactions: Transaction[] = []
      
      for (let i = 0; i < limit; i++) {
        mockTransactions.push({
          id: `tx-${i}`,
          hash: `0x${Math.random().toString(16).substr(2, 64)}`,
          fromAddress: address,
          tokenAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
          tokenSymbol: ['PEPE', 'SHIB', 'DOGE', 'FLOKI'][Math.floor(Math.random() * 4)],
          tokenName: 'Mock Token',
          amount: Math.floor(Math.random() * 10000000),
          usdValue: Math.floor(Math.random() * 10000),
          type: Math.random() > 0.5 ? 'BUY' : 'SELL',
          profit: Math.floor(Math.random() * 2000) - 500,
          profitPercent: (Math.random() * 50) - 15,
          timestamp: new Date(Date.now() - Math.random() * 7200000).toISOString(),
          blockNumber: 18000000 + Math.floor(Math.random() * 1000000),
          gasUsed: Math.floor(Math.random() * 200000) + 21000,
          gasPrice: Math.floor(Math.random() * 50) + 10,
          chain,
          dexName: ['Uniswap V3', 'SushiSwap', 'Uniswap V2'][Math.floor(Math.random() * 3)]
        })
      }
      
      return mockTransactions
    } catch (error) {
      console.error('Error fetching transactions:', error)
      return []
    }
  }

  /**
   * Analyzes address performance and calculates metrics
   */
  async analyzeAddressPerformance(address: string, chain: string = 'ethereum') {
    try {
      const transactions = await this.getAddressTransactions(address, chain)
      
      let totalProfit = 0
      let totalInvested = 0
      let wins = 0
      let losses = 0
      let totalTrades = transactions.length
      let totalHoldTime = 0

      transactions.forEach(tx => {
        if (tx.profit !== undefined) {
          totalProfit += tx.profit
          if (tx.profit > 0) wins++
          else if (tx.profit < 0) losses++
        }
        
        if (tx.usdValue) {
          totalInvested += tx.usdValue
        }
        
        // Mock hold time calculation
        totalHoldTime += Math.random() * 10
      })

      const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0
      const roi = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0
      const avgHoldTime = totalTrades > 0 ? totalHoldTime / totalTrades : 0
      
      // Risk score based on volatility and drawdowns
      const riskScore = Math.min(10, Math.max(1, 
        (100 - winRate) / 10 + Math.abs(roi) / 50
      ))

      return {
        totalProfit,
        roi,
        winRate,
        totalTrades,
        avgHoldTime,
        riskScore,
        bestTrade: Math.max(...transactions.map(tx => tx.profit || 0)),
        worstTrade: Math.min(...transactions.map(tx => tx.profit || 0))
      }
    } catch (error) {
      console.error('Error analyzing address performance:', error)
      return null
    }
  }

  /**
   * Fetches current token prices
   */
  async getTokenPrices(tokenAddresses: string[]): Promise<Record<string, MarketData>> {
    try {
      // Mock implementation - replace with real price API
      const prices: Record<string, MarketData> = {}
      
      tokenAddresses.forEach(address => {
        prices[address] = {
          tokenAddress: address,
          symbol: 'MOCK',
          name: 'Mock Token',
          price: Math.random() * 100,
          priceChange24h: (Math.random() - 0.5) * 20,
          volume24h: Math.random() * 1000000,
          marketCap: Math.random() * 100000000,
          liquidity: Math.random() * 10000000,
          holders: Math.floor(Math.random() * 100000),
          lastUpdated: new Date().toISOString()
        }
      })
      
      return prices
    } catch (error) {
      console.error('Error fetching token prices:', error)
      return {}
    }
  }

  /**
   * Monitors address for new transactions
   */
  async watchAddress(address: string, chain: string = 'ethereum', callback: (tx: Transaction) => void) {
    // Mock implementation - replace with WebSocket connections
    const interval = setInterval(async () => {
      const recentTx = await this.getAddressTransactions(address, chain, 1)
      if (recentTx.length > 0) {
        callback(recentTx[0])
      }
    }, 10000) // Check every 10 seconds

    return () => clearInterval(interval)
  }

  /**
   * Executes a copy trade transaction
   */
  async executeCopyTrade(
    targetTx: Transaction,
    copyAmount: number,
    slippage: number = 0.5
  ): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
      // Mock implementation - replace with actual DEX integration
      console.log('Executing copy trade:', {
        token: targetTx.tokenSymbol,
        amount: copyAmount,
        type: targetTx.type,
        slippage
      })

      // Simulate transaction execution
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const success = Math.random() > 0.1 // 90% success rate
      
      if (success) {
        return {
          success: true,
          txHash: `0x${Math.random().toString(16).substr(2, 64)}`
        }
      } else {
        return {
          success: false,
          error: 'Transaction failed: Insufficient liquidity'
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Gets DEX router address for token swaps
   */
  getDEXRouter(dexName: string, chain: string): string {
    const routers: Record<string, Record<string, string>> = {
      ethereum: {
        'Uniswap V2': '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
        'Uniswap V3': '0xE592427A0AEce92De3Edee1F18E0157C05861564',
        'SushiSwap': '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F'
      },
      bsc: {
        'PancakeSwap': '0x10ED43C718714eb63d5aA57B78B54704E256024E'
      }
    }
    
    return routers[chain]?.[dexName] || ''
  }

  /**
   * Validates an address format
   */
  isValidAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address)
  }

  /**
   * Formats address for display
   */
  formatAddress(address: string, length: number = 4): string {
    if (!this.isValidAddress(address)) return address
    return `${address.slice(0, 2 + length)}...${address.slice(-length)}`
  }
}

// Singleton instance
export const blockchainService = new BlockchainService()

export default blockchainService