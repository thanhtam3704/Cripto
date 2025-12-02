<template>
  <div class="write-article min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
          {{ isEditMode ? "Chỉnh sửa bài viết" : "Viết bài mới" }}
        </h1>
        <p class="text-gray-600 mt-2 flex items-center gap-2">
          <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Chia sẻ suy nghĩ của bạn với cộng đồng
        </p>
      </div>

      <!-- Main Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Title -->
        <div class="bg-white rounded-xl shadow-lg p-6 border border-primary-100 hover:shadow-xl transition-shadow">
          <label
            for="title"
            class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
          >
            <span class="w-2 h-2 bg-primary-500 rounded-full"></span>
            Tiêu đề *
          </label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            required
            maxlength="200"
            class="w-full px-4 py-3 text-2xl font-bold border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            placeholder="Nhập tiêu đề bài viết của bạn..."
          />
          <p class="text-xs text-gray-500 mt-2 flex justify-between">
            <span>{{ form.title.length }}/200 ký tự</span>
            <span v-if="form.title.length > 150" class="text-amber-600">Gần đạt giới hạn</span>
          </p>
        </div>

        <!-- Content Editor -->
        <div class="bg-white rounded-xl shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-shadow">
          <label class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4">
            <span class="w-2 h-2 bg-purple-500 rounded-full"></span>
            Nội dung *
          </label>
          <RichTextEditor
            v-model="form.content"
            placeholder="Bắt đầu viết blog của bạn..."
          />
        </div>

        <!-- Tags and Cover Image in Same Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Tags -->
          <div class="bg-white rounded-xl shadow-lg p-6 border border-indigo-100 hover:shadow-xl transition-shadow">
            <label class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Thẻ
            </label>
            <div class="flex gap-2 mb-3">
              <input
                v-model="tagInput"
                @keydown.enter.prevent="addTag"
                type="text"
                class="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="Thêm thẻ (nhấn Enter)"
              />
              <button
                type="button"
                @click="addTag"
                class="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
              >
                Thêm
              </button>
            </div>

            <div v-if="form.tags.length" class="flex flex-wrap gap-2">
              <span
                v-for="(tag, index) in form.tags"
                :key="index"
                class="inline-flex items-center px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 text-sm rounded-full border border-indigo-200 shadow-sm"
              >
                #{{ tag }}
                <button
                  type="button"
                  @click="removeTag(index)"
                  class="ml-2 text-indigo-600 hover:text-indigo-800 font-bold"
                >
                  ×
                </button>
              </span>
            </div>
            <p class="text-xs text-gray-500 mt-3 flex justify-between">
              <span>{{ form.tags.length }}/10 thẻ</span>
              <span v-if="form.tags.length >= 8" class="text-amber-600">Gần đạt giới hạn</span>
            </p>
          </div>

          <!-- Cover Image -->
          <div class="bg-white rounded-xl shadow-lg p-6 border border-pink-100 hover:shadow-xl transition-shadow">
            <label class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <svg class="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Hình ảnh bìa
            </label>

            <div v-if="form.coverImage" class="mb-3">
              <img
                :src="form.coverImage"
                alt="Cover"
                class="w-full h-40 object-cover rounded-lg border-2 border-pink-200"
              />
              <button
                type="button"
                @click="form.coverImage = ''"
                class="mt-2 text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Xóa hình ảnh
              </button>
            </div>

            <input
              v-model="form.coverImage"
              type="url"
              class="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
              placeholder="Nhập URL hình ảnh..."
            />
            <p class="text-xs text-gray-500 mt-2">Khuyến nghị: 1200x630px</p>
          </div>
        </div>

        <!-- Category and Submit Button -->
        <div class="flex flex-col sm:flex-row gap-6 items-end">
          <!-- Category -->
          <div class="flex-1 bg-white rounded-xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-shadow">
            <label
              for="category"
              class="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3"
            >
              <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              Danh mục *
            </label>
            <select
              id="category"
              v-model="form.category"
              required
              class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gradient-to-r from-white to-blue-50"
            >
              <option value="">Chọn danh mục</option>
              <option value="technology">🔧 Công nghệ</option>
              <option value="blockchain">⛓️ Blockchain</option>
              <option value="crypto">💰 Tiền điện tử</option>
              <option value="web3">🌐 Web3</option>
              <option value="defi">💎 DeFi</option>
              <option value="nft">🎨 NFT</option>
              <option value="education">📚 Giáo dục</option>
              <option value="tutorial">📖 Hướng dẫn</option>
              <option value="lifestyle">🌟 Lối sống</option>
              <option value="business">💼 Kinh doanh</option>
              <option value="news">📰 Tin tức</option>
              <option value="opinion">💭 Ý kiến</option>
              <option value="other">📌 Khác</option>
            </select>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="px-8 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl flex items-center gap-2 whitespace-nowrap"
          >
            <svg v-if="!loading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span v-if="loading">{{
              isEditMode ? "Đang cập nhật..." : "Đang đăng..."
            }}</span>
            <span v-else>{{
              isEditMode ? "Cập nhật bài viết" : "Đăng bài viết"
            }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useBlogStore } from "@/stores/blog";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "vue-toastification";
import RichTextEditor from "@/components/editor/RichTextEditor.vue";

const router = useRouter();
const route = useRoute();
const blogStore = useBlogStore();
const authStore = useAuthStore();
const toast = useToast();

const loading = ref(false);
const tagInput = ref("");
const editingBlogId = ref(null);

const form = reactive({
  title: "",
  content: "",
  coverImage: "",
  category: "",
  tags: [],
});

const isEditMode = computed(() => !!route.params.id || !!editingBlogId.value);

const isFormValid = computed(() => {
  return (
    form.title.trim().length > 0 &&
    form.content.trim().length >= 100 &&
    form.category
  );
});

// Load article for editing
onMounted(async () => {
  // Check if editing from localStorage (from BlogDetail)
  const editingBlog = localStorage.getItem('editingBlog');
  if (editingBlog) {
    try {
      const blog = JSON.parse(editingBlog);
      
      // Check if user is author
      const authorId = blog.author._id || blog.author.id;
      const currentUserId = authStore.user?.id || authStore.user?._id;
      
      if (authorId !== currentUserId) {
        toast.error("Bạn không có quyền chỉnh sửa bài viết này");
        router.push("/blogger/dashboard");
        localStorage.removeItem('editingBlog');
        return;
      }

      // Save blog ID for update
      editingBlogId.value = blog._id;
      
      // Populate form
      form.title = blog.title;
      form.content = blog.content;
      form.coverImage = blog.coverImage || "";
      form.category = blog.category;
      form.tags = [...blog.tags];
      
      // Clear localStorage after loading
      localStorage.removeItem('editingBlog');
      return;
    } catch (error) {
      console.error('Parse editing blog error:', error);
      localStorage.removeItem('editingBlog');
    }
  }

  // Fallback to old method if using route params
  if (isEditMode.value) {
    const result = await blogStore.fetchblogById(route.params.id);

    if (result.success) {
      const blog = result.blog;

      // Check if user is author
      const authorId = blog.author._id || blog.author.id;
      const currentUserId = authStore.user?.id || authStore.user?._id;
      
      if (authorId !== currentUserId) {
        toast.error("Bạn không có quyền chỉnh sửa bài viết này");
        router.push("/blogger/dashboard");
        return;
      }

      // Populate form
      form.title = blog.title;
      form.content = blog.content;
      form.coverImage = blog.coverImage || "";
      form.category = blog.category;
      form.tags = [...blog.tags];
    } else {
      toast.error("Không tìm thấy bài viết");
      router.push("/blogger/dashboard");
    }
  }
});

const addTag = () => {
  const tag = tagInput.value
    .trim()
    .replace(/[,\s]+/g, " ")
    .toLowerCase();

  if (!tag) return;

  if (form.tags.length >= 10) {
    toast.warning("Maximum 10 tags allowed");
    return;
  }

  if (form.tags.includes(tag)) {
    toast.warning("Tag already added");
    return;
  }

  form.tags.push(tag);
  tagInput.value = "";
};

const removeTag = (index) => {
  form.tags.splice(index, 1);
};

const handleSubmit = async () => {
  if (!isFormValid.value) {
    toast.error("Please fill in all required fields");
    return;
  }

  if (form.content.length < 100) {
    toast.error("Article content must be at least 100 characters");
    return;
  }

  try {
    loading.value = true;

    const articleData = {
      title: form.title.trim(),
      content: form.content,
      coverImage: form.coverImage.trim(),
      category: form.category,
      tags: form.tags,
    };

    let result;

    if (isEditMode.value) {
      const blogId = editingBlogId.value || route.params.id;
      result = await blogStore.updateblog(blogId, articleData);
    } else {
      result = await blogStore.createblog(articleData);
    }

    if (result.success) {
      // Toast đã được hiển thị từ store, không cần gọi lại
      
      // Redirect to article detail
      router.push(`/blog/${result.blog._id}`);
    }
  } catch (error) {
    console.error("Submit article error:", error);
    toast.error(error.message || "Failed to save article");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
</style>
