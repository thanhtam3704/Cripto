/**
 * Validation middleware cho các routes
 */

const { body, validationResult } = require('express-validator');

/**
 * Middleware kiểm tra kết quả validation
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

/**
 * Validation cho đăng ký user
 */
const validateUserRegistration = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
  
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username phải có từ 3-30 ký tự')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username chỉ được chứa chữ cái, số và dấu gạch dưới'),
  
  body('role')
    .optional()
    .isIn(['blogger', 'reader'])
    .withMessage('Role phải là blogger hoặc reader'),
  
  body('displayName')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Tên hiển thị không được quá 100 ký tự'),
  
  handleValidationErrors
];

/**
 * Validation cho đăng nhập user
 */
const validateUserLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Mật khẩu không được để trống'),
  
  handleValidationErrors
];

/**
 * Validation cho đăng nhập bằng ví
 */
const validateWalletLogin = [
  body('walletAddress')
    .trim()
    .matches(/^0x[a-fA-F0-9]{40}$/)
    .withMessage('Địa chỉ ví không hợp lệ'),
  
  body('signature')
    .notEmpty()
    .withMessage('Signature không được để trống'),
  
  body('message')
    .notEmpty()
    .withMessage('Message không được để trống'),
  
  handleValidationErrors
];

/**
 * Validation cho cập nhật profile
 */
const validateProfileUpdate = [
  body('displayName')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Tên hiển thị không được quá 100 ký tự'),
  
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio không được quá 500 ký tự'),
  
  body('avatar')
    .optional()
    .trim()
    .isURL()
    .withMessage('Avatar phải là URL hợp lệ'),
  
  handleValidationErrors
];

/**
 * Validation cho tạo blog
 */
const validateBlogCreation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Tiêu đề không được để trống')
    .isLength({ max: 200 })
    .withMessage('Tiêu đề không được quá 200 ký tự'),
  
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Nội dung không được để trống')
    .isLength({ min: 100 })
    .withMessage('Nội dung phải có ít nhất 100 ký tự'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Mô tả không được quá 500 ký tự'),
  
  body('thumbnail')
    .optional()
    .trim()
    .isURL()
    .withMessage('Thumbnail phải là URL hợp lệ'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags phải là một mảng'),
  
  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Mỗi tag không được quá 30 ký tự'),
  
  handleValidationErrors
];

/**
 * Validation cho tip
 */
const validateTip = [
  body('amount')
    .isFloat({ min: 0.000001 })
    .withMessage('Số tiền tip phải lớn hơn 0'),
  
  body('txHash')
    .trim()
    .matches(/^0x[a-fA-F0-9]{64}$/)
    .withMessage('Transaction hash không hợp lệ'),
  
  body('message')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Tin nhắn không được quá 200 ký tự'),
  
  handleValidationErrors
];

/**
 * Validation cho pagination
 */
const { query } = require('express-validator');

const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page phải là số nguyên dương'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit phải là số nguyên từ 1-100'),
  
  // Bỏ validation cho sort vì controller đã handle parse an toàn
  // và cần support multiple sort fields separated by comma
  
  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateWalletLogin,
  validateProfileUpdate,
  validateBlogCreation,
  validateTip,
  validatePagination,
  handleValidationErrors
};
