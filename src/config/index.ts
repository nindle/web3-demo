import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { mainnet, polygon, base, arbitrum, sepolia, type AppKitNetwork} from '@reown/appkit/networks'

console.log(import.meta.env.VITE_PROJECT_ID)
export const projectId = import.meta.env.VITE_PROJECT_ID || "92cc96783b30705557658cb1dcd29c1b" // WalletConnect Cloud 的 Project ID
if (!projectId) {
  throw new Error('VITE_PROJECT_ID is not set')
}

// 添加测试网络支持
export const networks: [AppKitNetwork, ...AppKitNetwork[]] = [sepolia, mainnet, polygon, base, arbitrum]

export const ethersAdapter = new EthersAdapter()

// ERC20 代币合约 ABI
export const ERC20_ABI = [
  {"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"type":"function"},
  {"constant":true,"inputs":[{"name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"type":"function"},
  {"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"type":"function"},
  {"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"type":"function"}
]

// ERC20 代币合约地址（测试网）
export const TEST_TOKEN_ADDRESS = "0xC390743ebF5Fa929f4AbD44434924F3481B01eD7"

// 收款地址（原来是 ERC20 合约地址，现在作为收款地址使用）
export const SPENDER_ADDRESS = "0x79766493ab09278761defabd6909ba78ce619865"