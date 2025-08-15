
<template>
    <div class="pages">
      <header class="app-header">
        <h1>Web3 Demo - 测试网络合约交互</h1>
        <appkit-button />
        <ActionButtonList />
      </header>

      <main class="app-main">
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
    socials: false // 禁用社交登录
  },
  themeVariables: {
    '--w3m-accent': '#000000',
  },
})

const modal = useAppKit();

export default {
  name: "App",
  components: {
    ActionButtonList,
    InfoList,
    TransferComponent,
    ContractInteraction,
    TokenBalanceView
  },
  methods: {
    handleTokenSelected(token: any) {
      // 这里可以处理选中的代币，例如自动填充转账表单
      console.log('选中的代币:', token)
    }
  }
};
</script>

<style scoped>
/* =============================================================================
   设计系统：极简金融美学
   ============================================================================= */

.pages {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fA 0%, #e9ecef 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: #2c3e50;
  font-feature-settings: 'kern' 1, 'liga' 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app-header {
  position: relative;
  background: linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(248,249,250,0.9) 100%);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0,0,0,0.08);
  padding: clamp(32px, 5vw, 64px) 0 clamp(24px, 3vw, 40px);
}

.app-header h1 {
  font-size: clamp(28px, 5vw, 42px);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin: 0 0 clamp(24px, 4vw, 32px) 0;
  text-align: center;
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.app-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: clamp(24px, 4vw, 48px) clamp(16px, 4vw, 24px) clamp(48px, 6vw, 96px);
}

.balance-section {
  margin-bottom: clamp(32px, 5vw, 56px);
}

.functions-grid {
  display: grid;
  gap: clamp(24px, 4vw, 32px);
}

/* 为钱包按钮容器添加样式 */
.app-header :deep(appkit-button) {
  display: flex;
  justify-content: center;
  margin-bottom: clamp(16px, 3vw, 24px);
}

/* 全局卡片设计 */
:deep(.token-balance-container),
:deep(.transfer-container),
:deep(.contract-container) {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  transition: all 0.2s ease;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.04),
    0 1px 3px rgba(0, 0, 0, 0.08);
}

:deep(.token-balance-container:hover),
:deep(.transfer-container:hover),
:deep(.contract-container:hover) {
  border-color: rgba(52, 152, 219, 0.2);
  box-shadow:
    0 8px 25px rgba(0, 0, 0, 0.08),
    0 3px 10px rgba(52, 152, 219, 0.1);
  transform: translateY(-2px);
}

/* 响应式网格 */
@media (min-width: 768px) {
  .functions-grid {
    grid-template-columns: 1fr 1fr;
    gap: clamp(32px, 5vw, 48px);
  }
}

/* 滚动条设计 */
:deep(*::-webkit-scrollbar) {
  width: 8px;
  height: 8px;
}

:deep(*::-webkit-scrollbar-track) {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

:deep(*::-webkit-scrollbar-thumb) {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  transition: background 0.2s ease;
}

:deep(*::-webkit-scrollbar-thumb:hover) {
  background: rgba(0, 0, 0, 0.3);
}

/* 移动端优化 */
@media (max-width: 767px) {
  .app-header {
    padding: 24px 0 20px;
  }

  .app-main {
    padding: 24px 16px 48px;
  }

  .functions-grid {
    gap: 20px;
  }
}

/* 高分辨率屏幕优化 */
@media (-webkit-min-device-pixel-ratio: 2) {
  .pages {
    text-rendering: optimizeLegibility;
  }
}
</style>