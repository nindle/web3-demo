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
          <div class="progress-container">
            <div class="spinner"></div>
            <div class="progress-info">
              <p class="status-text">正在快速扫描代币余额...</p>
              <p class="tips-text">💡 提示：首次扫描可能较慢，后续会使用缓存加速</p>
            </div>
          </div>
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
/* =============================================================================
   代币余额视图 - 现代化卡片设计
   ============================================================================= */

.token-balance-container {
  padding: var(--space-2xl);
  width: 100%;
  position: relative;
  min-height: 400px;
}

.token-balance-container h2 {
  margin: 0 0 var(--space-2xl) 0;
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  text-align: left;
  letter-spacing: -0.025em;
  display: flex;
  align-items: center;
  gap: var(--space-md);
  position: relative;
}

.token-balance-container h2::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 24px;
  background: linear-gradient(135deg, var(--primary-600), var(--success-500));
  border-radius: var(--radius-full);
  margin-right: var(--space-sm);
}

.not-connected {
  background: var(--background-glass);
  border: 1px solid var(--border-light);
  padding: var(--space-3xl);
  border-radius: var(--radius-lg);
  text-align: center;
  color: var(--text-secondary);
  font-size: var(--text-base);
  font-weight: var(--font-normal);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.not-connected::before {
  content: '🔗';
  display: block;
  font-size: var(--text-3xl);
  margin-bottom: var(--space-lg);
  opacity: 0.7;
}

.not-connected::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 122, 255, 0.1), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

.balance-card {
  background: var(--background-glass);
  border: 1px solid var(--border-light);
  padding: var(--space-xl);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-md);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all var(--transition-normal);
  position: relative;
  backdrop-filter: blur(15px) saturate(180%);
  overflow: hidden;
  cursor: pointer;
}

.balance-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--primary-600), var(--success-500), var(--warning-500));
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.balance-card:hover {
  border-color: var(--primary-600);
  background: rgba(255, 255, 255, 0.95);
  transform: translateY(-2px) scale(1.02);
  box-shadow: var(--shadow-lg);
}

.balance-card:hover::before {
  opacity: 1;
}

.balance-card:active {
  transform: translateY(-1px) scale(1.01);
  transition: transform 0.1s ease;
}

.eth-card {
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
  border: 1px solid var(--primary-600);
  color: var(--text-inverse);
  margin-bottom: var(--space-xl);
  box-shadow: var(--shadow-md), 0 0 20px rgba(0, 122, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.eth-card::before {
  background: linear-gradient(90deg, var(--primary-600), var(--success-500)) !important;
  opacity: 1 !important;
}

.eth-card::after {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  pointer-events: none;
}

.eth-card:hover {
  background: linear-gradient(135deg, var(--primary-700) 0%, #004099 100%);
  border-color: var(--primary-700);
  transform: translateY(-3px) scale(1.02);
  box-shadow: var(--shadow-xl), 0 0 30px rgba(0, 122, 255, 0.3);
}

.token-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.token-icon {
  font-size: var(--text-xl);
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(0, 122, 255, 0.1), rgba(52, 199, 89, 0.1));
  border-radius: var(--radius-full);
  border: 2px solid rgba(0, 122, 255, 0.2);
  flex-shrink: 0;
  color: var(--primary-600);
  position: relative;
  transition: all var(--transition-normal);
}

.token-icon::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--primary-600), var(--success-500));
  z-index: -1;
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.balance-card:hover .token-icon::before {
  opacity: 0.1;
}

.eth-card .token-icon {
  background: rgba(255,255,255,0.25);
  border-color: rgba(255,255,255,0.4);
  color: var(--text-inverse);
  backdrop-filter: blur(10px);
}

.eth-card .token-icon::before {
  background: linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1));
}

.eth-card:hover .token-icon::before {
  opacity: 1;
}

.token-details h3, .token-details h4 {
  margin: 0 0 var(--space-xs) 0;
  font-weight: var(--font-semibold);
  font-size: var(--text-base);
  color: var(--text-primary);
  line-height: 1.3;
  transition: color var(--transition-fast);
}

.eth-card .token-details h3 {
  color: var(--text-inverse);
  font-weight: var(--font-bold);
}

.balance-card:hover .token-details h3,
.balance-card:hover .token-details h4 {
  color: var(--primary-700);
}

.eth-card:hover .token-details h3 {
  color: var(--text-inverse);
}

.token-address {
  margin: 0;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  font-weight: var(--font-normal);
  opacity: 0.8;
  transition: all var(--transition-fast);
  letter-spacing: 0.025em;
}

.eth-card .token-address {
  color: rgba(255,255,255,0.8);
}

.balance-card:hover .token-address {
  opacity: 1;
  color: var(--text-secondary);
}

.eth-card:hover .token-address {
  color: rgba(255,255,255,0.9);
}

.balance-amount {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-xs);
  position: relative;
}

.amount {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
  transition: all var(--transition-fast);
  position: relative;
}

.amount::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--primary-600), var(--success-500));
  transform: scaleX(0);
  transition: transform var(--transition-normal);
  border-radius: var(--radius-full);
}

.balance-card:hover .amount::after {
  transform: scaleX(1);
}

.eth-card .amount {
  color: var(--text-inverse);
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.eth-card .amount::after {
  background: linear-gradient(90deg, rgba(255,255,255,0.6), rgba(255,255,255,0.3));
}

.unit {
  font-size: var(--text-sm);
  color: var(--text-muted);
  font-weight: var(--font-medium);
  opacity: 0.8;
  transition: all var(--transition-fast);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.eth-card .unit {
  color: rgba(255,255,255,0.8);
}

.balance-card:hover .unit {
  opacity: 1;
  color: var(--text-secondary);
}

.eth-card:hover .unit {
  color: rgba(255,255,255,0.9);
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
  padding: var(--space-md) var(--space-lg);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-md);
  background: var(--background-glass);
  backdrop-filter: blur(15px) saturate(180%);
  color: var(--text-primary);
  cursor: pointer;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
}

.refresh-btn::before, .toggle-btn::before, .detect-btn::before, .use-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s ease;
}

.refresh-btn:hover::before, .toggle-btn:hover::before, .detect-btn:hover::before, .use-btn:hover::before {
  left: 100%;
}

.refresh-btn {
  background: linear-gradient(135deg, var(--success-500), var(--success-600));
  border-color: var(--success-500);
  color: var(--text-inverse);
  box-shadow: var(--shadow-sm), 0 0 10px rgba(52, 199, 89, 0.2);
}

.refresh-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--success-600), #1e7d32);
  border-color: var(--success-600);
  transform: translateY(-1px) scale(1.02);
  box-shadow: var(--shadow-md), 0 0 15px rgba(52, 199, 89, 0.3);
}

.refresh-btn:active {
  transform: translateY(0) scale(1);
  transition: transform 0.1s ease;
}

.toggle-btn {
  background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
  border-color: var(--primary-600);
  color: var(--text-inverse);
  box-shadow: var(--shadow-sm), 0 0 10px rgba(0, 122, 255, 0.2);
}

.toggle-btn:hover {
  background: linear-gradient(135deg, var(--primary-700), #004099);
  border-color: var(--primary-700);
  transform: translateY(-1px) scale(1.02);
  box-shadow: var(--shadow-md), 0 0 15px rgba(0, 122, 255, 0.3);
}

.toggle-btn:active {
  transform: translateY(0) scale(1);
  transition: transform 0.1s ease;
}

.use-btn {
  background: linear-gradient(135deg, var(--warning-500), var(--warning-600));
  border-color: var(--warning-500);
  color: var(--text-inverse);
  font-size: var(--text-xs);
  padding: var(--space-sm) var(--space-md);
  min-height: 32px;
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm), 0 0 8px rgba(255, 149, 0, 0.2);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.use-btn:hover {
  background: linear-gradient(135deg, var(--warning-600), #b8860b);
  border-color: var(--warning-600);
  transform: translateY(-1px) scale(1.05);
  box-shadow: var(--shadow-md), 0 0 12px rgba(255, 149, 0, 0.3);
}

.use-btn:active {
  transform: translateY(0) scale(1.02);
  transition: transform 0.1s ease;
}

.loading-indicator {
  text-align: center;
  padding: var(--space-3xl);
  background: var(--background-glass);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-light);
  margin: var(--space-lg) 0;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: var(--space-xl);
}

.progress-info {
  text-align: left;
  flex: 1;
}

.status-text {
  color: var(--text-primary);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  margin: 0 0 var(--space-sm) 0;
}

.tips-text {
  color: var(--text-secondary);
  font-size: var(--text-sm);
  margin: 0;
  opacity: 0.8;
}

@media (max-width: 640px) {
  .progress-container {
    flex-direction: column;
    gap: var(--space-lg);
    text-align: center;
  }

  .progress-info {
    text-align: center;
  }
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--gray-200);
  border-top: 4px solid var(--primary-600);
  border-radius: var(--radius-full);
  animation: spin 1s linear infinite;
  margin: 0 auto var(--space-lg);
  position: relative;
}

.spinner::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 16px;
  height: 16px;
  background: radial-gradient(circle, var(--primary-600), transparent);
  border-radius: var(--radius-full);
  transform: translate(-50%, -50%);
  animation: pulse 1s ease-in-out infinite alternate;
}

@keyframes pulse {
  0% { opacity: 0.4; transform: translate(-50%, -50%) scale(0.8); }
  100% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
}

.loading-indicator p {
  color: var(--text-secondary);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  margin: 0;
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
  margin-top: var(--space-2xl);
  background: var(--background-glass);
  backdrop-filter: blur(15px) saturate(180%);
  padding: var(--space-xl);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-light);
  position: relative;
  overflow: hidden;
}

.custom-token-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-600), var(--success-500), var(--warning-500));
  opacity: 0.6;
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
  background: linear-gradient(135deg, #17a2b8, #138496);
  border-color: #17a2b8;
  color: var(--text-inverse);
  box-shadow: var(--shadow-sm), 0 0 10px rgba(23, 162, 184, 0.2);
}

.detect-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #138496, #117a8b);
  border-color: #138496;
  transform: translateY(-1px) scale(1.02);
  box-shadow: var(--shadow-md), 0 0 15px rgba(23, 162, 184, 0.3);
}

.detect-btn:active {
  transform: translateY(0) scale(1);
  transition: transform 0.1s ease;
}

.detect-btn:disabled, .refresh-btn:disabled {
  background: var(--gray-300);
  border-color: var(--gray-300);
  color: var(--gray-500);
  cursor: not-allowed;
  opacity: 0.6;
  transform: none;
  box-shadow: none;
}

.detect-btn:disabled::before, .refresh-btn:disabled::before {
  display: none;
}

.error-message {
  background: rgba(255, 59, 48, 0.1);
  backdrop-filter: blur(10px);
  padding: var(--space-lg);
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 59, 48, 0.2);
  color: var(--error-600);
  margin-top: var(--space-xl);
  position: relative;
  overflow: hidden;
}

.error-message::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--error-500);
}

.error-message h3 {
  margin-top: 0;
}

.clear-btn {
  background: linear-gradient(135deg, var(--error-500), var(--error-600));
  color: var(--text-inverse);
  border: 1px solid var(--error-500);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-sm);
  cursor: pointer;
  margin-top: var(--space-md);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  transition: all var(--transition-fast);
  position: relative;
  overflow: hidden;
}

.clear-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s ease;
}

.clear-btn:hover {
  background: linear-gradient(135deg, var(--error-600), #b71c1c);
  border-color: var(--error-600);
  transform: translateY(-1px) scale(1.02);
  box-shadow: var(--shadow-md), 0 0 15px rgba(255, 59, 48, 0.3);
}

.clear-btn:hover::before {
  left: 100%;
}

.clear-btn:active {
  transform: translateY(0) scale(1);
  transition: transform 0.1s ease;
}

/* 响应式设计优化 */
@media (max-width: 768px) {
  .token-balance-container {
    padding: var(--space-lg);
  }

  .token-balance-container h2 {
    font-size: var(--text-xl);
    margin-bottom: var(--space-xl);
  }

  .balance-card {
    flex-direction: row;
    align-items: center;
    text-align: left;
    gap: var(--space-lg);
    padding: var(--space-lg);
    margin-bottom: var(--space-md);
    min-height: 80px;
  }

  .token-info {
    flex: 1;
    min-width: 0;
  }

  .token-icon {
    width: 44px;
    height: 44px;
    font-size: var(--text-lg);
    flex-shrink: 0;
  }

  .token-details h3, .token-details h4 {
    font-size: var(--text-sm);
    line-height: 1.4;
  }

  .token-address {
    font-size: 11px;
  }

  .balance-amount {
    text-align: right;
    flex-shrink: 0;
    min-width: 80px;
  }

  .amount {
    font-size: var(--text-lg);
    margin-bottom: var(--space-xs);
  }

  .unit {
    font-size: 11px;
  }

  .eth-card {
    background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
    border-radius: var(--radius-lg);
    padding: var(--space-xl);
    margin-bottom: var(--space-lg);
    min-height: 90px;
  }

  .eth-card .token-icon {
    width: 48px;
    height: 48px;
  }

  .eth-card .amount {
    font-size: var(--text-xl);
    font-weight: var(--font-bold);
  }

  .section-header {
    flex-direction: column;
    gap: var(--space-lg);
    align-items: stretch;
    margin-bottom: var(--space-lg);
  }

  .section-header h3 {
    font-size: var(--text-lg);
    text-align: center;
  }

  .actions {
    display: flex;
    gap: var(--space-sm);
    justify-content: center;
    flex-wrap: wrap;
  }

  .refresh-btn, .toggle-btn, .detect-btn {
    flex: 1;
    min-width: 120px;
    padding: var(--space-md) var(--space-sm);
    font-size: var(--text-xs);
  }

  .token-list {
    gap: var(--space-md);
  }

  .loading-indicator {
    padding: var(--space-2xl);
  }

  .spinner {
    width: 36px;
    height: 36px;
  }

  .custom-token-section {
    padding: var(--space-lg);
    margin-top: var(--space-xl);
  }

  .input-group {
    flex-direction: column;
    gap: var(--space-sm);
  }

  .address-input {
    font-size: var(--text-sm);
    padding: var(--space-md);
  }

  .use-btn {
    min-height: 28px;
    padding: var(--space-xs) var(--space-sm);
    font-size: 10px;
    border-radius: var(--radius-xs);
  }
}

/* 超小屏幕优化 */
@media (max-width: 480px) {
  .token-balance-container {
    padding: var(--space-md);
  }

  .balance-card {
    flex-direction: column;
    text-align: center;
    gap: var(--space-md);
    padding: var(--space-md);
  }

  .token-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-sm);
  }

  .token-details {
    text-align: center;
  }

  .balance-amount {
    text-align: center;
    width: 100%;
  }

  .eth-card {
    padding: var(--space-lg);
  }

  .actions {
    flex-direction: column;
    gap: var(--space-sm);
  }

  .refresh-btn, .toggle-btn, .detect-btn {
    width: 100%;
    min-width: unset;
  }

  .token-list {
    grid-template-columns: 1fr;
  }
}

/* 横屏手机优化 */
@media screen and (max-width: 768px) and (orientation: landscape) and (max-height: 500px) {
  .token-balance-container {
    padding: var(--space-sm);
  }

  .balance-card {
    min-height: 60px;
    padding: var(--space-sm) var(--space-md);
  }

  .token-icon {
    width: 32px;
    height: 32px;
    font-size: var(--text-base);
  }

  .eth-card {
    min-height: 70px;
    padding: var(--space-md);
  }

  .section-header {
    margin-bottom: var(--space-md);
  }

  .loading-indicator {
    padding: var(--space-lg);
  }
}
</style>
