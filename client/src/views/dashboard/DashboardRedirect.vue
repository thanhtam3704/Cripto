<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
    <div class="text-center">
      <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
      <p class="text-gray-600 font-medium">Đang chuyển hướng...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

onMounted(() => {
  // Redirect based on user role
  if (authStore.user?.role === 'blogger') {
    router.replace({ name: 'BloggerDashboard' })
  } else {
    router.replace({ name: 'ReaderDashboard' })
  }
})
</script>
