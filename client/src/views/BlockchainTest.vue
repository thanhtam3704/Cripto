<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
    <div class="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
      <h1 class="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        🪙 Blockchain Test Page
      </h1>

      <!-- Connection Status -->
      <div class="mb-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border-2 border-purple-200">
        <div class="flex items-center justify-between mb-4">
          <span class="font-semibold text-gray-700">Trạng thái:</span>
          <span :class="isConnected ? 'text-green-600' : 'text-red-600'" class="font-bold">
            {{ isConnected ? '✅ Đã kết nối' : '❌ Chưa kết nối' }}
          </span>
        </div>
        
        <div v-if="isConnected" class="space-y-3 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600">Địa chỉ ví:</span>
            <span class="font-mono font-bold text-purple-600">{{ formatAddress(account) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">ETH Balance:</span>
            <span class="font-bold text-blue-600">{{ ethBalance }} ETH</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">TIP Balance:</span>
            <span class="font-bold text-green-600">{{ tipBalance }} TIP</span>
          </div>
        </div>
      </div>

      <!-- Connect Button -->
      <button
        v-if="!isConnected"
        @click="connectWallet"
        :disabled="loading"
        class="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mb-6"
      >
        {{ loading ? '⏳ Đang kết nối...' : '🔗 Kết nối MetaMask' }}
      </button>

      <!-- Actions (khi đã connect) -->
      <div v-if="isConnected" class="space-y-4 mb-6">
        <!-- Buy Tokens -->
        <div class="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
          <h3 class="font-bold text-lg mb-4 text-gray-800">💰 Mua TIP Tokens</h3>
          <div class="flex gap-3">
            <input
              v-model="ethAmount"
              type="number"
              step="0.001"
              min="0"
              placeholder="Nhập số ETH (vd: 0.01)"
              class="flex-1 px-4 py-3 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              @click="buyTokens"
              :disabled="loading || !ethAmount"
              class="px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Mua
            </button>
          </div>
          <p class="text-sm text-gray-600 mt-2">
            1 ETH = 1000 TIP | 0.001 ETH = 1 TIP
          </p>
        </div>

        <!-- Send Tip -->
        <div class="p-6 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border-2 border-pink-200">
          <h3 class="font-bold text-lg mb-4 text-gray-800">🎁 Gửi Tip cho Blogger</h3>
          <div class="space-y-3">
            <input
              v-model="recipientAddress"
              type="text"
              placeholder="Địa chỉ ví blogger (0x...)"
              class="w-full px-4 py-3 border-2 border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <div class="flex gap-3">
              <input
                v-model="tipAmount"
                type="number"
                step="1"
                min="0"
                placeholder="Số TIP"
                class="flex-1 px-4 py-3 border-2 border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button
                @click="sendTip"
                :disabled="loading || !recipientAddress || !tipAmount"
                class="px-6 py-3 bg-pink-600 text-white rounded-lg font-bold hover:bg-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Gửi
              </button>
            </div>
          </div>
        </div>

        <!-- Refresh Button -->
        <button
          @click="refreshBalances"
          :disabled="loading"
          class="w-full py-3 px-6 bg-gray-600 text-white rounded-xl font-bold hover:bg-gray-700 transition-all disabled:opacity-50"
        >
          🔄 Làm mới số dư
        </button>
      </div>

      <!-- Transaction History -->
      <div v-if="transactions.length > 0" class="mt-6">
        <h3 class="font-bold text-lg mb-4 text-gray-800">📜 Lịch sử giao dịch</h3>
        <div class="space-y-2 max-h-64 overflow-y-auto">
          <div
            v-for="(tx, index) in transactions"
            :key="index"
            class="p-3 bg-gray-50 rounded-lg text-sm"
          >
            <div class="flex justify-between items-center">
              <span :class="tx.type === 'buy' ? 'text-green-600' : 'text-pink-600'" class="font-bold">
                {{ tx.type === 'buy' ? '💰 Mua tokens' : '🎁 Gửi tip' }}
              </span>
              <span class="text-gray-500 text-xs">{{ tx.time }}</span>
            </div>
            <p class="text-gray-600 mt-1 font-mono text-xs break-all">
              TX: {{ tx.hash.substring(0, 10) }}...{{ tx.hash.substring(tx.hash.length - 8) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Contract Info -->
      <div class="mt-8 p-4 bg-gray-100 rounded-xl text-xs text-gray-600">
        <p class="font-bold mb-2">📝 Contract Info:</p>
        <p class="font-mono break-all">Address: 0x5FbDB2315678afecb367f032d93F642f64180aa3</p>
        <p class="mt-1">Network: Hardhat Local (Chain ID: 1337)</p>
      </div>

      <!-- Disconnect Button -->
      <button
        v-if="isConnected"
        @click="disconnectWallet"
        class="w-full mt-6 py-3 px-6 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all"
      >
        🔌 Ngắt kết nối
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import blockchainService from '@/services/blockchain';
import { useToast } from 'vue-toastification';

const toast = useToast();

const isConnected = ref(false);
const loading = ref(false);
const account = ref('');
const ethBalance = ref('0');
const tipBalance = ref('0');
const ethAmount = ref('');
const recipientAddress = ref('');
const tipAmount = ref('');
const transactions = ref([]);

// Format address
const formatAddress = (addr) => {
  if (!addr) return '';
  return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
};

// Connect wallet
const connectWallet = async () => {
  loading.value = true;
  try {
    const result = await blockchainService.connectWallet();
    
    if (result.success) {
      isConnected.value = true;
      account.value = result.account;
      await refreshBalances();
      toast.success('✅ Kết nối ví thành công!');
    }
  } catch (error) {
    console.error('Connect error:', error);
    toast.error(error.message || 'Không thể kết nối ví');
  } finally {
    loading.value = false;
  }
};

// Disconnect wallet
const disconnectWallet = () => {
  blockchainService.disconnect();
  isConnected.value = false;
  account.value = '';
  ethBalance.value = '0';
  tipBalance.value = '0';
  toast.info('Đã ngắt kết nối ví');
};

// Refresh balances
const refreshBalances = async () => {
  try {
    const [eth, tip] = await Promise.all([
      blockchainService.getEthBalance(),
      blockchainService.getBalance()
    ]);
    ethBalance.value = parseFloat(eth).toFixed(4);
    tipBalance.value = parseFloat(tip).toFixed(2);
  } catch (error) {
    console.error('Refresh balances error:', error);
  }
};

// Buy tokens
const buyTokens = async () => {
  if (!ethAmount.value || parseFloat(ethAmount.value) <= 0) {
    toast.warning('Vui lòng nhập số ETH hợp lệ');
    return;
  }

  loading.value = true;
  try {
    const result = await blockchainService.buyTokens(ethAmount.value);
    
    transactions.value.unshift({
      type: 'buy',
      hash: result.transactionHash,
      time: new Date().toLocaleTimeString()
    });

    await refreshBalances();
    ethAmount.value = '';
    toast.success(`✅ Đã mua tokens thành công! TX: ${result.transactionHash.substring(0, 10)}...`);
  } catch (error) {
    console.error('Buy tokens error:', error);
    toast.error(error.message || 'Không thể mua tokens');
  } finally {
    loading.value = false;
  }
};

// Send tip
const sendTip = async () => {
  if (!recipientAddress.value || !tipAmount.value) {
    toast.warning('Vui lòng nhập đầy đủ thông tin');
    return;
  }

  if (!recipientAddress.value.startsWith('0x') || recipientAddress.value.length !== 42) {
    toast.warning('Địa chỉ ví không hợp lệ');
    return;
  }

  loading.value = true;
  try {
    const result = await blockchainService.sendTip(
      recipientAddress.value,
      tipAmount.value,
      'test-blog-123' // Blog ID test
    );
    
    transactions.value.unshift({
      type: 'tip',
      hash: result.transactionHash,
      time: new Date().toLocaleTimeString()
    });

    await refreshBalances();
    recipientAddress.value = '';
    tipAmount.value = '';
    toast.success(`✅ Đã gửi tip thành công! TX: ${result.transactionHash.substring(0, 10)}...`);
  } catch (error) {
    console.error('Send tip error:', error);
    toast.error(error.message || 'Không thể gửi tip');
  } finally {
    loading.value = false;
  }
};

// Check if already connected
onMounted(async () => {
  if (blockchainService.isConnected()) {
    isConnected.value = true;
    account.value = blockchainService.getCurrentAccount();
    await refreshBalances();
  }
});
</script>
