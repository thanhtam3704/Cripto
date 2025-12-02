<template>
  <div class="writer-dashboard min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8 text-center md:text-left">
        <h1 class="text-2xl md:text-3xl font-black mb-3">
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
           Bảng điều khiển Blogger
          </span>
        </h1>
        <p class="text-xl text-gray-600">
          Quản lý bài viết và theo dõi thu nhập của bạn
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-2xl shadow-xl p-6 border border-blue-100 hover:shadow-2xl transition-all hover:-translate-y-1">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold text-gray-600 mb-1">Tổng bài viết</p>
              <p class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                {{ stats.totalArticles }}
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-xl p-6 border border-green-100 hover:shadow-2xl transition-all hover:-translate-y-1">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold text-gray-600 mb-1">Tổng lượt xem</p>
              <p class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                {{ formatNumber(stats.totalViews) }}
              </p>
            </div>
            <div class="p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl shadow-inner">
              <svg
                class="w-7 h-7 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-xl p-6 border border-yellow-100 hover:shadow-2xl transition-all hover:-translate-y-1">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold text-gray-600 mb-1">Tổng tip</p>
              <p class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600">
                {{ stats.totalTips }} TIP
              </p>
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

        <div class="bg-white rounded-2xl shadow-xl p-6 border border-purple-100 hover:shadow-2xl transition-all hover:-translate-y-1">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold text-gray-600 mb-1">Tổng lượt thích</p>
              <p class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600">
                {{ formatNumber(stats.totalLikes) }}
              </p>
            </div>
            <div class="p-4 bg-gradient-to-br from-red-100 to-pink-100 rounded-xl shadow-inner">
              <svg
                class="w-7 h-7 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Blockchain Earnings Section -->
      <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-xl p-8 mb-8 border border-green-200">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 flex items-center gap-2">
              <span class="text-3xl">💰</span>
              Blockchain Earnings
            </h2>
            <p class="text-gray-600 mt-1">Quản lý thu nhập từ TIP tokens</p>
          </div>
        </div>

        <!-- Not Connected State -->
        <div v-if="!isWalletConnected" class="text-center py-8">
          <svg class="w-16 h-16 mx-auto mb-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <p class="text-gray-600 mb-4">Kết nối ví để xem và rút thu nhập từ tips</p>
          <button
            @click="connectWallet"
            :disabled="walletLoading"
            class="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all shadow-md disabled:opacity-50"
          >
            {{ walletLoading ? '⏳ Đang kết nối...' : '🔗 Kết nối ví' }}
          </button>
        </div>

        <!-- Connected State -->
        <div v-else class="space-y-6">
          <!-- Earnings Info -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Total Earnings -->
            <div class="bg-white rounded-xl p-6 shadow-md border border-green-200">
              <div class="text-sm text-gray-600 mb-1">Tổng thu nhập</div>
              <div class="text-3xl font-bold text-green-600">{{ totalEarnings }} TIP</div>
              <div class="text-xs text-gray-500 mt-1">Từ blockchain</div>
            </div>

            <!-- Available to Withdraw -->
            <div class="bg-white rounded-xl p-6 shadow-md border border-yellow-200">
              <div class="text-sm text-gray-600 mb-1">Có thể rút</div>
              <div class="text-3xl font-bold text-yellow-600">{{ availableEarnings }} TIP</div>
              <div class="text-xs text-gray-500 mt-1">Chưa rút</div>
            </div>

            <!-- Withdrawn -->
            <div class="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <div class="text-sm text-gray-600 mb-1">Đã rút</div>
              <div class="text-3xl font-bold text-gray-600">{{ withdrawnEarnings }} TIP</div>
              <div class="text-xs text-gray-500 mt-1">Lịch sử rút tiền</div>
            </div>
          </div>

          <!-- Wallet Info -->
          <div class="bg-white rounded-xl p-4 border border-gray-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <div>
                  <div class="text-sm text-gray-600">Địa chỉ ví</div>
                  <div class="font-mono font-semibold">{{ formatAddress(walletAddress) }}</div>
                </div>
              </div>
              <button
                @click="refreshEarnings"
                :disabled="walletLoading"
                class="p-2 hover:bg-gray-100 rounded-lg transition-all"
                title="Làm mới"
              >
                <svg class="w-5 h-5" :class="{ 'animate-spin': walletLoading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Withdraw Button -->
          <div v-if="parseFloat(availableEarnings) > 0" class="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm font-semibold text-yellow-800 mb-1">
                  💡 Bạn có {{ availableEarnings }} TIP chưa rút
                </div>
                <div class="text-xs text-yellow-700">
                  Rút về ví để có thể sử dụng hoặc chuyển đổi
                </div>
              </div>
              <button
                @click="withdrawEarnings"
                :disabled="walletLoading"
                class="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all shadow-md disabled:opacity-50 whitespace-nowrap"
              >
                {{ walletLoading ? '⏳ Đang rút...' : `💸 Rút ${availableEarnings} TIP` }}
              </button>
            </div>
          </div>

          <!-- No Earnings -->
          <div v-else class="text-center py-6 bg-gray-50 rounded-xl border border-gray-200">
            <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-gray-600 font-medium">Chưa có thu nhập nào</p>
            <p class="text-sm text-gray-500 mt-1">Thu nhập sẽ xuất hiện khi có người tip bài viết của bạn</p>
          </div>

          <!-- Disconnect Button -->
          <button
            @click="disconnectWallet"
            class="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all text-sm"
          >
            🔌 Ngắt kết nối ví
          </button>
        </div>
      </div>

      <!-- Crypto Tips Chart -->
      <div class="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-indigo-100">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
             Biểu đồ Tips nhận được
            </h2>
            <p class="text-gray-600 mt-1">Theo dõi tips crypto trong 7 ngày qua</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm font-semibold text-gray-600">Tổng:</span>
            <span class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600">
              {{ stats.totalTips }} TIP
            </span>
          </div>
        </div>

        <!-- Chart Container -->
        <div class="relative h-64">
          <!-- Y-axis labels -->
          <div class="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 pr-2">
            <span>{{ maxTips }}</span>
            <span>{{ Math.round(maxTips * 0.75) }}</span>
            <span>{{ Math.round(maxTips * 0.5) }}</span>
            <span>{{ Math.round(maxTips * 0.25) }}</span>
            <span>0</span>
          </div>

          <!-- Chart Area -->
          <div class="ml-12 h-full flex items-end justify-between gap-2 border-b-2 border-l-2 border-gray-200 pl-4 pb-4">
            <div
              v-for="(day, index) in chartData"
              :key="index"
              class="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
            >
              <!-- Bar -->
              <div class="relative w-full flex items-end justify-center" style="height: 220px">
                <div
                  :style="{ height: (day.tips / maxTips * 100) + '%' }"
                  class="w-full rounded-t-lg transition-all duration-500 hover:opacity-80 relative overflow-hidden"
                  :class="[
                    index === 6 ? 'bg-gradient-to-t from-yellow-500 to-orange-500 shadow-lg shadow-orange-300' :
                    'bg-gradient-to-t from-indigo-400 to-purple-500 hover:from-indigo-500 hover:to-purple-600'
                  ]"
                >
                  <!-- Animated shine effect -->
                  <div class="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent animate-shine"></div>
                </div>

                <!-- Tooltip -->
                <div class="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <div class="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-xl text-sm font-semibold whitespace-nowrap">
                    {{ day.tips }} TIP
                    <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                  </div>
                </div>
              </div>

              <!-- Day label -->
              <div class="text-xs font-semibold text-center" :class="index === 6 ? 'text-orange-600' : 'text-gray-600'">
                {{ day.label }}
              </div>
            </div>
          </div>
        </div>

        <!-- Legend -->
        <div class="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-100">
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded bg-gradient-to-r from-indigo-400 to-purple-500"></div>
            <span class="text-sm text-gray-600">Ngày trước</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded bg-gradient-to-r from-yellow-500 to-orange-500"></div>
            <span class="text-sm text-gray-600">Hôm nay</span>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="mb-8">
        <router-link
          to="/viet-blog"
          class="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 font-semibold text-lg"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          ✨ Viết bài mới
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useBlogStore } from "@/stores/blog";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "vue-toastification";
import blockchainService from "@/services/blockchain";
import apiService from "@/services/api";

const blogStore = useBlogStore();
const authStore = useAuthStore();
const toast = useToast();

// Blockchain state
const isWalletConnected = ref(false);
const walletAddress = ref('');
const walletLoading = ref(false);
const totalEarnings = ref('0.00');
const availableEarnings = ref('0.00');
const withdrawnEarnings = ref('0.00');

const stats = ref({
  totalArticles: 0,
  totalViews: 0,
  totalTips: 0,
  totalLikes: 0,
});

// Chart data - 7 ngày gần nhất
const chartData = ref([
  { label: 'T2', tips: 12 },
  { label: 'T3', tips: 19 },
  { label: 'T4', tips: 8 },
  { label: 'T5', tips: 25 },
  { label: 'T6', tips: 15 },
  { label: 'T7', tips: 22 },
  { label: 'CN', tips: 30 },
]);

// Tính giá trị max cho trục Y
const maxTips = computed(() => {
  const max = Math.max(...chartData.value.map(d => d.tips));
  return Math.ceil(max / 10) * 10; // Round up to nearest 10
});

onMounted(async () => {
  await loadStats();
  await generateChartData();
  
  // Check if wallet already connected
  if (blockchainService.isConnected()) {
    isWalletConnected.value = true;
    walletAddress.value = blockchainService.getCurrentAccount();
    await refreshEarnings();
  }
});

const generateChartData = async () => {
  try {
    // Generate last 7 days labels
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const today = new Date().getDay(); // 0 = Sunday, 6 = Saturday
    
    const labels = [];
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      dates.push(date);
      
      const dayIndex = (today - i + 7) % 7;
      labels.push(days[dayIndex]);
    }
    
    // Get tip events from blockchain
    try {
      const walletAddress = authStore.user?.walletAddress;
      if (!walletAddress) {
        console.log('No wallet address, showing empty chart');
        chartData.value = labels.map(label => ({ label, tips: 0 }));
        return;
      }
      
      // Query blockchain events for last 7 days
      const events = await blockchainService.getCreatorTipEvents(walletAddress, 7);
      console.log('Tip events from blockchain:', events);
      
      // Group tips by day
      const tipsByDay = {};
      dates.forEach((date, index) => {
        tipsByDay[index] = 0;
      });
      
      events.forEach(event => {
        const eventDate = new Date(event.timestamp);
        eventDate.setHours(0, 0, 0, 0);
        
        // Find which day this event belongs to
        dates.forEach((date, index) => {
          if (eventDate.getTime() === date.getTime()) {
            tipsByDay[index] += parseFloat(event.amount) || 0;
          }
        });
      });
      
      // Create chart data with real blockchain values
      chartData.value = labels.map((label, index) => ({
        label,
        tips: Math.round(tipsByDay[index] || 0), // Round to whole number
      }));
      
      console.log('Chart data generated:', chartData.value);
    } catch (error) {
      console.error('Load tip chart data from blockchain error:', error);
      // Fallback to zeros on error
      chartData.value = labels.map(label => ({
        label,
        tips: 0,
      }));
    }
  } catch (error) {
    console.error('Generate chart data error:', error);
  }
};

const loadStats = async () => {
  try {
    // Load published articles to calculate stats
    const result = await blogStore.fetchblogs({
      author: authStore.user?._id,
      limit: 100,
    });

    if (result.success) {
      const articles = result.blogs;
      
      // Calculate stats from articles
      stats.value.totalArticles = articles.length;
      stats.value.totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);
      stats.value.totalLikes = articles.reduce((sum, a) => sum + (a.likes?.length || 0), 0);
      
      // totalTipAmount đã xóa từ Blog model - không tính từ articles nữa
      stats.value.totalTips = 0; // Sẽ load từ blockchain bên dưới
    }
    
    // Try to get REAL tips data from blockchain (most accurate)
    if (authStore.user?.walletAddress) {
      try {
        // Connect wallet to get blockchain data
        if (!blockchainService.isConnected()) {
          await blockchainService.connectWallet();
        }
        
        // Get creator earnings from blockchain
        const earnings = await blockchainService.getCreatorEarnings(authStore.user.walletAddress);
        const earningsAmount = parseFloat(earnings) || 0;
        
        // ALWAYS use blockchain data as it's the source of truth
        stats.value.totalTips = earningsAmount;
        console.log('📊 Loaded tips from blockchain:', earningsAmount);
        return; // Use blockchain data
      } catch (blockchainError) {
        console.warn('Could not load from blockchain:', blockchainError);
        // Continue to database fallback
      }
    }
    
    // Fallback: get tips from API for more accurate data
    try {
      const tipsResponse = await apiService.get('/tips/received', {
        params: { limit: 1000 } // Get all tips
      });
      
      if (tipsResponse.data.success) {
        const tips = tipsResponse.data.data || [];
        const totalFromAPI = tips.reduce((sum, tip) => sum + (tip.amount || 0), 0);
        
        // Use API data if available
        if (totalFromAPI > 0) {
          stats.value.totalTips = totalFromAPI;
          console.log('📊 Loaded tips from database:', totalFromAPI);
        }
      }
    } catch (error) {
      console.error('Load tips from API error:', error);
      // Keep stats from articles if API fails
    }
  } catch (error) {
    console.error("Load stats error:", error);
  }
};

const formatNumber = (num) => {
  if (!num) return "0";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};

const formatDate = (date) => {
  if (!date) return "";
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};

// Blockchain methods
const formatAddress = (addr) => {
  if (!addr) return '';
  return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
};

const connectWallet = async () => {
  walletLoading.value = true;
  try {
    const result = await blockchainService.connectWallet();
    
    if (result.success) {
      isWalletConnected.value = true;
      walletAddress.value = result.account;
      
      // Auto-save wallet address for blogger to receive tips
      try {
        const response = await apiService.patch('/users/wallet', {
          walletAddress: result.account
        });
        if (response.data.success) {
          authStore.user.walletAddress = result.account;
          console.log('✅ Wallet address saved to profile');
        }
      } catch (saveError) {
        console.warn('Could not save wallet address:', saveError);
        // Don't show error to user, just log it
      }
      
      await refreshEarnings();
      toast.success('✅ Kết nối ví thành công!');
    }
  } catch (error) {
    console.error('Connect wallet error:', error);
    toast.error(error.message || 'Không thể kết nối ví');
  } finally {
    walletLoading.value = false;
  }
};

const refreshEarnings = async () => {
  walletLoading.value = true;
  try {
    const earnings = await blockchainService.getCreatorEarnings();
    availableEarnings.value = parseFloat(earnings).toFixed(2);
    
    // TODO: Get total and withdrawn earnings from contract events
    totalEarnings.value = availableEarnings.value;
    withdrawnEarnings.value = '0.00';
  } catch (error) {
    console.error('Refresh earnings error:', error);
    toast.error('Không thể tải thu nhập');
  } finally {
    walletLoading.value = false;
  }
};

const withdrawEarnings = async () => {
  if (parseFloat(availableEarnings.value) <= 0) {
    toast.warning('Không có thu nhập để rút');
    return;
  }

  walletLoading.value = true;
  try {
    const result = await blockchainService.withdrawEarnings();
    
    if (result.success) {
      toast.success(`✅ Đã rút ${availableEarnings.value} TIP thành công!`);
      await refreshEarnings();
    }
  } catch (error) {
    console.error('Withdraw earnings error:', error);
    
    // Handle user rejection gracefully
    if (error.code === 'ACTION_REJECTED' || error.code === 4001 || 
        error.message?.includes('user rejected') || 
        error.message?.includes('User denied')) {
      toast.info('❌ Bạn đã hủy giao dịch');
    } else if (error.message?.includes('Khong co earnings de rut')) {
      toast.warning('Không có thu nhập để rút');
    } else {
      toast.error(error.message || 'Không thể rút thu nhập');
    }
  } finally {
    walletLoading.value = false;
  }
};

const disconnectWallet = () => {
  blockchainService.disconnect();
  isWalletConnected.value = false;
  walletAddress.value = '';
  totalEarnings.value = '0.00';
  availableEarnings.value = '0.00';
  withdrawnEarnings.value = '0.00';
  toast.info('Đã ngắt kết nối ví');
};
</script>

<style scoped>
@keyframes shine {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
}

.animate-shine {
  animation: shine 3s ease-in-out infinite;
}
</style>
