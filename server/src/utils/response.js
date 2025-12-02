// Utility functions để tạo response nhất quán

class ResponseHelper {
  // Response thành công
  static success(res, data = null, message = 'Thành công', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  }
  
  // Response lỗi
  static error(res, message = 'Có lỗi xảy ra', statusCode = 500, errors = null) {
    const response = {
      success: false,
      message,
      timestamp: new Date().toISOString()
    };
    
    if (errors) {
      response.errors = errors;
    }
    
    return res.status(statusCode).json(response);
  }
  
  // Response cho pagination
  static paginated(res, data, pagination, message = 'Thành công') {
    return res.json({
      success: true,
      message,
      data,
      pagination,
      timestamp: new Date().toISOString()
    });
  }
  
  // Response cho validation errors
  static validationError(res, errors) {
    return this.error(res, 'Dữ liệu không hợp lệ', 400, errors);
  }
  
  // Response cho unauthorized
  static unauthorized(res, message = 'Không có quyền truy cập') {
    return this.error(res, message, 401);
  }
  
  // Response cho forbidden
  static forbidden(res, message = 'Bị cấm truy cập') {
    return this.error(res, message, 403);
  }
  
  // Response cho not found
  static notFound(res, message = 'Không tìm thấy') {
    return this.error(res, message, 404);
  }
  
  // Response cho conflict
  static conflict(res, message = 'Xung đột dữ liệu') {
    return this.error(res, message, 409);
  }
  
  // Response cho server error
  static serverError(res, message = 'Lỗi máy chủ', error = null) {
    console.error('Server error:', error);
    
    if (process.env.NODE_ENV === 'development' && error) {
      return this.error(res, message, 500, { stack: error.stack });
    }
    
    return this.error(res, message, 500);
  }
}

// Helper function để tạo pagination metadata
const createPaginationMeta = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    currentPage: parseInt(page),
    totalPages,
    totalItems: total,
    itemsPerPage: parseInt(limit),
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null
  };
};

// Helper function để clean user data (remove sensitive info)
const cleanUserData = (user) => {
  const cleaned = user.toObject ? user.toObject() : user;
  delete cleaned.password;
  return cleaned;
};

// Helper function để format number
const formatNumber = (number, decimals = 2) => {
  return parseFloat(number).toFixed(decimals);
};

// Helper function để convert Wei to Ether
const weiToEther = (wei) => {
  const Web3 = require('web3');
  const web3 = new Web3();
  return web3.utils.fromWei(wei.toString(), 'ether');
};

// Helper function để convert Ether to Wei
const etherToWei = (ether) => {
  const Web3 = require('web3');
  const web3 = new Web3();
  return web3.utils.toWei(ether.toString(), 'ether');
};

module.exports = {
  ResponseHelper,
  createPaginationMeta,
  cleanUserData,
  formatNumber,
  weiToEther,
  etherToWei
};