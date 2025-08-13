
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
  useAppKit 
} from '@reown/appkit/vue'
import {ethersAdapter , networks, projectId } from './config/index'

import ActionButtonList from "./components/ActionButton.vue"
import InfoList from "./components/InfoList.vue";

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
  projectId: 'f4947d13ddbff0d4dddc5a731c63b6d5',
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
    InfoList
  },
};
</script>