<template>
  <div class="article-list min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8 text-center">
        <h1 class="text-4xl md:text-5xl font-black mb-4">
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
           Khám phá bài viết
          </span>
        </h1>
        <p class="text-xl text-gray-600">
          Những câu chuyện và kiến thức từ cộng đồng tác giả tài năng
        </p>
      </div>

      <!-- Filters -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-purple-100">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Search -->
          <div class="md:col-span-1">
            <div class="relative">
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                v-model="filters.search"
                @input="debouncedSearch"
                type="text"
                placeholder="Tìm kiếm bài viết..."
                class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              />
            </div>
          </div>

          <!-- Category Filter -->
          <div>
            <select
              v-model="filters.category"
              @change="applyFilters"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gradient-to-r from-white to-blue-50"
            >
              <option value="">🔖 Tất cả danh mục</option>
              <option value="technology">🔧 Công nghệ</option>
              <option value="blockchain">⛓️ Blockchain</option>
              <option value="crypto">💰 Crypto</option>
              <option value="web3">🌐 Web3</option>
              <option value="defi">💎 DeFi</option>
              <option value="nft">🎨 NFT</option>
              <option value="education">📚 Giáo dục</option>
              <option value="tutorial">📖 Hướng dẫn</option>
              <option value="lifestyle">🌟 Lối sống</option>
              <option value="business">💼 Kinh doanh</option>
              <option value="news">📰 Tin tức</option>
              <option value="opinion">💭 Quan điểm</option>
              <option value="other">📌 Khác</option>
            </select>
          </div>
          <!-- Sort By dropdown đã xóa - không còn cần thiết vì option "tip nhiều" đã bỏ -->
        </div>

        <!-- Active Filters -->
        <div v-if="hasActiveFilters" class="flex flex-wrap items-center gap-2 mt-4">
          <span class="text-sm font-semibold text-gray-700">Bộ lọc:</span>

          <button
            v-if="filters.search"
            @click="clearSearch"
            class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-sm rounded-full hover:from-purple-200 hover:to-pink-200 transition-all shadow-sm border border-purple-200"
          >
            🔍 "{{ filters.search }}"
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button
            v-if="filters.category"
            @click="clearCategory"
            class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-sm rounded-full hover:from-blue-200 hover:to-indigo-200 transition-all shadow-sm border border-blue-200"
          >
            {{ getCategoryLabel(filters.category) }}
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button
            @click="clearAllFilters"
            class="text-sm text-red-600 hover:text-red-700 underline font-medium"
          >
            ✕ Xóa tất cả
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mb-4"></div>
        <p class="text-gray-600 font-medium">Đang tải bài viết...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white rounded-2xl shadow-xl p-12 text-center border border-red-100">
        <svg class="w-20 h-20 text-red-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="text-2xl font-bold text-gray-900 mb-3">Có lỗi xảy ra</h3>
        <p class="text-red-600 mb-6">{{ error }}</p>
        <button
          @click="applyFilters"
          class="px-8 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 transition-all shadow-lg font-semibold"
        >
          🔄 Thử lại
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="!articles.length" class="bg-white rounded-2xl shadow-xl p-12 text-center border border-purple-100">
        <svg class="w-24 h-24 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="text-2xl font-bold text-gray-900 mb-3">
          {{ hasActiveFilters ? '🔍 Không tìm thấy kết quả' : '📝 Chưa có bài viết nào' }}
        </h3>
        <p class="text-gray-600 mb-8 text-lg">
          {{ hasActiveFilters ? "Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm" : "Hãy là người đầu tiên chia sẻ câu chuyện của bạn!" }}
        </p>
        <div class="flex gap-4 justify-center">
          <button
            v-if="hasActiveFilters"
            @click="clearAllFilters"
            class="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all shadow-lg font-semibold"
          >
            🔄 Xóa bộ lọc
          </button>
          <router-link
            v-if="authStore.user?.role === 'blogger'"
            to="/viet-blog"
            class="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg font-semibold inline-flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Viết bài mới
          </router-link>
        </div>
      </div>

      <!-- Articles Grid -->
      <div v-else>
        <!-- Results Count -->
        <div class="mb-6 flex items-center justify-between">
          <div class="text-gray-700 font-medium">
            Hiển thị <span class="text-purple-600 font-bold">{{ articles.length }}</span> / <span class="text-purple-600 font-bold">{{ pagination.total }}</span> bài viết
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <BlogCard
            v-for="article in articles"
            :key="article._id"
            :blog="article"
          />
        </div>

        <!-- Pagination -->
        <div v-if="pagination.totalPages > 1" class="flex justify-center items-center gap-2 flex-wrap">
          <button
            @click="goToPage(pagination.currentPage - 1)"
            :disabled="pagination.currentPage === 1"
            class="p-3 border-2 border-purple-200 rounded-xl hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-md"
          >
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div v-for="page in paginationRange" :key="page" class="inline-block">
            <button
              v-if="page !== '...'"
              @click="goToPage(page)"
              :class="[
                'min-w-[48px] px-4 py-3 border-2 rounded-xl transition-all font-semibold',
                page === pagination.currentPage
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-600 shadow-lg'
                  : 'border-purple-200 hover:bg-purple-50 text-gray-700',
              ]"
            >
              {{ page }}
            </button>
            <span v-else class="px-2 text-gray-600 font-bold">...</span>
          </div>

          <button
            @click="goToPage(pagination.currentPage + 1)"
            :disabled="pagination.currentPage === pagination.totalPages"
            class="p-3 border-2 border-purple-200 rounded-xl hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-md"
          >
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useBlogStore } from "@/stores/blog";
import { useAuthStore } from "@/stores/auth";
import BlogCard from "@/components/blog/BlogCard.vue";

const route = useRoute();
const router = useRouter();
const blogStore = useBlogStore();
const authStore = useAuthStore();

const articles = ref([]);
const loading = ref(false);
const error = ref(null);

const filters = reactive({
  search: route.query.search || "",
  category: route.query.category || "",
  sortBy: route.query.sortBy || "-createdAt",
  page: parseInt(route.query.page) || 1,
  limit: 12,
});

const pagination = reactive({
  currentPage: 1,
  totalPages: 1,
  total: 0,
  hasMore: false,
});

let searchTimeout = null;

const hasActiveFilters = computed(() => {
  return filters.search || filters.category;
});

const paginationRange = computed(() => {
  const range = [];
  const total = pagination.totalPages;
  const current = pagination.currentPage;

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      range.push(i);
    }
    return range;
  }

  // Always show first page
  range.push(1);

  if (current > 3) {
    range.push("...");
  }

  // Show pages around current
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    range.push(i);
  }

  if (current < total - 2) {
    range.push("...");
  }

  // Always show last page
  range.push(total);

  return range;
});

onMounted(() => {
  applyFilters();
});

const applyFilters = async () => {
  try {
    loading.value = true;
    error.value = null;

    // Update URL query params
    const query = {};
    if (filters.search) query.search = filters.search;
    if (filters.category) query.category = filters.category;
    if (filters.sortBy !== "-createdAt") query.sortBy = filters.sortBy;
    if (filters.page !== 1) query.page = filters.page;

    router.replace({ query });

    // Fetch articles
    const result = await blogStore.fetchblogs({
      search: filters.search,
      category: filters.category,
      sort: filters.sortBy,
      page: filters.page,
      limit: filters.limit,
    });

    if (result.success) {
      articles.value = result.blogs;

      // Update pagination
      pagination.currentPage = blogStore.pagination.page;
      pagination.totalPages = blogStore.pagination.pages;
      pagination.total = blogStore.pagination.total;
      pagination.hasMore =
        blogStore.pagination.page < blogStore.pagination.pages;
    } else {
      error.value = result.message || "Tải danh sách bài viết thất bại";
    }
  } catch (err) {
    console.error("Load articles error:", err);
    error.value = err.message || "Tải danh sách bài viết thất bại";
  } finally {
    loading.value = false;
  }
};

const debouncedSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    filters.page = 1;
    applyFilters();
  }, 500);
};

const goToPage = (page) => {
  if (page < 1 || page > pagination.totalPages) return;
  filters.page = page;
  applyFilters();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const clearSearch = () => {
  filters.search = "";
  filters.page = 1;
  applyFilters();
};

const clearCategory = () => {
  filters.category = "";
  filters.page = 1;
  applyFilters();
};

const clearAllFilters = () => {
  filters.search = "";
  filters.category = "";
  filters.sortBy = "-createdAt";
  filters.page = 1;
  applyFilters();
};

const getCategoryLabel = (category) => {
  const labels = {
    technology: "Công nghệ",
    blockchain: "Blockchain",
    crypto: "Crypto",
    web3: "Web3",
    defi: "DeFi",
    nft: "NFT",
    education: "Giáo dục",
    tutorial: "Hướng dẫn",
    lifestyle: "Lối sống",
    business: "Kinh doanh",
    news: "Tin tức",
    opinion: "Ý kiến",
    other: "Khác",
  };
  return labels[category] || category;
};
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
