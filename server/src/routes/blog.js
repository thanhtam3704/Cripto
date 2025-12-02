const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const { ResponseHelper } = require("../utils/response");
const Blog = require("../models/Blog");
const User = require("../models/User");
const mongoose = require("mongoose");

const router = express.Router();

// GET /api/blogs - Get all blogs with filters
router.get("/", async (req, res) => {
  try {
    const {
      category,
      author,
      tags,
      search,
      page = 1,
      limit = 12,
      sort = "latest", // latest, trending, popular
    } = req.query;

    const query = {};

    // Category filter
    if (category) {
      query.category = category;
    }

    // Author filter
    if (author) {
      // Validate ObjectId
      if (mongoose.Types.ObjectId.isValid(author)) {
        query.author = author;
      }
    }

    // Tags filter
    if (tags) {
      const tagsArray = Array.isArray(tags) ? tags : tags.split(",");
      query.tags = { $in: tagsArray };
    }

    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // Default: latest

    switch (sort) {
      case "trending":
        // totalTipAmount đã xóa - sort by views và createdAt
        sortOption = { views: -1, createdAt: -1 };
        break;
      case "popular":
        sortOption = { views: -1, createdAt: -1 };
        break;
      case "oldest":
        sortOption = { createdAt: 1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const blogs = await Blog.find(query)
      .populate("author", "username profile walletAddress")
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Blog.countDocuments(query);

    return ResponseHelper.success(
      res,
      {
        blogs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
      "Lấy danh sách bài viết thành công"
    );
  } catch (error) {
    console.error("Get blogs error:", error);
    return ResponseHelper.serverError(res, "Lỗi lấy danh sách bài viết", error);
  }
});

// GET /api/blogs/recommended - Get recommended blogs
router.get("/recommended", async (req, res) => {
  try {
    const { limit = 3 } = req.query;

    const blogs = await Blog.findRecommended(parseInt(limit));

    return ResponseHelper.success(
      res,
      { blogs },
      "Lấy bài viết đề xuất thành công"
    );
  } catch (error) {
    console.error("Get recommended blogs error:", error);
    return ResponseHelper.serverError(res, "Lỗi lấy bài viết đề xuất", error);
  }
});

// GET /api/blogs/featured - Get featured blogs
router.get("/featured", async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const blogs = await Blog.findFeatured(parseInt(limit));

    return ResponseHelper.success(
      res,
      { blogs },
      "Lấy bài viết featured thành công"
    );
  } catch (error) {
    console.error("Get featured blogs error:", error);
    return ResponseHelper.serverError(res, "Lỗi lấy bài viết featured", error);
  }
});

// GET /api/blogs/:id - Get blog by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ResponseHelper.error(res, "ID bài viết không hợp lệ", 400);
    }

    const blogDoc = await Blog.findById(id).populate(
      "author",
      "username profile walletAddress bloggerStats"
    );

    if (!blogDoc) {
      return ResponseHelper.error(res, "Không tìm thấy bài viết", 404);
    }

    // Increment views (don't await, run in background)
    blogDoc
      .incrementViews()
      .catch((err) => console.error("Error incrementing views:", err));

    return ResponseHelper.success(
      res,
      { blog: blogDoc },
      "Lấy bài viết thành công"
    );
  } catch (error) {
    console.error("Get blog error:", error);
    return ResponseHelper.serverError(res, "Lỗi lấy bài viết", error);
  }
});

// POST /api/blogs - Create new blog
router.post("/", authenticateToken, async (req, res) => {
  try {
    const {
      title,
      content,
      coverImage,
      category,
      tags,
    } = req.body;

    // Validation
    if (!title || title.trim().length === 0) {
      return ResponseHelper.error(res, "Tiêu đề không được để trống", 400);
    }

    if (!content || content.trim().length < 100) {
      return ResponseHelper.error(
        res,
        "Nội dung phải có ít nhất 100 ký tự",
        400
      );
    }

    // Check if user is a blogger
    if (req.user.role !== "blogger" && req.user.role !== "admin") {
      return ResponseHelper.error(
        res,
        "Chỉ blogger mới có thể tạo bài viết",
        403
      );
    }

    // Create blog
    const blogDoc = new Blog({
      title,
      content,
      coverImage,
      category: category || "other",
      tags: tags || [],
      author: req.user.id,
    });

    await blogDoc.save();

    // Update blogger stats
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { "bloggerStats.totalArticles": 1 },
    });

    // Populate author
    await blogDoc.populate("author", "username profile walletAddress");

    return ResponseHelper.success(
      res,
      { blog: blogDoc },
      "Tạo bài viết thành công",
      201
    );
  } catch (error) {
    console.error("Create blog error:", error);
    return ResponseHelper.serverError(res, "Lỗi tạo bài viết", error);
  }
});

// PUT /api/blogs/:id - Update blog
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ResponseHelper.error(res, "ID bài viết không hợp lệ", 400);
    }

    const blogDoc = await Blog.findById(id);

    if (!blogDoc) {
      return ResponseHelper.error(res, "Không tìm thấy bài viết", 404);
    }

    // Check ownership (or admin)
    if (
      blogDoc.author.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return ResponseHelper.error(
        res,
        "Bạn không có quyền chỉnh sửa bài viết này",
        403
      );
    }

    // Update fields
    const allowedUpdates = [
      "title",
      "content",
      "coverImage",
      "category",
      "tags",
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        blogDoc[field] = req.body[field];
      }
    });

    await blogDoc.save();

    // Populate author
    await blogDoc.populate("author", "username profile walletAddress");

    return ResponseHelper.success(
      res,
      { blog: blogDoc },
      "Cập nhật bài viết thành công"
    );
  } catch (error) {
    console.error("Update blog error:", error);
    return ResponseHelper.serverError(res, "Lỗi cập nhật bài viết", error);
  }
});

// DELETE /api/blogs/:id - Soft delete blog
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ResponseHelper.error(res, "ID bài viết không hợp lệ", 400);
    }

    const blogDoc = await Blog.findById(id);

    if (!blogDoc) {
      return ResponseHelper.error(res, "Không tìm thấy bài viết", 404);
    }

    // Check ownership (or admin)
    if (
      blogDoc.author.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return ResponseHelper.error(
        res,
        "Bạn không có quyền xóa bài viết này",
        403
      );
    }

    // Delete permanently
    await blogDoc.deleteOne();

    // Update blogger stats
    await User.findByIdAndUpdate(blogDoc.author, {
      $inc: { "bloggerStats.totalArticles": -1 },
    });

    return ResponseHelper.success(res, null, "Xóa bài viết thành công");
  } catch (error) {
    console.error("Delete blog error:", error);
    return ResponseHelper.serverError(res, "Lỗi xóa bài viết", error);
  }
});

// POST /api/blogs/:id/like - Toggle like
router.post("/:id/like", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ResponseHelper.error(res, "ID bài viết không hợp lệ", 400);
    }

    const blogDoc = await Blog.findById(id);

    if (!blogDoc) {
      return ResponseHelper.error(res, "Không tìm thấy bài viết", 404);
    }

    await blogDoc.toggleLike(req.user.id);

    return ResponseHelper.success(
      res,
      {
        likes: blogDoc.likes,
        likeCount: blogDoc.likeCount,
      },
      "Cập nhật like thành công"
    );
  } catch (error) {
    console.error("Toggle like error:", error);
    return ResponseHelper.serverError(res, "Lỗi cập nhật like", error);
  }
});

// GET /api/blogs/:id/related - Get related blogs
router.get("/:id/related", async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 3 } = req.query;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return ResponseHelper.error(res, "ID bài viết không hợp lệ", 400);
    }

    const blogDoc = await Blog.findById(id);

    if (!blogDoc) {
      return ResponseHelper.error(res, "Không tìm thấy bài viết", 404);
    }

    // Find related blogs by same author or same category/tags
    const relatedblogs = await Blog.find({
      _id: { $ne: id },
      $or: [
        { author: blogDoc.author },
        { category: blogDoc.category },
        { tags: { $in: blogDoc.tags } },
      ],
    })
      .populate("author", "username profile walletAddress")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    return ResponseHelper.success(
      res,
      { blogs: relatedblogs },
      "Lấy bài viết liên quan thành công"
    );
  } catch (error) {
    console.error("Get related blogs error:", error);
    return ResponseHelper.serverError(res, "Lỗi lấy bài viết liên quan", error);
  }
});

module.exports = router;
