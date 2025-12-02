<template>
  <div class="reader-dashboard min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8 text-center md:text-left">
        <h1 class="text-2xl md:text-3xl font-black mb-3">
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
            Bảng điều khiển Người đọc
          </span>
        </h1>
        <p class="text-xl text-gray-600">
          Theo dõi hoạt động đọc và token đã tặng
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-2xl shadow-xl p-6 border border-blue-100 hover:shadow-2xl transition-all hover:-translate-y-1">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold text-gray-600 mb-1">Bài viết đã đọc</p>
              <p class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                {{ stats.blogsRead }}
              </p>
            </div>
            <div class="p-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl shadow-inner">
              <svg
                class="w-7 h-7 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-xl p-6 border border-yellow-100 hover:shadow-2xl transition-all hover:-translate-y-1">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold text-gray-600 mb-1">Token đã tặng</p>
              <p class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600">
                {{ stats.totalAmountTipped.toFixed(2) }}
              </p>
              <p class="text-xs text-gray-500 mt-1">{{ stats.tipsSent }} lần tặng</p>
            </div>
            <div class="p-4 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl shadow-inner">
              <svg
                class="w-7 h-7 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-xl p-6 border border-pink-100 hover:shadow-2xl transition-all hover:-translate-y-1">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold text-gray-600 mb-1">Đã đánh dấu</p>
              <p class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-600">
                {{ stats.bookmarked }}
              </p>
            </div>
            <div class="p-4 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl shadow-inner">
              <svg
                class="w-7 h-7 text-pink-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl mb-8 border border-indigo-100">
        <div class="px-6 py-5 border-b border-indigo-100">
          <h2 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Hoạt động gần đây
          </h2>
        </div>

        <div class="p-6">
          <div v-if="loading" class="flex flex-col items-center justify-center py-16">
            <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mb-4"></div>
            <p class="text-gray-600 font-medium">Đang tải...</p>
          </div>

          <div v-else-if="recentArticles.length" class="space-y-4">
            <div
              v-for="article in recentArticles"
              :key="article._id"
              class="group flex items-center gap-4 p-5 border-2 border-gray-100 rounded-xl hover:border-indigo-200 hover:shadow-lg transition-all bg-gradient-to-r from-white to-indigo-50/30"
            >
              <img
                v-if="article.coverImage"
                :src="article.coverImage"
                :alt="article.title"
                class="w-28 h-28 object-cover rounded-xl border-2 border-indigo-100 shadow-md group-hover:scale-105 transition-transform"
              />
              <div class="flex-1">
                <h3 class="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {{ article.title }}
                </h3>
                <p class="text-sm text-gray-600 mb-3 line-clamp-2">
                  {{ article.content?.substring(0, 100) || 'Nội dung bài viết...' }}
                </p>
                <div class="flex items-center gap-4 text-sm text-gray-500">
                  <span class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {{ article.author?.username || 'Ẩn danh' }}
                  </span>
                  <span class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ article.readingTime || 5 }} phút đọc
                  </span>
                </div>
              </div>
              <router-link
                :to="`/blog/${article._id}`"
                class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-semibold whitespace-nowrap"
              >
                📖 Đọc
              </router-link>
            </div>
          </div>

          <div v-else class="text-center py-16">
            <svg
              class="w-24 h-24 text-gray-300 mx-auto mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 class="text-2xl font-bold text-gray-900 mb-3">📚 Chưa có hoạt động</h3>
            <p class="text-gray-600 mb-8 text-lg">Bắt đầu khám phá những bài viết thú vị ngay!</p>
            <router-link
              to="/blogs"
              class="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-xl font-semibold text-lg"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Khám phá bài viết
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useBlogStore } from "@/stores/blog";
import { useAuthStore } from "@/stores/auth";
import api from "@/services/api";
import blockchainService from "@/services/blockchain";

const blogStore = useBlogStore();
const authStore = useAuthStore();

const loading = ref(false);

const stats = ref({
  articlesRead: 0,
  tipsSent: 0,
  totalAmountTipped: 0,
  bookmarked: 0,
});

const recentArticles = ref([]);

onMounted(async () => {
  await loadRecentArticles();
  await loadTipStats();
});

const loadTipStats = async () => {
  try {
    // Try to load from blockchain first (real-time data)
    if (blockchainService.isConnected() || authStore.user?.walletAddress) {
      try {
        const walletAddress = authStore.user?.walletAddress || blockchainService.getCurrentAccount();
        
        if (walletAddress) {
          // Connect if not connected
          if (!blockchainService.isConnected()) {
            await blockchainService.connectWallet();
          }
          
          // Get total tips from blockchain
          const totalTips = await blockchainService.getViewerTotalTips(walletAddress);
          const totalAmount = parseFloat(totalTips) || 0;
          
          if (totalAmount > 0) {
            stats.value.totalAmountTipped = totalAmount;
            // Estimate number of tips (average 10 TIP per tip)
            stats.value.tipsSent = Math.ceil(totalAmount / 10);
            return; // Use blockchain data
          }
        }
      } catch (blockchainError) {
        console.warn('Could not load from blockchain:', blockchainError);
        // Fall through to database
      }
    }
    
    // Fallback: Load from database
    const response = await api.get('/tips/sent', {
      params: { limit: 1000 } // Get all tips
    });
    
    if (response.data.success) {
      const tips = response.data.data || [];
      stats.value.tipsSent = tips.length;
      stats.value.totalAmountTipped = tips.reduce((sum, tip) => sum + (tip.amount || 0), 0);
    }
  } catch (error) {
    console.error('Load tip stats error:', error);
    // Keep default values if error
  }
};

const loadRecentArticles = async () => {
  loading.value = true;
  try {
    const result = await blogStore.fetchblogs({
      sort: "-createdAt",
      limit: 10,
    });

    if (result.success) {
      recentArticles.value = result.blogs;
    }
  } catch (error) {
    console.error("Load recent articles error:", error);
  } finally {
    loading.value = false;
  }
};
</script>
