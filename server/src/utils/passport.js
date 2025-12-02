const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

// Serialize user cho session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user từ session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("🔍 Google Profile:", profile);

        // Kiểm tra user đã tồn tại với Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          const hasCustomAvatar = user.profile.avatar && user.profile.avatar.includes('cloudinary.com');
          
          if (!hasCustomAvatar) {
            // Chưa có avatar tùy chỉnh, dùng avatar từ Google
            user.profile.avatar = profile.photos[0]?.value || user.profile.avatar;
          }
          // Nếu đã có custom avatar thì GIỮ NGUYÊN, không ghi đè
          
          user.lastLogin = new Date();
          await user.save();

          console.log("✅ Existing Google user logged in:", user.email);
          return done(null, user);
        }

        // Lấy email an toàn (có thể null nếu Google không trả về)
        const primaryEmail =
          Array.isArray(profile.emails) && profile.emails[0]
            ? profile.emails[0].value
            : null;

        // Kiểm tra user đã tồn tại với email (nếu có email)
        if (primaryEmail) {
          user = await User.findOne({ email: primaryEmail });
        }

        if (user) {
          // User tồn tại với email này, liên kết với Google account
          user.googleId = profile.id;
          user.provider = "google";
          
          // CHỈ cập nhật avatar nếu user chưa có avatar tùy chỉnh
          const hasCustomAvatar = user.profile.avatar && user.profile.avatar.includes('cloudinary.com');
          
          if (!hasCustomAvatar) {
            user.profile.avatar =
              (Array.isArray(profile.photos) && profile.photos[0]?.value) ||
              user.profile.avatar;
          }
          
          user.lastLogin = new Date();
          await user.save();

          console.log("🔗 Linked existing account with Google:", user.email);
          return done(null, user);
        }

        // Tạo user mới
        const newUser = new User({
          googleId: profile.id,
          provider: "google",
          email: primaryEmail,
          username:
            (primaryEmail
              ? primaryEmail.split("@")[0]
              : profile.username || profile.id) +
            "_" +
            Date.now(), // Tạo username unique
          profile: {
            displayName:
              profile.displayName || profile.name?.givenName || "User",
            avatar:
              (Array.isArray(profile.photos) && profile.photos[0]?.value) ||
              null,
          },
          role: "reader",
          isVerified: true, // Google accounts đã verified
          lastLogin: new Date(),
        });

        await newUser.save();
        console.log("🆕 New Google user created:", newUser.email);

        return done(null, newUser);
      } catch (error) {
        console.error("❌ Google OAuth Error:", error);
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
