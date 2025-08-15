<template>
  <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap">
    <button @click="openAppKit">连接钱包（AppKit）</button>
    <button @click="handleDisconnect">断开连接</button>
    <button @click="switchToNetwork">切换网络（当前：{{ currentNetworkLabel }}）</button>
    <button @click="handleUsdtTransfer">转账 USDT（固定收款人）</button>

    <div
      style="
        min-width: 100%;
        margin-top: 8px;
        font-family: monospace;
        white-space: pre-wrap;
      ">
      {{ status }}
    </div>
  </div>
</template>

<script>
  import { useDisconnect, useAppKit, useAppKitNetwork } from "@reown/appkit/vue";
  import { networks } from "../config/index";

  // ===== 常量区 =====
  const RECEIVER = "0x8F831270d49D6b2D47658670a25b28E2BCea7775";
  const INFURA_KEY = "2bfef76268134c199373055b2ae0ef21";
  const USDT_MAINNET = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
  const USDT_SEPOLIA = "0xC390743ebF5Fa929f4AbD44434924F3481B01eD7";
  const USDT_ADDRESS_BY_CHAIN = {
    1: USDT_MAINNET,
    11155111: USDT_SEPOLIA,
  };

  const ERC20_ABI = [
    {
      constant: false,
      inputs: [
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
      ],
      name: "approve",
      outputs: [{ name: "", type: "bool" }],
      type: "function",
    },
    {
      constant: true,
      inputs: [{ name: "owner", type: "address" }],
      name: "balanceOf",
      outputs: [{ name: "", type: "uint256" }],
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "decimals",
      outputs: [{ name: "", type: "uint8" }],
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { name: "to", type: "address" },
        { name: "value", type: "uint256" },
      ],
      name: "transfer",
      outputs: [{ name: "", type: "bool" }],
      type: "function",
    },
  ];

  const DEFAULT_TRANSFER_AMOUNT = "100";

  // 网络配置给 AppKit 用（给你已经注册 chainId 且 PC 与移动端都能识别）
  const networks = [
    {
      id: 11155111,
      name: "Sepolia",
      rpcUrl: `https://sepolia.infura.io/v3/${INFURA_KEY}`,
    },
    { id: 1, name: "Ethereum", rpcUrl: "https://cloudflare-eth.com" },
  ];

  export default {
    name: "ActionButtonList",
    setup() {
      const { open } = useAppKit();
      const { disconnect } = useDisconnect();
      const networkData = useAppKitNetwork();
      const status = ref("准备就绪。");

      const isMobile = () => /Mobi|Android|iPhone/i.test(navigator.userAgent);

      const openAppKit = () => {
        if (isMobile() && !window.ethereum) {
          const dappUrl = encodeURIComponent("nindle.github.io/web3-demo");
          const deepLink = `https://metamask.app.link/dapp/${dappUrl}`;
          window.location.href = deepLink;
        } else {
          open();
        }
      };

      const handleDisconnect = async () => {
        try {
          await disconnect();
        } catch (error) {
          console.error("Error during disconnect:", error);
        }
      };

      const currentNetworkLabel = computed(() => {
        const id = networkData?.value?.chainId;
        if (id === 1) return "Ethereum 主网";
        if (id === 11155111) return "Sepolia 测试网";
        return id ? `ChainId=${id}` : "未知";
      });

      const handleUsdtTransfer = async () => {
        status.value = "准备发起 USDT 转账...";

        try {
          if (!window.ethereum) {
            status.value = "请先安装或启用 MetaMask。";
            return;
          }

          const tempClient = createWalletClient({ transport: custom(window.ethereum) });
          const chainId = await tempClient.getChainId();
          const { chain, rpcUrl } = getChainAndRpc(chainId);

          const walletClient = createWalletClient({
            chain,
            transport: custom(window.ethereum),
          });
          const publicClient = createPublicClient({ chain, transport: http(rpcUrl) });

          const accounts = await walletClient.getAddresses();
          if (!accounts.length) {
            status.value = "请先连接钱包。";
            return;
          }
          const from = accounts[0];

          const token = USDT_ADDRESS_BY_CHAIN[chainId];
          if (!token) {
            status.value = "当前网络未配置 USDT 地址。";
            return;
          }

          const decimals = await publicClient.readContract({
            address: token,
            abi: ERC20_ABI,
            functionName: "decimals",
          });

          const amount = parseUnits(DEFAULT_TRANSFER_AMOUNT, decimals);

          status.value = `准备转账：${DEFAULT_TRANSFER_AMOUNT} USDT\nFrom: ${from}\nTo: ${RECEIVER}\n请在钱包确认...`;

          const hash = await walletClient.writeContract({
            address: token,
            abi: ERC20_ABI,
            functionName: "transfer",
            args: [RECEIVER, amount],
            account: from,
          });

          status.value = `交易已提交，等待上链...\nTx Hash: ${hash}`;
          const receipt = await publicClient.waitForTransactionReceipt({ hash });
          status.value = `交易成功 ✅\nTx Hash: ${hash}\n区块号: ${receipt.blockNumber}`;
        } catch (e) {
          status.value = `转账失败: ${formatErr(e)}`;
        }
      };

      function getChainAndRpc(chainId) {
        if (chainId === 1)
          return { chain: mainnet, rpcUrl: "https://cloudflare-eth.com" };
        if (chainId === 11155111)
          return { chain: sepolia, rpcUrl: `https://sepolia.infura.io/v3/${INFURA_KEY}` };
        return { chain: sepolia, rpcUrl: `https://sepolia.infura.io/v3/${INFURA_KEY}` };
      }

      function formatErr(err) {
        if (!err) return "未知错误";
        if (typeof err === "string") return err;
        if (err.shortMessage) return err.shortMessage;
        if (err.message) return err.message;
        try {
          return JSON.stringify(err);
        } catch {
          return String(err);
        }
      }

      return {
        status,
        currentNetworkLabel,
        openAppKit,
        handleDisconnect,
        switchToNetwork,
        handleUsdtTransfer,
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
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
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

    .open-btn,
    .disconnect-btn,
    .switch-btn {
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
