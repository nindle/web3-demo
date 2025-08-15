<template>
  <div v-if="showGuide" class="mobile-wallet-guide">
    <div class="guide-overlay" @click="closeGuide"></div>
    <div class="guide-content">
      <div class="guide-header">
        <h3>📱 移动端钱包连接指南</h3>
        <button @click="closeGuide" class="close-btn">×</button>
      </div>

      <div class="guide-body">
        <div class="connection-options">
          <div class="option">
            <div class="option-icon">🔗</div>
            <div class="option-content">
              <h4>方式一：WalletConnect</h4>
              <p>点击"连接钱包"按钮，扫描二维码用移动钱包连接</p>
            </div>
          </div>

          <div class="option">
            <div class="option-icon">📱</div>
            <div class="option-content">
              <h4>方式二：钱包内置浏览器</h4>
              <p>在钱包应用中打开内置浏览器访问本网站</p>
            </div>
          </div>
        </div>

        <div class="wallet-apps">
          <h4>推荐钱包应用：</h4>
          <div class="wallet-list">
            <div class="wallet-item">
              <span class="wallet-icon">🦊</span>
              <span>MetaMask</span>
            </div>
            <div class="wallet-item">
              <span class="wallet-icon">🛡️</span>
              <span>Trust Wallet</span>
            </div>
            <div class="wallet-item">
              <span class="wallet-icon">🔵</span>
              <span>Coinbase Wallet</span>
            </div>
            <div class="wallet-item">
              <span class="wallet-icon">🌈</span>
              <span>Rainbow</span>
            </div>
          </div>
        </div>

        <div class="troubleshooting">
          <h4>⚠️ 常见问题：</h4>
          <ul>
            <li>确保已安装并设置钱包应用</li>
            <li>检查网络连接是否稳定</li>
            <li>尝试刷新页面重新连接</li>
            <li>某些浏览器可能不兼容，建议使用钱包内置浏览器</li>
          </ul>
        </div>
      </div>

      <div class="guide-footer">
        <button @click="openAppKit" class="connect-btn">
          🔗 尝试连接钱包
        </button>
        <button @click="closeGuide" class="cancel-btn">
          关闭指南
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAppKit } from '@reown/appkit/vue'

export default {
  name: 'MobileWalletGuide',
  setup() {
    const showGuide = ref(false)
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

    const openGuide = () => {
      showGuide.value = true
    }

    const closeGuide = () => {
      showGuide.value = false
    }

    const openAppKit = () => {
      open()
      closeGuide()
    }

    // 自动检测显示指南
    onMounted(() => {
      // 如果是移动端且不在钱包浏览器中，且没有检测到ethereum对象
      if (isMobile.value && !isWalletBrowser.value && !(window as any).ethereum) {
        // 延迟显示，给页面加载一些时间
        setTimeout(() => {
          if (!(window as any).ethereum) {
            showGuide.value = true
          }
        }, 2000)
      }
    })

    return {
      showGuide,
      isMobile,
      isWalletBrowser,
      openGuide,
      closeGuide,
      openAppKit
    }
  }
}
</script>

<style scoped>
.mobile-wallet-guide {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-lg);
}

.guide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
}

.guide-content {
  position: relative;
  background: var(--background-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  border: 1px solid var(--border-light);
}

.guide-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-xl);
  border-bottom: 1px solid var(--border-light);
}

.guide-header h3 {
  margin: 0;
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
}

.close-btn {
  background: none;
  border: none;
  font-size: var(--text-2xl);
  cursor: pointer;
  color: var(--text-secondary);
  padding: var(--space-xs);
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
}

.close-btn:hover {
  background: var(--background-secondary);
  color: var(--text-primary);
}

.guide-body {
  padding: var(--space-xl);
}

.connection-options {
  margin-bottom: var(--space-xl);
}

.option {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  padding: var(--space-lg);
  background: var(--background-secondary);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-md);
  border: 1px solid var(--border-light);
}

.option-icon {
  font-size: var(--text-2xl);
  flex-shrink: 0;
}

.option-content h4 {
  margin: 0 0 var(--space-xs) 0;
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
}

.option-content p {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--text-sm);
  line-height: 1.5;
}

.wallet-apps {
  margin-bottom: var(--space-xl);
}

.wallet-apps h4 {
  margin: 0 0 var(--space-md) 0;
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
}

.wallet-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--space-sm);
}

.wallet-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-md);
  background: var(--background-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
  font-size: var(--text-sm);
  text-align: center;
}

.wallet-icon {
  font-size: var(--text-xl);
  margin-bottom: var(--space-xs);
}

.troubleshooting h4 {
  margin: 0 0 var(--space-md) 0;
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
}

.troubleshooting ul {
  margin: 0;
  padding-left: var(--space-lg);
  color: var(--text-secondary);
  font-size: var(--text-sm);
  line-height: 1.6;
}

.troubleshooting li {
  margin-bottom: var(--space-xs);
}

.guide-footer {
  display: flex;
  gap: var(--space-md);
  padding: var(--space-xl);
  border-top: 1px solid var(--border-light);
  background: var(--background-secondary);
  border-radius: 0 0 var(--radius-xl) var(--radius-xl);
}

.connect-btn, .cancel-btn {
  flex: 1;
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-lg);
  font-size: var(--text-md);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--transition-normal);
  border: none;
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

.cancel-btn {
  background: var(--background-primary);
  color: var(--text-secondary);
  border: 1px solid var(--border-medium);
}

.cancel-btn:hover {
  background: var(--background-secondary);
  color: var(--text-primary);
}

/* 移动端优化 */
@media (max-width: 480px) {
  .mobile-wallet-guide {
    padding: var(--space-md);
  }

  .guide-content {
    max-height: 90vh;
  }

  .guide-header, .guide-body, .guide-footer {
    padding: var(--space-lg);
  }

  .wallet-list {
    grid-template-columns: repeat(2, 1fr);
  }

  .guide-footer {
    flex-direction: column;
  }
}

/* 深色主题适配 */
@media (prefers-color-scheme: dark) {
  .guide-overlay {
    background: rgba(0, 0, 0, 0.7);
  }
}
</style>
