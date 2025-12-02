import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiService from '@/services/api'
import { useToast } from 'vue-toastification'

export const useAuthStore = defineStore('auth', () => {
  const toast = useToast()
  
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const loading = ref(false)
  
  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isBlogger = computed(() => user.value?.role === 'blogger')
  const isViewer = computed(() => user.value?.role === 'viewer')
  
  // Actions
  const setAuth = (userData, authToken) => {
    user.value = userData
    token.value = authToken
    localStorage.setItem('token', authToken)
    apiService.setAuthToken(authToken)
  }
  
  const clearAuth = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    apiService.clearAuthToken()
  }
  
  const register = async (userData) => {
    try {
      loading.value = true
      const response = await apiService.post('/auth/register', userData)
      
      if (response.data.success) {
        // KHÔNG tự động set auth vì cần verify email trước
        // Backend không trả về token nữa
        return { success: true, data: response.data.data }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Lỗi đăng ký'
      toast.error(message)
      return { success: false, message }
    } finally {
      loading.value = false
    }
  }
  
  const login = async (credentials) => {
    try {
      loading.value = true
      const response = await apiService.post('/auth/login', credentials)
      
      if (response.data.success) {
        setAuth(response.data.data.user, response.data.data.token)
        toast.success('Đăng nhập thành công!')
        return { success: true }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Lỗi đăng nhập'
      toast.error(message)
      return { success: false, message }
    } finally {
      loading.value = false
    }
  }
  
  const walletLogin = async (walletData) => {
    try {
      loading.value = true
      const response = await apiService.post('/auth/wallet-login', walletData)
      
      if (response.data.success) {
        setAuth(response.data.data.user, response.data.data.token)
        toast.success('Đăng nhập wallet thành công!')
        return { success: true, isNewUser: response.data.data.isNewUser }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Lỗi đăng nhập wallet'
      toast.error(message)
      return { success: false, message }
    } finally {
      loading.value = false
    }
  }
  
  const logout = async () => {
    try {
      await apiService.post('/auth/logout')
      clearAuth()
      toast.success('Đăng xuất thành công!')
    } catch (error) {
      // Silent fail for logout
      clearAuth()
    }
  }
  
  const checkAuth = async () => {
    if (!token.value) {
      loading.value = false
      return
    }
    
    try {
      loading.value = true
      apiService.setAuthToken(token.value)
      const response = await apiService.get('/auth/verify')
      
      if (response.data.success) {
        user.value = response.data.data.user
      } else {
        clearAuth()
      }
    } catch (error) {
      clearAuth()
    } finally {
      loading.value = false
    }
  }
  
  const updateProfile = async (profileData) => {
    try {
      loading.value = true
      const response = await apiService.put('/users/profile', profileData)
      
      if (response.data.success) {
        user.value = response.data.data.user
        toast.success('Cập nhật profile thành công!')
        return { success: true }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Lỗi cập nhật profile'
      toast.error(message)
      return { success: false, message }
    } finally {
      loading.value = false
    }
  }
  
  const getWalletNonce = async (walletAddress) => {
    try {
      const response = await apiService.get(`/auth/wallet-nonce/${walletAddress}`)
      return response.data.data
    } catch (error) {
      throw error
    }
  }
  
  // Google OAuth methods
  const setAuthData = async (authData) => {
    setAuth(authData.user, authData.token)
    return { success: true }
  }
  
  return {
    // State
    user,
    token,
    loading,
    
    // Getters
    isAuthenticated,
    isBlogger,
    isViewer,
    
    // Actions
    register,
    login,
    walletLogin,
    logout,
    checkAuth,
    updateProfile,
    getWalletNonce,
    setAuth,
    clearAuth,
    setAuthData
  }
})


