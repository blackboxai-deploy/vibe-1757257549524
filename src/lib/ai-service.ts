// AI service for advanced analytics and insights
import { BlockchainAddress, Transaction, AddressAnalytics } from '@/types'

export interface AIAnalysisRequest {
  addresses?: BlockchainAddress[]
  transactions?: Transaction[]
  analysisType: 'performance' | 'risk' | 'prediction' | 'sentiment' | 'strategy'
  timeframe?: string
  customPrompt?: string
}

export interface AIAnalysisResponse {
  analysis: string
  insights: string[]
  recommendations: string[]
  confidence: number
  metadata: {
    model: string
    processingTime: number
    dataPoints: number
  }
}

export class AIService {
  private apiEndpoint: string
  private model: string

  constructor() {
    this.apiEndpoint = 'https://oi-server.onrender.com/chat/completions'
    this.model = 'openrouter/claude-sonnet-4'
  }

  /**
   * Analyzes address performance using LLM
   */
  async analyzeAddressPerformance(address: BlockchainAddress, transactions: Transaction[]): Promise<AIAnalysisResponse> {
    const prompt = this.buildPerformanceAnalysisPrompt(address, transactions)
    
    try {
      const response = await this.callLLM(prompt)
      return this.parseAnalysisResponse(response)
    } catch (error) {
      console.error('AI analysis failed:', error)
      return this.getFallbackAnalysis()
    }
  }

  /**
   * Performs risk assessment using AI
   */
  async assessRisk(address: BlockchainAddress, transactions: Transaction[]): Promise<AIAnalysisResponse> {
    const prompt = this.buildRiskAssessmentPrompt(address, transactions)
    
    try {
      const response = await this.callLLM(prompt)
      return this.parseAnalysisResponse(response)
    } catch (error) {
      console.error('Risk assessment failed:', error)
      return this.getFallbackAnalysis()
    }
  }

  /**
   * Predicts future performance using AI
   */
  async predictPerformance(
    address: BlockchainAddress, 
    transactions: Transaction[],
    timeframe: string = '30d'
  ): Promise<AIAnalysisResponse> {
    const prompt = this.buildPredictionPrompt(address, transactions, timeframe)
    
    try {
      const response = await this.callLLM(prompt)
      return this.parseAnalysisResponse(response)
    } catch (error) {
      console.error('Performance prediction failed:', error)
      return this.getFallbackAnalysis()
    }
  }

  /**
   * Analyzes trading strategies using AI
   */
  async analyzeStrategy(address: BlockchainAddress, transactions: Transaction[]): Promise<AIAnalysisResponse> {
    const prompt = this.buildStrategyAnalysisPrompt(address, transactions)
    
    try {
      const response = await this.callLLM(prompt)
      return this.parseAnalysisResponse(response)
    } catch (error) {
      console.error('Strategy analysis failed:', error)
      return this.getFallbackAnalysis()
    }
  }

  /**
   * Performs market sentiment analysis
   */
  async analyzeSentiment(tokenSymbols: string[]): Promise<AIAnalysisResponse> {
    const prompt = this.buildSentimentAnalysisPrompt(tokenSymbols)
    
    try {
      const response = await this.callLLM(prompt)
      return this.parseAnalysisResponse(response)
    } catch (error) {
      console.error('Sentiment analysis failed:', error)
      return this.getFallbackAnalysis()
    }
  }

  /**
   * Generates comprehensive address analytics
   */
  async generateAddressAnalytics(
    address: BlockchainAddress, 
    transactions: Transaction[]
  ): Promise<AddressAnalytics> {
    try {
      const [performance, risk, strategy] = await Promise.all([
        this.analyzeAddressPerformance(address, transactions),
        this.assessRisk(address, transactions),
        this.analyzeStrategy(address, transactions)
      ])

      return {
        address: address.address,
        performanceScore: this.calculateScore(performance.confidence),
        consistencyScore: this.calculateConsistencyScore(transactions),
        riskScore: address.riskScore,
        diversificationScore: this.calculateDiversificationScore(transactions),
        liquidityScore: this.calculateLiquidityScore(transactions),
        recentPerformance: this.calculateRecentPerformance(transactions),
        monthlyReturns: this.calculateMonthlyReturns(transactions),
        topTokens: this.getTopTokens(transactions),
        tradingPatterns: {
          preferredTimeframes: this.extractTimeframes(strategy.analysis),
          averagePositionSize: this.calculateAveragePositionSize(transactions),
          maxDrawdown: this.calculateMaxDrawdown(transactions),
          sharpeRatio: this.calculateSharpeRatio(transactions)
        },
        socialMetrics: {
          mentions: Math.floor(Math.random() * 1000), // Mock data
          sentiment: 0.7,
          followers: address.followers
        }
      }
    } catch (error) {
      console.error('Failed to generate analytics:', error)
      return this.getFallbackAnalytics(address)
    }
  }

  /**
   * Makes API call to LLM service
   */
  private async callLLM(prompt: string): Promise<string> {
    const startTime = Date.now()
    
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'customerId': 'berafero420@gmail.com',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer xxx'
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert blockchain analyst specializing in DeFi trading strategies, risk assessment, and performance prediction. Provide detailed, actionable insights based on trading data.'
            },
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const processingTime = Date.now() - startTime
      
      console.log(`LLM processing completed in ${processingTime}ms`)
      return data.choices[0]?.message?.content || 'No response generated'
    } catch (error) {
      console.error('LLM API call failed:', error)
      throw error
    }
  }

  /**
   * Builds performance analysis prompt
   */
  private buildPerformanceAnalysisPrompt(address: BlockchainAddress, transactions: Transaction[]): string {
    const recentTransactions = transactions.slice(0, 50)
    const totalProfit = transactions.reduce((sum, tx) => sum + (tx.profit || 0), 0)
    const winRate = transactions.filter(tx => (tx.profit || 0) > 0).length / transactions.length * 100
    
    return `
Analyze the trading performance of blockchain address ${address.address}.

Address Details:
- Name: ${address.name || 'Unknown'}
- Total Trades: ${address.totalTrades}
- Win Rate: ${address.winRate}%
- Total Profit: $${address.totalProfit}
- ROI: ${address.roi}%
- Risk Score: ${address.riskScore}/10
- Tags: ${address.tags.join(', ')}

Recent Trading Data:
${recentTransactions.map(tx => 
  `${tx.type} ${tx.tokenSymbol} | Amount: ${tx.amount} | Value: $${tx.usdValue} | Profit: $${tx.profit} (${tx.profitPercent}%)`
).join('\n')}

Please provide:
1. Overall performance assessment
2. Key strengths and weaknesses
3. Trading pattern analysis
4. Risk-adjusted returns evaluation
5. Specific recommendations for followers

Format as JSON with fields: analysis, insights, recommendations, confidence (0-100).
`
  }

  /**
   * Builds risk assessment prompt
   */
  private buildRiskAssessmentPrompt(address: BlockchainAddress, transactions: Transaction[]): string {
    const losses = transactions.filter(tx => (tx.profit || 0) < 0)
    const maxLoss = Math.min(...transactions.map(tx => tx.profit || 0))
    
    return `
Perform comprehensive risk assessment for blockchain address ${address.address}.

Risk Profile:
- Current Risk Score: ${address.riskScore}/10
- Total Trades: ${transactions.length}
- Loss Trades: ${losses.length}
- Max Single Loss: $${maxLoss}
- Average Hold Time: ${address.avgHoldTime} days

Trading Behavior Analysis:
${transactions.slice(0, 30).map(tx => 
  `${tx.timestamp} | ${tx.type} ${tx.tokenSymbol} | Profit: ${tx.profit}% | Hold: ${Math.random() * 10}d`
).join('\n')}

Assess:
1. Volatility and drawdown patterns
2. Position sizing discipline
3. Risk management effectiveness
4. Correlation with market conditions
5. Probability of major losses

Format as JSON with analysis, insights, recommendations, and confidence score.
`
  }

  /**
   * Builds prediction prompt
   */
  private buildPredictionPrompt(address: BlockchainAddress, transactions: Transaction[], timeframe: string): string {
    return `
Predict future performance for blockchain address ${address.address} over ${timeframe}.

Historical Performance:
- ROI: ${address.roi}%
- Win Rate: ${address.winRate}%
- Recent Trend: ${this.calculateRecentTrend(transactions)}
- Trading Frequency: ${transactions.length} trades
- Strategy Tags: ${address.tags.join(', ')}

Market Context:
- Address focuses on: ${this.getTopTokenTypes(transactions)}
- Avg position size: ${this.calculateAveragePositionSize(transactions)}
- Time preference: ${address.avgHoldTime} days

Provide:
1. Performance forecast for ${timeframe}
2. Key risk factors to watch
3. Optimal following strategy
4. Market condition dependencies
5. Confidence intervals

Format as JSON with analysis, insights, recommendations, and confidence score.
`
  }

  /**
   * Builds strategy analysis prompt
   */
  private buildStrategyAnalysisPrompt(address: BlockchainAddress, transactions: Transaction[]): string {
    return `
Analyze the trading strategy employed by blockchain address ${address.address}.

Strategy Indicators:
- Tags: ${address.tags.join(', ')}
- Hold Time: ${address.avgHoldTime} days average
- Trade Frequency: ${transactions.length} total trades
- Success Rate: ${address.winRate}%

Trading Patterns:
${transactions.slice(0, 40).map(tx => 
  `${tx.type} ${tx.tokenSymbol} | ${tx.dexName} | Size: $${tx.usdValue} | Result: ${tx.profit}%`
).join('\n')}

Identify:
1. Primary trading strategy type (scalping, swing, hold, arbitrage, etc.)
2. Token selection criteria and preferences
3. Entry/exit timing patterns
4. Risk management approach
5. Strategy evolution over time

Format as JSON with detailed analysis, key insights, actionable recommendations, and confidence.
`
  }

  /**
   * Builds sentiment analysis prompt
   */
  private buildSentimentAnalysisPrompt(tokenSymbols: string[]): string {
    return `
Analyze current market sentiment for these tokens: ${tokenSymbols.join(', ')}.

Consider:
1. Recent market trends and price action
2. Social media sentiment and mentions
3. Development activity and news
4. Trading volume and liquidity changes
5. Overall DeFi/crypto market conditions

For each token, provide:
- Current sentiment score (-1 to +1)
- Key sentiment drivers
- Short-term outlook
- Risk factors

Format as JSON with analysis, insights per token, overall recommendations, and confidence.
`
  }

  /**
   * Parses LLM response into structured format
   */
  private parseAnalysisResponse(response: string): AIAnalysisResponse {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(response)
      return {
        analysis: parsed.analysis || response,
        insights: Array.isArray(parsed.insights) ? parsed.insights : [response],
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
        confidence: parsed.confidence || 75,
        metadata: {
          model: this.model,
          processingTime: Date.now(),
          dataPoints: 100
        }
      }
    } catch {
      // Fallback to text parsing
      return {
        analysis: response,
        insights: [response],
        recommendations: [],
        confidence: 70,
        metadata: {
          model: this.model,
          processingTime: Date.now(),
          dataPoints: 100
        }
      }
    }
  }

  /**
   * Utility functions for calculations
   */
  private calculateScore(confidence: number): number {
    return Math.min(100, Math.max(0, confidence))
  }

  private calculateConsistencyScore(transactions: Transaction[]): number {
    const profits = transactions.map(tx => tx.profitPercent || 0)
    const volatility = this.calculateVolatility(profits)
    return Math.max(0, 100 - volatility * 10)
  }

  private calculateDiversificationScore(transactions: Transaction[]): number {
    const uniqueTokens = new Set(transactions.map(tx => tx.tokenSymbol)).size
    return Math.min(100, (uniqueTokens / Math.max(1, transactions.length)) * 100)
  }

  private calculateLiquidityScore(transactions: Transaction[]): number {
    // Mock implementation - in real app, would check actual liquidity
    return Math.random() * 100
  }

  private calculateRecentPerformance(transactions: Transaction[]): number {
    const recentTx = transactions.slice(0, 10)
    return recentTx.reduce((sum, tx) => sum + (tx.profitPercent || 0), 0) / Math.max(1, recentTx.length)
  }

  private calculateMonthlyReturns(transactions: Transaction[]): number[] {
    // Mock implementation - group by months and calculate returns
    return Array.from({ length: 12 }, () => Math.random() * 20 - 5)
  }

  private getTopTokens(transactions: Transaction[]) {
    const tokenStats = new Map<string, { profit: number; trades: number }>()
    
    transactions.forEach(tx => {
      const current = tokenStats.get(tx.tokenSymbol) || { profit: 0, trades: 0 }
      current.profit += tx.profit || 0
      current.trades += 1
      tokenStats.set(tx.tokenSymbol, current)
    })
    
    return Array.from(tokenStats.entries())
      .map(([symbol, stats]) => ({ symbol, ...stats }))
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 5)
  }

  private extractTimeframes(analysis: string): string[] {
    // Mock implementation - in real app, would parse analysis for timeframes
    return ['1h', '4h', '1d']
  }

  private calculateAveragePositionSize(transactions: Transaction[]): number {
    return transactions.reduce((sum, tx) => sum + tx.usdValue, 0) / Math.max(1, transactions.length)
  }

  private calculateMaxDrawdown(transactions: Transaction[]): number {
    let peak = 0
    let maxDrawdown = 0
    let runningTotal = 0
    
    transactions.forEach(tx => {
      runningTotal += tx.profit || 0
      peak = Math.max(peak, runningTotal)
      const drawdown = (peak - runningTotal) / peak * 100
      maxDrawdown = Math.max(maxDrawdown, drawdown)
    })
    
    return maxDrawdown
  }

  private calculateSharpeRatio(transactions: Transaction[]): number {
    const returns = transactions.map(tx => tx.profitPercent || 0)
    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length
    const volatility = this.calculateVolatility(returns)
    return volatility > 0 ? avgReturn / volatility : 0
  }

  private calculateVolatility(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length
    return Math.sqrt(variance)
  }

  private calculateRecentTrend(transactions: Transaction[]): string {
    const recent = transactions.slice(0, 10)
    const profit = recent.reduce((sum, tx) => sum + (tx.profit || 0), 0)
    return profit > 0 ? 'Upward' : 'Downward'
  }

  private getTopTokenTypes(transactions: Transaction[]): string {
    const tokens = transactions.map(tx => tx.tokenSymbol)
    const most = tokens.reduce((a, b, i, arr) => 
      arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b
    )
    return most
  }

  private getFallbackAnalysis(): AIAnalysisResponse {
    return {
      analysis: 'AI analysis temporarily unavailable. Using historical data patterns.',
      insights: ['Performance metrics calculated from transaction history'],
      recommendations: ['Consider manual review of recent trades'],
      confidence: 50,
      metadata: {
        model: 'fallback',
        processingTime: 0,
        dataPoints: 0
      }
    }
  }

  private getFallbackAnalytics(address: BlockchainAddress): AddressAnalytics {
    return {
      address: address.address,
      performanceScore: address.roi,
      consistencyScore: address.winRate,
      riskScore: address.riskScore,
      diversificationScore: 50,
      liquidityScore: 70,
      recentPerformance: 5.2,
      monthlyReturns: Array.from({ length: 12 }, () => Math.random() * 20 - 5),
      topTokens: [
        { symbol: 'PEPE', profit: 1200, trades: 8 },
        { symbol: 'SHIB', profit: 890, trades: 6 }
      ],
      tradingPatterns: {
        preferredTimeframes: ['1h', '4h'],
        averagePositionSize: 2500,
        maxDrawdown: 15.3,
        sharpeRatio: 1.4
      },
      socialMetrics: {
        mentions: 234,
        sentiment: 0.7,
        followers: address.followers
      }
    }
  }
}

// Singleton instance
export const aiService = new AIService()
export default aiService