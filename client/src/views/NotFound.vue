<template>
  <div class="not-found">
    <div
      class="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
    >
      <div class="max-w-md w-full text-center">
        <!-- 404 Animation -->
        <div class="mb-8">
          <h1 class="text-9xl font-bold text-gray-200 select-none">404</h1>
          <div class="relative -mt-8">
            <ExclamationTriangleIcon
              class="w-16 h-16 text-yellow-500 mx-auto animate-bounce"
            />
          </div>
        </div>

        <!-- Error Message -->
        <div class="space-y-4">
          <h2 class="text-3xl font-bold text-gray-900">Trang không tồn tại</h2>

          <p class="text-gray-600">
            Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
        </div>

        <!-- Action Buttons -->
        <div
          class="mt-8 space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center"
        >
          <router-link to="/" class="w-full sm:w-auto btn btn-primary">
            <HomeIcon class="w-5 h-5 mr-2" />
            Về trang chủ
          </router-link>

          <button @click="goBack" class="w-full sm:w-auto btn btn-outline">
            <ArrowLeftIcon class="w-5 h-5 mr-2" />
            Quay lại
          </button>
        </div>

        <!-- Search Suggestion -->
        <div class="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 class="text-sm font-medium text-gray-900 mb-3">
            Hoặc thử tìm kiếm:
          </h3>

          <div class="flex">
            <input
              v-model="searchQuery"
              @keydown.enter="handleSearch"
              type="text"
              placeholder="Tìm kiếm video..."
              class="flex-1 input rounded-r-none"
            />
            <button
              @click="handleSearch"
              class="btn btn-primary rounded-l-none"
            >
              <MagnifyingGlassIcon class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Popular Blogs -->
        <div class="mt-8 text-left">
          <h3 class="text-sm font-medium text-gray-900 mb-4">
            Bài viết phổ biến:
          </h3>

          <div v-if="popularBlogs && popularBlogs.length" class="space-y-3">
            <router-link
              v-for="blog in popularBlogs"
              :key="blog._id"
              :to="`/blog/${blog._id}`"
              class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <img
                :src="blog.coverImage || defaultThumbnail"
                :alt="blog.title"
                class="w-16 h-12 object-cover rounded"
              />

              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 line-clamp-1">
                  {{ blog.title }}
                </p>
                <p class="text-xs text-gray-600">
                  {{
                    blog.author?.profile?.displayName ||
                    blog.author?.username ||
                    "Unknown"
                  }}
                  • {{ formatNumber(blog.views) }} lượt xem
                </p>
              </div>
            </router-link>
          </div>

          <div v-else class="text-center py-4">
            <VideoCameraIcon class="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p class="text-sm text-gray-600">Không thể tải bài viết phổ biến</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useBlogStore } from "@/stores/blog";
import {
  ExclamationTriangleIcon,
  HomeIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
} from "@heroicons/vue/24/outline";

const router = useRouter();
const blogStore = useBlogStore();

// State
const searchQuery = ref("");
const popularBlogs = ref([]);

// Computed
const defaultThumbnail =
  "https://ui-avatars.com/api/?name=Article&background=f59e0b&color=fff&size=256";

// Methods
const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1);
  } else {
    router.push("/");
  }
};

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchQuery.value)}`);
  }
};

const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num?.toString() || "0";
};

const loadpopularBlogs = async () => {
  try {
    const result = await blogStore.fetchblogs({ sort: "views", limit: 3 });
    if (result.success) {
      popularBlogs.value = result.blogs;
    }
  } catch (error) {
    console.error("Error loading popular blogs:", error);
  }
};

onMounted(() => {
  loadpopularBlogs();
});
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
