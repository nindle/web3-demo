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
/* =============================================================================
   操作按钮组件 - 现代化设计
   ============================================================================= */

.action-buttons {
  display: flex;
  gap: var(--space-md);
  justify-content: center;
  flex-wrap: wrap;
  padding: var(--space-sm) 0;
}

.action-btn {
  padding: var(--space-md) var(--space-xl);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-md);
  background: var(--background-glass);
  backdrop-filter: blur(15px) saturate(180%);
  color: var(--text-primary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--transition-normal);
  min-width: 130px;
  min-height: 44px;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  text-transform: none;
  letter-spacing: 0.025em;
}

.action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.6s ease;
}

.action-btn:hover {
  border-color: var(--primary-600);
  background: rgba(255, 255, 255, 0.95);
  transform: translateY(-2px) scale(1.02);
  box-shadow: var(--shadow-lg);
}

.action-btn:hover::before {
  left: 100%;
}

.action-btn:active {
  transform: translateY(-1px) scale(1.01);
  transition: transform 0.1s ease;
}

.open-btn {
  background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
  border-color: var(--primary-600);
  color: var(--text-inverse);
  box-shadow: var(--shadow-sm), 0 0 15px rgba(0, 122, 255, 0.2);
}

.open-btn:hover {
  background: linear-gradient(135deg, var(--primary-700), #004099);
  border-color: var(--primary-700);
  box-shadow: var(--shadow-lg), 0 0 20px rgba(0, 122, 255, 0.3);
}

.disconnect-btn {
  background: linear-gradient(135deg, var(--error-500), var(--error-600));
  border-color: var(--error-500);
  color: var(--text-inverse);
  box-shadow: var(--shadow-sm), 0 0 15px rgba(255, 59, 48, 0.2);
}

.disconnect-btn:hover {
  background: linear-gradient(135deg, var(--error-600), #b71c1c);
  border-color: var(--error-600);
  box-shadow: var(--shadow-lg), 0 0 20px rgba(255, 59, 48, 0.3);
}

.switch-btn {
  background: linear-gradient(135deg, var(--success-500), var(--success-600));
  border-color: var(--success-500);
  color: var(--text-inverse);
  box-shadow: var(--shadow-sm), 0 0 15px rgba(52, 199, 89, 0.2);
}

.switch-btn:hover {
  background: linear-gradient(135deg, var(--success-600), #1e7d32);
  border-color: var(--success-600);
  box-shadow: var(--shadow-lg), 0 0 20px rgba(52, 199, 89, 0.3);
}

/* 平板端优化 */
@media (max-width: 992px) {
  .action-buttons {
    gap: var(--space-sm);
    max-width: 400px;
    margin: 0 auto;
  }

  .action-btn {
    min-width: 110px;
    padding: var(--space-sm) var(--space-lg);
  }
}

/* 移动端优化 */
@media (max-width: 767px) {
  .action-buttons {
    gap: var(--space-sm);
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    max-width: 350px;
    margin: 0 auto;
    padding: var(--space-md) 0;
  }

  .action-btn {
    flex: 1;
    min-width: unset;
    padding: var(--space-md) var(--space-sm);
    font-size: var(--text-xs);
    min-height: 40px;
    border-radius: var(--radius-sm);
  }

  .action-btn:hover {
    transform: translateY(-1px) scale(1.01);
  }
}

/* 超小屏幕堆叠 */
@media (max-width: 380px) {
  .action-buttons {
    flex-direction: column;
    gap: var(--space-sm);
    max-width: 280px;
  }

  .action-btn {
    width: 100%;
    min-width: unset;
    padding: var(--space-lg) var(--space-xl);
    font-size: var(--text-sm);
    min-height: 48px;
  }
}

/* 横屏手机优化 */
@media screen and (max-width: 768px) and (orientation: landscape) and (max-height: 500px) {
  .action-buttons {
    gap: var(--space-xs);
    padding: var(--space-xs) 0;
  }

  .action-btn {
    min-height: 36px;
    padding: var(--space-sm) var(--space-md);
    font-size: 11px;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .action-btn {
    border-width: 2px;
  }

  .open-btn, .disconnect-btn, .switch-btn {
    border-color: currentColor;
  }
}

/* 减少动画模式 */
@media (prefers-reduced-motion: reduce) {
  .action-btn {
    transition: none;
  }

  .action-btn::before {
    display: none;
  }

  .action-btn:hover {
    transform: none;
  }
}
</style>
