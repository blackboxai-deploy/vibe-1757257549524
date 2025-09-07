import { NextRequest, NextResponse } from 'next/server'
import { Transaction, TransactionFilters, ApiResponse } from '@/types'
import { blockchainService } from '@/lib/blockchain'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse filters from query parameters
    const filters: TransactionFilters = {
      addressId: searchParams.get('addressId') || undefined,
      tokenSymbol: searchParams.get('tokenSymbol') || undefined,
      type: searchParams.get('type') || undefined,
      minAmount: searchParams.get('minAmount') ? parseFloat(searchParams.get('minAmount')!) : undefined,
      maxAmount: searchParams.get('maxAmount') ? parseFloat(searchParams.get('maxAmount')!) : undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
      chain: searchParams.get('chain') || 'ethereum',
      profitOnly: searchParams.get('profitOnly') === 'true',
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50
    }

    let transactions: Transaction[] = []

    if (filters.addressId) {
      // Fetch transactions for specific address
      const addressToQuery = filters.addressId.startsWith('0x') 
        ? filters.addressId 
        : '0x742d35cc6b25cc8f2f3b1b5d0d2e0e5c9e1d2c3a4b' // Default for demo

      transactions = await blockchainService.getAddressTransactions(
        addressToQuery, 
        filters.chain!, 
        filters.limit! * 2 // Fetch more to allow for filtering
      )
    } else {
      // Fetch general transaction feed from multiple top addresses
      const topAddresses = [
        '0x742d35cc6b25cc8f2f3b1b5d0d2e0e5c9e1d2c3a4b',
        '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
        '0x9e8f7a6b5c4d3e2f1g0h9i8j7k6l5m4n3o2p1q0r'
      ]

      const allTransactions = await Promise.all(
        topAddresses.map(addr => 
          blockchainService.getAddressTransactions(addr, filters.chain!, 20)
        )
      )
      
      transactions = allTransactions
        .flat()
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, filters.limit! * 2)
    }

    // Apply filters
    let filteredTransactions = transactions.filter(tx => {
      if (filters.tokenSymbol && tx.tokenSymbol !== filters.tokenSymbol) return false
      if (filters.type && tx.type !== filters.type) return false
      if (filters.minAmount && tx.amount < filters.minAmount) return false
      if (filters.maxAmount && tx.amount > filters.maxAmount) return false
      if (filters.profitOnly && (!tx.profit || tx.profit <= 0)) return false
      
      if (filters.dateFrom) {
        const txDate = new Date(tx.timestamp)
        const fromDate = new Date(filters.dateFrom)
        if (txDate < fromDate) return false
      }
      
      if (filters.dateTo) {
        const txDate = new Date(tx.timestamp)
        const toDate = new Date(filters.dateTo)
        if (txDate > toDate) return false
      }
      
      return true
    })

    // Sort by timestamp (newest first)
    filteredTransactions.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )

    // Paginate results
    const startIndex = (filters.page! - 1) * filters.limit!
    const endIndex = startIndex + filters.limit!
    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex)

    // Calculate aggregated statistics
    const totalProfit = filteredTransactions.reduce((sum, tx) => sum + (tx.profit || 0), 0)
    const totalVolume = filteredTransactions.reduce((sum, tx) => sum + tx.usdValue, 0)
    const profitableTrades = filteredTransactions.filter(tx => (tx.profit || 0) > 0).length
    const winRate = filteredTransactions.length > 0 
      ? (profitableTrades / filteredTransactions.length) * 100 
      : 0

    const response: ApiResponse<Transaction[]> = {
      success: true,
      data: paginatedTransactions,
      message: `Found ${filteredTransactions.length} transactions`,
      pagination: {
        page: filters.page!,
        limit: filters.limit!,
        total: filteredTransactions.length,
        hasNext: endIndex < filteredTransactions.length,
        hasPrev: filters.page! > 1
      },
      metadata: {
        totalProfit,
        totalVolume,
        winRate: parseFloat(winRate.toFixed(2)),
        profitableTrades,
        totalTrades: filteredTransactions.length
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch transactions',
        message: error instanceof Error ? error.message : 'Unknown error'
      } as ApiResponse<null>,
      { status: 500 }
    )
  }
}

// Get detailed transaction analysis
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { txHash } = body

    if (!txHash) {
      return NextResponse.json(
        {
          success: false,
          error: 'Transaction hash is required'
        } as ApiResponse<null>,
        { status: 400 }
      )
    }

    // Mock detailed transaction analysis - in real app would fetch from blockchain
    const mockAnalysis = {
      hash: txHash,
      analysis: {
        profitability: {
          realized: Math.random() * 1000 - 200,
          unrealized: Math.random() * 500 - 100,
          fees: Math.random() * 50 + 10,
          netProfit: 0
        },
        timing: {
          entryPrice: Math.random() * 100,
          currentPrice: Math.random() * 100,
          priceChange: 0,
          holdingTime: Math.floor(Math.random() * 168) + 1 // hours
        },
        risk: {
          slippage: Math.random() * 2,
          liquidityRisk: Math.random() * 10,
          impermanentLoss: Math.random() * 5,
          gasEfficiency: Math.random() * 100
        },
        market: {
          volume24h: Math.random() * 1000000,
          marketCap: Math.random() * 100000000,
          holders: Math.floor(Math.random() * 50000),
          liquidityUSD: Math.random() * 5000000
        },
        dex: {
          name: ['Uniswap V3', 'SushiSwap', 'Uniswap V2'][Math.floor(Math.random() * 3)],
          pair: 'WETH/USDC',
          fee: '0.3%',
          poolAddress: `0x${Math.random().toString(16).substr(2, 40)}`
        }
      },
      aiInsights: {
        strategy: 'Momentum trading based on volume spikes',
        riskAssessment: 'Medium risk - adequate liquidity but high volatility',
        recommendation: 'Consider partial profit taking at current levels',
        confidence: Math.floor(Math.random() * 30) + 70
      }
    }

    // Calculate derived values
    mockAnalysis.analysis.profitability.netProfit = 
      mockAnalysis.analysis.profitability.realized + 
      mockAnalysis.analysis.profitability.unrealized - 
      mockAnalysis.analysis.profitability.fees

    mockAnalysis.analysis.timing.priceChange = 
      ((mockAnalysis.analysis.timing.currentPrice - mockAnalysis.analysis.timing.entryPrice) / 
       mockAnalysis.analysis.timing.entryPrice) * 100

    const response: ApiResponse<typeof mockAnalysis> = {
      success: true,
      data: mockAnalysis,
      message: 'Transaction analysis completed'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error analyzing transaction:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to analyze transaction',
        message: error instanceof Error ? error.message : 'Unknown error'
      } as ApiResponse<null>,
      { status: 500 }
    )
  }
}