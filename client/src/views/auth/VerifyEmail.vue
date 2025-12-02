<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center px-4">
    <div class="max-w-md w-full">
      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Đang xác thực email...</h2>
        <p class="text-gray-600">Vui lòng đợi trong giây lát</p>
      </div>

      <!-- Success State -->
      <div v-else-if="success" class="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">🎉 Xác thực thành công!</h2>
        <p class="text-gray-600 mb-6">Tài khoản của bạn đã được kích hoạt.</p>
        
        <button
          @click="redirectToDashboard"
          class="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
        >
          Đi đến Dashboard
        </button>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">❌ Xác thực thất bại</h2>
        <p class="text-gray-600 mb-6">{{ errorMessage }}</p>
        
        <div class="space-y-3">
          <button
            @click="resendVerification"
            :disabled="resending"
            class="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50"
          >
            {{ resending ? 'Đang gửi...' : '📧 Gửi lại email xác thực' }}
          </button>
          
          <button
            @click="$router.push('/login')"
            class="w-full border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200"
          >
            Quay lại đăng nhập
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import api from '@/services/api'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const toast = useToast()

const loading = ref(true)
const success = ref(false)
const error = ref(false)
const errorMessage = ref('')
const resending = ref(false)

const verifyEmail = async () => {
  try {
    const token = route.params.token
    
    if (!token) {
      throw new Error('Token xác thực không hợp lệ')
    }

    const response = await api.get(`/auth/verify-email/${token}`)
    
    if (response.data.success) {
      success.value = true
      
      // Nếu API trả về token và user, tự động đăng nhập
      if (response.data.data.token && response.data.data.user) {
        authStore.setAuth(response.data.data.token, response.data.data.user)
        toast.success('Xác thực thành công! Chào mừng bạn đến với Crypto Tip!')
      }
    }
  } catch (err) {
    error.value = true
    errorMessage.value = err.response?.data?.message || 'Link xác thực không hợp lệ hoặc đã hết hạn'
  } finally {
    loading.value = false
  }
}

const redirectToDashboard = () => {
  const user = authStore.user
  if (user.role === 'blogger') {
    router.push('/blogger/dashboard')
  } else {
    router.push('/reader/dashboard')
  }
}

const resendVerification = async () => {
  try {
    resending.value = true
    
    // Yêu cầu nhập email
    const email = prompt('Nhập email của bạn để nhận lại email xác thực:')
    if (!email) return
    
    await api.post('/auth/resend-verification', { email })
    toast.success('Email xác thực đã được gửi lại! Vui lòng kiểm tra hộp thư.')
    
  } catch (err) {
    toast.error(err.response?.data?.message || 'Không thể gửi email. Vui lòng thử lại.')
  } finally {
    resending.value = false
  }
}

onMounted(() => {
  verifyEmail()
})
</script>
