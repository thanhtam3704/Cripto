<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-gradient-to-r from-primary-500 to-purple-600">
          <span class="text-white font-bold text-xl">₿</span>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Tạo tài khoản mới
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Hoặc
          <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
            đăng nhập nếu đã có tài khoản
          </router-link>
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <!-- Account Type Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">
            Loại tài khoản
          </label>
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              @click="form.role = 'reader'"
              :class="[
                'relative rounded-lg border p-4 flex flex-col items-center space-y-2 focus:outline-none',
                form.role === 'reader' 
                  ? 'border-primary-600 ring-2 ring-primary-600 bg-primary-50' 
                  : 'border-gray-300 hover:border-gray-400'
              ]"
            >
              <EyeIcon class="w-8 h-8 text-gray-600" />
              <span class="text-sm font-medium">Reader</span>
              <span class="text-xs text-gray-500">Đọc và tip bài viết</span>
            </button>
            
            <button
              type="button"
              @click="form.role = 'blogger'"
              :class="[
                'relative rounded-lg border p-4 flex flex-col items-center space-y-2 focus:outline-none',
                form.role === 'blogger' 
                  ? 'border-primary-600 ring-2 ring-primary-600 bg-primary-50' 
                  : 'border-gray-300 hover:border-gray-400'
              ]"
            >
              <VideoCameraIcon class="w-8 h-8 text-gray-600" />
              <span class="text-sm font-medium">Blogger</span>
              <span class="text-xs text-gray-500">Viết blog và nhận tip</span>
            </button>
          </div>
        </div>

        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email *
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
              Mật khẩu *
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="form-input mt-1 w-full"
              placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
            />
          </div>
          
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              Xác nhận mật khẩu *
            </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              required
              class="form-input mt-1 w-full"
              placeholder="Nhập lại mật khẩu"
            />
          </div>
          
          <div>
            <label for="displayName" class="block text-sm font-medium text-gray-700">
              Tên hiển thị *
            </label>
            <input
              id="displayName"
              v-model="form.displayName"
              type="text"
              required
              class="form-input mt-1 w-full"
              placeholder="Tên của bạn sẽ hiển thị cho mọi người"
            />
          </div>
          
          <!-- Writer specific fields -->
          <div v-if="form.role === 'blogger'" class="space-y-4">
            <div>
              <label for="bio" class="block text-sm font-medium text-gray-700 ">
                Mô tả bản thân
              </label>
              <textarea
                id="bio"
                v-model="form.bio"
                rows="3"
                class="form-textarea mt-1 w-full"
                placeholder="Giới thiệu về bạn và loại nội dung bạn tạo ra..."
              ></textarea>
            </div>
            
            <div>
              <label for="categories" class="block text-sm font-medium text-gray-700">
                Lĩnh vực quan tâm
              </label>
              <select
                id="categories"
                v-model="form.categories"
                multiple
                class="form-input mt-1 w-full"
              >
                <option value="gaming">Gaming</option>
                <option value="tech">Công nghệ</option>
                <option value="cooking">Nấu ăn</option>
                <option value="music">Âm nhạc</option>
                <option value="art">Nghệ thuật</option>
                <option value="education">Giáo dục</option>
                <option value="entertainment">Giải trí</option>
                <option value="lifestyle">Lối sống</option>
              </select>
              <p class="text-xs text-gray-500 mt-1">Giữ Ctrl/Cmd để chọn nhiều lĩnh vực</p>
            </div>
          </div>
        </div>

        <!-- Terms and Conditions -->
        <div class="flex items-center">
          <input
            id="terms"
            v-model="form.agreeTerms"
            type="checkbox"
            required
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label for="terms" class="ml-2 block text-sm text-gray-900">
            Tôi đồng ý với
            <a href="#" class="text-primary-600 hover:text-primary-500">Điều khoản sử dụng</a>
            và
            <a href="#" class="text-primary-600 hover:text-primary-500">Chính sách bảo mật</a>
          </label>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            <span v-if="loading" class="spinner w-4 h-4 mr-2"></span>
            {{ loading ? 'Đang tạo tài khoản...' : 'Đăng ký' }}
          </button>
        </div>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-gray-50 text-gray-500">Hoặc đăng ký bằng</span>
            </div>
          </div>

          <div class="mt-6 space-y-3">
            <!-- Google Sign-In Button -->
            <GoogleSignInButton button-text="Đăng ký với Google" />
            
            <!-- Wallet Register Button -->
            <button
              type="button"
              @click="handleWalletRegister"
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
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import { 
  WalletIcon, 
  EyeIcon, 
  VideoCameraIcon 
} from '@heroicons/vue/24/outline'
import GoogleSignInButton from '@/components/auth/GoogleSignInButton.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const toast = useToast()

// State
const form = ref({
  role: 'reader', // Default role
  email: '',
  password: '',
  confirmPassword: '',
  displayName: '',
  bio: '',
  categories: [],
  agreeTerms: false
})

const loading = ref(false)
const walletLoading = ref(false)

// Computed
const isFormValid = computed(() => {
  return form.value.email && 
         form.value.password && 
         form.value.password === form.value.confirmPassword &&
         form.value.displayName &&
         form.value.agreeTerms &&
         form.value.password.length >= 6
})

// Methods
const handleSubmit = async () => {
  // Validate passwords match
  if (form.value.password !== form.value.confirmPassword) {
    toast.error('Mật khẩu xác nhận không khớp')
    return
  }

  // Validate password length
  if (form.value.password.length < 6) {
    toast.error('Mật khẩu phải có ít nhất 6 ký tự')
    return
  }

  try {
    loading.value = true
    
    const userData = {
      email: form.value.email,
      password: form.value.password,
      role: form.value.role
      // Backend sẽ tự động tạo username từ email nếu không có
    }
    
    // Thêm displayName nếu có
    if (form.value.displayName) {
      userData.username = form.value.displayName.toLowerCase().replace(/\s+/g, '_')
    }

    if (form.value.role === 'blogger' && form.value.categories.length > 0) {
      userData.categories = form.value.categories
    }
    
    const result = await authStore.register(userData)
    
    if (result.success) {
      // Redirect đến trang login với thông báo
      // Toast sẽ hiển thị ở Login.vue để tránh duplicate
      router.push({
        name: 'Login',
        query: { 
          registered: 'true',
          email: form.value.email
        }
      })
    }
    
  } catch (error) {
    // Error toast đã được hiển thị trong store
    console.error('Register error:', error)
  } finally {
    loading.value = false
  }
}

const handleWalletRegister = async () => {
  try {
    walletLoading.value = true
    
    const result = await authStore.walletLogin(form.value.role)
    
    // Toast đã được hiển thị trong store, không cần duplicate
    if (result.success) {
      // Redirect to intended page or home
      const redirect = route.query.redirect || '/'
      router.push(redirect)
    }
    
  } catch (error) {
    // Error toast đã được hiển thị trong store
    console.error('Wallet register error:', error)
  } finally {
    walletLoading.value = false
  }
}

onMounted(() => {
  // If already authenticated, redirect to home
  if (authStore.isAuthenticated) {
    router.push('/')
  }
  
  // Check if role is specified in query params
  const roleFromQuery = route.query.type
  if (roleFromQuery === 'blogger') {
    form.value.role = 'blogger'
  }
})
</script>

<style scoped>
select[multiple] {
  min-height: 120px;
}
</style>




