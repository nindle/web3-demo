
<template>
    <div class="pages">
      <header class="app-header">
        <h1>Web3 Demo - 测试网络合约交互</h1>
        <div class="appkit-button-container">
          <appkit-button />
        </div>
        <ActionButtonList />
      </header>

      <main class="app-main">
        <!-- 钱包连接状态 -->
        <WalletConnectionStatus @open-mobile-guide="openMobileGuide" />

        <!-- 代币余额查看 -->
        <section class="balance-section">
          <TokenBalanceView @token-selected="handleTokenSelected" />
        </section>

        <!-- 功能区域 -->
        <div class="functions-grid">
          <!-- 转账功能 -->
          <section class="transfer-section">
            <TransferComponent />
          </section>

          <!-- 高级合约交互 -->
          <section class="contract-section">
            <ContractInteraction />
          </section>
        </div>
      </main>

      <!-- 移动端钱包连接指南 -->
      <MobileWalletGuide ref="mobileGuide" />
   </div>
</template>


<script lang="ts">
import {
  createAppKit,
  useAppKit
} from '@reown/appkit/vue'
import {ethersAdapter , networks, projectId } from './config/index'

import ActionButtonList from "./components/ActionButton.vue"
import InfoList from "./components/InfoList.vue"
import TransferComponent from "./components/TransferComponent.vue"
import ContractInteraction from "./components/ContractInteraction.vue"
import TokenBalanceView from "./components/TokenBalanceView.vue"
import MobileWalletGuide from "./components/MobileWalletGuide.vue"
import WalletConnectionStatus from "./components/WalletConnectionStatus.vue"

const metadata = {
  name: "Web3 Demo",
  description: "Web3 Demo",
  url: "https://nindle.github.io/web3-demo", // url must match your domain & subdomain
  icons: ["https://avatars.mywebsite.com/"],
};

// Initialize AppKit
createAppKit({
  adapters: [ethersAdapter],
  networks,
  projectId: projectId,
  metadata,
  themeMode: 'light',
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
    email: false, // 禁用邮箱登录，专注钱包连接
    socials: false, // 禁用社交登录
    swaps: false,
    onramp: false
  },
  themeVariables: {
    '--w3m-accent': '#000000',
  },
  // 添加移动端支持配置
  includeWalletIds: [
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
    '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0', // Trust Wallet
    'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa', // Coinbase Wallet
    '1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369', // Rainbow
    '19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927', // Ledger Live
  ],
  // 启用所有连接器
  enableWalletConnect: true,
  enableInjected: true,
  enableEIP6963: true,
  enableCoinbase: true
})

const modal = useAppKit();

export default {
  name: "App",
  components: {
    ActionButtonList,
    InfoList,
    TransferComponent,
    ContractInteraction,
    TokenBalanceView,
    MobileWalletGuide,
    WalletConnectionStatus
  },
  methods: {
    handleTokenSelected(token: any) {
      // 这里可以处理选中的代币，例如自动填充转账表单
      console.log('选中的代币:', token)
    },
    openMobileGuide() {
      // 打开移动端钱包连接指南
      if (this.$refs.mobileGuide && typeof (this.$refs.mobileGuide as any).openGuide === 'function') {
        (this.$refs.mobileGuide as any).openGuide()
      }
    }
  }
};
</script>

<style scoped>
/* =============================================================================
   Web3 钱包 Demo - 主布局样式
   ============================================================================= */

.pages {
  min-height: 100vh;
  background:
    radial-gradient(circle at 25% 25%, rgba(0, 122, 255, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(52, 199, 89, 0.03) 0%, transparent 50%),
    linear-gradient(135deg, var(--background-secondary) 0%, var(--background-primary) 100%);
  position: relative;
  overflow-x: hidden;
}

.pages::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 135, 0, 0.08) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

/* 头部区域 */
.app-header {
  background: var(--background-overlay);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-light);
  padding: var(--space-3xl) var(--space-lg) var(--space-2xl);
  box-shadow: var(--shadow-sm);
}
.appkit-button-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 钱包连接按钮样式增强 */
.appkit-button-container :deep(w3m-button) {
  border-radius: var(--radius-lg) !important;
  background: linear-gradient(135deg, var(--primary-600), var(--primary-700)) !important;
  box-shadow: var(--shadow-md), 0 0 20px rgba(0, 122, 255, 0.2) !important;
  transition: all var(--transition-normal) !important;
  backdrop-filter: blur(15px) !important;
}

.appkit-button-container :deep(w3m-button:hover) {
  transform: translateY(-2px) scale(1.02) !important;
  box-shadow: var(--shadow-lg), 0 0 25px rgba(0, 122, 255, 0.3) !important;
}

.app-header h1 {
  font-size: clamp(var(--text-2xl), 5vw, var(--text-4xl));
  font-weight: var(--font-bold);
  letter-spacing: -0.025em;
  line-height: 1.1;
  margin: 0 0 var(--space-2xl) 0;
  text-align: center;
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 50%, var(--success-500) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
}

.app-header h1::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-600), var(--success-500));
  border-radius: var(--radius-full);
  opacity: 0.6;
}

/* 钱包连接按钮容器 */
.app-header :deep(appkit-button) {
  display: flex;
  justify-content: center;
  margin-bottom: var(--space-xl);
  position: relative;
  z-index: 1;
}

/* 主内容区域 */
.app-main {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--space-3xl) var(--space-lg) var(--space-3xl);
  position: relative;
  z-index: 1;
}

/* 余额展示区域 */
.balance-section {
  margin-bottom: var(--space-3xl);
  position: relative;
}

.balance-section::before {
  content: '';
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  background: linear-gradient(45deg, transparent, rgba(0, 122, 255, 0.02), transparent);
  border-radius: var(--radius-2xl);
  pointer-events: none;
  z-index: -1;
}

/* 功能网格布局 */
.functions-grid {
  display: grid;
  gap: var(--space-2xl);
  grid-template-columns: 1fr;
  position: relative;
}

/* 中等屏幕：并排两列 */
@media (min-width: 768px) {
  .functions-grid {
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: var(--space-3xl);
  }
}

/* 大屏幕：更大间距 */
@media (min-width: 1200px) {
  .functions-grid {
    gap: clamp(var(--space-3xl), 4vw, 4rem);
  }

  .app-main {
    padding: var(--space-3xl) var(--space-2xl) var(--space-3xl);
  }
}

/* 全局卡片设计系统 */
:deep(.token-balance-container),
:deep(.transfer-container),
:deep(.contract-container) {
  background: var(--background-glass);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
}

/* 卡片悬停效果 */
:deep(.token-balance-container:hover),
:deep(.transfer-container:hover),
:deep(.contract-container:hover) {
  border-color: rgba(0, 122, 255, 0.2);
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px) scale(1.01);
}

/* 卡片内容保护层 */
:deep(.token-balance-container::before),
:deep(.transfer-container::before),
:deep(.contract-container::before) {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 122, 255, 0.3), transparent);
  pointer-events: none;
}

/* 响应式适配 */
@media (max-width: 767px) {
  .app-header {
    padding: var(--space-2xl) var(--space-lg) var(--space-xl);
    position: relative; /* 移动端不使用粘性定位 */
  }

  .app-header h1 {
    font-size: var(--text-2xl);
    margin-bottom: var(--space-xl);
  }

  .app-main {
    padding: var(--space-2xl) var(--space-lg) var(--space-3xl);
  }

  .balance-section {
    margin-bottom: var(--space-2xl);
  }

  .functions-grid {
    gap: var(--space-xl);
  }

  /* 移动端卡片优化 */
  :deep(.token-balance-container),
  :deep(.transfer-container),
  :deep(.contract-container) {
    border-radius: var(--radius-lg);
  }

  :deep(.token-balance-container:hover),
  :deep(.transfer-container:hover),
  :deep(.contract-container:hover) {
    transform: translateY(-2px) scale(1.005);
  }
}

/* 超小屏幕适配 */
@media (max-width: 480px) {
  .app-header {
    padding: var(--space-xl) var(--space-md) var(--space-lg);
  }

  .app-main {
    padding: var(--space-xl) var(--space-md) var(--space-2xl);
  }

  .functions-grid {
    gap: var(--space-lg);
  }
}

/* 动效增强 */
@media (prefers-reduced-motion: no-preference) {
  .pages {
    animation: fadeIn 0.6s ease-out;
  }

  .balance-section,
  .functions-grid > * {
    animation: slideUp 0.5s ease-out;
  }

  .functions-grid > *:nth-child(2) {
    animation-delay: 0.1s;
  }
}

/* 高对比度和可访问性 */
@media (prefers-contrast: high) {
  :deep(.token-balance-container),
  :deep(.transfer-container),
  :deep(.contract-container) {
    border-color: var(--border-strong);
    background: var(--background-primary);
  }
}

/* 深色主题优化 */
@media (prefers-color-scheme: dark) {
  .pages::before {
    opacity: 0.7;
  }

  .app-header {
    border-bottom-color: var(--border-medium);
  }

  :deep(.token-balance-container),
  :deep(.transfer-container),
  :deep(.contract-container) {
    backdrop-filter: blur(20px) saturate(180%) brightness(1.2);
  }
}

/* 打印样式 */
@media print {
  .pages {
    background: white;
  }

  .app-header {
    position: static;
    background: white;
    border-bottom: 2px solid #000;
  }

  :deep(.token-balance-container),
  :deep(.transfer-container),
  :deep(.contract-container) {
    background: white;
    border: 2px solid #000;
    box-shadow: none;
    break-inside: avoid;
  }
}

/* 横屏模式优化 */
@media screen and (orientation: landscape) and (max-height: 500px) {
  .app-header {
    padding: var(--space-lg) var(--space-lg) var(--space-md);
  }

  .app-header h1 {
    font-size: var(--text-xl);
    margin-bottom: var(--space-md);
  }

  .app-main {
    padding: var(--space-lg);
  }
}
</style>