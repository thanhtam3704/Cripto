const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.walletAddress && !this.googleId; // Password bắt buộc nếu không có wallet và không phải Google OAuth
      },
      minlength: 6,
    },
    // OAuth fields
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Cho phép null values
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    walletAddress: {
      type: String,
      unique: true,
      sparse: true, // Cho phép null values và vẫn giữ unique
      trim: true,
    },
    role: {
      type: String,
      enum: ["reader", "blogger", "admin"],
      default: "reader",
    },
    profile: {
      displayName: {
        type: String,
        trim: true,
        maxlength: 50,
      },
      avatar: {
        type: String, // URL của avatar
        default: null,
      },
      bio: {
        type: String,
        maxlength: 500,
      },
    },
    // Thống kê cho bloggers (bloggers)
    bloggerStats: {
      totalArticles: {
        type: Number,
        default: 0,
      },
      totalArticleViews: {
        type: Number,
        default: 0,
      },
      followers: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      following: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    // Thống kê cho readers
    readerStats: {
      // totalTipsSent và totalAmountTipped đã bị xóa - lấy từ blockchain thay thế
      articlesRead: {
        type: Number,
        default: 0,
      },
      bookmarkedArticles: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Article",
        },
      ],
      following: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    // Cài đặt tài khoản
    settings: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      publicProfile: {
        type: Boolean,
        default: true,
      },
      showEarnings: {
        type: Boolean,
        default: false,
      },
    },
    // Trạng thái tài khoản
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: null,
    },
    verificationTokenExpires: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password trước khi lưu
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// So sánh password
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Tạo display name từ username nếu chưa có
userSchema.pre("save", function (next) {
  if (!this.profile.displayName && this.username) {
    this.profile.displayName = this.username;
  }
  next();
});

// Virtual cho full profile
userSchema.virtual("fullProfile").get(function () {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    walletAddress: this.walletAddress,
    role: this.role,
    profile: this.profile,
    stats: this.role === "blogger" ? this.bloggerStats : this.readerStats,
    settings: this.settings,
    isVerified: this.isVerified,
    createdAt: this.createdAt,
    lastLogin: this.lastLogin,
  };
});

// Index cho tìm kiếm (bỏ qua các field đã có unique: true)
userSchema.index({ role: 1 });

module.exports = mongoose.model("User", userSchema);
