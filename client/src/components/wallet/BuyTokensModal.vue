<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="$emit('close')">
    <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span class="text-3xl">💰</span>
          Mua TIP Tokens
        </h3>
        <button
          @click="$emit('close')"
          class="p-2 hover:bg-gray-100 rounded-lg transition-all"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Exchange Info -->
      <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-6">
        <div class="text-center">
          <div class="text-sm text-gray-600 mb-1">Tỷ giá hiện tại</div>
          <div class="text-2xl font-bold text-purple-600">
            1 ETH = 1,000 TIP
          </div>
          <div class="text-xs text-gray-500 mt-1">
            (0.001 ETH = 1 TIP)
          </div>
        </div>
      </div>

      <!-- Input Section -->
      <div class="space-y-4">
        <!-- ETH Amount -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Số lượng ETH muốn đổi
          </label>
          <div class="relative">
            <input
              v-model="ethAmount"
              type="number"
              step="0.001"
              min="0.001"
              placeholder="0.01"
              class="w-full px-4 py-3 pr-16 border-2 text-black border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-all"
              @input="calculateTokens"
            />
            <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
              ETH
            </span>
          </div>
        </div>

        <!-- Arrow -->
        <div class="flex justify-center">
          <svg class="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>

        <!-- TIP Amount (Calculated) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Bạn sẽ nhận được
          </label>
          <div class="relative">
            <input
              :value="tipAmount.toFixed(2)"
              type="text"
              readonly
              class="w-full px-4 py-3 pr-16 border-2 text-black border-gray-300 bg-gray-50 rounded-xl cursor-not-allowed"
            />
            <span class="absolute right-4 top-1/2 -translate-y-1/2 text-purple-600 font-bold">
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
              @click="selectAmount(amount)"
              class="px-3 py-2 border-2 border-purple-300 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-all"
              :class="{ 'bg-purple-100 border-purple-500': ethAmount === amount }"
            >
              {{ amount }}
            </button>
          </div>
        </div>

        <!-- Balance Info -->
        <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
          <div class="text-sm text-blue-700">
            💡 <strong>Lưu ý:</strong> Phí gas sẽ được tính thêm khi giao dịch
          </div>
        </div>

        <!-- Buy Button -->
        <button
          @click="buyTokens"
          :disabled="!isValidAmount || loading"
          class="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          <span v-if="loading" class="flex items-center justify-center gap-2">
            <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Đang xử lý...
          </span>
          <span v-else>
            🚀 Mua {{ tipAmount.toFixed(2) }} TIP
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useToast } from 'vue-toastification';
import blockchainService from '@/services/blockchain';
import { showBlockchainError } from '@/utils/errorHandler';

const emit = defineEmits(['close', 'success']);
const toast = useToast();

const ethAmount = ref(0.01);
const tipAmount = ref(10);
const loading = ref(false);

const quickAmounts = [0.01, 0.05, 0.1, 0.5];

// Calculate tokens based on ETH amount
const calculateTokens = () => {
  const eth = parseFloat(ethAmount.value) || 0;
  tipAmount.value = parseFloat((eth * 1000).toFixed(2));
};

// Select quick amount
const selectAmount = (amount) => {
  ethAmount.value = amount;
  calculateTokens();
};

// Validate amount
const isValidAmount = computed(() => {
  const eth = parseFloat(ethAmount.value);
  return eth >= 0.001;
});

// Buy tokens
const buyTokens = async () => {
  if (!isValidAmount.value) {
    toast.warning('Vui lòng nhập số lượng ETH hợp lệ (tối thiểu 0.001 ETH)');
    return;
  }

  loading.value = true;
  try {
    const result = await blockchainService.buyTokens(ethAmount.value);
    
    if (result.success) {
      toast.success(`✅ Đã mua ${tipAmount.value} TIP thành công!`);
      emit('success');
      emit('close');
    }
  } catch (error) {
    showBlockchainError(toast, error, 'Không thể mua tokens');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fade-in 0.2s ease-out;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>
