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
  /**
   * 获取指定代币的详细信息
   */
  async getTokenInfo(tokenAddress: string) {
    try {
      const info = await contractService.getTokenInfo(tokenAddress)
      return info
    } catch (error) {
      console.error(`获取代币信息失败 ${tokenAddress}:`, error)
      return null
    }
  }

  /**
   * 检查代币余额
   */
  async getTokenBalance(tokenAddress: string, userAddress: string): Promise<string> {
    try {
      const balance = await contractService.getTokenBalance(tokenAddress, userAddress)
      return balance
    } catch (error) {
      console.error(`获取代币余额失败 ${tokenAddress}:`, error)
      return '0'
    }
  }

  /**
   * 扫描钱包中所有代币余额
   */
  async scanAllTokenBalances(userAddress: string): Promise<TokenBalance[]> {
    console.log('开始扫描代币余额...')

    const results: TokenBalance[] = []

    // 并行检查所有预设代币
    const promises = SEPOLIA_TOKENS.map(async (token) => {
      try {
        const balance = await this.getTokenBalance(token.address, userAddress)
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

        return tokenBalance
      } catch (error) {
        console.error(`扫描代币失败 ${token.symbol}:`, error)
        return {
          address: token.address,
          symbol: token.symbol,
          name: token.name,
          decimals: token.decimals,
          balance: '0',
          balanceFormatted: '0.0000',
          hasBalance: false
        }
      }
    })

    const tokenResults = await Promise.all(promises)
    results.push(...tokenResults)

    console.log('代币扫描完成:', results)
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
