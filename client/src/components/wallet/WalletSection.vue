<template>
  <div class="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-xl p-6 text-white">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-2xl font-bold flex items-center gap-2">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
        Blockchain Wallet
      </h3>
      <button
        v-if="!isConnected"
        @click="connectWallet"
        :disabled="loading"
        class="px-4 py-2 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-all disabled:opacity-50"
      >
        {{ loading ? '⏳ Đang kết nối...' : '🔗 Kết nối ví' }}
      </button>
    </div>

    <!-- Connected State -->
    <div v-if="isConnected" class="space-y-4">
      <!-- Wallet Address -->
      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
        <div class="text-sm text-purple-100 mb-1">Địa chỉ ví</div>
        <div class="flex items-center justify-between">
          <span class="font-mono text-lg">{{ formatAddress(walletAddress) }}</span>
          <button
            @click="copyAddress"
            class="p-2 hover:bg-white/20 rounded-lg transition-all"
            title="Copy địa chỉ"
          >
            <svg v-if="!copied" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <svg v-else class="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Balances -->
      <div class="grid grid-cols-2 gap-4">
        <!-- ETH Balance -->
        <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div class="text-sm text-purple-100 mb-1">ETH Balance</div>
          <div class="text-2xl font-bold">{{ ethBalance }}</div>
          <div class="text-xs text-purple-200 mt-1">Ethereum</div>
        </div>

        <!-- TIP Balance -->
        <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div class="text-sm text-purple-100 mb-1">TIP Balance</div>
          <div class="text-2xl font-bold">{{ tipBalance }}</div>
          <div class="text-xs text-purple-200 mt-1">TipToken</div>
        </div>
      </div>

      <!-- Actions -->
      <div class="grid grid-cols-2 gap-4">
        <button
          @click="openBuyTokensModal"
          class="px-4 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Mua Tokens
        </button>
        
        <button
          @click="refreshBalances"
          :disabled="loading"
          class="px-4 py-3 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <svg class="w-5 h-5" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Làm mới
        </button>
      </div>

      <!-- Save Wallet Address (for bloggers ONLY to receive tips) -->
      <div v-if="authStore.user?.role === 'blogger' && !walletSaved" class="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4">
        <div class="flex items-start gap-3">
          <svg class="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div class="flex-1">
            <h4 class="text-yellow-900 font-semibold mb-1">💡 Lưu địa chỉ ví để nhận tip</h4>
            <p class="text-yellow-800 text-sm mb-3">
              Để người đọc có thể gửi tip cho bạn, hãy lưu địa chỉ ví này vào profile của bạn.
            </p>
            <button
              @click="saveWalletAddress"
              :disabled="savingWallet"
              class="px-4 py-2 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <svg v-if="!savingWallet" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              <svg v-else class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ savingWallet ? 'Đang lưu...' : '💾 Lưu địa chỉ ví vào profile' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Wallet Saved Successfully (for bloggers ONLY) -->
      <div v-else-if="authStore.user?.role === 'blogger' && walletSaved" class="bg-green-50 border-2 border-green-300 rounded-xl p-4">
        <div class="flex items-center gap-3 text-green-800">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p class="font-semibold">✅ Địa chỉ ví đã được lưu!</p>
            <p class="text-sm text-green-700">Người đọc có thể gửi tip cho bạn.</p>
          </div>
        </div>
      </div>

      <!-- Disconnect -->
      <button
        @click="disconnect"
        class="w-full px-4 py-2 bg-red-500/20 text-white rounded-xl font-semibold hover:bg-red-500/30 transition-all"
      >
        🔌 Ngắt kết nối ví
      </button>
    </div>

    <!-- Not Connected State -->
    <div v-else class="text-center py-8">
      <svg class="w-16 h-16 mx-auto mb-4 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
      <p class="text-purple-100 mb-4">Kết nối ví để xem số dư và thực hiện giao dịch blockchain</p>
    </div>

    <!-- Buy Tokens Modal -->
    <BuyTokensModal
      v-if="showBuyTokensModal"
      @close="showBuyTokensModal = false"
      @success="handleBuySuccess"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth';
import blockchainService from '@/services/blockchain';
import apiService from '@/services/api';
import BuyTokensModal from './BuyTokensModal.vue';
import { showBlockchainError } from '@/utils/errorHandler';

const toast = useToast();
const authStore = useAuthStore();

const loading = ref(false);
const isConnected = ref(false);
const walletAddress = ref('');
const ethBalance = ref('0.0000');
const tipBalance = ref('0.00');
const copied = ref(false);
const showBuyTokensModal = ref(false);
const savingWallet = ref(false);
const walletSaved = ref(false);

// Check if wallet is saved in profile
const checkWalletSaved = () => {
  if (authStore.user?.walletAddress) {
    const savedAddress = authStore.user.walletAddress.toLowerCase();
    const currentAddress = walletAddress.value.toLowerCase();
    walletSaved.value = savedAddress === currentAddress;
  } else {
    walletSaved.value = false;
  }
};

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
      walletAddress.value = result.account;
      await refreshBalances();
      checkWalletSaved();
      
      // Auto-save wallet address if not saved yet
      if (!walletSaved.value) {
        await saveWalletAddress();
      }
      
      toast.success('✅ Kết nối ví thành công!');
    }
  } catch (error) {
    showBlockchainError(toast, error, 'Không thể kết nối ví');
  } finally {
    loading.value = false;
  }
};

// Refresh balances
const refreshBalances = async () => {
  loading.value = true;
  try {
    const [eth, tip] = await Promise.all([
      blockchainService.getEthBalance(),
      blockchainService.getBalance()
    ]);
    ethBalance.value = parseFloat(eth).toFixed(4);
    tipBalance.value = parseFloat(tip).toFixed(2);
  } catch (error) {
    console.error('Refresh balances error:', error);
    toast.error('Không thể tải số dư');
  } finally {
    loading.value = false;
  }
};

// Copy address
const copyAddress = () => {
  navigator.clipboard.writeText(walletAddress.value);
  copied.value = true;
  toast.success('Đã copy địa chỉ ví!');
  setTimeout(() => {
    copied.value = false;
  }, 2000);
};

// Open buy tokens modal
const openBuyTokensModal = () => {
  showBuyTokensModal.value = true;
};

// Handle buy success
const handleBuySuccess = async () => {
  await refreshBalances();
};

// Save wallet address to profile (auto-save for all users)
const saveWalletAddress = async () => {
  if (!walletAddress.value) {
    toast.error('Không có địa chỉ ví để lưu');
    return;
  }

  savingWallet.value = true;
  try {
    const response = await apiService.patch('/users/wallet', {
      walletAddress: walletAddress.value
    });

    if (response.data.success) {
      // Update authStore
      authStore.user.walletAddress = walletAddress.value;
      walletSaved.value = true;
      toast.success('✅ Đã lưu địa chỉ ví vào profile!');
    }
  } catch (error) {
    console.error('Save wallet error:', error);
    const message = error.response?.data?.message || 'Không thể lưu địa chỉ ví';
    toast.error(message);
  } finally {
    savingWallet.value = false;
  }
};

// Disconnect
const disconnect = () => {
  blockchainService.disconnect();
  isConnected.value = false;
  walletAddress.value = '';
  ethBalance.value = '0.0000';
  tipBalance.value = '0.00';
  toast.info('Đã ngắt kết nối ví');
};

// Check if already connected
onMounted(async () => {
  if (blockchainService.isConnected()) {
    isConnected.value = true;
    walletAddress.value = blockchainService.getCurrentAccount();
    await refreshBalances();
    checkWalletSaved();
  }
});
</script>
