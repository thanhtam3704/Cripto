<template>
  <router-link 
    :to="`/blogger/${blogger._id || blogger.id}`" 
    class="blogger-card group cursor-pointer relative overflow-hidden block"
  >
    <div class="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
    
    <div class="relative z-10 text-center">
      <div class="relative inline-block mb-4">
        <img 
          :src="blogger.profile?.avatar || defaultAvatar" 
          :alt="blogger.profile?.displayName || blogger.username"
          class="w-24 h-24 rounded-full object-cover mx-auto border-4 border-white shadow-xl transition-all duration-500 group-hover:scale-110"
        />
        
        <div v-if="blogger.isVerified" class="absolute -top-1 -right-1">
          <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
            <CheckBadgeIcon class="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
      
      <div class="space-y-3">
        <h3 class="font-bold text-xl text-gray-900 group-hover:text-purple-600 transition-all duration-500">
          {{ blogger.profile?.displayName || blogger.username }}
        </h3>
        
        <p v-if="blogger.profile?.bio" class="text-sm text-gray-600 line-clamp-2 px-4">
          {{ blogger.profile.bio }}
        </p>
        
        <div class="grid grid-cols-2 gap-2 mt-4">
          <div class="text-center">
            <div class="font-bold text-gray-900">{{ formatNumber(blogger.bloggerStats?.followersCount || blogger.bloggerStats?.followers?.length || 0) }}</div>
            <div class="text-xs text-gray-500">Followers</div>
          </div>
          
          <div class="text-center">
            <div class="font-bold text-gray-900">{{ formatNumber(blogger.bloggerStats?.totalArticles || 0) }}</div>
            <div class="text-xs text-gray-500">Bài viết</div>
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'
import { CheckBadgeIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  blogger: {
    type: Object,
    required: true
  }
})

const defaultAvatar = computed(() => {
  const name = props.blogger.profile?.displayName || props.blogger.username || 'Blogger'
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`
})

const formatNumber = (num) => {
  if (!num) return '0'
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.blogger-card {
  background: white;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
  transition: all 0.4s ease;
}

.blogger-card:hover {
  box-shadow: 0 25px 50px 0 rgba(139, 69, 19, 0.15);
  transform: translateY(-8px);
}
</style>