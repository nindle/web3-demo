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
        // 检查设备类型
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        console.log('设备类型:', isMobile ? '移动端' : '桌面端')

        // 检查是否有钱包 provider
        const ethereum = (window as any).ethereum

        if (!ethereum) {
          const errorMessage = isMobile
            ? '未检测到钱包连接。移动端请确保：\n1. 已安装钱包应用（如 MetaMask、Trust Wallet）\n2. 通过钱包内置浏览器访问本站点\n3. 或点击"连接钱包"按钮使用 WalletConnect'
            : '未检测到钱包扩展，请安装 MetaMask 或其他 Web3 钱包扩展'
          throw new Error(errorMessage)
        }

        console.log('找到钱包 Provider:', ethereum)

        this.provider = new ethers.BrowserProvider(ethereum)

        // 获取账户列表
        const accounts = await ethereum.request({ method: 'eth_accounts' })
        console.log('当前账户:', accounts)

        if (accounts.length === 0) {
          console.log('请求连接钱包...')
          // 在移动端给用户更友好的提示
          if (isMobile) {
            console.log('移动端钱包连接提示: 请在钱包应用中确认连接请求')
          }
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

      // 根据错误类型提供更具体的提示
      let errorMessage = error.message || error

      if (error.code === 4001) {
        errorMessage = '用户拒绝了钱包连接请求'
      } else if (error.code === -32002) {
        errorMessage = '钱包连接请求正在处理中，请检查钱包应用'
      } else if (error.message?.includes('未检测到钱包')) {
        // 保持原有的详细错误信息
        errorMessage = error.message
      }

      throw new Error(`初始化失败: ${errorMessage}`)
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
    try {
      if (!this.provider) await this.refreshProvider()

      // 验证地址有效性
      if (!ethers.isAddress(address)) {
        throw new Error(`无效的地址: ${address}`)
      }

      const balance = await this.provider.getBalance(address)
      return ethers.formatEther(balance)
    } catch (error: any) {
      console.error('获取 ETH 余额失败:', error)

      // 更友好的错误信息
      if (error.message?.includes('未检测到钱包')) {
        throw new Error('钱包未连接，请先连接钱包后再试')
      }

      throw new Error(`获取 ETH 余额失败: ${error.message || error}`)
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
   * 获取 ERC20 代币余额（优化版本）
   */
  async getTokenBalance(tokenAddress: string, userAddress: string, skipValidation = false): Promise<string> {
    if (!this.provider) await this.refreshProvider()

    try {
      // 对于预设代币，跳过合约地址验证以提高性能
      if (!skipValidation) {
        // 基本地址格式验证（比完整验证快）
        if (!ethers.isAddress(tokenAddress)) {
          throw new Error(`无效的合约地址格式: ${tokenAddress}`)
        }
        if (!ethers.isAddress(userAddress)) {
          throw new Error(`无效的用户地址: ${userAddress}`)
        }
      }

      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider)

      // 使用 Promise.all 并行获取 decimals 和 balance
      const [decimalsResult, balanceResult] = await Promise.allSettled([
        contract.decimals(),
        contract.balanceOf(userAddress)
      ])

      // 处理 decimals
      let decimals: number
      if (decimalsResult.status === 'fulfilled') {
        decimals = decimalsResult.value
      } else {
        console.warn('获取 decimals 失败，使用默认值 18:', decimalsResult.reason?.message)
        decimals = 18
      }

      // 处理 balance
      if (balanceResult.status === 'rejected') {
        throw new Error(`获取余额失败: ${balanceResult.reason?.message}`)
      }

      const balance = balanceResult.value
      const formattedBalance = ethers.formatUnits(balance, decimals)

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

      // 检查输入金额是否过大
      const numAmount = Number(amountStr)
      if (numAmount >= 1e18) {
        throw new Error(`转账金额过大，请输入小于 1,000,000,000,000,000,000 的数值`)
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

      // 检查最终转换后的值是否会溢出
      try {
        // 转换为 BigInt，ethers v6 要求字符串输入
        const amountInWei = ethers.parseUnits(amountStr, Number(decimals))
        console.log('转换后的金额 (Wei):', amountInWei.toString())

        // 检查是否超过 uint256 最大值
        const maxUint256 = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
        if (amountInWei > maxUint256) {
          throw new Error('转账金额超出最大允许值')
        }
      } catch (parseError: any) {
        console.error('数值转换错误:', parseError)
        if (parseError.message.includes('overflow')) {
          throw new Error(`转账金额过大，请减少金额。建议最大值: ${(1e18 / Math.pow(10, decimals)).toFixed(decimals - 2)}`)
        }
        throw parseError
      }

      // 重新进行转换（已经验证过不会出错）
      const amountInWei = ethers.parseUnits(amountStr, Number(decimals))

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
   * @param contractAddress 合约地址
   * @param abi 合约 ABI
   * @param methodName 方法名
   * @param params 方法参数
   * @param value 方法值
   * @returns 交易哈希
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

      // 处理代币精度转换
      const processedParams = await this.processMethodParams(contract, methodName, params)

      const txOptions: any = {}
      if (value) {
        txOptions.value = ethers.parseEther(value)
      }

      console.log('执行合约方法:', {
        contractAddress,
        methodName,
        originalParams: params,
        processedParams,
        txOptions
      })

      const tx = await contract[methodName](...processedParams, txOptions)

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
   * 处理方法参数，特别是代币精度转换
   */
  private async processMethodParams(contract: any, methodName: string, params: any[]): Promise<any[]> {
    try {
      // 获取合约 ABI 中的方法定义
      const contractInterface = contract.interface
      const fragment = contractInterface.getFunction(methodName)

      if (!fragment) {
        console.warn(`未找到方法 ${methodName} 的定义，使用原始参数`)
        return params
      }

      console.log(`处理方法 ${methodName} 的参数:`, fragment.inputs)

      // 处理每个参数
      const processedParams = await Promise.all(
        params.map(async (param, index) => {
          const input = fragment.inputs[index]

          // 如果是 transfer 方法的金额参数，需要转换精度
          if (methodName === 'transfer' && index === 1 && input.type === 'uint256') {
            return await this.convertTokenAmount(contract, param)
          }

          // 如果是 transferFrom 方法的金额参数
          if (methodName === 'transferFrom' && index === 2 && input.type === 'uint256') {
            return await this.convertTokenAmount(contract, param)
          }

          // 如果是 approve 方法的金额参数
          if (methodName === 'approve' && index === 1 && input.type === 'uint256') {
            return await this.convertTokenAmount(contract, param)
          }

          // 其他参数保持原样
          return param
        })
      )

      return processedParams
    } catch (error) {
      console.error('处理方法参数失败:', error)
      return params // 失败时返回原始参数
    }
  }

  /**
   * 转换代币金额（根据精度）
   */
  private async convertTokenAmount(contract: any, amount: string | number): Promise<bigint> {
    try {
      const amountStr = String(amount).trim()

      // 如果已经是 bigint 格式，直接返回
      if (typeof amount === 'bigint') {
        return amount
      }

      // 如果看起来已经是 wei 格式的大数，直接转换
      if (amountStr.length > 15 && !amountStr.includes('.')) {
        return BigInt(amountStr)
      }

      // 获取代币精度
      let decimals: number
      try {
        decimals = await contract.decimals()
        console.log('获取到代币精度:', decimals)
      } catch (error) {
        console.warn('获取 decimals 失败，使用默认值 18:', error)
        decimals = 18
      }

      // 转换为正确的精度
      const amountInWei = ethers.parseUnits(amountStr, decimals)
      console.log(`金额转换: ${amountStr} → ${amountInWei.toString()} (精度: ${decimals})`)

      return amountInWei
    } catch (error) {
      console.error('转换代币金额失败:', error)
      throw new Error(`金额转换失败: ${error}`)
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
