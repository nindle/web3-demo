<template>
  <div class="action-buttons">
    <button @click="openAppKit" class="action-btn open-btn">🔗 打开钱包</button>
    <button @click="handleDisconnect" class="action-btn disconnect-btn">❌ 断开连接</button>
    <button @click="switchToNetwork" class="action-btn switch-btn">🔄 切换网络</button>
  </div>
</template>

<script>
import { useDisconnect, useAppKit, useAppKitNetwork } from "@reown/appkit/vue";
import { networks } from "../config/index";

export default {
  name: "ActionButtonList",
  setup() {
    const { disconnect } = useDisconnect();
    const { open } = useAppKit();
    const networkData = useAppKitNetwork();

    const openAppKit = () => open();
    const switchToNetwork = () => networkData.value.switchNetwork(networks[1]);
    const handleDisconnect = async () => {
        try {
          await disconnect();
        } catch (error) {
          console.error("Error during disconnect:", error);
        }
    };


    return {
      handleDisconnect,
      openAppKit,
      switchToNetwork,
    };
  },
};
</script>

<style scoped>
.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  padding: 10px 20px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  color: #2c3e50;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  min-width: 120px;
  position: relative;
  overflow: hidden;
}

.action-btn:hover {
  border-color: rgba(52, 152, 219, 0.3);
  background: rgba(255, 255, 255, 0.95);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.action-btn:active {
  transform: translateY(0);
  transition: transform 0.05s ease;
}

.open-btn {
  background: #007aff;
  border-color: #007aff;
  color: white;
}

.open-btn:hover {
  background: #0056cc;
  border-color: #0056cc;
}

.disconnect-btn {
  background: #ff3b30;
  border-color: #ff3b30;
  color: white;
}

.disconnect-btn:hover {
  background: #d70015;
  border-color: #d70015;
}

.switch-btn {
  background: #34c759;
  border-color: #34c759;
  color: white;
}

.switch-btn:hover {
  background: #248a3d;
  border-color: #248a3d;
}

/* 移动端优化 */
@media (max-width: 767px) {
  .action-buttons {
    gap: 8px;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    max-width: 320px;
    margin: 0 auto;
  }

  .action-btn {
    flex: 1;
    min-width: unset;
    padding: 12px 8px;
    font-size: 13px;
  }
}

/* 超小屏幕堆叠 */
@media (max-width: 350px) {
  .action-buttons {
    flex-direction: column;
    gap: 8px;
  }

  .action-btn {
    width: 100%;
  }
}
</style>
