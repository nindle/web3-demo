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
   * 验证合约地址是否有效
   */
  async validateContractAddress(address: string): Promise<boolean> {
    if (!this.provider) await this.refreshProvider()

    try {
      // 检查地址格式
      if (!ethers.isAddress(address)) {
        return false
      }

      // 检查是否为合约地址
      const code = await this.provider.getCode(address)
      return code !== '0x'
    } catch (error) {
      console.error('验证合约地址失败:', error)
      return false
    }
  }

  /**
   * 获取 ERC20 代币余额
   */
  async getTokenBalance(tokenAddress: string, userAddress: string): Promise<string> {
    if (!this.provider) await this.refreshProvider()

    try {
      console.log('获取代币余额:', { tokenAddress, userAddress })

      // 验证地址有效性
      const isValidContract = await this.validateContractAddress(tokenAddress)
      if (!isValidContract) {
        throw new Error(`无效的合约地址: ${tokenAddress}`)
      }

      if (!ethers.isAddress(userAddress)) {
        throw new Error(`无效的用户地址: ${userAddress}`)
      }

      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider)

      // 使用 try-catch 分别处理 decimals 和 balance
      let decimals: number
      try {
        decimals = await contract.decimals()
        console.log('代币精度:', decimals)
      } catch (error: any) {
        console.warn('获取 decimals 失败，使用默认值 18:', error.message)
        decimals = 18 // 使用默认精度
      }

      const balance = await contract.balanceOf(userAddress)
      console.log('原始余额:', balance.toString())

      const formattedBalance = ethers.formatUnits(balance, decimals)
      console.log('格式化余额:', formattedBalance)

      return formattedBalance
    } catch (error: any) {
      console.error('获取代币余额失败:', error)
      throw new Error(`获取代币余额失败: ${error.message || error}`)
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

      // 验证合约地址
      const isValidContract = await this.validateContractAddress(tokenAddress)
      if (!isValidContract) {
        throw new Error(`无效的代币合约地址: ${tokenAddress}`)
      }

      // 验证收款地址
      if (!ethers.isAddress(to)) {
        throw new Error(`无效的收款地址: ${to}`)
      }

      // 确保 amount 是字符串且格式正确
      const amountStr = String(amount).trim()
      if (!amountStr || isNaN(Number(amountStr)) || Number(amountStr) <= 0) {
        throw new Error(`无效的转账金额: ${amount}`)
      }

      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, this.signer)

      // 获取代币精度，添加错误处理
      let decimals: number
      try {
        decimals = await contract.decimals()
        console.log('代币精度:', decimals)
      } catch (error: any) {
        console.warn('获取 decimals 失败，使用默认值 18:', error.message)
        decimals = 18 // 使用默认精度
      }

      // 转换为 BigInt，ethers v6 要求字符串输入
      const amountInWei = ethers.parseUnits(amountStr, Number(decimals))
      console.log('转换后的金额 (Wei):', amountInWei.toString())

      // 检查发送者余额
      const senderAddress = await this.signer.getAddress()
      const balance = await contract.balanceOf(senderAddress)
      const formattedBalance = ethers.formatUnits(balance, decimals)
      console.log('发送者余额:', formattedBalance)

      if (balance < amountInWei) {
        throw new Error(`余额不足。当前余额: ${formattedBalance}, 需要: ${amountStr}`)
      }

      const tx = await contract.transfer(to, amountInWei)

      console.log('代币转账交易已发送，哈希:', tx.hash)

      // 等待交易确认
      const receipt = await tx.wait()
      console.log('代币转账交易已确认:', receipt)

      return tx.hash
    } catch (error: any) {
      console.error('代币转账失败:', error)

      // 提供更友好的错误信息
      let errorMessage = error.message || String(error)
      if (errorMessage.includes('missing revert data') || errorMessage.includes('CALL_EXCEPTION')) {
        errorMessage = '合约调用失败。可能原因：1) 合约地址无效 2) 代币不支持转账 3) 网络连接问题'
      } else if (errorMessage.includes('insufficient funds')) {
        errorMessage = '账户余额不足（包括 Gas 费用）'
      } else if (errorMessage.includes('transfer amount exceeds balance')) {
        errorMessage = '转账金额超过代币余额'
      }

      throw new Error(`代币转账失败: ${errorMessage}`)
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
