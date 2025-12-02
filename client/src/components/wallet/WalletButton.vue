<template>
  <div class="relative">
    <!-- Connect Button -->
    <button 
      v-if="!isConnected"
      @click="connectWallet"
      :disabled="connecting || !isMetaMaskInstalled"
      class="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-crypto-orange to-crypto-blue text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <WalletIcon class="w-4 h-4" />
      <span v-if="connecting">Kết nối...</span>
      <span v-else-if="!isMetaMaskInstalled">Cài MetaMask</span>
      <span v-else>Kết nối Wallet</span>
    </button>
    
    <!-- Connected Wallet Info -->
    <div v-else class="relative">
      <button 
        @click="showWalletMenu = !showWalletMenu"
        class="flex items-center space-x-3 px-4 py-2 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
      >
        <div class="flex items-center space-x-2">
          <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span class="text-sm font-medium text-green-700">
            {{ formatAddress(address) }}
          </span>
        </div>
        <div class="text-right">
          <div class="text-xs text-gray-500">{{ formattedTokenBalance }} TIP</div>
          <div class="text-xs text-gray-400">{{ formattedBalance }} ETH</div>
        </div>
        <ChevronDownIcon class="w-4 h-4 text-gray-500" />
      </button>
      
      <!-- Wallet Menu Dropdown -->
      <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div 
          v-show="showWalletMenu" 
          class="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
        >
          <!-- Wallet Info -->
          <div class="px-4 py-3 border-b border-gray-200">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-700">Wallet Address</span>
              <button 
                @click="copyAddress"
                class="text-xs text-primary-600 hover:text-primary-700"
              >
                Copy
              </button>
            </div>
            <p class="text-xs text-gray-500 font-mono break-all">{{ address }}</p>
            
            <div class="mt-3 space-y-1">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">ETH Balance:</span>
                <span class="font-medium">{{ formattedBalance }} ETH</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">TIP Balance:</span>
                <span class="font-medium">{{ formattedTokenBalance }} TIP</span>
              </div>
              <div v-if="network" class="flex justify-between text-sm">
                <span class="text-gray-600">Network:</span>
                <span class="font-medium">{{ network.name }}</span>
              </div>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="px-2 py-2">
            <button 
              @click="refreshBalances"
              class="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
            >
              <ArrowPathIcon class="w-4 h-4" />
              <span>Làm mới số dư</span>
            </button>
            
            <button 
              @click="openBuyTokens"
              class="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
            >
              <PlusIcon class="w-4 h-4" />
              <span>Mua TIP Tokens</span>
            </button>
            
            <button 
              v-if="userIsBlogger && bloggerEarnings > 0"
              @click="withdrawEarnings"
              class="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
            >
              <BanknotesIcon class="w-4 h-4" />
              <span>Rút Earnings ({{ bloggerEarnings }} TIP)</span>
            </button>
            
            <hr class="my-2">
            
            <button 
              @click="disconnect"
              class="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
            >
              <XMarkIcon class="w-4 h-4" />
              <span>Ngắt kết nối</span>
            </button>
          </div>
        </div>
      </transition>
    </div>
    
    <!-- Buy Tokens Modal -->
    <BuyTokensModal 
      v-if="showBuyTokensModal" 
      @close="showBuyTokensModal = false"
      @success="handleBuyTokensSuccess"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useWalletStore } from '@/stores/wallet'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import BuyTokensModal from './BuyTokensModal.vue'
import {
  WalletIcon,
  ChevronDownIcon,
  ArrowPathIcon,
  PlusIcon,
  BanknotesIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'WalletButton',
  components: {
    BuyTokensModal,
    WalletIcon,
    ChevronDownIcon,
    ArrowPathIcon,
    PlusIcon,
    BanknotesIcon,
    XMarkIcon
  },
  setup() {
    const walletStore = useWalletStore()
    const authStore = useAuthStore()
    const toast = useToast()
    
    const showWalletMenu = ref(false)
    const showBuyTokensModal = ref(false)
    const bloggerEarnings = ref('0')
    
    const isConnected = computed(() => walletStore.isConnected)
    const address = computed(() => walletStore.address)
    const formattedBalance = computed(() => walletStore.formattedBalance)
    const formattedTokenBalance = computed(() => walletStore.formattedTokenBalance)
    const network = computed(() => walletStore.network)
    const connecting = computed(() => walletStore.connecting)
    const isMetaMaskInstalled = computed(() => walletStore.isMetaMaskInstalled)
    const userIsBlogger = computed(() => authStore.isBlogger)
    
    const formatAddress = (addr) => {
      if (!addr) return ''
      return `${addr.slice(0, 6)}...${addr.slice(-4)}`
    }
    
    const connectWallet = async () => {
      if (!isMetaMaskInstalled.value) {
        window.open('https://metamask.io/download/', '_blank')
        return
      }
      
      const success = await walletStore.connectWallet()
      if (success) {
        showWalletMenu.value = true
        if (userIsBlogger.value) {
          await loadbloggerEarnings()
        }
      }
    }
    
    const disconnect = () => {
      walletStore.disconnectWallet()
      showWalletMenu.value = false
    }
    
    const refreshBalances = async () => {
      await walletStore.updateBalances()
      if (userIsBlogger.value) {
        await loadbloggerEarnings()
      }
      toast.success('Số dư đã được cập nhật')
    }
    
    const copyAddress = async () => {
      try {
        await navigator.clipboard.writeText(address.value)
        toast.success('Đã copy địa chỉ wallet')
      } catch (error) {
        toast.error('Lỗi copy địa chỉ')
      }
    }
    
    const openBuyTokens = () => {
      showBuyTokensModal.value = true
      showWalletMenu.value = false
    }
    
    const withdrawEarnings = async () => {
      try {
        showWalletMenu.value = false
        toast.info('Đang xử lý rút earnings...')
        
        const result = await walletStore.withdrawEarnings()
        
        if (result.success) {
          toast.success('Rút earnings thành công!')
          await loadbloggerEarnings()
        }
      } catch (error) {
        console.error('Withdraw earnings error:', error)
        toast.error('Lỗi rút earnings: ' + error.message)
      }
    }
    
    const loadbloggerEarnings = async () => {
      if (!userIsBlogger.value || !address.value) return
      
      try {
        const earnings = await walletStore.getbloggerEarnings()
        bloggerEarnings.value = parseFloat(earnings).toFixed(2)
      } catch (error) {
        console.error('Load blogger earnings error:', error)
      }
    }
    
    const handleBuyTokensSuccess = () => {
      showBuyTokensModal.value = false
      refreshBalances()
    }
    
    // Close menu when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.relative')) {
        showWalletMenu.value = false
      }
    }
    
    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
      
      // Load blogger earnings if user is blogger and wallet is connected
      if (userIsBlogger.value && isConnected.value) {
        loadbloggerEarnings()
      }
    })
    
    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })
    
    return {
      showWalletMenu,
      showBuyTokensModal,
      bloggerEarnings,
      isConnected,
      address,
      formattedBalance,
      formattedTokenBalance,
      network,
      connecting,
      isMetaMaskInstalled,
      userIsBlogger,
      formatAddress,
      connectWallet,
      disconnect,
      refreshBalances,
      copyAddress,
      openBuyTokens,
      withdrawEarnings,
      handleBuyTokensSuccess
    }
  }
}
</script>




