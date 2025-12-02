<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Auth Loading State -->
    <div v-if="authStore.loading" class="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Đang tải...</p>
      </div>
    </div>

    <!-- Main App -->
    <template v-else>
      <!-- Navigation -->
      <Navbar />
      
      <!-- Main content -->
      <main class="flex-1">
        <router-view />
      </main>
      
      <!-- Footer -->
      <Footer />
      
      <!-- Wallet Connection Modal -->
      <WalletModal 
        v-if="showWalletModal" 
        @close="showWalletModal = false" 
      />
    </template>
  </div>
</template>

<script>
import { ref } from 'vue'
import Navbar from './components/layout/Navbar.vue'
import Footer from './components/layout/Footer.vue'
import WalletModal from './components/wallet/WalletModal.vue'
import { useWalletStore } from './stores/wallet'
import { useAuthStore } from './stores/auth'

export default {
  name: 'App',
  components: {
    Navbar,
    Footer,
    WalletModal
  },
  setup() {
    const showWalletModal = ref(false)
    const walletStore = useWalletStore()
    const authStore = useAuthStore()
    
    // Initialize wallet (non-blocking)
    walletStore.initializeWallet()
    
    return {
      showWalletModal,
      authStore
    }
  }
}
</script>

<style>
/* Global styles */
#app {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>


