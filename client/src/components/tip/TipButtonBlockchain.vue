<template>
  <div class="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-orange-200 shadow-lg">
    <div class="mb-4">
      <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
        <span class="text-2xl">🎁</span>
        Tặng Token cho Blogger
      </h3>
      <!-- totalTips đã xóa - không hiển thị tổng tip trong form gửi tip -->
    </div>

    <!-- Blogger Info -->
    <div class="bg-white rounded-xl p-4 mb-4 flex items-center gap-3">
      <img
        :src="bloggerAvatar"
        :alt="bloggerName"
        class="w-12 h-12 rounded-full object-cover border-2 border-orange-300"
      />
      <div class="flex-1">
        <div class="font-semibold text-gray-800">{{ bloggerName }}</div>
        <div class="text-xs text-gray-500 font-mono">{{ formatAddress(bloggerAddress) }}</div>
      </div>
    </div>

    <!-- Not Connected State -->
    <div v-if="!isConnected" class="text-center py-6">
      <svg class="w-16 h-16 mx-auto mb-3 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
      <p class="text-gray-600 mb-4">Kết nối ví để tặng token cho blogger này</p>
      <button
        @click="connectWallet"
        :disabled="loading"
        class="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl font-bold hover:from-orange-600 hover:to-yellow-600 transition-all shadow-md disabled:opacity-50"
      >
        {{ loading ? '⏳ Đang kết nối...' : '🔗 Kết nối ví' }}
      </button>
    </div>

    <!-- Connected State - Tip Form -->
    <div v-else class="space-y-4">
      <!-- Blogger No Wallet Warning -->
      <div v-if="!props.bloggerAddress" class="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg mb-4">
        <div class="text-sm text-yellow-700">
          ⚠️ Blogger này chưa thiết lập địa chỉ ví. Họ cần cập nhật địa chỉ ví trong profile để nhận token.
        </div>
      </div>
      
      <!-- Your Balance -->
      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <div class="text-sm text-blue-700 flex items-center justify-between">
          <span>💰 Số dư của bạn:</span>
          <span class="font-bold text-lg">{{ tipBalance }} TIP</span>
        </div>
      </div>

      <!-- Tip Amount Input -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Số lượng TIP muốn tặng
        </label>
        <div class="relative">
          <input
            v-model="tipAmount"
            type="number"
            step="1"
            min="1"
            placeholder="10"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none transition-all"
          />
          <span class="absolute right-4 top-1/2 -translate-y-1/2 text-orange-600 font-bold">
            TIP
          </span>
        </div>
      </div>

      <!-- Quick Select -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Chọn nhanh
        </label>
        <div class="grid grid-cols-4 gap-2">
          <button
            v-for="amount in quickAmounts"
            :key="amount"
            @click="tipAmount = amount"
            class="px-3 py-2 border-2 border-orange-300 text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition-all"
            :class="{ 'bg-orange-100': tipAmount == amount }"
          >
            {{ amount }}
          </button>
        </div>
      </div>

      <!-- Message (Optional) -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Lời nhắn (tùy chọn)
        </label>
        <textarea
          v-model="message"
          rows="2"
          maxlength="200"
          placeholder="Cảm ơn bài viết hay! 💖"
          class="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none transition-all resize-none"
        ></textarea>
        <p class="text-xs text-gray-500 mt-1">{{ message.length }}/200 ký tự</p>
      </div>

      <!-- Insufficient Balance Warning -->
      <div v-if="parseFloat(tipAmount) > parseFloat(tipBalance)" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
        <div class="text-sm text-red-700">
          ⚠️ Số dư không đủ. Bạn cần thêm {{ (parseFloat(tipAmount) - parseFloat(tipBalance)).toFixed(2) }} TIP
        </div>
      </div>

      <!-- Send Token Button -->
      <button
        @click="sendTip"
        :disabled="!canSendTip || loading"
        :title="!props.bloggerAddress ? 'Blogger chưa có địa chỉ ví' : !canSendTip ? 'Vui lòng nhập số TIP hợp lệ' : ''"
        class="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl font-bold text-lg hover:from-orange-600 hover:to-yellow-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        <span v-if="loading" class="flex items-center justify-center gap-2">
          <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Đang gửi token...
        </span>
        <span v-else-if="!props.bloggerAddress">
          ⚠️ Blogger chưa có ví
        </span>
        <span v-else>
          🚀 Tặng {{ tipAmount }} TIP
        </span>
      </button>

      <!-- Disconnect Button -->
      <button
        @click="disconnect"
        class="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all text-sm"
      >
        🔌 Ngắt kết nối ví
      </button>
    </div>

    <!-- Recent Tips History -->
    <div v-if="recentTips.length > 0" class="mt-6 pt-6 border-t border-orange-200">
      <h4 class="text-sm font-semibold text-gray-700 mb-3">💝 Token đã tặng gần đây</h4>
      <div class="space-y-2">
        <div
          v-for="tip in recentTips"
          :key="tip.id"
          class="flex items-center justify-between text-sm bg-white rounded-lg p-3"
        >
          <div class="flex items-center gap-2">
            <span class="text-gray-600">{{ tip.tipper }}</span>
            <span class="text-orange-600 font-bold">{{ tip.amount }} TIP</span>
          </div>
          <span class="text-xs text-gray-400">{{ tip.time }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import blockchainService from '@/services/blockchain';
import api from '@/services/api';
import { showBlockchainError } from '@/utils/errorHandler';

const props = defineProps({
  bloggerAddress: {
    type: String,
    required: true
  },
  bloggerName: {
    type: String,
    required: true
  },
  bloggerAvatar: {
    type: String,
    default: '/default-avatar.png'
  },
  blogId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['tipSent']);

const toast = useToast();
const loading = ref(false);
const isConnected = ref(false);
const tipBalance = ref('0.00');
const tipAmount = ref('10');
const message = ref('');
// totalTips đã xóa - không cần hiển thị trong component này
const recentTips = ref([]);

const quickAmounts = [5, 10, 25, 50];

// Format address
const formatAddress = (addr) => {
  if (!addr) return '';
  return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
};

// Can send tip
const canSendTip = computed(() => {
  const amount = parseFloat(tipAmount.value);
  const balance = parseFloat(tipBalance.value);
  const hasValidAmount = amount > 0 && amount <= balance;
  const hasAddress = !!props.bloggerAddress;
  
  console.log('Can send tip check:', {
    amount,
    balance,
    hasValidAmount,
    hasAddress,
    bloggerAddress: props.bloggerAddress
  });
  
  return hasValidAmount && hasAddress;
});

// Connect wallet
const connectWallet = async () => {
  loading.value = true;
  try {
    const result = await blockchainService.connectWallet();
    
    if (result.success) {
      isConnected.value = true;
      await loadBalance();
      toast.success('✅ Kết nối ví thành công!');
    }
  } catch (error) {
    showBlockchainError(toast, error, 'Không thể kết nối ví');
  } finally {
    loading.value = false;
  }
};

// Load balance
const loadBalance = async () => {
  try {
    const balance = await blockchainService.getBalance();
    tipBalance.value = parseFloat(balance).toFixed(2);
  } catch (error) {
    console.error('Load balance error:', error);
  }
};

// Send tip
const sendTip = async () => {
  if (!canSendTip.value) {
    toast.warning('Vui lòng nhập số lượng TIP hợp lệ');
    return;
  }

  loading.value = true;
  try {
    const result = await blockchainService.sendTip(
      props.bloggerAddress,
      tipAmount.value,
      props.blogId
    );
    
    if (result.success) {
      // Save transaction to backend database
      try {
        await api.post(`/tips/${props.blogId}`, {
          txHash: result.transactionHash,
          amount: tipAmount.value,
          message: message.value
        });
        console.log('✅ Transaction saved to database');
      } catch (dbError) {
        console.warn('⚠️ Could not save to database:', dbError);
        // Don't show error to user, blockchain transaction succeeded
      }
      
      toast.success(`✅ Đã gửi ${tipAmount.value} TIP cho ${props.bloggerName}!`);
      
      // Update balance
      await loadBalance();
      
      // Reset form
      tipAmount.value = '10';
      message.value = '';
      
      // totalTips update đã xóa - frontend không cần track total tips
      
      // Emit event
      emit('tipSent', {
        amount: tipAmount.value,
        message: message.value
      });
    }
  } catch (error) {
    showBlockchainError(toast, error, 'Không thể gửi tip');
  } finally {
    loading.value = false;
  }
};

// Disconnect
const disconnect = () => {
  blockchainService.disconnect();
  isConnected.value = false;
  tipBalance.value = '0.00';
  toast.info('Đã ngắt kết nối ví');
};

// loadTotalTips function đã xóa - không cần query database để hiển thị tổng tip

// Check if already connected
onMounted(async () => {
  if (blockchainService.isConnected()) {
    isConnected.value = true;
    await loadBalance();
  }
  
  // loadTotalTips call đã xóa - không cần load total tips khi mount
});

</script>
