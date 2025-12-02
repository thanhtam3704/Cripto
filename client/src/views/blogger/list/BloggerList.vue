<template>
  <div class="bloggers-list min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Bloggers nổi bật
        </h1>
        <p class="text-lg text-gray-600 flex items-center justify-center gap-2">
          <svg class="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Khám phá những bloggers tài năng và theo dõi họ ngay!
        </p>
      </div>

      <div class="max-w-2xl mx-auto mb-8">
        <div class="relative">
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            class="w-full px-6 py-4 pl-14 text-lg border-2 border-purple-300 rounded-2xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all shadow-lg bg-white"
            placeholder="Tìm kiếm bloggers..."
          />
          <svg class="w-6 h-6 text-purple-500 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div v-if="isLoading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mb-4"></div>
        <p class="text-gray-600 font-medium">Đang tải danh sách bloggers...</p>
      </div>

      <div v-else-if="bloggers.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="blogger in bloggers"
          :key="blogger._id"
          class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 cursor-pointer border-2 border-transparent hover:border-purple-200 transform hover:-translate-y-1"
          @click="viewBlogger(blogger)"
        >
          <div class="text-center">
            <div class="mb-4">
              <img
                v-if="blogger.profile?.avatar"
                :src="getAvatarUrl(blogger.profile.avatar)"
                :alt="blogger.profile?.displayName || blogger.username"
                class="w-24 h-24 rounded-full mx-auto object-cover mb-4 ring-4 ring-purple-200 shadow-lg"
              />

              <div v-else class="w-24 h-24 rounded-full mx-auto bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 flex items-center justify-center text-white text-3xl font-bold mb-4 ring-4 ring-purple-200 shadow-lg">
                {{ (blogger.profile?.displayName || blogger.username).charAt(0).toUpperCase() }}
              </div>
            </div>
            
            <h3 class="font-bold text-xl text-gray-900 mb-1 flex items-center justify-center gap-1">
              {{ blogger.profile?.displayName || blogger.username }}
              <svg class="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </h3>
            <p class="text-sm text-gray-500 mb-4">@{{ blogger.username }}</p>
            
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div class="text-center bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-3 border border-blue-100">
                <div class="text-xl font-bold text-blue-600">{{ blogger.bloggerStats?.totalArticles || 0 }}</div>
                <div class="text-xs text-gray-600 font-medium">Bài viết</div>
              </div>
              <div class="text-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 border border-green-100">
                <div class="text-xl font-bold text-green-600">
                  {{ blogger.blockchainLoaded ? blogger.blockchainEarnings.toFixed(2) : '0.00' }}
                </div>
                <div class="text-xs text-gray-600 font-medium">Tokens</div>
              </div>
            </div>
            
            <!-- Nút theo dõi: Ẩn nếu là chính mình -->
            <button
              v-if="authStore.isAuthenticated && blogger._id !== authStore.user?._id && blogger._id !== authStore.user?.id"
              @click.stop="toggleFollow(blogger)"
              :class="[
                'w-full py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg',
                blogger.isFollowing 
                  ? 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 hover:from-gray-300 hover:to-gray-400' 
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
              ]"
            >
              {{ blogger.isFollowing ? '✓ Đang theo dõi' : '➕ Theo dõi' }}
            </button>

            <!-- Nút xem chi tiết: Hiện nếu chưa login hoặc là chính mình -->
            <button
              v-else-if="!authStore.isAuthenticated || blogger._id === authStore.user?._id || blogger._id === authStore.user?.id"
              @click.stop="viewBlogger(blogger)"
              class="w-full py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
            >
              {{ authStore.isAuthenticated && (blogger._id === authStore.user?._id || blogger._id === authStore.user?.id) ? '👤 Xem profile' : '👁️ Xem chi tiết' }}
            </button>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-20">
        <svg class="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy bloggers</h3>
        <p class="text-gray-600">Thử tìm kiếm với từ khóa khác</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import apiService from '@/services/api'
import blockchainService from '@/services/blockchain'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

const bloggers = ref([])
const isLoading = ref(false)
const searchQuery = ref('')

const loadBloggers = async (search = '') => {
  try {
    isLoading.value = true
    const params = {}
    if (search) params.search = search
    
    const response = await apiService.get('/users/bloggers', { params })
    if (response.data.success) {
      // Thêm thuộc tính isFollowing và blockchainEarnings cho mỗi blogger
      bloggers.value = response.data.data.map(blogger => ({
        ...blogger,
        isFollowing: false, // Mặc định chưa follow, sẽ check từ API sau
        blockchainEarnings: 0, // Earnings từ blockchain
        blockchainLoaded: false // Flag để biết đã load blockchain chưa
      }))
      
      // Nếu user đã đăng nhập, check follow status
      if (authStore.isAuthenticated) {
        await checkFollowStatus()
      }
      
      // Load blockchain earnings cho tất cả bloggers có wallet
      await loadBlockchainEarnings()
    }
  } catch (error) {
    toast.error('Không thể tải danh sách bloggers')
  } finally {
    isLoading.value = false
  }
}

// Kiểm tra trạng thái follow của user hiện tại
const checkFollowStatus = async () => {
  try {
    const profileResponse = await apiService.get('/users/profile')
    if (profileResponse.data.success) {
      const userData = profileResponse.data.data.user
      
      // Lấy following list từ readerStats hoặc bloggerStats
      let followingIds = []
      if (userData.role === 'reader') {
        followingIds = userData.readerStats?.following || []
      } else if (userData.role === 'blogger') {
        followingIds = userData.bloggerStats?.following || []
      }
      
      // Cập nhật isFollowing cho từng blogger
      bloggers.value = bloggers.value.map(blogger => ({
        ...blogger,
        isFollowing: followingIds.some(f => f._id === blogger._id || f === blogger._id)
      }))
    }
  } catch (error) {
    // Nếu chưa đăng nhập thì bỏ qua
    console.log('User chưa đăng nhập hoặc không thể check follow status')
  }
}

// Load blockchain earnings cho tất cả bloggers có wallet
const loadBlockchainEarnings = async () => {
  try {
    console.log('Loading blockchain earnings for bloggers:', bloggers.value.length);
    
    // Load earnings cho từng blogger có wallet address
    const promises = bloggers.value.map(async (blogger) => {
      console.log(`Blogger ${blogger.username}:`, {
        hasWallet: !!blogger.walletAddress,
        walletAddress: blogger.walletAddress
      });
      
      if (blogger.walletAddress) {
        try {
          const earnings = await blockchainService.getCreatorEarnings(blogger.walletAddress)
          console.log(`Earnings for ${blogger.username}:`, earnings);
          blogger.blockchainEarnings = parseFloat(earnings)
          blogger.blockchainLoaded = true
        } catch (error) {
          console.error(`Failed to load blockchain earnings for ${blogger.username}:`, error)
          // Giữ nguyên giá trị 0 nếu lỗi
        }
      } else {
        console.log(`${blogger.username} has no wallet address`);
      }
    })
    
    await Promise.all(promises)
    console.log('Finished loading blockchain earnings');
  } catch (error) {
    console.error('Load blockchain earnings error:', error)
  }
}

let searchTimeout = null
const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => loadBloggers(searchQuery.value), 500)
}

const toggleFollow = async (blogger) => {
  // Kiểm tra đã đăng nhập chưa
  if (!authStore.isAuthenticated) {
    toast.info('Vui lòng đăng nhập để theo dõi blogger')
    router.push('/login')
    return
  }
  
  try {
    // Sử dụng đúng endpoint: /api/users/:bloggerId/follow
    const response = await apiService.post(`/users/${blogger._id}/follow`)
    if (response.data.success) {
      const wasFollowing = blogger.isFollowing;
      
      // Cập nhật trạng thái follow
      blogger.isFollowing = response.data.data.isFollowing
      
      // Cập nhật followersCount
      if (!blogger.bloggerStats) {
        blogger.bloggerStats = {};
      }
      
      if (response.data.data.isFollowing && !wasFollowing) {
        // Đã follow: tăng count
        blogger.bloggerStats.followersCount = (blogger.bloggerStats.followersCount || 0) + 1;
        toast.success('✅ Đã theo dõi')
      } else if (!response.data.data.isFollowing && wasFollowing) {
        // Đã unfollow: giảm count
        blogger.bloggerStats.followersCount = Math.max((blogger.bloggerStats.followersCount || 1) - 1, 0);
        toast.info('❌ Đã hủy theo dõi')
      }
    }
  } catch (error) {
    console.error('Toggle follow error:', error)
    toast.error(error.response?.data?.message || 'Không thể thực hiện thao tác')
  }
}

const viewBlogger = (blogger) => {
  router.push(`/blogger/${blogger._id}`)
}

onMounted(() => loadBloggers())

// Helper to return avatar URL with cache-busting for Cloudinary
const getAvatarUrl = (url) => {
  if (!url) return url;
  try {
    if (url.includes('cloudinary.com')) {
      return `${url}?t=${Date.now()}`;
    }
    return url;
  } catch (e) {
    return url;
  }
}
</script>