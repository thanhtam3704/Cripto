import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

// Views
import Home from "@/views/Home.vue";
import Login from "@/views/auth/Login.vue";
import Register from "@/views/auth/Register.vue";
import AuthCallback from "@/views/auth/AuthCallback.vue";
import VerifyEmail from "@/views/auth/VerifyEmail.vue";

// Article Views
import BlogDetail from "@/views/blogs/BlogDetail.vue";
import BlogList from "@/views/blogs/BlogList.vue";
import WriteBlog from "@/views/blogger/WriteBlog.vue";

// Dashboard Views
import BloggerDashboard from "@/views/dashboard/BloggerDashboard.vue";
import ReaderDashboard from "@/views/dashboard/ReaderDashboard.vue";
import BloggerList from "@/views/blogger/list/BloggerList.vue";

import Profile from "@/views/profile/Profile.vue";
import NotFound from "@/views/NotFound.vue";

// Blockchain Test
import BlockchainTest from "@/views/BlockchainTest.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      title: "Trang chủ - Crypto Tipping System",
    },
  },

  // Blockchain Test Route
  {
    path: "/blockchain-test",
    name: "BlockchainTest",
    component: BlockchainTest,
    meta: {
      title: "Blockchain Test",
    },
  },

  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      title: "Đăng nhập",
      requiresGuest: true,
    },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: {
      title: "Đăng ký",
      requiresGuest: true,
    },
  },
  {
    path: "/auth/callback",
    name: "AuthCallback",
    component: AuthCallback,
    meta: {
      title: "Đang đăng nhập...",
    },
  },
  {
    path: "/verify-email/:token",
    name: "VerifyEmail",
    component: VerifyEmail,
    meta: {
      title: "Xác thực email",
    },
  },
  // Article Routes (NEW)
  {
    path: "/blogs",
    name: "BlogList",
    component: BlogList,
    meta: {
      title: "Articles",
    },
  },
  {
    path: "/blog/:id",
    name: "BlogDetail",
    component: BlogDetail,
    props: true,
    meta: {
      title: "Article Detail",
    },
  },
  {
    path: "/viet-blog",
    name: "WriteBlog",
    component: WriteBlog,
    meta: {
      title: "Write Article",
      requiresAuth: true,
      requiresRole: "blogger",
    },
  },
  {
    path: "/viet-blog/:id",
    name: "EditArticle",
    component: WriteBlog,
    props: true,
    meta: {
      title: "Edit Article",
      requiresAuth: true,
      requiresRole: "blogger",
    },
  },

  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("@/views/dashboard/DashboardRedirect.vue"),
    meta: {
      title: "Dashboard",
      requiresAuth: true,
    },
  },

  // blogger/Reader Dashboard Routes (NEW)
  {
    path: "/blogger/dashboard",
    name: "BloggerDashboard",
    component: BloggerDashboard,
    meta: {
      title: "blogger Dashboard",
      requiresAuth: true,
      requiresRole: "blogger",
    },
  },
  {
    path: "/reader/dashboard",
    name: "ReaderDashboard",
    component: ReaderDashboard,
    meta: {
      title: "Reader Dashboard",
      requiresAuth: true,
      requiresRole: "reader",
    },
  },

  // bloggers List
  {
    path: "/bloggers",
    name: "BloggerList",
    component: BloggerList,
    meta: {
      title: "Bloggers",
    },
  },
  {
    path: "/blogger/:id",
    name: "BloggerProfile",
    component: Profile,
    props: true,
    meta: {
      title: "Blogger Profile",
    },
  },

  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: {
      title: "Thông tin cá nhân",
      requiresAuth: true,
    },
  },

  {
    path: "/profile/:id",
    name: "UserProfile",
    component: Profile,
    meta: {
      title: "Thông tin người dùng",
    },
  },

  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
    meta: {
      title: "Không tìm thấy trang",
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Set page title
  document.title = to.meta.title || "Crypto Tipping System";

  // Wait for auth check to complete if token exists but user not loaded yet
  if (authStore.token && !authStore.user && !authStore.loading) {
    await authStore.checkAuth();
  }

  // Check authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: "Login", query: { redirect: to.fullPath } });
    return;
  }

  // Check guest only routes
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: "Home" });
    return;
  }

  // Check role requirements
  if (to.meta.requiresRole && authStore.user?.role !== to.meta.requiresRole) {
    next({ name: "Home" });
    return;
  }

  // Redirect dashboard based on user role
  if (to.name === "Dashboard" && authStore.user) {
    if (authStore.user.role === "blogger") {
      next({ name: "BloggerDashboard" });
      return;
    } else {
      next({ name: "ReaderDashboard" });
      return;
    }
  }

  next();
});

export default router;
