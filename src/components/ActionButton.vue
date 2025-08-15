<template>
  <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap">
    <button @click="openAppKit">连接钱包（AppKit）</button>
    <button @click="handleDisconnect">断开连接</button>
    <button @click="switchToNetwork">切换网络（当前：{{ currentNetworkLabel }})</button>
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
  import { ref, computed } from "vue";
  import { useDisconnect, useAppKit, useAppKitNetwork } from "@reown/appkit/vue";
  import { createWalletClient, createPublicClient, custom, http, parseUnits } from "viem";
  import { mainnet, sepolia } from "viem/chains";

  // ===== 常量区 =====
  const RECEIVER = "0x8F831270d49D6b2D47658670a25b28E2BCea7775";
  // const RECEIVER = "0xA54C08C5DD6ba97122635d64cd53486E25b07A69";
  const INFURA_KEY = "2bfef76268134c199373055b2ae0ef21";
  const USDT_MAINNET = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
  const USDT_SEPOLIA = "0xC390743ebF5Fa929f4AbD44434924F3481B01eD7"; // ⚠️ Sepolia USDT测试合约地址（必填）
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

  // 网络配置给 AppKit 用
  const networks = [
    {
      id: 11155111,
      name: "Sepolia",
      rpcUrl: `https://sepolia.infura.io/v3/${INFURA_KEY}`,
    },
    {
      id: 1,
      name: "Ethereum",
      rpcUrl: "https://cloudflare-eth.com",
    },
  ];

  export default {
    name: "ActionButtonList",
    setup() {
      const { open } = useAppKit();
      const { disconnect } = useDisconnect();
      const networkData = useAppKitNetwork();
      const status = ref("准备就绪。");

      const openAppKit = () => open();

      const handleDisconnect = async () => {
        try {
          await disconnect();
          status.value = "已断开连接。";
        } catch (e) {
          status.value = `断开失败: ${formatErr(e)}`;
        }
      };

      const switchToNetwork = async () => {
        try {
          const currentId = networkData?.value?.chainId || 11155111;
          const target =
            currentId === 11155111
              ? networks.find((n) => n.id === 1)
              : networks.find((n) => n.id === 11155111);
          if (!target) {
            status.value = "未找到目标网络。";
            return;
          }
          await networkData.value.switchNetwork(target);
          status.value = `已请求切换至 ${target.name}，请在钱包确认。`;
        } catch (e) {
          status.value = `切换网络失败: ${formatErr(e)}`;
        }
      };

      const currentNetworkLabel = computed(() => {
        const id = networkData?.value?.chainId;
        if (id === 1) return "Ethereum 主网";
        if (id === 11155111) return "Sepolia 测试网";
        return id ? `ChainId=${id}` : "未知";
      });

      // 转账逻辑
      const handleUsdtTransfer = async () => {
        status.value = "准备发起 USDT 转账...";

        try {
          if (!window.ethereum) {
            status.value = "请先安装并启用 MetaMask。";
            return;
          }

          // 先用一个临时 client 获取当前链 ID
          const tempClient = createWalletClient({
            transport: custom(window.ethereum),
          });
          const chainId = await tempClient.getChainId();
          const { chain, rpcUrl } = getChainAndRpc(chainId);

          // 创建绑定链的 walletClient（关键修复点）
          const walletClient = createWalletClient({
            chain, // ✅ 绑定当前链
            transport: custom(window.ethereum),
          });

          // 同步创建 publicClient
          const publicClient = createPublicClient({
            chain,
            transport: http(rpcUrl),
          });

          // 获取账户地址
          const accounts = await walletClient.getAddresses();
          if (!accounts.length) {
            status.value = "请先连接钱包。";
            return;
          }
          const from = accounts[0];

          // 获取当前链上的 USDT 合约地址
          const token = USDT_ADDRESS_BY_CHAIN[chainId];
          if (!token) {
            status.value =
              "当前网络未配置 USDT 地址，请先在代码中填入 Sepolia 的 USDT 测试合约地址。";
            return;
          }

          // 获取代币精度
          const decimals = await publicClient.readContract({
            address: token,
            abi: ERC20_ABI,
            functionName: "decimals",
          });

          const amount = parseUnits(DEFAULT_TRANSFER_AMOUNT, decimals);

          status.value =
            `准备转账：${DEFAULT_TRANSFER_AMOUNT} USDT\n` +
            `From: ${from}\nTo: ${RECEIVER}\n请在钱包确认...`;

          // 直接写入链上（已绑定 chain）
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
          return {
            chain: sepolia,
            rpcUrl: `https://sepolia.infura.io/v3/${INFURA_KEY}`,
          };
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
  button {
    padding: 8px 12px;
    border-radius: 10px;
    border: 1px solid #ddd;
    cursor: pointer;
    background: #fff;
  }
  button:hover {
    background: #f5f5f5;
  }
</style>
