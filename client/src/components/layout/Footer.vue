<template>
  <footer class="bg-gray-900 text-white mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- About Section -->
        <div>
          <h3 class="text-lg font-bold mb-4">Về Chúng Tôi</h3>
          <p class="text-gray-400 text-sm">
            Nền tảng chia sẻ blog và hỗ trợ bloggers bằng cryptocurrency.
          </p>
        </div>
        
        <!-- Quick Links -->
        <div>
          <h3 class="text-lg font-bold mb-4">Liên Kết</h3>
          <ul class="space-y-2">
            <li>
              <router-link to="/" class="text-gray-400 hover:text-white transition-colors">
                Trang chủ
              </router-link>
            </li>
            <li>
              <router-link to="/blogs" class="text-gray-400 hover:text-white transition-colors">
                Blogs
              </router-link>
            </li>
            <li>
              <router-link to="/bloggers" class="text-gray-400 hover:text-white transition-colors">
                Bloggers
              </router-link>
            </li>
          </ul>
        </div>
        
        <!-- Resources -->
        <div>
          <h3 class="text-lg font-bold mb-4">Tài Nguyên</h3>
          <ul class="space-y-2">
            <li>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                Hướng dẫn
              </a>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                FAQ
              </a>
            </li>
            <li>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                Hỗ trợ
              </a>
            </li>
          </ul>
        </div>
        
        <!-- Social -->
        <div>
          <h3 class="text-lg font-bold mb-4">Mạng Xã Hội</h3>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <span class="sr-only">Facebook</span>
              📘
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <span class="sr-only">Twitter</span>
              🐦
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <span class="sr-only">Instagram</span>
              📷
            </a>
          </div>
        </div>
      </div>
      
      <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
        <p>&copy; 2024 Crypto Blog Platform. Tất cả quyền được bảo lưu.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Simple footer component
</script>

<style scoped>
footer {
  flex-shrink: 0;
}
</style>
