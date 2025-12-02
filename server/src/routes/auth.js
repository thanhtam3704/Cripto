const express = require("express");
const passport = require("passport");
const AuthController = require("../controllers/authController");
const { authenticateToken } = require("../middleware/auth");
const {
  validateUserRegistration,
  validateUserLogin,
  validateWalletLogin,
} = require("../utils/validation");
const { generateToken } = require("../utils/jwt");

const router = express.Router();

// POST /api/auth/register - Đăng ký
router.post("/register", validateUserRegistration, AuthController.register);

// POST /api/auth/login - Đăng nhập email/password
router.post("/login", validateUserLogin, AuthController.login);

// POST /api/auth/wallet-login - Đăng nhập wallet
router.post("/wallet-login", validateWalletLogin, AuthController.walletLogin);

// GET /api/auth/wallet-nonce/:walletAddress - Lấy nonce cho wallet
router.get("/wallet-nonce/:walletAddress", AuthController.getWalletNonce);

// POST /api/auth/logout - Đăng xuất
router.post("/logout", AuthController.logout);

// GET /api/auth/verify - Verify token
router.get("/verify", authenticateToken, AuthController.verifyToken);

// GET /api/auth/verify-email/:token - Xác thực email
router.get("/verify-email/:token", AuthController.verifyEmail);

// POST /api/auth/resend-verification - Gửi lại email xác thực
router.post("/resend-verification", AuthController.resendVerificationEmail);

// Google OAuth routes
// GET /api/auth/google - Khởi tạo Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// GET /api/auth/google/callback - Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed`,
  }),
  async (req, res) => {
    try {
      if (!req.user || !req.user._id) {
        console.error("❌ Google callback user missing");
        return res.redirect(
          `${process.env.CLIENT_URL}/login?error=callback_no_user`
        );
      }
      // Tạo JWT token cho user
      const token = generateToken(req.user._id);

      // Redirect về frontend với token
      const userPayload = req.user.fullProfile
        ? req.user.fullProfile
        : {
            _id: req.user._id,
            email: req.user.email,
            username: req.user.username,
            profile: req.user.profile,
            role: req.user.role,
          };
      res.redirect(
        `${
          process.env.CLIENT_URL
        }/auth/callback?token=${token}&user=${encodeURIComponent(
          JSON.stringify(userPayload)
        )}`
      );
    } catch (error) {
      console.error("❌ Google callback error:", error);
      res.redirect(`${process.env.CLIENT_URL}/login?error=callback_failed`);
    }
  }
);

module.exports = router;
