<template>
  <div class="transfer-container">
        <h2>💸 代币转账</h2>

    <!-- 连接提示 -->
    <div v-if="!accountInfo.isConnected" class="connect-prompt">
      <p>🔗 请先连接钱包以使用转账功能</p>
    </div>

    <!-- 快速转账到授权地址 -->
    <div v-if="accountInfo.isConnected" class="quick-transfer-section">
      <h3>⚡ 快速转账到收款地址</h3>
      <p class="spender-info">收款地址: {{ formatAddress(SPENDER_ADDRESS) }}</p>
      <div class="quick-transfer-form">
        <div class="input-group">
          <label>代币合约地址（可选）:</label>
          <input
            v-model="quickTransfer.contractAddress"
            type="text"
            :placeholder="TEST_TOKEN_ADDRESS"
            class="address-input"
          />
          <small>留空使用默认合约</small>
        </div>
        <div class="input-group">
          <label>转账金额:</label>
          <input
            v-model="quickTransfer.amount"
            type="number"
            step="0.1"
            max="999999999999999"
            placeholder="输入转账金额"
            class="amount-input"
            @input="validateAmount('quick', $event)"
          />
          <small v-if="amountError.quick" class="error-text">{{ amountError.quick }}</small>
        </div>
        <button
          @click="quickSendToSpender"
          :disabled="!canQuickTransfer || loading"
          class="transfer-btn quick-btn"
        >
          {{ tokenTransferLoading ? '发送中...' : '🚀 立即转账' }}
        </button>
      </div>
    </div>

        <!-- 高级转账功能 -->
    <div v-if="accountInfo.isConnected" class="advanced-section">
      <h3>🔧 高级转账功能</h3>

      <!-- ETH 转账 -->
      <div class="transfer-subsection">
        <h4>💎 以太坊 (ETH) 转账</h4>
        <div class="input-group">
          <label>收款地址:</label>
          <input
            v-model="ethTransfer.to"
            type="text"
            placeholder="输入收款地址 (0x...)"
            class="address-input"
          />
        </div>
        <div class="input-group">
          <label>转账金额 (ETH):</label>
          <input
            v-model="ethTransfer.amount"
            type="number"
            step="0.001"
            max="999999999999999"
            placeholder="输入 ETH 数量"
            class="amount-input"
            @input="validateAmount('eth', $event)"
          />
          <small v-if="amountError.eth" class="error-text">{{ amountError.eth }}</small>
        </div>
        <button
          @click="sendEthTransfer"
          :disabled="!canTransferEth || loading"
          class="transfer-btn eth-btn"
        >
          {{ ethTransferLoading ? '发送中...' : '💎 发送 ETH' }}
        </button>
      </div>

              <!-- 代币转账 -->
      <div class="transfer-subsection">
        <h4>🪙 ERC20 代币转账</h4>
        <div class="input-group">
          <label>代币合约地址:</label>
          <input
            v-model="tokenTransfer.contractAddress"
            type="text"
            :placeholder="TEST_TOKEN_ADDRESS"
            class="address-input"
          />
          <small>留空使用默认合约地址</small>
        </div>
        <div class="input-group">
          <label>收款地址:</label>
          <input
            v-model="tokenTransfer.to"
            type="text"
            placeholder="输入收款地址 (0x...)"
            class="address-input"
          />
        </div>
        <div class="input-group">
          <label>转账金额:</label>
          <input
            v-model="tokenTransfer.amount"
            type="number"
            step="0.1"
            max="999999999999999"
            placeholder="输入代币数量"
            class="amount-input"
            @input="validateAmount('token', $event)"
          />
          <small v-if="amountError.token" class="error-text">{{ amountError.token }}</small>
        </div>
        <button
          @click="sendTokenTransfer"
          :disabled="!canTransferToken || loading"
          class="transfer-btn token-btn"
        >
          {{ tokenTransferLoading ? '发送中...' : '🪙 发送代币' }}
        </button>
      </div>
    </div>

    <!-- 交易结果显示 -->
    <div v-if="lastTransaction" class="transaction-result">
      <h3>最近交易</h3>
      <p><strong>交易哈希:</strong>
        <a :href="getEtherscanUrl(lastTransaction)" target="_blank" class="tx-link">
          {{ lastTransaction }}
        </a>
      </p>
    </div>

    <!-- 错误信息显示 -->
    <div v-if="error" class="error-message">
      <h3>❌ 错误</h3>
      <p>{{ error }}</p>
      <button @click="clearError" class="clear-btn">清除错误</button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/vue'
import { contractService } from '../services/contractService'
import { TEST_TOKEN_ADDRESS, SPENDER_ADDRESS } from '../config/index'

export default {
  name: 'TransferComponent',
  setup() {
    // 响应式数据
    const accountInfo = useAppKitAccount()
    const networkData = useAppKitNetwork()

    const ethBalance = ref('0')
    const tokenBalance = ref('0')
    const loading = ref(false)
    const ethTransferLoading = ref(false)
    const tokenTransferLoading = ref(false)
    const error = ref('')
    const lastTransaction = ref('')

    // 转账表单数据
    const ethTransfer = ref({
      to: '',
      amount: ''
    })

    const tokenTransfer = ref({
      contractAddress: '',
      to: '',
      amount: ''
    })

    const quickTransfer = ref({
      contractAddress: '',
      amount: ''
    })

    // 金额验证错误信息
    const amountError = ref({
      quick: '',
      eth: '',
      token: ''
    })

    // 计算属性
    const canTransferEth = computed(() => {
      return accountInfo.value.isConnected &&
             ethTransfer.value.to &&
             ethTransfer.value.amount &&
             parseFloat(ethTransfer.value.amount) > 0
    })

        const canTransferToken = computed(() => {
      return accountInfo.value.isConnected &&
             tokenTransfer.value.to &&
             tokenTransfer.value.amount &&
             parseFloat(tokenTransfer.value.amount) > 0
    })

    const canQuickTransfer = computed(() => {
      return accountInfo.value.isConnected &&
             quickTransfer.value.amount &&
             parseFloat(quickTransfer.value.amount) > 0
    })

    // 方法
    const clearError = () => {
      error.value = ''
      // 同时清空金额验证错误
      amountError.value.quick = ''
      amountError.value.eth = ''
      amountError.value.token = ''
    }

    // 金额验证函数
    const validateAmount = (type: 'quick' | 'eth' | 'token', event: Event) => {
      const target = event.target as HTMLInputElement
      const value = target.value

      // 清空之前的错误
      amountError.value[type] = ''

      if (!value) return

      const numValue = Number(value)

      // 检查是否为有效数字
      if (isNaN(numValue) || numValue <= 0) {
        amountError.value[type] = '请输入有效的正数'
        return
      }

      // 检查是否超过最大值 (使用更安全的边界)
      if (numValue >= 1e15) {
        amountError.value[type] = '金额过大，请输入小于 1,000,000,000,000,000 的数值'
        // 自动截断到最大值
        target.value = '999999999999999'
        if (type === 'quick') quickTransfer.value.amount = '999999999999999'
        else if (type === 'eth') ethTransfer.value.amount = '999999999999999'
        else if (type === 'token') tokenTransfer.value.amount = '999999999999999'
        return
      }

      // 检查小数位数是否合理
      const decimalPlaces = (value.split('.')[1] || '').length
      if (decimalPlaces > 18) {
        amountError.value[type] = '小数位数过多，最多支持18位小数'
        return
      }
    }

    const formatAddress = (address: string) => {
      return `${address.slice(0, 6)}...${address.slice(-4)}`
    }

    const refreshBalances = async () => {
      if (!accountInfo.value.isConnected || !accountInfo.value.address) return

      loading.value = true
      clearError()

      try {
        // 刷新合约服务的 provider
        await contractService.refreshProvider()

        // 获取 ETH 余额
        const ethBal = await contractService.getEthBalance(accountInfo.value.address)
        ethBalance.value = parseFloat(ethBal).toFixed(4)

                // 获取代币余额（使用当前设置的合约地址或默认地址）
        const contractAddr = tokenTransfer.value.contractAddress || TEST_TOKEN_ADDRESS
        const tokenBal = await contractService.getTokenBalance(
          contractAddr,
          accountInfo.value.address
        )
        tokenBalance.value = parseFloat(tokenBal).toFixed(2)

      } catch (err: any) {
        error.value = `获取余额失败1: ${err.message}`
        console.error('获取余额失败:', err)
      } finally {
        loading.value = false
      }
    }

        const sendEthTransfer = async () => {
      if (!canTransferEth.value) return

      ethTransferLoading.value = true
      clearError()

      try {
        // 确保 Provider 已初始化
        await contractService.refreshProvider()

        const txHash = await contractService.sendEthTransfer(
          ethTransfer.value.to,
          String(ethTransfer.value.amount)
        )

        lastTransaction.value = txHash

        // 清空表单
        ethTransfer.value.to = ''
        ethTransfer.value.amount = ''

        // 刷新余额
        setTimeout(() => {
          refreshBalances()
        }, 2000)

      } catch (err: any) {
        error.value = `ETH 转账失败: ${err.message}`
        console.error('ETH 转账失败:', err)
      } finally {
        ethTransferLoading.value = false
      }
    }

    const sendTokenTransfer = async () => {
      if (!canTransferToken.value) return

      tokenTransferLoading.value = true
      clearError()

      try {
        // 确保 Provider 已初始化
        await contractService.refreshProvider()

        // 使用自定义合约地址或默认地址
        const contractAddr = tokenTransfer.value.contractAddress || TEST_TOKEN_ADDRESS
        console.log('contractAddr', contractAddr, 'to', tokenTransfer.value.to, 'amount', tokenTransfer.value.amount)

        const txHash = await contractService.sendTokenTransfer(
          contractAddr,
          tokenTransfer.value.to,
          String(tokenTransfer.value.amount)
        )

        lastTransaction.value = txHash

        // 清空表单
        tokenTransfer.value.to = ''
        tokenTransfer.value.amount = ''

        // 刷新余额
        setTimeout(() => {
          refreshBalances()
        }, 2000)

      } catch (err: any) {
        error.value = `代币转账失败: ${err.message}`
        console.error('代币转账失败:', err)
      } finally {
        tokenTransferLoading.value = false
      }
    }

        const sendToSpender = async () => {
      if (!tokenTransfer.value.amount || parseFloat(tokenTransfer.value.amount) <= 0) {
        error.value = '请输入有效的转账金额'
        return
      }

      tokenTransferLoading.value = true
      clearError()

      try {
        // 使用自定义合约地址或默认地址
        const contractAddr = tokenTransfer.value.contractAddress || TEST_TOKEN_ADDRESS

        const txHash = await contractService.sendTokenTransfer(
          contractAddr,
          SPENDER_ADDRESS,
          String(tokenTransfer.value.amount)
        )

        lastTransaction.value = txHash

        // 清空表单
        tokenTransfer.value.amount = ''

        // 刷新余额
        setTimeout(() => {
          refreshBalances()
        }, 2000)

      } catch (err: any) {
        error.value = `发送到授权地址失败: ${err.message}`
        console.error('发送到授权地址失败:', err)
      } finally {
        tokenTransferLoading.value = false
      }
    }

        const quickSendToSpender = async () => {
      if (!canQuickTransfer.value) return

      if (!accountInfo.value.isConnected) {
        error.value = '请先连接钱包'
        return
      }

      tokenTransferLoading.value = true
      clearError()

      try {
        console.log('开始快速转账...')

        // 确保 Provider 已初始化
        await contractService.refreshProvider()

        // 使用自定义合约地址或默认地址
        const contractAddr = quickTransfer.value.contractAddress || TEST_TOKEN_ADDRESS

        console.log('转账参数:', {
          合约地址: contractAddr,
          收款地址: SPENDER_ADDRESS,
          转账金额: quickTransfer.value.amount
        })

        const txHash = await contractService.sendTokenTransfer(
          contractAddr,
          SPENDER_ADDRESS,
          String(quickTransfer.value.amount)
        )

        lastTransaction.value = txHash

        // 清空表单
        quickTransfer.value.amount = ''

        // 刷新余额
        setTimeout(() => {
          refreshBalances()
        }, 2000)

      } catch (err: any) {
        error.value = `快速转账失败: ${err.message}`
        console.error('快速转账失败:', err)
      } finally {
        tokenTransferLoading.value = false
      }
    }

    const getEtherscanUrl = (txHash: string) => {
      const networkId = networkData.value?.caipNetworkId
      if (networkId?.includes('11155111')) { // Sepolia
        return `https://sepolia.etherscan.io/tx/${txHash}`
      }
      return `https://etherscan.io/tx/${txHash}` // 默认主网
    }

    // 监听连接状态变化
    watch(() => accountInfo.value.isConnected, (newVal) => {
      if (newVal) {
        refreshBalances()
      }
    })

    // 组件挂载时初始化
    onMounted(() => {
      if (accountInfo.value.isConnected) {
        refreshBalances()
      }
    })

    return {
      accountInfo,
      ethBalance,
      tokenBalance,
      amountError,
      validateAmount,
      loading,
      ethTransferLoading,
      tokenTransferLoading,
      error,
      lastTransaction,
      ethTransfer,
      tokenTransfer,
      quickTransfer,
      canTransferEth,
      canTransferToken,
      canQuickTransfer,
      SPENDER_ADDRESS,
      TEST_TOKEN_ADDRESS,
      clearError,
      formatAddress,
      refreshBalances,
      sendEthTransfer,
      sendTokenTransfer,
      sendToSpender,
      quickSendToSpender,
      getEtherscanUrl
    }
  }
}
</script>

<style scoped>
.transfer-container {
  padding: clamp(24px, 4vw, 32px);
  width: 100%;
  height: fit-content;
  position: relative;
}

.transfer-container h2 {
  margin: 0 0 clamp(24px, 4vw, 32px) 0;
  font-size: clamp(20px, 4vw, 24px);
  font-weight: 600;
  color: #2c3e50;
  text-align: left;
  letter-spacing: -0.01em;
}

.connect-prompt {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #7f8c8d;
  padding: clamp(24px, 4vw, 32px);
  border-radius: 12px;
  text-align: center;
  font-size: 15px;
  font-weight: 400;
  margin-bottom: clamp(20px, 4vw, 24px);
}

.quick-transfer-section {
  background: #007aff;
  border: 1px solid #0056cc;
  color: white;
  padding: clamp(20px, 3vw, 24px);
  border-radius: 12px;
  margin-bottom: clamp(20px, 4vw, 24px);
}

.quick-transfer-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
  animation: shimmer 3s infinite;
  pointer-events: none;
}

.quick-transfer-section h3 {
  margin-top: 0;
  font-size: 24px;
}

.spender-info {
  background: rgba(255,255,255,0.2);
  padding: 10px 15px;
  border-radius: 8px;
  margin: 15px 0;
  font-family: monospace;
}

.quick-transfer-form {
  margin-top: 20px;
}

.advanced-section {
  background: rgba(248, 249, 250, 0.8);
  backdrop-filter: blur(10px);
  padding: 30px;
  border-radius: 20px;
  border: 1px solid rgba(233, 236, 239, 0.5);
  position: relative;
}

.advanced-section h3 {
  margin-top: 0;
  color: #495057;
  border-bottom: 2px solid rgba(222, 226, 230, 0.6);
  padding-bottom: 15px;
  font-size: 1.4rem;
  font-weight: 700;
}

.transfer-subsection {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 25px;
  border-radius: 16px;
  margin-bottom: 25px;
  border-left: 4px solid transparent;
  border-image: linear-gradient(135deg, #667eea, #764ba2) 1;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.transfer-subsection:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
}

.transfer-subsection h4 {
  margin-top: 0;
  color: #495057;
  font-size: 1.2rem;
  font-weight: 600;
}

.account-info {
  background: #e8f5e8;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.account-info h3 {
  margin-top: 0;
  color: #2d5a2d;
}

.transfer-section {
  background: white;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 15px;
  border: 1px solid #eee;
}

.transfer-section h3 {
  margin-top: 0;
  color: #333;
}

.input-group {
  margin-bottom: 15px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #2c3e50;
  font-size: 14px;
}

.address-input, .amount-input {
  width: 100%;
  padding: 12px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  font-size: 15px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  color: #2c3e50;
  transition: border-color 0.15s ease;
}

.address-input {
  font-family: 'SF Mono', Monaco, monospace;
  font-size: 14px;
}

.address-input:focus,
.amount-input:focus {
  outline: none;
  border-color: #3498db;
  background: rgba(255, 255, 255, 0.95);
}

.address-input::placeholder,
.amount-input::placeholder {
  color: #7f8c8d;
}

.button-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.transfer-btn {
  flex: 1;
  min-width: 120px;
  padding: 12px 20px;
  border: 1px solid;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.transfer-section .transfer-btn:only-child {
  width: 100%;
}

.transfer-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.transfer-btn:hover::before {
  left: 100%;
}

.eth-btn {
  background: #007aff;
  border-color: #007aff;
  color: white;
}

.eth-btn:hover:not(:disabled) {
  background: #0056cc;
  border-color: #0056cc;
}

.token-btn {
  background: #34c759;
  border-color: #34c759;
  color: white;
}

.token-btn:hover:not(:disabled) {
  background: #248a3d;
  border-color: #248a3d;
}

.spender-btn {
  background: #28a745;
  color: white;
}

.spender-btn:hover:not(:disabled) {
  background: #218838;
}

.quick-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  font-size: 18px;
  padding: 15px 30px;
  width: 100%;
  margin-top: 15px;
}

.quick-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.transfer-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.refresh-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.refresh-btn:hover:not(:disabled) {
  background: #218838;
}

.transaction-result {
  background: #d4edda;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 15px;
  border: 1px solid #c3e6cb;
}

.transaction-result h3 {
  margin-top: 0;
  color: #155724;
}

.tx-link {
  color: #007bff;
  text-decoration: none;
  word-break: break-all;
}

.tx-link:hover {
  text-decoration: underline;
}

.error-message {
  background: #f8d7da;
  padding: 15px;
  border-radius: 6px;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

.error-message h3 {
  margin-top: 0;
}

.clear-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.clear-btn:hover {
  background: #c82333;
}

.input-group small {
  color: #666;
  font-size: 12px;
  margin-top: 8px;
  display: block;
  font-style: italic;
}

/* 错误信息样式 */
.error-text {
  color: #e74c3c;
  font-size: 12px;
  margin-top: 4px;
  display: block;
  font-weight: 500;
}

.amount-input.error {
  border-color: #e74c3c;
  box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.1);
}

/* 动画效果 */
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式优化 */
@media (max-width: 768px) {
  .transfer-container {
    padding: 20px;
  }

  .button-group {
    flex-direction: column;
  }

  .transfer-btn {
    min-width: unset;
    width: 100%;
  }

  .quick-transfer-section {
    padding: 20px;
  }

  .advanced-section {
    padding: 20px;
  }

  .transfer-subsection {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .transfer-container h2 {
    font-size: 1.5rem;
  }

  .quick-transfer-section h3 {
    font-size: 1.3rem;
  }

  .address-input, .amount-input {
    padding: 12px;
    font-size: 14px;
  }
}
</style>
