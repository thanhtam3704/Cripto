import { defineStore } from 'pinia'
import apiService from '@/services/api'
import { useToast } from 'vue-toastification'

const toast = useToast()

export const useBlogStore = defineStore('blog', {
  state: () => ({
    blogs: [],
    currentblog: null,
    trendingblogs: [],
    featuredblogs: [],
    relatedblogs: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 12,
      total: 0,
      pages: 0
    }
  }),

  getters: {
    // Check if current user is author
    isAuthor: (state) => (userId) => {
      return state.currentblog?.author?._id === userId || state.currentblog?.author?.id === userId
    }
  },

  actions: {
    // Fetch blogs with filters
    async fetchblogs(filters = {}) {
      try {
        this.loading = true
        this.error = null
        
        const params = {
          page: filters.page || 1,
          limit: filters.limit || 12,
          category: filters.category,
          author: filters.author,
          tags: filters.tags,
          search: filters.search,
          sort: filters.sort || 'latest'
        }
        
        // Remove undefined params
        Object.keys(params).forEach(key => {
          if (params[key] === undefined || params[key] === '') {
            delete params[key]
          }
        })
        
        const response = await apiService.get('/blogs', { params })
        
        if (response.data.success) {
          this.blogs = response.data.data.blogs
          this.pagination = response.data.data.pagination
          return { success: true, blogs: this.blogs }
        }
        
        throw new Error(response.data.message || 'Lấy danh sách bài viết thất bại')
        
      } catch (error) {
        console.error('Fetch blogs error:', error)
        this.error = error.message
        // Don't show toast for rate limiting errors
        if (error.response?.status !== 429) {
          toast.error(error.message || 'Lỗi lấy danh sách bài viết')
        }
        return { success: false, message: error.message }
      } finally {
        this.loading = false
      }
    },

    // Fetch recommended blogs
    async fetchRecommendedBlogs(limit = 3) {
      try {
        const response = await apiService.get('/blogs/recommended', {
          params: { limit }
        })
        
        if (response.data.success) {
          this.trendingblogs = response.data.data.blogs
          return { success: true, blogs: this.trendingblogs }
        }
        
        throw new Error(response.data.message || 'Lấy bài viết đề xuất thất bại')
        
      } catch (error) {
        console.error('Fetch recommended blogs error:', error)
        // Don't show toast for rate limiting errors
        if (error.response?.status !== 429) {
          toast.error(error.message || 'Lỗi lấy bài viết trending')
        }
        return { success: false, message: error.message }
      }
    },

    // Fetch featured blogs
    async fetchFeaturedblogs(limit = 5) {
      try {
        const response = await apiService.get('/blogs/featured', {
          params: { limit }
        })
        
        if (response.data.success) {
          this.featuredblogs = response.data.data.blogs
          return { success: true, blogs: this.featuredblogs }
        }
        
        throw new Error(response.data.message || 'Lấy bài viết featured thất bại')
        
      } catch (error) {
        console.error('Fetch featured blogs error:', error)
        return { success: false, message: error.message }
      }
    },

    // Fetch blog by ID
    async fetchblogById(id) {
      try {
        this.loading = true
        this.error = null
        
        const response = await apiService.get(`/blogs/${id}`)
        
        if (response.data.success) {
          this.currentblog = response.data.data.blog
          return { success: true, blog: this.currentblog }
        }
        
        throw new Error(response.data.message || 'Lấy bài viết thất bại')
        
      } catch (error) {
        console.error('Fetch blog error:', error)
        this.error = error.message
        toast.error(error.message || 'Lỗi lấy bài viết')
        return { success: false, message: error.message }
      } finally {
        this.loading = false
      }
    },

    // Fetch related blogs
    async fetchRelatedblogs(id, limit = 3) {
      try {
        const response = await apiService.get(`/blogs/${id}/related`, {
          params: { limit }
        })
        
        if (response.data.success) {
          this.relatedblogs = response.data.data.blogs
          return { success: true, blogs: this.relatedblogs }
        }
        
        throw new Error(response.data.message || 'Lấy bài viết liên quan thất bại')
        
      } catch (error) {
        console.error('Fetch related blogs error:', error)
        return { success: false, message: error.message }
      }
    },

    // Create new blog
    async createblog(blogData) {
      try {
        this.loading = true
        this.error = null
        
        const response = await apiService.post('/blogs', blogData)
        
        if (response.data.success) {
          const newblog = response.data.data.blog
          
          // Add to blogs list
          this.blogs.unshift(newblog)
          
          this.currentblog = newblog
          
          toast.success('Bài viết đã được tạo thành công!')
          return { success: true, blog: newblog }
        }
        
        throw new Error(response.data.message || 'Tạo bài viết thất bại')
        
      } catch (error) {
        console.error('Create blog error:', error)
        this.error = error.message
        toast.error(error.message || 'Lỗi tạo bài viết')
        return { success: false, message: error.message }
      } finally {
        this.loading = false
      }
    },

    // Update blog
    async updateblog(id, blogData) {
      try {
        this.loading = true
        this.error = null
        
        const response = await apiService.put(`/blogs/${id}`, blogData)
        
        if (response.data.success) {
          const updatedblog = response.data.data.blog
          
          // Update in blogs list
          const index = this.blogs.findIndex(a => a._id === id)
          if (index !== -1) {
            this.blogs[index] = updatedblog
          }
          
          // Update current blog
          if (this.currentblog?._id === id) {
            this.currentblog = updatedblog
          }
          
          toast.success('Bài viết đã được cập nhật!')
          return { success: true, blog: updatedblog }
        }
        
        throw new Error(response.data.message || 'Cập nhật bài viết thất bại')
        
      } catch (error) {
        console.error('Update blog error:', error)
        this.error = error.message
        toast.error(error.message || 'Lỗi cập nhật bài viết')
        return { success: false, message: error.message }
      } finally {
        this.loading = false
      }
    },

    // Delete blog (soft delete)
    async deleteblog(id) {
      try {
        this.loading = true
        this.error = null
        
        const response = await apiService.delete(`/blogs/${id}`)
        
        if (response.data.success) {
          // Remove from blogs list
          this.blogs = this.blogs.filter(a => a._id !== id)
          
          // Clear current blog if it's the deleted one
          if (this.currentblog?._id === id) {
            this.currentblog = null
          }
          
          toast.success('Bài viết đã được xóa!')
          return { success: true }
        }
        
        throw new Error(response.data.message || 'Xóa bài viết thất bại')
        
      } catch (error) {
        console.error('Delete blog error:', error)
        this.error = error.message
        toast.error(error.message || 'Lỗi xóa bài viết')
        return { success: false, message: error.message }
      } finally {
        this.loading = false
      }
    },

    // Toggle like blog
    async toggleLike(id) {
      try {
        const response = await apiService.post(`/blogs/${id}/like`)
        
        if (response.data.success) {
          const { likes, likeCount } = response.data.data
          
          // Update current blog
          if (this.currentblog?._id === id) {
            this.currentblog.likes = likes
          }
          
          // Update in blogs list
          const index = this.blogs.findIndex(a => a._id === id)
          if (index !== -1) {
            this.blogs[index].likes = likes
          }
          
          return { success: true, likes, likeCount }
        }
        
        throw new Error(response.data.message || 'Cập nhật like thất bại')
        
      } catch (error) {
        console.error('Toggle like error:', error)
        toast.error(error.message || 'Lỗi cập nhật like')
        return { success: false, message: error.message }
      }
    },

    // Clear current blog
    clearCurrentblog() {
      this.currentblog = null
    },

    // Clear all blogs
    clearblogs() {
      this.blogs = []
      this.pagination = {
        page: 1,
        limit: 12,
        total: 0,
        pages: 0
      }
    }
  }
})


