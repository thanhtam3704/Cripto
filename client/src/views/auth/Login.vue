<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-gradient-to-r from-primary-500 to-purple-600">
          <span class="text-white font-bold text-xl">₿</span>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Đăng nhập vào tài khoản
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Hoặc
          <router-link to="/register" class="font-medium text-primary-600 hover:text-primary-500">
            tạo tài khoản mới
          </router-link>
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="form-input mt-1 w-full"
              placeholder="Nhập địa chỉ email"
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="form-input mt-1 w-full"
              placeholder="Nhập mật khẩu"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="form.rememberMe"
              type="checkbox"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              Ghi nhớ đăng nhập
            </label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-primary-600 hover:text-primary-500">
              Quên mật khẩu?
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            <span v-if="loading" class="spinner w-4 h-4 mr-2"></span>
            {{ loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
          </button>
        </div>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-gray-50 text-gray-500">Hoặc đăng nhập bằng</span>
            </div>
          </div>

          <div class="mt-6 space-y-3">
            <!-- Google Sign-In Button -->
            <GoogleSignInButton button-text="Đăng nhập với Google" />
            
            <!-- Wallet Login Button -->
            <button
              type="button"
              @click="handleWalletLogin"
              :disabled="walletLoading"
              class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <WalletIcon class="w-5 h-5 mr-2" />
              {{ walletLoading ? 'Đang kết nối...' : 'Kết nối Wallet' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import { WalletIcon } from '@heroicons/vue/24/outline'
import GoogleSignInButton from '@/components/auth/GoogleSignInButton.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const toast = useToast()

// State
const form = ref({
  email: '',
  password: '',
  rememberMe: false
})

const loading = ref(false)
const walletLoading = ref(false)

// Methods
const handleSubmit = async () => {
  try {
    loading.value = true
    
    const result = await authStore.login(form.value)
    
    // Toast đã được hiển thị trong store, không cần duplicate
    if (result.success) {
      // Redirect to intended page or home
      const redirect = route.query.redirect || '/'
      router.push(redirect)
    }
    
  } catch (error) {
    // Error toast đã được hiển thị trong store
    console.error('Login error:', error)
  } finally {
    loading.value = false
  }
}

const handleWalletLogin = async () => {
  try {
    walletLoading.value = true
    
    const result = await authStore.walletLogin()
    
    // Toast đã được hiển thị trong store, không cần duplicate
    if (result.success) {
      // Redirect to intended page or home
      const redirect = route.query.redirect || '/'
      router.push(redirect)
    }
    
  } catch (error) {
    // Error toast đã được hiển thị trong store
    console.error('Wallet login error:', error)
  } finally {
    walletLoading.value = false
  }
}

onMounted(() => {
  // If already authenticated, redirect to home
  if (authStore.isAuthenticated) {
    router.push('/')
  }
  
  // Check if user just registered
  if (route.query.registered === 'true') {
    const email = route.query.email
    toast.info(
      `📧 Vui lòng kiểm tra email ${email ? `(${email})` : ''} để xác thực tài khoản trước khi đăng nhập.`,
      { timeout: 8000 }
    )
    
    // Clear query params
    router.replace({ name: 'Login' })
  }
  
  // Pre-fill email if provided
  if (route.query.email) {
    form.value.email = route.query.email
  }
})
</script>



