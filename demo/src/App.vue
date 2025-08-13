
<template>
  <div class="pages">
      <img src="/reown.svg" alt="Reown" width="150" height="150" />
      <h1>AppKit ethers vue Example</h1>

      <appkit-button />
      <ActionButtonList />
      <div className="advice">
        <p>
          123 <br/>
          Go to <a href="https://cloud.reown.com" target="_blank" className="link-button" rel="Reown Cloud">Reown Cloud</a> to get your own.
        </p>
      </div>
      <InfoList />
   </div>
</template>


<script lang="ts">
import {
  createAppKit,
} from '@reown/appkit/vue'
import {ethersAdapter , networks, projectId } from './config/index'

import ActionButtonList from "./components/ActionButton.vue"
import InfoList from "./components/InfoList.vue";

// Initialize AppKit
createAppKit({
  adapters: [ethersAdapter],
  networks,
  projectId,
  themeMode: 'light',
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
    email: false, // 禁用邮箱登录，专注钱包连接
    socials: false // 禁用社交登录
  },
  themeVariables: {
    '--w3m-accent': '#000000',
  },
  // 移动端钱包连接优化配置
  enableWalletConnect: true,
  enableInjected: true,
  enableEIP6963: true,
  enableCoinbase: true
})

export default {
  name: "App",
  components: {
    ActionButtonList,
    InfoList
  },
};
</script>