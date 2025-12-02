const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    // Tạo transporter - dùng Gmail hoặc SMTP service khác
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Email của bạn
        pass: process.env.EMAIL_PASSWORD // App password của Gmail
      }
    });
  }

  // Gửi email xác thực
  async sendVerificationEmail(email, username, verificationToken) {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
    
    const mailOptions = {
      from: `"Crypto Tip Platform" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🎉 Xác thực tài khoản của bạn',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: white;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .button {
              display: inline-block;
              padding: 15px 30px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Chào mừng đến với Crypto Tip!</h1>
            </div>
            <div class="content">
              <p>Xin chào <strong>${username}</strong>,</p>
              
              <p>Cảm ơn bạn đã đăng ký tài khoản! Chỉ còn một bước nữa để hoàn tất.</p>
              
              <p>Vui lòng click vào nút bên dưới để xác thực email của bạn:</p>
              
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">
                  ✅ Xác Thực Email
                </a>
              </div>
              
              <p style="margin-top: 30px; color: #666; font-size: 14px;">
                Hoặc copy link sau vào trình duyệt:<br>
                <code style="background: #f5f5f5; padding: 10px; display: block; margin-top: 10px; word-break: break-all;">
                  ${verificationUrl}
                </code>
              </p>
              
              <p style="margin-top: 30px; color: #666; font-size: 14px;">
                ⏰ Link này sẽ hết hạn sau <strong>24 giờ</strong>.
              </p>
              
              <p style="margin-top: 20px; color: #999; font-size: 12px;">
                ⚠️ Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email này.
              </p>
            </div>
            <div class="footer">
              <p>© 2025 Crypto Tip Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Email send error:', error);
      throw error;
    }
  }

  // Gửi email reset password (có thể dùng sau)
  async sendPasswordResetEmail(email, username, resetToken) {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    
    const mailOptions = {
      from: `"Crypto Tip Platform" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🔐 Đặt lại mật khẩu',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #ef4444; color: white; padding: 20px; text-align: center; }
            .content { background: white; padding: 30px; }
            .button { display: inline-block; padding: 15px 30px; background: #ef4444; color: white; text-decoration: none; border-radius: 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Đặt lại mật khẩu</h1>
            </div>
            <div class="content">
              <p>Xin chào <strong>${username}</strong>,</p>
              <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
              <p>Click vào nút bên dưới để đặt lại mật khẩu:</p>
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Đặt Lại Mật Khẩu</a>
              </div>
              <p style="margin-top: 20px; color: #666;">Link này sẽ hết hạn sau 1 giờ.</p>
              <p style="color: #999; font-size: 12px;">Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Password reset email error:', error);
      throw error;
    }
  }

  // Test email configuration
  async testEmailConfig() {
    try {
      await this.transporter.verify();
      console.log('✅ Email server is ready to send emails');
      return true;
    } catch (error) {
      console.error('❌ Email server error:', error);
      return false;
    }
  }
}

module.exports = new EmailService();
