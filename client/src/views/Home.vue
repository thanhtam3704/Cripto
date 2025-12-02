<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section
      class="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <!-- Dynamic Animated Background -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"
      >
        <div
          class="absolute inset-0 bg-gradient-to-tr from-pink-600/30 via-transparent to-cyan-600/30"
        ></div>
        <div class="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      </div>

      <!-- Enhanced Floating Elements -->
      <div class="absolute inset-0 overflow-hidden">
        <!-- Large orbs -->
        <div
          class="animate-float absolute top-20 left-20 w-40 h-40 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mix-blend-multiply filter blur-2xl opacity-60"
        ></div>
        <div
          class="animate-float-delay-1 absolute top-32 right-20 w-56 h-56 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-60"
        ></div>
        <div
          class="animate-float-delay-2 absolute bottom-32 left-32 w-48 h-48 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full mix-blend-multiply filter blur-2xl opacity-60"
        ></div>
        <div
          class="animate-float-delay-3 absolute bottom-20 right-32 w-36 h-36 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full mix-blend-multiply filter blur-2xl opacity-60"
        ></div>

        <!-- Smaller sparkles -->
        <div
          class="animate-sparkle-1 absolute top-1/4 left-1/4 w-4 h-4 bg-white rounded-full opacity-70"
        ></div>
        <div
          class="animate-sparkle-2 absolute top-1/3 right-1/3 w-3 h-3 bg-yellow-300 rounded-full opacity-80"
        ></div>
        <div
          class="animate-sparkle-3 absolute bottom-1/4 left-1/2 w-2 h-2 bg-pink-300 rounded-full opacity-60"
        ></div>
        <div
          class="animate-sparkle-4 absolute top-1/2 right-1/4 w-5 h-5 bg-cyan-300 rounded-full opacity-50"
        ></div>

        <!-- Geometric shapes -->
        <div
          class="animate-rotate-slow absolute top-40 left-1/2 w-24 h-24 border-2 border-white/20 rotate-45 opacity-30"
        ></div>
        <div
          class="animate-rotate-reverse absolute bottom-40 right-1/3 w-16 h-16 border-2 border-pink-300/30 rotate-12 opacity-40"
        ></div>
      </div>

      <!-- Content -->
      <div
        class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white"
      >
        <div class="animate-fade-in-up my-20">
          <h1
            class="text-6xl md:text-7xl lg:text-8xl font-black mb-12 leading-tight"
          >
            <span
              class="block text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-white animate-shimmer mb-4"
            >
              Nền Tảng Blog
            </span>
            <span
              class="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 animate-rainbow-gradient drop-shadow-2xl"
            >
              Tip Bằng Crypto
            </span>
          </h1>

          <p
            class="text-xl md:text-3xl lg:text-4xl mb-16 text-white/90 max-w-5xl mx-auto font-light leading-relaxed"
          >
            Hỗ trợ các blogger yêu thích với
            <span
              class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 font-bold animate-pulse"
              >tiền điện tử</span
            >
            <br class="hidden md:block" />
            <span class="inline-flex items-center space-x-6 mt-4">
              <span class="flex items-center space-x-2">
                <span class="animate-bounce">⚡</span>
                <span class="font-medium">Giao dịch nhanh</span>
              </span>
              <span class="flex items-center space-x-2">
                <span class="animate-bounce" style="animation-delay: 0.5s"
                  >💰</span
                >
                <span class="font-medium">Phí thấp</span>
              </span>
              <span class="flex items-center space-x-2">
                <span class="animate-bounce" style="animation-delay: 1s"
                  >🔍</span
                >
                <span class="font-medium">Minh bạch</span>
              </span>
            </span>
          </p>

          <div
            class="flex flex-col sm:flex-row gap-8 justify-center items-center mb-20"
          >
            <router-link
              to="/register"
              class="group relative overflow-hidden bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 text-black font-bold text-2xl px-12 py-6 rounded-3xl transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-pink-500/50 transform hover:rotate-1 animate-pulse-glow"
            >
              <span class="flex items-center relative z-10">
                <UserPlusIcon class="w-7 h-7 mr-3 animate-bounce" />
                Tham gia ngay
              </span>
              <div
                class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 animate-shimmer-slow"
              ></div>
              <div
                class="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 rounded-3xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-500"
              ></div>
            </router-link>

            <button
              @click="scrollToArticles"
              class="group relative overflow-hidden bg-white/15 backdrop-blur-xl border-2 border-white/30 text-white font-bold text-2xl px-12 py-6 rounded-3xl transition-all duration-500 hover:bg-white/25 hover:scale-110 hover:shadow-2xl hover:shadow-white/20 transform hover:-rotate-1"
            >
              <span class="flex items-center relative z-10">
                <PlayIcon class="w-7 h-7 mr-3 group-hover:animate-spin" />
                Khám phá bài viết
              </span>
              <div
                class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
              ></div>
            </button>
          </div>

          <!-- Enhanced Stats Preview -->
          <div
            class="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white/15 backdrop-blur-xl rounded-3xl p-10 border border-white/30 shadow-2xl hover:bg-white/20 transition-all duration-500 group"
          >
            <div
              class="text-center group-hover:scale-105 transition-transform duration-300"
            >
              <div
                class="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 animate-count-up"
              >
                {{ formatNumber(stats.totalBloggers) }}+
              </div>
              <div class="text-white/80 font-semibold text-lg mt-2">
                Tác giả
              </div>
              <div
                class="w-8 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto mt-2 animate-pulse"
              ></div>
            </div>
            <div
              class="text-center group-hover:scale-105 transition-transform duration-300"
              style="transition-delay: 0.1s"
            >
              <div
                class="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-400 to-indigo-400 animate-count-up"
              >
                {{ formatNumber(stats.totalBlogs) }}+
              </div>
              <div class="text-white/80 font-semibold text-lg mt-2">
                Bài viết
              </div>
              <div
                class="w-8 h-1 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full mx-auto mt-2 animate-pulse"
                style="animation-delay: 0.5s"
              ></div>
            </div>
            <div
              class="text-center group-hover:scale-105 transition-transform duration-300"
              style="transition-delay: 0.2s"
            >
              <div
                class="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-cyan-400 to-teal-400 animate-count-up"
              >
                ${{ formatNumber(stats.totalTipsUSD) }}
              </div>
              <div class="text-white/80 font-semibold text-lg mt-2">
                Tip đã gửi
              </div>
              <div
                class="w-8 h-1 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full mx-auto mt-2 animate-pulse"
                style="animation-delay: 1s"
              ></div>
            </div>
            <div
              class="text-center group-hover:scale-105 transition-transform duration-300"
              style="transition-delay: 0.3s"
            >
              <div
                class="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-400 to-teal-400 animate-count-up"
              >
                {{ formatNumber(stats.totalUsers) }}+
              </div>
              <div class="text-white/80 font-semibold text-lg mt-2">
                Người dùng
              </div>
              <div
                class="w-8 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full mx-auto mt-2 animate-pulse"
                style="animation-delay: 1.5s"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Recommended Articles Section -->
    <section
      ref="articlesSection"
      class="py-20 bg-gradient-to-br from-gray-50 via-white to-purple-50/30 relative overflow-hidden"
    >
      <!-- Background decoration -->
      <div
        class="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full filter blur-3xl -z-10"
      ></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="flex items-center justify-between mb-12">
          <div class="space-y-4">
            <h2 class="text-4xl md:text-5xl font-black text-gray-900">
              <span class="animate-bounce inline-block">✨</span>
              <span
                class="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"
                >Bài viết Đề xuất</span
              >
            </h2>
            <p class="text-xl text-gray-600 max-w-2xl">
              Những bài viết được chọn lọc đặc biệt dành cho bạn
            </p>
          </div>
          <router-link
            to="/blogs"
            class="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center"
          >
            Xem tất cả
            <ChevronRightIcon
              class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300"
            />
          </router-link>
        </div>

        <div
          v-if="trendingLoading"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div v-for="n in 3" :key="n" class="animate-pulse">
            <div class="bg-gray-300 aspect-video rounded-lg mb-3"></div>
            <div class="h-4 bg-gray-300 rounded mb-2"></div>
            <div class="h-3 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>

        <div
          v-else-if="trendingBlogs && trendingBlogs.length"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <BlogCard
            v-for="article in trendingBlogs"
            :key="article._id"
            :blog="article"
          />
        </div>

        <div v-else class="text-center py-12">
          <svg
            class="w-16 h-16 text-gray-400 mx-auto mb-4"
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
          <p class="text-gray-600">Chưa có bài viết đề xuất</p>
        </div>
      </div>
    </section>

    <!-- Featured Writers Section -->
    <section
      class="py-20 bg-gradient-to-br from-white via-purple-50/20 to-pink-50/20 relative overflow-hidden"
    >
      <!-- Background decoration -->
      <div
        class="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-l from-yellow-200/20 to-orange-200/20 rounded-full filter blur-3xl -z-10"
      ></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="flex items-center justify-between mb-12">
          <div class="space-y-4">
            <h2 class="text-4xl md:text-5xl font-black text-gray-900">
              <span class="animate-spin inline-block">⭐</span>
              <span
                class="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600"
                >Tác giả nổi bật</span
              >
            </h2>
            <p class="text-xl text-gray-600 max-w-2xl">
              Những tác giả tài năng với bài viết chất lượng cao nhất trên nền
              tảng
            </p>
          </div>
          <router-link
            to="/bloggers"
            class="group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center"
          >
            Xem tất cả
            <ChevronRightIcon
              class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300"
            />
          </router-link>
        </div>

        <div
          v-if="bloggersLoading"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <div v-for="n in 4" :key="n" class="animate-pulse">
            <div class="bg-gray-300 w-24 h-24 rounded-full mx-auto mb-4"></div>
            <div class="h-4 bg-gray-300 rounded mb-2"></div>
            <div class="h-3 bg-gray-300 rounded w-2/3 mx-auto"></div>
          </div>
        </div>

        <div
          v-else-if="featuredBloggers && featuredBloggers.length"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <BloggerCard
            v-for="blogger in featuredBloggers"
            :key="blogger.id"
            :blogger="blogger"
          />
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section
      class="py-20 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 relative overflow-hidden"
    >
      <!-- Background elements -->
      <div class="absolute inset-0">
        <div
          class="absolute top-20 left-20 w-32 h-32 bg-yellow-400/20 rounded-full filter blur-xl"
        ></div>
        <div
          class="absolute bottom-20 right-20 w-40 h-40 bg-pink-400/20 rounded-full filter blur-xl"
        ></div>
        <div
          class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/10 rounded-full filter blur-3xl"
        ></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-6xl font-black text-white mb-6">
            <span
              class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400"
            >
              Tại sao chọn chúng tôi?
            </span>
          </h2>
          <p
            class="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed"
          >
            Nền tảng tiên tiến nhất để hỗ trợ tác giả blog với công nghệ
            blockchain an toàn và hiện đại
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="text-center p-6">
            <div
              class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <BoltIcon class="w-8 h-8 text-blue-600" />
            </div>
            <h3 class="text-xl font-semibold mb-3 text-white">
              Giao dịch nhanh
            </h3>
            <p class="text-white/70">
              Tip được gửi tức thì qua blockchain Ethereum với tốc độ xử lý
              nhanh chóng
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="text-center p-6">
            <div
              class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <ShieldCheckIcon class="w-8 h-8 text-green-600" />
            </div>
            <h3 class="text-xl font-semibold mb-3 text-white">
              An toàn & minh bạch
            </h3>
            <p class="text-white/70">
              Mọi giao dịch đều được ghi lại trên blockchain, hoàn toàn minh
              bạch và bảo mật
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="text-center p-6">
            <div
              class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CurrencyDollarIcon class="w-8 h-8 text-yellow-600" />
            </div>
            <h3 class="text-xl font-semibold mb-3 text-white">Phí thấp</h3>
            <p class="text-white/70">
              Chỉ 2% phí nền tảng, thấp hơn nhiều so với các nền tảng truyền
              thống
            </p>
          </div>

          <!-- Feature 4 -->
          <div class="text-center p-6">
            <div
              class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <GlobeAltIcon class="w-8 h-8 text-purple-600" />
            </div>
            <h3 class="text-xl font-semibold mb-3 text-white">Toàn cầu</h3>
            <p class="text-white/70">
              Không giới hạn địa lý, tác giả và độc giả có thể kết nối từ khắp
              nơi trên thế giới
            </p>
          </div>

          <!-- Feature 5 -->
          <div class="text-center p-6">
            <div
              class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <HeartIcon class="w-8 h-8 text-red-600" />
            </div>
            <h3 class="text-xl font-semibold mb-3 text-white">
              Hỗ trợ thực sự
            </h3>
            <p class="text-white/70">
              100% tip đều đến tay tác giả, không bị khấu trừ bởi trung gian
            </p>
          </div>

          <!-- Feature 6 -->
          <div class="text-center p-6">
            <div
              class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <ChartBarIcon class="w-8 h-8 text-indigo-600" />
            </div>
            <h3 class="text-xl font-semibold mb-3 text-white">
              Thống kê chi tiết
            </h3>
            <p class="text-white/70">
              Dashboard chi tiết giúp tác giả theo dõi thu nhập và phân tích độc
              giả
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section
      class="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white"
    >
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">
          Bắt đầu hành trình viết blog của bạn
        </h2>
        <p class="text-xl mb-8 text-white/90">
          Tham gia cộng đồng tác giả và bắt đầu kiếm tiền từ bài viết của bạn
          ngay hôm nay
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link
            to="/register?type=writer"
            class="btn btn-primary bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-xl font-semibold flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <UserPlusIcon class="w-5 h-5 mr-2" />
            Trở thành tác giả
          </router-link>
          <router-link
            to="/register"
            class="btn btn-outline border-2 border-white text-white hover:bg-white hover:text-purple-600 text-lg px-8 py-4 rounded-xl font-semibold flex items-center justify-center transition-all duration-300 hover:scale-105"
          >
            <UserGroupIcon class="w-5 h-5 mr-2" />
            Tham gia đọc
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useBlogStore } from "@/stores/blog";
import { useAuthStore } from "@/stores/auth";
import apiService from "@/services/api";
import BlogCard from "@/components/blog/BlogCard.vue";
import BloggerCard from "@/components/blogger/BloggerCard.vue";
import {
  UserPlusIcon,
  PlayIcon,
  ChevronRightIcon,
  UserGroupIcon,
  BoltIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  HeartIcon,
  ChartBarIcon,
} from "@heroicons/vue/24/outline";

const blogStore = useBlogStore();
const authStore = useAuthStore();

// State
const trendingBlogs = ref([]);
const featuredBloggers = ref([]);
const stats = ref({
  totalBloggers: 0,
  totalBlogs: 0,
  totalTipsUSD: 0,
  totalUsers: 0,
});

const trendingLoading = ref(true);
const bloggersLoading = ref(true);

// Load platform stats
const loadPlatformStats = async () => {
  try {
    // Get total bloggers
    const bloggersRes = await apiService.get('/users/bloggers', { params: { limit: 1 } });
    if (bloggersRes.data.success && bloggersRes.data.pagination) {
      stats.value.totalBloggers = bloggersRes.data.pagination.total || 0;
      stats.value.totalUsers = stats.value.totalBloggers; // For now, count bloggers as users
    }
    
    // Get total blogs
    const blogsRes = await blogStore.fetchblogs({ limit: 1 });
    if (blogsRes.success && blogsRes.pagination) {
      stats.value.totalBlogs = blogsRes.pagination.total || 0;
    }
    
    // Get total tips amount from public stats endpoint
    const tipsRes = await apiService.get('/tips/stats');
    if (tipsRes.data.success) {
      const tipsData = tipsRes.data.data || {};
      // Convert TIP to USD (assuming 1 TIP = $1 for now, adjust based on real rate)
      stats.value.totalTipsUSD = Math.round(tipsData.totalAmount || 0);
    }
  } catch (error) {
  }
};

// Refs
const articlesSection = ref(null);

// Methods
const formatNumber = (num) => {
  if (!num && num !== 0) return "0";
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};

const scrollToArticles = () => {
  articlesSection.value?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

const loadRecommendedBlogs = async () => {
  try {
    trendingLoading.value = true;
    const result = await blogStore.fetchRecommendedBlogs(3); // Lấy 3 bài ngẫu nhiên
    if (result.success) {
      trendingBlogs.value = result.blogs;
    } else {
      // If failed, just show empty state without popup
      trendingBlogs.value = [];
    }
  } catch (error) {
    console.error("Load recommended articles error:", error);
    trendingBlogs.value = [];
  } finally {
    trendingLoading.value = false;
  }
};

const loadfeaturedBloggers = async () => {
  try {
    bloggersLoading.value = true;
    // Load real bloggers from API (sorted by totalArticles since totalEarnings removed)
    const response = await apiService.get('/users/bloggers', {
      params: {
        limit: 4,
        sortBy: 'totalArticles' // Changed from totalEarnings
      }
    });
    
    
    if (response.data.success && response.data.data) {
      // API trả về data array trực tiếp, không có data.bloggers
      featuredBloggers.value = response.data.data.map(blogger => ({
        _id: blogger._id,
        profile: {
          displayName: blogger.profile?.displayName || blogger.username,
          avatar: blogger.profile?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(blogger.username)}&background=6366f1&color=fff`,
          bio: blogger.profile?.bio || 'Blogger tài năng trên nền tảng',
        },
        username: blogger.username,
        isVerified: blogger.isVerified || false,
        bloggerStats: blogger.bloggerStats, // Giữ nguyên structure từ API
      }));
      console.log('Featured bloggers:', featuredBloggers.value);
    } else {
      featuredBloggers.value = [];
    }
  } catch (error) {
    console.error("Error loading featured bloggers:", error);
    featuredBloggers.value = [];
  } finally {
    bloggersLoading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  loadRecommendedBlogs();
  loadfeaturedBloggers();
  loadPlatformStats();
});
</script>

<style scoped>
/* Enhanced Animations */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-15px) rotate(120deg);
  }
  66% {
    transform: translateY(10px) rotate(240deg);
  }
}

@keyframes fade-in-up {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes rainbow-gradient {
  0% {
    background-position: 0% 50%;
  }
  25% {
    background-position: 100% 50%;
  }
  50% {
    background-position: 50% 100%;
  }
  75% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 50% 0%;
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes sparkle {
  0%,
  100% {
    opacity: 0;
    transform: scale(0) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1) rotate(180deg);
  }
}

@keyframes rotate-slow {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes rotate-reverse {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
  }
}

@keyframes count-up {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.8);
  }
  50% {
    opacity: 0.5;
    transform: translateY(-5px) scale(1.1);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes pulse-glow {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(255, 105, 180, 0.4);
  }
  50% {
    box-shadow:
      0 0 40px rgba(255, 105, 180, 0.8),
      0 0 60px rgba(255, 105, 180, 0.4);
  }
}

/* Animation Classes */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
.animate-float {
  animation: float 8s ease-in-out infinite;
}
.animate-float-delay-1 {
  animation: float 8s ease-in-out infinite;
  animation-delay: 2s;
}
.animate-float-delay-2 {
  animation: float 8s ease-in-out infinite;
  animation-delay: 4s;
}
.animate-float-delay-3 {
  animation: float 8s ease-in-out infinite;
  animation-delay: 6s;
}
.animate-fade-in-up {
  animation: fade-in-up 1s ease-out;
}
.animate-rainbow-gradient {
  background-size: 400% 400%;
  animation: rainbow-gradient 4s ease infinite;
}
.animate-shimmer {
  background-size: 200% 100%;
  animation: shimmer 3s ease-in-out infinite;
}
.animate-shimmer-slow {
  background-size: 200% 100%;
  animation: shimmer 6s ease-in-out infinite;
}
.animate-sparkle-1 {
  animation: sparkle 3s ease-in-out infinite;
}
.animate-sparkle-2 {
  animation: sparkle 3s ease-in-out infinite;
  animation-delay: 1s;
}
.animate-sparkle-3 {
  animation: sparkle 3s ease-in-out infinite;
  animation-delay: 2s;
}
.animate-sparkle-4 {
  animation: sparkle 3s ease-in-out infinite;
  animation-delay: 0.5s;
}
.animate-rotate-slow {
  animation: rotate-slow 20s linear infinite;
}
.animate-rotate-reverse {
  animation: rotate-reverse 15s linear infinite;
}
.animate-count-up {
  animation: count-up 2s ease-out;
}
.animate-pulse-glow {
  animation: pulse-glow 3s ease-in-out infinite;
}

/* Glassmorphism effect */
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Hover effects */
.hover-lift {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}
</style>
