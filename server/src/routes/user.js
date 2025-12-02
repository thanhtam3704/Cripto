const express = require("express");
const UserController = require("../controllers/userController");
const {
  authenticateToken,
  optionalAuth,
  requireRole,
} = require("../middleware/auth");
const {
  validateProfileUpdate,
  validatePagination,
} = require("../utils/validation");

const router = express.Router();

// GET /api/user/profile - Lấy profile (cần auth)
router.get("/profile", authenticateToken, UserController.getProfile);

// GET /api/user/profile/:userId - Lấy profile người dùng khác (public)
router.get("/profile/:userId", UserController.getUserProfile);

// PUT /api/user/profile - Cập nhật profile (cần auth)
router.put(
  "/profile",
  authenticateToken,
  validateProfileUpdate,
  UserController.updateProfile
);

// PUT /api/user/avatar - Cập nhật avatar riêng (cần auth)
router.put(
  "/avatar",
  authenticateToken,
  UserController.updateAvatar
);

// GET /api/user/stats - Lấy thống kê user (cần auth)
router.get("/stats", authenticateToken, UserController.getStats);

// POST /api/user/:bloggerId/follow - Follow/Unfollow blogger
router.post(
  "/:bloggerId/follow",
  authenticateToken,
  UserController.toggleFollow
);

// GET /api/user/:bloggerId/follow-status - Check follow status
router.get(
  "/:bloggerId/follow-status",
  authenticateToken,
  UserController.getFollowStatus
);

// GET /api/user/bloggers - Lấy danh sách bloggers (public)
router.get("/bloggers", validatePagination, UserController.getBloggers);

// PATCH /api/user/wallet - Cập nhật địa chỉ ví blockchain (cho cả reader và blogger)
router.patch(
  "/wallet",
  authenticateToken,
  UserController.updateWallet
);

// POST /api/user/change-password - Đổi mật khẩu
router.post("/change-password", authenticateToken, UserController.changePassword);

// PUT /api/user/settings - Cập nhật settings
router.put("/settings", authenticateToken, UserController.updateSettings);

module.exports = router;
