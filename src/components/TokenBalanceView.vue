<template>
  <div class="token-balance-container">
    <h2>💰 我的代币余额</h2>

    <div v-if="!accountInfo.isConnected" class="not-connected">
      <p>请先连接钱包查看代币余额</p>
    </div>

    <div v-else>
      <!-- ETH 余额卡片 -->
      <div class="balance-card eth-card">
        <div class="token-info">
          <div class="token-icon">⟠</div>
          <div class="token-details">
            <h3>以太坊 (ETH)</h3>
            <p class="token-address">原生代币</p>
          </div>
        </div>
        <div class="balance-amount">
          <span class="amount">{{ ethBalance }}</span>
          <span class="unit">ETH</span>
        </div>
      </div>

      <!-- 代币列表 -->
      <div class="tokens-section">
        <div class="section-header">
          <h3>ERC20 代币</h3>
          <div class="actions">
            <button @click="refreshAllBalances" :disabled="loading" class="refresh-btn">
              {{ loading ? '扫描中...' : '刷新余额' }}
            </button>
            <button @click="toggleShowAll" class="toggle-btn">
              {{ showAllTokens ? '仅显示有余额' : '显示全部代币' }}
            </button>
          </div>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="loading-indicator">
          <div class="spinner"></div>
          <p>正在扫描代币余额...</p>
        </div>

        <!-- 代币余额列表 -->
        <div v-else class="token-list">
          <div
            v-for="token in displayedTokens"
            :key="token.address"
            class="balance-card token-card"
            :class="{ 'no-balance': !token.hasBalance }"
          >
            <div class="token-info">
              <div class="token-icon">🪙</div>
              <div class="token-details">
                <h4>{{ token.name }} ({{ token.symbol }})</h4>
                <p class="token-address">{{ formatAddress(token.address) }}</p>
              </div>
            </div>
            <div class="balance-amount">
              <span class="amount">{{ token.balanceFormatted }}</span>
              <span class="unit">{{ token.symbol }}</span>
              <div class="actions">
                <button
                  v-if="token.hasBalance"
                  @click="selectTokenForTransfer(token)"
                  class="use-btn"
                >
                  使用
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="!loading && displayedTokens.length === 0" class="empty-state">
          <p>{{ showAllTokens ? '没有找到任何代币' : '没有找到有余额的代币' }}</p>
        </div>
      </div>

      <!-- 自定义代币检测 -->
      <div class="custom-token-section">
        <h3>检测自定义代币</h3>
        <div class="input-group">
          <input
            v-model="customTokenAddress"
            type="text"
            placeholder="输入代币合约地址 (0x...)"
            class="address-input"
          />
          <button
            @click="detectCustomToken"
            :disabled="!customTokenAddress || detecting"
            class="detect-btn"
          >
            {{ detecting ? '检测中...' : '检测' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 错误信息 -->
    <div v-if="error" class="error-message">
      <h3>❌ 错误</h3>
      <p>{{ error }}</p>
      <button @click="clearError" class="clear-btn">清除错误</button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useAppKitAccount } from '@reown/appkit/vue'
import { contractService } from '../services/contractService'
import { tokenScanner, type TokenBalance } from '../services/tokenScanner'

export default {
  name: 'TokenBalanceView',
  emits: ['token-selected'],
  setup(props, { emit }) {
    const accountInfo = useAppKitAccount()

    // 响应式数据
    const ethBalance = ref('0.0000')
    const tokenBalances = ref<TokenBalance[]>([])
    const loading = ref(false)
    const detecting = ref(false)
    const error = ref('')
    const showAllTokens = ref(false)
    const customTokenAddress = ref('')

    // 计算属性
    const displayedTokens = computed(() => {
      if (showAllTokens.value) {
        return tokenBalances.value
      }
      return tokenScanner.filterTokensWithBalance(tokenBalances.value)
    })

    // 方法
    const clearError = () => {
      error.value = ''
    }

    const formatAddress = (address: string) => {
      return `${address.slice(0, 6)}...${address.slice(-4)}`
    }

    const refreshEthBalance = async () => {
      if (!accountInfo.value.address) return

      try {
        await contractService.refreshProvider()
        const balance = await contractService.getEthBalance(accountInfo.value.address)
        ethBalance.value = parseFloat(balance).toFixed(4)
      } catch (err: any) {
        console.error('获取 ETH 余额失败:', err)
      }
    }

    const refreshTokenBalances = async () => {
      if (!accountInfo.value.address) return

      try {
        const balances = await tokenScanner.scanAllTokenBalances(accountInfo.value.address)
        tokenBalances.value = tokenScanner.sortTokensByBalance(balances)
      } catch (err: any) {
        error.value = `扫描代币余额失败: ${err.message}`
        console.error('扫描代币余额失败:', err)
      }
    }

    const refreshAllBalances = async () => {
      if (!accountInfo.value.isConnected) return

      loading.value = true
      clearError()

      try {
        await Promise.all([
          refreshEthBalance(),
          refreshTokenBalances()
        ])
      } catch (err: any) {
        error.value = `刷新余额失败: ${err.message}`
      } finally {
        loading.value = false
      }
    }

    const toggleShowAll = () => {
      showAllTokens.value = !showAllTokens.value
    }

    const detectCustomToken = async () => {
      if (!customTokenAddress.value || !accountInfo.value.address) return

      detecting.value = true
      clearError()

      try {
        const tokenInfo = await tokenScanner.detectCustomToken(
          customTokenAddress.value,
          accountInfo.value.address
        )

        if (tokenInfo) {
          // 检查是否已存在
          const exists = tokenBalances.value.find(t =>
            t.address.toLowerCase() === tokenInfo.address.toLowerCase()
          )

          if (!exists) {
            tokenBalances.value.push(tokenInfo)
            tokenBalances.value = tokenScanner.sortTokensByBalance(tokenBalances.value)
          }

          customTokenAddress.value = ''
        } else {
          error.value = '无法检测到有效的代币信息'
        }
      } catch (err: any) {
        error.value = `检测代币失败: ${err.message}`
      } finally {
        detecting.value = false
      }
    }

    const selectTokenForTransfer = (token: TokenBalance) => {
      emit('token-selected', token)
    }

    // 监听连接状态变化
    watch(() => accountInfo.value.isConnected, (newVal) => {
      if (newVal) {
        refreshAllBalances()
      } else {
        // 清空数据
        ethBalance.value = '0.0000'
        tokenBalances.value = []
      }
    })

    // 组件挂载时初始化
    onMounted(() => {
      if (accountInfo.value.isConnected) {
        refreshAllBalances()
      }
    })

    return {
      accountInfo,
      ethBalance,
      tokenBalances,
      loading,
      detecting,
      error,
      showAllTokens,
      customTokenAddress,
      displayedTokens,
      clearError,
      formatAddress,
      refreshAllBalances,
      toggleShowAll,
      detectCustomToken,
      selectTokenForTransfer
    }
  }
}
</script>

<style scoped>
.token-balance-container {
  padding: clamp(24px, 4vw, 32px);
  width: 100%;
  position: relative;
}

.token-balance-container h2 {
  margin: 0 0 clamp(24px, 4vw, 32px) 0;
  font-size: clamp(20px, 4vw, 24px);
  font-weight: 600;
  color: #2c3e50;
  text-align: left;
  letter-spacing: -0.01em;
}

.not-connected {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: clamp(24px, 4vw, 32px);
  border-radius: 12px;
  text-align: center;
  color: #7f8c8d;
  font-size: 15px;
  font-weight: 400;
}

.balance-card {
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: clamp(20px, 3vw, 24px);
  border-radius: 12px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.15s ease;
  position: relative;
  backdrop-filter: blur(10px);
}

.balance-card:hover {
  border-color: rgba(52, 152, 219, 0.3);
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.eth-card {
  background: #007aff;
  border-color: #007aff;
  color: white;
  margin-bottom: clamp(20px, 4vw, 24px);
}

.eth-card:hover {
  background: #0056cc;
  border-color: #0056cc;
}

.token-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.token-icon {
  font-size: 20px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(52, 152, 219, 0.1);
  border-radius: 50%;
  border: 1px solid rgba(52, 152, 219, 0.2);
  flex-shrink: 0;
  color: #3498db;
}

.eth-card .token-icon {
  background: rgba(255,255,255,0.2);
  border-color: rgba(255,255,255,0.3);
  color: white;
}

.token-details h3, .token-details h4 {
  margin: 0 0 4px 0;
  font-weight: 500;
  font-size: 15px;
  color: #2c3e50;
  line-height: 1.2;
}

.eth-card .token-details h3 {
  color: white;
}

.token-address {
  margin: 0;
  color: #7f8c8d;
  font-family: 'SF Mono', Monaco, monospace;
  font-size: 12px;
  font-weight: 400;
}

.eth-card .token-address {
  color: rgba(255,255,255,0.7);
}

.balance-amount {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.amount {
  font-size: clamp(18px, 3vw, 20px);
  font-weight: 600;
  color: #2c3e50;
  font-variant-numeric: tabular-nums;
}

.eth-card .amount {
  color: white;
}

.unit {
  font-size: 13px;
  color: #7f8c8d;
  font-weight: 400;
}

.eth-card .unit {
  color: rgba(255,255,255,0.7);
}

.tokens-section {
  margin-top: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.section-header h3 {
  margin: 0;
  color: #333;
}

.actions {
  display: flex;
  gap: 10px;
}

.refresh-btn, .toggle-btn, .detect-btn, .use-btn {
  padding: 8px 16px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  color: #2c3e50;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.15s ease;
}

.refresh-btn {
  background: #34c759;
  border-color: #34c759;
  color: white;
}

.refresh-btn:hover:not(:disabled) {
  background: #248a3d;
  border-color: #248a3d;
}

.toggle-btn {
  background: #007aff;
  border-color: #007aff;
  color: white;
}

.toggle-btn:hover {
  background: #0056cc;
  border-color: #0056cc;
}

.use-btn {
  background: #ff9500;
  border-color: #ff9500;
  color: white;
  font-size: 12px;
  padding: 6px 12px;
}

.use-btn:hover {
  background: #cc7700;
  border-color: #cc7700;
}

.loading-indicator {
  text-align: center;
  padding: 40px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.token-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
}

@media (min-width: 768px) {
  .token-list {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media (min-width: 1200px) {
  .token-list {
    grid-template-columns: repeat(3, 1fr);
  }
}

.token-card.no-balance {
  opacity: 0.6;
  background: #f8f9fa;
}

.token-card.no-balance:hover {
  transform: none;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #6c757d;
  background: #f8f9fa;
  border-radius: 8px;
}

.custom-token-section {
  margin-top: 30px;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.custom-token-section h3 {
  margin-top: 0;
  color: #333;
}

.input-group {
  display: flex;
  gap: 10px;
  align-items: stretch;
}

.address-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: monospace;
  font-size: 14px;
}

.detect-btn {
  background: #17a2b8;
  color: white;
}

.detect-btn:hover:not(:disabled) {
  background: #138496;
}

.detect-btn:disabled, .refresh-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.error-message {
  background: #f8d7da;
  padding: 15px;
  border-radius: 6px;
  border: 1px solid #f5c6cb;
  color: #721c24;
  margin-top: 20px;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .balance-card {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }

  .section-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .actions {
    justify-content: center;
  }

  .input-group {
    flex-direction: column;
  }
}
</style>
