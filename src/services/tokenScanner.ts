import { contractService } from './contractService'
import { ERC20_ABI } from '../config/index'

// Sepolia 测试网络常见代币列表
export const SEPOLIA_TOKENS = [
  {
    address: '0x779877A7B0D9E8603169DdbD7836e478b4624789',
    symbol: 'LINK',
    name: 'Chainlink Token',
    decimals: 18
  },
  {
    address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    symbol: 'UNI',
    name: 'Uniswap',
    decimals: 18
  },
  {
    address: '0xC390743ebF5Fa929f4AbD44434924F3481B01eD7',
    symbol: 'CUSTOM',
    name: '自定义代币',
    decimals: 18
  },
  {
    address: '0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844',
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18
  },
  {
    address: '0xdD69DB25F6D620A7baD3023c5d32761D353D3De9',
    symbol: 'GETH',
    name: 'Goerli ETH',
    decimals: 18
  }
]

export interface TokenBalance {
  address: string
  symbol: string
  name: string
  decimals: number
  balance: string
  balanceFormatted: string
  hasBalance: boolean
}

export class TokenScanner {
  // 代币信息缓存
  private tokenInfoCache = new Map<string, any>()
  // 代币余额缓存
  private balanceCache = new Map<string, { balance: string, timestamp: number }>()
  // 缓存有效期（毫秒）
  private CACHE_DURATION = 30000 // 30秒
  // localStorage 键名
  private STORAGE_KEY = 'web3-demo-token-cache'

  constructor() {
    // 初始化时加载持久化缓存
    this.loadCacheFromStorage()
  }

  /**
   * 获取指定代币的详细信息（带缓存）
   */
  async getTokenInfo(tokenAddress: string) {
    // 检查缓存
    if (this.tokenInfoCache.has(tokenAddress)) {
      return this.tokenInfoCache.get(tokenAddress)
    }

    try {
      const info = await contractService.getTokenInfo(tokenAddress)
      // 缓存成功获取的信息
      if (info) {
        this.tokenInfoCache.set(tokenAddress, info)
        this.saveCacheToStorage()
      }
      return info
    } catch (error) {
      console.error(`获取代币信息失败 ${tokenAddress}:`, error)
      return null
    }
  }

  /**
   * 检查代币余额（带缓存）
   */
  async getTokenBalance(tokenAddress: string, userAddress: string): Promise<string> {
    const cacheKey = `${tokenAddress}-${userAddress}`
    const cached = this.balanceCache.get(cacheKey)

    // 检查缓存是否有效
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.balance
    }

    try {
      const balance = await contractService.getTokenBalance(tokenAddress, userAddress)
      // 缓存余额信息
      this.balanceCache.set(cacheKey, {
        balance,
        timestamp: Date.now()
      })
      this.saveCacheToStorage()
      return balance
    } catch (error) {
      console.error(`获取代币余额失败 ${tokenAddress}:`, error)
      return '0'
    }
  }

  /**
   * 从 localStorage 加载缓存
   */
  private loadCacheFromStorage() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)

        // 加载代币信息缓存
        if (data.tokenInfo) {
          this.tokenInfoCache = new Map(data.tokenInfo)
        }

        // 加载余额缓存（只加载未过期的）
        if (data.balance) {
          const now = Date.now()
          for (const [key, cache] of data.balance) {
            if (now - cache.timestamp < this.CACHE_DURATION) {
              this.balanceCache.set(key, cache)
            }
          }
        }
      }
    } catch (error) {
      console.warn('加载缓存失败:', error)
    }
  }

  /**
   * 保存缓存到 localStorage
   */
  private saveCacheToStorage() {
    try {
      const data = {
        tokenInfo: Array.from(this.tokenInfoCache.entries()),
        balance: Array.from(this.balanceCache.entries()),
        timestamp: Date.now()
      }
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.warn('保存缓存失败:', error)
    }
  }

  /**
   * 清理过期缓存
   */
  private cleanCache() {
    const now = Date.now()
    let hasChanges = false

    for (const [key, cache] of this.balanceCache.entries()) {
      if (now - cache.timestamp > this.CACHE_DURATION) {
        this.balanceCache.delete(key)
        hasChanges = true
      }
    }

    // 如果有变化，保存到 localStorage
    if (hasChanges) {
      this.saveCacheToStorage()
    }
  }

  /**
   * 扫描钱包中所有代币余额（优化版本）
   */
  async scanAllTokenBalances(userAddress: string): Promise<TokenBalance[]> {
    console.log('开始快速扫描代币余额...')

    // 清理过期缓存
    this.cleanCache()

    const results: TokenBalance[] = []
    const startTime = Date.now()

    // 使用 Promise.allSettled 确保单个失败不影响整体扫描
    const promises = SEPOLIA_TOKENS.map(async (token, index) => {
      const delay = index * 50 // 错开请求时间，避免网络拥堵
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay))
      }

      try {
        // 直接使用预设的代币信息，跳过验证以提高性能
        const balance = await contractService.getTokenBalance(token.address, userAddress, true)
        const balanceNum = parseFloat(balance)

        const tokenBalance: TokenBalance = {
          address: token.address,
          symbol: token.symbol,
          name: token.name,
          decimals: token.decimals,
          balance: balance,
          balanceFormatted: balanceNum.toFixed(4),
          hasBalance: balanceNum > 0
        }

        console.log(`✅ ${token.symbol}: ${balanceNum > 0 ? balance : '0'}`)
        return { success: true, data: tokenBalance }
      } catch (error) {
        console.error(`❌ 扫描代币失败 ${token.symbol}:`, error)
        return {
          success: false,
          data: {
            address: token.address,
            symbol: token.symbol,
            name: token.name,
            decimals: token.decimals,
            balance: '0',
            balanceFormatted: '0.0000',
            hasBalance: false
          }
        }
      }
    })

    const tokenResults = await Promise.allSettled(promises)

    // 处理结果
    tokenResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        results.push(result.value.data)
      } else {
        // 即使失败也添加默认数据
        const token = SEPOLIA_TOKENS[index]
        results.push({
          address: token.address,
          symbol: token.symbol,
          name: token.name,
          decimals: token.decimals,
          balance: '0',
          balanceFormatted: '0.0000',
          hasBalance: false
        })
      }
    })

    const endTime = Date.now()
    console.log(`🚀 代币扫描完成，耗时: ${endTime - startTime}ms`)
    console.log('扫描结果:', results.filter(r => r.hasBalance))

    return results
  }

  /**
   * 检测自定义代币
   */
  async detectCustomToken(tokenAddress: string, userAddress: string): Promise<TokenBalance | null> {
    try {
      // 获取代币信息
      const info = await this.getTokenInfo(tokenAddress)
      if (!info) return null

      // 获取余额
      const balance = await this.getTokenBalance(tokenAddress, userAddress)
      const balanceNum = parseFloat(balance)

      return {
        address: tokenAddress,
        symbol: info.symbol,
        name: info.name,
        decimals: info.decimals,
        balance: balance,
        balanceFormatted: balanceNum.toFixed(4),
        hasBalance: balanceNum > 0
      }
    } catch (error) {
      console.error('检测自定义代币失败:', error)
      return null
    }
  }

  /**
   * 过滤有余额的代币
   */
  filterTokensWithBalance(tokens: TokenBalance[]): TokenBalance[] {
    return tokens.filter(token => token.hasBalance)
  }

  /**
   * 按余额排序
   */
  sortTokensByBalance(tokens: TokenBalance[]): TokenBalance[] {
    return tokens.sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance))
  }
}

// 创建单例实例
export const tokenScanner = new TokenScanner()
