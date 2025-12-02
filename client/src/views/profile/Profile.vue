<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
    <div class="max-w-5xl mx-auto px-4">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
          👤 Thông tin cá nhân
        </h1>
        <p class="text-gray-600 mt-2 flex items-center gap-2">
          <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Quản lý thông tin và cài đặt tài khoản của bạn
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"
        ></div>
      </div>

      <!-- Content -->
      <div v-else class="space-y-6">
        <!-- Profile Card -->
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-purple-100">
          <div
            class="bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 h-32"
          ></div>

          <div class="px-6 pb-6">
            <div
              class="flex flex-col sm:flex-row items-start sm:items-end -mt-16 mb-6"
            >
              <!-- Avatar với nút đổi ảnh -->
              <div class="relative">
                <img
                  :src="avatarPreview || getAvatarUrl(user.profile?.avatar)"
                  :key="user.profile?.avatar || 'default'"
                  :alt="user.profile?.displayName"
                  class="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
                <!-- Nút bút để đổi avatar -->
                <input
                  ref="avatarInput"
                  type="file"
                  accept="image/*"
                  @change="handleAvatarChange"
                  class="hidden"
                />
                <button
                  @click="$refs.avatarInput.click()"
                  :disabled="uploadingAvatar"
                  class="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50 shadow-lg"
                  :title="uploadingAvatar ? 'Đang upload...' : 'Đổi ảnh đại diện'"
                >
                  <svg v-if="!uploadingAvatar" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  <svg v-else class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </button>
              </div>

              <!-- User Info -->
              <div class="mt-4 sm:mt-0 sm:ml-6 flex-1">
                <div class="flex items-center gap-3 flex-wrap">
                  <h2 class="text-2xl font-bold text-gray-900">
                    {{ user.profile?.displayName || user.username }}
                  </h2>
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-xs font-semibold',
                      user.role === 'blogger'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700',
                    ]"
                  >
                    {{ user.role === "blogger" ? "Blogger" : "Reader" }}
                  </span>
                  <span
                    v-if="user.isVerified"
                    class="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700"
                  >
                    ✓ Đã xác thực
                  </span>
                </div>
                <p class="text-gray-600 mt-1">@{{ user.username }}</p>
                <p class="text-gray-500 text-sm mt-1">{{ user.email }}</p>
              </div>

              <!-- Actions -->
              <div class="mt-4 sm:mt-0 flex gap-2">
                <!-- Edit button (chỉ hiện khi xem profile của mình) -->
                <button
                  v-if="isOwnProfile && !editing"
                  @click="editing = true"
                  class="px-6 py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg font-semibold"
                >
                  ✏️ Chỉnh sửa
                </button>
                <button
                  v-if="isOwnProfile && editing"
                  @click="handleCancel"
                  class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Hủy
                </button>

                <!-- Follow button (chỉ hiện khi xem profile người khác VÀ user đang login VÀ là blogger) -->
                <button
                  v-if="!isOwnProfile && authStore.isAuthenticated && user.role === 'blogger'"
                  @click="toggleFollow"
                  :disabled="followLoading"
                  :class="[
                    'px-6 py-2 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg',
                    isFollowing 
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                      : 'bg-gradient-to-r from-primary-600 to-purple-600 text-white hover:from-primary-700 hover:to-purple-700'
                  ]"
                >
                  <span v-if="followLoading">⏳ Đang xử lý...</span>
                  <span v-else>{{ isFollowing ? '✓ Đang theo dõi' : '➕ Theo dõi' }}</span>
                </button>
              </div>
            </div>

            <!-- Bio -->
            <div v-if="!editing" class="mb-6">
              <p class="text-gray-700">
                {{ user.profile?.bio || "Chưa có mô tả" }}
              </p>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t">
              <div v-if="user.role === 'blogger'" class="text-center">
                <div class="text-2xl font-bold text-purple-600">
                  {{ formatNumber(bloggerStats.totalArticles || 0) }}
                </div>
                <div class="text-sm text-gray-600">Bài viết</div>
              </div>
              <div v-if="user.role === 'blogger'" class="text-center">
                <div class="text-2xl font-bold text-green-600">
                  {{ formatNumber(bloggerStats.totalEarnings || 0) }}
                </div>
                <div class="text-sm text-gray-600">Token nhận</div>
              </div>
              <div 
                class="text-center relative"
                @mouseenter="loadFollowList"
                @mouseleave="showFollowList = false"
              >
                <div class="text-2xl font-bold text-blue-600 cursor-pointer hover:text-blue-700 transition-colors">
                  {{ formatNumber(followersCount) }}
                </div>
                <div class="text-sm text-gray-600">
                  {{
                    user.role === "blogger" ? "Người theo dõi" : "Đang theo dõi"
                  }}
                </div>

                <!-- Follow List Popup -->
                <div
                  v-if="showFollowList && followList.length > 0"
                  class="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 w-64 max-h-80 overflow-y-auto"
                  @mouseenter="showFollowList = true"
                  @mouseleave="showFollowList = false"
                >
                  <h4 class="font-semibold text-gray-900 mb-3 text-left">
                    {{ user.role === "blogger" ? "Người theo dõi" : "Đang theo dõi" }}
                  </h4>
                  <div class="space-y-2">
                    <div
                      v-for="person in followList"
                      :key="person._id"
                      class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                      @click="viewProfile(person)"
                    >
                      <img
                        :src="getPersonAvatar(person)"
                        :alt="person.username"
                        class="w-10 h-10 rounded-full object-cover"
                      />
                      <div class="flex-1 text-left overflow-hidden">
                        <p class="font-medium text-gray-900 text-sm truncate">
                          {{ person.profile?.displayName || person.username }}
                        </p>
                        <p class="text-xs text-gray-500 truncate">@{{ person.username }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="user.role === 'reader'" class="text-center">
                <div class="text-2xl font-bold text-orange-600">
                  {{ formatNumber(readerStats.totalAmountTipped) }}
                </div>
                <div class="text-sm text-gray-600">Token đã tip</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Edit Form (chỉ hiện khi xem profile của mình) -->
        <div v-if="isOwnProfile && editing" class="bg-white rounded-2xl shadow-xl p-8 border border-indigo-100">
          <h3 class="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-6 flex items-center gap-2">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Chỉnh sửa thông tin
          </h3>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Display Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tên hiển thị
              </label>
              <input
                v-model="form.displayName"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="Nhập tên hiển thị"
              />
            </div>

            <!-- Bio -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Mô tả về bạn
              </label>
              <textarea
                v-model="form.bio"
                rows="4"
                maxlength="500"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="Viết vài dòng về bản thân..."
              ></textarea>
              <p class="text-sm text-gray-500 mt-1">
                {{ form.bio?.length || 0 }}/500 ký tự
              </p>
            </div>

            <!-- Submit Buttons -->
            <div class="flex gap-3">
              <button
                type="submit"
                :disabled="saving"
                class="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg hover:from-primary-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg font-semibold disabled:opacity-50"
              >
                {{ saving ? "Đang lưu..." : "💾 Lưu thay đổi" }}
              </button>
              <button
                type="button"
                @click="handleCancel"
                class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>

        <!-- Blockchain Wallet Section (chỉ hiện khi xem profile của mình) -->
        <WalletSection v-if="isOwnProfile" />

        <!-- Account Settings (chỉ hiện khi xem profile của mình) -->
        <div v-if="isOwnProfile" class="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
          <h3 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-6 flex items-center gap-2">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Cài đặt tài khoản
          </h3>

          <div class="space-y-4">
            <div class="flex items-center justify-between py-3 border-b">
              <div>
                <p class="font-medium text-gray-900">Thông báo email</p>
                <p class="text-sm text-gray-500">Nhận thông báo qua email</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="settings.emailNotifications"
                  type="checkbox"
                  class="sr-only peer"
                  @change="updateSettings"
                />
                <div
                  class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"
                ></div>
              </label>
            </div>

            <div class="flex items-center justify-between py-3 border-b">
              <div>
                <p class="font-medium text-gray-900">Hồ sơ công khai</p>
                <p class="text-sm text-gray-500">
                  Cho phép người khác xem hồ sơ của bạn
                </p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="settings.publicProfile"
                  type="checkbox"
                  class="sr-only peer"
                  @change="updateSettings"
                />
                <div
                  class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"
                ></div>
              </label>
            </div>

            <div
              v-if="user.role === 'blogger'"
              class="flex items-center justify-between py-3"
            >
              <div>
                <p class="font-medium text-gray-900">Hiển thị thu nhập</p>
                <p class="text-sm text-gray-500">
                  Cho người khác thấy tổng thu nhập của bạn
                </p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  v-model="settings.showEarnings"
                  type="checkbox"
                  class="sr-only peer"
                  @change="updateSettings"
                />
                <div
                  class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"
                ></div>
              </label>
            </div>
          </div>
        </div>

        <!-- Blogger's Articles Section -->
        <div v-if="user.role === 'blogger'" class="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
          <h3 class="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6 flex items-center gap-2">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            📝 Bài viết của {{ isOwnProfile ? 'bạn' : user.profile?.displayName || user.username }}
          </h3>

          <!-- Loading State -->
          <div v-if="loadingBlogs" class="flex justify-center py-8">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
          </div>

          <!-- Articles Grid -->
          <div v-else-if="userBlogs.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BlogCard
              v-for="blog in userBlogs"
              :key="blog._id"
              :blog="blog"
            />
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-12">
            <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="text-gray-500 text-lg">
              {{ isOwnProfile ? 'Bạn chưa có bài viết nào' : 'Người dùng này chưa có bài viết nào' }}
            </p>
            <router-link
              v-if="isOwnProfile"
              to="/viet-blog"
              class="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg font-semibold"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Viết bài mới
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import api from "@/services/api";
import blockchainService from "@/services/blockchain";
import BlogCard from "@/components/blog/BlogCard.vue";
import WalletSection from "@/components/wallet/WalletSection.vue";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const toast = useToast();

const loading = ref(false);
const editing = ref(false);
const saving = ref(false);
const uploadingAvatar = ref(false);
const avatarPreview = ref(null);
const avatarInput = ref(null);
const showFollowList = ref(false);
const followList = ref([]);
const followListLoaded = ref(false);
const avatarTimestamp = ref(Date.now());
const profileUser = ref(null); // User profile đang xem
const userBlogs = ref([]); // Bài viết của blogger
const loadingBlogs = ref(false);
const followLoading = ref(false); // Loading state cho follow button
const isOwnProfile = computed(() => !route.params.id || route.params.id === authStore.user?.id);

const user = computed(() => {
  // Nếu xem profile của người khác, dùng profileUser
  // Nếu xem profile của mình, dùng authStore.user
  if (isOwnProfile.value) {
    return authStore.user || {};
  }
  return profileUser.value || {};
});

const defaultAvatar = computed(
  () =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.value.username || "User")}&background=random`
);

const bloggerStats = computed(() => {
  // Nếu có dữ liệu blockchain, ưu tiên blockchain
  if (blockchainStats.value.loaded && user.value.role === 'blogger') {
    return {
      ...(user.value.bloggerStats || {}),
      totalEarnings: blockchainStats.value.earnings
    };
  }
  return user.value.bloggerStats || {};
});

const readerStats = computed(() => {
  // Nếu có dữ liệu blockchain, ưu tiên blockchain
  if (blockchainStats.value.loaded && user.value.role === 'reader') {
    return {
      ...(user.value.readerStats || {}),
      totalAmountTipped: blockchainStats.value.tipsSent
    };
  }
  return user.value.readerStats || {};
});

// Blockchain stats
const blockchainStats = ref({
  earnings: 0,
  tipsSent: 0,
  loaded: false
});

// Computed để lấy số lượng followers/following
const followersCount = computed(() => {
  if (user.value.role === 'blogger') {
    // Ưu tiên followersCount từ backend, fallback sang followers.length
    if (user.value.bloggerStats?.followersCount !== undefined) {
      return user.value.bloggerStats.followersCount;
    }
    const followers = user.value.bloggerStats?.followers || [];
    return Array.isArray(followers) ? followers.length : 0;
  } else {
    // Ưu tiên followingCount từ backend, fallback sang following.length
    if (user.value.readerStats?.followingCount !== undefined) {
      return user.value.readerStats.followingCount;
    }
    const following = user.value.readerStats?.following || [];
    return Array.isArray(following) ? following.length : 0;
  }
});

// Check if current user is following this blogger
const isFollowing = computed(() => {
  if (!authStore.user || isOwnProfile.value || user.value.role !== 'blogger') {
    return false;
  }
  
  const followers = user.value.bloggerStats?.followers || [];
  
  // Check nếu followers là array of IDs hoặc array of objects
  return followers.some(follower => {
    if (typeof follower === 'string') {
      return follower === authStore.user.id || follower === authStore.user._id;
    }
    return follower._id === authStore.user.id || follower.id === authStore.user.id;
  });
});

const form = reactive({
  displayName: "",
  bio: "",
});

const settings = reactive({
  emailNotifications: true,
  publicProfile: true,
  showEarnings: false,
});

const formatNumber = (num) => {
  if (!num && num !== 0) return "0";
  return new Intl.NumberFormat("vi-VN").format(num);
};

const getAvatarUrl = (avatarUrl) => {
  if (!avatarUrl) return defaultAvatar.value;
  // Thêm cache-busting parameter nếu avatar từ Cloudinary (dùng timestamp cố định)
  if (avatarUrl.includes('cloudinary.com')) {
    return `${avatarUrl}?t=${avatarTimestamp.value}`;
  }
  return avatarUrl;
};

// Helper cho avatar trong list (không cache-busting)
const getPersonAvatar = (person) => {
  if (person.profile?.avatar) {
    return person.profile.avatar;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(person.username)}&background=random`;
};

const initForm = () => {
  form.displayName = user.value.profile?.displayName || "";
  form.bio = user.value.profile?.bio || "";

  settings.emailNotifications = user.value.settings?.emailNotifications ?? true;
  settings.publicProfile = user.value.settings?.publicProfile ?? true;
  settings.showEarnings = user.value.settings?.showEarnings ?? false;
};

const handleImageError = (e) => {
  e.target.src = defaultAvatar.value;
};

const handleAvatarChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    toast.error("Ảnh không được vượt quá 5MB");
    return;
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    toast.error("Vui lòng chọn file ảnh");
    return;
  }

  try {
    uploadingAvatar.value = true;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "crypto_tip_images"); 

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dtwpwpv1m/image/upload`, 
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (data.secure_url) {
      // Gọi API riêng để update avatar
      const updateResponse = await api.put("/users/avatar", {
        avatar: data.secure_url,
      });

      if (updateResponse.data.success) {
        // Cập nhật avatar trong authStore (không ghi đè user object)
        if (authStore.user && authStore.user.profile) {
          authStore.user.profile.avatar = data.secure_url;
        }
        
        // Update timestamp để force refresh avatar
        avatarTimestamp.value = Date.now();
        avatarPreview.value = null;
        
        toast.success("Cập nhật avatar thành công!");
      } else {
        throw new Error("Failed to save avatar");
      }
    } else {
      throw new Error("Upload failed");
    }
  } catch (error) {
    console.error("Avatar upload error:", error);
    toast.error("Lỗi upload ảnh. Vui lòng thử lại.");
    avatarPreview.value = null;
  } finally {
    uploadingAvatar.value = false;
    // Reset file input
    if (event.target) {
      event.target.value = '';
    }
  }
};

const handleSubmit = async () => {
  try {
    saving.value = true;

    const payload = {
      displayName: form.displayName,
      bio: form.bio,
    };

    const response = await api.put("/users/profile", payload);

    if (response.data.success) {
      // Chỉ cập nhật profile fields, không ghi đè followers/following
      const updated = response.data.data.user || response.data.data;
      
      if (authStore.user) {
        authStore.user.profile = {
          ...authStore.user.profile,
          displayName: updated.profile.displayName,
          bio: updated.profile.bio,
        };
      }

      toast.success("Cập nhật thông tin thành công!");
      editing.value = false;
      avatarPreview.value = null;
      initForm();
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Lỗi cập nhật thông tin");
  } finally {
    saving.value = false;
  }
};

const handleCancel = () => {
  editing.value = false;
  avatarPreview.value = null;
  initForm();
};

const updateSettings = async () => {
  try {
    await api.put("/users/settings", settings);
    toast.success("Cập nhật cài đặt thành công");
  } catch (error) {
    toast.error("Lỗi cập nhật cài đặt");
  }
};

const loadFollowList = async () => {
  // Chỉ load 1 lần
  if (followListLoaded.value) {
    showFollowList.value = true;
    return;
  }

  try {
    showFollowList.value = true;
    
    // Lấy profile đầy đủ với populate
    const response = await api.get("/users/profile");
    
    if (response.data.success) {
      const userData = response.data.data.user;
      
      if (user.value.role === "blogger") {
        // Lấy danh sách followers
        followList.value = userData.bloggerStats?.followers || [];
      } else {
        // Lấy danh sách following
        followList.value = userData.readerStats?.following || [];
      }
      
      followListLoaded.value = true;
    }
  } catch (error) {
    console.error("Load follow list error:", error);
    showFollowList.value = false;
  }
};

const viewProfile = (person) => {
  if (person.role === 'blogger') {
    router.push(`/blogger/${person._id}`);
  } else {
    // Có thể navigate đến reader profile nếu có
    toast.info("Chỉ có thể xem profile của blogger");
  }
};

// Toggle follow/unfollow blogger
const toggleFollow = async () => {
  if (!authStore.isAuthenticated) {
    toast.info("Vui lòng đăng nhập để theo dõi blogger");
    router.push('/login');
    return;
  }

  try {
    followLoading.value = true;
    
    const bloggerId = user.value._id || user.value.id;
    const response = await api.post(`/users/${bloggerId}/follow`);
    
    if (response.data.success) {
      const wasFollowing = isFollowing.value;
      
      // Cập nhật followers trong user object
      if (response.data.data.isFollowing && !wasFollowing) {
        // Đã follow: thêm current user vào followers
        if (!user.value.bloggerStats) {
          user.value.bloggerStats = { followers: [], followersCount: 0 };
        }
        if (!user.value.bloggerStats.followers) {
          user.value.bloggerStats.followers = [];
        }
        user.value.bloggerStats.followers.push(authStore.user.id);
        user.value.bloggerStats.followersCount = (user.value.bloggerStats.followersCount || 0) + 1;
        toast.success(`✅ Đã theo dõi ${user.value.profile?.displayName || user.value.username}`);
      } else if (!response.data.data.isFollowing && wasFollowing) {
        // Đã unfollow: xóa current user khỏi followers
        if (user.value.bloggerStats?.followers) {
          user.value.bloggerStats.followers = user.value.bloggerStats.followers.filter(
            followerId => followerId !== authStore.user.id && followerId !== authStore.user._id
          );
        }
        user.value.bloggerStats.followersCount = Math.max((user.value.bloggerStats.followersCount || 1) - 1, 0);
        toast.info(`❌ Đã hủy theo dõi ${user.value.profile?.displayName || user.value.username}`);
      }
      
      // Reset follow list để load lại lần sau
      followListLoaded.value = false;
    }
  } catch (error) {
    console.error('Toggle follow error:', error);
    toast.error(error.response?.data?.message || 'Lỗi khi theo dõi/hủy theo dõi');
  } finally {
    followLoading.value = false;
  }
};

const loadUserBlogs = async (userId) => {
  // Validate userId trước khi gọi API
  if (!userId) {
    console.error("❌ Cannot load blogs: userId is empty");
    userBlogs.value = [];
    return;
  }

  try {
    loadingBlogs.value = true;
    userBlogs.value = []; // Reset blogs trước khi load mới
    
    const response = await api.get(`/blogs`, {
      params: {
        author: userId,
        limit: 6, // Hiển thị 6 bài mới nhất
        sort: 'latest'
      }
    });
    
    if (response.data.success) {
      userBlogs.value = response.data.data.blogs || [];
    }
  } catch (error) {
    console.error("Load user blogs error:", error);
    userBlogs.value = [];
  } finally {
    loadingBlogs.value = false;
  }
};

const loadUserProfile = async (userId) => {
  try {
    loading.value = true;
    userBlogs.value = []; // Reset blogs khi chuyển profile
    
    const response = await api.get(`/users/profile/${userId}`);
    
    if (response.data.success) {
      profileUser.value = response.data.data.user;
      
      // Load blogs nếu là blogger
      if (profileUser.value.role === 'blogger') {
        await loadUserBlogs(userId);
      }
      
      // Load blockchain stats nếu có wallet
      await loadBlockchainStats();
    } else {
      toast.error("Không tìm thấy người dùng");
      router.push("/");
    }
  } catch (error) {
    console.error("Load user profile error:", error);
    toast.error("Không thể tải thông tin người dùng");
    router.push("/");
  } finally {
    loading.value = false;
  }
};

// Watch route changes để load profile khác nhau
watch(() => route.params.id, async (newId) => {
  if (newId) {
    await loadUserProfile(newId);
  } else {
    // Reload own profile
    await loadOwnProfile();
  }
}, { immediate: false });

const loadOwnProfile = async () => {
  try {
    loading.value = true;
    userBlogs.value = []; // Reset blogs khi reload own profile
    
    const response = await api.get("/users/profile");
    if (response.data.success) {
      authStore.user = response.data.data.user;
      initForm();
      
      // Load blogs nếu là blogger
      if (authStore.user.role === 'blogger') {
        await loadUserBlogs(authStore.user.id);
      }
      
      // Load blockchain stats nếu có wallet
      await loadBlockchainStats();
    }
  } catch (error) {
    console.error("Failed to refresh user data:", error);
  } finally {
    loading.value = false;
  }
};

// Load blockchain stats
const loadBlockchainStats = async () => {
  if (!user.value.walletAddress) {
    console.log('No wallet address, skipping blockchain stats');
    return;
  }
  
  try {
    if (user.value.role === 'blogger') {
      // Load earnings từ blockchain
      const earnings = await blockchainService.getCreatorEarnings(user.value.walletAddress);
      blockchainStats.value.earnings = parseFloat(earnings);
      console.log('Loaded blockchain earnings:', earnings);
    } else if (user.value.role === 'reader') {
      // Load total tips sent từ blockchain
      const tipsSent = await blockchainService.getViewerTotalTips(user.value.walletAddress);
      blockchainStats.value.tipsSent = parseFloat(tipsSent);
      console.log('Loaded blockchain tips sent:', tipsSent);
    }
    blockchainStats.value.loaded = true;
  } catch (error) {
    console.error('Load blockchain stats error:', error);
    // Không hiển thị toast error vì có thể user chưa connect wallet blockchain
  }
};

onMounted(async () => {
  if (route.params.id) {
    // Xem profile người khác
    await loadUserProfile(route.params.id);
  } else {
    // Xem profile của mình
    await loadOwnProfile();
  }
});
</script>
