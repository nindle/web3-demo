import { ethers } from 'ethers'
import { ERC20_ABI, TEST_TOKEN_ADDRESS } from '../config/index'

export class ContractService {
  private provider: any
  private signer: any

  constructor() {
    // 在需要时动态初始化
  }

  private async initializeProvider() {
    try {
      console.log('开始初始化 Provider...')

      if (typeof window !== 'undefined') {
        // 检查是否有钱包 provider
        const ethereum = (window as any).ethereum

        if (!ethereum) {
          throw new Error('未检测到钱包，请安装 MetaMask 或其他 Web3 钱包')
        }

        console.log('找到钱包 Provider:', ethereum)

        this.provider = new ethers.BrowserProvider(ethereum)

        // 获取账户列表
        const accounts = await ethereum.request({ method: 'eth_accounts' })
        console.log('当前账户:', accounts)

        if (accounts.length === 0) {
          console.log('请求连接钱包...')
          await ethereum.request({ method: 'eth_requestAccounts' })
        }

        this.signer = await this.provider.getSigner()
        const address = await this.signer.getAddress()
        console.log('Signer 地址:', address)

        console.log('Provider 初始化成功')
      } else {
        throw new Error('不支持的环境：需要浏览器环境')
      }
    } catch (error: any) {
      console.error('初始化 Provider 失败:', error)
      throw new Error(`初始化失败: ${error.message || error}`)
    }
  }

  /**
   * 刷新 Provider 和 Signer
   */
  async refreshProvider() {
    await this.initializeProvider()
  }

  /**
   * 获取 ETH 余额
   */
  async getEthBalance(address: string): Promise<string> {
    if (!this.provider) await this.refreshProvider()

    try {
      const balance = await this.provider.getBalance(address)
      return ethers.formatEther(balance)
    } catch (error) {
      console.error('获取 ETH 余额失败:', error)
      throw error
    }
  }

    /**
   * 发送 ETH 转账
   */
  async sendEthTransfer(to: string, amount: string): Promise<string> {
    if (!this.signer) await this.refreshProvider()

    try {
      console.log('开始 ETH 转账:', { to, amount })

      // 确保 amount 是字符串且格式正确
      const amountStr = String(amount).trim()
      if (!amountStr || isNaN(Number(amountStr))) {
        throw new Error(`无效的转账金额: ${amount}`)
      }

      // 转换为 Wei，ethers v6 要求字符串输入
      const amountInWei = ethers.parseEther(amountStr)
      console.log('转换后的金额 (Wei):', amountInWei.toString())

      const tx = await this.signer.sendTransaction({
        to: to,
        value: amountInWei
      })

      console.log('ETH 转账交易已发送，哈希:', tx.hash)

      // 等待交易确认
      const receipt = await tx.wait()
      console.log('ETH 转账交易已确认:', receipt)

      return tx.hash
    } catch (error: any) {
      console.error('ETH 转账失败:', error)
      throw new Error(`ETH 转账失败: ${error.message || error}`)
    }
  }

  /**
   * 获取 ERC20 代币余额
   */
  async getTokenBalance(tokenAddress: string, userAddress: string): Promise<string> {
    if (!this.provider) await this.refreshProvider()

    try {
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider)
      const balance = await contract.balanceOf(userAddress)
      const decimals = await contract.decimals()

      return ethers.formatUnits(balance, decimals)
    } catch (error) {
      console.error('获取代币余额失败:', error)
      throw error
    }
  }

  /**
   * 获取 ERC20 代币信息
   */
  async getTokenInfo(tokenAddress: string) {
    if (!this.provider) await this.refreshProvider()

    try {
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider)

      const [name, symbol, decimals, totalSupply] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.decimals(),
        contract.totalSupply()
      ])

      return {
        name,
        symbol,
        decimals: Number(decimals),
        totalSupply: ethers.formatUnits(totalSupply, decimals)
      }
    } catch (error) {
      console.error('获取代币信息失败:', error)
      throw error
    }
  }

    /**
   * 发送 ERC20 代币转账
   */
  async sendTokenTransfer(tokenAddress: string, to: string, amount: string): Promise<string> {
    if (!this.signer) await this.refreshProvider()

    try {
      console.log('开始代币转账:', { tokenAddress, to, amount })

      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, this.signer)
      const decimals = await contract.decimals()

      console.log('代币精度:', decimals)

      // 确保 amount 是字符串且格式正确
      const amountStr = String(amount).trim()
      if (!amountStr || isNaN(Number(amountStr))) {
        throw new Error(`无效的转账金额: ${amount}`)
      }

      // 转换为 BigInt，ethers v6 要求字符串输入
      const amountInWei = ethers.parseUnits(amountStr, Number(decimals))
      console.log('转换后的金额 (Wei):', amountInWei.toString())

      const tx = await contract.transfer(to, amountInWei)

      console.log('代币转账交易已发送，哈希:', tx.hash)

      // 等待交易确认
      const receipt = await tx.wait()
      console.log('代币转账交易已确认:', receipt)

      return tx.hash
    } catch (error: any) {
      console.error('代币转账失败:', error)
      throw new Error(`代币转账失败: ${error.message || error}`)
    }
  }

  /**
   * 调用合约的只读方法
   */
  async callContractMethod(
    contractAddress: string,
    abi: any[],
    methodName: string,
    params: any[] = []
  ): Promise<any> {
    if (!this.provider) await this.refreshProvider()

    try {
      const contract = new ethers.Contract(contractAddress, abi, this.provider)
      const result = await contract[methodName](...params)
      return result
    } catch (error) {
      console.error(`调用合约方法 ${methodName} 失败:`, error)
      throw error
    }
  }

  /**
   * 调用合约的写入方法
   */
  async executeContractMethod(
    contractAddress: string,
    abi: any[],
    methodName: string,
    params: any[] = [],
    value?: string
  ): Promise<string> {
    if (!this.signer) await this.refreshProvider()

    try {
      const contract = new ethers.Contract(contractAddress, abi, this.signer)

      const txOptions: any = {}
      if (value) {
        txOptions.value = ethers.parseEther(value)
      }

      const tx = await contract[methodName](...params, txOptions)

      console.log(`合约方法 ${methodName} 交易已发送，哈希:`, tx.hash)

      // 等待交易确认
      const receipt = await tx.wait()
      console.log(`合约方法 ${methodName} 交易已确认:`, receipt)

      return tx.hash
    } catch (error) {
      console.error(`执行合约方法 ${methodName} 失败:`, error)
      throw error
    }
  }

  /**
   * 获取交易详情
   */
  async getTransactionDetails(txHash: string) {
    if (!this.provider) await this.refreshProvider()

    try {
      const tx = await this.provider.getTransaction(txHash)
      const receipt = await this.provider.getTransactionReceipt(txHash)

      return {
        transaction: tx,
        receipt: receipt
      }
    } catch (error) {
      console.error('获取交易详情失败:', error)
      throw error
    }
  }
}

// 创建单例实例
export const contractService = new ContractService()
