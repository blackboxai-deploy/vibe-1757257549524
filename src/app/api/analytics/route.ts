import { NextRequest, NextResponse } from 'next/server'
import { ApiResponse } from '@/types'
import { blockchainService } from '@/lib/blockchain'
import { aiService } from '@/lib/ai-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const addressId = searchParams.get('addressId')
    const analysisType = searchParams.get('type') || 'performance'
    const timeframe = searchParams.get('timeframe') || '30d'

    if (!addressId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Address ID is required'
        } as ApiResponse<null>,
        { status: 400 }
      )
    }

    // Convert addressId to actual address (in real app, would query database)
    const addressMap: Record<string, string> = {
      '1': '0x742d35cc6b25cc8f2f3b1b5d0d2e0e5c9e1d2c3a4b',
      '2': '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
      '3': '0x9e8f7a6b5c4d3e2f1g0h9i8j7k6l5m4n3o2p1q0r'
    }

    const address = addressMap[addressId] || addressId
    if (!blockchainService.isValidAddress(address)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid address format'
        } as ApiResponse<null>,
        { status: 400 }
      )
    }

    // Fetch transaction data
    const transactions = await blockchainService.getAddressTransactions(address, 'ethereum', 100)
    
    // Mock address data for AI analysis
    const mockAddress = {
      id: addressId,
      address,
      name: `Trader_${address.slice(2, 8)}`,
      isVerified: true,
      followers: Math.floor(Math.random() * 2000) + 500,
      totalProfit: transactions.reduce((sum, tx) => sum + (tx.profit || 0), 0),
      roi: Math.random() * 150 + 20,
      winRate: Math.random() * 40 + 60,
      totalTrades: transactions.length,
      avgHoldTime: Math.random() * 10 + 1,
      riskScore: Math.random() * 8 + 2,
      chain: 'ethereum',
      tags: ['DeFi', 'Alpha', 'High Yield'],
      createdAt: new Date(Date.now() - Math.random() * 31536000000).toISOString(), // Random date in last year
      lastActive: new Date(Date.now() - Math.random() * 3600000).toISOString() // Random time in last hour
    }

    let analysisResult

    // Perform AI analysis based on type
    switch (analysisType) {
      case 'performance':
        analysisResult = await aiService.analyzeAddressPerformance(mockAddress, transactions)
        break
      case 'risk':
        analysisResult = await aiService.assessRisk(mockAddress, transactions)
        break
      case 'prediction':
        analysisResult = await aiService.predictPerformance(mockAddress, transactions, timeframe)
        break
      case 'strategy':
        analysisResult = await aiService.analyzeStrategy(mockAddress, transactions)
        break
      case 'comprehensive':
        const analytics = await aiService.generateAddressAnalytics(mockAddress, transactions)
        analysisResult = {
          analysis: `Comprehensive analysis for ${mockAddress.name || mockAddress.address}`,
          insights: [
            `Performance Score: ${analytics.performanceScore.toFixed(1)}/100`,
            `Consistency Score: ${analytics.consistencyScore.toFixed(1)}/100`,
            `Risk Score: ${analytics.riskScore.toFixed(1)}/10`,
            `Diversification: ${analytics.diversificationScore.toFixed(1)}/100`,
            `Recent Performance: ${analytics.recentPerformance.toFixed(2)}%`
          ],
          recommendations: [
            'Consider following this address for consistent returns',
            'Monitor risk levels closely due to volatility',
            'Diversify across multiple top performers'
          ],
          confidence: 85,
          metadata: {
            model: 'comprehensive-analysis',
            processingTime: Date.now(),
            dataPoints: transactions.length
          },
          analytics
        }
        break
      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid analysis type. Supported types: performance, risk, prediction, strategy, comprehensive'
          } as ApiResponse<null>,
          { status: 400 }
        )
    }

    // Add additional context based on timeframe
    const contextualInsights = generateTimeframeInsights(transactions, timeframe)
    analysisResult.insights = [...analysisResult.insights, ...contextualInsights]

    const response: ApiResponse<typeof analysisResult> = {
      success: true,
      data: analysisResult,
      message: `${analysisType} analysis completed for ${timeframe} timeframe`
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error performing analytics:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to perform analytics',
        message: error instanceof Error ? error.message : 'Unknown error'
      } as ApiResponse<null>,
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      addresses, 
      analysisType = 'performance', 
      customPrompt,
      includeMarketContext = true 
    } = body

    if (!addresses || !Array.isArray(addresses) || addresses.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'At least one address is required'
        } as ApiResponse<null>,
        { status: 400 }
      )
    }

    // Validate all addresses
    const invalidAddresses = addresses.filter(addr => !blockchainService.isValidAddress(addr))
    if (invalidAddresses.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid addresses: ${invalidAddresses.join(', ')}`
        } as ApiResponse<null>,
        { status: 400 }
      )
    }

    // Fetch data for all addresses
    const addressData = await Promise.all(
      addresses.map(async (address: string) => {
        const transactions = await blockchainService.getAddressTransactions(address, 'ethereum', 50)
        return { address, transactions }
      })
    )

    // Perform comparative analysis
    const comparativeAnalysis = {
      totalAddresses: addresses.length,
      analysisType,
      summary: {
        totalTransactions: addressData.reduce((sum, data) => sum + data.transactions.length, 0),
        totalProfit: addressData.reduce((sum, data) => 
          sum + data.transactions.reduce((txSum, tx) => txSum + (tx.profit || 0), 0), 0
        ),
        avgWinRate: 0,
        bestPerformer: '',
        worstPerformer: ''
      },
      insights: [] as string[],
      recommendations: [] as string[],
      individualAnalysis: [] as any[]
    }

    // Analyze each address individually
    for (const data of addressData) {
      const mockAddress = {
        id: data.address,
        address: data.address,
        name: `Trader_${data.address.slice(2, 8)}`,
        isVerified: false,
        followers: 0,
        totalProfit: data.transactions.reduce((sum, tx) => sum + (tx.profit || 0), 0),
        roi: Math.random() * 100,
        winRate: Math.random() * 40 + 60,
        totalTrades: data.transactions.length,
        avgHoldTime: Math.random() * 10 + 1,
        riskScore: Math.random() * 8 + 2,
        chain: 'ethereum',
        tags: ['DeFi'],
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
      }

      let analysis
      switch (analysisType) {
        case 'performance':
          analysis = await aiService.analyzeAddressPerformance(mockAddress, data.transactions)
          break
        case 'risk':
          analysis = await aiService.assessRisk(mockAddress, data.transactions)
          break
        case 'strategy':
          analysis = await aiService.analyzeStrategy(mockAddress, data.transactions)
          break
        default:
          analysis = await aiService.analyzeAddressPerformance(mockAddress, data.transactions)
      }

      comparativeAnalysis.individualAnalysis.push({
        address: data.address,
        ...analysis
      })
    }

    // Generate comparative insights
    comparativeAnalysis.insights = [
      `Analyzed ${addresses.length} addresses with ${comparativeAnalysis.summary.totalTransactions} total transactions`,
      `Combined profit/loss: $${comparativeAnalysis.summary.totalProfit.toFixed(2)}`,
      'Performance varies significantly across addresses',
      'Risk profiles show different trading strategies'
    ]

    if (customPrompt) {
      // Use custom prompt for specialized analysis
      comparativeAnalysis.insights.push(`Custom analysis: ${customPrompt}`)
    }

    if (includeMarketContext) {
      // Add market context
      comparativeAnalysis.insights.push(
        'Current market conditions favor momentum strategies',
        'High volatility environment requires careful risk management'
      )
    }

    comparativeAnalysis.recommendations = [
      'Diversify following across top 3-5 performers',
      'Monitor risk scores regularly',
      'Consider partial position sizing for high-risk addresses',
      'Review performance weekly for strategy adjustments'
    ]

    const response: ApiResponse<typeof comparativeAnalysis> = {
      success: true,
      data: comparativeAnalysis,
      message: 'Comparative analysis completed'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error performing comparative analytics:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to perform comparative analytics',
        message: error instanceof Error ? error.message : 'Unknown error'
      } as ApiResponse<null>,
      { status: 500 }
    )
  }
}

function generateTimeframeInsights(transactions: any[], timeframe: string): string[] {
  const insights = []
  const now = new Date()
  let startDate = new Date()

  // Calculate start date based on timeframe
  switch (timeframe) {
    case '7d':
      startDate.setDate(now.getDate() - 7)
      break
    case '30d':
      startDate.setDate(now.getDate() - 30)
      break
    case '90d':
      startDate.setDate(now.getDate() - 90)
      break
    case '1y':
      startDate.setFullYear(now.getFullYear() - 1)
      break
    default:
      startDate.setDate(now.getDate() - 30)
  }

  // Filter transactions within timeframe
  const recentTransactions = transactions.filter(tx => 
    new Date(tx.timestamp) >= startDate
  )

  if (recentTransactions.length > 0) {
    const recentProfit = recentTransactions.reduce((sum, tx) => sum + (tx.profit || 0), 0)
    const recentWins = recentTransactions.filter(tx => (tx.profit || 0) > 0).length
    const recentWinRate = (recentWins / recentTransactions.length) * 100

    insights.push(
      `${timeframe} Performance: $${recentProfit.toFixed(2)} profit from ${recentTransactions.length} trades`,
      `${timeframe} Win Rate: ${recentWinRate.toFixed(1)}%`
    )

    if (recentTransactions.length >= 10) {
      insights.push(`Active trading pattern with ${recentTransactions.length} transactions in ${timeframe}`)
    } else if (recentTransactions.length >= 5) {
      insights.push(`Moderate activity with ${recentTransactions.length} transactions in ${timeframe}`)
    } else {
      insights.push(`Low activity with only ${recentTransactions.length} transactions in ${timeframe}`)
    }
  } else {
    insights.push(`No trading activity detected in the last ${timeframe}`)
  }

  return insights
}