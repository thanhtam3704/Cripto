<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-xl font-bold leading-6 text-gray-900 mb-6 text-center">
                <div class="flex items-center justify-center space-x-2">
                  <CurrencyDollarIcon class="w-6 h-6 text-yellow-500" />
                  <span>Tip cho {{ blogger.profile?.displayName }}</span>
                </div>
              </DialogTitle>
              
              <!-- Blogger Info -->
              <div class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg mb-6">
                <img 
                  :src="blogger.profile?.avatar || defaultAvatar" 
                  :alt="blogger.profile?.displayName"
                  class="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 class="font-semibold text-gray-900">{{ blogger.profile?.displayName }}</h4>
                  <p class="text-sm text-gray-600">{{ video.title }}</p>
                </div>
              </div>
              
              <!-- Tip Form -->
              <form @submit.prevent="handleSubmit" class="space-y-6">
                <!-- Amount Selection -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-3">
                    Số lượng TIP
                  </label>
                  
                  <!-- Preset amounts -->
                  <div class="grid grid-cols-4 gap-3 mb-4">
                    <button 
                      v-for="preset in presetAmounts"
                      :key="preset"
                      type="button"
                      @click="selectAmount(preset)"
                      :class="[
                        'p-3 text-center border-2 rounded-lg transition-all',
                        selectedAmount === preset 
                          ? 'border-primary-500 bg-primary-50 text-primary-700' 
                          : 'border-gray-200 hover:border-gray-300'
                      ]"
                    >
                      <div class="font-semibold">{{ preset }}</div>
                      <div class="text-xs text-gray-500">TIP</div>
                    </button>
                  </div>
                  
                  <!-- Custom amount -->
                  <div class="relative">
                    <input 
                      v-model="customAmount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      :max="maxTipAmount"
                      placeholder="Nhập số TIP khác"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      @input="onCustomAmountChange"
                    />
                    <div class="absolute right-3 top-3 text-gray-500">
                      TIP
                    </div>
                  </div>
                  
                  <!-- Balance info -->
                  <div class="flex justify-between items-center mt-2 text-sm">
                    <span class="text-gray-600">
                      Số dư hiện tại: <span class="font-semibold">{{ walletStore.balance }} TIP</span>
                    </span>
                    <span v-if="selectedAmount" class="text-gray-600">
                      ≈ ${{ estimatedUSD }}
                    </span>
                  </div>
                </div>
                
                <!-- Message -->
                <div>
                  <label for="tipMessage" class="block text-sm font-medium text-gray-700 mb-2">
                    Tin nhắn (tùy chọn)
                  </label>
                  <textarea 
                    id="tipMessage"
                    v-model="tipMessage"
                    rows="3"
                    maxlength="200"
                    placeholder="Viết lời nhắn cho blogger..."
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  ></textarea>
                  <div class="text-right text-xs text-gray-500 mt-1">
                    {{ tipMessage.length }}/200
                  </div>
                </div>
                
                <!-- Anonymous option -->
                <div class="flex items-center">
                  <input 
                    id="anonymous"
                    v-model="isAnonymous"
                    type="checkbox"
                    class="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label for="anonymous" class="ml-2 text-sm text-gray-700">
                    Gửi tip ẩn danh
                  </label>
                </div>
                
                <!-- Transaction fee info -->
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div class="flex items-center space-x-2 text-blue-800">
                    <InformationCircleIcon class="w-4 h-4" />
                    <span class="text-sm font-medium">Thông tin giao dịch</span>
                  </div>
                  <div class="mt-2 text-sm text-blue-700 space-y-1">
                    <div class="flex justify-between">
                      <span>Số TIP gửi:</span>
                      <span class="font-semibold">{{ selectedAmount || 0 }} TIP</span>
                    </div>
                    <div class="flex justify-between">
                      <span>Phí gas (ước tính):</span>
                      <span class="font-semibold">{{ estimatedGasFee }} ETH</span>
                    </div>
                    <div class="flex justify-between text-xs text-blue-600">
                      <span>Platform fee (2%):</span>
                      <span>{{ platformFee }} TIP</span>
                    </div>
                  </div>
                </div>
                
                <!-- Error message -->
                <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div class="flex items-center space-x-2 text-red-700">
                    <ExclamationTriangleIcon class="w-4 h-4" />
                    <span class="text-sm">{{ error }}</span>
                  </div>
                </div>
                
                <!-- Action buttons -->
                <div class="flex space-x-3 pt-4">
                  <button 
                    type="button"
                    @click="closeModal"
                    class="flex-1 btn btn-outline"
                  >
                    Hủy
                  </button>
                  
                  <button 
                    type="submit"
                    :disabled="!canSendTip || sending"
                    class="flex-1 btn btn-primary"
                  >
                    <div v-if="sending" class="flex items-center justify-center space-x-2">
                      <div class="w-4 h-4 spinner"></div>
                      <span>Đang gửi...</span>
                    </div>
                    <div v-else class="flex items-center justify-center space-x-2">
                      <CurrencyDollarIcon class="w-4 h-4" />
                      <span>Gửi {{ selectedAmount }} TIP</span>
                    </div>
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useWalletStore } from '@/stores/wallet'
import { useTipStore } from '@/stores/tip'
import { useToast } from 'vue-toastification'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import {
  CurrencyDollarIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  video: {
    type: Object,
    required: true
  },
  blogger: {
    type: Object,
    required: true
  },
  isOpen: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['close', 'tip-sent'])

// Stores
const walletStore = useWalletStore()
const tipStore = useTipStore()
const toast = useToast()

// State
const presetAmounts = [1, 5, 10, 25, 50, 100]
const selectedAmount = ref(5) // Default selection
const customAmount = ref('')
const tipMessage = ref('')
const isAnonymous = ref(false)
const sending = ref(false)
const error = ref('')

// Computed
const maxTipAmount = computed(() => {
  return Math.floor(parseFloat(walletStore.balance) * 100) / 100
})

const defaultAvatar = computed(() => {
  const name = props.blogger.profile?.displayName || 'Blogger'
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`
})

const estimatedUSD = computed(() => {
  if (!selectedAmount.value) return '0.00'
  // Assuming 1 TIP = $1 for demo (should be fetched from API)
  return (selectedAmount.value * 1).toFixed(2)
})

const estimatedGasFee = computed(() => {
  // Rough estimate for gas fee (should be calculated dynamically)
  return '0.002'
})

const platformFee = computed(() => {
  if (!selectedAmount.value) return '0.00'
  return (selectedAmount.value * 0.02).toFixed(2)
})

const canSendTip = computed(() => {
  return selectedAmount.value > 0 && 
         selectedAmount.value <= maxTipAmount.value &&
         walletStore.isConnected &&
         !sending.value
})

// Methods
const selectAmount = (amount) => {
  selectedAmount.value = amount
  customAmount.value = ''
  error.value = ''
}

const onCustomAmountChange = () => {
  if (customAmount.value) {
    const amount = parseFloat(customAmount.value)
    if (amount > 0 && amount <= maxTipAmount.value) {
      selectedAmount.value = amount
      error.value = ''
    } else if (amount > maxTipAmount.value) {
      error.value = `Số TIP tối đa: ${maxTipAmount.value}`
    }
  }
}

const validateTip = () => {
  if (!selectedAmount.value || selectedAmount.value <= 0) {
    error.value = 'Vui lòng nhập số TIP hợp lệ'
    return false
  }
  
  if (selectedAmount.value > maxTipAmount.value) {
    error.value = `Số dư không đủ. Tối đa: ${maxTipAmount.value} TIP`
    return false
  }
  
  if (!walletStore.isConnected) {
    error.value = 'Vui lòng kết nối ví'
    return false
  }
  
  return true
}

const handleSubmit = async () => {
  error.value = ''
  
  if (!validateTip()) {
    return
  }
  
  try {
    sending.value = true
    
    const tipData = {
      videoId: props.video.id,
      creatorId: props.blogger.id,
      amount: selectedAmount.value,
      message: tipMessage.value.trim() || null,
      isAnonymous: isAnonymous.value,
      fromAddress: walletStore.address,
      toAddress: props.blogger.walletAddress
    }
    
    const result = await tipStore.sendTip(tipData)
    
    if (result.success) {
      emit('tip-sent', {
        ...tipData,
        transactionHash: result.transactionHash
      })
      
      // Update wallet balance
      await walletStore.updateBalances()
      
      toast.success(`Đã gửi ${selectedAmount.value} TIP thành công!`)
      closeModal()
    } else {
      throw new Error(result.error || 'Gửi tip thất bại')
    }
  } catch (err) {
    console.error('Tip sending error:', err)
    error.value = err.message || 'Có lỗi xảy ra khi gửi tip'
  } finally {
    sending.value = false
  }
}

const closeModal = () => {
  emit('close')
}

// Watch for custom amount changes
watch(customAmount, (newValue) => {
  if (newValue) {
    onCustomAmountChange()
  }
})
</script>

<style scoped>
.spinner {
  border: 2px solid #f3f4f6;
  border-top: 2px solid #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>




