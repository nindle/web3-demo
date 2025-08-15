<template>
  <div class="wallet-status" :class="statusClass">
    <div class="status-indicator">
      <div class="status-icon">{{ statusIcon }}</div>
      <div class="status-text">
        <div class="status-title">{{ statusTitle }}</div>
        <div class="status-subtitle">{{ statusSubtitle }}</div>
      </div>
    </div>

    <div v-if="!isConnected && isMobile" class="mobile-actions">
      <button @click="openMobileGuide" class="guide-btn">
        📖 查看连接指南
      </button>
      <button @click="openAppKit" class="connect-btn">
        🔗 连接钱包
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ref } from 'vue'
import { useAppKitAccount, useAppKit } from '@reown/appkit/vue'

export default {
  name: 'WalletConnectionStatus',
  emits: ['open-mobile-guide'],
  setup(_, { emit }) {
    const accountInfo = useAppKitAccount()
    const { open } = useAppKit()

    // 检测是否为移动端
    const isMobile = computed(() => {
      if (typeof window === 'undefined') return false
      return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    })

    // 检测是否在钱包内置浏览器中
    const isWalletBrowser = computed(() => {
      if (typeof window === 'undefined') return false
      const userAgent = navigator.userAgent.toLowerCase()
      return userAgent.includes('metamask') ||
             userAgent.includes('trust') ||
             userAgent.includes('coinbase') ||
             userAgent.includes('imtoken') ||
             userAgent.includes('tokenpocket')
    })

    const isConnected = computed(() => accountInfo.value.isConnected)

    const statusClass = computed(() => {
      if (isConnected.value) return 'status-connected'
      if (isMobile.value && !isWalletBrowser.value && !(window as any).ethereum) {
        return 'status-mobile-warning'
      }
      return 'status-disconnected'
    })

    const statusIcon = computed(() => {
      if (isConnected.value) return '✅'
      if (isMobile.value && !isWalletBrowser.value && !(window as any).ethereum) {
        return '📱'
      }
      return '⚠️'
    })

    const statusTitle = computed(() => {
      if (isConnected.value) return '钱包已连接'
      if (isMobile.value && !isWalletBrowser.value && !(window as any).ethereum) {
        return '移动端钱包连接'
      }
      return '钱包未连接'
    })

    const statusSubtitle = computed(() => {
      if (isConnected.value) {
        const address = accountInfo.value.address
        return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''
      }
      if (isMobile.value && !isWalletBrowser.value && !(window as any).ethereum) {
        return '请使用钱包应用或WalletConnect连接'
      }
      return '请连接您的Web3钱包'
    })

    const openMobileGuide = () => {
      emit('open-mobile-guide')
    }

    const openAppKit = () => {
      open()
    }

    return {
      isMobile,
      isWalletBrowser,
      isConnected,
      statusClass,
      statusIcon,
      statusTitle,
      statusSubtitle,
      openMobileGuide,
      openAppKit
    }
  }
}
</script>

<style scoped>
.wallet-status {
  background: var(--background-glass);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  margin-bottom: var(--space-xl);
  transition: all var(--transition-normal);
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
}

.status-icon {
  font-size: var(--text-2xl);
  flex-shrink: 0;
}

.status-text {
  flex: 1;
}

.status-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-xs);
}

.status-subtitle {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.mobile-actions {
  display: flex;
  gap: var(--space-md);
  flex-wrap: wrap;
}

.guide-btn, .connect-btn {
  flex: 1;
  min-width: 140px;
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--transition-normal);
  border: none;
  text-align: center;
}

.guide-btn {
  background: var(--background-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-medium);
}

.guide-btn:hover {
  background: var(--background-primary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.connect-btn {
  background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
  color: white;
}

.connect-btn:hover {
  background: linear-gradient(135deg, var(--primary-700), var(--primary-800));
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* 状态样式 */
.status-connected {
  border-color: var(--success-500);
  background: linear-gradient(135deg,
    rgba(52, 199, 89, 0.05) 0%,
    rgba(52, 199, 89, 0.02) 100%
  );
}

.status-mobile-warning {
  border-color: var(--warning-500);
  background: linear-gradient(135deg,
    rgba(255, 149, 0, 0.05) 0%,
    rgba(255, 149, 0, 0.02) 100%
  );
}

.status-disconnected {
  border-color: var(--error-500);
  background: linear-gradient(135deg,
    rgba(255, 59, 48, 0.05) 0%,
    rgba(255, 59, 48, 0.02) 100%
  );
}

/* 移动端优化 */
@media (max-width: 480px) {
  .mobile-actions {
    flex-direction: column;
  }

  .guide-btn, .connect-btn {
    min-width: unset;
  }

  .status-indicator {
    flex-direction: column;
    text-align: center;
    gap: var(--space-sm);
  }
}

/* 深色主题适配 */
@media (prefers-color-scheme: dark) {
  .status-connected {
    background: linear-gradient(135deg,
      rgba(52, 199, 89, 0.08) 0%,
      rgba(52, 199, 89, 0.03) 100%
    );
  }

  .status-mobile-warning {
    background: linear-gradient(135deg,
      rgba(255, 149, 0, 0.08) 0%,
      rgba(255, 149, 0, 0.03) 100%
    );
  }

  .status-disconnected {
    background: linear-gradient(135deg,
      rgba(255, 59, 48, 0.08) 0%,
      rgba(255, 59, 48, 0.03) 100%
    );
  }
}
</style>
