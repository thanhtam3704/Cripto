const User = require("../models/User");
const { ResponseHelper } = require("../utils/response");
const {
  generateToken,
  verifyWalletSignature,
  generateSignatureMessage,
} = require("../utils/jwt");
const crypto = require("crypto");
const emailService = require("../utils/email");

class AuthController {
  // Đăng ký user mới
  static async register(req, res) {
    try {
      let { username, email, password, role = "reader" } = req.body;

      // Tự động tạo username từ email nếu không có
      if (!username) {
        username = email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "_");

        // Đảm bảo username unique bằng cách thêm random suffix
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
          username = `${username}_${Math.floor(Math.random() * 10000)}`;
        }
      }

      // Kiểm tra user đã tồn tại
      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });

      if (existingUser) {
        if (existingUser.email === email) {
          return ResponseHelper.conflict(res, "Email đã được sử dụng");
        }
        if (existingUser.username === username) {
          return ResponseHelper.conflict(res, "Username đã được sử dụng");
        }
      }

      // Tạo verification token (24 giờ)
      const verificationToken = crypto.randomBytes(32).toString("hex");
      const verificationTokenExpires = new Date(
        Date.now() + 24 * 60 * 60 * 1000
      ); // 24 giờ

      // Tạo user mới
      const user = new User({
        username,
        email,
        password,
        role,
        verificationToken,
        verificationTokenExpires,
        isVerified: false, // Chưa verify
      });

      await user.save();

      // Gửi email xác thực
      try {
        await emailService.sendVerificationEmail(
          email,
          username,
          verificationToken
        );
        console.log("Verification email sent to:", email);
      } catch (emailError) {
        console.error("❌ Failed to send verification email:", emailError);

      }

      return ResponseHelper.success(
        res,
        {
          email: user.email,
          message: "Vui lòng kiểm tra email để xác thực tài khoản",
        },
        "Đăng ký thành công! Kiểm tra email của bạn.",
        201
      );
    } catch (error) {
      console.error("Register error:", error);
      return ResponseHelper.serverError(res, "Lỗi đăng ký", error);
    }
  }

  // Đăng nhập bằng email/password
  static async login(req, res) {
    try {
      const { email, password, remember = false } = req.body;

      // Tìm user
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return ResponseHelper.unauthorized(
          res,
          "Email hoặc mật khẩu không đúng"
        );
      }

      // Kiểm tra password
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return ResponseHelper.unauthorized(
          res,
          "Email hoặc mật khẩu không đúng"
        );
      }

      // Kiểm tra email đã xác thực chưa
      if (!user.isVerified) {
        return ResponseHelper.forbidden(
          res,
          "Vui lòng xác thực email trước khi đăng nhập. Kiểm tra hộp thư của bạn."
        );
      }

      // Kiểm tra tài khoản có bị khóa
      if (!user.isActive) {
        return ResponseHelper.forbidden(res, "Tài khoản đã bị vô hiệu hóa");
      }

      // Cập nhật last login
      user.lastLogin = new Date();
      await user.save();

      // Tạo token
      const token = generateToken(user._id, remember);

      return ResponseHelper.success(
        res,
        {
          user: user.fullProfile,
          token,
        },
        "Đăng nhập thành công"
      );
    } catch (error) {
      console.error("Login error:", error);
      return ResponseHelper.serverError(res, "Lỗi đăng nhập", error);
    }
  }

  // Đăng nhập bằng wallet
  static async walletLogin(req, res) {
    try {
      const { walletAddress, signature, message } = req.body;

      // Verify signature
      const isValidSignature = verifyWalletSignature(
        message,
        signature,
        walletAddress
      );
      if (!isValidSignature) {
        return ResponseHelper.unauthorized(res, "Chữ ký wallet không hợp lệ");
      }

      // Tìm hoặc tạo user với wallet address
      let user = await User.findOne({
        walletAddress: walletAddress.toLowerCase(),
      });

      if (!user) {
        // Tạo user mới với wallet
        user = new User({
          username: `user_${walletAddress.slice(-6)}`,
          email: `${walletAddress.toLowerCase()}@wallet.local`,
          walletAddress: walletAddress.toLowerCase(),
          role: "reader",
          profile: {
            displayName: `User ${walletAddress.slice(
              0,
              6
            )}...${walletAddress.slice(-4)}`,
          },
          isVerified: true, // Wallet users tự động verified
        });
        await user.save();
      }

      // Kiểm tra tài khoản
      if (!user.isActive) {
        return ResponseHelper.forbidden(res, "Tài khoản đã bị vô hiệu hóa");
      }

      // Cập nhật last login
      user.lastLogin = new Date();
      await user.save();

      // Tạo token
      const token = generateToken(user._id);

      return ResponseHelper.success(
        res,
        {
          user: user.fullProfile,
          token,
          isNewUser: !user.email, 
        },
        "Đăng nhập wallet thành công"
      );
    } catch (error) {
      console.error("Wallet login error:", error);
      return ResponseHelper.serverError(res, "Lỗi đăng nhập wallet", error);
    }
  }

  static async getWalletNonce(req, res) {
    try {
      const { walletAddress } = req.params;

      if (!walletAddress || !walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
        return ResponseHelper.error(res, "Wallet address không hợp lệ", 400);
      }

      const nonce = crypto.randomBytes(16).toString("hex");
      const message = generateSignatureMessage(walletAddress, nonce);

      return ResponseHelper.success(
        res,
        {
          nonce,
          message,
          walletAddress,
        },
        "Nonce được tạo thành công"
      );
    } catch (error) {
      console.error("Get wallet nonce error:", error);
      return ResponseHelper.serverError(res, "Lỗi tạo nonce", error);
    }
  }

  // Logout
  static async logout(req, res) {
    try {
      return ResponseHelper.success(res, null, "Đăng xuất thành công");
    } catch (error) {
      console.error("Logout error:", error);
      return ResponseHelper.serverError(res, "Lỗi đăng xuất", error);
    }
  }

  // Verify token (check auth status)
  static async verifyToken(req, res) {
    try {
      const user = await User.findById(req.user._id).select('-password');
      
      return ResponseHelper.success(
        res,
        {
          user: user.fullProfile,
        },
        "Token hợp lệ"
      );
    } catch (error) {
      console.error("Verify token error:", error);
      return ResponseHelper.serverError(res, "Lỗi verify token", error);
    }
  }

  // Xác thực email
  static async verifyEmail(req, res) {
    try {
      const { token } = req.params;

      // Tìm user với token và còn hạn
      const user = await User.findOne({
        verificationToken: token,
        verificationTokenExpires: { $gt: Date.now() },
      });

      if (!user) {
        return ResponseHelper.error(
          res,
          "Link xác thực không hợp lệ hoặc đã hết hạn",
          400
        );
      }

      // Đã verify rồi
      if (user.isVerified) {
        return ResponseHelper.success(
          res,
          { alreadyVerified: true },
          "Email đã được xác thực trước đó"
        );
      }

      // Xác thực email
      user.isVerified = true;
      user.verificationToken = null;
      user.verificationTokenExpires = null;
      await user.save();

      // Tạo token để tự động đăng nhập
      const authToken = generateToken(user._id);

      return ResponseHelper.success(
        res,
        {
          user: user.fullProfile,
          token: authToken,
        },
        "Xác thực email thành công! Bạn đã có thể đăng nhập."
      );
    } catch (error) {
      console.error("Verify email error:", error);
      return ResponseHelper.serverError(res, "Lỗi xác thực email", error);
    }
  }

  // Gửi lại email xác thực
  static async resendVerificationEmail(req, res) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return ResponseHelper.notFound(res, "Không tìm thấy tài khoản");
      }

      if (user.isVerified) {
        return ResponseHelper.success(
          res,
          { alreadyVerified: true },
          "Email đã được xác thực"
        );
      }

      // Tạo token mới
      const verificationToken = crypto.randomBytes(32).toString("hex");
      const verificationTokenExpires = new Date(
        Date.now() + 24 * 60 * 60 * 1000
      );

      user.verificationToken = verificationToken;
      user.verificationTokenExpires = verificationTokenExpires;
      await user.save();

      // Gửi lại email
      try {
        await emailService.sendVerificationEmail(
          user.email,
          user.username,
          verificationToken
        );
        return ResponseHelper.success(
          res,
          null,
          "Email xác thực đã được gửi lại. Vui lòng kiểm tra hộp thư."
        );
      } catch (emailError) {
        console.error("Failed to resend verification email:", emailError);
        return ResponseHelper.serverError(
          res,
          "Không thể gửi email. Vui lòng thử lại sau."
        );
      }
    } catch (error) {
      console.error("Resend verification error:", error);
      return ResponseHelper.serverError(
        res,
        "Lỗi gửi lại email xác thực",
        error
      );
    }
  }
}

module.exports = AuthController;
