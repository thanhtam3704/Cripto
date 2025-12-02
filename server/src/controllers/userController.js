const User = require("../models/User");
const { ResponseHelper, cleanUserData } = require("../utils/response");

// Helper function để thêm followersCount vào user data
const addFollowersCount = (userData) => {
  const user = typeof userData.toObject === 'function' ? userData.toObject() : userData;
  
  if (user.bloggerStats) {
    // Đếm followers - xử lý cả array of IDs và array of populated objects
    if (user.bloggerStats.followers) {
      const followers = user.bloggerStats.followers;
      // Nếu đã populate, mỗi item là object với _id
      // Nếu chưa populate, mỗi item là ObjectId
      user.bloggerStats.followersCount = Array.isArray(followers) 
        ? followers.filter(f => f != null).length  // Lọc null/undefined
        : 0;
    } else {
      user.bloggerStats.followersCount = 0;
    }
  }
  
  if (user.readerStats) {
    // Đếm following - xử lý cả array of IDs và array of populated objects
    if (user.readerStats.following) {
      const following = user.readerStats.following;
      user.readerStats.followingCount = Array.isArray(following)
        ? following.filter(f => f != null).length  // Lọc null/undefined
        : 0;
    } else {
      user.readerStats.followingCount = 0;
    }
  }
  
  return user;
};

class UserController {
  // Lấy profile của user hiện tại
  static async getProfile(req, res) {
    try {
      const user = await User.findById(req.user._id)
        .populate("readerStats.following", "username profile")
        .populate("bloggerStats.followers", "username profile")
        .populate("bloggerStats.following", "username profile");

      // Convert _id thành id và thêm followersCount
      let userData = cleanUserData(user);
      userData = addFollowersCount(userData);
      
      if (!userData.id && userData._id) {
        userData.id = userData._id.toString();
      }

      return ResponseHelper.success(
        res,
        {
          user: userData,
        },
        "Lấy profile thành công"
      );
    } catch (error) {
      console.error("Get profile error:", error);
      return ResponseHelper.serverError(res, "Lỗi lấy profile", error);
    }
  }

  // Lấy profile của user khác (public)
  static async getUserProfile(req, res) {
    try {
      const { userId } = req.params;

      const user = await User.findById(userId)
        .select("-password -settings") // Không trả về password và settings
        .populate("readerStats.following", "username profile")
        .populate("bloggerStats.followers", "username profile")
        .populate("bloggerStats.following", "username profile");

      if (!user) {
        return ResponseHelper.notFound(res, "Người dùng không tồn tại");
      }

      // Convert _id thành id và thêm followersCount
      let userData = cleanUserData(user);
      userData = addFollowersCount(userData);
      
      if (!userData.id && userData._id) {
        userData.id = userData._id.toString();
      }

      return ResponseHelper.success(
        res,
        {
          user: userData,
        },
        "Lấy thông tin người dùng thành công"
      );
    } catch (error) {
      console.error("Get user profile error:", error);
      return ResponseHelper.serverError(res, "Lỗi lấy thông tin người dùng", error);
    }
  }

  // Cập nhật avatar riêng
  static async updateAvatar(req, res) {
    try {
      const userId = req.user._id;
      const { avatar } = req.body;

      if (!avatar) {
        return ResponseHelper.error(res, "Avatar URL là bắt buộc", 400);
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { $set: { "profile.avatar": avatar } },
        { new: true, runValidators: true }
      );

      if (!user) {
        return ResponseHelper.notFound(res, "User không tồn tại");
      }

      return ResponseHelper.success(
        res,
        {
          avatar: user.profile.avatar,
        },
        "Cập nhật avatar thành công"
      );
    } catch (error) {
      console.error("Update avatar error:", error);
      return ResponseHelper.serverError(res, "Lỗi cập nhật avatar", error);
    }
  }

  // Cập nhật profile (không bao gồm avatar)
  static async updateProfile(req, res) {
    try {
      const userId = req.user._id;
      const updates = req.body;

      // Chỉ cho phép update các field được phép (bỏ avatar)
      const allowedUpdates = [
        "profile.displayName",
        "profile.bio",
        "settings.emailNotifications",
        "settings.publicProfile",
        "settings.showEarnings",
      ];

      // Hỗ trợ cả dạng flat từ client (displayName, bio)
      const updateObj = {};

      // Map flat fields to nested profile.*
      if (typeof updates.displayName !== "undefined") {
        updateObj["profile.displayName"] = updates.displayName;
      }
      if (typeof updates.bio !== "undefined") {
        updateObj["profile.bio"] = updates.bio;
      }
      if (typeof updates["settings.emailNotifications"] !== "undefined") {
        updateObj["settings.emailNotifications"] =
          updates["settings.emailNotifications"];
      }
      if (typeof updates["settings.publicProfile"] !== "undefined") {
        updateObj["settings.publicProfile"] = updates["settings.publicProfile"];
      }
      if (typeof updates["settings.showEarnings"] !== "undefined") {
        updateObj["settings.showEarnings"] = updates["settings.showEarnings"];
      }

      // Also accept already-nested keys if provided
      Object.keys(updates).forEach((key) => {
        if (allowedUpdates.includes(key)) {
          updateObj[key] = updates[key];
        }
      });

      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateObj },
        { new: true, runValidators: true }
      );

      if (!user) {
        return ResponseHelper.notFound(res, "User không tồn tại");
      }

      return ResponseHelper.success(
        res,
        {
          user: cleanUserData(user),
        },
        "Cập nhật profile thành công"
      );
    } catch (error) {
      console.error("Update profile error:", error);
      return ResponseHelper.serverError(res, "Lỗi cập nhật profile", error);
    }
  }

  // Lấy thống kê user
  static async getStats(req, res) {
    try {
      const user = req.user;

      let stats = {};

      if (user.role === "blogger") {
        stats = {
          // totalEarnings và totalTipsReceived đã xóa - frontend sẽ lấy từ blockchain
          totalBlogs: user.bloggerStats.totalArticles,
          followersCount: user.bloggerStats.followers.length,
        };
      } else {
        stats = {
          // totalTipsSent và totalAmountTipped đã xóa - frontend sẽ lấy từ blockchain
          followingCount: user.readerStats.following.length,
        };
      }

      return ResponseHelper.success(res, { stats }, "Lấy thống kê thành công");
    } catch (error) {
      console.error("Get stats error:", error);
      return ResponseHelper.serverError(res, "Lỗi lấy thống kê", error);
    }
  }

  // Follow/Unfollow blogger
  static async toggleFollow(req, res) {
    try {
      const userId = req.user._id;
      const { bloggerId } = req.params;

      if (userId.toString() === bloggerId) {
        return ResponseHelper.error(res, "Không thể follow chính mình", 400);
      }

      const [user, blogger] = await Promise.all([
        User.findById(userId),
        User.findById(bloggerId),
      ]);

      if (!blogger) {
        return ResponseHelper.notFound(res, "Blogger không tồn tại");
      }

      if (blogger.role !== "blogger") {
        return ResponseHelper.error(res, "Chỉ có thể follow blogger", 400);
      }

      // Kiểm tra xem user đã follow chưa (hỗ trợ cả reader và blogger)
      let isFollowing = false;
      let followingArray = null;

      if (user.role === "reader") {
        followingArray = user.readerStats.following;
        isFollowing = followingArray.includes(bloggerId);
      } else if (user.role === "blogger") {
        // Blogger cũng có thể follow, lưu vào bloggerStats.following
        if (!user.bloggerStats.following) {
          user.bloggerStats.following = [];
        }
        followingArray = user.bloggerStats.following;
        isFollowing = followingArray.includes(bloggerId);
      }

      if (isFollowing) {
        // Unfollow
        followingArray.pull(bloggerId);
        blogger.bloggerStats.followers.pull(userId);
      } else {
        // Follow
        followingArray.push(bloggerId);
        blogger.bloggerStats.followers.push(userId);
      }

      await Promise.all([user.save(), blogger.save()]);

      return ResponseHelper.success(
        res,
        {
          isFollowing: !isFollowing,
          followersCount: blogger.bloggerStats.followers.length,
        },
        isFollowing ? "Bỏ theo dõi thành công" : "Theo dõi thành công"
      );
    } catch (error) {
      console.error("Toggle follow error:", error);
      return ResponseHelper.serverError(res, "Lỗi follow/unfollow", error);
    }
  }

  // Check follow status
  static async getFollowStatus(req, res) {
    try {
      const userId = req.user._id;
      const { bloggerId } = req.params;

      const user = await User.findById(userId);
      if (!user) {
        return ResponseHelper.notFound(res, "User không tồn tại");
      }

      let isFollowing = false;
      
      if (user.role === "reader" && user.readerStats.following) {
        isFollowing = user.readerStats.following.includes(bloggerId);
      } else if (user.role === "blogger" && user.bloggerStats.following) {
        isFollowing = user.bloggerStats.following.includes(bloggerId);
      }

      return ResponseHelper.success(res, { isFollowing });
    } catch (error) {
      console.error("Get follow status error:", error);
      return ResponseHelper.serverError(res, "Lỗi kiểm tra trạng thái follow", error);
    }
  }

  // Lấy danh sách bloggers (public)
  static async getBloggers(req, res) {
    try {
      const { page = 1, limit = 12, search = "", sort = "-bloggerStats.totalArticles" } = req.query;
      const skip = (page - 1) * limit;

      const query = {
        role: "blogger",
        isActive: true,
        "settings.publicProfile": true,
      };

      if (search) {
        query.$or = [
          { username: { $regex: search, $options: "i" } },
          { "profile.displayName": { $regex: search, $options: "i" } },
        ];
      }

      // Parse sort parameter
      // Lưu ý: totalEarnings đã bị xóa, frontend sẽ sort sau khi load blockchain data
      let sortObj = {};
      if (sort) {
        const sortFields = sort.split(',');
        for (const field of sortFields) {
          if (field.startsWith('-')) {
            sortObj[field.substring(1)] = -1;
          } else {
            sortObj[field] = 1;
          }
        }
      } else {
        // Default sort by total articles instead of earnings
        sortObj = { "bloggerStats.totalArticles": -1 };
      }

      const [bloggers, total] = await Promise.all([
        User.find(query)
          .select("username profile bloggerStats walletAddress isVerified")
          .sort(sortObj)
          .skip(skip)
          .limit(parseInt(limit)),
        User.countDocuments(query),
      ]);

      // Format bloggerStats để thêm follower count
      const formattedBloggers = bloggers.map(blogger => {
        let bloggerObj = blogger.toObject();
        bloggerObj = addFollowersCount(bloggerObj);
        return bloggerObj;
      });

      const pagination = {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      };

      return ResponseHelper.paginated(
        res,
        formattedBloggers,
        pagination,
        "Lấy danh sách bloggers thành công"
      );
    } catch (error) {
      console.error("Get bloggers error:", error);
      return ResponseHelper.serverError(
        res,
        "Lỗi lấy danh sách bloggers",
        error
      );
    }
  }

  // Cập nhật địa chỉ ví blockchain (cho cả reader và blogger)
  static async updateWallet(req, res) {
    try {
      const userId = req.user._id;
      const { walletAddress } = req.body;

      // Validate wallet address format
      if (!walletAddress || !walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
        return ResponseHelper.error(res, "Địa chỉ ví không hợp lệ", 400);
      }

      // Check if wallet already used by another account
      const exists = await User.findOne({
        walletAddress: walletAddress.toLowerCase(),
        _id: { $ne: userId },
      });
      
      if (exists) {
        return ResponseHelper.conflict(
          res,
          "Địa chỉ ví đã được sử dụng bởi tài khoản khác"
        );
      }

      // Update wallet address
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: { walletAddress: walletAddress.toLowerCase() } },
        { new: true }
      );

      return ResponseHelper.success(
        res,
        { user: cleanUserData(user) },
        "Cập nhật địa chỉ ví thành công"
      );
    } catch (error) {
      console.error("Update wallet error:", error);
      return ResponseHelper.serverError(res, "Lỗi cập nhật địa chỉ ví", error);
    }
  }

  // Đổi mật khẩu
  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user._id;

      // Validate input
      if (!currentPassword || !newPassword) {
        return ResponseHelper.error(
          res,
          "Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới",
          400
        );
      }

      if (newPassword.length < 6) {
        return ResponseHelper.error(
          res,
          "Mật khẩu mới phải có ít nhất 6 ký tự",
          400
        );
      }

      // Get user with password
      const user = await User.findById(userId).select("+password");

      if (!user.password) {
        return ResponseHelper.error(
          res,
          "Tài khoản này không sử dụng mật khẩu (đăng nhập qua Google/Wallet)",
          400
        );
      }

      // Verify current password
      const isValidPassword = await user.comparePassword(currentPassword);
      if (!isValidPassword) {
        return ResponseHelper.unauthorized(res, "Mật khẩu hiện tại không đúng");
      }

      // Update password
      user.password = newPassword;
      await user.save();

      return ResponseHelper.success(res, null, "Đổi mật khẩu thành công");
    } catch (error) {
      console.error("Change password error:", error);
      return ResponseHelper.serverError(res, "Lỗi đổi mật khẩu", error);
    }
  }

  // Cập nhật settings
  static async updateSettings(req, res) {
    try {
      const userId = req.user._id;
      const { emailNotifications, publicProfile, showEarnings } = req.body;

      const updateObj = {};
      if (typeof emailNotifications === "boolean") {
        updateObj["settings.emailNotifications"] = emailNotifications;
      }
      if (typeof publicProfile === "boolean") {
        updateObj["settings.publicProfile"] = publicProfile;
      }
      if (typeof showEarnings === "boolean") {
        updateObj["settings.showEarnings"] = showEarnings;
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateObj },
        { new: true }
      );

      return ResponseHelper.success(
        res,
        { settings: user.settings },
        "Cập nhật cài đặt thành công"
      );
    } catch (error) {
      console.error("Update settings error:", error);
      return ResponseHelper.serverError(res, "Lỗi cập nhật cài đặt", error);
    }
  }
}

module.exports = UserController;
