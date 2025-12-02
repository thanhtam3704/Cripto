<template>
  <nav class="navbar-glassmorphism sticky top-0 z-50">
    <!-- Animated Background -->
    <div
      class="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-white/80 to-pink-600/5 backdrop-blur-xl"
    ></div>
    <div
      class="absolute inset-0 bg-gradient-to-b from-white/60 to-white/40"
    ></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="flex justify-between h-20">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center space-x-3 group">
            <div class="relative">
              <!-- Logo glow effect -->
              <div
                class="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-500 scale-110"
              ></div>
              <div
                class="w-12 h-12 bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-600 rounded-xl flex items-center justify-center relative z-10 shadow-xl group-hover:scale-110 transition-all duration-300"
              >
                <span class="text-white font-bold text-lg animate-pulse"
                  >₿</span
                >
              </div>
            </div>
            <div class="flex flex-col">
              <span
                class="font-bold text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:from-purple-700 group-hover:to-pink-700 transition-all duration-300"
              >
                CryptoTip
              </span>
              <span class="text-xs text-gray-500 font-medium -mt-1"
                >Decentralized Tipping</span
              >
            </div>
          </router-link>
        </div>

        <!-- Navigation Links -->
        <div class="hidden md:flex items-center space-x-2">
          <router-link
            to="/"
            class="nav-link group relative px-4 py-2 text-gray-700 hover:text-purple-600 transition-all duration-300 font-semibold"
            active-class="text-purple-600"
          >
            <span class="relative z-10">Trang chủ</span>
            <div
              class="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100"
            ></div>
          </router-link>
          <router-link
            to="/blogs"
            class="nav-link group relative px-4 py-2 text-gray-700 hover:text-purple-600 transition-all duration-300 font-semibold"
            active-class="text-purple-600"
          >
            <span class="relative z-10">Blog</span>
            <div
              class="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100"
            ></div>
          </router-link>
          <router-link
            to="/bloggers"
            class="nav-link group relative px-4 py-2 text-gray-700 hover:text-purple-600 transition-all duration-300 font-semibold"
            active-class="text-purple-600"
          >
            <span class="relative z-10">Blogger</span>
            <div
              class="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100"
            ></div>
          </router-link>
        </div>

        <!-- Wallet & User Actions -->
        <div class="flex items-center space-x-4">
          <!-- Wallet Connection -->
          <WalletButton />

          <!-- Authentication -->
          <div v-if="!isAuthenticated" class="flex items-center space-x-3">
            <router-link
              to="/login"
              class="px-4 py-2 text-gray-700 hover:text-purple-600 transition-all duration-300 font-semibold rounded-lg hover:bg-purple-50"
            >
              Đăng nhập
            </router-link>
            <router-link
              to="/register"
              class="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Đăng ký
            </router-link>
          </div>

          <!-- User Menu -->
          <div v-else class="relative" ref="userMenuRef">
            <button
              @click="showUserMenu = !showUserMenu"
              class="flex items-center space-x-3 p-2 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 border border-transparent hover:border-purple-200 group"
            >
              <div class="relative">
                <img
                  :src="user?.profile?.avatar || defaultAvatar"
                  :key="user?.profile?.avatar || 'default'"
                  :alt="user?.profile?.displayName"
                  class="w-10 h-10 rounded-full object-cover ring-2 ring-white group-hover:ring-purple-200 transition-all duration-300 shadow-md"
                />
                <div
                  class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"
                ></div>
              </div>
              <span
                class="hidden sm:block text-sm font-semibold text-gray-700 group-hover:text-purple-700 transition-colors duration-300"
              >
                {{ user?.profile?.displayName }}
              </span>
              <ChevronDownIcon
                class="w-4 h-4 text-gray-500 group-hover:text-purple-600 transition-all duration-300 group-hover:rotate-180"
              />
            </button>

            <!-- Dropdown Menu -->
            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div
                v-show="showUserMenu"
                class="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 py-2 z-50 overflow-hidden"
              >
                <router-link
                  to="/dashboard"
                  class="group flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 transition-all duration-300 rounded-xl mx-2"
                  @click="showUserMenu = false"
                >
                  <div
                    class="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  >
                    <ChartBarIcon class="w-4 h-4 text-white" />
                  </div>
                  <span class="font-medium">Bảng điều khiển</span>
                </router-link>

                <router-link
                  to="/profile"
                  class="group flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 transition-all duration-300 rounded-xl mx-2"
                  @click="showUserMenu = false"
                >
                  <div
                    class="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  >
                    <UserIcon class="w-4 h-4 text-white" />
                  </div>
                  <span class="font-medium">Thông tin cá nhân</span>
                </router-link>

                <router-link
                  v-if="isBlogger"
                  to="/viet-blog"
                  class="group flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 transition-all duration-300 rounded-xl mx-2"
                  @click="showUserMenu = false"
                >
                  <div
                    class="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  >
                    <PlusIcon class="w-4 h-4 text-white" />
                  </div>
                  <span class="font-medium">Viết Blog</span>
                </router-link>

                <div
                  class="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-2 mx-4"
                ></div>

                <button
                  @click="handleLogout"
                  class="group flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-300 rounded-xl mx-2"
                >
                  <div
                    class="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  >
                    <ArrowRightOnRectangleIcon class="w-4 h-4 text-white" />
                  </div>
                  <span class="font-medium">Đăng xuất</span>
                </button>
              </div>
            </transition>
          </div>

          <!-- Mobile Menu Button -->
          <button
            @click="showMobileMenu = !showMobileMenu"
            class="md:hidden p-3 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 border border-transparent hover:border-purple-200 group"
          >
            <Bars3Icon
              class="w-6 h-6 text-gray-700 group-hover:text-purple-600 transition-colors duration-300"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div
      v-show="showMobileMenu"
      class="md:hidden border-t border-white/20 bg-white/80 backdrop-blur-xl"
    >
      <div class="px-4 py-4 space-y-2">
        <router-link
          to="/"
          class="block px-4 py-3 text-gray-700 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-xl transition-all duration-300 font-semibold"
          @click="showMobileMenu = false"
        >
          Trang chủ
        </router-link>
        <router-link
          to="/blogs"
          class="block px-4 py-3 text-gray-700 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-xl transition-all duration-300 font-semibold"
          @click="showMobileMenu = false"
        >
          Blogs
        </router-link>
        <router-link
          to="/bloggers"
          class="block px-4 py-3 text-gray-700 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-xl transition-all duration-300 font-semibold"
          @click="showMobileMenu = false"
        >
          Bloggers
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import WalletButton from "@/components/wallet/WalletButton.vue";
import {
  ChevronDownIcon,
  ChartBarIcon,
  UserIcon,
  PlusIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
} from "@heroicons/vue/24/outline";

export default {
  name: "Navbar",
  components: {
    WalletButton,
    ChevronDownIcon,
    ChartBarIcon,
    UserIcon,
    PlusIcon,
    ArrowRightOnRectangleIcon,
    Bars3Icon,
  },
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const showUserMenu = ref(false);
    const showMobileMenu = ref(false);
    const userMenuRef = ref(null);

    const isAuthenticated = computed(() => authStore.isAuthenticated);
    const isBlogger = computed(() => authStore.user?.role === "blogger");
    const user = computed(() => authStore.user);

    const defaultAvatar =
      "https://ui-avatars.com/api/?name=User&background=6366f1&color=fff";

    const handleLogout = async () => {
      showUserMenu.value = false;
      await authStore.logout();
      router.push("/");
    };

    // Close menu when clicking outside
    const handleClickOutside = (event) => {
      if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
        showUserMenu.value = false;
      }
    };

    onMounted(() => {
      document.addEventListener("click", handleClickOutside);
    });

    onUnmounted(() => {
      document.removeEventListener("click", handleClickOutside);
    });

    return {
      showUserMenu,
      showMobileMenu,
      userMenuRef,
      isAuthenticated,
      isBlogger,
      user,
      defaultAvatar,
      handleLogout,
    };
  },
};
</script>

<style scoped>
.navbar-glassmorphism {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(255, 255, 255, 0.8) 50%,
    rgba(255, 255, 255, 0.9) 100%
  );
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow:
    0 8px 32px 0 rgba(31, 38, 135, 0.1),
    0 2px 16px 0 rgba(31, 38, 135, 0.05);
  position: relative;
}

.navbar-glassmorphism::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(147, 51, 234, 0.02) 0%,
    rgba(255, 255, 255, 0.05) 50%,
    rgba(236, 72, 153, 0.02) 100%
  );
  z-index: -1;
}

/* Navigation link active state */
.nav-link.router-link-active {
  color: rgb(147 51 234);
  font-weight: 600;
}

.nav-link.router-link-active::after {
  content: "";
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  background: linear-gradient(45deg, rgb(147 51 234), rgb(236 72 153));
  border-radius: 50%;
  animation: pulse 2s infinite;
}

/* Floating animation for logo */
@keyframes logoFloat {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-2px) rotate(2deg);
  }
}

.group:hover .logo-animate {
  animation: logoFloat 2s ease-in-out infinite;
}

/* Gradient animation for text */
@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animate-gradient-text {
  background-size: 200% 200%;
  animation: gradientShift 3s ease infinite;
}

/* Smooth dropdown animation */
.dropdown-menu {
  animation: dropdownSlide 0.3s ease-out;
}

@keyframes dropdownSlide {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Hover glow effect */
.hover-glow:hover {
  box-shadow: 0 0 20px rgba(147, 51, 234, 0.4);
}

/* Mobile menu slide animation */
.mobile-menu-slide-enter-active,
.mobile-menu-slide-leave-active {
  transition: all 0.3s ease;
}

.mobile-menu-slide-enter-from,
.mobile-menu-slide-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
