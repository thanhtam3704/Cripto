<template>
  <article
    class="blog-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
  >
    <!-- Cover Image -->
    <router-link :to="`/blog/${blog._id}`" class="block">
      <div class="relative h-48 bg-gray-200 overflow-hidden">
        <img
          v-if="blog.coverImage"
          :src="blog.coverImage"
          :alt="blog.title"
          class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <div
          v-else
          class="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-400 to-primary-600"
        >
          <span class="text-white text-6xl font-bold opacity-20">{{
            blog.title[0]
          }}</span>
        </div>

        <!-- Category Badge -->
        <div class="absolute top-3 left-3">
          <span
            class="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-primary-700 rounded-full"
          >
            {{ getCategoryLabel(blog.category) }}
          </span>
        </div>
      </div>
    </router-link>

    <!-- Content -->
    <div class="p-5">
      <!-- Author Info -->
      <div class="flex items-center mb-3">
        <router-link
          :to="`/profile/${blog.author?._id || blog.author?.id}`"
          class="flex items-center group"
        >
          <img
            :src="blog.author?.profile?.avatar || defaultAvatar"
            :alt="blog.author?.username"
            class="w-10 h-10 rounded-full object-cover border-2 border-gray-100"
          />
          <div class="ml-3">
            <p
              class="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors"
            >
              {{
                blog.author?.username ||
                blog.author?.profile?.displayName ||
                "Unknown"
              }}
            </p>
            <p class="text-xs text-gray-500">
              {{ formatDate(blog.createdAt) }}
            </p>
          </div>
        </router-link>

        <div class="ml-auto flex items-center gap-2 text-xs text-gray-500">
          <span class="flex items-center gap-1">
            <svg
              class="w-4 h-4"
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
            {{ blog.readingTime || 1 }} phút
          </span>
        </div>
      </div>

      <!-- Title -->
      <router-link :to="`/blog/${blog._id}`" class="block group">
        <h3
          class="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors"
        >
          {{ blog.title }}
        </h3>
      </router-link>

      <!-- Excerpt -->
      <p class="text-gray-600 text-sm mb-4 line-clamp-3">
        {{ blog.excerpt || getExcerpt(blog.content) }}
      </p>

      <!-- Tags -->
      <div
        v-if="blog.tags && blog.tags.length"
        class="flex flex-wrap gap-2 mb-4"
      >
        <span
          v-for="tag in blog.tags.slice(0, 3)"
          :key="tag"
          class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
        >
          #{{ tag }}
        </span>
      </div>

      <!-- Footer Stats -->
      <div
        class="flex items-center justify-between pt-4 border-t border-gray-100"
      >
        <div class="flex items-center gap-4 text-sm text-gray-500">
          <!-- Views -->
          <span class="flex items-center gap-1">
            <svg
              class="w-4 h-4"
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
            {{ formatNumber(blog.views) }}
          </span>

          <!-- Likes -->
          <span class="flex items-center gap-1">
            <svg
              class="w-4 h-4"
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
            {{ formatNumber(blog.likes?.length || 0) }}
          </span>

          <!-- Tips -->
          <!-- <span class="flex items-center gap-1 text-primary-600 font-semibold">
            <svg
              class="w-4 h-4"
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
           
            Tips
          </span> -->
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  blog: {
    type: Object,
    required: true,
  },
});

const defaultAvatar = computed(() => {
  const username = props.blog.author?.username || "User";
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=6366f1&color=fff`;
});

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

  const now = new Date();
  const blogDate = new Date(date);
  const diffTime = Math.abs(now - blogDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      return `${diffMinutes} phút trước`;
    }
    return `${diffHours} giờ trước`;
  } else if (diffDays === 1) {
    return "Hôm qua";
  } else if (diffDays < 7) {
    return `${diffDays} ngày trước`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} tuần trước`;
  } else {
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(blogDate);
  }
};

const formatNumber = (num) => {
  if (!num) return "0";

  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }

  return num.toString();
};

const getExcerpt = (content) => {
  if (!content) return "";

  // Remove HTML tags
  const text = content.replace(/<[^>]*>/g, "");

  // Get first 150 characters
  return text.length > 150 ? text.substring(0, 150) + "..." : text;
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
