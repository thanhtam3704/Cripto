const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  
  // Rich text content (HTML from TipTap)
  content: {
    type: String,
    required: true,
    minlength: 100,
    maxlength: 100000  // ~100k characters for very long blog posts
  },
  
  // Author (was "creator" in Video model)
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Cover image URL
  coverImage: {
    type: String,
    default: null
  },
  
  // Reading time in minutes (auto-calculated)
  readingTime: {
    type: Number,
    default: 1,
    min: 1
  },
  
  // Tags for blog
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  // Blog category
  category: {
    type: String,
    enum: [
      'technology', 
      'blockchain', 
      'crypto', 
      'web3',
      'defi',
      'nft',
      'education', 
      'tutorial',
      'lifestyle', 
      'business',
      'news',
      'opinion',
      'other'
    ],
    default: 'other'
  },
  
  // Statistics
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // totalTips và totalTipAmount đã xóa - lấy từ blockchain thay thế
  // Frontend sẽ query blockchain để đếm tips cho blog này
  
  // Likes (array of user IDs)
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for like count
blogSchema.virtual('likeCount').get(function() {
  return this.likes ? this.likes.length : 0;
});

// Virtual for word count
blogSchema.virtual('wordCount').get(function() {
  if (!this.content) return 0;
  // Remove HTML tags and count words
  const text = this.content.replace(/<[^>]*>/g, '');
  return text.split(/\s+/).filter(word => word.length > 0).length;
});

// Instance method: Increment views
blogSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method addTip đã xóa - không cần update blog stats vì lấy từ blockchain

// Instance method: Calculate reading time
blogSchema.methods.calculateReadingTime = function() {
  // Average reading speed: 200 words per minute
  const words = this.wordCount;
  this.readingTime = Math.max(1, Math.ceil(words / 200));
  return this.readingTime;
};

// Instance method: Toggle like
blogSchema.methods.toggleLike = function(userId) {
  const index = this.likes.indexOf(userId);
  
  if (index === -1) {
    // Add like
    this.likes.push(userId);
  } else {
    // Remove like
    this.likes.splice(index, 1);
  }
  
  return this.save();
};

// Static method: Find Blogs by author
blogSchema.statics.findByAuthor = function(authorId) {
  const query = { author: authorId };
  
  return this.find(query)
    .populate('author', 'username profile')
    .sort({ createdAt: -1 });
};

// Static method: Find recommended Blogs (random)
blogSchema.statics.findRecommended = function(limit = 3) {
  return this.aggregate([
    { $sample: { size: limit } },
    { $lookup: {
        from: 'users',
        localField: 'author',
        foreignField: '_id',
        as: 'author'
      }
    },
    { $unwind: '$author' },
    { $project: {
        'author.password': 0,
        'author.email': 0,
        'author.__v': 0
      }
    }
  ]);
};

// Static method: Find featured Blogs
blogSchema.statics.findFeatured = function(limit = 5) {
  // totalTipAmount đã xóa - sort by views và createdAt
  return this.find({})
    .sort({ views: -1, createdAt: -1 })
    .limit(limit)
    .populate('author', 'username profile');
};

// Static method: Search Blogs
blogSchema.statics.searchBlogs = function(searchQuery, options = {}) {
  const { category, tags, author, limit = 20, skip = 0 } = options;
  
  const query = {};
  
  // Text search
  if (searchQuery) {
    query.$text = { $search: searchQuery };
  }
  
  // Filters
  if (category) query.category = category;
  if (tags && tags.length) query.tags = { $in: tags };
  if (author) query.author = author;
  
  return this.find(query)
    .populate('author', 'username profile')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Pre-save hook: Calculate reading time automatically
blogSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    this.calculateReadingTime();
  }
  
  next();
});

// Indexes for performance
blogSchema.index({ author: 1, createdAt: -1 });
blogSchema.index({ createdAt: -1 });
// totalTipAmount index đã xóa - không cần nữa
blogSchema.index({ views: -1 });
blogSchema.index({ category: 1, createdAt: -1 });
blogSchema.index({ tags: 1 });

// Text index for search
blogSchema.index({ title: 'text', content: 'text', tags: 'text' });

// Kiểm tra model đã tồn tại chưa trước khi tạo
module.exports = mongoose.models.Blog || mongoose.model('Blog', blogSchema);



