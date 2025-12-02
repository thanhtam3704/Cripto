<template>
  <div class="auth-callback min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-6">
      <div class="text-center">
        <div v-if="loading" class="space-y-4">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <h2 class="text-xl font-semibold text-gray-900">Đang đăng nhập...</h2>
          <p class="text-gray-600">Vui lòng đợi trong giây lát</p>
        </div>
        
        <div v-else-if="error" class="space-y-4">
          <div class="text-red-500 text-4xl">❌</div>
          <h2 class="text-xl font-semibold text-red-600">Đăng nhập thất bại</h2>
          <p class="text-gray-600">{{ error }}</p>
          <router-link 
            to="/login" 
            class="inline-block bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Thử lại
          </router-link>
        </div>
        
        <div v-else class="space-y-4">
          <div class="text-green-500 text-4xl">✅</div>
          <h2 class="text-xl font-semibold text-green-600">Đăng nhập thành công!</h2>
          <p class="text-gray-600">Chúng tôi đang chuyển hướng bạn...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const { token, user, error: urlError } = route.query
    
    if (urlError) {
      error.value = getErrorMessage(urlError)
      loading.value = false
      return
    }
    
    if (!token || !user) {
      error.value = 'Thông tin đăng nhập không hợp lệ'
      loading.value = false
      return
    }
    
    // Parse user data
    const userData = JSON.parse(decodeURIComponent(user))
    
    // Save auth data to store
    await authStore.setAuthData({
      token: token,
      user: userData
    })
    
    // Success - redirect to dashboard or home
    loading.value = false
    
    setTimeout(() => {
      if (userData.role === 'blogger') {
        router.push('/blogger/dashboard')
      } else {
        router.push('/dashboard')
      }
    }, 1500)
    
  } catch (err) {
    console.error('Auth callback error:', err)
    error.value = 'Có lỗi xảy ra khi xử lý đăng nhập'
    loading.value = false
  }
})

const getErrorMessage = (errorCode) => {
  const messages = {
    'oauth_failed': 'Đăng nhập Google thất bại. Vui lòng thử lại.',
    'callback_failed': 'Có lỗi xảy ra trong quá trình đăng nhập.',
    'access_denied': 'Bạn đã từ chối quyền truy cập.',
    'invalid_request': 'Yêu cầu không hợp lệ.'
  }
  return messages[errorCode] || 'Có lỗi không xác định xảy ra.'
}
</script>




