const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Tạo JWT token cho user
const generateToken = (userId, remember = false) => {
  const payload = {
    userId: userId,
    timestamp: Date.now()
  };
  
  const options = {
    expiresIn: remember ? '30d' : '24h',
    issuer: 'crypto-tip-system',
    subject: userId.toString()
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

// Tạo refresh token
const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString('hex');
};

// Xác minh token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw error;
  }
};

// Lấy thông tin từ token mà không xác minh
const decodeToken = (token) => {
  try {
    return jwt.decode(token, { complete: true });
  } catch (error) {
    return null;
  }
};

// Tạo message cho wallet signature
const generateSignatureMessage = (address, nonce) => {
  return `Chào mừng đến với Crypto Tipping System!

Đăng nhập vào tài khoản của bạn với wallet address:
${address}

Nonce: ${nonce}

Thời gian: ${new Date().toISOString()}`;
};

// Xác minh wallet signature
const verifyWalletSignature = (message, signature, address) => {
  try {
    const Web3 = require('web3');
    const web3 = new Web3();
    
    const recoveredAddress = web3.eth.accounts.recover(message, signature);
    return recoveredAddress.toLowerCase() === address.toLowerCase();
  } catch (error) {
    console.error('Verify wallet signature error:', error);
    return false;
  }
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  decodeToken,
  generateSignatureMessage,
  verifyWalletSignature
};