<template>
  <div class="contract-container">
    <h2>🔧 智能合约交互</h2>

    <!-- 预设合约示例 -->
    <div class="preset-contracts">
      <h3>📋 预设合约模板</h3>
      <div class="contract-examples">
        <button @click="loadTestTokenContract" class="example-btn">
          🪙 您的自定义 ERC20 代币
        </button>
        <button @click="loadSimpleStorageContract" class="example-btn">
          📦 简单存储合约模板
        </button>
      </div>
    </div>

    <!-- 合约配置区域 -->
    <div class="contract-config">
      <h3>合约配置</h3>
      <div class="input-group">
        <label>合约地址:</label>
        <input
          v-model="contractAddress"
          type="text"
          placeholder="0x..."
          class="address-input"
        />
      </div>
      <div class="input-group">
        <label>合约 ABI (JSON 格式):</label>
        <textarea
          v-model="contractABI"
          placeholder='[{"inputs": [], "name": "function_name", "type": "function"}]'
          class="abi-input"
          rows="6"
        ></textarea>
      </div>
      <button @click="parseContract" :disabled="!contractAddress || !contractABI" class="parse-btn">
        解析合约
      </button>
    </div>

    <!-- 合约方法显示 -->
    <div v-if="parsedMethods.length > 0" class="contract-methods">
      <h3>合约方法</h3>

      <!-- 只读方法 -->
      <div class="method-section">
        <h4>📖 只读方法 (View/Pure)</h4>
        <div v-for="method in readMethods" :key="method.name" class="method-card">
          <h5>{{ method.name }}</h5>
          <div v-if="method.inputs.length > 0" class="method-inputs">
            <div v-for="(input, index) in method.inputs" :key="index" class="input-group">
              <label>{{ input.name }} ({{ input.type }}):</label>
              <input
                v-model="methodParams[method.name][index]"
                :type="getInputType(input.type)"
                :placeholder="input.type"
                class="param-input"
              />
            </div>
          </div>
          <button @click="callReadMethod(method)" :disabled="loading" class="call-btn read-btn">
            {{ loading ? '调用中...' : '调用' }}
          </button>
          <div v-if="methodResults[method.name]" class="method-result">
            <strong>结果:</strong> {{ methodResults[method.name] }}
          </div>
        </div>
      </div>

      <!-- 写入方法 -->
      <div class="method-section">
        <h4>✍️ 写入方法 (Payable/NonPayable)</h4>
        <div v-for="method in writeMethods" :key="method.name" class="method-card">
          <h5>{{ method.name }}</h5>
          <div v-if="method.inputs.length > 0" class="method-inputs">
            <div v-for="(input, index) in method.inputs" :key="index" class="input-group">
              <label>{{ input.name }} ({{ input.type }}):</label>
              <input
                v-model="methodParams[method.name][index]"
                :type="getInputType(input.type)"
                :placeholder="input.type"
                class="param-input"
              />
            </div>
          </div>
          <div v-if="method.stateMutability === 'payable'" class="input-group">
            <label>发送 ETH 数量:</label>
            <input
              v-model="methodEthValue[method.name]"
              type="number"
              step="0.001"
              placeholder="0.0"
              class="param-input"
            />
          </div>
          <button @click="executeWriteMethod(method)" :disabled="loading" class="call-btn write-btn">
            {{ loading ? '执行中...' : '执行交易' }}
          </button>
          <div v-if="methodResults[method.name]" class="method-result">
            <strong>交易哈希:</strong>
            <a :href="getEtherscanUrl(methodResults[method.name])" target="_blank" class="tx-link">
              {{ methodResults[method.name] }}
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- 错误信息 -->
    <div v-if="error" class="error-message">
      <h3>❌ 错误</h3>
      <p>{{ error }}</p>
      <button @click="clearError" class="clear-btn">清除错误</button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed } from 'vue'
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/vue'
import { contractService } from '../services/contractService'
import { ERC20_ABI, TEST_TOKEN_ADDRESS } from '../config/index'

export interface ContractMethod {
  name: string
  type: string
  stateMutability: string
  inputs: any[]
  outputs: any[]
}

export default {
  name: 'ContractInteraction',
  setup() {
    const accountInfo = useAppKitAccount()
    const networkData = useAppKitNetwork()

    // 响应式数据
    const contractAddress = ref('')
    const contractABI = ref('')
    const parsedMethods = ref<ContractMethod[]>([])
    const methodParams = ref<Record<string, any[]>>({})
    const methodEthValue = ref<Record<string, string>>({})
    const methodResults = ref<Record<string, any>>({})
    const loading = ref(false)
    const error = ref('')

    // 计算属性
    const readMethods = computed(() =>
      parsedMethods.value.filter(m =>
        m.stateMutability === 'view' || m.stateMutability === 'pure'
      )
    )

    const writeMethods = computed(() =>
      parsedMethods.value.filter(m =>
        m.stateMutability === 'nonpayable' || m.stateMutability === 'payable'
      )
    )

    // 方法
    const clearError = () => {
      error.value = ''
    }

    const loadTestTokenContract = () => {
      contractAddress.value = TEST_TOKEN_ADDRESS
      contractABI.value = JSON.stringify(ERC20_ABI, null, 2)
      parseContract()
    }

    const loadSimpleStorageContract = () => {
      // 这是一个简单的存储合约示例 ABI
      const simpleStorageABI = [
        {
          "inputs": [],
          "name": "get",
          "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [{"internalType": "uint256", "name": "_value", "type": "uint256"}],
          "name": "set",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ]

      contractAddress.value = "0x..." // 用户需要填入实际的合约地址
      contractABI.value = JSON.stringify(simpleStorageABI, null, 2)
    }

    const parseContract = () => {
      clearError()

      try {
        const abi = JSON.parse(contractABI.value)

        // 提取所有函数
        const functions = abi.filter((item: any) => item.type === 'function')

        parsedMethods.value = functions.map((func: any) => ({
          name: func.name,
          type: func.type,
          stateMutability: func.stateMutability || 'nonpayable',
          inputs: func.inputs || [],
          outputs: func.outputs || []
        }))

        // 初始化参数存储
        functions.forEach((func: any) => {
          methodParams.value[func.name] = new Array(func.inputs?.length || 0).fill('')
          methodEthValue.value[func.name] = '0'
        })

        console.log('解析的合约方法:', parsedMethods.value)

      } catch (err: any) {
        error.value = `ABI 解析失败: ${err.message}`
      }
    }

    const getInputType = (solidityType: string): string => {
      if (solidityType.includes('uint') || solidityType.includes('int')) {
        return 'number'
      }
      if (solidityType === 'bool') {
        return 'checkbox'
      }
      return 'text'
    }

    const callReadMethod = async (method: ContractMethod) => {
      if (!accountInfo.value.isConnected) {
        error.value = '请先连接钱包'
        return
      }

      loading.value = true
      clearError()

      try {
        const abi = JSON.parse(contractABI.value)
        const params = methodParams.value[method.name] || []

        // 过滤掉空字符串参数
        const filteredParams = params.filter(p => p !== '')

        const result = await contractService.callContractMethod(
          contractAddress.value,
          abi,
          method.name,
          filteredParams
        )

        // 格式化结果显示
        if (typeof result === 'bigint') {
          methodResults.value[method.name] = result.toString()
        } else if (Array.isArray(result)) {
          methodResults.value[method.name] = result.map(r =>
            typeof r === 'bigint' ? r.toString() : r
          ).join(', ')
        } else {
          methodResults.value[method.name] = result.toString()
        }

      } catch (err: any) {
        error.value = `调用方法 ${method.name} 失败: ${err.message}`
        console.error('调用合约方法失败:', err)
      } finally {
        loading.value = false
      }
    }

    const executeWriteMethod = async (method: ContractMethod) => {
      if (!accountInfo.value.isConnected) {
        error.value = '请先连接钱包'
        return
      }

      loading.value = true
      clearError()

      try {
        const abi = JSON.parse(contractABI.value)
        const params = methodParams.value[method.name] || []

        // 过滤掉空字符串参数
        const filteredParams = params.filter(p => p !== '')

        const ethValue = method.stateMutability === 'payable'
          ? methodEthValue.value[method.name]
          : undefined

        const txHash = await contractService.executeContractMethod(
          contractAddress.value,
          abi,
          method.name,
          filteredParams,
          ethValue
        )

        methodResults.value[method.name] = txHash

      } catch (err: any) {
        error.value = `执行方法 ${method.name} 失败: ${err.message}`
        console.error('执行合约方法失败:', err)
      } finally {
        loading.value = false
      }
    }

    const getEtherscanUrl = (txHash: string) => {
      const networkId = networkData.value?.caipNetworkId
      if (networkId?.includes('11155111')) { // Sepolia
        return `https://sepolia.etherscan.io/tx/${txHash}`
      }
      return `https://etherscan.io/tx/${txHash}` // 默认主网
    }

    return {
      accountInfo,
      contractAddress,
      contractABI,
      parsedMethods,
      methodParams,
      methodEthValue,
      methodResults,
      loading,
      error,
      readMethods,
      writeMethods,
      clearError,
      loadTestTokenContract,
      loadSimpleStorageContract,
      parseContract,
      getInputType,
      callReadMethod,
      executeWriteMethod,
      getEtherscanUrl
    }
  }
}
</script>

<style scoped>
.contract-container {
  padding: 25px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  width: 100%;
  height: fit-content;
}

.preset-contracts {
  background: #e3f2fd;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.contract-examples {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.example-btn {
  background: #2196f3;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.example-btn:hover {
  background: #1976d2;
}

.contract-config {
  background: white;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
  border: 1px solid #eee;
}

.input-group {
  margin-bottom: 15px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

.address-input, .param-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.address-input {
  font-family: monospace;
}

.abi-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
  resize: vertical;
}

.parse-btn {
  background: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.parse-btn:hover:not(:disabled) {
  background: #45a049;
}

.parse-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.contract-methods {
  background: white;
  padding: 15px;
  border-radius: 6px;
  border: 1px solid #eee;
}

.method-section {
  margin-bottom: 25px;
}

.method-section h4 {
  color: #333;
  border-bottom: 2px solid #eee;
  padding-bottom: 5px;
}

.method-card {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 15px;
  border-left: 4px solid #007bff;
}

.method-card h5 {
  margin-top: 0;
  color: #495057;
  font-family: monospace;
}

.method-inputs {
  margin: 10px 0;
}

.param-input {
  margin-bottom: 8px;
}

.call-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 10px;
}

.read-btn {
  background: #17a2b8;
  color: white;
}

.read-btn:hover:not(:disabled) {
  background: #138496;
}

.write-btn {
  background: #fd7e14;
  color: white;
}

.write-btn:hover:not(:disabled) {
  background: #e55a00;
}

.call-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.method-result {
  margin-top: 10px;
  padding: 10px;
  background: #d1ecf1;
  border-radius: 4px;
  border: 1px solid #bee5eb;
  word-break: break-all;
}

.tx-link {
  color: #007bff;
  text-decoration: none;
}

.tx-link:hover {
  text-decoration: underline;
}

.error-message {
  background: #f8d7da;
  padding: 15px;
  border-radius: 6px;
  border: 1px solid #f5c6cb;
  color: #721c24;
  margin-top: 20px;
}

.error-message h3 {
  margin-top: 0;
}

.clear-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.clear-btn:hover {
  background: #c82333;
}
</style>
