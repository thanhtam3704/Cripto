<template>
  <div class="article-detail min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"
        ></div>
        <p class="text-gray-600 font-medium">Đang tải bài viết...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-4xl mx-auto px-4 py-16 text-center">
      <div class="bg-white rounded-2xl shadow-xl p-12 border border-red-100">
        <svg class="w-20 h-20 text-red-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 class="text-3xl font-bold text-gray-900 mb-4">
          Không tìm thấy bài viết
        </h2>
        <p class="text-gray-600 mb-8">{{ error }}</p>
        <router-link to="/" class="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all shadow-lg font-semibold">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Về trang chủ
        </router-link>
      </div>
    </div>

    <!-- Article Content -->
    <article
      v-else-if="blog"
      class="max-w-5xl mx-auto px-4 py-8"
    >
      <!-- Cover Image -->
      <div v-if="blog.coverImage" class="mb-8 -mx-4 sm:mx-0">
        <img
          :src="blog.coverImage"
          :alt="blog.title"
          class="w-full h-64 sm:h-96 object-cover sm:rounded-2xl shadow-2xl border-4 border-white"
        />
      </div>

      <!-- Article Header -->
      <header class="mb-8 bg-white rounded-2xl shadow-xl p-8 border border-purple-100">
        <!-- Category Badge -->
        <div class="mb-4">
          <span
            class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-100 to-purple-100 text-primary-700 text-sm font-bold rounded-full border border-primary-200 shadow-sm"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            {{ getCategoryLabel(blog.category) }}
          </span>
        </div>

        <!-- Title -->
        <h1 class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-purple-900 bg-clip-text text-transparent mb-6 leading-tight">
          {{ blog.title }}
        </h1>

        <!-- Excerpt -->
        <p v-if="blog.excerpt" class="text-lg text-gray-600 mb-6 leading-relaxed">
          {{ blog.excerpt }}
        </p>

        <!-- Meta Info -->
        <div class="flex flex-wrap items-center gap-4 text-gray-600 mb-6 pb-6 border-b border-gray-200">
          <span class="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
            <svg
              class="w-5 h-5 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {{ blog.readingTime || 1 }} phút đọc
          </span>
          <span class="text-gray-300">•</span>
          <span class="bg-green-50 px-3 py-1 rounded-full">{{ formatDate(blog.createdAt) }}</span>
          <span class="text-gray-300">•</span>
          <span class="flex items-center gap-2 bg-purple-50 px-3 py-1 rounded-full">
            <svg
              class="w-5 h-5 text-purple-500"
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
            {{ formatNumber(blog.views) }} lượt xem
          </span>
        </div>

        <!-- Author Card -->
        <div
          class="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl"
        >
          <router-link
            :to="`/profile/${blog.author._id || blog.author.id}`"
            class="flex items-center gap-4 group"
          >
            <img
              :src="blog.author.profile?.avatar || defaultAvatar"
              :alt="blog.author.username"
              class="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg ring-2 ring-primary-200 group-hover:ring-primary-400 transition-all"
            />
            <div>
              <p
                class="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors flex items-center gap-2"
              >
                {{ blog.author.profile?.displayName || blog.author.username }}
                <svg class="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </p>
              <p
                v-if="blog.author.profile?.bio"
                class="text-sm text-gray-600"
              >
                {{ blog.author.profile.bio }}
              </p>
            </div>
          </router-link>

          <!-- Follow Button -->
          <button
            v-if="!isOwner"
            @click="handleFollow"
            :disabled="followLoading"
            class="px-6 py-2 rounded-lg transition-all shadow-md hover:shadow-lg font-semibold"
            :class="isFollowing 
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
              : 'bg-gradient-to-r from-primary-600 to-purple-600 text-white hover:from-primary-700 hover:to-purple-700'"
          >
            {{ followLoading ? 'Đang xử lý...' : (isFollowing ? 'Hủy theo dõi' : 'Theo dõi') }}
          </button>
        </div>
      </header>

      <!-- Article Content -->
      <div
        class="prose prose-base max-w-none mb-12 bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-blue-100"
        v-html="blog.content"
      ></div>

      <!-- Tags -->
      <div
        v-if="blog.tags && blog.tags.length"
        class="flex flex-wrap gap-2 mb-8 bg-white rounded-xl shadow-lg p-6 border border-indigo-100"
      >
        <span
          v-for="tag in blog.tags"
          :key="tag"
          class="px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 text-sm rounded-full hover:from-indigo-200 hover:to-purple-200 transition-all cursor-pointer border border-indigo-200 shadow-sm font-medium"
        >
          #{{ tag }}
        </span>
      </div>

      <!-- Action Buttons -->
      <div
        class="flex items-center justify-between py-6 mb-12 bg-white rounded-xl shadow-lg px-8 border border-pink-100"
      >
        <div class="flex items-center gap-4">
          <!-- Like Button -->
          <button
            @click="handleLike"
            :disabled="!authStore.isAuthenticated"
            class="flex items-center gap-2 px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg font-semibold"
            :class="
              isLiked
                ? 'bg-gradient-to-r from-red-100 to-pink-100 text-red-600 border-2 border-red-200'
                : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 hover:from-gray-200 hover:to-gray-300 border-2 border-gray-200'
            "
          >
            <svg
              class="w-6 h-6"
              :fill="isLiked ? 'currentColor' : 'none'"
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
            <span>{{ formatNumber(blog.likes?.length || 0) }}</span>
          </button>

          <!-- Share Button -->
          <button
            @click="handleShare"
            class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-600 rounded-xl hover:from-blue-200 hover:to-cyan-200 transition-all shadow-md hover:shadow-lg border-2 border-blue-200 font-semibold"
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
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            Chia sẻ
          </button>
        </div>
      </div>

      <!-- Tip Button (Blockchain) - Only show for readers -->
      <div v-if="!isOwner && authStore.isAuthenticated" class="mb-12">
        <TipButtonBlockchain
          :blogger-address="blog.author.walletAddress || ''"
          :blogger-name="blog.author.profile?.displayName || blog.author.username"
          :blogger-avatar="blog.author.profile?.avatar || defaultAvatar"
          :blog-id="blog._id || blog.id"
          @tip-sent="handleTipSent"
        />
      </div>

      <!-- Login prompt for guests -->
      <div v-if="!isOwner && !authStore.isAuthenticated" class="mb-12">
        <div class="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-2xl p-8 text-center">
          <div class="text-5xl mb-4">💰</div>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">Muốn tip cho blogger?</h3>
          <p class="text-gray-600 mb-6">Đăng nhập để gửi tip bằng TIP tokens cho blogger yêu thích của bạn!</p>
          <router-link
            to="/login"
            class="inline-block px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl font-bold hover:from-orange-600 hover:to-yellow-600 transition-all shadow-lg hover:shadow-xl"
          >
            Đăng nhập ngay
          </router-link>
        </div>
      </div>

      <!-- Edit/Delete Buttons (for author) -->
      <div v-if="isOwner" class="flex gap-4 mb-12">
        <button
          @click="handleEdit"
          class="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl hover:from-primary-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-semibold"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Chỉnh sửa bài viết
        </button>

        <button
          @click="showDeleteModal = true"
          class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-100 to-pink-100 text-red-600 rounded-xl hover:from-red-200 hover:to-pink-200 transition-all shadow-md hover:shadow-lg border-2 border-red-200 font-semibold"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Xóa bài viết
        </button>
      </div>

      <!-- Delete Confirmation Modal -->
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="showDeleteModal = false"
      >
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all">
          <div class="text-center mb-6">
            <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <svg class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Xác nhận xóa bài viết</h3>
            <p class="text-gray-600">
              Bạn có chắc chắn muốn xóa bài viết "<span class="font-semibold">{{ blog.title }}</span>"? 
              Hành động này không thể hoàn tác.
            </p>
          </div>

          <div class="flex gap-4">
            <button
              @click="showDeleteModal = false"
              class="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-semibold"
            >
              Hủy
            </button>
            <button
              @click="confirmDelete"
              class="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 transition-all shadow-lg font-semibold"
            >
              Xóa bài viết
            </button>
          </div>
        </div>
      </div>

      <!-- Related Articles -->
      <section v-if="relatedBlogs.length" class="mt-16">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">
          Đề xuất cho bạn
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BlogCard
            v-for="related in relatedBlogs"
            :key="related._id"
            :blog="related"
          />
        </div>
      </section>
    </article>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useBlogStore } from "@/stores/blog";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "vue-toastification";
import BlogCard from "@/components/blog/BlogCard.vue";
import TipButton from "@/components/tip/TipButton.vue";
import TipButtonBlockchain from "@/components/tip/TipButtonBlockchain.vue";
import apiService from "@/services/api";

const route = useRoute();
const router = useRouter();
const blogStore = useBlogStore();
const authStore = useAuthStore();
const toast = useToast();

const blog = ref(null);
const relatedBlogs = ref([]);
const loading = ref(true);
const error = ref(null);
const showDeleteModal = ref(false);
const followLoading = ref(false);
const isFollowing = ref(false);

const defaultAvatar = computed(() => {
  if (!blog.value) return "";
  const username = blog.value.author?.username || "User";
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=6366f1&color=fff`;
});

const isOwner = computed(() => {
  if (!authStore.isAuthenticated || !blog.value) return false;
  const authorId = blog.value.author._id || blog.value.author.id;
  return authorId === authStore.user?.id;
});

const isLiked = computed(() => {
  if (!authStore.isAuthenticated || !blog.value) return false;
  return blog.value.likes?.includes(authStore.user?.id);
});

onMounted(async () => {
  await loadArticle();
});

const loadArticle = async () => {
  try {
    loading.value = true;
    error.value = null;

    const result = await blogStore.fetchblogById(route.params.id);

    if (result.success) {
      blog.value = result.blog;

      // Check if user is following this author
      if (authStore.isAuthenticated) {
        await checkFollowStatus();
      }

      // Load related articles
      const relatedResult = await blogStore.fetchRelatedblogs(
        route.params.id,
        4
      );
      if (relatedResult.success) {
        relatedBlogs.value = relatedResult.blogs;
      }
    } else {
      error.value = result.message || "Không tìm thấy bài viết";
    }
  } catch (err) {
    console.error("Load article error:", err);
    error.value = err.message || "Lỗi tải bài viết";
  } finally {
    loading.value = false;
  }
};

const handleLike = async () => {
  if (!authStore.isAuthenticated) {
    toast.warning("Please login to like articles");
    router.push("/login");
    return;
  }

  const result = await blogStore.toggleLike(blog.value._id);

  if (result.success) {
    blog.value.likes = result.likes;
    toast.success(isLiked.value ? "Liked!" : "Unliked");
  }
};

const handleShare = async () => {
  const url = window.location.href;

  if (navigator.share) {
    try {
      await navigator.share({
        title: blog.value.title,
        text: blog.value.excerpt,
        url: url,
      });
      toast.success("Shared successfully!");
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Share error:", err);
      }
    }
  } else {
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      console.error("Copy error:", err);
      toast.error("Failed to copy link");
    }
  }
};

const handleTipSent = (tipData) => {
  console.log('Tip sent:', tipData);
  // Toast already shown in TipButtonBlockchain component
  // TODO: Update blog stats or UI if needed
};

const confirmDelete = async () => {
  const result = await blogStore.deleteblog(blog.value._id);

  if (result.success) {
    showDeleteModal.value = false;
    router.push("/blogger/dashboard");
  } else {
    toast.error(result.message || "Lỗi xóa bài viết");
  }
};

const handleEdit = () => {
  // Lưu data bài viết vào localStorage để WriteBlog load
  localStorage.setItem('editingBlog', JSON.stringify(blog.value));
  router.push(`/viet-blog?edit=${blog.value._id}`);
};

const checkFollowStatus = async () => {
  try {
    const authorId = blog.value.author._id || blog.value.author.id;
    const response = await apiService.get(`/users/${authorId}/follow-status`);
    if (response.data.success) {
      isFollowing.value = response.data.data.isFollowing;
    }
  } catch (error) {
    console.error('Check follow status error:', error);
  }
};

const handleFollow = async () => {
  if (!authStore.isAuthenticated) {
    toast.warning("Vui lòng đăng nhập để theo dõi");
    router.push("/login");
    return;
  }

  try {
    followLoading.value = true;
    const authorId = blog.value.author._id || blog.value.author.id;
    
    const response = await apiService.post(`/users/${authorId}/follow`);
    
    if (response.data.success) {
      isFollowing.value = !isFollowing.value;
      toast.success(isFollowing.value ? "Đã theo dõi" : "Đã hủy theo dõi");
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Lỗi xử lý theo dõi");
  } finally {
    followLoading.value = false;
  }
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

const formatDate = (date) => {
  if (!date) return "";
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
};

const formatNumber = (num) => {
  if (!num) return "0";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};
</script>

<style scoped>
/* Prose styles for article content */
:deep(.prose) {
  color: #374151;
  line-height: 1.75;
  font-size: 1rem; /* Base font size */
}

:deep(.prose h1) {
  font-size: 1.875em; /* Giảm từ 2.25em */
  font-weight: 800;
  margin-top: 1.5em;
  margin-bottom: 0.8em;
  color: #111827;
}

:deep(.prose h2) {
  font-size: 1.5em; /* Giảm từ 1.875em */
  font-weight: 700;
  margin-top: 1.5em;
  margin-bottom: 0.7em;
  color: #111827;
}

:deep(.prose h3) {
  font-size: 1.25em; /* Giảm từ 1.5em */
  font-weight: 600;
  margin-top: 1.3em;
  margin-bottom: 0.6em;
  color: #111827;
}

:deep(.prose p) {
  margin-top: 1.25em;
  margin-bottom: 1.25em;
  font-size: 1em; /* Đảm bảo p có size chuẩn */
}

:deep(.prose a) {
  color: #4f46e5;
  text-decoration: underline;
  font-weight: 500;
}

:deep(.prose a:hover) {
  color: #4338ca;
}

:deep(.prose strong) {
  font-weight: 700;
  color: #111827;
}

:deep(.prose code) {
  background-color: #f3f4f6;
  color: #ef4444;
  padding: 0.2em 0.4em;
  border-radius: 0.25rem;
  font-size: 0.875em;
  font-weight: 600;
}

:deep(.prose pre) {
  background-color: #1f2937;
  color: #f9fafb;
  border-radius: 0.5rem;
  padding: 1.5em;
  overflow-x: auto;
  margin-top: 1.5em;
  margin-bottom: 1.5em;
}

:deep(.prose pre code) {
  background-color: transparent;
  color: inherit;
  padding: 0;
  font-weight: 400;
}

:deep(.prose blockquote) {
  border-left: 4px solid #4f46e5;
  padding-left: 1.5em;
  margin-left: 0;
  font-style: italic;
  color: #6b7280;
}

:deep(.prose ul),
:deep(.prose ol) {
  margin-top: 1.25em;
  margin-bottom: 1.25em;
  padding-left: 1.5em;
}

:deep(.prose li) {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

:deep(.prose img) {
  border-radius: 0.5rem;
  margin-top: 2em;
  margin-bottom: 2em;
}

:deep(.prose hr) {
  border-color: #e5e7eb;
  margin-top: 3em;
  margin-bottom: 3em;
}
</style>
